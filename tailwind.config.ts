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
        palette: {
          darkblue: "#071777",
          blue: "#0C3A62",
          teal: "#15ABC0",
          mint: "#62F3F7",
          sage: "#76A6B4",
          sand: "#DCCC82",
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
        "scanner-line": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100vh)" }
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
        "scanner": "scanner-line 3s linear infinite",
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
