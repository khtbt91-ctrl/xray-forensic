import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#0D1117",
        "bg-card": "#161B22",
        "bg-elevated": "#21262D",
        "border-subtle": "#30363D",
        "border-active": "#8B949E",
        "text-primary": "#E6EDF3",
        "text-secondary": "#8B949E",
        "text-muted": "#6E7681",
        "accent-primary": "#58A6FF",
        "accent-hover": "#79B8FF",
        "accent-secondary": "#A371F7",
        profit: "#3FB950",
        loss: "#F85149",
        warning: "#D29922",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
