"use client";

import { useEffect, useState } from "react";

/**
 * X-Ray Forensic — Rotating one-liner under the hero / banner.
 * One line shows at a time, 4s each, fade transition.
 * Pairs with the existing <LiveTicker /> (the scrolling tape) — this adds the
 * rotating verdict line your brief asked for without a second marquee.
 */

const MONO = "var(--font-mono)";
const GOLD = "#e5b83c";

const ONE_LINERS: string[] = [
  "You don't have a strategy problem. You have a leak. We measure it.",
  "The market didn't beat you. Your 2am decisions did. Here's the proof.",
  "Seven dimensions. One verdict. Zero motivation.",
  "Find your failure point before the prop firm does.",
  "Your equity curve is a confession. Read it.",
  "Profitable on demo, bleeding on live? The difference has a number.",
];

export default function RotatingTagline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ONE_LINERS.length), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ minHeight: 26, textAlign: "center", margin: "18px auto 0", maxWidth: 720, padding: "0 20px" }}>
      <span
        key={i}
        style={{ fontFamily: MONO, fontSize: 13, color: GOLD, letterSpacing: "0.03em", animation: "xray-fade 0.6s ease" }}
      >
        {ONE_LINERS[i]}
      </span>
      <style>{`
        @keyframes xray-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
