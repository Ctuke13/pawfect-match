import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap"
});

export const viewport = 'width=device-width, initial-scale=1.0';

export const metadata: Metadata = {
  title: "Pawfect Match",
  description: "Find your perfect dog companion!",
  metadataBase: new URL("https://localhost:3000"),
  icons: {
    icon: "/favicon.png",
    apple: "/pawfect-apple-icon.png",
    other: [
      {rel: "icon", url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)"},
    ],
  },
  openGraph: {
    title: "Pawfect Match",
    description: "Find your perfect dog companion!",
    url: "https://pawfect-match.vercel.app",
    siteName: "Pawfect Match", 
    type: "website",
    images: [
      {
        url: "https://pawfect-match.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Pawfect Match",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawfect Match",
    description: "Find your perfect dog companion!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body
        
      >
        <AuthProvider>
          <FavoritesProvider>
            <Navbar />
            {children}
            <Toaster/>
            <Footer/>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
