const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ override: true });

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'cyberguessr_fallback_secret';

// Configure CORS and Middleware (Allow large json requests for Base64 profile photos)
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB database successfully.');
    await seedAdminUser();
  })
  .catch(err => {
    console.error('MongoDB database connection error:', err);
  });

// Pre-seed default Admin user
async function seedAdminUser() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin', salt);
      
      const admin = new User({
        username: 'admin',
        passwordHash,
        profilePic: null,
        level: 99,
        xp: 0,
        xpNext: 10000,
        stats: {
          gamesPlayed: 0,
          wins: 0,
          avgDistance: 0,
          bestScore: 25000
        },
        matchHistory: []
      });
      await admin.save();
      console.log('Default Admin user pre-seeded in MongoDB: (admin/admin)');
    }
  } catch (error) {
    console.error('Error pre-seeding admin user:', error);
  }
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access Token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired Token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTING ---

// User Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, profilePic } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Callsign taken: Username already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username: username.trim(),
      passwordHash,
      profilePic: profilePic || null
    });
    
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without passwordHash
    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;
    
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server authentication failure during registration' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Unknown callsign: Account not found' });
    }
    
    // Support comparing both bcrypt hashes and simple offline fallback hashes
    const isMatch = await (async () => {
      if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
        return await bcrypt.compare(password, user.passwordHash);
      }
      
      // Check if it matches the offline simpleHash
      const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash |= 0;
        }
        return hash.toString(36);
      };
      
      const isSimpleMatch = user.passwordHash === simpleHash(password);
      if (isSimpleMatch) {
        // Upgrade user to secure bcrypt hash
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        await user.save();
        return true;
      }
      return false;
    })();

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials: Password incorrect' });
    }
    
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    
    res.json({ token, user: userResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server login failure' });
  }
});

// Sync offline users from localStorage into MongoDB on start/connect
app.post('/api/auth/sync', async (req, res) => {
  try {
    const { localUsers } = req.body;
    if (!Array.isArray(localUsers)) {
      return res.status(400).json({ message: 'Invalid localUsers payload' });
    }

    const syncedUsers = [];
    for (const localUser of localUsers) {
      if (!localUser.username) continue;
      const usernameLower = localUser.username.toLowerCase().trim();
      if (usernameLower === 'admin') continue;

      const existingUser = await User.findOne({ username: usernameLower });
      if (!existingUser) {
        const newUser = new User({
          username: usernameLower,
          passwordHash: localUser.password || 'offline_sync_fallback_hash',
          profilePic: localUser.profilePic || null,
          level: localUser.level || 1,
          xp: localUser.xp || 0,
          xpNext: localUser.xpNext || 2000,
          stats: {
            gamesPlayed: localUser.stats?.gamesPlayed || 0,
            wins: localUser.stats?.wins || 0,
            bestScore: localUser.stats?.bestScore || 0,
            avgDistance: localUser.stats?.avgDistance || 0
          },
          matchHistory: localUser.matchHistory || []
        });
        await newUser.save();
        syncedUsers.push(usernameLower);
      }
    }
    res.json({ message: 'Synchronization complete', syncedUsers });
  } catch (err) {
    console.error('Offline users sync error:', err);
    res.status(500).json({ message: 'Server error during database synchronization' });
  }
});

// --- USER PROFILE & STATS ROUTING ---

// Get active profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server failed to retrieve profile' });
  }
});

// Update profile details (username, profilePic, settings)
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { username, profilePic } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (username && username.toLowerCase() !== user.username.toLowerCase()) {
      const nameConflict = await User.findOne({ username: username.toLowerCase() });
      if (nameConflict) {
        return res.status(400).json({ message: 'Callsign taken: Username already exists' });
      }
      user.username = username.trim();
    }
    
    if (profilePic !== undefined) {
      user.profilePic = profilePic;
    }
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server failed to save profile modifications' });
  }
});

// Submit round stats and XP increments
app.post('/api/users/xp', authenticateToken, async (req, res) => {
  try {
    const { xpAmount, finalScore, gameMode } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Increment XP
    let newXp = user.xp + xpAmount;
    let newLevel = user.level;
    let newXpNext = user.xpNext;
    
    if (newXp >= user.xpNext) {
      newXp -= user.xpNext;
      newLevel += 1;
      newXpNext = Math.round(user.xpNext * 1.25);
    }
    
    // Calculate accuracy
    const maxPossibleScore = (gameMode === 'multiplayer' ? 3 : 5) * 5000;
    const gameAccuracy = Math.round((finalScore / maxPossibleScore) * 100);
    
    const newMatch = {
      id: `m_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      score: finalScore,
      mode: gameMode === 'standard' ? 'Standard Play' : gameMode === 'daily' ? 'Daily Challenge' : 'Multiplayer Clash',
      rounds: gameMode === 'multiplayer' ? 3 : 5,
      accuracy: gameAccuracy
    };
    
    user.xp = newXp;
    user.level = newLevel;
    user.xpNext = newXpNext;
    user.matchHistory.push(newMatch);
    
    const newBestScore = Math.max(user.stats.bestScore || 0, finalScore);
    user.stats.gamesPlayed += 1;
    if (finalScore > 7500) {
      user.stats.wins += 1;
    }
    user.stats.bestScore = newBestScore;
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    res.json({ user: userResponse, leveledUp: newLevel > userResponse.level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server failed to write match records' });
  }
});

// --- ADMIN CONTROL ROUTING ---

// List all registered users (Admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.username.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role authorization required' });
    }
    
    const allUsers = await User.find({}).select('-passwordHash');
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: 'Server failed to retrieve user list' });
  }
});

// Admin update user details
app.put('/api/admin/users/:username', authenticateToken, async (req, res) => {
  try {
    if (req.user.username.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role authorization required' });
    }
    
    const targetUsername = req.params.username.toLowerCase();
    const user = await User.findOne({ username: targetUsername });
    if (!user) return res.status(404).json({ message: 'Target user not found' });
    
    const { level, xp, stats } = req.body;
    
    if (level !== undefined) user.level = Number(level);
    if (xp !== undefined) user.xp = Number(xp);
    if (stats) {
      if (stats.gamesPlayed !== undefined) user.stats.gamesPlayed = Number(stats.gamesPlayed);
      if (stats.wins !== undefined) user.stats.wins = Number(stats.wins);
      if (stats.bestScore !== undefined) user.stats.bestScore = Number(stats.bestScore);
    }
    
    await user.save();
    res.json({ message: 'User stats updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server failed to update user parameters' });
  }
});

// Admin retire / delete user
app.delete('/api/admin/users/:username', authenticateToken, async (req, res) => {
  try {
    if (req.user.username.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role authorization required' });
    }
    
    const targetUsername = req.params.username.toLowerCase();
    if (targetUsername === 'admin') {
      return res.status(400).json({ message: 'Command security: Cannot retire system administrator' });
    }
    
    const deleted = await User.findOneAndDelete({ username: targetUsername });
    if (!deleted) return res.status(404).json({ message: 'Target user not found' });
    
    res.json({ message: `User account '${targetUsername}' retired successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server failed to delete user' });
  }
});

// --- GLOBAL LEADERBOARDS ROUTING ---

app.get('/api/leaderboard', async (req, res) => {
  try {
    // Sort users by bestScore descending
    const leaderboard = await User.find({ username: { $ne: 'admin' } })
      .select('username level stats.bestScore stats.gamesPlayed stats.wins matchHistory')
      .sort({ 'stats.bestScore': -1 })
      .limit(20);
      
    const formatted = leaderboard.map((user, idx) => {
      // Calculate average accuracy if they have matches
      const accuracies = user.matchHistory.map(m => m.accuracy).filter(a => a !== undefined);
      const avgAcc = accuracies.length > 0 ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length) : 0;
      
      return {
        rank: idx + 1,
        username: user.username,
        score: user.stats.bestScore || 0,
        gamesPlayed: user.stats.gamesPlayed || 0,
        wins: user.stats.wins || 0,
        countryCode: 'US', // default geo placeholder
        accuracy: avgAcc || 0
      };
    });
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server failed to retrieve leaderboards' });
  }
});

app.listen(PORT, () => {
  console.log(`Express API Server listening on port ${PORT}`);
});
