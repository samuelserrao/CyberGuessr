const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ override: true });

const User = require('./models/User');
const Location = require('./models/Location');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'cyberguessr_fallback_secret';

// Configure CORS and Middleware (Allow large json requests for Base64 profile photos)
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
function connectWithRetry() {
  console.log('Attempting MongoDB connection...');
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB database successfully.');
      await seedAdminUser();
      await seedLocations();
    })
    .catch(err => {
      console.error('MongoDB database connection error:', err.message || err);
      console.log('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
}
connectWithRetry();

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

// Pre-seed default Locations if none exist
async function seedLocations() {
  try {
    const count = await Location.countDocuments();
    if (count === 0) {
      const defaultLocations = [
        {
          name: "Eiffel Tower",
          country: "France",
          lat: 48.8584,
          lng: 2.2945,
          imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located in Western Europe, in the capital city on the Seine River.",
            "Constructed as the entrance arch for the 1889 World's Fair.",
            "Locals nickname this massive iron lattice tower 'La Dame de Fer' (The Iron Lady)."
          ],
          description: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889.",
          isCustom: false
        },
        {
          name: "Statue of Liberty",
          country: "United States",
          lat: 40.6892,
          lng: -74.0445,
          imageUrl: "https://images.unsplash.com/photo-1524008279394-3aed4643b30b?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located on Liberty Island in New York Harbor.",
            "A copper statue gifted by the people of France to the United States.",
            "The figure represents Libertas, the Roman goddess of liberty, holding a torch."
          ],
          description: "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States. The copper statue, a gift from the people of France, was designed by French sculptor Frédéric-Auguste Bartholdi.",
          isCustom: false
        },
        {
          name: "Taj Mahal",
          country: "India",
          lat: 27.1751,
          lng: 78.0421,
          imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located in South Asia, along the banks of the Yamuna River.",
            "An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.",
            "It was built to house the tomb of the emperor's favorite wife, Mumtaz Mahal."
          ],
          description: "The Taj Mahal is an ivory-white marble mausoleum on the southern bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
          isCustom: false
        },
        {
          name: "Giza Pyramid Complex",
          country: "Egypt",
          lat: 29.9792,
          lng: 31.1342,
          imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located in the Sahara Desert, this region sits in North Africa.",
            "The country's capital is Cairo, and the official language is Arabic.",
            "This complex includes the Great Sphinx and three major pyramids built during the Old Kingdom."
          ],
          description: "The Giza Pyramid Complex includes the Great Pyramid of Giza, the Pyramid of Khafre, and the Pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx of Giza. All were built during the Fourth Dynasty of the Old Kingdom of Ancient Egypt.",
          isCustom: false
        },
        {
          name: "The Colosseum",
          country: "Italy",
          lat: 41.8902,
          lng: 12.4922,
          imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located in Southern Europe, in the capital city of this boot-shaped peninsula.",
            "Built of travertine, tuff, and brick-faced concrete under the Flavian dynasty.",
            "It is the largest ancient amphitheatre ever built, famous for gladiatorial contests."
          ],
          description: "The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, constructed under Emperor Vespasian.",
          isCustom: false
        },
        {
          name: "Sydney Opera House",
          country: "Australia",
          lat: -33.8568,
          lng: 151.2153,
          imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located on Bennelong Point in Sydney Harbour, Australia.",
            "Designed by Danish architect Jørn Utzon, featuring distinct shell-like sails.",
            "A multi-venue performing arts centre widely regarded as a 20th-century masterpiece."
          ],
          description: "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour located in Sydney, New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings, designed by Jørn Utzon.",
          isCustom: false
        },
        {
          name: "Golden Gate Bridge",
          country: "United States",
          lat: 37.8199,
          lng: -122.4783,
          imageUrl: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located on the West Coast of the US, spanning a 1-mile-wide strait.",
            "Connects the city of San Francisco to Marin County.",
            "Famous for its international orange color and elegant suspension towers."
          ],
          description: "The Golden Gate Bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean. The structure links the U.S. city of San Francisco to Marin County.",
          isCustom: false
        },
        {
          name: "Christ the Redeemer",
          country: "Brazil",
          lat: -22.9519,
          lng: -43.2105,
          imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located at the summit of Corcovado Mountain in Rio de Janeiro.",
            "An Art Deco statue of Jesus Christ, standing 30 meters tall.",
            "A symbol of Christianity globally, constructed between 1922 and 1931."
          ],
          description: "Christ the Redeemer is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil, created by French sculptor Paul Landowski and built by Brazilian engineer Heitor da Silva Costa, in collaboration with French engineer Albert Caquot.",
          isCustom: false
        },
        {
          name: "Great Wall of China",
          country: "China",
          lat: 40.4319,
          lng: 116.5704,
          imageUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "A series of fortifications built across the historical northern borders of this East Asian country.",
            "Constructed to protect against nomadic groups from the Eurasian Steppe.",
            "Several walls were built as early as the 7th century BC, later joined by the first Emperor Qin Shi Huang."
          ],
          description: "The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against nomadic groups. Stretching over 21,196 km, it is a UNESCO World Heritage site.",
          isCustom: false
        },
        {
          name: "Tower Bridge",
          country: "United Kingdom",
          lat: 51.5055,
          lng: -0.0754,
          imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located in London, crossing the River Thames close to the Tower of London.",
            "A combined bascule and suspension bridge built between 1886 and 1894.",
            "Features two massive towers constructed on piers, housing the drawbridge engines."
          ],
          description: "Tower Bridge is a Grade I listed combined bascule and suspension bridge in London, built between 1886 and 1894, designed by Horace Jones and engineered by John Wolfe Barry. It has become an iconic landmark of London.",
          isCustom: false
        },
        {
          name: "Machu Picchu",
          country: "Peru",
          lat: -13.1631,
          lng: -72.5450,
          imageUrl: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Set high in the Andes Mountains of South America.",
            "Built in the 15th century and later abandoned, it is renowned for its sophisticated dry-stone walls.",
            "It was constructed as an estate for the Inca emperor Pachacuti."
          ],
          description: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru, on a 2,430-meter mountain ridge. It was built around 1450, abandoned a century later during the Spanish Conquest, and rediscovered in 1911.",
          isCustom: false
        },
        {
          name: "Big Ben & Westminster",
          country: "United Kingdom",
          lat: 51.5007,
          lng: -0.1246,
          imageUrl: "https://images.unsplash.com/photo-1529655683826-aba9b3e21f83?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "The nickname for the Great Bell of the striking clock at the north end of the Palace of Westminster.",
            "Designed by Augustus Pugin in a Gothic Revival style.",
            "The tower stands 96 meters tall and is an iconic cultural symbol of London."
          ],
          description: "Big Ben is the nickname for the Great Bell of the striking clock at the north end of the Palace of Westminster in London, England, and the name is frequently extended to refer also to the clock and the clock tower, now named Elizabeth Tower.",
          isCustom: false
        },
        {
          name: "Mount Fuji",
          country: "Japan",
          lat: 35.3606,
          lng: 138.7274,
          imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "An active stratovolcano that last erupted in 1707–1708.",
            "The tallest peak in this East Asian island nation, rising 3,776 meters.",
            "Commonly depicted in art, especially woodblock prints like Hokusai's Thirty-six Views."
          ],
          description: "Mount Fuji is the tallest mountain in Japan, standing at 3,776.24 m. It is an active stratovolcano that last erupted in 1707. Located on the island of Honshu, it is one of Japan's Three Holy Mountains.",
          isCustom: false
        },
        {
          name: "Leaning Tower of Pisa",
          country: "Italy",
          lat: 43.7230,
          lng: 10.3966,
          imageUrl: "https://images.unsplash.com/photo-1543012478-915c1fa58c70?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "The campanile, or freestanding bell tower, of the cathedral in this Tuscan city.",
            "Known worldwide for its nearly four-degree lean, the result of an unstable foundation.",
            "Construction began in 1173 and took nearly 200 years to complete due to wars."
          ],
          description: "The Leaning Tower of Pisa is the campanile, or freestanding bell tower, of Pisa Cathedral. It is known for its nearly four-degree lean, the result of an unstable foundation. The tower is situated behind Pisa Cathedral.",
          isCustom: false
        },
        {
          name: "Chichen Itza",
          country: "Mexico",
          lat: 20.6843,
          lng: -88.5678,
          imageUrl: "https://images.unsplash.com/photo-1518638150341-db70061e8021?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located in North America, on the flat limestone peninsula of Yucatan.",
            "A large pre-Columbian city built by the Maya people of the Terminal Classic period.",
            "Dominating the center is the step-pyramid temple of Kukulcan (El Castillo)."
          ],
          description: "Chichen Itza was a large pre-Columbian city built by the Maya people. The archaeological site is located in Yucatan State, Mexico. The stepped pyramid, El Castillo, serves as a temple to the feathered serpent deity Kukulcan.",
          isCustom: false
        },
        {
          name: "Grand Canyon",
          country: "United States",
          lat: 36.0544,
          lng: -112.1401,
          imageUrl: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "A steep-sided canyon carved by the Colorado River in Arizona.",
            "It is 277 miles long, up to 18 miles wide, and attains a depth of over a mile.",
            "Exposes layered bands of red rock, revealing millions of years of geological history."
          ],
          description: "The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona, United States. The Grand Canyon is 277 miles long, up to 18 miles wide and attains a depth of over a mile, managed by Grand Canyon National Park.",
          isCustom: false
        },
        {
          name: "Burj Khalifa",
          country: "United Arab Emirates",
          lat: 25.1972,
          lng: 55.2744,
          imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "A massive skyscraper in Downtown Dubai.",
            "The tallest structure and building in the world since its topping out in 2009.",
            "Features a triple-lobed footprint inspired by the Hymenocallis flower."
          ],
          description: "The Burj Khalifa is a skyscraper in Dubai, United Arab Emirates. With a total height of 829.8 m and a roof height of 828 m, the Burj Khalifa has been the tallest structure and building in the world since its topping out in 2009.",
          isCustom: false
        },
        {
          name: "Acropolis of Athens",
          country: "Greece",
          lat: 37.9715,
          lng: 23.7257,
          imageUrl: "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "An ancient citadel located on a rocky outcrop above the capital city of this Mediterranean country.",
            "It contains the remains of several ancient buildings of great architectural significance.",
            "The most famous structure on the site is the Parthenon, dedicated to the goddess Athena."
          ],
          description: "The Acropolis of Athens is an ancient citadel located on a rocky outcrop above the city of Athens, Greece. It contains the remains of several ancient buildings of great architectural and historical significance, the Parthenon being the most complete.",
          isCustom: false
        },
        {
          name: "Louvre Pyramid",
          country: "France",
          lat: 48.8606,
          lng: 2.3376,
          imageUrl: "https://images.unsplash.com/photo-1597910037310-7cca8d3c5f6f?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "A large glass and metal pyramid in the main courtyard of a landmark Paris museum.",
            "Designed by Chinese-American architect I. M. Pei, completed in 1989.",
            "Serves as the main entrance to the world's most-visited art museum."
          ],
          description: "The Louvre Pyramid is a large glass and metal pyramid designed by Chinese-American architect I. M. Pei, surrounded by three smaller pyramids, in the main courtyard of the Palais du Louvre in Paris. It serves as the main entrance to the Louvre Museum.",
          isCustom: false
        },
        {
          name: "Stonehenge",
          country: "United Kingdom",
          lat: 51.1789,
          lng: -1.8262,
          imageUrl: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?q=80&w=2000&auto=format&fit=crop",
          clues: [
            "Located on Salisbury Plain in southwest England.",
            "A prehistoric monument consisting of an outer ring of vertical sarsen standing stones.",
            "Architects estimate it was constructed from 3000 BC to 2000 BC."
          ],
          description: "Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England, consisting of an outer ring of vertical sarsen standing stones, each around 13 feet high, topped by connecting horizontal lintel stones. It remains one of the world's most famous megalithic circles.",
          isCustom: false
        }
      ];
      await Location.insertMany(defaultLocations);
      console.log('Successfully seeded 20 default game locations into MongoDB.');
    }
  } catch (error) {
    console.error('Error seeding default game locations:', error);
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
          passwordHash: localUser.passwordHash || localUser.password || 'offline_sync_fallback_hash',
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
      } else if (existingUser.passwordHash === 'offline_sync_fallback_hash' && localUser.passwordHash) {
        // Repair the password hash for previously incorrectly-synced users
        existingUser.passwordHash = localUser.passwordHash;
        await existingUser.save();
        syncedUsers.push(usernameLower + ' (repaired)');
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

// --- LOCATION CONTROL ROUTING ---

// Get all active locations
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find({}).sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    console.error('Get locations failure:', err);
    res.status(500).json({ message: 'Server failed to retrieve locations' });
  }
});

// Admin add manual location
app.post('/api/locations', authenticateToken, async (req, res) => {
  try {
    if (req.user.username.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role authorization required' });
    }
    
    const { name, country, lat, lng, imageUrl, clues, description } = req.body;
    
    if (!name || !country || lat === undefined || lng === undefined || !imageUrl) {
      return res.status(400).json({ message: 'Missing required location fields' });
    }
    
    const newLoc = new Location({
      name: name.trim(),
      country: country.trim(),
      lat: Number(lat),
      lng: Number(lng),
      imageUrl,
      clues: Array.isArray(clues) ? clues : [],
      description: description ? description.trim() : '',
      isCustom: true
    });
    
    await newLoc.save();
    res.status(201).json(newLoc);
  } catch (err) {
    console.error('Create location failure:', err);
    res.status(500).json({ message: 'Server failed to create custom location' });
  }
});

// Admin delete manual location
app.delete('/api/locations/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.username.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role authorization required' });
    }
    
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Target location not found' });
    
    res.json({ message: 'Location deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Delete location failure:', err);
    res.status(500).json({ message: 'Server failed to delete location' });
  }
});


// Health check endpoint to verify database connection status without triggering a query timeout
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  if (readyState === 1) {
    res.json({ status: 'ok', database: 'connected' });
  } else {
    res.status(503).json({ status: 'down', database: 'disconnected', readyState });
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

// Export app for serverless deployments (like Vercel) and listen locally for development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Express API Server listening on port ${PORT}`);
  });
}

module.exports = app;

