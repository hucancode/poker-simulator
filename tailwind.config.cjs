const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      width: {
        "3/2": "150%",
        "2/1": "200%",
        "4/2": "200%",
        double: "200%",
        "5/2": "250%",
      },
      backgroundImage: {
        rainbow:
          "linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b)",
        rainbow2:
          "linear-gradient(141.27deg,#ff904e 0%,#ff5982 20%,#ec68f4 40%,#79e2ff 80%)",
      },
      fontFamily: {
        "logo-cursive": ['"Great Vibes"', "cursive"],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      container: {
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      animation: {
        "waving-hand": "waving-hand 2.5s infinite",
      },
      keyframes: {
        "waving-hand": {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(20deg)" },
          "20%": { transform: "rotate(-10deg)" },
          "30%": { transform: "rotate(10deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(0.0deg)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;
