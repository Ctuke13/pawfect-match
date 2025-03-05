"use client";

import React, { useState, useEffect } from "react";
import { Dog } from "../../types/dogs"
import { useAuth } from "@/context/AuthContext"
import { Heart } from "lucide-react";
import LoginModal from "../LoginModal";
import DogDetailsModal from "../DogDetailsModal";
import { getLocationByZip } from "@/services/api";

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const { user, updateFavorites } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ city: string; state: string } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const dogId = String(dog.id);
  const favorite = user?.favorites?.includes(dogId) ?? false;

  useEffect(() => {
    if (user?.favorites) {
        setIsFavorite(user.favorites.includes(dogId));
    }
  }, [user?.favorites, dogId]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationMap = await getLocationByZip([dog.zip_code ?? '']);
        setLocation(locationMap[dog.zip_code ?? ''] || null)
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }
  
    fetchLocation();
  }, [dog.zip_code])

  // Toggle favorite status
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setModalMessage("Sign in to add to your Paw List")
      setIsLoginModalOpen(true);
      return;
    }

    // Optimistically update UI
    setIsFavorite(!isFavorite);

    const updatedFavorites = isFavorite
      ? (user?.favorites ?? []).filter((id) => id !== dogId)
      : [...(user?.favorites ?? []), dogId];

    updateFavorites(updatedFavorites);
  };

  // Handle clicking on the dog card to show details
  const handleCardClick = () => {
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <div 
        className="relative w-72 h-96 bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]" 
        onClick={handleCardClick}
      >
        <button
          className="absolute top-3 right-3 p-1 rounded-full"
          onClick={handleFavoriteClick}
        >
          <Heart
            size={28}
            className={`transition-colors ${favorite ? "text-red-500" : "text-gray-400"}`}
            fill={favorite ? "red" : "none"}
          />
        </button>

        {/* Top 66% for the image */}
        <div className="h-[66%] overflow-hidden">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom 34% for text */}
        <div className="h-[34%] p-4">
          <h3 className="mb-1 text-center text-2xl bg-[#FFC936] font-lilita">
            {dog.name}
          </h3>
          <p className="mb-1">
            <span className="font-lilita text-base font-bold">Age:</span>{" "}
            {dog.age}
          </p>
          <p>
            <span className="font-lilita text-base font-bold">Breed:</span>{" "}
            {dog.breed}
          </p>
          {location && (
            <p className="mb-1">
              <span className="font-lilita text-base font-bold">Location:</span>{" "}
              {location.city}, {location.state}
            </p>
          )}
        </div>
      </div>

      {/* Login Modal (only appears when trying to favorite while not signed in) */}
      {isLoginModalOpen && modalMessage && (
        <LoginModal
          closeModal={() => {
            setIsLoginModalOpen(false);
            setModalMessage(null);
          }}
          message={modalMessage}
        />
      )}

      {/* Dog Details Modal */}
      {isDetailsModalOpen && (
        <DogDetailsModal
          dog={dog}
          location={location}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
};

export default DogCard;