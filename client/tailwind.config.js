/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
      },
      colors: {
        'light-background': '#FAF3E0',
        'light-text': '#1E1E1E',
        'light-card': '#FFFFFF',
        'light-cardAlt': '#F5F5F5',
        'light-accentBlue': '#1E3A8A',
        'light-accentGold': '#FFD700',
        'light-accentGreen': '#93C572',

        'dark-background': '#121212',
        'dark-backgroundAlt': '#1C1C1E',
        'dark-text': '#F0F0F0',
        'dark-card': '#2A2A2A',
        'dark-cardAlt': '#2C2C2E',
      },
    },
  },
  plugins: [],
};
