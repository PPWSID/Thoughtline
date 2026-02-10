/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#00ffff', // Cyan
          DEFAULT: '#00ced1', // DarkCyan
          dark: '#008b8b', // DarkCyan darker
          aqua: '#7fffd4', // Aquamarine
        },
        dark: {
          bg: '#0a0f14',
          card: '#161e26',
          border: '#2a353f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
