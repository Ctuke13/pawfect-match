"use client";

import React from "react";
import { Dog } from "../../types/dogs"

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  return (
    <div className="w-[350px] h-[450px] bg-white rounded-lg shadow overflow-hidden">
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
    </div>
  );
};

export default DogCard;