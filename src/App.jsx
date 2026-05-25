import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, CheckCircle, Info } from 'lucide-react';

import Navbar from './components/Navbar';
import GlobeBackground from './components/GlobeBackground';

// Pages
import Landing from './pages/Landing';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Hooks & Mock Data
import useTheme from './hooks/useTheme';
import { USER_PROFILE } from './utils/mockData';

export default function App() {
  const [currentTab, setTab] = useState('landing');
  const [gameMode, setGameMode] = useState('standard');
  const [userProfile, setUserProfile] = useState(USER_PROFILE);
  const [theme, toggleTheme] = useTheme();
  
  // Game & System Preferences
  const [settings, setSettings] = useState({
    sound: true,
    mapTheme: 'tactical',
    timerLimit: 60
  });

  // Floating Toast Notification system
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3.2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setTab('game');
    showToast(`CONNECTING SATELLITE FEED... MODE: ${mode.toUpperCase()}`, 'info');
  };

  // Add XP when rounds finish and trigger levels-ups
  const handleAddXP = (xpAmount) => {
    setUserProfile(prev => {
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

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNext: newXpNext,
        stats: {
          ...prev.stats,
          gamesPlayed: prev.stats.gamesPlayed + 1,
          wins: xpAmount > 1500 ? prev.stats.wins + 1 : prev.stats.wins
        }
      };
    });
  };

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
        return <Profile userProfile={userProfile} />;
      case 'settings':
        return (
          <Settings 
            userProfile={userProfile} 
            setUserProfile={setUserProfile}
            settings={settings}
            setSettings={(newPref) => {
              setSettings(newPref);
              showToast("INTERFACE PROTOCOL ADJUSTED", "info");
            }}
          />
        );
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
        CYBERGUESSR GEOGRAPHIC RECONNAISSANCE ENGINE v0.4.15 // © 2026 DEEPMIND TEAM
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
