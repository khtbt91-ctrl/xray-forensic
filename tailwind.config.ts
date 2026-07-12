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
        // Blue clinical system (campaign tokens) — see projects/xray/site-migration-spec.md
        "brand-accent":      "#38BDF8",
        "brand-accent-dark": "#0EA5E9",
        "brand-accent-dim":  "#1E5C78",
        // Old names kept as value-swapped aliases so existing classes keep working
        "brand-gold":       "#38BDF8",
        "brand-gold-dark":  "#0EA5E9",
        "brand-bg":         "#0A0E14",
        "brand-slate":      "#0F141D",
        "brand-card":       "#131A24",
        "brand-card-hover": "#1A2330",
        "brand-border":     "#26313F",
        // Legacy aliases
        "bg-base":       "#0A0E14",
        "bg-card":       "#131A24",
        "bg-elevated":   "#1A2330",
        "border-subtle": "#26313F",
        "border-active": "#94a3b8",
        "accent-primary":"#38BDF8",
        profit:  "#10b981",
        loss:    "#ef4444",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
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
