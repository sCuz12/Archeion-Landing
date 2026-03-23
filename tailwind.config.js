/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1f2b",
        muted: "#5b6577",
        accent: "#1e7f6d",
        accentDark: "#156252",
        sand: "#f4f2ef",
        highlight: "#f7efe4",
        warn: "#f1c48c",
        ok: "#cfeadf",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 60px rgba(26, 31, 43, 0.1)",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        glow: "glow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
