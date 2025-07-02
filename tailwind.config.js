/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "custom-pink": "#ff4053",
        "custom-dark-pink": "#ff4044",
        "custom-light-pink": "#ff5353",
        "custom-blue": "#13052E",
        "custom-light-blue": "#13052ecc",
        "custom-dark-blue": "#100722",
        "custom-golden": "#8f5206",
        "custom-light-golden": "#FFFFE4",
        "custom-green": "#00b971",
        "custom-light-gray": "#333332",
        "custom-dark-gray": "#242424",
      },
      animation: {
        marqueeUp: "marqueeUp 3s linear infinite",
      },
      keyframes: {
        marqueeUp: {
          "0%": { transform: "translateY(100%)" }, // start below
          "100%": { transform: "translateY(-100%)" }, // move above
        },
      },
    },
  },
  plugins: [],
};
