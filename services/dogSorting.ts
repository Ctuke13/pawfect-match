// services/dogSortingService.ts
import { searchDogs, getDogsById, sortDogsByZip } from './api';
import { Dog } from '@/types/dogs';

// Define a type for the progress callback function
type ProgressCallback = (
  filteredDogs: Dog[], 
  searchResults: string[], 
  totalDogs: number, 
  isComplete: boolean
) => void;

/**
 * Incrementally loads and sorts all dogs by distance to a ZIP code
 * 
 * @param zipCode The ZIP code to sort distances from
 * @param dogsPerPage Number of dogs to display per page
 * @param breedFilter Optional breed to filter by
 * @param onProgress Callback function that receives updated results
 * @param onError Callback function for error handling
 * @returns A promise that resolves when all dogs have been loaded and sorted
 */
export const loadAndSortAllDogs = async (
  zipCode: string,
  dogsPerPage: number,
  breedFilter?: string,
  onProgress?: ProgressCallback,
  onError?: (error: Error) => void
) => {
  let allDogIds: string[] = []; // Will hold all dog IDs from all batches
  let isLoadingComplete = false; // Tracks if we've loaded the entire dataset
  let currentBatchIndex = 0; // Tracks which batch we're currently loading

  try {
    // Keep fetching batches until we've loaded all dogs
    let hasMoreDogs = true;
    
    while (hasMoreDogs) {
      // Calculate the starting index for this batch
      const fromIndex = currentBatchIndex * 100;
      
      // Prepare query for the next batch
      const query: Record<string, any> = {
        size: 100,
        from: fromIndex,
      };
      
      // Add breed filter if provided
      if (breedFilter) {
        query.breeds = [breedFilter];
      }
      
      console.log(`Fetching batch ${currentBatchIndex + 1}, starting from index ${fromIndex}`);
      
      // Fetch the next batch of dogs
      const batchResults = await searchDogs(query);
      
      // Check if we received any results
      if (!batchResults || !batchResults.resultIds || batchResults.resultIds.length === 0) {
        // No more dogs to fetch
        hasMoreDogs = false;
        isLoadingComplete = true;
        console.log("Completed loading all dogs from the database");
        break;
      }
      
      // Add these dog IDs to our accumulated list
      allDogIds = [...allDogIds, ...batchResults.resultIds];
      
      // If this is the first batch, we should process and return results immediately
      if (currentBatchIndex === 0) {
        // Get dog details for the first batch
        const firstBatchDogs = await getDogsById(batchResults.resultIds);
        
        // Sort them by distance
        const sortedFirstBatchIds = await sortDogsByZip(
          firstBatchDogs.map(dog => dog.id as string),
          zipCode
        );
        
        // Get the first page of dogs for display
        const firstPageIds = sortedFirstBatchIds.slice(0, dogsPerPage);
        const firstPageDogs = await getDogsById(firstPageIds);
        
        // Call the progress callback with initial results
        if (onProgress) {
          onProgress(
            firstPageDogs,
            sortedFirstBatchIds,
            batchResults.total || batchResults.resultIds.length,
            false // Not complete yet
          );
        }
      }
      
      // Check if we've reached the end of the dataset
      if (batchResults.resultIds.length < 100) {
        hasMoreDogs = false;
        isLoadingComplete = true;
      }
      
      // Move to the next batch
      currentBatchIndex++;
      
      // Once we've accumulated a significant number of dogs or reached the end,
      // perform a full sort on everything we have so far
      if (currentBatchIndex % 5 === 0 || !hasMoreDogs) { // Every 5 batches (500 dogs) or at the end
        console.log(`Performing full sort on ${allDogIds.length} dogs`);
        
        // Get details for all dogs we've accumulated so far
        const allDogDetails = await getDogsById(allDogIds);
        
        // Sort all accumulated dogs by distance
        const fullySortedIds = await sortDogsByZip(
          allDogDetails.map(dog => dog.id as string),
          zipCode
        );
        
        // Get the first page for display
        const updatedPageIds = fullySortedIds.slice(0, dogsPerPage);
        const updatedPageDogs = await getDogsById(updatedPageIds);
        
        // Call the progress callback with updated results
        if (onProgress) {
          onProgress(
            updatedPageDogs,
            fullySortedIds,
            allDogIds.length,
            isLoadingComplete
          );
        }
      }
    }
    
    return {
      success: true,
      isComplete: isLoadingComplete,
      totalDogs: allDogIds.length
    };
  } catch (error) {
    console.error("Error loading and sorting dogs:", error);
    if (onError && error instanceof Error) {
      onError(error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      isComplete: false,
      totalDogs: allDogIds.length
    };
  }
};