/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          1: "#04F2D5",
          2: "#01A7A3",
          3: "#04837B",
          4: "#014041",
        },
      },
      fontFamily: {
        nunito: ['"Nunito Sans"', "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("daisyui")],
};
