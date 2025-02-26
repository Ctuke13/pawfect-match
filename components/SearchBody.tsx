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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronDown } from "lucide-react";
import { LoadingSpinner } from "./ui/loadingspinner";

export default function SearchBody() {
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [breeds, setBreeds] = useState<string[]>([]);
    const [ages, setAges] = useState<string[]>([]);

    const [searchResults, setSearchResults] = useState<Dog[]>([]);
    const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);

    const [loadingMore, setLoadingMore] = useState(false);


    const [sort, setSort] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const [selectedBreed, setSelectedBreed] = useState<string>("");
    const [selectedAge, setSelectedAge] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState("");
    const [searchZipCode, setSearchZipcode] = useState("")

    const [currentPage, setCurrentPage] = useState(1);
    const dogsPerPage = 6;

    useEffect(() => {
        if (!user) {
            setShowLoginModal(true)
        }
    })

    useEffect(() => {
        if (!user) return;

        const fetchBreedsAndAges = async () => {
            try {
                const dogIds = await searchDogs({ size: 10000 });
                const dogDetails = await getDogsById(dogIds.resultIds);
                console.log("Dog details from fetchBreedsAndAges:", dogDetails.length);

                const breedList = [...new Set(dogDetails.map((dog: Dog) => dog.breed))].sort();
                const ageList = [...new Set(dogDetails.map((dog: Dog) => String(dog.age)))].sort();

                setBreeds(breedList);
                setAges(ageList);
            } catch (error) {
                console.log("Error fetching breeds and ages:", error);
            }
        };

        fetchBreedsAndAges();
    }, [user]);

    // Fetch default dogs on login
    useEffect(() => {
        if (!user) return;

        const fetchDogs = async () => {
            try {
                let defaultQuery: Record<string, any> = {
                    size: 100,
                    sort: "breed:asc"
                }

                console.log("🐶 Fetching default dogs...", defaultQuery);

                const searchResults = await searchDogs(defaultQuery, 0, 1, 100);
                const dogDetails = await getDogsById(searchResults.resultIds);

                console.log("Dog details from fetchDogs:", dogDetails.length);

                setSearchResults(dogDetails);
                setFilteredDogs(dogDetails);
                setCurrentPage(1);
            } catch (error) {
                console.error("❌ Error fetching default dogs:", error);
            }
        }

        fetchDogs();
    }, [user])

    const handleSearch = async () => {
        try {
            let query: Record<string, any> = {
                size: 100,
            }

            if (searchQuery) query.breeds = [selectedBreed];
            if (searchZipCode) query.zipCodes = [searchZipCode];

            query.sort = `${sort}:${sortOrder}`;

            console.log("🐶 Searching for dogs...", query);

            const searchResults = await searchDogs(query);
            const dogDetails = await getDogsById(searchResults.resultIds);

            setSearchResults(dogDetails);
            setFilteredDogs(dogDetails);
            setCurrentPage(1);
        } catch (error) {
            console.error("❌ Error fetching search results:", error);
        }
    }


    // Function to apply sorting
    const applySorting = async (dogs: Dog[]) => {
        return [...dogs].sort((a, b) => {
            let valueA = a[sort as keyof Dog];
            let valueB = b[sort as keyof Dog];

            if (valueA !== undefined && typeof valueA === "string") valueA = valueA.toLowerCase();
            if (valueB !== undefined && typeof valueB === "string") valueB = valueB.toLowerCase();

            if (sortOrder === "asc") {
                if (valueA !== undefined && valueB !== undefined) {
                    return valueA > valueB ? 1 : -1;
                } else {
                    return 0;
                }
            } else {
                if (valueA !== undefined && valueB !== undefined) {
                    return valueA < valueB ? 1 : -1;
                } else {
                    return 0;
                }
            }
        })
    }

    const applyFiltering = async () => {
        let filtered = searchResults;

        if (selectedBreed) {
            filtered = filtered.filter((dog: Dog) => dog.breed === selectedBreed);
        }

        if (selectedAge) {
            filtered = filtered.filter((dog: Dog) => String(dog.age) === selectedAge);
        }

        setFilteredDogs(await applySorting(filtered));
        setCurrentPage(1); // Reset to the first page after filtering
    }

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        setSortOrder("asc");
        applyFiltering();
    }

    // Paginate dogs
    const paginatedDogs = filteredDogs.slice((currentPage - 1) * dogsPerPage, currentPage * dogsPerPage);

    const handleNextPage = async () => {
        const maxPages = Math.ceil(searchResults.length / dogsPerPage);

        // If we reach the last page, check if more dogs exist
        if (currentPage >= maxPages) {
            setLoadingMore(true);
            console.log("Fetching more dogs...");
            try {
                const fromIndex = searchResults.length; // Get next batch after current results
                const searchResultsNewBatch = await searchDogs({ size: 100, sort: "breed:asc" }, fromIndex);
                const newDogDetails = await getDogsById(searchResultsNewBatch.resultIds);

                // Append new dogs to the existing list
                setSearchResults((prev) => [...prev, ...newDogDetails]);
                setFilteredDogs((prev) => [...prev, ...newDogDetails]);

                setCurrentPage((prev) => prev + 1); // Move to the next page
            } catch (error) {
                console.error("❌ Error fetching more dogs:", error);
            } finally {
                setLoadingMore(false);
            }
        } else {
            setCurrentPage((prev) => prev + 1);
        }
    };


    if (showLoginModal) {
        return <LoginModal closeModal={() => setShowLoginModal(false)} />;
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
                            <DropdownMenuItem onClick={() => { setSort("Nearest") }}>Nearest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSort("Furthest") }}>Furthest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleSortChange("Age"); }}>Age</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleSortChange("Breed"); }}>Breed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleSortChange("Name"); }}>Name</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {sort === "Age" || sort === "Breed" || sort === "Name" ? (
                    <RadioGroup
                        value={sortOrder}
                        onValueChange={(value) => setSortOrder(value)}
                        className="flex flex-col mx-4 mt-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="asc" id="ascending" />
                            <Label htmlFor="ascending">Ascending</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="desc" id="descending" />
                            <Label htmlFor="descending">Descending</Label>
                        </div>
                    </RadioGroup>
                ) : null}


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
                            {ages.map((age) => (
                                <DropdownMenuItem key={age} onClick={() => { setSelectedAge(age); applyFiltering(); }}>
                                    {age}
                                </DropdownMenuItem>
                            ))}
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
                            {breeds.map((breed) => (
                                <DropdownMenuItem key={breed} onClick={() => { setSelectedBreed(breed); applyFiltering(); }}>
                                    {breed}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1  w-3/4 ">
                <div className='flex items-center w-full max-w-md bg-white rounded-full overflow-hidden shadow-md mx-auto my-8 border-1 border-yellow-500'>
                    <input
                        type="text"
                        placeholder='Enter Name or Breed'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-1/2 px-4 py-2 outline-none rounded-full'
                    />

                    <div className='h-6 w-px bg-gray-300' />

                    <div className="relative w-1/2">
                        <input
                            type='text'
                            placeholder='Enter Zip Code'
                            value={searchZipCode}
                            onChange={(e) => setSearchZipcode(e.target.value)}
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
                    {paginatedDogs.length > 0 ? (
                        paginatedDogs.map((dog) =>
                            <DogCard key={dog.id} dog={dog} />)
                    ) : (
                        <p className="text-4xl text-center text-gray-500 col-span-3">No dogs found.</p>
                    )}
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-lg font-bold">Page {currentPage}</span>
                    <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <>
                                Loading...
                                <LoadingSpinner size={16} className="ml-2" />
                            </>
                        ) : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
}