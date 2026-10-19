/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F1FAF3",
          100: "#D8F3DC",
          200: "#B2E0BC",
          300: "#7CC79A",
          400: "#40916C",
          500: "#368C63",
          600: "#2D6A4F",
          700: "#24513D",
          800: "#1B4332",
          900: "#12291F",
        },
        warm: { DEFAULT: "#F4A261", dark: "#D9803F" },
        cream: "#FAF9F6",
        ink: "#1B1B1B",
        full: "#E63946",
      },
      fontFamily: {
        head: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(27,67,50,0.18)",
        lift: "0 20px 40px -16px rgba(27,67,50,0.30)",
      },
    },
  },
  plugins: [],
};
