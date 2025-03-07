
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
          DEFAULT: "#0057B8",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#00A3E0",
          foreground: "#ffffff",
        },
        ocean: {
          light: "#E3F2FD",
          DEFAULT: "#0057B8",
          dark: "#003C7D",
        },
        shipping: {
          light: "#E8F5E9",
          DEFAULT: "#2E7D32",
          dark: "#1B5E20",
        },
        // New color palette from image
        palette: {
          darkblue: "#071777", // Darkest blue
          blue: "#0C3A62",     // Medium blue
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
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "pulse-opacity": "pulse-opacity 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
