import { apiClient } from "./api";

//Logs in or signs up user using FetchAPI.
export const loginUser = async (name: string, email: string, zipcode?: string) => {
    try {
        const response = await apiClient.post("/auth/login", { name, email });

        if (response.status === 200) {
            const userData = { name, email, zipcode };
            localStorage.setItem("user", JSON.stringify(userData));
            return userData;
        }

        throw new Error("Login failed");
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

// Logs out the user and clears stored data

export const logoutUser = async () => {
    try {
        await apiClient.post("/auth/logout");
        localStorage.removeItem("user");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};