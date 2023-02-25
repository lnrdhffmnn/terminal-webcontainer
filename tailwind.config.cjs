/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        screen: ["100vw", "100svw"],
      },
      height: {
        screen: ["100vh", "100svh"],
      },
    },
  },
  plugins: [],
};
