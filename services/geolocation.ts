import axios from "axios";

const IPGEOLOCATION_API_KEY = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY;
const BASE_URL = "https://api.ipgeolocation.io";

// Add debugging
console.log("API Key available:", !!IPGEOLOCATION_API_KEY);
console.log("API Key value:", IPGEOLOCATION_API_KEY);

/**
 * Fetches latitude & longitude for a given zip code.
 * Uses ipgeolocation.io API to get the geolocation.
 * @param zipCode - The user's zip code.
 */

export const getGeoLocation = async (zipCode: string) => {
    // More debugging
    console.log("API Key in getGeoLocation:", IPGEOLOCATION_API_KEY);
    
    try {
        const response = await axios.get(
            `https://api.ipgeolocation.io/timezone?apiKey=${IPGEOLOCATION_API_KEY}&zip=${zipCode}`
        );
        return {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
        };
    } catch (error) {
        console.error("Error fetching geolocation:", error);
        return null;
    }
}