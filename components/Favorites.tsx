"use client"

import React, { useState, useEffect } from "react";
import { Dog } from "../types/dogs";
import { useAuth } from "@/context/AuthContext";
import { getDogsById } from "@/services/api";
import DogCard from "./ui/DogCard";
import { Button } from "@/components/ui/button"
import LoginModal from "./LoginModal";
import { LoadingSpinner } from "./ui/loadingspinner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";

export default function FavoritesPage() {
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [sort, setSort] = useState<string>("Name");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const dogsPerPage = 6;

    // Find My Match states
    const [matchModalOpen, setMatchModalOpen] = useState(false);
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isMatchAnimating, setIsMatchAnimating] = useState(false);

    // Show login modal if user is not logged in
    useEffect(() => {
        if (!user) {
            setShowLoginModal(true);
        }
    }, [user]);

    // Debug modal state changes
    useEffect(() => {
        console.log("Modal state changed:", matchModalOpen);
        console.log("Matched dog state:", matchedDog);
    }, [matchModalOpen, matchedDog]);

    // Fetch favorite dogs whenever the user or their favorites change
    useEffect(() => {
        const fetchFavoriteDogs = async () => {
            if (!user || !user.favorites || user.favorites.length === 0) {
                setFavoriteDogs([]);
                setLoadingFavorites(false);
                return;
            }

            try {
                setLoadingFavorites(true);
                console.log("🐶 Fetching favorite dogs...", user.favorites);

                // Fetch all favorite dogs at once
                const dogDetails = await getDogsById(user.favorites);
                console.log("📋 Favorite dogs loaded:", dogDetails.length);

                // Sort the dogs according to current sort settings
                const sortedDogs = sortDogs(dogDetails);
                setFavoriteDogs(sortedDogs);
            } catch (error) {
                console.error("❌ Error fetching favorite dogs:", error);
            } finally {
                setLoadingFavorites(false);
            }
        };

        fetchFavoriteDogs();
    }, [user?.favorites]); // Only re-fetch when favorites change

    // Re-sort when sort options change
    useEffect(() => {
        if (favoriteDogs.length > 0) {
            setFavoriteDogs(sortDogs([...favoriteDogs]));
        }
    }, [sort, sortOrder]);

    // Function to sort dogs
    const sortDogs = (dogs: Dog[]) => {
        return [...dogs].sort((a, b) => {
            let valueA, valueB;

            // Get values based on sort type
            if (sort === "Age") {
                valueA = Number(a.age);
                valueB = Number(b.age);
            } else if (sort === "Breed") {
                valueA = a.breed.toLowerCase();
                valueB = b.breed.toLowerCase();
            } else { // Default to Name
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
            }

            // Sort based on order
            if (sortOrder === "asc") {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
    };

    // Calculate current page of dogs
    const getCurrentPageDogs = () => {
        const indexOfLastDog = currentPage * dogsPerPage;
        const indexOfFirstDog = indexOfLastDog - dogsPerPage;
        return favoriteDogs.slice(indexOfFirstDog, indexOfLastDog);
    };

    // Function to trigger confetti explosion
    const triggerConfetti = () => {
        // Multiple confetti bursts to create a more exciting effect
        const defaults = {
            origin: { y: 0.7 },
            spread: 100,
            ticks: 500
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(200 * particleRatio)
            });
        }

        // First burst - center with hearts and circles
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            origin: { y: 0.7, x: 0.5 },
            shapes: ['circle', 'heart'],
            colors: ['#ff0000', '#ff69b4', '#ffb6c1', '#ffc0cb']
        });

        // Second burst - from left
        fire(0.2, {
            spread: 60,
            startVelocity: 45,
            decay: 0.94,
            origin: { y: 0.7, x: 0.3 },
            colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8484']
        });

        // Third burst - from right
        fire(0.2, {
            spread: 60,
            startVelocity: 45,
            decay: 0.94,
            origin: { y: 0.7, x: 0.7 },
            colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8484']
        });

        // Fourth burst - from bottom
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            origin: { y: 0.9, x: 0.5 },
            colors: ['#00bcd4', '#ffeb3b', '#e91e63', '#9c27b0']
        });
    };

    // Handle Find My Match button click
    const handleFindMatch = () => {
        if (favoriteDogs.length === 0) return;

        // Set animation flag
        setIsMatchAnimating(true);

        // Trigger confetti
        triggerConfetti();

        // Select a random dog first
        const randomIndex = Math.floor(Math.random() * favoriteDogs.length);
        const selectedDog = favoriteDogs[randomIndex];

        // Then use a timeout for the animation timing, but with the dog already selected
        setTimeout(() => {
            console.log("Setting matched dog:", selectedDog);

            // First set the matched dog, then open the modal in sequence
            setMatchedDog(selectedDog);
            
            // Brief delay to ensure the dog is set before opening modal
            setTimeout(() => {
                setMatchModalOpen(true);
                console.log("Modal should be open now");
            }, 50);
            
            setIsMatchAnimating(false);
        }, 1500); // Wait for confetti to be visible
    };

    // Create a function to close the modal and reset the matched dog
    const handleCloseModal = () => {
        setMatchModalOpen(false);
        // Optional: Reset matched dog after modal closes
        // setTimeout(() => setMatchedDog(null), 300);
    };

    const paginatedDogs = getCurrentPageDogs();
    const totalPages = Math.ceil(favoriteDogs.length / dogsPerPage);

    if (showLoginModal) {
        return <LoginModal closeModal={() => setShowLoginModal(false)} />;
    }

    // Use AnimatePresence for the custom modal as a fallback if Dialog fails
    const CustomModal = () => (
        <AnimatePresence>
            {matchModalOpen && matchedDog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
                    >
                        <div className="bg-pink-50 px-6 py-4 border-b border-pink-100">
                            <h3 className="text-center text-2xl text-pink-600 font-bold">
                                Your Pawfect Match! 🐾
                            </h3>
                            <p className="text-center text-gray-500 mt-1">
                                We've found the perfect companion for you from your favorites!
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 260, 
                                    damping: 20 
                                }}
                                className="relative mb-4"
                            >
                                <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg">
                                    <img 
                                        src={matchedDog.img} 
                                        alt={matchedDog.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="absolute -right-2 -top-2 bg-pink-600 text-white rounded-full p-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                </motion.div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                            >
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">{matchedDog.name}</h3>
                                <p className="text-lg text-pink-600 font-medium mb-1">
                                    {matchedDog.breed} • {matchedDog.age} years old
                                </p>
                                <p className="text-gray-600 mb-6">
                                    {matchedDog.zip_code && `Located in ${matchedDog.zip_code}`}
                                </p>
                                
                                <p className="text-xl text-center font-semibold mb-4">
                                    {matchedDog.name} is your Pawfect Match! 
                                </p>
                                
                                <p className="text-gray-700">
                                    Based on your favorites, we think you and {matchedDog.name} would be 
                                    the perfect companions for each other!
                                </p>
                            </motion.div>
                            
                            <Button 
                                onClick={() => handleCloseModal()}
                                className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 rounded-full"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">My Favorite Dogs</h1>

            {/* Sorting controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4 items-center">
                    <span className="font-medium">Sort by:</span>
                    <div className="flex space-x-2">
                        <Button
                            variant={sort === "Name" ? "default" : "outline"}
                            onClick={() => handleSortChange("Name")}
                            className="rounded-full"
                        >
                            Name
                        </Button>
                        <Button
                            variant={sort === "Age" ? "default" : "outline"}
                            onClick={() => handleSortChange("Age")}
                            className="rounded-full"
                        >
                            Age
                        </Button>
                        <Button
                            variant={sort === "Breed" ? "default" : "outline"}
                            onClick={() => handleSortChange("Breed")}
                            className="rounded-full"
                        >
                            Breed
                        </Button>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant={sortOrder === "asc" ? "default" : "outline"}
                        onClick={() => setSortOrder("asc")}
                        className="rounded-full"
                    >
                        Ascending
                    </Button>
                    <Button
                        variant={sortOrder === "desc" ? "default" : "outline"}
                        onClick={() => setSortOrder("desc")}
                        className="rounded-full"
                    >
                        Descending
                    </Button>
                </div>
            </div>

            {/* Loading state */}
            {loadingFavorites && (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size={48} className="text-blue-500" />
                    <span className="ml-4 text-xl">Loading your favorite dogs...</span>
                </div>
            )}

            {/* Empty state */}
            {!loadingFavorites && favoriteDogs.length === 0 && (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold mb-4">You haven't added any dogs to your favorites yet</h2>
                    <p className="text-gray-600 mb-6">Browse our available dogs and click the ❤️ to add them to your favorites</p>
                    <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full"
                        onClick={() => window.location.href = '/search'}
                    >
                        Browse Dogs
                    </Button>
                </div>
            )}

            {/* Dogs grid */}
            {!loadingFavorites && favoriteDogs.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedDogs.map((dog) => (
                            <DogCard key={dog.id} dog={dog} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-lg font-bold flex items-center">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}

                    {/* Find My Match button */}
                    <div className="mt-12 mb-8 flex justify-center">
                        <AnimatePresence>
                            <motion.div
                                initial={{ scale: 1 }}
                                animate={isMatchAnimating ?
                                    { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, 5, -5, 3, 0] } :
                                    { scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Button
                                    onClick={handleFindMatch}
                                    disabled={isMatchAnimating || favoriteDogs.length === 0}
                                    className="bg-pink-600 hover:bg-pink-700 text-white text-xl font-bold py-6 px-12 rounded-full shadow-lg transform transition hover:scale-105"
                                >
                                    Find My Pawfect Match! 🐾
                                </Button>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* Use our custom modal implementation for reliability */}
            <CustomModal />

            {/* Keep the Dialog component as a backup, but it may not be visible */}
            {/* <Dialog open={matchModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent
                    className="sm:max-w-md z-50"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl text-pink-600 font-bold">
                            Your Pawfect Match! 🐾
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-500">
                            We've found the perfect companion for you from your favorites!
                        </DialogDescription>
                    </DialogHeader>
                    {matchedDog && (
                        <div className="flex flex-col items-center p-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className="relative mb-4"
                            >
                                <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg">
                                    <img 
                                        src={matchedDog.img} 
                                        alt={matchedDog.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="absolute -right-2 -top-2 bg-pink-600 text-white rounded-full p-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                </motion.div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                            >
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">{matchedDog.name}</h3>
                                <p className="text-lg text-pink-600 font-medium mb-1">
                                    {matchedDog.breed} • {matchedDog.age} years old
                                </p>
                                <p className="text-gray-600 mb-6">
                                    {matchedDog.zip_code && `Located in ${matchedDog.zip_code}`}
                                </p>
                                
                                <p className="text-xl text-center font-semibold mb-4">
                                    {matchedDog.name} is your Pawfect Match! 
                                </p>
                                
                                <p className="text-gray-700">
                                    Based on your favorites, we think you and {matchedDog.name} would be 
                                    the perfect companions for each other!
                                </p>
                            </motion.div>
                            
                            <Button 
                                onClick={() => handleCloseModal()}
                                className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 rounded-full"
                            >
                                Close
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog> */}
        </div>
    );
}