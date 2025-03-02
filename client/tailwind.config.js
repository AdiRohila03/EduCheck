/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-blue-300", "bg-orange-300", "bg-green-300",
    "bg-red-300", "bg-purple-300", "bg-pink-300"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}