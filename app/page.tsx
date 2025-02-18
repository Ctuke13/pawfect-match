import Hero from "@/components/Hero";
import HomeBody from "@/components/HomeBody";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="relative w-full">
      <Hero />
      <HomeBody/>
    </div>
  );
}