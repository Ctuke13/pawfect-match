"use client";

import React, { useState } from "react";
import { Dog } from "../../types/dogs"
import { useAuth } from "@/context/AuthContext"
import { Heart } from "lucide-react";
import LoginModal from "../LoginModal";

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const { user, updateFavorites } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const dogId = String(dog.id);

  const favorite = user?.favorites?.includes(dogId) ?? false;

  // Toggle favorite status'
  const handleFavoriteClick = () => {
    if(!user) {
      setModalMessage("Sign in to add to your Paw List")
      setIsModalOpen(true);
      return;
    }

    const updatedFavorites = favorite ? user.favorites.filter((id) => id !== dogId) :
    [...user.favorites, dogId];

    updateFavorites(updatedFavorites)
  };

  return (
    <div className="relative w-[350px] h-[450px] bg-white rounded-lg shadow overflow-hidden">
      <button
        className="absolute top-3 right-3 p-1 rounded-full"
        onClick={handleFavoriteClick}
      >
        <Heart
          size={28}
          className={`transition-colors ${favorite ? "text-red-500" : "text-gray-400"}`}
          fill={favorite ? "red" : "none"} //
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
        <h3 className="mb-1 text-center text-[34px] bg-[#FFC936] font-lilita">
          {dog.name}
        </h3>
        <p className="mb-1">
          <span className="font-lilita text-[18px] font-bold">Age:</span>{" "}
          {dog.age}
        </p>
        <p>
          <span className="font-lilita text-[18px] font-bold">Breed:</span>{" "}
          {dog.breed}
        </p>
      </div>

      {/* Login Modal (only appears when trying to favorite while not signed in) */}
      {isModalOpen && modalMessage &&( 
        <LoginModal 
          closeModal={() => { 
            setIsModalOpen(false); 
            setModalMessage(null); 
        }}
        message={modalMessage}
      />
     )}
    </div>
  );
};

export default DogCard;