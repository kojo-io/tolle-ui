/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('./projects/tolle/preset.js') // Point to your library preset
  ],
  content: [
    "./projects/showcase/src/**/*.{html,ts}", // Scan the showcase app
    "./projects/tolle/src/**/*.{html,ts}"      // Scan the library components
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
};
