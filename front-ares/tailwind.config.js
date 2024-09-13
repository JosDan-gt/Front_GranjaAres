/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '1285px', // Breakpoint personalizado a 1243px
      },
    },
  },
  plugins: [],
}

