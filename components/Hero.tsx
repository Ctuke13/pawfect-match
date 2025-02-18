"use client"

import { Kiwi_Maru } from 'next/font/google';

const kiwiMaru = Kiwi_Maru({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
});

export default function Hero() {
    return (
        <div className="relative w-full  max-w-[1440px] max-h-[375px] mx-auto overflow-hidden bg-red">
            <img src="https://i.imgur.com/a2C6atG.png" alt="Background Image"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black  opacity-50" style={{ opacity: "30%" }} />

            {/* Text & Search Bar */}
            <div className="absolute flex flex-col items-center justify-center w-full inset-0 object-cover text-center"> 
                <h1 className={`${kiwiMaru.className} text-6xl font-bold leading-snug font-light font-bold mb-6 text-center text-white mt-6 drop-shadow-2xl`}>
                    Find Furever Homes,
                    <br />One Paw at a Time.
                </h1>
                <div className='flex items-center w-full max-w-md bg-white rounded-full overflow-hidden shadow-md mx-auto'>
                    <input 
                        type="text" 
                        placeholder='Enter Breed'
                        className='w-1/2 px-4 py-2 outline-none rounded-full'
                    />

                    <div className='h-6 w-px bg-gray-300'/>

                    <div className="relative w-1/2">
                        <input
                            type='text'
                            placeholder='Enter Zip Code'
                            className='w-full px-4 py-2 outline-none rounded-r-full'
                        />
                        <button className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>     
        </div>
    );
}