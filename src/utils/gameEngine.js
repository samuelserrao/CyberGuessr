/**
 * Calculates the distance between two coordinate points on Earth using the Haversine formula.
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
}

/**
 * Calculates the score based on distance. Max points is 5000.
 * A guess within 25km gives a perfect score of 5000.
 * The score decays exponentially with distance.
 * @param {number} distanceKm - Distance in km
 * @returns {number} Score (0 - 5000)
 */
export function calculateScore(distanceKm) {
  if (distanceKm <= 25) return 5000;
  
  // Exponential decay constant: at ~2000km score is ~1800, at ~10000km score drops near 0
  const decayFactor = 2000; 
  const score = 5000 * Math.exp(-distanceKm / decayFactor);
  
  return Math.max(0, Math.min(5000, Math.round(score)));
}

/**
 * Gets a cardinal/ordinal text direction from a degree angle.
 * @param {number} degrees - Angle in degrees (0 - 360)
 * @returns {string} Direction abbreviation (e.g. "NE")
 */
export function getCompassDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}
