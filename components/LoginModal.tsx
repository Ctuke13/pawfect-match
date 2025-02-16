"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");


  const handleLogin = async () => {
    if (!name || !email) return alert("Please enter your name and email.");
    await login(name, email, zipcode || undefined);
    onClose(); // Close the modal after login
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {/* Input Fields */}
        <input
          className="mt-4 p-2 w-full border rounded"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mt-2 p-2 w-full border rounded"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-2 p-2 w-full border rounded"
          type="text"
          placeholder="Enter your zip code (optional)"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />

        {/* Login Button */}
        <button
          className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 font-semibold"
          onClick={handleLogin}
        >
          SIGN IN
        </button>

        {/* Close Modal */}
        <button className="mt-4 w-full text-black hover:text-red-500  hover:underline" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
