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
        // Gemini brand tokens — enables text-brand-gold, bg-brand-bg, etc.
        "brand-gold":       "#e5b83c",
        "brand-gold-dark":  "#b88d1d",
        "brand-bg":         "#050811",
        "brand-slate":      "#0b1220",
        "brand-card":       "#0e1626",
        "brand-card-hover": "#141e35",
        "brand-border":     "#1e293b",
        // Legacy aliases
        "bg-base":       "#050811",
        "bg-card":       "#0e1626",
        "bg-elevated":   "#141e35",
        "border-subtle": "#1e293b",
        "border-active": "#94a3b8",
        "accent-primary":"#e5b83c",
        profit:  "#10b981",
        loss:    "#ef4444",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "scan":         "scan 3s linear infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.8" },
          "50%":       { opacity: "1" },
        },
        "scan": {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
