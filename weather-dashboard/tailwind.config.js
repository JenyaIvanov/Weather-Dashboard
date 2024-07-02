/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        'bg_CloudsDay' : "url('img/background/CloudsDay.jpeg')",
        'bg_CloudsNight' : "url('img/background/CloudsNight.jpeg')",
        'bg_RainyDay' : "url('img/background/RainyDay.jpeg')",
        'bg_RainyDay' : "url('img/background/RainyNight.jpeg')",
        'bg_ClearDay' : "url('img/background/ClearDay.jpeg')",
        'bg_ClearNight' : "url('img/background/ClearNight.jpeg')",
      },
    },
  },
  plugins: [],
}