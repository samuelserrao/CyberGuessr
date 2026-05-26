import { motion } from 'framer-motion';
import { Play, Users, Calendar, Globe, Shield, Award } from 'lucide-react';

export default function Landing({ setTab, startGame }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const modes = [
    {
      title: "EXPLORE CAMPAIGN",
      desc: "5 rounds of geographical detective work. Find clues, lock in targets, and claim maximum points.",
      action: () => startGame("standard"),
      icon: Play,
      color: "from-cyber-primary to-cyber-secondary",
      glowColor: "rgba(139, 92, 246, 0.45)",
      btnText: "LAUNCH SCANNERS"
    },
    {
      title: "MULTIPLAYER CLASH",
      desc: "Go head-to-head with navigators around the globe in real-time lobbies. Speed and accuracy win.",
      action: () => startGame("multiplayer"),
      icon: Users,
      color: "from-cyber-cyan to-blue-500",
      glowColor: "rgba(6, 182, 212, 0.45)",
      btnText: "ENTER LOBBY"
    },
    {
      title: "DAILY MATRIX",
      desc: "One high-stakes coordinates match. Compete on the daily leaderboard with identical locations.",
      action: () => startGame("daily"),
      icon: Calendar,
      color: "from-amber-500 to-cyber-secondary",
      glowColor: "rgba(245, 158, 11, 0.45)",
      btnText: "SYNC SIGNAL"
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] select-none text-center"
    >
      {/* Title logo section */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary text-xs font-cyber tracking-widest mb-4 uppercase animate-pulse-slow">
          <Shield className="w-3.5 h-3.5" />
          SYSTEM STATUS: ONLINE
        </div>
        <h1 className="font-cyber text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-2 uppercase select-none">
          GEO WORLD <span className="cyber-logo">GUESSR</span>
        </h1>
        <p className="text-gray-400 font-rajdhani text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] max-w-xl mx-auto uppercase">
          Geographical Reconnaissance Protocol
        </p>
      </motion.div>

      {/* Mode selectors */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mb-12 md:mb-16"
      >
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-glass border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col justify-between items-center text-center relative group"
            >
              {/* Glow background accent */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `0 0 30px ${mode.glowColor}`,
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />

              <div className="flex flex-col items-center">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${mode.color} text-white mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="font-cyber font-bold text-lg md:text-xl text-white mb-2 tracking-wide">
                  {mode.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                  {mode.desc}
                </p>
              </div>

              <button
                onClick={mode.action}
                className="w-full relative py-3 rounded-lg font-cyber font-bold text-xs tracking-wider border border-white/10 hover:border-white/30 text-white bg-white/5 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {mode.btnText}
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick stats section */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl border border-white/10 bg-white/5 p-4 md:p-6 rounded-2xl backdrop-blur-md text-center"
      >
        <div>
          <div className="text-cyber-cyan font-cyber font-bold text-xl md:text-2xl text-glow-cyan">42,910</div>
          <div className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase mt-1">Scanners Active</div>
        </div>
        <div>
          <div className="text-cyber-primary font-cyber font-bold text-xl md:text-2xl text-glow-purple">1.2M+</div>
          <div className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase mt-1">Guesses Locked</div>
        </div>
        <div>
          <div className="text-cyber-neonGreen font-cyber font-bold text-xl md:text-2xl shadow-sm">18.4ms</div>
          <div className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase mt-1">Satellite Ping</div>
        </div>
        <div>
          <div className="text-cyber-secondary font-cyber font-bold text-xl md:text-2xl text-glow-pink">99.8%</div>
          <div className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase mt-1">Uptime SLA</div>
        </div>
      </motion.div>

    </motion.div>
  );
}
