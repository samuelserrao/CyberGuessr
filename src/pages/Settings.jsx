import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Volume2, VolumeX, Sliders, User, Globe, Clock, CheckCircle, Camera, LogOut, Trash2 } from 'lucide-react';

export default function Settings({ userProfile, setUserProfile, settings, setSettings, onLogout }) {
  const [username, setUsername] = useState(userProfile?.username || '');
  const [profilePic, setProfilePic] = useState(userProfile?.profilePic || null);
  const [mapTheme, setMapTheme] = useState(settings.mapTheme || 'tactical');
  const [timerLimit, setTimerLimit] = useState(settings.timerLimit || 60);
  const [sound, setSound] = useState(settings.sound !== false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('googleApiKey') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Compress profile picture to save localStorage space
  const compressImage = (dataUrl, callback) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 120;
      const MAX_HEIGHT = 120;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.75));
    };
  };

  // Handle profile picture file selection
  const handlePicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      compressImage(event.target.result, (compressedDataUrl) => {
        setProfilePic(compressedDataUrl);
      });
    };
    reader.readAsDataURL(file);
  };

  const removePic = () => {
    setProfilePic(null);
  };

  // Get user initials for fallback avatar
  const getInitials = () => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save profile username and picture
    setUserProfile(prev => ({
      ...prev,
      username: username,
      profilePic: profilePic
    }));

    // Save API key
    localStorage.setItem('googleApiKey', apiKey);

    // Save game preferences
    setSettings({
      sound,
      mapTheme,
      timerLimit
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const mapThemes = [
    { id: 'tactical', label: 'Tactical Cyber', desc: 'Glowing violet fills and cyan outlines.' },
    { id: 'satellite', label: 'Sat-Map Vector', desc: 'Slightly muted greens and dark grey borders.' },
    { id: 'outline', label: 'Wireframe HUD', desc: 'Minimalist neon vector grids.' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 select-none min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="font-cyber text-3xl md:text-5xl font-black tracking-wider text-white uppercase mb-2">
          CONTROL CENTER
        </h2>
        <p className="text-gray-400 font-rajdhani text-sm md:text-base tracking-[0.2em] uppercase">
          Configure Navigation Interface
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: User Profile Settings */}
        <div className="bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
          <h3 className="font-cyber font-bold text-xs text-cyber-cyan tracking-wider uppercase mb-5 flex items-center gap-2">
            <User className="w-4 h-4" />
            NAVIGATOR IDENTIFICATION
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-cyber mb-2 block tracking-wider uppercase">AGENT PROFILE IMAGE</span>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 hover:border-cyber-cyan/60 bg-black/40 overflow-hidden cursor-pointer transition-all duration-300 group profile-pic-ring"
              >
                {profilePic ? (
                  <>
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center font-cyber font-black text-2xl text-white group-hover:opacity-80 transition-opacity duration-300">
                    {getInitials()}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePicUpload}
                className="hidden"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[9px] font-cyber text-cyber-cyan hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" />
                  {profilePic ? 'CHANGE' : 'UPLOAD'}
                </button>
                {profilePic && (
                  <button
                    type="button"
                    onClick={removePic}
                    className="text-[9px] font-cyber text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    REMOVE
                  </button>
                )}
              </div>
            </div>

            {/* Username & API Key Inputs */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase">CALLSIGN (USERNAME)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={18}
                  required
                  className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-4 py-2.5 font-rajdhani text-base font-semibold text-white focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase">GOOGLE MAPS API KEY (OPTIONAL)</label>
                <input
                  type="password"
                  placeholder="Enter key for premium satellite feeds..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-4 py-2.5 font-rajdhani text-base font-semibold text-white focus:outline-none transition-all duration-300"
                />
                <span className="text-[9px] text-gray-500 font-mono">Keyless requests run in Google Development Mode with a watermark.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: HUD Preferences */}
        <div className="bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md text-left">
          <h3 className="font-cyber font-bold text-xs text-cyber-cyan tracking-wider uppercase mb-5 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            INTERFACE & NAVIGATION
          </h3>

          <div className="space-y-6">
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-cyber font-bold text-sm text-white mb-0.5 tracking-wide flex items-center gap-1.5">
                  {sound ? <Volume2 className="w-4.5 h-4.5 text-cyber-cyan" /> : <VolumeX className="w-4.5 h-4.5 text-gray-500" />}
                  SYNTHESISER AUDIO BEEPS
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Retro cyberpunk chime alerts when matching coordinate grids.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSound(!sound)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 ${
                  sound ? 'bg-cyber-cyan' : 'bg-gray-800'
                }`}
              >
                <div 
                  className={`w-4.5 h-4.5 bg-white rounded-full transition-transform duration-300 ${
                    sound ? 'transform translate-x-5.5' : ''
                  }`} 
                />
              </button>
            </div>

            <div className="h-px bg-white/5" />

            {/* Timer Length */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cyber font-bold text-sm text-white mb-0.5 tracking-wide flex items-center gap-1.5">
                    <Clock className="w-4.5 h-4.5 text-cyber-cyan" />
                    CHRONO COUNTER LIMIT
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Time allotment to locate the StreetView target.
                  </p>
                </div>
                <span className="font-cyber font-bold text-sm text-cyber-cyan">{timerLimit} SECONDS</span>
              </div>
              <div className="flex gap-2">
                {[30, 60, 120].map(seconds => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => setTimerLimit(seconds)}
                    className={`flex-1 py-2 rounded-lg font-cyber text-xs border tracking-wider transition-all duration-200 ${
                      timerLimit === seconds 
                        ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_8px_rgba(6,182,212,0.1)]' 
                        : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Map Theme selection */}
            <div className="flex flex-col gap-3">
              <h4 className="font-cyber font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                <Globe className="w-4.5 h-4.5 text-cyber-cyan" />
                TACTICAL WORLD SKIN
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mapThemes.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setMapTheme(theme.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      mapTheme === theme.id 
                        ? 'border-cyber-cyan bg-cyber-cyan/10' 
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <span className="font-cyber font-bold text-xs text-white block mb-1">
                      {theme.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      {theme.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex items-center justify-between gap-4">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1.5 text-cyber-neonGreen font-cyber text-xs"
              >
                <CheckCircle className="w-4 h-4" />
                PROTOCOL SAVED SUCCESSFULLY
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="neon-btn-primary ml-auto flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            COMMIT PROTOCOL
          </button>
        </div>

      </form>

      {/* Danger Zone - Logout */}
      <div className="mt-8 bg-glass border border-red-500/20 p-6 rounded-2xl backdrop-blur-md text-left">
        <h3 className="font-cyber font-bold text-xs text-red-400 tracking-wider uppercase mb-4 flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          SESSION CONTROL
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          Terminate your current session. Your profile data will be preserved and you can log back in anytime.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="py-2.5 px-6 rounded-lg border border-red-500/40 hover:border-red-500 hover:bg-red-500/15 text-red-400 hover:text-red-300 font-cyber font-bold text-xs tracking-wider transition-all duration-200 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          TERMINATE SESSION
        </button>
      </div>

    </div>
  );
}
