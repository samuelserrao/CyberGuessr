import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  User, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Compass,
  Zap
} from 'lucide-react';

export default function Navbar({ currentTab, setTab, theme, toggleTheme, userProfile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'game', label: 'Play', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setTab(tabId);
    setMobileMenuOpen(false);
  };

  const xpPercentage = (userProfile.xp / userProfile.xpNext) * 100;

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 md:px-8 border-b border-white/10 bg-glass backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="p-2 rounded-lg bg-gradient-to-br from-cyber-cyan/30 to-cyber-primary/30 border border-cyber-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            <Compass className="w-6 h-6 text-cyber-cyan group-hover:text-cyber-secondary transition-colors duration-300" />
          </motion.div>
          <span className="font-cyber text-lg md:text-xl font-bold tracking-wider cyber-logo">
            GEO WORLD <span className="text-white dark:text-white light:text-cyber-dark">GUESSR</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-md font-rajdhani text-lg font-semibold tracking-wider flex items-center gap-2 transition-all duration-300 ${
                  isActive 
                    ? 'text-cyber-cyan text-glow-cyan' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-gray-400'}`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* User stats widget & Theme toggle */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* User Level Widget */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1.5 px-3">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyber-neonGreen animate-pulse" />
                <span className="text-xs text-gray-400 font-cyber font-medium">LVL {userProfile.level}</span>
              </div>
              {/* Mini progress bar */}
              <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-neonGreen to-cyber-cyan shadow-[0_0_5px_rgba(16,189,129,0.5)] transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-right">
              <span className="text-xs text-gray-400 block font-rajdhani">Best Score</span>
              <span className="text-xs text-cyber-cyan font-cyber font-semibold">{userProfile.stats.bestScore} pts</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyber-primary/40 hover:bg-cyber-primary/10 text-gray-400 hover:text-cyber-primary transition-all duration-300 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-cyber-cyan" /> : <Moon className="w-4 h-4 text-cyber-primary" />}
          </button>
        </div>

        {/* Mobile menu & Theme controls */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-cyber-cyan" /> : <Moon className="w-4 h-4 text-cyber-primary" />}
          </button>
          
          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden mt-3 border-t border-white/10 pt-3 overflow-hidden flex flex-col gap-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-rajdhani text-lg font-bold ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-primary/15 border-l-2 border-cyber-cyan text-cyber-cyan' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}

            {/* Mobile Stats Summary */}
            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-neonGreen" />
                <span className="text-sm text-gray-300 font-cyber">Lvl {userProfile.level}</span>
              </div>
              <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-neonGreen to-cyber-cyan"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-xs text-cyber-cyan font-cyber font-semibold">{userProfile.stats.bestScore} pts</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
