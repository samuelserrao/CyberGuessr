// Mock data for Geo World Guessr game

export const LOCATIONS = [
  {
    id: 1,
    name: "Giza Pyramid Complex",
    country: "Egypt",
    lat: 29.9792,
    lng: 31.1342,
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b31d458?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Located in the Sahara Desert, this region sits in North Africa.",
      "The country's capital is Cairo, and the official language is Arabic.",
      "This complex includes the Great Sphinx and three major pyramids built during the Old Kingdom."
    ],
    description: "The Giza Pyramid Complex includes the Great Pyramid of Giza, the Pyramid of Khafre, and the Pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx of Giza. All were built during the Fourth Dynasty of the Old Kingdom of Ancient Egypt."
  },
  {
    id: 2,
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
    description: "The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, constructed under Emperor Vespasian."
  },
  {
    id: 3,
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
    description: "The Taj Mahal is an ivory-white marble mausoleum on the southern bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal."
  },
  {
    id: 4,
    name: "The Treasury at Petra",
    country: "Jordan",
    lat: 30.3285,
    lng: 35.4444,
    imageUrl: "https://images.unsplash.com/photo-1501232060322-aa873e6ca528?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Located in the Middle East, carved directly into red sandstone cliffs.",
      "It served as the capital of the Nabataean Kingdom around the 4th century BC.",
      "Known as the 'Rose City' due to the color of the stone from which it is carved."
    ],
    description: "Petra is a famous archaeological site in Jordan's southwestern desert. Dating to around 300 B.C., it was the capital of the Nabataean Kingdom. Carved directly into vibrant red, white, and pink sandstone cliff faces, it is one of the New Seven Wonders of the World."
  },
  {
    id: 5,
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
    description: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru, on a 2,430-meter mountain ridge. It was built around 1450, abandoned a century later during the Spanish Conquest, and rediscovered in 1911."
  },
  {
    id: 6,
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
    description: "Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England, consisting of an outer ring of vertical sarsen standing stones, each around 13 feet high, topped by connecting horizontal lintel stones. It remains one of the world's most famous megalithic circles."
  },
  {
    id: 7,
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
    description: "The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against nomadic groups. Stretching over 21,196 km, it is a UNESCO World Heritage site."
  },
  {
    id: 8,
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
    description: "Chichen Itza was a large pre-Columbian city built by the Maya people. The archaeological site is located in Yucatan State, Mexico. The stepped pyramid, El Castillo, serves as a temple to the feathered serpent deity Kukulcan."
  },
  {
    id: 9,
    name: "Easter Island Moai",
    country: "Chile",
    lat: -27.1127,
    lng: -109.3497,
    imageUrl: "https://images.unsplash.com/photo-1510018572596-e40e2a19b412?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "Located on a remote volcanic island in the southeastern Pacific Ocean.",
      "Monolithic human figures carved by the Rapa Nui people between 1250 and 1500.",
      "Almost all moai have overly large heads, representing deified ancestors."
    ],
    description: "The Moai are monolithic human figures carved by the Rapa Nui people on Easter Island in eastern Polynesia between the years 1250 and 1500. The statues are carved from volcanic tuff, representing the spirits of ancestors."
  },
  {
    id: 10,
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
    description: "The Acropolis of Athens is an ancient citadel located on a rocky outcrop above the city of Athens, Greece. It contains the remains of several ancient buildings of great architectural and historical significance, the Parthenon being the most complete."
  },
  {
    id: 11,
    name: "Angkor Wat",
    country: "Cambodia",
    lat: 13.4125,
    lng: 103.8670,
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e42ed184?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A temple complex in northwest country, set in Southeast Asia.",
      "Originally constructed as a Hindu temple dedicated to Vishnu for the Khmer Empire.",
      "It is the largest religious monument in the world, appearing on the country's national flag."
    ],
    description: "Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world by land area, measuring 162.6 hectares. Built by the Khmer King Suryavarman II in the early 12th century, it transformed into a Buddhist site."
  },
  {
    id: 12,
    name: "Himeji Castle",
    country: "Japan",
    lat: 34.8394,
    lng: 134.6939,
    imageUrl: "https://images.unsplash.com/photo-1590559899731-a3826dc9fd55?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A hilltop castle complex located in Hyogo Prefecture, East Asia.",
      "Widely regarded as the finest surviving example of prototypical Japanese castle architecture.",
      "Often called the 'White Heron Castle' (Shirasagi-jo) because of its white exterior and resemblance to a bird taking flight."
    ],
    description: "Himeji Castle is a hilltop Japanese castle complex situated in Himeji in Hyogo Prefecture, Japan. It is regarded as the finest surviving example of early 17th-century Japanese castle architecture, comprising 83 wooden buildings."
  },
  {
    id: 13,
    name: "Notre-Dame de Paris",
    country: "France",
    lat: 48.8530,
    lng: 2.3499,
    imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A medieval Catholic cathedral on the Île de la Cité in the French capital.",
      "One of the most famous examples of French Gothic architecture, built starting in 1163.",
      "Renowned for its stained glass rose windows, gargoyles, and flying buttresses."
    ],
    description: "Notre-Dame de Paris, referred to simply as Notre-Dame, is a medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris, France. Constructed over two centuries starting in 1163, it represents French Gothic genius."
  },
  {
    id: 14,
    name: "Alhambra Palace",
    country: "Spain",
    lat: 37.1760,
    lng: -3.5878,
    imageUrl: "https://images.unsplash.com/photo-1595877244574-e90ce41ce089?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A palace and fortress complex located in Granada, Andalusia.",
      "Originally constructed as a small fortress in AD 889 and rebuilt by the Nasrid dynasty.",
      "One of the most famous monuments of Islamic architecture, featuring highly decorated stucco walls."
    ],
    description: "The Alhambra is a palace and fortress complex located in Granada, Andalusia, Spain. It was constructed during the mid-13th century by the Nasrid emir Mohammed ben Al-Ahmar, representing the peak of Moorish architecture in Europe."
  },
  {
    id: 15,
    name: "Pompeii Ruins",
    country: "Italy",
    lat: 40.7462,
    lng: 14.4850,
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "An ancient Roman city located in the Campania region, near Naples.",
      "The city was buried under 4 to 6 meters of volcanic ash during an eruption in AD 79.",
      "Mount Vesuvius is the volcano that erupted and preserved the city in detail."
    ],
    description: "Pompeii was an ancient Roman city near modern Naples in the Campania region of Italy. Pompeii, along with Herculaneum and many villas in the surrounding area, was buried under volcanic ash and pumice in the eruption of Mount Vesuvius in AD 79."
  },
  {
    id: 16,
    name: "Tikal Temple I",
    country: "Guatemala",
    lat: 17.2220,
    lng: -89.6234,
    imageUrl: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "The ruin of an ancient city in the rainforest of the Peten basin in Central America.",
      "One of the largest archaeological sites and urban centers of the pre-Columbian Maya civilization.",
      "Temple I is also known as the Temple of the Great Jaguar, rising 47 meters tall."
    ],
    description: "Tikal is the ruin of an ancient city, which was likely called Yax Mutal, found in a rainforest in Guatemala. It is one of the largest archaeological sites of the Maya civilization, dominated by Temple I, built as a funerary monument."
  },
  {
    id: 17,
    name: "Mausoleum of the Terracotta Army",
    country: "China",
    lat: 34.3842,
    lng: 109.2785,
    imageUrl: "https://images.unsplash.com/photo-1599889959407-5d8f662935d1?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A collection of clay sculptures depicting the armies of the first Emperor of this country.",
      "It is a form of funerary art buried with the emperor in 210 BC to protect him in the afterlife.",
      "It was discovered in 1974 by local farmers in Shaanxi province, near Xi'an."
    ],
    description: "The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. It is a form of funerary art buried with the emperor in 210–209 BCE to protect him in his afterlife."
  },
  {
    id: 18,
    name: "Venice Canals",
    country: "Italy",
    lat: 45.4408,
    lng: 12.3155,
    imageUrl: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A historical city built on a group of 118 small islands separated by canals.",
      "It is located in the Venetian Lagoon in northeastern Italy.",
      "Known for its gondolas, gothic palaces, and Saint Mark's Basilica."
    ],
    description: "Venice is a historical city built on 118 small islands in the Venetian Lagoon, northeastern Italy. It has no roads, only canals, including the Grand Canal thoroughfare, lined with Renaissance and Gothic palaces."
  },
  {
    id: 19,
    name: "Red Square & Kremlin",
    country: "Russia",
    lat: 55.7539,
    lng: 37.6208,
    imageUrl: "https://images.unsplash.com/photo-1513326796677-4498336113b4?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A massive brick square bordering the official residence of the President of this northern nation.",
      "The square contains Saint Basil's Cathedral, famous for its colorful onion-shaped domes.",
      "It separates the Kremlin from the historic merchant quarter of Moscow."
    ],
    description: "Red Square is a city square in Moscow, Russia. It separates the Kremlin, the official residence of the President of Russia, from the historic merchant quarter known as Kitai-gorod, featuring St. Basil's Cathedral."
  },
  {
    id: 20,
    name: "Kyoto Yasaka Pagoda",
    country: "Japan",
    lat: 34.9986,
    lng: 135.7782,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
    clues: [
      "A 5-story wooden pagoda located in the historic Higashiyama district.",
      "Built in 1440 by Shogun Ashikaga Yoshinori, it stands 46 meters tall.",
      "It is the sole survivor of a former temple complex destroyed by fire."
    ],
    description: "Yasaka Pagoda, also known as Hokan-ji Temple, is a 46-meter-tall five-story wooden pagoda located in Kyoto, Japan. Built in 1440, it is one of the most iconic historical symbols of traditional Kyoto."
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
    progress: 0
  },
  {
    id: "multiplayer_win",
    title: "Apex Predictor",
    description: "Win 10 multiplayer lobby matches",
    icon: "Trophy",
    unlocked: false,
    progress: 0
  },
  {
    id: "all_rounds_perfect",
    title: "Cartography God",
    description: "Score more than 23,000 points in a single campaign game",
    icon: "Award",
    unlocked: false,
    progress: 0
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
