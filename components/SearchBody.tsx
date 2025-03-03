"use client"

import React, { useState, useEffect } from "react";
import { Dog } from "../types/dogs";
import { useAuth } from "@/context/AuthContext";
import { searchDogs, getDogsById, fetchAllDogs, sortDogsByZip, getLocationByZip } from "@/services/api";
import { loadAndSortAllDogs } from "@/services/dogSorting";
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
import { error } from "console";
import { all } from "axios";

export default function SearchBody() {
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [breeds, setBreeds] = useState<string[]>([]);
    const [ages, setAges] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);

    const [searchResults, setSearchResults] = useState<string[]>([]);
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
        if (sort && (sort === "Age" || sort === "Breed" || sort === "Name")) {
            handleSortChange(sort);
        }
    }, [sortOrder]);

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
                const nameList = [...new Set(dogDetails.map((dog: Dog) => dog.name))].sort();

                setBreeds(breedList);
                setAges(ageList.map(String));
                setNames(nameList);
                console.log("Names:", nameList);
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
                console.log("Search results from fetchDogs:", searchResults)
                setFilteredDogs(dogDetails);
                setTotalDogs(searchResults.total);
                setCurrentPage(1);
            } catch (error) {
                console.error("❌ Error fetching default dogs:", error);
            }
        }

        fetchDogs();
    }, [user])

    // Handle progress updates from the incremental loading process
    const handleSortingProgress = (
        filteredDogs: Dog[],
        searchResults: string[],
        totalDogs: number,
        isComplete: boolean
    ) => {

        console.log("Progress callback received:", { filteredDogsCount: filteredDogs.length, searchResultsCount: searchResults.length, totalDogs, isComplete });

        // Optionally show a notification that sorting is still in progress
        if (!isComplete) {
            // You could implement a "Sorting in progress..." indicator
            console.log(`Sorting progress: ${searchResults.length}/${totalDogs} dogs sorted`);
        } else {
            console.log("Sorting complete!");
            // You could implement a "Sorting complete" notification
        }
    };


    const handleSearch = async () => {
        try {
            setLoadingMore(true);

            // Reset any previous search state
            setCurrentPage(1);

            let query: Record<string, any> = {
                size: 100,
            };

            // Case 1: ZIP code search only
            if (searchZipCode && !searchQuery) {
                console.log("🔍 ZIP code search - Using direct distance sorting");

                setSelectedBreed("");
                setSelectedAge("");

                // Set the sort UI
                setSort("Nearest");
                setSortOrder("asc");

                // Fetch dogs without filtering by ZIP first
                // (We'll do the distance sorting on the client)


                console.log("Executing search for ZIP code sorting:", query);
                const searchResults = await searchDogs(query);

                if (!searchResults || !searchResults.resultIds || searchResults.resultIds.length === 0) {
                    console.warn("🚨 No dogs found to sort by distance.");
                    setFilteredDogs([]);
                    setSearchResults([]);
                    setTotalDogs(0);
                    setLoadingMore(false);
                    return;
                }

                // Fetch dog details for sorting
                const dogDetails = await getDogsById(searchResults.resultIds);
                console.log(`Retrieved ${dogDetails.length} dogs for distance sorting`);

                // Sort by distance to the searched ZIP code
                console.log("Sorting dogs by distance to ZIP:", searchZipCode);
                const sortedDogIds = await sortDogsByZip(
                    dogDetails.map(dog => dog.id as string),
                    searchZipCode
                );

                // Get first page of dogs
                const firstPageIds = sortedDogIds.slice(0, dogsPerPage);
                const firstPageDogs = await getDogsById(firstPageIds);

                // Update state
                setSearchResults(sortedDogIds);
                setFilteredDogs(firstPageDogs);
                setTotalDogs(dogDetails.length);
                setIsFiltered(true);
            }

            // Case 2: Breed/Name search only
            else if (searchQuery && !searchZipCode) {
                console.log("🔍 Breed/Name search detected");

                // Check if the search query matches a known breed
                const exactBreedMatch = breeds.find(
                    breed => breed.toLowerCase() === searchQuery.toLowerCase()
                );

                if (exactBreedMatch) {
                    console.log("🐕 Exact breed match found:", exactBreedMatch);
                    setSelectedBreed(exactBreedMatch);
                    setSelectedAge("");
                    query.breeds = [exactBreedMatch];

                    // Execute search for breeds
                    console.log("Executing breed search:", query);
                    const searchResults = await searchDogs(query);

                    if (!searchResults || !searchResults.resultIds || searchResults.resultIds.length === 0) {
                        console.warn("🚨 No dogs found for this breed.");
                        setFilteredDogs([]);
                        setSearchResults([]);
                        setTotalDogs(0);
                        setLoadingMore(false);
                        return;
                    }

                    const dogDetails = await getDogsById(searchResults.resultIds);

                    // Update state
                    setSearchResults(searchResults.resultIds);
                    setFilteredDogs(dogDetails);
                    setTotalDogs(searchResults.total);
                    setIsFiltered(true);
                } else {
                    console.log("🔍 Name search detected");

                    // Check if the search query matches a known breed
                    const exactNameMatch = names.find(
                        name => name.toLowerCase() === searchQuery.toLowerCase()
                    );              

                    console.log("🐕 Exact name match found:", exactNameMatch);

                    if (exactNameMatch) {
                        console.log("🐕 Exact breed match found:", exactNameMatch);
                        setSelectedBreed(exactNameMatch);
                        query.name = exactNameMatch;

                        // Execute search for breeds
                        console.log("Executing name search:", query);
                        const searchResults = await searchDogs(query);


                        if (!searchResults || !searchResults.resultIds || searchResults.resultIds.length === 0) {
                            console.warn("🚨 No dogs found for this breed.");
                            setFilteredDogs([]);
                            setSearchResults([]);
                            setTotalDogs(0);
                            setLoadingMore(false);
                            return;
                        }

                        const dogDetails = await getDogsById(searchResults.resultIds);

                        // Update state
                        setSearchResults(searchResults.resultIds);
                        setFilteredDogs(dogDetails);
                        setTotalDogs(searchResults.total);
                        setIsFiltered(true);

                    }
                    setLoadingMore(false);
                    return;
                }
            }
            // Case 3: Combined search (breed/name + ZIP)
            else if (searchQuery && searchZipCode) {
                console.log("🔍 Combined search (breed/name + ZIP)");

                // Check if the search query matches a known breed
                const exactBreedMatch = breeds.find(
                    breed => breed.toLowerCase() === searchQuery.toLowerCase()
                );

                // Base query - don't include ZIP since we'll sort by distance
                let query: Record<string, any> = {
                    size: 100, // Get enough for distance sorting
                };

                // Set the UI for sorting by distance
                setSort("Nearest");
                setSortOrder("asc");

                if (exactBreedMatch) {
                    console.log("🐕 Breed + ZIP search detected for breed:", exactBreedMatch);
                    setSelectedBreed(exactBreedMatch);
                    query.breeds = [exactBreedMatch];
                } else {
                    console.log("🔍 Name + ZIP search detected for name:", searchQuery);
                    query.name = searchQuery;
                    setSelectedBreed("");
                }

                // Execute search to find matching dogs
                console.log("Executing combined search:", query);
                const searchResults = await searchDogs(query);

                if (!searchResults || !searchResults.resultIds || searchResults.resultIds.length === 0) {
                    console.warn("🚨 No dogs found matching the criteria.");
                    setFilteredDogs([]);
                    setSearchResults([]);
                    setTotalDogs(0);
                    setLoadingMore(false);
                    return;
                }

                // Get all dog details for distance sorting
                const dogDetails = await getDogsById(searchResults.resultIds);
                console.log(`Retrieved ${dogDetails.length} dogs for distance sorting`);

                // If it's a name search, filter by name first
                let filteredDetails = dogDetails;

                if (!exactBreedMatch) {
                    // Filter by name (case-insensitive, partial match)
                    filteredDetails = dogDetails.filter(dog =>
                        dog.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    console.log(`Filtered to ${filteredDetails.length} dogs matching name "${searchQuery}"`);

                    if (filteredDetails.length === 0) {
                        console.warn("🚨 No dogs found matching the name.");
                        setFilteredDogs([]);
                        setSearchResults([]);
                        setTotalDogs(0);
                        setLoadingMore(false);
                        return;
                    }
                }

                // Get the IDs of filtered dogs for distance sorting
                const filteredIds = filteredDetails.map(dog => dog.id as string);

                // Sort the filtered dogs by distance
                console.log("Sorting filtered dogs by distance to ZIP:", searchZipCode);
                const sortedDogIds = await sortDogsByZip(filteredIds, searchZipCode);

                // Get the first page of sorted dogs
                const firstPageIds = sortedDogIds.slice(0, dogsPerPage);
                const firstPageDogs = await getDogsById(firstPageIds);

                // Update state
                setSearchResults(sortedDogIds);
                setFilteredDogs(firstPageDogs);
                setTotalDogs(sortedDogIds.length);
                setIsFiltered(true);
            }

            // Case 4: No search criteria
            else {
                console.log("🔍 No search criteria - showing default results");

                // Reset filters and sorting
                setSelectedBreed("");
                setSort("");
                setSortOrder("asc");

                // Base query
                let query: Record<string, any> = {
                    size: dogsPerPage,
                    from: 0,
                    sort: "breed:asc" // Default sort
                };

                // Execute search
                console.log("Executing default search:", query);
                const searchResults = await searchDogs(query);

                // Get dog details for the first page
                const dogDetails = await getDogsById(searchResults.resultIds);

                // Update state
                setSearchResults(searchResults.resultIds);
                setFilteredDogs(dogDetails);
                setTotalDogs(searchResults.total);
                setIsFiltered(false);
            }
        } catch (error) {
            console.error("❌ Error during search:", error);

            // Handle error state
            setFilteredDogs([]);
            setSearchResults([]);
            setTotalDogs(0);
        } finally {
            setLoadingMore(false);
        }
    };


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
            // Reset state variables 
            setLoadingMore(true);
            setCurrentPage(1);

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

            const ageValue = newAge || selectedAge;
            if (ageValue && ageValue !== "All") {
                query.ageMin = ageValue;
                query.ageMax = ageValue;
            }

            console.log("🐶 Applying filters:", query);

            const searchResults = await searchDogs(query);

            console.log("Total Filtered Dogs:", searchResults.total);
            console.log("Search Results from applyFiltering:", searchResults)


            // Fetch the first batch of dog details for display
            const dogDetails = await getDogsById(searchResults.resultIds.slice(0, dogsPerPage));

            console.log("Filtered Dog Results:", dogDetails.length);
            setTotalDogs(searchResults.total);
            setSearchResults(searchResults.resultIds);
            setFilteredDogs(dogDetails);
            setIsFiltered(true);

            setCurrentPage(1);
        } catch (error) {
            console.error("❌ Error applying filters:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleSortChange = async (newSort: string) => {
        setSort(newSort);
        setLoadingMore(true);

        try {
            // CASE 1: Distance-based sorting (Nearest/Furthest)
            if (newSort === "Nearest" || newSort === "Furthest") {
                if (!user?.zipcode) {
                    console.error("❌ User zipcode is required for distance sorting.");
                    setLoadingMore(false);
                    return;
                }

                console.log("📡 Fetching dogs for distance sorting...");

                // Apply filters if they exist
                let query: Record<string, any> = {
                    size: 100, // Fetch a good batch of dogs for sorting
                };

                if (selectedBreed) query.breeds = [selectedBreed];
                if (selectedAge && selectedAge !== "All") {
                    query.ageMin = selectedAge;
                    query.ageMax = selectedAge;
                }

                // Fetch dogs that match the filters
                const searchResultsData = await searchDogs(query);
                const dogIds = searchResultsData.resultIds;

                console.log(`🐶 Found ${dogIds.length} dogs for distance sorting.`);

                if (dogIds.length === 0) {
                    console.warn("🚨 No dogs found matching the filters.");
                    setFilteredDogs([]);
                    setSearchResults([]);
                    setTotalDogs(0);
                    setLoadingMore(false);
                    return;
                }

                console.log("📡 Fetching full dog details for distance sorting...");
                const dogDetails = await getDogsById(dogIds);
                console.log(`✅ Successfully fetched ${dogDetails.length} dogs.`);

                console.log("📡 Sorting dogs by distance...");
                const sortedDogIds = await sortDogsByZip(
                    dogDetails.map((dog: Dog) => dog.id as string),
                    user?.zipcode as string
                );

                // If we want furthest first, reverse the sorted order
                if (newSort === "Furthest") {
                    sortedDogIds.reverse();
                }

                // Get the first page of dogs to display
                const firstPageIds = sortedDogIds.slice(0, dogsPerPage);
                const firstPageDogs = await getDogsById(firstPageIds);

                console.log(`✅ Successfully sorted and retrieved first page of ${firstPageDogs.length} dogs!`);

                // Store the complete sorted list of IDs for pagination
                setSearchResults(sortedDogIds);
                // Display the first page
                setFilteredDogs(firstPageDogs);
                setTotalDogs(sortedDogIds.length);
                setCurrentPage(1); // Reset pagination
            }
            // CASE 2: Attribute-based sorting (Age, Breed, Name)
            else {
                let sortField = newSort.toLowerCase();

                console.log(`📡 Using server-side sorting for ${newSort} in ${sortOrder} order`)

                let query: Record<string, any> = {
                    size: dogsPerPage,
                    from: 0,
                    sort: `${sortField}:${sortOrder}`,
                };

                if (selectedBreed) query.breeds = [selectedBreed];
                if (selectedAge && selectedAge !== "All") {
                    query.ageMin = selectedAge;
                    query.ageMax = selectedAge;
                }

                console.log("📡 Fetching dogs for attribute sorting...");
                const sortedResults = await searchDogs(query);

                if (sortedResults.resultIds.length === 0) {
                    console.warn("🚨 No dogs found matching the filters.");
                    setFilteredDogs([]);
                    setSearchResults([]);
                    setTotalDogs(0);
                    setLoadingMore(false);
                    return;
                }

                const dogDetails = await getDogsById(sortedResults.resultIds);
                console.log(`✅ Retrieved ${dogDetails.length} dogs for first page of ${sortField} sorting`);

                // Store the complete sorted list
                setSearchResults(sortedResults.resultIds);
                // Display only the first page
                setFilteredDogs(dogDetails);
                setTotalDogs(sortedResults.total);
                setCurrentPage(1);
                setIsFiltered(true)
            }
        } catch (error) {
            console.error("❌ Error sorting dogs:", error);
        } finally {
            setLoadingMore(false);
        }
    };

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
                console.log(`SearcResults length: ${searchResults.length}`);

                // If we reach the last page, check if more dogs exist
                if (currentPage >= maxPages) {
                    setLoadingMore(true);
                    console.log("Fetching more dogs...");
                    try {
                        const fromIndex = currentPage * dogsPerPage; // Get next batch after current results
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
            const maxPagesFiltered = Math.ceil(searchResults.length / dogsPerPage);

            console.log(`SearcResults length in Filtered Results: ${searchResults.length}`);

            console.log("Current page:", currentPage, "Max pages filtered:", maxPagesFiltered);
            if (currentPage <= Math.floor(maxPagesFiltered)) {
                setLoadingMore(true);
                console.log("Fetching more filtered dogs...");
                try {
                    // Calculate how many dogs we need to fetch
                    const fromIndex = currentPage * dogsPerPage;

                    console.log(`Fetching dogs for page ${currentPage + 1} starting at index ${fromIndex}`);

                    let query: Record<string, any> = {
                        size: dogsPerPage, 
                        from: fromIndex,
                    };

                    if (sort === "Age" || sort === "Breed" || sort === "Name") {
                        let sortField = sort.toLowerCase();
                        query.sort = `${sortField}:${sortOrder}`;
                    }

                    if (selectedBreed) query.breeds = [selectedBreed];
                    if (selectedAge && selectedAge !== "All") {
                        query.ageMin = selectedAge;
                        query.ageMax = selectedAge;
                    }

                    // Fetch the next page
                    const nextPageResults = await searchDogs(query);

                    if (!nextPageResults.resultIds || nextPageResults.resultIds.length === 0) {
                        console.log("No more dogs available");
                        setLoadingMore(false);
                        return;
                    }

                    // Fetch dog details
                    const nextPageDogs = await getDogsById(nextPageResults.resultIds);

                    // CRITICAL CHANGE: Append to filteredDogs to build a complete collection
                    if (currentPage === 1) {
                        // We're on page 1 going to page 2 - discard the page 1 dogs
                        setFilteredDogs(nextPageDogs);
                    } else {
                        // For subsequent pages, continue to append as you currently do
                        setFilteredDogs(prev => [...prev, ...nextPageDogs]);
                    }

                        setCurrentPage(prev => prev + 1);
                    } catch (error) {
                        console.error("Error fetching more dogs:", error);
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
                                <Label htmlFor="ascending" >Ascending</Label>
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

                                    <DropdownMenuItem onClick={() => { setSelectedAge("All") }}>All</DropdownMenuItem>
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
                            placeholder='Enter Breed'
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