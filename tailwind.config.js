/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-900': '#121212',
        'gray-800': '#1E1E1E',
        'gray-700': '#2D2D2D',
        'gray-600': '#404040',
        'gray-400': '#A0A0A0',
        'gray-200': '#E0E0E0',
        'primary': '#dc2626', // Red-600
        'primary-hover': '#b91c1c', // Red-700
      }
    },
  },
  plugins: [],
}
