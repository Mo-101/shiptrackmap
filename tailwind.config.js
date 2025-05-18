/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0C3A62",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#15ABC0",
          foreground: "#ffffff",
        },
        palette: {
          darkblue: "#071777",
          blue: "#0C3A62",
          teal: "#15ABC0",
          mint: "#62F3F7",
          sage: "#76A6B4",
          sand: "#DCCC82",
        },
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}

