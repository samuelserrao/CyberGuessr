import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, CheckCircle, Info } from 'lucide-react';

import Navbar from './components/Navbar';
import GlobeBackground from './components/GlobeBackground';

// Pages
import Login from './pages/Login';
import Landing from './pages/Landing';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

// Hooks & Mock Data
import useTheme from './hooks/useTheme';
import { api } from './utils/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setTab] = useState('landing');
  const [gameMode, setGameMode] = useState('standard');
  const [userProfile, setUserProfile] = useState(null);
  const [theme, toggleTheme] = useTheme();
  
  // Game & System Preferences
  const [settings, setSettings] = useState({
    sound: true,
    mapTheme: 'tactical',
    timerLimit: 60
  });

  // Floating Toast Notification system
  const [toasts, setToasts] = useState([]);

  // Check for existing session on mount and sync offline profiles to MongoDB
  useEffect(() => {
    // Sync offline user registries to MongoDB if reachable
    api.syncLocalUsers()
      .then(res => {
        if (res?.syncedUsers?.length > 0) {
          console.log(`Synced ${res.syncedUsers.length} local profiles with MongoDB:`, res.syncedUsers);
          showToast(`DATABASE SYNC: ${res.syncedUsers.length} OFFLINE ACCOUNTS LOADED TO MONGODB`, 'success');
        }
      })
      .catch(err => {
        console.warn('Automatic database sync skipped:', err.message);
      });

    const currentUserKey = localStorage.getItem('geoGuessr_currentUser');
    if (currentUserKey) {
      const users = JSON.parse(localStorage.getItem('geoGuessr_users') || '{}');
      const savedUser = users[currentUserKey];
      if (savedUser) {
        setUserProfile(savedUser);
        setIsLoggedIn(true);
        if (currentUserKey.toLowerCase() === 'admin') {
          setTab('admin');
        }
      }
    }
  }, []);

  // Persist user profile changes to localStorage & MongoDB backend
  const updateAndPersistProfile = (updater) => {
    setUserProfile(prev => {
      const newProfile = typeof updater === 'function' ? updater(prev) : updater;
      
      // Persist to localStorage
      const currentUserKey = localStorage.getItem('geoGuessr_currentUser');
      if (currentUserKey) {
        const users = JSON.parse(localStorage.getItem('geoGuessr_users') || '{}');
        users[currentUserKey] = newProfile;
        localStorage.setItem('geoGuessr_users', JSON.stringify(users));
      }

      // Persist to MongoDB backend if reachable
      if (api.isAvailable() && currentUserKey && currentUserKey.toLowerCase() !== 'admin') {
        api.updateProfile(newProfile.username, newProfile.profilePic)
          .catch(err => {
            console.error("Failed to sync profile changes to MongoDB server:", err);
          });
      }
      
      return newProfile;
    });
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3.2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Handle login from Login page
  const handleLogin = (userData) => {
    setUserProfile(userData);
    setIsLoggedIn(true);
    const isAdmin = userData.username.toLowerCase() === 'admin';
    setTab(isAdmin ? 'admin' : 'landing');
    showToast(isAdmin ? 'WELCOME, ADMIN COMMAND!' : `WELCOME, AGENT ${userData.username.toUpperCase()}!`, 'success');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('geoGuessr_currentUser');
    setIsLoggedIn(false);
    setUserProfile(null);
    setTab('landing');
  };

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setTab('game');
    showToast(`CONNECTING SATELLITE FEED... MODE: ${mode.toUpperCase()}`, 'info');
  };

  // Add XP and match logs when rounds finish and trigger level-ups
  const handleAddXP = (xpAmount, finalScore = 0) => {
    // Persist to MongoDB backend if available
    if (api.isAvailable()) {
      const currentUserKey = localStorage.getItem('geoGuessr_currentUser');
      if (currentUserKey && currentUserKey.toLowerCase() !== 'admin') {
        api.addXP(xpAmount, finalScore, gameMode)
          .then(updatedUser => {
            if (updatedUser) {
              setUserProfile(updatedUser);
              const users = JSON.parse(localStorage.getItem('geoGuessr_users') || '{}');
              users[currentUserKey] = updatedUser;
              localStorage.setItem('geoGuessr_users', JSON.stringify(users));
            }
          })
          .catch(err => {
            console.error("Failed to sync match record with database:", err);
          });
      }
    }

    updateAndPersistProfile(prev => {
      let newXp = prev.xp + xpAmount;
      let newLevel = prev.level;
      let newXpNext = prev.xpNext;
      let leveledUp = false;

      if (newXp >= prev.xpNext) {
        newXp -= prev.xpNext;
        newLevel += 1;
        newXpNext = Math.round(prev.xpNext * 1.25);
        leveledUp = true;
      }

      if (leveledUp) {
        // Trigger sound + level up alert
        showToast(`LEVEL UP! YOU ARE NOW LEVEL ${newLevel}!`, 'success');
        // Synthesise level up alert beep
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
          osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          osc.start();
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
          osc.stop(audioCtx.currentTime + 0.52);
        } catch (e) {
          console.warn(e);
        }
      } else {
        showToast(`MISSION COMPLETED: +${xpAmount} XP RECOVERED`, 'success');
      }

      // Calculate accuracy
      const maxPossibleScore = (gameMode === 'multiplayer' ? 3 : 5) * 5000;
      const gameAccuracy = Math.round((finalScore / maxPossibleScore) * 100);

      const newMatch = {
        id: `m_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        score: finalScore,
        mode: gameMode === 'standard' ? 'Standard Play' : gameMode === 'daily' ? 'Daily Challenge' : 'Multiplayer Clash',
        rounds: gameMode === 'multiplayer' ? 3 : 5,
        accuracy: gameAccuracy
      };

      const updatedHistory = [...(prev.matchHistory || []), newMatch];
      const newBestScore = Math.max(prev.stats?.bestScore || 0, finalScore);

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNext: newXpNext,
        matchHistory: updatedHistory,
        stats: {
          ...prev.stats,
          gamesPlayed: prev.stats.gamesPlayed + 1,
          wins: finalScore > 7500 ? prev.stats.wins + 1 : prev.stats.wins,
          bestScore: newBestScore
        }
      };
    });
  };

  // If not logged in, show login screen only
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex flex-col relative">
        <GlobeBackground />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Render active router layout
  const renderActiveTab = () => {
    switch (currentTab) {
      case 'landing':
        return <Landing setTab={setTab} startGame={handleStartGame} />;
      case 'game':
        return <Game mode={gameMode} setTab={setTab} onAddXP={handleAddXP} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile userProfile={userProfile} setUserProfile={updateAndPersistProfile} />;
      case 'settings':
        return (
          <Settings 
            userProfile={userProfile} 
            setUserProfile={updateAndPersistProfile}
            settings={settings}
            setSettings={(newPref) => {
              setSettings(newPref);
              showToast("INTERFACE PROTOCOL ADJUSTED", "info");
            }}
            onLogout={handleLogout}
          />
        );
      case 'admin':
        return <Admin />;
      default:
        return <Landing setTab={setTab} startGame={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Immersive star particle backdrop */}
      <GlobeBackground />

      {/* Main Glassmorphic navbar header */}
      <Navbar 
        currentTab={currentTab} 
        setTab={setTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Main viewport space with fluid cross-fading animations */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer System Credits */}
      <footer className="w-full py-4 border-t border-white/5 bg-black/25 text-center text-[10px] font-cyber text-gray-600 tracking-wider">
        GEO WORLD GUESSR GEOGRAPHIC RECONNAISSANCE ENGINE v0.4.15 // © 2026 DEEPMIND TEAM
      </footer>

      {/* Floating Toast Notification HUD stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl border flex items-center gap-3 backdrop-blur-md shadow-lg pointer-events-auto ${
                toast.type === 'success' 
                  ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen/35 text-cyber-neonGreen' 
                  : toast.type === 'warning'
                    ? 'bg-cyber-secondary/10 border-cyber-secondary/35 text-cyber-secondary'
                    : 'bg-cyber-cyan/10 border-cyber-cyan/35 text-cyber-cyan'
              }`}
            >
              {toast.type === 'success' ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : toast.type === 'warning' ? (
                <Trophy className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
              
              <span className="font-cyber text-xs tracking-wider font-bold">
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
