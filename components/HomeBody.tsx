"use client";

import React, { useState, useEffect } from "react";
import { Dog } from "../types/dogs"
import { searchDogs, getDogsById } from "@/services/api";
import DogCard from "./ui/DogCard";
import { Lilita_One } from 'next/font/google';

const lilita = Lilita_One({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

function HomeBody() {
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const filters = { size: 3 };
        const searchResult = await searchDogs(filters);
        console.log("Search result:", searchResult);
        if (searchResult.resultIds && searchResult.resultIds.length > 0) {
          const dogsData = await getDogsById(searchResult.resultIds);
          console.log("Dogs data:", dogsData);
          setDogs(dogsData);
        } else {
          console.log("No dogs found.");
        }
      } catch (error) {
        console.error("Error fetching dogs:", error);
      }
    };

    fetchDogs();
  }, []);

  // Fallback static data if API data isn't available yet
  const pets =
    dogs.length > 0
      ? dogs
      : [
          {
            id: 1,
            name: "Milo",
            age: "3 Years",
            breed: "Labrador Retriever",
            img:
              "https://s.yimg.com/ny/api/res/1.2/TDs6U.Z4Y0iYFT7DB1yjQw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD02OTk-/https://media.zenfs.com/en/pethelpful_915/0b65a149bcb7486588d6195aea3ecee1",
          },
          {
            id: 2,
            name: "Bella",
            age: "2 Years",
            breed: "Golden Retriever",
            img:
              "https://images.squarespace-cdn.com/content/v1/60183f25d7835f347b6bef56/1657890015226-R7055X3DCJRQX9U1GOP4/Smile-3.jpg?format=750w",
          },
          {
            id: 3,
            name: "Shadow",
            age: "4 Years",
            breed: "German Shepherd",
            img:
              "https://www.bellaandduke.com/wp-content/uploads/2024/10/A-guide-to-German-Shepherds-characteristics-personality-lifespan-and-more-featured-image-1024x683.webp",
          },
        ];

  return (
    <div className="flex flex-col items-center bg-[#d9d9d9] py-5">
      <h2 className={`${lilita.className} font-lilita text-[48px] text-center drop-shadow-[3px_3px_6px_black] mb-6 text-[#FFC936]`}>
        These Furry Friends Are Waiting To Meet You!
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {pets.map((pet) => (
          <DogCard key={pet.id} dog={pet} />
        ))}
      </div>
    </div>
  );
}

export default HomeBody;
