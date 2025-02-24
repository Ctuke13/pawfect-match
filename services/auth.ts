import { apiClient } from "./api";

//Logs in or signs up user using FetchAPI.
export const loginUser = async (name: string, email: string) => {
    try {
        const response = await apiClient.post("/auth/login", { name, email });

        console.log("✅ Login successful, session is active.");
        
        return true; // ✅ Indicate success without returning a token
    } catch (error) {
        console.error("❌ Login failed:", error);
        return false;
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