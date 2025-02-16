import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "dark-mode"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",  
    "./components/**/*.{js,ts,jsx,tsx,mdx}",  
    "./context/**/*.{js,ts,jsx,tsx,mdx}",  
    "./services/**/*.{js,ts,jsx,tsx,mdx}", 
    "./utils/**/*.{js,ts,jsx,tsx,mdx}", 
    "./app/globals.css", 
  ],
  theme: {
    extend: {
      colors: {
        background: "#D9D9D9", 
        foreground: "#000000", 
        border: "#000000", 

        primary: "#FFC936",
        secondary: "#D9D9D9",
        muted: "#F5F5F5",
        accent: "#FFC936",
        destructive: "#FF4D4D",
        input: "#FFFFFF",
        ring: "#FFC936",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;