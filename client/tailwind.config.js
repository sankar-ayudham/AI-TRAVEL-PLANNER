/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        background: {
          light: "#f9fafb",
          dark: "#111827"
        },
        surface: {
          light: "#ffffff",
          dark: "#1f2937"
        },
        text: {
          light: "#111827",
          dark: "#f9fafb"
        }
      }
    },
  },
  plugins: [],
}