/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [
    require('./projects/tolle/preset.js') // Point to your library preset
  ],
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}",
    "./projects/tolle/src/**/*.{html,ts}",

  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
};
