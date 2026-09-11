/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./**/templates/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070a",
        surface: "#0d1219",
        fg: "#e7ecf2",
        "fg-dim": "#94a1b3",
        "fg-faint": "#5c6779",
        brand: {
          teal: "#2dd4c4",
          cyan: "#22d3ee",
          magenta: "#e23fd1",
          violet: "#a855f7",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(120deg, #2dd4c4, #22d3ee)",
        "grad-accent": "linear-gradient(120deg, #22d3ee, #e23fd1)",
      },
      boxShadow: {
        "glow-teal": "0 0 40px -8px rgba(45,212,196,.45)",
        "glow-magenta": "0 0 40px -8px rgba(226,63,209,.4)",
      },
      scale: { 108: "1.08" },
    },
  },
  plugins: [],
};
