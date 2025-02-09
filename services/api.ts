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
export const searchDogs = async (filters: any) => {
    const response = await apiClient.get("/dogs/search", { params: filters });
    return response.data;
}

// Fetch dogs by ID
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