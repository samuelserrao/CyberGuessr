import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Camera, 
  Shield, 
  AlertTriangle,
  Compass,
  ChevronRight,
  Sparkles
} from 'lucide-react';

import { api } from '../utils/api';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null); // Base64 string
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Compress profile picture using canvas to save localStorage space
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('INVALID FILE FORMAT: Please upload an image (JPG, PNG, GIF).');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('FILE TOO LARGE: Maximum 2MB allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      compressImage(event.target.result, (compressedDataUrl) => {
        setProfilePic(compressedDataUrl);
        setError('');
      });
    };
    reader.readAsDataURL(file);
  };

  // Simple hash function for passwords (not cryptographically secure, but fine for localStorage demo)
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString(36);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      if (mode === 'signup') {
        // Validation
        if (username.trim().length < 3) {
          setError('CALLSIGN TOO SHORT: Minimum 3 characters required.');
          setIsLoading(false);
          return;
        }
        if (password.length < 4) {
          setError('WEAK CIPHER: Password must be at least 4 characters.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('CIPHER MISMATCH: Passwords do not match.');
          setIsLoading(false);
          return;
        }

        // Call API Sign Up (MongoDB or Local Fallback)
        api.signup(username, password, profilePic)
          .then(newUser => {
            localStorage.setItem('geoGuessr_currentUser', username.toLowerCase().trim());
            onLogin(newUser);
          })
          .catch(err => {
            setError(err.message || 'REGISTRATION REJECTED: Server error.');
            setIsLoading(false);
          });

      } else {
        // Sign In
        if (!username.trim() || !password) {
          setError('FIELDS REQUIRED: Enter both callsign and cipher.');
          setIsLoading(false);
          return;
        }

        // Call API Login (MongoDB or Local Fallback)
        api.login(username, password)
          .then(user => {
            localStorage.setItem('geoGuessr_currentUser', username.toLowerCase().trim());
            onLogin(user);
          })
          .catch(err => {
            setError(err.message || 'AUTHENTICATION REJECTED: Invalid credentials.');
            setIsLoading(false);
          });
      }
    }, 800);
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden select-none px-4">
      
      {/* Animated background grid */}
      <div className="absolute inset-0 login-grid-bg opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#03000a_80%)]" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              boxShadow: `0 0 8px ${i % 2 === 0 ? '#06b6d4' : '#8b5cf6'}`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cyber-cyan/30 to-cyber-primary/30 border border-cyber-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-4"
          >
            <Compass className="w-8 h-8 text-cyber-cyan" />
          </motion.div>
          <h1 className="font-cyber text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-1">
            GEO WORLD <span className="cyber-logo">GUESSR</span>
          </h1>
          <p className="text-gray-500 font-rajdhani text-xs tracking-[0.25em] uppercase">
            Geographical Reconnaissance Protocol
          </p>
        </div>

        {/* Card Container */}
        <div className="login-card bg-glass border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Mode Toggle Header */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-3.5 font-cyber text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                mode === 'signin'
                  ? 'text-cyber-cyan border-b-2 border-cyber-cyan bg-cyber-cyan/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <LogIn className="w-4 h-4" />
              SIGN IN
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-3.5 font-cyber text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                mode === 'signup'
                  ? 'text-cyber-primary border-b-2 border-cyber-primary bg-cyber-primary/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              CREATE ACCOUNT
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >

                {/* Profile Picture Upload (Signup only) */}
                {mode === 'signup' && (
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase mb-3">
                      AGENT PROFILE IMAGE
                    </span>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 hover:border-cyber-cyan/60 bg-black/40 flex items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden"
                    >
                      {profilePic ? (
                        <>
                          <img 
                            src={profilePic} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-500 group-hover:text-cyber-cyan transition-colors duration-300">
                          <Camera className="w-7 h-7" />
                          <span className="text-[8px] font-cyber tracking-wider">UPLOAD</span>
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
                    <span className="text-[9px] text-gray-600 font-mono mt-2">
                      Optional • JPG, PNG • Max 2MB
                    </span>
                  </div>
                )}

                {/* Username Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase">
                    CALLSIGN
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your callsign..."
                    maxLength={18}
                    required
                    className="login-input w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-4 py-3 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase">
                    CIPHER KEY
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter cipher key..."
                      required
                      className="login-input w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-4 py-3 pr-12 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-cyan transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Signup only) */}
                {mode === 'signup' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 font-cyber tracking-wider uppercase">
                      CONFIRM CIPHER KEY
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter cipher key..."
                      required
                      className="login-input w-full bg-black/40 border border-white/10 focus:border-cyber-cyan/50 rounded-lg px-4 py-3 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
                    />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-cyber tracking-wider"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full relative py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider text-white flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyber-cyan to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                  : 'bg-gradient-to-r from-cyber-primary to-cyber-secondary shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]'
              } hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  AUTHENTICATING...
                </>
              ) : mode === 'signin' ? (
                <>
                  <Shield className="w-4 h-4" />
                  AUTHENTICATE
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  REGISTER AGENT
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch Mode Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={switchMode}
                className="text-xs font-rajdhani text-gray-500 hover:text-cyber-cyan transition-colors duration-200"
              >
                {mode === 'signin' 
                  ? 'New agent? Create an account →' 
                  : 'Already registered? Sign in →'
                }
              </button>
            </div>

          </form>
        </div>

        {/* Bottom System Credits */}
        <div className="text-center mt-6">
          <p className="text-[9px] font-cyber text-gray-700 tracking-wider">
            GEO WORLD GUESSR v0.4.15 // SECURE AUTH PROTOCOL
          </p>
        </div>

      </motion.div>
    </div>
  );
}
