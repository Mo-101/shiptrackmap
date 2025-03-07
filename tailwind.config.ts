
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Updated palette based on the provided colors
        palette: {
          darkblue: "#1B243A", // Dark blue from color scheme
          midblue: "#4C4389", // Purple-ish blue
          teal: "#4FA3BA",    // Teal blue
          mint: "#4FF2F8",    // Bright teal
          sage: "#91A0A9",    // Sage gray
          sand: "#DCCC82"     // Sand color (kept from original)
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["Space Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "scanner": {
          "0%": { top: "0%" },
          "100%": { top: "100%" }
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" }
        },
        "pulse-opacity": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" }
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        "arc-animation": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scanner": "scanner 10s linear infinite",
        "blink": "blink 1.5s infinite",
        "pulse-opacity": "pulse-opacity 2s infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "arc-animation": "arc-animation 3s ease-out forwards"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
