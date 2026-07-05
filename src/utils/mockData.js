// Mock data for Geo World Guessr game

export const LOCATIONS = [
  {
    id: 1,
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
    description: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889."
  },
  {
    id: 2,
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
    description: "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States. The copper statue, a gift from the people of France, was designed by French sculptor Frédéric-Auguste Bartholdi."
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
    description: "The Giza Pyramid Complex includes the Great Pyramid of Giza, the Pyramid of Khafre, and the Pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx of Giza. All were built during the Fourth Dynasty of the Old Kingdom of Ancient Egypt."
  },
  {
    id: 5,
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
    id: 6,
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
    description: "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour located in Sydney, New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings, designed by Jørn Utzon."
  },
  {
    id: 7,
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
    description: "The Golden Gate Bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean. The structure links the U.S. city of San Francisco to Marin County."
  },
  {
    id: 8,
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
    description: "Christ the Redeemer is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil, created by French sculptor Paul Landowski and built by Brazilian engineer Heitor da Silva Costa, in collaboration with French engineer Albert Caquot."
  },
  {
    id: 9,
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
    id: 10,
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
    description: "Tower Bridge is a Grade I listed combined bascule and suspension bridge in London, built between 1886 and 1894, designed by Horace Jones and engineered by John Wolfe Barry. It has become an iconic landmark of London."
  },
  {
    id: 11,
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
    id: 12,
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
    description: "Big Ben is the nickname for the Great Bell of the striking clock at the north end of the Palace of Westminster in London, England, and the name is frequently extended to refer also to the clock and the clock tower, now named Elizabeth Tower."
  },
  {
    id: 13,
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
    description: "Mount Fuji is the tallest mountain in Japan, standing at 3,776.24 m. It is an active stratovolcano that last erupted in 1707. Located on the island of Honshu, it is one of Japan's Three Holy Mountains."
  },
  {
    id: 14,
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
    description: "The Leaning Tower of Pisa is the campanile, or freestanding bell tower, of Pisa Cathedral. It is known for its nearly four-degree lean, the result of an unstable foundation. The tower is situated behind Pisa Cathedral."
  },
  {
    id: 15,
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
    id: 16,
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
    description: "The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona, United States. The Grand Canyon is 277 miles long, up to 18 miles wide and attains a depth of over a mile, managed by Grand Canyon National Park."
  },
  {
    id: 17,
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
    description: "The Burj Khalifa is a skyscraper in Dubai, United Arab Emirates. With a total height of 829.8 m and a roof height of 828 m, the Burj Khalifa has been the tallest structure and building in the world since its topping out in 2009."
  },
  {
    id: 18,
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
    id: 19,
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
    description: "The Louvre Pyramid is a large glass and metal pyramid designed by Chinese-American architect I. M. Pei, surrounded by three smaller pyramids, in the main courtyard of the Palais du Louvre in Paris. It serves as the main entrance to the Louvre Museum."
  },
  {
    id: 20,
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
