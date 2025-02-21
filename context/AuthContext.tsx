"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { loginUser, logoutUser } from "@/services/auth";
import { User, AuthContextType} from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setIsLoading(false);
    }, []);

    const login = async (name: string, email: string, zipcode?: string) => {
        try {
            await loginUser(name, email);
            setUser({ name, email, zipcode, favorites: [] });
            const newUser = { name, email, zipcode, favorites: [] };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const updateFavorites = async (favorites: string[]) => {
        if(user) {
            const updatedUser = { ...user, favorites};
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    }

    const updateZipcode = (zipcode: string) => {
        if (user) {
          const updatedUser = { ...user, zipcode };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
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