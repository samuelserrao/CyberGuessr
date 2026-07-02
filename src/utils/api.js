import { LEADERBOARD } from './mockData';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : '/api';

// Check if backend is available (cached with periodic background polling for zero latency)
let isBackendAvailable = false;
let hasCheckedOnce = false;
let checkPromise = null;

async function checkBackend() {
  if (hasCheckedOnce) {
    return isBackendAvailable;
  }
  
  if (checkPromise) {
    return checkPromise;
  }

  checkPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s timeout max
      const res = await fetch(`${API_URL}/leaderboard`, { 
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      isBackendAvailable = res.ok;
    } catch (e) {
      isBackendAvailable = false;
    }
    hasCheckedOnce = true;
    checkPromise = null;
    return isBackendAvailable;
  })();

  return checkPromise;
}

// Run initial check on startup
checkBackend();

// Silent background polling to update availability status reactively and trigger database sync
setInterval(async () => {
  const wasAvailable = isBackendAvailable;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_URL}/leaderboard`, { 
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    isBackendAvailable = res.ok;

    // Trigger sync automatically when the backend transitions from offline to online
    if (isBackendAvailable && !wasAvailable) {
      console.log('Backend detected online. Starting automatic profile sync to MongoDB...');
      api.syncLocalUsers()
        .then(syncRes => {
          if (syncRes?.syncedUsers?.length > 0) {
            console.log(`Successfully synced ${syncRes.syncedUsers.length} offline profiles to MongoDB:`, syncRes.syncedUsers);
          }
        })
        .catch(err => {
          console.warn('Background profile sync failed:', err.message);
        });
    }
  } catch (e) {
    isBackendAvailable = false;
  }
}, 10000);

// Helper to get local storage users list
const getLocalUsers = () => JSON.parse(localStorage.getItem('geoGuessr_users') || '{}');
const saveLocalUsers = (users) => localStorage.setItem('geoGuessr_users', JSON.stringify(users));

export const api = {
  isAvailable: () => isBackendAvailable,
  checkAvailability: checkBackend,

  // Auth API
  signup: async (username, password, profilePic) => {
    await checkBackend();
    if (isBackendAvailable) {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, profilePic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('geoGuessr_token', data.token);
      return data.user;
    } else {
      // Local storage fallback
      const users = getLocalUsers();
      const userKey = username.toLowerCase().trim();
      if (users[userKey]) throw new Error('Callsign taken: Username already exists');
      
      const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash |= 0;
        }
        return hash.toString(36);
      };

      const newUser = {
        username: username.trim(),
        passwordHash: simpleHash(password),
        profilePic: profilePic || null,
        level: 1,
        xp: 0,
        xpNext: 2000,
        stats: { gamesPlayed: 0, wins: 0, avgDistance: 0, bestScore: 0 },
        matchHistory: [],
        createdAt: new Date().toISOString()
      };
      users[userKey] = newUser;
      saveLocalUsers(users);
      return newUser;
    }
  },

  login: async (username, password) => {
    await checkBackend();
    if (isBackendAvailable) {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('geoGuessr_token', data.token);
      return data.user;
    } else {
      // Local storage fallback
      const users = getLocalUsers();
      const userKey = username.toLowerCase().trim();
      const user = users[userKey];
      if (!user) throw new Error('Unknown callsign: Account not found');
      
      const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash |= 0;
        }
        return hash.toString(36);
      };

      if (user.passwordHash !== simpleHash(password)) throw new Error('Invalid credentials: Password incorrect');
      return user;
    }
  },

  // Profile API
  updateProfile: async (username, profilePic) => {
    await checkBackend();
    if (isBackendAvailable) {
      const token = localStorage.getItem('geoGuessr_token');
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, profilePic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update profile failed');
      return data;
    } else {
      // Local storage fallback
      const currentUserKey = localStorage.getItem('geoGuessr_currentUser');
      if (!currentUserKey) throw new Error('Session inactive');
      const users = getLocalUsers();
      const user = users[currentUserKey];
      if (!user) throw new Error('User not found');

      if (username && username.toLowerCase() !== currentUserKey) {
        if (users[username.toLowerCase()]) throw new Error('Callsign taken: Username already exists');
        user.username = username;
        delete users[currentUserKey];
        users[username.toLowerCase()] = user;
        localStorage.setItem('geoGuessr_currentUser', username.toLowerCase());
      }
      if (profilePic !== undefined) user.profilePic = profilePic;
      saveLocalUsers(users);
      return user;
    }
  },

  // Save XP / Match results API
  addXP: async (xpAmount, finalScore, gameMode) => {
    await checkBackend();
    if (isBackendAvailable) {
      const token = localStorage.getItem('geoGuessr_token');
      const res = await fetch(`${API_URL}/users/xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpAmount, finalScore, gameMode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'XP accumulation failed');
      return data.user;
    } else {
      return null;
    }
  },

  // Admin control API
  getUsers: async () => {
    await checkBackend();
    if (isBackendAvailable) {
      const token = localStorage.getItem('geoGuessr_token');
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to list users');
      return data;
    } else {
      // Local fallback
      return Object.values(getLocalUsers());
    }
  },

  updateUserStats: async (username, payload) => {
    await checkBackend();
    if (isBackendAvailable) {
      const token = localStorage.getItem('geoGuessr_token');
      const res = await fetch(`${API_URL}/admin/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user');
      return data.user;
    } else {
      // Local fallback
      const users = getLocalUsers();
      const user = users[username.toLowerCase()];
      if (!user) throw new Error('User not found');
      
      const { level, xp, stats } = payload;
      if (level !== undefined) user.level = Number(level);
      if (xp !== undefined) user.xp = Number(xp);
      if (stats) {
        if (stats.gamesPlayed !== undefined) user.stats.gamesPlayed = Number(stats.gamesPlayed);
        if (stats.wins !== undefined) user.stats.wins = Number(stats.wins);
        if (stats.bestScore !== undefined) user.stats.bestScore = Number(stats.bestScore);
      }
      saveLocalUsers(users);
      return user;
    }
  },

  deleteUser: async (username) => {
    await checkBackend();
    if (isBackendAvailable) {
      const token = localStorage.getItem('geoGuessr_token');
      const res = await fetch(`${API_URL}/admin/users/${username}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      return data;
    } else {
      // Local fallback
      const users = getLocalUsers();
      const userKey = username.toLowerCase();
      if (!users[userKey]) throw new Error('User not found');
      delete users[userKey];
      saveLocalUsers(users);
      return { message: 'User deleted' };
    }
  },

  // Leaderboard API
  getLeaderboard: async () => {
    await checkBackend();
    if (isBackendAvailable) {
      const res = await fetch(`${API_URL}/leaderboard`, { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
      return data;
    } else {
      // Local fallback
      const localLeaderboard = JSON.parse(localStorage.getItem('geoGuessr_leaderboard') || '[]');
      if (localLeaderboard.length === 0) {
        localStorage.setItem('geoGuessr_leaderboard', JSON.stringify(LEADERBOARD));
        return LEADERBOARD;
      }
      return localLeaderboard;
    }
  },

  // Sync Local Users to MongoDB
  syncLocalUsers: async () => {
    await checkBackend();
    if (!isBackendAvailable) return { message: 'Server offline, skipping sync' };
    
    const usersObj = getLocalUsers();
    const localUsers = Object.values(usersObj);
    if (localUsers.length === 0) return { message: 'No local users to sync' };

    try {
      const res = await fetch(`${API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localUsers })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to sync local users');
      return data;
    } catch (err) {
      console.error('Error syncing local users to backend:', err);
      throw err;
    }
  }
};
