"use client";

import { Fragment } from "react";
import { MONO, SERIF_ITALIC, FadeInUp } from "./shared";

const BA_ROWS = [
  { left: "I need better entries.", right: "Your entries are fine. Your exits cost -$3,200." },
  { left: "I trade too much.", right: "271 off-session trades. Win rate: 35.4%. Cost: -$2,425." },
  { left: "I'm unlucky with streaks.", right: "Longest streak: 29 losses. Started after revenge trade #1." },
  { left: "My strategy needs work.", right: "Your strategy wins 60%. Your behavior loses 91%." },
  { left: "I should journal more.", right: "Journals record. X-Ray diagnoses. With evidence." },
];

export default function HonestyGradient() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          THE HONESTY GRADIENT
        </p>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div className="ba-grid" style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
          <div
            style={{
              padding: "18px 32px",
              background: "rgba(248,81,73,0.06)",
              borderRight: "1px solid var(--border-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontSize: 13, color: "var(--loss)" }}>
              What you tell yourself
            </span>
          </div>
          <div
            style={{
              padding: "18px 32px",
              background: "rgba(88,166,255,0.06)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--accent-primary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              WHAT X-RAY FINDS
            </span>
          </div>

          {BA_ROWS.map((row, i) => (
            <Fragment key={i}>
              <div
                style={{
                  padding: "22px 32px",
                  borderRight: "1px solid var(--border-subtle)",
                  borderBottom: i < BA_ROWS.length - 1 ? "1px solid var(--border-subtle)" : undefined,
                  background: "rgba(248,81,73,0.02)",
                  fontFamily: SERIF_ITALIC,
                  fontStyle: "italic",
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {row.left}
              </div>
              <div
                style={{
                  padding: "22px 32px",
                  borderBottom: i < BA_ROWS.length - 1 ? "1px solid var(--border-subtle)" : undefined,
                  background: "rgba(63,185,80,0.02)",
                  fontFamily: MONO,
                  fontSize: 12,
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  display: "flex",
                  alignItems: "center",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.right}
              </div>
            </Fragment>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
