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
})

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
export const searchDogsByBreed = async (breed: string, page: number = 1, limit: number = 6) => {
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
        console.log("Total dogs fetched:", response.data.total);
        return response.data.resultIds;
    } catch (error) {
        console.error("Error fetching all dogs:", error);
        return []
    }
}
export const getDogsById = async (dogIds: string[]) => {
    const response = await apiClient.post("/dogs", dogIds);
    return response.data;
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
        const dogsData = await getDogsById(dogIds);

        // Extract unique zip codes from fetched dogs
        const zipCodes = [...new Set(dogsData.map((dog: Dog) => dog.zip_code))];

        // Fetch locations for the dogs zip codes
        const response = await apiClient.post("/locations", zipCodes);
        const locations = response.data as Location[];
        console.log(locations);

        // Fetch coordinates for user zip code
        const userZipResponse = await apiClient.post("/locations", [zipCode]);
        const userLocation = userZipResponse.data[0];

        if(!userLocation) {
            console.error("Invalid zip code for sorting");
            return dogIds;
        }

        // Compute distance and sort dogs
        const sortedDogs = dogsData.sort((a: Dog, b: Dog) => {
            const locationA = locations.find(loc => loc.zip_code === a.zip_code);
            const locationB = locations.find(loc => loc.zip_code === b.zip_code);

            if(!locationA || !locationB) return 0;

            const distanceA = calculateDistance(userLocation, locationA);
            const distanceB = calculateDistance(userLocation, locationB);

            return distanceA - distanceB // Sort Ascending
        });

        return sortedDogs.map((dog:Dog) => dog.id); 
    } catch (error) {
        console.error("Error sorting dogs by zip:", error);
        return dogIds;
    }
}


export const getLocationByZip = async (zipCodes: string[]) : Promise<Record<string, { city: string; state: string}>> => {
    try {
        const response = await apiClient.post("/locations", zipCodes);
        const locations: Location [] = response.data;
    
        //Convert the response into a city
        const zipToCityMap: Record<string, { city: string; state: string }> = {};
        locations.forEach((location) => {
            zipToCityMap[location.zip_code] = { city: location.city, state: location.state };
        });
    
        return zipToCityMap;
    } catch(error) {
        console.error("Error fetching locations by zip code:", error);
        return {};
    }
}