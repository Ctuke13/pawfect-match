"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { loginUser, logoutUser } from "@/services/auth";
import { apiClient, getBreeds } from "@/services/api";
import { User, AuthContextType} from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            setIsLoading(true);
    
            // ✅ Restore user (including zipcode) from localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser); 
            }
    
            try {
                // ✅ Check if authentication is valid
                await getBreeds();
                console.log("✅ User session is valid.");
            } catch (error: any) {
                if (error.response?.status === 401) {
                    console.error("❌ Session expired, logging out user.");
                    logout();
                } else {
                    console.error("❌ Unexpected error while verifying session:", error);
                }
            }
    
            setIsLoading(false);
        };
    
        verifyAuth();
    }, []);
    

    // Login using HttpOnly cookie
    const login = async (name: string, email: string, zipcode?: string) => {
        try {
            await loginUser(name, email); // ✅ API sets HttpOnly cookie
            console.log("✅ User logged in, session started.");
    
            // ✅ Retrieve existing user from localStorage (if any)
            const storedUser = localStorage.getItem("user");
            let updatedUser;
    
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                updatedUser = { ...parsedUser, name, email, zipcode: zipcode || parsedUser.zipcode };
            } else {
                updatedUser = { name, email, zipcode, favorites: [] };
            }
    
            // ✅ Persist user state without removing existing data
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
    
        } catch (error) {
            console.error("❌ Login failed:", error);
        }
    };

    const logout = async () => {
        try {
            await logoutUser(); // ✅ API clears the session
            setUser(null);
            console.log("👋 Logged out successfully.");
        } catch (error) {
            console.error("❌ Logout failed:", error);
        }
    };

    const updateFavorites = async (favorites: string[]) => {
        if(user) {
            const updatedUser = { ...user, favorites};
            setUser(updatedUser);
        }
    }

    const updateZipcode = (zipcode: string) => {
        if (user) {
          const updatedUser = { ...user, zipcode };
          setUser(updatedUser);
        }
      };

      // ✅ Prevent flickering while checking localStorage
    if (isLoading) return null; // Prevent UI flickers

    return (
        <AuthContext.Provider value={{ user, login, logout, updateFavorites, updateZipcode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context;
}