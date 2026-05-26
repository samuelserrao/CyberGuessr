// Mock data for Geo World Guessr game

export const LOCATIONS = [
  {
    id: 1,
    name: "Kyoto Traditional Street",
    country: "Japan",
    lat: 35.0116,
    lng: 135.7681,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Look at the wooden Machiya townhouses and stone-paved streets.",
      "A famous wooden pagoda (Yasaka Pagoda) stands in this district.",
      "The country is known for its Shinto shrines and cherry blossoms."
    ],
    description: "This is Gion, Kyoto's famous geisha district. It is filled with traditional wooden machiya merchant houses, teahouses, and historic temples dating back to the 16th century."
  },
  {
    id: 2,
    name: "Giza Plateau & Great Pyramids",
    country: "Egypt",
    lat: 29.9792,
    lng: 31.1342,
    imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "The climate is arid, and large sandy dunes lie in the distance.",
      "These monumental structures are the last standing Ancient Wonders of the World.",
      "It is located just outside Cairo."
    ],
    description: "The Great Pyramid of Giza is the oldest and largest of the pyramids in the Giza pyramid complex, built for the Fourth Dynasty Pharaoh Khufu over 4,500 years ago."
  },
  {
    id: 3,
    name: "Eiffel Tower Champ de Mars",
    country: "France",
    lat: 48.8584,
    lng: 2.2945,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "The architectural language is classic European Haussmann design.",
      "The street signage is in French.",
      "Look straight up; a giant 324-meter iron lattice tower dominates the sky."
    ],
    description: "The Eiffel Tower was constructed from 1887 to 1889 as the centerpiece of the 1889 World's Fair. It is the most-visited paid monument in the world."
  },
  {
    id: 4,
    name: "Sydney Harbour",
    country: "Australia",
    lat: -33.8568,
    lng: 151.2153,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "You are in the Southern Hemisphere.",
      "A white, sail-like vaulted roof structures the coastline.",
      "The massive steel arch bridge nearby is nicknamed 'The Coathanger'."
    ],
    description: "Sydney Harbour is home to the Sydney Opera House and the Sydney Harbour Bridge. The opera house, designed by Danish architect Jørn Utzon, was opened in 1973."
  },
  {
    id: 5,
    name: "Times Square, New York City",
    country: "United States",
    lat: 40.7580,
    lng: -73.9855,
    imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Yellow cabs are zipping through the grid-like avenues.",
      "Gigantic neon and LED billboards illuminate the skyscrapers 24/7.",
      "This major commercial intersection is known as the Crossroads of the World."
    ],
    description: "Times Square is a major commercial intersection, tourist destination, entertainment center, and neighborhood in Midtown Manhattan, New York City."
  },
  {
    id: 6,
    name: "Rio de Janeiro Beachfront",
    country: "Brazil",
    lat: -22.9714,
    lng: -43.1825,
    imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Portuguese text is written on the beachside stalls.",
      "Steep granite monoliths (like Sugarloaf Mountain) rise straight from the sea.",
      "A famous mosaic-tiled promenade borders this long crescent beach."
    ],
    description: "Copacabana is a world-famous beach neighborhood located in the South Zone of Rio de Janeiro, known for its 4 km balneario beach and wave-patterned mosaic promenade."
  },
  {
    id: 7,
    name: "Reykjavik Cathedral Overlook",
    country: "Iceland",
    lat: 64.1420,
    lng: -21.9271,
    imageUrl: "https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Colorful metal-clad roofs are spread out beneath a sub-arctic sky.",
      "The massive Hallgrímskirkja church is shaped like basalt lava columns.",
      "It is the northernmost capital of a sovereign state."
    ],
    description: "Reykjavik is the capital and largest city of Iceland. Hallgrímskirkja is a Lutheran parish church, standing at 74.5 meters high, making it one of the tallest structures in the country."
  },
  {
    id: 8,
    name: "Venice Canal",
    country: "Italy",
    lat: 45.4408,
    lng: 12.3155,
    imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "There are absolutely no cars, roads, or trucks in sight.",
      "Transportation consists of water buses (vaporetto) and long black boats.",
      "The buildings stand on thousands of wooden piles driven into the mud."
    ],
    description: "Venice is built on a group of 118 small islands separated by canals and linked by over 400 bridges. It is renowned for the beauty of its setting, architecture, and artworks."
  },
  {
    id: 9,
    name: "Grand Canyon National Park",
    country: "United States",
    lat: 36.0544,
    lng: -112.1401,
    imageUrl: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Red rock strata layers carve out a colossal valley.",
      "The Colorado River flows far down at the bottom of the gorge.",
      "This is one of the most famous canyons in North America."
    ],
    description: "The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona. It is 446 km long, up to 29 km wide, and attains a depth of over a mile (1,857 meters)."
  },
  {
    id: 10,
    name: "Taj Mahal Gardens",
    country: "India",
    lat: 27.1751,
    lng: 78.0421,
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A massive white marble mausoleum with four identical minarets sits by a river.",
      "It represents Mughal architecture, blending Persian, Islamic, and Indian styles.",
      "It was built by Shah Jahan in memory of his favorite wife."
    ],
    description: "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan."
  }
];

export const LEADERBOARD = [
  { rank: 1, username: "GeoSniper99", score: 24850, gamesPlayed: 85, wins: 52, countryCode: "SE", accuracy: 96 },
  { rank: 2, username: "Atlas_Explorer", score: 24200, gamesPlayed: 110, wins: 61, countryCode: "CA", accuracy: 94 },
  { rank: 3, username: "NeonCartographer", score: 23900, gamesPlayed: 92, wins: 48, countryCode: "US", accuracy: 93 },
  { rank: 4, username: "MapMaster_JP", score: 23150, gamesPlayed: 76, wins: 41, countryCode: "JP", accuracy: 91 },
  { rank: 5, username: "Vagabond_Globe", score: 22800, gamesPlayed: 104, wins: 45, countryCode: "FR", accuracy: 89 },
  { rank: 6, username: "Cyber_Navigator", score: 22100, gamesPlayed: 65, wins: 33, countryCode: "DE", accuracy: 88 },
  { rank: 7, username: "PebbleGuesser", score: 21950, gamesPlayed: 142, wins: 58, countryCode: "GB", accuracy: 87 },
  { rank: 8, username: "Gerd_Von_Map", score: 21500, gamesPlayed: 50, wins: 28, countryCode: "AU", accuracy: 90 },
  { rank: 9, username: "DesertFox", score: 20900, gamesPlayed: 88, wins: 35, countryCode: "EG", accuracy: 85 },
  { rank: 10, username: "Zero_Kelvin", score: 20450, gamesPlayed: 73, wins: 29, countryCode: "IS", accuracy: 86 }
];

export const ACHIEVEMENTS = [
  {
    id: "explorer_1",
    title: "Global Explorer",
    description: "Play your first game of Geo World Guessr",
    icon: "Compass",
    unlocked: true,
    progress: 100
  },
  {
    id: "perfect_guess",
    title: "Sniper Accuracy",
    description: "Guess a location within 25 km of the target",
    icon: "Target",
    unlocked: true,
    progress: 100
  },
  {
    id: "speedrun_guess",
    title: "Flash Instincts",
    description: "Make a correct guess with more than 45s left on the timer",
    icon: "Zap",
    unlocked: false,
    progress: 60
  },
  {
    id: "multiplayer_win",
    title: "Apex Predictor",
    description: "Win 10 multiplayer lobby matches",
    icon: "Trophy",
    unlocked: false,
    progress: 30
  },
  {
    id: "all_rounds_perfect",
    title: "Cartography God",
    description: "Score more than 23,000 points in a single campaign game",
    icon: "Award",
    unlocked: false,
    progress: 10
  },
  {
    id: "night_rider",
    title: "Neon Navigator",
    description: "Play 5 games in Cyberpunk Dark Mode",
    icon: "Moon",
    unlocked: true,
    progress: 100
  }
];

export const USER_PROFILE = {
  username: "SynthWanderer",
  level: 14,
  xp: 3250,
  xpNext: 5000,
  stats: {
    gamesPlayed: 42,
    wins: 18,
    avgDistance: 840, // km
    bestScore: 22450 // out of 25000
  },
  matchHistory: [
    { id: "m1", date: "2026-05-24", score: 21400, mode: "Standard Play", rounds: 5, accuracy: 89 },
    { id: "m2", date: "2026-05-23", score: 18750, mode: "Daily Challenge", rounds: 5, accuracy: 78 },
    { id: "m3", date: "2026-05-21", score: 22450, mode: "Standard Play", rounds: 5, accuracy: 93 },
    { id: "m4", date: "2026-05-20", score: 15300, mode: "Standard Play", rounds: 5, accuracy: 68 },
    { id: "m5", date: "2026-05-18", score: 9800, mode: "Multiplayer Clash", rounds: 3, accuracy: 55 }
  ]
};
