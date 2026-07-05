import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Save, 
  X, 
  ShieldAlert, 
  Trophy, 
  CheckCircle,
  Database,
  Globe,
  Award,
  MapPin,
  Upload,
  RefreshCw
} from 'lucide-react';
import { LEADERBOARD as DEFAULT_LEADERBOARD } from '../utils/mockData';
import { api } from '../utils/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';

// Custom Map Component for coordinate selection in admin form
function AdminMap({ onSelectCoord, selectedCoord }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map centered at some default view or selected coord
    const map = L.map(mapContainerRef.current, {
      center: selectedCoord ? [selectedCoord.lat, selectedCoord.lng] : [20, 0],
      zoom: selectedCoord ? 6 : 1.5,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    mapRef.current = map;

    // Custom marker icon
    const adminMarkerIcon = L.divIcon({
      className: 'custom-admin-marker',
      html: `<div class="relative flex items-center justify-center w-8 h-8 pointer-events-none">
               <div class="absolute w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 animate-ping"></div>
               <div class="absolute w-4 h-4 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_12px_rgba(236,72,153,0.85)]"></div>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (selectedCoord) {
      markerRef.current = L.marker([selectedCoord.lat, selectedCoord.lng], { icon: adminMarkerIcon }).addTo(map);
    }

    const onMapClick = (e) => {
      const { lat, lng } = e.latlng;
      onSelectCoord(lat, lng);

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: adminMarkerIcon }).addTo(map);
      }
    };

    map.on('click', onMapClick);

    // Trigger map invalidation to handle sizes in tab switches
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      map.off('click', onMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync marker position when selectedCoord changes externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCoord) return;
    const { lat, lng } = selectedCoord;
    
    const adminMarkerIcon = L.divIcon({
      className: 'custom-admin-marker',
      html: `<div class="relative flex items-center justify-center w-8 h-8 pointer-events-none">
               <div class="absolute w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 animate-ping"></div>
               <div class="absolute w-4 h-4 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_12px_rgba(236,72,153,0.85)]"></div>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: adminMarkerIcon }).addTo(map);
    }
  }, [selectedCoord]);

  return <div ref={mapContainerRef} className="w-full h-[280px] rounded-xl border border-white/10 overflow-hidden" />;
}

export default function Admin() {
  const [users, setUsers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'leaderboard', 'locations'
  
  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Add Custom Location states
  const [addLocName, setAddLocName] = useState('');
  const [addLocCountry, setAddLocCountry] = useState('');
  const [addLocLat, setAddLocLat] = useState('');
  const [addLocLng, setAddLocLng] = useState('');
  const [addLocImg, setAddLocImg] = useState('');
  const [addLocClue1, setAddLocClue1] = useState('');
  const [addLocClue2, setAddLocClue2] = useState('');
  const [addLocClue3, setAddLocClue3] = useState('');
  const [addLocDesc, setAddLocDesc] = useState('');
  
  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editLevel, setEditLevel] = useState(1);
  const [editXP, setEditXP] = useState(0);
  const [editBestScore, setEditBestScore] = useState(0);
  const [editGamesPlayed, setEditGamesPlayed] = useState(0);
  const [editWins, setEditWins] = useState(0);

  // Edit Leaderboard Entry State
  const [editingEntry, setEditingEntry] = useState(null);
  const [entryScore, setEntryScore] = useState(0);
  const [entryGames, setEntryGames] = useState(0);
  const [entryWins, setEntryWins] = useState(0);
  const [entryAccuracy, setEntryAccuracy] = useState(0);
  const [entryCountry, setEntryCountry] = useState('US');

  // Add Leaderboard Entry State
  const [addUsername, setAddUsername] = useState('');
  const [addScore, setAddScore] = useState('');
  const [addGames, setAddGames] = useState('');
  const [addWins, setAddWins] = useState('');
  const [addAccuracy, setAddAccuracy] = useState('');
  const [addCountry, setAddCountry] = useState('US');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.getUsers()
      .then(data => {
        if (Array.isArray(data)) {
          const usersMap = {};
          data.forEach(u => {
            usersMap[u.username.toLowerCase()] = u;
          });
          setUsers(usersMap);
        } else {
          setUsers(data);
        }
      })
      .catch(err => {
        console.error("Admin failed to load users:", err);
      });

    api.getLeaderboard()
      .then(data => {
        setLeaderboard(data);
      })
      .catch(err => {
        console.error("Admin failed to load leaderboard:", err);
      });

    api.getLocations()
      .then(data => {
        setLocations(data);
      })
      .catch(err => {
        console.error("Admin failed to load locations:", err);
      });
  };

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 3000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // User Actions
  const handleEditUser = (username) => {
    const user = users[username.toLowerCase()];
    if (!user) return;
    setEditingUser(user);
    setEditLevel(user.level || 1);
    setEditXP(user.xp || 0);
    setEditBestScore(user.stats?.bestScore || 0);
    setEditGamesPlayed(user.stats?.gamesPlayed || 0);
    setEditWins(user.stats?.wins || 0);
  };

  const saveUserEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const payload = {
      level: parseInt(editLevel),
      xp: parseInt(editXP),
      stats: {
        bestScore: parseInt(editBestScore),
        gamesPlayed: parseInt(editGamesPlayed),
        wins: parseInt(editWins)
      }
    };

    api.updateUserStats(editingUser.username, payload)
      .then(updatedUser => {
        setUsers(prev => ({
          ...prev,
          [editingUser.username.toLowerCase()]: updatedUser
        }));
        setEditingUser(null);
        showNotification(`USER ${editingUser.username.toUpperCase()} STATS UPDATED`);
      })
      .catch(err => {
        showNotification(err.message || 'Failed to update user parameters', true);
      });
  };

  const handleDeleteUser = (username) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete agent "${username}"?`);
    if (!confirmDelete) return;

    api.deleteUser(username)
      .then(() => {
        setUsers(prev => {
          const newUsers = { ...prev };
          delete newUsers[username.toLowerCase()];
          return newUsers;
        });
        showNotification(`AGENT "${username.toUpperCase()}" RETIRED FROM SERVICE`);
      })
      .catch(err => {
        showNotification(err.message || 'Failed to delete user agent', true);
      });
  };

  // Leaderboard Actions
  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setEntryScore(entry.score || 0);
    setEntryGames(entry.gamesPlayed || 0);
    setEntryWins(entry.wins || 0);
    setEntryAccuracy(entry.accuracy || 0);
    setEntryCountry(entry.countryCode || 'US');
  };

  const saveEntryEdit = (e) => {
    e.preventDefault();
    if (!editingEntry) return;

    const updatedLeaderboard = leaderboard.map(item => {
      if (item.username === editingEntry.username) {
        return {
          ...item,
          score: parseInt(entryScore),
          gamesPlayed: parseInt(entryGames),
          wins: parseInt(entryWins),
          accuracy: parseInt(entryAccuracy),
          countryCode: entryCountry.toUpperCase()
        };
      }
      return item;
    });

    // Re-sort leaderboard by score
    updatedLeaderboard.sort((a, b) => b.score - a.score);
    // Re-assign ranks
    const rankedLeaderboard = updatedLeaderboard.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    localStorage.setItem('geoGuessr_leaderboard', JSON.stringify(rankedLeaderboard));
    setLeaderboard(rankedLeaderboard);
    setEditingEntry(null);
    showNotification(`LEADERBOARD STANDING UPDATED`);
  };

  const handleDeleteEntry = (username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${username}" from the leaderboard?`);
    if (!confirmDelete) return;

    const updatedLeaderboard = leaderboard.filter(item => item.username !== username);
    // Re-assign ranks
    const rankedLeaderboard = updatedLeaderboard.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    localStorage.setItem('geoGuessr_leaderboard', JSON.stringify(rankedLeaderboard));
    setLeaderboard(rankedLeaderboard);
    showNotification(`LEADERBOARD ENTRY REMOVED`);
  };

  const handleAddLeaderboardEntry = (e) => {
    e.preventDefault();

    if (!addUsername || !addScore || !addGames || !addWins || !addAccuracy) {
      showNotification("FIELDS REQUIRED: Please fill in all leaderboard entry parameters.", true);
      return;
    }

    const newEntry = {
      username: addUsername.trim(),
      score: parseInt(addScore),
      gamesPlayed: parseInt(addGames),
      wins: parseInt(addWins),
      accuracy: parseInt(addAccuracy),
      countryCode: addCountry.trim().toUpperCase()
    };

    const updatedLeaderboard = [...leaderboard, newEntry];
    // Re-sort
    updatedLeaderboard.sort((a, b) => b.score - a.score);
    // Re-assign ranks
    const rankedLeaderboard = updatedLeaderboard.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    localStorage.setItem('geoGuessr_leaderboard', JSON.stringify(rankedLeaderboard));
    setLeaderboard(rankedLeaderboard);

    // Reset fields
    setAddUsername('');
    setAddScore('');
    setAddGames('');
    setAddWins('');
    setAddAccuracy('');
    setAddCountry('US');

    showNotification("NEW STANDING COMMITTED TO LEADERBOARD");
  };

  // Custom Locations Actions
  const handleDeleteLocation = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently decommission this location?");
    if (!confirmDelete) return;

    api.deleteLocation(id)
      .then(() => {
        setLocations(prev => prev.filter(l => l._id !== id && l.id !== id));
        showNotification("TARGET NODE RETIRED SUCCESSFULLY");
      })
      .catch(err => {
        showNotification(err.message || "Failed to delete target", true);
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showNotification("FILE TOO LARGE: Max limit is 8MB", true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAddLocImg(reader.result);
      showNotification("IMAGE VECTOR CACHED SUCCESSFULLY");
    };
    reader.readAsDataURL(file);
  };

  const handleSelectCoord = (lat, lng) => {
    setAddLocLat(lat.toFixed(6));
    setAddLocLng(lng.toFixed(6));
    setIsGeocoding(true);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.address) {
          const address = data.address;
          const name = address.tourism || address.amenity || address.historic || address.landmark || address.suburb || address.city || address.town || address.county || address.state || 'Unknown Coordinate';
          const country = address.country || 'Unknown';
          
          setAddLocName(name);
          setAddLocCountry(country);
          showNotification("COORDINATES RESOLVED BY SYSTEM");
        }
      })
      .catch(err => {
        console.warn("Osm geocode search failed:", err);
      })
      .finally(() => {
        setIsGeocoding(false);
      });
  };

  const handleAddLocation = (e) => {
    e.preventDefault();

    if (!addLocName || !addLocCountry || addLocLat === '' || addLocLng === '' || !addLocImg) {
      showNotification("FIELDS REQUIRED: Map coordinates, name, country, and image are required.", true);
      return;
    }

    const clues = [addLocClue1, addLocClue2, addLocClue3].map(c => c.trim()).filter(c => c !== '');

    const payload = {
      name: addLocName.trim(),
      country: addLocCountry.trim(),
      lat: Number(addLocLat),
      lng: Number(addLocLng),
      imageUrl: addLocImg,
      clues,
      description: addLocDesc.trim()
    };

    api.addLocation(payload)
      .then(newLoc => {
        setLocations(prev => [newLoc, ...prev]);
        setAddLocName('');
        setAddLocCountry('');
        setAddLocLat('');
        setAddLocLng('');
        setAddLocImg('');
        setAddLocClue1('');
        setAddLocClue2('');
        setAddLocClue3('');
        setAddLocDesc('');
        showNotification("NEW SYSTEM TARGET SYNAPSE MAPPED");
      })
      .catch(err => {
        showNotification(err.message || "Failed to commit target synapse", true);
      });
  };

  // Filters
  const filteredUsers = Object.values(users).filter(user => 
    user.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLeaderboard = leaderboard.filter(item => 
    item.username.toLowerCase().includes(leaderboardSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-cyber tracking-widest mb-4 uppercase animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          ADMIN MATRIX PROTOCOL
        </div>
        <h2 className="font-cyber text-3xl md:text-5xl font-black tracking-wider text-white uppercase mb-2">
          CENTRAL COMMAND
        </h2>
        <p className="text-gray-400 font-rajdhani text-sm md:text-base tracking-[0.2em] uppercase">
          Agent Registry & Leaderboard Overrides
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-lg border font-cyber text-xs tracking-wider uppercase transition-all duration-200 ${
            activeTab === 'users'
              ? 'bg-cyber-primary/25 border-cyber-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
              : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-2" />
          Agent Database
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-2.5 rounded-lg border font-cyber text-xs tracking-wider uppercase transition-all duration-200 ${
            activeTab === 'leaderboard'
              ? 'bg-cyber-cyan/25 border-cyber-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 inline mr-2" />
          Leaderboard Matrix
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-6 py-2.5 rounded-lg border font-cyber text-xs tracking-wider uppercase transition-all duration-200 ${
            activeTab === 'locations'
              ? 'bg-pink-500/25 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.35)]'
              : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5 inline mr-2" />
          Location Database
        </button>
      </div>

      {/* Floating Notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-cyber-neonGreen/10 border border-cyber-neonGreen/45 text-cyber-neonGreen font-cyber text-xs tracking-wider px-6 py-3 rounded-lg backdrop-blur-md shadow-lg"
          >
            {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/45 text-red-400 font-cyber text-xs tracking-wider px-6 py-3 rounded-lg backdrop-blur-md shadow-lg"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        {activeTab === 'users' && (
          /* TAB 1: User Management */
          <div className="bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-cyber font-bold text-sm text-cyber-cyan tracking-wider uppercase flex items-center gap-2">
                <Users className="w-4 h-4" />
                ACTIVE AGENT REGISTRY ({Object.keys(users).length})
              </h3>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="SEARCH CALLSIGN..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg pl-9 pr-4 py-2 font-rajdhani text-sm text-white focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 font-cyber text-[10px] text-gray-500 tracking-wider">
                    <th className="pb-3 pr-2">AGENT</th>
                    <th className="pb-3 pr-2">LEVEL</th>
                    <th className="pb-3 pr-2">XP</th>
                    <th className="pb-3 pr-2">MISSIONS</th>
                    <th className="pb-3 pr-2">BEST SCORE</th>
                    <th className="pb-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-rajdhani text-sm font-semibold text-gray-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 font-cyber text-xs">
                        NO ACTIVE CALLSIGNS FOUND
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.username} className="hover:bg-white/5 transition-colors duration-150">
                        <td className="py-3.5 pr-2 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            {user.profilePic ? (
                              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center font-cyber text-[9px] font-bold text-white">
                                {user.username.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-white block">{user.username}</span>
                            <span className="text-[10px] text-gray-500 font-cyber">
                              {user.username.toLowerCase() === 'admin' ? 'SYSTEM CMD' : 'FIELD AGENT'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-2 font-cyber text-xs text-cyber-neonGreen">LVL {user.level}</td>
                        <td className="py-3.5 pr-2 font-mono text-xs">{user.xp} XP</td>
                        <td className="py-3.5 pr-2">{user.stats?.gamesPlayed || 0}</td>
                        <td className="py-3.5 pr-2 text-cyber-cyan">{user.stats?.bestScore || 0} PTS</td>
                        <td className="py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(user.username)}
                              className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all duration-200"
                              title="Edit Agent Stats"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.username)}
                              disabled={user.username.toLowerCase() === 'admin'}
                              className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                              title="Retire Agent"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          /* TAB 2: Leaderboard Management */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Leaderboard stand list */}
            <div className="lg:col-span-7 bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-cyber font-bold text-sm text-cyber-cyan tracking-wider uppercase flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  LEADERBOARD STANDINGS ({leaderboard.length})
                </h3>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="SEARCH ENTRY..."
                    value={leaderboardSearch}
                    onChange={(e) => setLeaderboardSearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg pl-9 pr-4 py-2 font-rajdhani text-sm text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/5 font-cyber text-[10px] text-gray-500 tracking-wider">
                      <th className="pb-3 pr-2">RANK</th>
                      <th className="pb-3 pr-2">USERNAME</th>
                      <th className="pb-3 pr-2">SCORE</th>
                      <th className="pb-3 pr-2">ACCURACY</th>
                      <th className="pb-3 pr-2">NATION</th>
                      <th className="pb-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-rajdhani text-sm font-semibold text-gray-300">
                    {filteredLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-500 font-cyber text-xs">
                          NO LEADERBOARD STANDINGS FOUND
                        </td>
                      </tr>
                    ) : (
                      filteredLeaderboard.map((item) => (
                        <tr key={item.username} className="hover:bg-white/5 transition-colors duration-150">
                          <td className="py-3.5 pr-2 font-cyber text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${
                              item.rank === 1 ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' :
                              item.rank === 2 ? 'bg-gray-300/10 text-gray-300 border border-white/20' :
                              item.rank === 3 ? 'bg-amber-600/10 text-amber-500 border border-amber-600/30' :
                              'text-gray-400'
                            }`}>
                              #{item.rank}
                            </span>
                          </td>
                          <td className="py-3.5 pr-2 text-white font-cyber text-xs tracking-wide">{item.username}</td>
                          <td className="py-3.5 pr-2 text-cyber-cyan font-mono">{item.score.toLocaleString()} PTS</td>
                          <td className="py-3.5 pr-2 text-cyber-neonGreen">{item.accuracy}%</td>
                          <td className="py-3.5 pr-2 font-cyber text-xs">{item.countryCode || 'US'}</td>
                          <td className="py-3.5 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditEntry(item)}
                                className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all duration-200"
                                title="Edit Standing"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(item.username)}
                                className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
                                title="Delete Standing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Register Leaderboard Entry Form */}
            <div className="lg:col-span-5 bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
              <h3 className="font-cyber font-bold text-sm text-cyber-cyan tracking-wider uppercase mb-5 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                COMMIT LEADERBOARD ENTRY
              </h3>

              <form onSubmit={handleAddLeaderboardEntry} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">AGENT CALLSIGN</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MapWanderer"
                    value={addUsername}
                    onChange={(e) => setAddUsername(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">TOTAL SCORE</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={25000}
                      placeholder="e.g. 23500"
                      value={addScore}
                      onChange={(e) => setAddScore(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">ACCURACY (%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      placeholder="e.g. 94"
                      value={addAccuracy}
                      onChange={(e) => setAddAccuracy(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 col-span-1">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">GAMES</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="85"
                      value={addGames}
                      onChange={(e) => setAddGames(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-1">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">WINS</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="40"
                      value={addWins}
                      onChange={(e) => setAddWins(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-1">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">NATION (ISO)</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="US"
                      value={addCountry}
                      onChange={(e) => setAddCountry(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full neon-btn-primary flex items-center justify-center gap-2 mt-4"
                >
                  <Plus className="w-4 h-4" />
                  COMMIT STANDING
                </button>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'locations' && (
          /* TAB 3: Location Management */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Locations list */}
            <div className="lg:col-span-7 bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-cyber font-bold text-sm text-pink-500 tracking-wider uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  MAP SYNAPSE REGISTRY ({locations.length})
                </h3>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="SEARCH LOCATIONS..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg pl-9 pr-4 py-2 font-rajdhani text-sm text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Locations Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/5 font-cyber text-[10px] text-gray-500 tracking-wider">
                      <th className="pb-3 pr-2">PREVIEW</th>
                      <th className="pb-3 pr-2">LOCATION NAME</th>
                      <th className="pb-3 pr-2">COORDINATES</th>
                      <th className="pb-3 pr-2">SOURCE</th>
                      <th className="pb-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-rajdhani text-sm font-semibold text-gray-300">
                    {locations.filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase()) || l.country.toLowerCase().includes(locationSearch.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500 font-cyber text-xs">
                          NO LOCATIONS MAPPED
                        </td>
                      </tr>
                    ) : (
                      locations
                        .filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase()) || l.country.toLowerCase().includes(locationSearch.toLowerCase()))
                        .map((loc) => (
                          <tr key={loc._id || loc.id} className="hover:bg-white/5 transition-colors duration-150">
                            <td className="py-3 pr-2 shrink-0">
                              <div className="w-16 h-10 rounded overflow-hidden border border-white/10 bg-black/40">
                                <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200';
                                }} />
                              </div>
                            </td>
                            <td className="py-3 pr-2">
                              <span className="text-white block font-cyber text-xs tracking-wide">{loc.name}</span>
                              <span className="text-[10px] text-gray-500 font-cyber uppercase">{loc.country}</span>
                            </td>
                            <td className="py-3 pr-2 font-mono text-xs text-cyber-cyan">
                              {Number(loc.lat).toFixed(4)}, {Number(loc.lng).toFixed(4)}
                            </td>
                            <td className="py-3 pr-2">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-cyber tracking-wider ${
                                loc.isCustom 
                                  ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' 
                                  : 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                              }`}>
                                {loc.isCustom ? 'CUSTOM' : 'SYSTEM'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteLocation(loc._id || loc.id)}
                                className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
                                title="Decommission Location"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Add Custom Location form */}
            <div className="lg:col-span-5 bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
              <h3 className="font-cyber font-bold text-sm text-pink-500 tracking-wider uppercase mb-5 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                ADD LOCATION MATRIX
              </h3>

              <form onSubmit={handleAddLocation} className="space-y-4">
                {/* Image Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">LOCATION SATELLITE IMAGE</label>
                  
                  {/* Preview box */}
                  {addLocImg ? (
                    <div className="relative w-full h-36 rounded-lg border border-white/10 overflow-hidden group bg-black/20">
                      <img src={addLocImg} alt="Preview" className="w-full h-full object-cover animate-fade-in" />
                      <button
                        type="button"
                        onClick={() => setAddLocImg('')}
                        className="absolute top-2 right-2 p-1.5 rounded bg-black/60 border border-white/10 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {/* File Uploader */}
                      <label className="flex flex-col items-center justify-center h-24 border border-dashed border-white/10 hover:border-pink-500/50 rounded-lg cursor-pointer bg-black/20 hover:bg-pink-500/5 transition-all duration-300">
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-400 font-cyber uppercase tracking-wider">UPLOAD FILE</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {/* URL input placeholder */}
                      <div className="flex flex-col justify-center h-24 border border-white/10 rounded-lg bg-black/20 px-3 gap-1">
                        <span className="text-[9px] text-gray-500 font-cyber tracking-wider">OR ENTER URL</span>
                        <input
                          type="text"
                          placeholder="https://..."
                          onChange={(e) => setAddLocImg(e.target.value)}
                          className="bg-black/40 border border-white/10 focus:border-pink-500/50 rounded px-2 py-1 font-rajdhani text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Coordinates Selection Map */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">TACTICAL LOCATION SYNC (CLICK ON MAP)</label>
                  <AdminMap onSelectCoord={handleSelectCoord} selectedCoord={addLocLat && addLocLng ? { lat: Number(addLocLat), lng: Number(addLocLng) } : null} />
                </div>

                {/* Coordinate Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">LATITUDE</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 48.8584"
                      value={addLocLat}
                      onChange={(e) => setAddLocLat(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">LONGITUDE</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 2.2945"
                      value={addLocLng}
                      onChange={(e) => setAddLocLng(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Auto Resolved Name & Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider flex items-center gap-1">
                      LOCATION NAME 
                      {isGeocoding && <RefreshCw className="w-2.5 h-2.5 animate-spin text-pink-400" />}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eiffel Tower"
                      value={addLocName}
                      onChange={(e) => setAddLocName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-gray-500 font-cyber tracking-wider">COUNTRY</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. France"
                      value={addLocCountry}
                      onChange={(e) => setAddLocCountry(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Progressive Clues */}
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider block">PROGRESSIVE INTELLIGENCE CLUES (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="Clue 1: Vague (e.g. West Europe capital...)"
                    value={addLocClue1}
                    onChange={(e) => setAddLocClue1(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-1.5 font-rajdhani text-xs text-white focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Clue 2: Medium (e.g. 1889 World's Fair arch...)"
                    value={addLocClue2}
                    onChange={(e) => setAddLocClue2(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-1.5 font-rajdhani text-xs text-white focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Clue 3: Specific (e.g. Iron Lady lattice...)"
                    value={addLocClue3}
                    onChange={(e) => setAddLocClue3(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-1.5 font-rajdhani text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">INTEL DOSSIER / DESCRIPTION</label>
                  <textarea
                    rows={2}
                    placeholder="Provide a historical or structural profile of this target..."
                    value={addLocDesc}
                    onChange={(e) => setAddLocDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-pink-500/50 rounded-lg px-3 py-2 font-rajdhani text-xs text-white focus:outline-none transition-all duration-300 resize-none animate-fade-in"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white font-cyber text-xs tracking-wider font-semibold shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-102 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                >
                  <Plus className="w-4 h-4" />
                  ACTIVATE TARGET NODE
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-cyber-dark border border-white/10 p-6 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.2)] text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-cyber font-bold text-sm text-cyber-cyan flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                EDIT AGENT PROTOCOLS
              </h4>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-500 hover:text-white transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveUserEdit} className="space-y-4">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  {editingUser.profilePic ? (
                    <img src={editingUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center font-cyber text-xs font-bold text-white">
                      {editingUser.username.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-cyber font-bold text-sm text-white block leading-tight">{editingUser.username}</span>
                  <span className="text-[10px] text-gray-500 font-mono">REGISTRATION: {new Date(editingUser.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">LEVEL</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">XP AMOUNT</label>
                  <input
                    type="number"
                    min={0}
                    value={editXP}
                    onChange={(e) => setEditXP(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">BEST SCORE</label>
                  <input
                    type="number"
                    min={0}
                    max={25000}
                    value={editBestScore}
                    onChange={(e) => setEditBestScore(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">PLAYED</label>
                  <input
                    type="number"
                    min={0}
                    value={editGamesPlayed}
                    onChange={(e) => setEditGamesPlayed(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">WINS</label>
                  <input
                    type="number"
                    min={0}
                    value={editWins}
                    onChange={(e) => setEditWins(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white font-cyber text-xs tracking-wider transition-colors duration-200"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 neon-btn-primary flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Leaderboard Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-cyber-dark border border-white/10 p-6 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-cyber font-bold text-sm text-cyber-cyan flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                EDIT LEADERBOARD STANDING
              </h4>
              <button 
                onClick={() => setEditingEntry(null)}
                className="text-gray-500 hover:text-white transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveEntryEdit} className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-2">
                <span className="text-[10px] text-gray-500 font-cyber block tracking-wider">PLAYER</span>
                <span className="font-cyber font-bold text-sm text-white leading-tight">{editingEntry.username}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-gray-500 font-cyber tracking-wider">TOTAL SCORE</label>
                <input
                  type="number"
                  min={0}
                  max={25000}
                  value={entryScore}
                  onChange={(e) => setEntryScore(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">ACCURACY (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={entryAccuracy}
                    onChange={(e) => setEntryAccuracy(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">COUNTRY (ISO)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={entryCountry}
                    onChange={(e) => setEntryCountry(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider">GAMES PLAYED</label>
                  <input
                    type="number"
                    min={0}
                    value={entryGames}
                    onChange={(e) => setEntryGames(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-cyber tracking-wider font-semibold">WINS</label>
                  <input
                    type="number"
                    min={0}
                    value={entryWins}
                    onChange={(e) => setEntryWins(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-3 py-2 font-rajdhani text-sm font-semibold text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white font-cyber text-xs tracking-wider transition-colors duration-200"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 neon-btn-cyan flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
