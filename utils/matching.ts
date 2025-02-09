import { apiClient } from "@/services/api";
import { getGeoLocation } from "@/services/geolocation";
import { calculateDistance } from "./distance";

export const generateMatch = async (dogIds: string[], userZipCode: string) => {
  try {
    if (dogIds.length === 0) throw new Error("No favorite dogs selected.");

    //Fetch dog details
    const dogDetailsResponse = await apiClient.post("/dogs", dogIds);
    const dogDetails = dogDetailsResponse.data;

    if (dogDetails.length === 0) throw new Error("No dogs found.");

    //Extract fav dogs zip codes
    const dogZipCodes = dogDetails.map((dog : any) => dog.zip_code)

    //Fetch user location
    const userLocationResponse = await apiClient.post("/locations", [userZipCode])
    let userLocation = userLocationResponse.data.length > 0 ? userLocationResponse.data[0] : null;

    //If user's zipcode is missing, use geolocation API
    if (!userLocation) {
      console.warn(`User zip code %{userZipCode} not found. Fetching location using geolocation..`);
      const geolocation = await getGeoLocation(userZipCode);

      if(geolocation) {
        userLocation = { zip_code: userZipCode, latitude: geolocation.latitude, longitude: geolocation.longitude };
      } else {
        throw new Error("Could not determine your location.");
      }
    }

    // Ensure at least one valid dog location exists
    const validDogLocations = dogDetails.filter((dog : any) => 
      validDogLocations.some((loc : any) => loc.zip_code === dog.zip_code));

    if (validDogLocations.length === 0) {
      throw new Error("No valid dog locations found.");
    }

    // Find the closest dof to the user
    let closestDog = validDogLocations[0];
    let minDistance = Infinity;

    validDogLocations.forEach((dog : any) => {
      const dogLocation = validDogLocations.find((loc : any) => loc.zip_code === dog.zip_code);

      if (!dogLocation) return;

      const distance = calculateDistance(userLocation, dogLocation);

      if (distance < minDistance) {
        minDistance = distance;
        closestDog = dog;
      }
    });

    if (!closestDog) throw new Error("No valid dog match found at this time.");

    // Send only the closes dog's ID to generate the match
    const matchResponse = await apiClient.post("/dog/match, [closestDog.id]");
    return matchResponse.data
    
  } catch (error) {
    console.error("Error generating match:", error);
    throw error;
  }
}