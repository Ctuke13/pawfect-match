import axios from "axios";
import { calculateDistance } from "@/utils/distance";
import { Dog } from "@/types/dogs";
import { Location } from "@/types/location";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";



export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json"
    }  
});

// Refresh Authentication Token Before API Calls
apiClient.interceptors.response.use((response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error("❌ Session expired, logging out user.");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

// Fetch all dog breeds
export const getBreeds = async (): Promise<string[]> => {
    const response = await apiClient.get("/dogs/breeds");
    return response.data;
};

// Search with filters
export const searchDogs = async (filters: any = {}, from: number = 0, page: number = 1, limit: number = 6) => {
    const response = await apiClient.get("/dogs/search", { params: { ...filters, from, limit, size: limit } });
    return response.data;
}

// Search by breed
export const searchDogsByBreed = async (breed: string, page: number = 1, limit: number = 100) => {
    return await searchDogs({ breed }, page, limit)
}

// Search by zip code
export const searchDogsByZipCode = async (zipCode: string, page: number = 1, limit: number = 6) => {
    return await searchDogs({ zipCode }, page, limit);
};

// Fetch dogs by ID

export const fetchAllDogs = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get("/dogs/search?size=10000");
        return response.data.resultIds;
    } catch (error) {
        console.error("Error fetching all dogs:", error);
        return []
    }
}
export const getDogsById = async (dogIds: string[]): Promise<Dog[]> => {
    try {
        if (dogIds.length === 0) {
            console.error("❌ No dog IDs provided to fetch!");
            return [];
        }

        console.log(`🐶 Fetching ${dogIds.length} Dogs by IDs...`);

        const batchSize = 100;
        let allDogs: Dog[] = [];

        // Fetch dogs in batches of 100
        const fetchBatch = async (batch: string[]) => {
            try {
                const response = await apiClient.post("/dogs", batch);
                return response.data;
            } catch (error) {
                console.error("❌ Error fetching batch:", error);
                return []; // Return an empty array instead of failing the whole function
            }
        };

        const fetchPromises = [];
        for (let i = 0; i < dogIds.length; i += batchSize) {
            const batch = dogIds.slice(i, i + batchSize);
            fetchPromises.push(fetchBatch(batch));
        }

        // Resolve all batch requests concurrently
        const batchResults = await Promise.all(fetchPromises);
        allDogs = batchResults.flat(); // Flatten the array of batches

        console.log(`✅ Successfully fetched ${allDogs.length} dogs.`);
        return allDogs;
    } catch (error) {
        console.error("❌ Critical error fetching dogs:", error);
        return [];
    }
};


// Update Favorite dogs
export const updateUserFavorites = (favorites: string[]) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      user.favorites = favorites;
      localStorage.setItem("user", JSON.stringify(user));
    }
}

export const sortDogsByZip = async (dogIds: string[], zipCode: string): Promise<string[]> => {
    try {

        // Fetch full dog objects to get their zip codes
        const limitedDogIds = dogIds.slice(0, 100);  
        const dogsData = await getDogsById(limitedDogIds);
        if (!dogsData || dogsData.length === 0) {
            console.error("❌ No dog data found!");
            return [];
        }

        // Extract unique zip codes from fetched dogs
        const zipCodes = [...new Set(dogsData.map((dog: Dog) => dog.zip_code))];

        console.log("Unique zip codes found:", zipCodes);

        // Fetch locations for the dogs' zip codes
        const zipToLocationMap = await getLocationByZip(zipCodes);
        if (Object.keys(zipToLocationMap).length === 0) {
            console.error("❌ No location data received for dog zip codes!");
            return dogIds;
        }
        console.log("✅ Location data received for dog zip codes.", zipToLocationMap);

        // Fetch location for the user's input zip code
        const userLocationMap = await getLocationByZip([zipCode]);
        if (Object.keys(userLocationMap).length === 0) {
                console.error("❌ Invalid user zip code or location not found.");
            return dogIds;
        }

        const userLocation = userLocationMap[zipCode];
        console.log("✅ Location data received for user zip code.", userLocation);
 
        if (!userLocation) {
            console.error("❌ Invalid user zip code or location not found.");
            return dogIds;
        }

        // Compute distance and sort dogs
        const sortedDogs = dogsData.sort((a: Dog, b: Dog) => {
            const locationA = zipToLocationMap[a.zip_code];
            const locationB = zipToLocationMap[b.zip_code];

            if(!locationA || !locationB) return 0;

            const distanceA = calculateDistance(
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: locationA.latitude, longitude: locationA.longitude }
            );
            const distanceB = calculateDistance(
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: locationB.latitude, longitude: locationB.longitude }
            );

            console.log(`📏 Distance A (${a.zip_code}): ${distanceA.toFixed(2)} km`);
            console.log(`📏 Distance B (${b.zip_code}): ${distanceB.toFixed(2)} km`);

            return distanceA - distanceB // Sort Ascending
        });

        console.log("Sorted Dog IDs:", sortedDogs.map((dog: Dog) => dog.id));
        return sortedDogs.map((dog:Dog) => dog.id.toLocaleString()); 
    } catch (error) {
        console.error("Error sorting dogs by zip:", error);
        return dogIds;
    }
};


export const getLocationByZip = async (zipCodes: string[]) : Promise<Record<string, { city: string; state: string; latitude: number; longitude: number; }>> => {
    try {
        const response = await apiClient.post("/locations", zipCodes);
        if(!response || !response.data || !Array.isArray(response.data)) {
            console.error("❌ API response is empty when fetching locations!")
            return {}
        }

        const locations: Location [] = response.data.filter((loc: Location) => loc && loc.zip_code);

        //Convert the response into a city
        const zipToLocationMap: Record<string, { city: string; state: string; latitude: number; longitude: number }> = {};

        locations.forEach((location) => {
            zipToLocationMap[location.zip_code] = { 
                city: location.city || 'Unknown', 
                state: location.state || "", 
                latitude: location.latitude,
                longitude: location.longitude
            };
        });

        return zipToLocationMap;
    } catch(error) {
        console.error("Error fetching locations by zip code:", error);
        return {};
    }
};