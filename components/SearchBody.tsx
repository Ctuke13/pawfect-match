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
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
    const [isFiltered, setIsFiltered] = useState(false);

    const [totalDogs, setTotalDogs] = useState(0);

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
                const allDogIds = await fetchAllDogs();
                const dogDetails = await getDogsById(allDogIds);

                // Extract unique breeds and ages
                const breedList = [...new Set(dogDetails.map((dog: Dog) => dog.breed))].sort();
                const ageList = [...new Set(dogDetails.map((dog: Dog) => Number(dog.age)))]
                    .filter(age => !isNaN(age) && age >= 0) // Ensure valid ages
                    .sort((a, b) => a - b);

                setBreeds(breedList);
                setAges(ageList.map(String));

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
                    size: dogsPerPage,
                    sort: "breed:asc"
                }

                console.log("🐶 Fetching default dogs...", defaultQuery);

                const searchResults = await searchDogs(defaultQuery, 0, 1, dogsPerPage);

                console.log("Search results from fetchDogs:", searchResults);

                const dogDetails = await getDogsById(searchResults.resultIds);

                console.log("Dog details from fetchDogs:", dogDetails.length);

                setSearchResults(searchResults.resultIds);
                setFilteredDogs(dogDetails);
                setTotalDogs(searchResults.total);
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

    const applyFiltering = async (newBreed?: string, newAge?: string) => {
        try {
            let query: Record<string, any> = {
                size: dogsPerPage,
                from: 0,
            };

            if (newBreed) {
                setSelectedBreed(newBreed);
                query.breeds = [newBreed];
            } else if (selectedBreed) {
                query.breeds = [selectedBreed];
            }

            if (newAge) {
                setSelectedAge(newAge);
            }

            query.ageMin = newAge || selectedAge;
            query.ageMax = newAge || selectedAge;

            console.log("🐶 Applying filters:", query);

            const searchResults = await searchDogs(query);

            console.log("Total Filtered Dogs:", searchResults.total);
            console.log("Search Results from applyFiltering:", searchResults)


            // Fetch the first batch of dog details for display
            const dogDetails = await getDogsById(searchResults.resultIds.slice(0, dogsPerPage));

            console.log("Filtered Dog Results:", dogDetails.length);
            setTotalDogs(searchResults.total);
            setFilteredDogs(dogDetails);
            setSearchResults(searchResults.resultIds);

            setIsFiltered(true);
        } catch (error) {
            console.error("❌ Error applying filters:", error);
        }
    };

    const handleSortChange = async (newSort: string) => {
        setSort(newSort);

        if (newSort === "Nearest" || newSort === "Furthest") {
            if (!user?.zipcode) {
                console.error("❌ User zipcode is required for distance sorting.");
            }


            setLoadingMore(true);

            try {
                console.log("📡 Fetching dog IDs based on filters... ")

                // Apply filters if they exist
                let query: Record<string, any> = {
                    size: 100,
                };

                if (selectedBreed) query.breeds = [selectedBreed];
                if (selectedAge) {
                    query.ageMin = selectedAge;
                    query.ageMax = selectedAge;
                }

                //Fetch dogs that match the filters
                const searchResults = await searchDogs(query);
                const searchResultsIds = searchResults.resultIds;

                console.log(`🐶 Found ${searchResultsIds.length} filtered dogs.`)

                if (searchResultsIds.length === 0) {
                    console.warn("🚨 No dogs found matching the filters.")
                    setFilteredDogs([]);
                    setSearchResults([]);
                    setTotalDogs(0);
                    return;
                }

                console.log("📡 Fetching full dog details...")
                const dogDetails = await getDogsById(searchResultsIds);
                console.log("✅ Successfully fetched to be sorted and/or filtered dogs.")

                console.log("📡 Sorting filtered dogs by distance...");
                const sortedDogIds = await sortDogsByZip(dogDetails.map((dog: Dog) => dog.id as string), user?.zipcode as string);

                let sortedDogs = await getDogsById(sortedDogIds);

                if (newSort === "Furthest") {
                    sortedDogs.reverse();
                }

                console.log("✅ Successfully sorted filtered dogs!");

                // Store sorted list in searchResults for paginated display
                setSearchResults(sortedDogIds);
                setFilteredDogs(sortedDogs.slice(0, dogsPerPage));
                setTotalDogs(sortedDogs.length);
                setCurrentPage(1); // Reset pagination
            } catch (error) {
                console.error("❌ Error sorting dogs:", error);
            } finally {
                setLoadingMore(false);
            }
        } else {           
            setSortOrder("asc")
            applySorting(filteredDogs);
        }
    }

    // const handleNextPage = async () => {
    //     if (loadingMore) return;
    //     if (searchResults.length === 0) return;

    //     setLoadingMore(true);

    //     try {
    //         if (!isFiltered) {
    //             const maxPages = Math.ceil(searchResults.length / dogsPerPage);

    //             // If we reach the last page, check if more dogs exist
    //             if (currentPage >= maxPages) {
    //                 setLoadingMore(true);
    //                 console.log("Fetching more dogs...");
    //                 try {
    //                     const fromIndex = searchResults.length; // Get next batch after current results
    //                     const searchResultsNewBatch = await searchDogs({ size: 100, sort: "breed:asc" }, fromIndex);
    //                     const newDogDetails = await getDogsById(searchResultsNewBatch.resultIds);

    //                     // Append new dogs to the existing list
    //                     setSearchResults((prev) => [...prev, ...newDogDetails]);
    //                     setFilteredDogs((prev) => [...prev, ...newDogDetails]);

    //                     setCurrentPage((prev) => prev + 1); // Move to the next page
    //                 } catch (error) {
    //                     console.error("❌ Error fetching more dogs:", error);
    //                 } finally {
    //                     setLoadingMore(false);
    //                 }
    //             } else {
    //                 setCurrentPage((prev) => prev + 1);
    //                 setLoadingMore
    //             }
    //             return;
    //         }
    //         // 📌 Paginate filtered results
    //     if (filteredDogs.length >= totalDogs) {
    //         console.log("🚫 No more filtered dogs to fetch.");
    //         setLoadingMore(false);
    //         return;
    //     }

    //     let query: Record<string, any> = {
    //         size: dogsPerPage,
    //         from: searchResults.length, // Move forward in results
    //     };

    //     if (selectedBreed) query.breeds = [selectedBreed];
    //     if (selectedAge) {
    //         query.ageMin = selectedAge;
    //         query.ageMax = selectedAge;
    //     }

    //     console.log("🐶 Fetching more filtered dogs...", query);

    //     const searchResultsNewBatch = await searchDogs(query);
    //     if (!searchResultsNewBatch.resultIds || searchResultsNewBatch.resultIds.length === 0) {
    //         console.log("🚫 No more filtered results.");
    //         setLoadingMore(false);
    //         return;
    //     }

    //     // Fetch new batch of dog details
    //     const newDogDetails = await getDogsById(searchResultsNewBatch.resultIds);

    //     console.log("🐶 New filtered page dog count:", newDogDetails.length);

    //     // Append new results
    //     setSearchResults((prev) => [...prev, ...searchResultsNewBatch.resultIds]);
    //     setFilteredDogs((prev) => [...prev, ...newDogDetails]);
    //     setCurrentPage((prev) => prev + 1);
    //     } catch (error) {
    //         console.error("❌ Error fetching more dogs:", error);
    //     } finally {
    //         setLoadingMore
    //     }
    // };

    const handleNextPage = async () => {
        if (loadingMore) return;
        if (searchResults.length === 0) return;

        setLoadingMore(true);

        try {
            // 🟢 CASE 1: PAGINATE SORTED (NEAREST/FURTHEST) DOGS
            if (sort === "Nearest" || sort === "Furthest") {
                console.log("📡 Paginating Nearest/Furthest sorted dogs...");
                
                const maxPages = Math.ceil(searchResults.length / dogsPerPage);
    
                if (currentPage < maxPages) {
                    const fromIndex = currentPage * dogsPerPage;
                    const toIndex = fromIndex + dogsPerPage;
    
                    console.log(`🔄 Paginating sorted dogs from index ${fromIndex} to ${toIndex}`);
    
                    // Slice from the sorted list
                    const nextBatchIds = searchResults.slice(fromIndex, toIndex);
                    const nextBatchDogs = await getDogsById(nextBatchIds);
                    console.log(nextBatchDogs)
    
                    setFilteredDogs(prev => [...prev, ...nextBatchDogs]);
                    setCurrentPage(prev => prev + 1);
                } else {
                    console.log("🚫 No more sorted pages available.");
                }
                return;
            }

            // 🟢 CASE 2: INITIAL LOAD PAGINATION
            if (!isFiltered) {
                console.log("Initial searchResults", searchResults);
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
                        setSearchResults((prev) => [...prev, ...searchResultsNewBatch.resultIds]);
                        setFilteredDogs((prev) => [...prev, ...newDogDetails]);

                        setCurrentPage((prev) => prev + 1); // Move to the next page
                    } catch (error) {
                        console.error("❌ Error fetching more dogs:", error);
                    } finally {
                        setLoadingMore(false);
                    }
                } else {
                    setCurrentPage((prev) => prev + 1);
                    setLoadingMore(false);
                }
                return;
            }

            // 🟢 CASE 3: PAGINATE FILTERED RESULTS (BREED/AGE)
            console.log("Paginating filtered results...");
            // 📌 Paginate filtered results using the same method as unfiltered
            const maxPagesFiltered = Math.ceil(totalDogs / dogsPerPage);

            console.log("Current page:", currentPage, "Max pages filtered:", maxPagesFiltered);
            if (currentPage < maxPagesFiltered) {
                setLoadingMore(true);
                console.log("Fetching more filtered dogs...");
                try {
                    console.log("Current Page:", currentPage);
                    console.log("Total Dogs:", totalDogs);
                    console.log("Filtered Dogs Length:", filteredDogs.length);

                    const fromIndex = currentPage * dogsPerPage; // Get next batch after current results

                    console.log("🔍 Current filtered dogs:", fromIndex);
                    // Build the query with the correct filters
                    let query: Record<string, any> = {
                        size: dogsPerPage,
                        from: fromIndex, // Move forward in results
                    };

                    if (selectedBreed) query.breeds = [selectedBreed];
                    if (selectedAge) {
                        query.ageMin = selectedAge;
                        query.ageMax = selectedAge;
                    }

                    console.log("🔍 Filtered Query for next batch:", query);

                    // Fetch the next batch of filtered dogs
                    const searchResultsNewBatch = await searchDogs(query);
                    console.log("🆕 New filtered search results:", searchResultsNewBatch);

                    if (!searchResultsNewBatch.resultIds || searchResultsNewBatch.resultIds.length === 0) {
                        console.log("🚫 No more filtered results available.");
                        setLoadingMore(false);
                        return;
                    }

                    // Fetch full dog details for the new batch
                    console.log("🔗 Fetching details for IDs:", searchResultsNewBatch.resultIds);
                    const newDogDetails = await getDogsById(searchResultsNewBatch.resultIds);

                    console.log("✅ Fetched new batch dog details:", newDogDetails);

                    // Append new results
                    setSearchResults((prev) => [...prev, ...searchResultsNewBatch.resultIds]);
                    setFilteredDogs(newDogDetails);
                    setCurrentPage((prev) => prev + 1);
                } catch (error) {
                    console.error("❌ Error fetching more filtered dogs:", error);
                } finally {
                    setLoadingMore(false);
                }
            } else {
                setCurrentPage((prev) => prev + 1);
                setLoadingMore(false);
            }
        } catch (error) {
            console.error("❌ Error in pagination:", error);
        } finally {
            setLoadingMore(false);
        }
    };

       // Paginate dogs
       const paginatedDogs = filteredDogs.slice((currentPage - 1) * dogsPerPage, currentPage * dogsPerPage);


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
                            <DropdownMenuItem onClick={() => handleSortChange("Nearest")}>
                                Nearest
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleSortChange("Furthest")}>
                                Furthest
                            </DropdownMenuItem>
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
                            <span>Age: {selectedAge || "All"}</span>
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-56 bg-white font-bold shadow-md z-50"
                    >
                        <ScrollArea className="h-40 w-full overflow-auto">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => { setSelectedBreed("") }}>All</DropdownMenuItem>
                                {ages.length > 0 ? (
                                    ages.map((age) => (
                                        <DropdownMenuItem key={age} onClick={() => { setSelectedAge(age); }}>
                                            {age}
                                        </DropdownMenuItem>
                                    ))

                                ) : (
                                    <DropdownMenuItem disabled>Loading ages...</DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between w-full bg-white text-black border border-black rounded-3xl shadow-lg px-4 mt-4"
                        >
                            <span>Breed: {selectedBreed || "All"}</span>
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white font-bold shadow-md z-50">
                        <ScrollArea className="h-40 w-full overflow-auto">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => { setSelectedBreed("") }}>
                                    All
                                </DropdownMenuItem>
                                {breeds.length > 0 ? (
                                    breeds.map((breed) => (
                                        <DropdownMenuItem key={breed} onClick={() => { setSelectedBreed(breed); }}>
                                            {breed}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem disabled>Loading breeds...</DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    className="mt-4 w-full bg-blue-600 text-white"
                    onClick={() => { setIsFiltered(true); applyFiltering(selectedBreed, selectedAge); }}
                >
                    Apply Filters
                </Button>


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