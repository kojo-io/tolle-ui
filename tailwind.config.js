/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('./projects/tolle/preset.js') // Point to your library preset
  ],
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}",
    "./projects/tolle/src/**/*.{html,ts}",
    "./.storybook/**/*.{html,ts,js}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
};
