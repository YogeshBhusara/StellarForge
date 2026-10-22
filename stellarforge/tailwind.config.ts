import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#04060d",
        navy: "#0b1224",
        console: "#121a2e",
        glow: "#5ce1ff",
        accent: "#22d3ee",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 28px rgba(92, 225, 255, 0.28)",
        "glow-sm": "0 0 14px rgba(92, 225, 255, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
