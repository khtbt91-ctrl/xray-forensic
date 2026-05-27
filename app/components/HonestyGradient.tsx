"use client";

import { useState } from "react";
import { MONO, SERIF_ITALIC, FadeInUp } from "./shared";

const rows = [
  {
    left: "I need better entries.",
    right: "Your entries are fine. Your exits cost -$3,200.",
  },
  {
    left: "I trade too much.",
    right: "271 off-session trades. Win rate: 35.4%. Cost: -$2,425.",
  },
  {
    left: "I'm unlucky with streaks.",
    right: "Longest streak: 29 losses. Started after a revenge entry.",
  },
  {
    left: "My strategy needs work.",
    right: "Your strategy wins 60%. Your behavior loses 91%.",
  },
  {
    left: "I should journal more.",
    right: "Journals record. X-Ray diagnoses. With evidence.",
  },
  {
    left: "I'll fix it next month.",
    right: "Next month is already in your data. The same leak. The same cost.",
  },
  {
    left: "I just need a better prop firm.",
    right: "Your pass probability is 23% with every firm. The problem is not the firm.",
  },
];

export default function HonestyGradient() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [hovered, setHovered] = useState<number | null>(null);

  const isVisible = (i: number) => revealed.has(i) || hovered === i;

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 40px 100px" }}>
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            width: "100%",
            display: "block",
            margin: "0 auto",
            marginBottom: 16,
          }}
        >
          THE HONESTY GRADIENT
        </p>
      </FadeInUp>

      <FadeInUp delay={0.05}>
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            textAlign: "center",
            marginBottom: 48,
            lineHeight: 1.3,
          }}
        >
          What you tell yourself.
          <br />
          What the data says.
        </h2>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom:
                  i < rows.length - 1
                    ? "1px solid var(--border-subtle)"
                    : undefined,
              }}
            >
              {/* LEFT — always visible, serif italic */}
              <div
                style={{
                  padding: "20px 28px",
                  borderRight: "1px solid var(--border-subtle)",
                  fontFamily: SERIF_ITALIC,
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1.5,
                }}
              >
                {row.left}
              </div>

              {/* RIGHT — blurred until hover or click */}
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(i)}
                style={{
                  padding: "20px 28px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  fontFamily: MONO,
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                  filter: isVisible(i) ? "blur(0px)" : "blur(8px)",
                  opacity: isVisible(i) ? 1 : 0.25,
                  transition: "filter 200ms ease, opacity 200ms ease",
                  boxShadow: isVisible(i)
                    ? "inset 2px 0 0 var(--accent-primary)"
                    : "none",
                }}
              >
                {row.right}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontStyle: "italic",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Hover any row to see what X-Ray actually finds.
        </p>
      </FadeInUp>
    </section>
  );
}
