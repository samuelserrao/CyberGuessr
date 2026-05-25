import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  Award, 
  MapPin, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Globe, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

import StreetView from '../components/StreetView';
import MapPanel from '../components/MapPanel';
import { LOCATIONS } from '../utils/mockData';
import { calculateDistance, calculateScore } from '../utils/gameEngine';

// Simple Web Audio synthesizer for Cyberpunk retro sound effects
const playSound = (type, soundEnabled) => {
  if (!soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      osc.stop(audioCtx.currentTime + 0.12);
    } else if (type === 'tick') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.stop(audioCtx.currentTime + 0.06);
    } else if (type === 'success') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.stop(audioCtx.currentTime + 0.42);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(293.66, audioCtx.currentTime + 0.5); // D4
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      osc.stop(audioCtx.currentTime + 0.62);
    }
  } catch (e) {
    console.warn("Audio Context blocked or unsupported:", e);
  }
};

export default function Game({ mode, setTab, onAddXP }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('playing'); // playing, result, finished
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'daily' ? 45 : 60); // standard: 60s, daily: 45s
  
  // Game round state
  const [locationsList, setLocationsList] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [cluesUsedCount, setCluesUsedCount] = useState(0);
  const [userGuessCoord, setUserGuessCoord] = useState(null); // { lat, lng }
  const [roundStats, setRoundStats] = useState({ distance: 0, points: 0 });

  const timerRef = useRef(null);

  const maxRounds = mode === 'multiplayer' ? 3 : 5;

  // Initialize game locations list randomly
  useEffect(() => {
    // Shuffle locations list
    const shuffled = [...LOCATIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, maxRounds);
    setLocationsList(selected);
    setActiveLocation(selected[0]);
    setCurrentRound(1);
    setScore(0);
    setGameState('playing');
    setTimeLeft(mode === 'daily' ? 45 : 60);
    setCluesUsedCount(0);
    setUserGuessCoord(null);
  }, [mode, maxRounds]);

  // Handle Timer Countdown
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        
        // Play tick sound under 10 seconds
        if (prev <= 11) {
          playSound('tick', soundEnabled);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentRound, soundEnabled]);

  const handleTimeOut = () => {
    // If timer runs out, lock in an empty guess (max distance penalty)
    handleGuess(0, 0);
  };

  const handleClueUsed = () => {
    setCluesUsedCount(prev => Math.min(3, prev + 1));
    playSound('beep', soundEnabled);
  };

  // Process guess click
  const handleGuess = (lat, lng) => {
    if (gameState !== 'playing') return;

    setUserGuessCoord({ lat, lng });
    const dist = calculateDistance(lat, lng, activeLocation.lat, activeLocation.lng);
    
    // Hint deduction: deduct 15% per hint used
    let points = calculateScore(dist);
    if (cluesUsedCount > 0) {
      points = Math.round(points * (1 - cluesUsedCount * 0.15));
    }

    setRoundStats({ distance: dist, points });
    setScore(prev => prev + points);
    setGameState('result');
    playSound('success', soundEnabled);

    // Confetti on excellent guess (<150km)
    if (dist < 150) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#06b6d4', '#8b5cf6', '#ec4899']
      });
    }
  };

  const handleNextRound = () => {
    if (currentRound < maxRounds) {
      setCurrentRound(prev => prev + 1);
      setActiveLocation(locationsList[currentRound]);
      setCluesUsedCount(0);
      setUserGuessCoord(null);
      setTimeLeft(mode === 'daily' ? 45 : 60);
      setGameState('playing');
      playSound('beep', soundEnabled);
    } else {
      setGameState('finished');
      playSound('gameover', soundEnabled);
      // Confetti for game completion
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
      // Add XP to user profile (mock action)
      onAddXP(Math.round(score / 5));
    }
  };

  const resetGame = () => {
    const shuffled = [...LOCATIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, maxRounds);
    setLocationsList(selected);
    setActiveLocation(selected[0]);
    setCurrentRound(1);
    setScore(0);
    setGameState('playing');
    setTimeLeft(mode === 'daily' ? 45 : 60);
    setCluesUsedCount(0);
    setUserGuessCoord(null);
    playSound('beep', soundEnabled);
  };

  // Timer color indicator
  const getTimerColorClass = () => {
    if (timeLeft > 30) return 'text-cyber-neonGreen';
    if (timeLeft > 10) return 'text-cyber-neonYellow';
    return 'text-cyber-secondary animate-pulse';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 flex flex-col gap-6 select-none min-h-[calc(100vh-80px)]">
      
      {/* Top dashboard panel */}
      <div className="flex items-center justify-between bg-glass border border-white/10 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">GAME MODE</span>
            <span className="text-sm font-cyber font-bold text-cyber-cyan tracking-wider uppercase">{mode} CLASH</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-left">
            <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">ROUND</span>
            <span className="text-sm font-cyber font-bold text-white tracking-wider">{currentRound}/{maxRounds}</span>
          </div>
        </div>

        {/* Timer HUD */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-1.5 rounded-lg">
            <Timer className={`w-5 h-5 ${getTimerColorClass()}`} />
            <span className={`font-cyber font-bold text-base md:text-lg ${getTimerColorClass()}`}>
              {timeLeft}s
            </span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">ACCUMULATED SCORE</span>
            <span className="text-sm font-cyber font-bold text-cyber-primary text-glow-purple">{score} PTS</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* State 1: Active Playing Screen */}
        {gameState === 'playing' && activeLocation && (
          <motion.div
            key="play-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            {/* Street View Camera */}
            <div className="lg:col-span-8 h-[380px] md:h-[500px]">
              <StreetView 
                location={activeLocation} 
                onClueUsed={handleClueUsed} 
                cluesUsedCount={cluesUsedCount} 
              />
            </div>

            {/* Tactical Grid Map Selection */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <MapPanel 
                onGuess={handleGuess}
                currentRound={currentRound}
                isRoundActive={true}
                actualLocation={null}
                showResultMap={false}
                userGuessCoord={null}
              />
            </div>
          </motion.div>
        )}

        {/* State 2: Round Result Overlay Screen */}
        {gameState === 'result' && activeLocation && (
          <motion.div
            key="result-grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            {/* Left Result Card Detail */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Point scoring overlay */}
              <div className="bg-glass border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-primary/10 rounded-full blur-2xl" />
                <Award className="w-12 h-12 text-cyber-primary text-glow-purple mb-3" />
                
                <h2 className="font-cyber font-extrabold text-2xl text-white tracking-wider mb-1">
                  TARGET RESOLVED
                </h2>
                <p className="text-gray-400 text-xs font-cyber tracking-widest uppercase mb-4">
                  {activeLocation.name}, {activeLocation.country}
                </p>

                <div className="flex justify-around w-full mt-2 mb-4 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">DISTANCE</span>
                    <span className="text-lg font-cyber font-bold text-cyber-cyan text-glow-cyan">{roundStats.distance} KM</span>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">PTS AWARDED</span>
                    <span className="text-lg font-cyber font-bold text-cyber-neonGreen">{roundStats.points} PTS</span>
                  </div>
                </div>

                {cluesUsedCount > 0 && (
                  <div className="text-[10px] font-cyber text-cyber-secondary border border-cyber-secondary/30 bg-cyber-secondary/5 p-1.5 px-3 rounded-full mb-3">
                    CLUE PENALTY DETECTED: -{cluesUsedCount * 15}%
                  </div>
                )}
              </div>

              {/* Location trivia card */}
              <div className="bg-glass border border-white/10 p-6 rounded-2xl flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className="font-cyber font-bold text-xs text-cyber-cyan tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    TACTICAL INTEL REPORT
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {activeLocation.description}
                  </p>
                </div>

                <button
                  onClick={handleNextRound}
                  className="w-full relative py-3.5 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white font-cyber font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.45)] hover:shadow-[0_0_25px_rgba(236,72,153,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  {currentRound < maxRounds ? 'PROCEED TO NEXT ROUND' : 'VIEW DETAILED ANALYSIS'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Map showing line of projection */}
            <div className="lg:col-span-8 h-[380px] md:h-[550px]">
              <MapPanel 
                onGuess={null}
                currentRound={currentRound}
                isRoundActive={false}
                actualLocation={activeLocation}
                showResultMap={true}
                userGuessCoord={userGuessCoord}
              />
            </div>
          </motion.div>
        )}

        {/* State 3: Game Completed Screen */}
        {gameState === 'finished' && (
          <motion.div
            key="finish-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto w-full bg-glass border border-white/10 p-8 rounded-2xl text-center backdrop-blur-md"
          >
            <div className="inline-flex items-center gap-2 p-3 bg-cyber-cyan/15 rounded-full text-cyber-cyan mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="font-cyber font-black text-3xl md:text-4xl text-white tracking-widest uppercase mb-1">
              MISSION COMPLETED
            </h2>
            <p className="text-gray-400 font-rajdhani text-base tracking-widest mb-6">
              COORDINATES HARVEST SUCCESSFUL
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">FINAL SCORE</span>
                <span className="text-2xl font-cyber font-extrabold text-cyber-primary text-glow-purple">{score} PTS</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">ACCURACY INDEX</span>
                <span className="text-2xl font-cyber font-extrabold text-cyber-cyan text-glow-cyan">
                  {Math.round((score / (maxRounds * 5000)) * 100)}%
                </span>
              </div>
            </div>

            {/* XP Gained display */}
            <div className="bg-cyber-neonGreen/5 border border-cyber-neonGreen/30 p-4 rounded-xl mb-8 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-cyber text-cyber-neonGreen flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 animate-bounce" />
                  XP REWARDS HARVESTED
                </span>
                <span className="text-xs font-cyber text-white">+{Math.round(score / 5)} XP</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyber-neonGreen to-cyber-cyan" 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetGame}
                className="flex-1 py-3.5 rounded-lg border border-cyber-cyan/50 hover:border-cyber-cyan hover:bg-cyber-cyan/15 text-cyber-cyan font-cyber font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                PLAY AGAIN
              </button>
              
              <button
                onClick={() => setTab('leaderboard')}
                className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white font-cyber font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(139,92,246,0.35)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                LEADERBOARDS
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
