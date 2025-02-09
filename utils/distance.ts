/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 * @param loc1 - First location { latitude: number, longitude: number }
 * @param loc2 - Second location { latitude: number, longitude: number }
 * @returns Distance in kilometers (km)
 */
export const calculateDistance = (
  loc1: { latitude: number; longitude: number },
  loc2: { latitude: number; longitude: number }
): number => {
  if (!loc1 || !loc2 || !loc1.latitude || !loc1.longitude || !loc2.latitude || !loc2.longitude) {
    throw new Error("Invalid input: Both locations must have latitude and longitude.");
  }

  const EARTH_RADIUS_KM = 6371;
  const latDiff = (loc2.latitude - loc1.latitude) * (Math.PI / 180);
  const lonDiff = (loc2.longitude - loc1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(loc1.latitude * (Math.PI / 180)) *
      Math.cos(loc2.latitude * (Math.PI / 180)) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

/**
 * Converts kilometers to miles.
 */
export const kmToMiles = (km: number): number => {
  return km * 0.621371;
};

/**
 * Checks if a location is within a radius of another location.
 */
export const isWithinRadius = (
  loc1: { latitude: number; longitude: number },
  loc2: { latitude: number; longitude: number },
  maxDistance: number
): boolean => {
  return calculateDistance(loc1, loc2) <= maxDistance;
};

/**
 * Formats distance into a readable string.
 */
export const formatDistance = (distance: number, unit: "km" | "miles" = "km"): string => {
  const convertedDistance = unit === "miles" ? kmToMiles(distance) : distance;
  return `${convertedDistance.toFixed(1)} ${unit}`;
};