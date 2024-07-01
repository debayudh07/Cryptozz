/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'customtext':'#A9F7C8',
        'custombg':'#1F1F24',
      }
    },
  },
  plugins: [],
}