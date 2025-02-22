"use client"

import React, { useState, useEffect } from "react";
import { Dog } from "../types/dogs";
import { useAuth } from "@/context/AuthContext";
import { searchDogs, getDogsById, fetchAllDogs, sortDogsByZip, getLocationByZip } from "@/services/api";
import DogCard from "./ui/DogCard";
import { Button } from "@/components/ui/button"
import LoginModal from "./LoginModal";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { shuffleArray } from "@/utils/shuffleArray";

export default function SearchBody() {
    const { user } = useAuth();
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [shuffledDogIds, setShuffledDogIds] = useState<string[]>([]);
    const [totalDogs, setTotalDogs] = useState(0);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [breed, setBreed] = useState<string>("")
    const [zipCode, setZipcode] = useState("")
    const [sort, setSort] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);
    const dogsPerPage = 6;

    useEffect(() => {
        if (!user) {
            setShowLoginModal(true)
        }
    })

    useEffect(() => {
        if(!user) return;

        const fetchDogs = async () => {
            try {
                    console.log("Fetching all dog IDs...");
                    const allDogIds = await fetchAllDogs(); // ✅ Fetch all dog IDs
                    console.log("Total dogs in API:", allDogIds.length); // ✅ Log total count
                    
                    setTotalDogs(allDogIds.length); // ✅ Store total count
                    
                    const shuffledIds = shuffleArray(allDogIds); // ✅ Shuffle once
                    setShuffledDogIds(shuffledIds); // ✅ Persist order
                    
                    // Fetch first batch of dogs (page 1)
                    const firstBatch = shuffledIds.slice(0, dogsPerPage);
                    const firstDogs = await getDogsById(firstBatch);
                    setAllDogs(firstDogs);
            } catch (error) {
                console.error("Error fetching dogs:", error)
            }
        };

        fetchDogs();
    }, [user]);

    useEffect(() => {
        if (shuffledDogIds.length === 0) return;

        const fetchDogsForPage = async () => {
            try {
                const from = (currentPage - 1) * dogsPerPage;
                const pageDogIds = shuffledDogIds.slice(from, from + dogsPerPage); 
                const dogsData = await getDogsById(pageDogIds);

                const zipCodes = [...new Set(dogsData.map((dog: Dog) => dog.zip_code ))] as string[];
                const zipToCityMap = await getLocationByZip(zipCodes)

                const dogsWithCity = dogsData.map((dog: Dog) => ({
                    ...dog,
                    city: zipToCityMap[dog.zip_code] || "Unknown"
                }))

                setAllDogs(dogsWithCity);
            } catch (error) {
                console.error("Error fetching paginated dogs:", error);
            }
        };

        fetchDogsForPage();
    }, [shuffledDogIds, currentPage]); 

    const handleSearch = async () => {
        try {
            let filterDogIds: string[] = [];

            if (breed && zipCode) {
                const searchResults = await searchDogs({ breeds: [breed] }, 0, 100);
                let dogIds = searchResults.resultIds;

                filterDogIds = await sortDogsByZip(dogIds, zipCode);
            } else if (breed) {
                const searchResults = await searchDogs({ breeds: [breed]}, 0, 100);
                filterDogIds = shuffleArray(searchResults.resultIds);
            } else if (zipCode) {
                const allDogIds = await fetchAllDogs();
                filterDogIds = await sortDogsByZip(allDogIds, zipCode)
            } else {
                filterDogIds = await fetchAllDogs();
            }

            if (filterDogIds.length > 0) {
                setShuffledDogIds(filterDogIds);
                setCurrentPage(1);

                const firstBatch = filterDogIds.slice(0, dogsPerPage);
                const firstDogs = await getDogsById(firstBatch);
                setAllDogs(firstDogs);
            } else {
                setAllDogs([]);
            }
        } catch (error) {
            console.error("Error filtering dogs:", error);
        }
    };

    if(showLoginModal){
        return <LoginModal closeModal={() => setShowLoginModal(false)}/>;
    }

    return (
        <div className="flex w-full">
            <div className="w-1/4 lg:w-[300px] bg-[#BEBEBE] h-screen left-0 top-0 p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between w-8 h-5 lg:w-[210px] lg:h-[40px] bg-white text-black hover:text-gray-700 border border-black rounded-3xl shadow-lg px-4 mt-4"
                        >
                            <span>Sort By: {sort || "None"}</span>
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-56 bg-white font-bold shadow-md z-50"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSort("Nearest")}>Nearest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSort("Furthest")}>Furthest</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between w-8 h-5 lg:w-[210px] lg:h-[40px] bg-white text-black hover:text-gray-700 border border-black rounded-3xl shadow-lg px-4 mt-4"
                        >
                            <span>Age: {sort || "All"}</span>
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-56 bg-white font-bold shadow-md z-50"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem>All</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between w-8 h-5 lg:w-[210px] lg:h-[40px] bg-white text-black hover:text-gray-700 border border-black rounded-3xl shadow-lg px-4 mt-4"
                        >
                            <span>Breed: {sort || "All"}</span>
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-56 bg-white font-bold shadow-md z-50"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem>All</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1  w-3/4 ">
                <div className='flex items-center w-full max-w-md bg-white rounded-full overflow-hidden shadow-md mx-auto my-8 border-1 border-yellow-500'>
                    <input
                        type="text"
                        placeholder='Enter Breed'
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        className='w-1/2 px-4 py-2 outline-none rounded-full'
                    />

                    <div className='h-6 w-px bg-gray-300' />

                    <div className="relative w-1/2">
                        <input
                            type='text'
                            placeholder='Enter Zip Code'
                            value={zipCode}
                            onChange={(e) => setZipcode(e.target.value)}
                            className='w-full px-4 py-2 outline-none rounded-r-full'
                        />
                        <button className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500' onClick={handleSearch}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="text-2xl left-0 top-0 my-6">Add Dogs To Your Paw list by clicking the <span className="text-red-500">❤︎</span> at the top right of the image  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-24">
                    {allDogs.length > 0 ? (
                        allDogs.map((dog) =>
                        <DogCard key={dog.id} dog={dog} />)
                    ) : (
                        <p className="text-4xl text-center text-gray-500 col-span-3">No dogs found.</p>
                    )}
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev -1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-lg font-bold">Page {currentPage}</span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={allDogs.length < dogsPerPage} 
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}