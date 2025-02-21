import axios from "axios";

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