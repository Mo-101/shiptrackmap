
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0C3A62",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#15ABC0",
          foreground: "#ffffff",
        },
        ocean: {
          light: "#76A6B4",
          DEFAULT: "#0C3A62",
          dark: "#071777",
        },
        shipping: {
          light: "#E8F5E9",
          DEFAULT: "#2E7D32",
          dark: "#1B5E20",
        },
        // Updated color palette with darker blues
        palette: {
          darkblue: "#071777", // Darkest blue (background)
          blue: "#0C3A62",     // Dark blue (primary)
          teal: "#15ABC0",     // Teal blue
          mint: "#62F3F7",     // Light mint/cyan
          sage: "#76A6B4",     // Sage blue/gray
          sand: "#DCCC82",     // Sand/beige
        }
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-opacity": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "0.2" },
        },
        // Adding new animations for sci-fi effects
        "scanner-line": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "grid-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "pulse-opacity": "pulse-opacity 2s ease-in-out infinite",
        // Adding new animations
        "scanner": "scanner-line 2s ease-in-out infinite",
        "grid-flow": "grid-flow 20s linear infinite",
        "blink": "blink 1.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(98, 243, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(98, 243, 247, 0.1) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        "grid-50": "50px 50px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
