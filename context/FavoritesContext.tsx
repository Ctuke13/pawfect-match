"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the type for context
interface FavoritesContextType {
    favorites: string[];
    addFavorite: (dogId: string) => void;
    removeFavorite: (dogId: string) => void;
    isFavorite: (dogId: string) => boolean;
    clearFavorites: () => void;
};

// Create the context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider component
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
        const [favorites, setFavorites] = useState<string[]>([]);

        // Load favorites from localStorage on mount
        useEffect(() => {
            const storedFavorites = localStorage.getItem("favorites");
            if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Add dog to favorites
    const addFavorite = (dogId: string) => {
        if (!favorites.includes(dogId)) setFavorites([...favorites, dogId]);
    }

    // Remove dog from favorites
    const removeFavorite = (dogId: string) => {
        if(favorites.includes(dogId)) setFavorites(favorites.filter((id) => id !== dogId));
    }

    // Check if dog is a favorite
    const isFavorite = (dogId: string) => favorites.includes(dogId);

    // Clear all favorites
    const clearFavorites = () => setFavorites([]);

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Custom hook to use the FavoritesContext
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
    return context;
}