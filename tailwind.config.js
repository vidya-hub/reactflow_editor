/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cardTitle: {
          light: "#B2F0E3",
          DEFAULT: "#B2F0E3",
          dark: "#B2F0E3",
        },
        messageBorder: {
          light: "#738CEB",
          DEFAULT: "#738CEB",
          dark: "#738CEB",
        },
      },
    },
  },
  plugins: [],
};
