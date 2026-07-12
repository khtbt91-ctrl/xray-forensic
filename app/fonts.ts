import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * Self-hosted Inter + JetBrains Mono via next/font/google.
 * QA round 3 fix (2026-07-12): the render-blocking Google Fonts CDN @import
 * in globals.css was the actual LCP bottleneck once Cabinet Grotesk's own
 * preload fix (round 2) resolved the H1 repaint — the hero's Inter
 * paragraph became the new LCP element, still loading via a 955ms
 * render-blocking CDN round-trip that predates this whole redesign.
 * next/font downloads at build time, self-hosts from this origin, and
 * inlines the @font-face — no CDN round-trip, no render block.
 *
 * Exposed as CSS variables so every existing inline `fontFamily: "'Inter',
 * sans-serif"` / `"'JetBrains Mono', monospace"` reference sitewide could be
 * swapped to `var(--font-sans)` / `var(--font-mono)` without touching each
 * component's actual layout — see globals.css for where these variables are
 * defined for consumption.
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
