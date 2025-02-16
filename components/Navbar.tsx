"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoginModal from "./LoginModal";
import { Button } from "@/components/ui/button";
import DropdownAccount from "./DropdownAccount";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    return (
        <nav className="flex justify-between items-center p-2 bg-[#D9D9D9] shadow-md mt-5 my-5">
            {/* Logo */}
            <Link href="/">
            <img src="/pawfectmatch_logo.png" alt="Pawfect Match Logo" width={250} height={100} className="object-contain cursor-pointer " />
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-12 m-1">
                <Link href="/search" className="text-2xl text-black hover:text-gray-700  font-semibold hover:-translate-y-1 hover:scale-110">Find Your Match</Link>
                <Link href="/favorites" className="group text-2xl text-black hover:text-gray-700  font-semibold hover:-translate-y-1 hover:scale-110">My Paw List 
                <span className="text-2xl  text-black group-hover:text-red-500"> ♥</span></Link>
                <Link href="/about" className="text-2xl  text-black hover:text-gray-700 font-semibold hover:-translate-y-1  hover:scale-110">About Us</Link>
                <Link href="/faqs" className="text-2xl text-black hover:text-gray-700  font-semibold hover:-translate-y-1 hover:scale-110">FAQS</Link>
            </div>

            {/* Sign In / Logout Button */}
            {user ? <DropdownAccount /> : <Button onClick={() => setIsModalOpen(true)}className="text-black hover:text-gray-800 bg-[#FFC936] hover:-translate-y-1 hover:scale-105 hover:shadow-lg rounded-3xl">SIGN IN</Button>}

      {/* Login Modal */}
      {isClient && isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
        </nav>
    );
}