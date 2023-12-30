/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0094D4',
        secondary: '#003D53',
        ternary: '#f4662f',
        white: '#FFF',
        grey: '#908e8c',
      },
    },
  },
  plugins: [],
};
