"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dog } from "../types/dogs";
import { getGeoLocation } from "@/services/geolocation";

interface DogDetailsModalProps {
  dog: Dog;
  location: { city: string; state: string } | null;
  onClose: () => void;
}

const DogDetailsModal: React.FC<DogDetailsModalProps> = ({
  dog,
  location,
  onClose,
}) => {
  const [geoLocation, setGeoLocation] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch geolocation data when modal opens
  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        setLoading(true);
        const geoData = await getGeoLocation(dog.zip_code);
        setGeoLocation(geoData);
      } catch (error) {
        console.error("Error fetching geolocation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoLocation();
  }, [dog.zip_code]);

  // Handle clicking outside the modal to close it
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicks inside the modal from closing it
  };

  // Get map URL for embedding
  const getMapUrl = () => {
    if (!geoLocation) return "";
    
    // Using OpenStreetMap for embedding
    return `https://www.openstreetmap.org/export/embed.html?bbox=${
      parseFloat(geoLocation.longitude) - 0.05
    },${parseFloat(geoLocation.latitude) - 0.05},${
      parseFloat(geoLocation.longitude) + 0.05
    },${parseFloat(geoLocation.latitude) + 0.05}&layer=mapnik&marker=${
      geoLocation.latitude
    },${geoLocation.longitude}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-auto max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        onClick={handleModalContentClick}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Left side - Dog image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Dog details and map */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto">
          <h2 className="text-3xl font-lilita text-center mb-4 bg-[#FFC936] py-2 rounded">
            {dog.name}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="mb-2">
                <span className="font-lilita text-lg">Age:</span> {dog.age}
              </p>
              <p className="mb-2">
                <span className="font-lilita text-lg">Breed:</span> {dog.breed}
              </p>
              {location && (
                <p className="mb-2">
                  <span className="font-lilita text-lg">Location:</span>{" "}
                  {location.city}, {location.state}
                </p>
              )}
              <p className="mb-2">
                <span className="font-lilita text-lg">ZIP Code:</span>{" "}
                {dog.zip_code}
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-lilita text-lg">Size:</span> Medium
              </p>
              <p className="mb-2">
                <span className="font-lilita text-lg">Gender:</span> Unknown
              </p>
              <p className="mb-2">
                <span className="font-lilita text-lg">ID:</span> {dog.id}
              </p>
            </div>
          </div>

          <h3 className="font-lilita text-xl mb-3">About {dog.name}</h3>
          <p className="mb-6">
            {dog.name} is a loving {dog.age}-year-old {dog.breed} looking for a
            forever home. {dog.name} is playful, friendly, and would make a
            wonderful addition to any family.
          </p>

          <h3 className="font-lilita text-xl mb-3">Area</h3>
          <div className="w-full h-64 bg-gray-200 rounded mb-6">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <p>Loading map...</p>
              </div>
            ) : geoLocation ? (
              <iframe
                title={`Map showing location of ${dog.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={getMapUrl()}
                className="rounded"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p>Map unavailable</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button className="bg-[#FFC936] hover:bg-[#FFB800] text-black font-lilita py-2 px-6 rounded-lg text-lg transition-colors">
              Contact About {dog.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogDetailsModal;