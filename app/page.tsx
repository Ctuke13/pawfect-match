import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
      {/* Logo Section */}
      <Image src="/pawfectmatch_logo.png" alt="Pawfect Match Logo" width={200} height={50} priority />
      
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold mt-6">Find Your Pawfect Match! 🐶</h1>
      <p className="text-center text-gray-600 mt-4">
        Browse available shelter dogs and find your perfect companion.
      </p>

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-4">
        <Link href="/search">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            Search Dogs
          </button>
        </Link>
        <Link href="/favorites">
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
            View Favorites
          </button>
        </Link>
      </div>
    </div>
  );
}