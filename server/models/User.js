const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profilePic: {
    type: String, // Base64 compressed image
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  xpNext: {
    type: Number,
    default: 2000
  },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    avgDistance: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 }
  },
  matchHistory: [
    {
      id: String,
      date: String,
      score: Number,
      mode: String,
      rounds: Number,
      accuracy: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
