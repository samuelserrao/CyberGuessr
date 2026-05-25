import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Globe, UserCheck, TrendingUp, Flag, Award } from 'lucide-react';
import { LEADERBOARD } from '../utils/mockData';

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('global'); // global, weekly, local

  // Filter leaderboard based on query
  const filteredList = LEADERBOARD.filter(player => 
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  // Helper to resolve rank colors
  const getRankStyle = (rank) => {
    if (rank === 1) return { text: 'text-yellow-400 font-bold', bg: 'bg-yellow-400/10 border-yellow-400/40 text-glow-yellow' };
    if (rank === 2) return { text: 'text-gray-300 font-bold', bg: 'bg-gray-300/10 border-gray-300/30' };
    if (rank === 3) return { text: 'text-amber-600 font-bold', bg: 'bg-amber-600/10 border-amber-600/30' };
    return { text: 'text-gray-400', bg: 'bg-white/5 border-white/10' };
  };

  // Helper to map country codes to emojis
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none min-h-[calc(100vh-80px)]">
      
      {/* Page Header */}
      <div className="text-center mb-10">
        <h2 className="font-cyber text-3xl md:text-5xl font-black tracking-wider text-white uppercase mb-2">
          LEADERBOARDS
        </h2>
        <p className="text-gray-400 font-rajdhani text-sm md:text-base tracking-[0.2em] uppercase">
          Global Navigator Standings
        </p>
      </div>

      {/* Podium Cards for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end">
        {/* 2nd Place */}
        {filteredList[1] && (
          <motion.div 
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="order-2 md:order-1 bg-glass border border-gray-300/10 p-6 rounded-2xl text-center backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gray-400/50" />
            <div className="text-sm font-cyber text-gray-400 font-bold mb-1">#2 RANK</div>
            <div className="w-14 h-14 rounded-full bg-gray-400/10 border border-gray-400/30 flex items-center justify-center mx-auto mb-3 font-cyber font-black text-xl text-gray-300">
              🥈
            </div>
            <h3 className="font-cyber font-bold text-white text-base truncate mb-1">
              {filteredList[1].username}
            </h3>
            <div className="text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
              <span>{getFlagEmoji(filteredList[1].countryCode)}</span>
              <span className="uppercase">{filteredList[1].countryCode}</span>
            </div>
            <div className="font-cyber font-bold text-cyber-cyan text-sm">{filteredList[1].score} PTS</div>
          </motion.div>
        )}

        {/* 1st Place */}
        {filteredList[0] && (
          <motion.div 
            whileHover={{ y: -6 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2 bg-glass border border-yellow-400/20 p-8 rounded-2xl text-center backdrop-blur-md relative overflow-hidden shadow-[0_0_25px_rgba(234,179,8,0.15)] md:scale-105"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-yellow-500" />
            <div className="inline-flex items-center gap-1 text-xs font-cyber text-yellow-400 font-bold mb-1 uppercase tracking-widest animate-pulse">
              <Award className="w-3.5 h-3.5" />
              TOP NAVIGATOR
            </div>
            <div className="w-16 h-16 rounded-full bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center mx-auto mb-3 font-cyber font-black text-2xl">
              👑
            </div>
            <h3 className="font-cyber font-bold text-white text-lg truncate mb-1">
              {filteredList[0].username}
            </h3>
            <div className="text-xs text-gray-400 mb-4 flex items-center justify-center gap-1">
              <span>{getFlagEmoji(filteredList[0].countryCode)}</span>
              <span className="uppercase">{filteredList[0].countryCode}</span>
            </div>
            <div className="font-cyber font-black text-yellow-400 text-lg tracking-wider text-glow-yellow">{filteredList[0].score} PTS</div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {filteredList[2] && (
          <motion.div 
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="order-3 bg-glass border border-amber-600/10 p-6 rounded-2xl text-center backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-600/50" />
            <div className="text-sm font-cyber text-gray-400 font-bold mb-1">#3 RANK</div>
            <div className="w-14 h-14 rounded-full bg-amber-600/10 border border-amber-600/30 flex items-center justify-center mx-auto mb-3 font-cyber font-black text-xl text-amber-600">
              🥉
            </div>
            <h3 className="font-cyber font-bold text-white text-base truncate mb-1">
              {filteredList[2].username}
            </h3>
            <div className="text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
              <span>{getFlagEmoji(filteredList[2].countryCode)}</span>
              <span className="uppercase">{filteredList[2].countryCode}</span>
            </div>
            <div className="font-cyber font-bold text-cyber-cyan text-sm">{filteredList[2].score} PTS</div>
          </motion.div>
        )}
      </div>

      {/* Control panel containing filters and search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-glass border border-white/10 p-4 rounded-xl backdrop-blur-md">
        
        {/* Mode Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'global', label: 'GLOBAL', icon: Globe },
            { id: 'weekly', label: 'WEEKLY', icon: TrendingUp },
            { id: 'friends', label: 'FRIENDS', icon: UserCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-cyber font-bold text-xs tracking-wider flex items-center gap-2 transition-all duration-300 border ${
                  isTabActive 
                    ? 'bg-cyber-cyan/15 border-cyber-cyan/40 text-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]' 
                    : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            placeholder="Search navigators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg pl-10 pr-4 py-2 font-rajdhani text-base font-semibold text-white focus:outline-none transition-all duration-300 shadow-inner"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-glass border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 font-cyber text-[10px] text-gray-400 tracking-wider">
                <th className="p-4 pl-6">RANK</th>
                <th className="p-4">USER</th>
                <th className="p-4">COORDINATE SCORE</th>
                <th className="p-4">SCANS LOADED</th>
                <th className="p-4">WIN RATE</th>
                <th className="p-4 pr-6">ACCURACY</th>
              </tr>
            </thead>
            
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredList.map((player) => {
                  const rankConfig = getRankStyle(player.rank);
                  const winRate = Math.round((player.wins / player.gamesPlayed) * 100);
                  
                  return (
                    <motion.tr
                      key={player.username}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="border-b border-white/5 text-sm font-rajdhani font-semibold text-gray-300"
                    >
                      {/* Rank */}
                      <td className="p-4 pl-6">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded border font-cyber text-[11px] ${rankConfig.bg} ${rankConfig.text}`}>
                          {player.rank}
                        </span>
                      </td>

                      {/* Username */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFlagEmoji(player.countryCode)}</span>
                          <span className="text-white hover:text-cyber-cyan transition-colors duration-200 cursor-pointer font-cyber text-xs tracking-wider">
                            {player.username}
                          </span>
                        </div>
                      </td>

                      {/* Points */}
                      <td className="p-4 font-cyber text-xs tracking-wider text-cyber-cyan">
                        {player.score.toLocaleString()} PTS
                      </td>

                      {/* Games played */}
                      <td className="p-4 font-mono text-xs text-gray-400">
                        {player.gamesPlayed} GAMES
                      </td>

                      {/* Win rate */}
                      <td className="p-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white">{winRate}%</span>
                          <span className="text-[10px] text-gray-500">({player.wins} W)</span>
                        </div>
                      </td>

                      {/* Accuracy */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-primary" 
                              style={{ width: `${player.accuracy}%` }}
                            />
                          </div>
                          <span className="font-cyber text-[10px] text-white">{player.accuracy}%</span>
                        </div>
                      </td>

                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </motion.tbody>
          </table>
          
          {filteredList.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-cyber text-sm">
              NO SIGNALS FOUND FOR QUERY
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
