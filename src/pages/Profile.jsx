import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { 
  Trophy, 
  Map, 
  TrendingUp, 
  History, 
  Clock, 
  Activity, 
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

import CircularProgress from '../components/CircularProgress';
import { ACHIEVEMENTS } from '../utils/mockData';

export default function Profile({ userProfile }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const winRate = Math.round((userProfile.stats.wins / userProfile.stats.gamesPlayed) * 100);
  const xpPercentage = (userProfile.xp / userProfile.xpNext) * 100;

  // Stats definition grid
  const statsList = [
    { label: "GAMES PLAYED", value: userProfile.stats.gamesPlayed, icon: Map, color: "text-cyber-cyan" },
    { label: "MISSIONS WON", value: userProfile.stats.wins, icon: Trophy, color: "text-yellow-400" },
    { label: "AVG ACCURACY", value: "84.5%", icon: Activity, color: "text-cyber-neonGreen" },
    { label: "BEST SCORE", value: `${userProfile.stats.bestScore} PTS`, icon: TrendingUp, color: "text-cyber-primary" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none min-h-[calc(100vh-80px)]">
      
      {/* Top Banner Profile Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-glass border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Left Side avatar and level */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-primary to-cyber-secondary border-2 border-cyber-primary shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center justify-center font-cyber font-black text-3xl text-white">
            SW
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <h2 className="font-cyber font-extrabold text-2xl text-white tracking-wider">
                {userProfile.username}
              </h2>
              <ShieldCheck className="w-5 h-5 text-cyber-cyan" />
            </div>
            
            <p className="text-gray-400 font-rajdhani text-sm tracking-wider uppercase mb-3">
              RATING LEVEL: VANGUARD EXPLORER
            </p>
            
            {/* Level & XP Meter */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-cyber font-bold text-cyber-neonGreen shrink-0">
                LEVEL {userProfile.level}
              </span>
              <div className="w-48 sm:w-64 h-2 bg-gray-800 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-neonGreen to-cyber-cyan" 
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-cyber text-gray-500 shrink-0">
                {userProfile.xp} / {userProfile.xpNext} XP
              </span>
            </div>
          </div>
        </div>

        {/* Right side stats index */}
        <div className="flex gap-4 sm:gap-6 bg-black/35 p-4 rounded-xl border border-white/5">
          <div className="text-center px-2">
            <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">AVG DISTANCE</span>
            <span className="text-lg font-cyber font-bold text-cyber-cyan text-glow-cyan">840 KM</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[10px] text-gray-500 font-cyber block tracking-wider uppercase">WIN RATE</span>
            <span className="text-lg font-cyber font-bold text-cyber-primary text-glow-purple">{winRate}%</span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        
        {/* Left Side: Stats and Progress */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Numeric stats cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsList.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-glass border border-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col items-center justify-center text-center">
                  <Icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                  <span className="text-[9px] text-gray-500 font-cyber tracking-wider uppercase mb-1">{stat.label}</span>
                  <span className="font-cyber font-extrabold text-base text-white">{stat.value}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Achievement Badges */}
          <motion.div variants={itemVariants} className="bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="font-cyber font-bold text-xs text-cyber-cyan tracking-wider uppercase mb-6 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              ACHIEVEMENT BADGES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((badge) => {
                const IconComponent = Icons[badge.icon] || Icons.HelpCircle;
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-xl border flex flex-col gap-3 relative transition-all duration-300 ${
                      badge.unlocked 
                        ? 'bg-white/5 border-white/10 hover:border-cyber-primary/40' 
                        : 'bg-black/45 border-white/5 opacity-55'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${
                        badge.unlocked 
                          ? 'bg-cyber-primary/20 text-cyber-primary' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        {badge.unlocked ? <IconComponent className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      
                      <span className={`font-cyber text-[9px] px-2 py-0.5 rounded-full ${
                        badge.unlocked 
                          ? 'bg-cyber-neonGreen/10 text-cyber-neonGreen' 
                          : 'bg-gray-800/40 text-gray-500'
                      }`}>
                        {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>

                    <div className="text-left">
                      <h4 className="font-cyber font-bold text-xs text-white tracking-wide truncate mb-1">
                        {badge.title}
                      </h4>
                      <p className="text-gray-400 text-[10px] leading-relaxed mb-3">
                        {badge.description}
                      </p>
                    </div>

                    {/* Progress slider bar */}
                    {!badge.unlocked && (
                      <div className="w-full mt-auto">
                        <div className="flex justify-between text-[8px] font-cyber text-gray-500 mb-1">
                          <span>PROGRESS</span>
                          <span>{badge.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyber-cyan" style={{ width: `${badge.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Right Side: Radial Stats & History */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Radial Progress Charts */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <CircularProgress 
              percentage={winRate} 
              size={110} 
              strokeWidth={7} 
              color="#06b6d4" 
              title="Win Index"
              subtitle="Win-Rate" 
            />
            <CircularProgress 
              percentage={85} 
              size={110} 
              strokeWidth={7} 
              color="#8b5cf6" 
              title="Accuracy"
              subtitle="Score-Rate" 
            />
          </motion.div>

          {/* Match History Logs */}
          <motion.div variants={itemVariants} className="bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md flex-1 flex flex-col">
            <h3 className="font-cyber font-bold text-xs text-cyber-cyan tracking-wider uppercase mb-5 flex items-center gap-2">
              <History className="w-4 h-4" />
              COORDINATES LOGS
            </h3>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1.5 flex-1">
              {userProfile.matchHistory.map((match) => (
                <div 
                  key={match.id}
                  className="bg-black/30 border border-white/5 hover:border-cyber-primary/20 p-3.5 rounded-xl flex items-center justify-between text-left transition-all duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-cyber font-bold text-xs text-white tracking-wide">
                      {match.mode}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {match.date}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-cyber font-bold text-xs text-cyber-primary block text-glow-purple">
                      +{match.score} PTS
                    </span>
                    <span className="text-[9px] font-cyber text-cyber-neonGreen">
                      {match.accuracy}% ACC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </motion.div>

    </div>
  );
}
