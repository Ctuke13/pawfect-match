import Link from "next/link";

const Footer = () => {
    return (
        <div className="bg-white px-6 shadow-md">
            <div className="container px-6 flex flex-col md:flex-row items-center justify-between px-6">
                {/* Left Section - Logo or Brand Name */}
                <div className="flex items-center gap-2 ">
                    <img src="/pawfect_icon_nobg.png" alt="Pawfect Match Logo" className="h-10 w-auto" />
                    <span className="text-lg font-bold text-gray-800">Pawfect Match</span>
                </div>

                {/* Middle Section - Navigation Links */}
                <nav className="flex  mt-4 md:mt-0 text-gray-600 text-sm justify-center w-1/2">
                    <Link href="/about" className="mx-2 hover:text-gray-900">About Us</Link>
                    <Link href="/faqs" className="mx-2 hover:text-gray-900">FAQs</Link>
                    <Link href="/contact" className="mx-2 hover:text-gray-900">Contact</Link>
                    <Link href="/privacy" className="mx-2 hover:text-gray-900">Privacy Policy</Link>
                </nav>

                {/* Right Section - Social Media */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22,12A10,10,0,1,0,12,22,10,10,0,0,0,22,12ZM10.93,17.09v-4.33H9v-2h1.93V9.62c0-1.91,1.14-2.96,2.89-2.96a11.56,11.56,0,0,1,1.7.15v1.85H14.6c-1,0-1.19.48-1.19,1.18v1.54h2.34l-.3,2H13.41v4.33Z" />
                        </svg>
                    </Link>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,8a3,3,0,0,1-1.14.89A4.52,4.52,0,0,0,21,6.57a8.94,8.94,0,0,1-2.83,1.08A4.49,4.49,0,0,0,16,5a4.5,4.5,0,0,0-4.5,4.5v.51A12.82,12.82,0,0,1,3,5.09a4.49,4.49,0,0,0,1.39,6A4.43,4.43,0,0,1,2.92,10v.06A4.5,4.5,0,0,0,6.5,14a4.47,4.47,0,0,1-2,.07,4.5,4.5,0,0,0,4.21,3.13,9,9,0,0,1-6.69,1.87A12.73,12.73,0,0,0,9.32,20c8.29,0,12.83-6.87,12.83-12.83,0-.19,0-.38,0-.57A9.23,9.23,0,0,0,21,8Z" />
                        </svg>
                    </Link>

                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-6 w-6" viewBox="0 0 50 50" fill="currentColor">
                            <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
                        </svg>
                    </Link>

                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-6 w-6" viewBox="0 0 50 50" fill="currentColor">
                            <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"></path>
                        </svg>
                    </Link>
                </div>

            </div>

            {/* Bottom Text */}
            <div className="text-center text-gray-500 text-sm mt-4">
                © {new Date().getFullYear()} Pawfect Match. All rights reserved.
            </div>
        </div>
    );
};

export default Footer;
