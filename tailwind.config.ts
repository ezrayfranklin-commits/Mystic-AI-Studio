import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#090913",
        ink: "#111321",
        brass: "#d9a441",
        aura: "#8b5cf6",
        tide: "#2dd4bf",
        ember: "#fb7185"
      },
      boxShadow: {
        glow: "0 0 38px rgba(217, 164, 65, 0.18)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        "mystic-grid":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
