"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoginModal from "./LoginModal";
import { Button } from "@/components/ui/button";
import DropdownAccount from "./DropdownAccount";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useWindowWidth } from "@/utils/useWindowWidth";

export default function Navbar() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false);

  const width = useWindowWidth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const desktopLogoSrc = width >= 900 && width <= 1000 ? "/pawfect_icon_nobg.png" : "/pawfectmatch_logo.png";

  const handleProtectedClick = (message: string) => {
    if(!user) {
      setModalMessage(message);
      setIsModalOpen(true)
    }
  }

  const closeModalWithReset = () => {
    setModalMessage(null);
    setIsModalOpen(false);
  };

  return (
    <nav className="flex flex-wrap items-center justify-between py-4 px-8 bg-[#D9D9D9] shadow-md w-screen ">
      <div className="flex lg-hidden min-[900px]:hidden items-center justify-between gap-4 ">
        {/* Hamburger */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 text-black hover:text-gray-700">
            {/* Bigger hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-16 6h16"
              />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#D9D9D9] font-bold min-[900px]:hidden"
          >
            <DropdownMenuItem asChild>
              {user ? (
                <Link href="/search">Find Your Match</Link>
              ) : (
                <button onClick={() => handleProtectedClick("Sign in to find your match")}>
                  Find Your Match
                </button>
              )}
              
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {user ? (
                <Link href="/search">My Paw List <span className="hover:text-red-500">♥</span></Link>
              ) : (
                <button onClick={() => handleProtectedClick("Sign in to view your Paw List")}>
                  My Paw List <span className="hover:text-red-500">♥</span>
                </button>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">About Us</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/faqs">FAQs</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <Link href="/">
          <img
            src={desktopLogoSrc}
            alt="Pawfect Match Logo"
            width={250}
            height={100}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* Sign In / Logout */}
        {user ? (
          <DropdownAccount />
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="text-black hover:text-gray-800 bg-[#FFC936] hover:-translate-y-1 hover:scale-105 hover:shadow-lg rounded-3xl"
          >
            SIGN IN
          </Button>
        )}
      </div>

      {/* DESKTOP BAR (hidden below 900px) */}
      <div className="hidden min-[900px]:flex items-center w-full">
        {/* Logo at far left */}
        <div className="flex-1">
          <Link href="/">
            <img
              src={desktopLogoSrc}
              alt="Pawfect Match Logo"
              width={250}
              height={100}
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Nav links in center */}
        <div className="space-x-12 m-1">
          {user ? (
            <Link href="/search" className="text-2xl text-black hover:text-gray-700 font-semibold hover:-translate-y-1 hover:scale-110"
          >
              Find Your Match
            </Link>
          ) : (
            <button onClick={() => handleProtectedClick("Sign in to find your match!")} className="text-2xl text-black hover:text-gray-700 font-semibold hover:-translate-y-1 hover:scale-110"
          >
              Find Your Match
            </button>
          )}
          
          {user ? (
            <Link href="/favorites" className="group text-2xl text-black hover:text-gray-700 font-semibold hover:-translate-y-1 hover:scale-110"
          >
            My Paw List
            <span className="text-2xl text-black group-hover:text-red-500"> ♥</span>
          </Link>
          ): (
            <button onClick={() => handleProtectedClick("Sign in to view your Paw List!")} className="group text-2xl text-black hover:text-gray-700 font-semibold hover:-translate-y-1 hover:scale-110"
          >
            My Paw List
            <span className="text-2xl text-black group-hover:text-red-500"> ♥</span>
          </button>
          )}
          
          <Link
            href="/about"
            className="text-2xl text-black hover:text-gray-700 font-semibold hover:-translate-y-1 hover:scale-110"
          >
            About Us
          </Link>
          <Link
            href="/faqs"
            className="text-2xl text-black hover:text-gray-700 font-semibold hover:-translate-y-1 hover:scale-110"
          >
            FAQS
          </Link>
        </div>

        {/* Sign In / Logout on the right */}
        <div className="flex-1 flex justify-end" >
          {user ? (
            <DropdownAccount />
          ) : (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="text-black hover:text-gray-800 bg-[#FFC936] hover:-translate-y-1 hover:scale-105 hover:shadow-lg rounded-3xl px-4 py-2
              text-base
              min-[900px]:px-8 min-[900px]:py-3
              min-[900px]:text-lg"
            >
              SIGN IN
            </Button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {isClient && isModalOpen && (
        <LoginModal closeModal={closeModalWithReset} message={modalMessage}/>
      )}
    </nav>
  );
}