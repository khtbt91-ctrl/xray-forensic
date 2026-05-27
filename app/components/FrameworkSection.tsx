"use client";

import { MONO, FadeInUp } from "./shared";

const principles = [
  "→ Every behavioral leak has a dollar cost",
  "→ Every prescription has a measurable target",
  "→ Every verdict is earned, not assigned",
];

export default function FrameworkSection() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "80px 40px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <FadeInUp>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              display: "block",
              margin: "0 auto",
              marginBottom: 20,
              textAlign: "center",
              width: "100%",
            }}
          >
            THE FRAMEWORK
          </p>
          <h2
            style={{
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "0 0 24px",
              color: "var(--text-primary)",
              textAlign: "center",
            }}
          >
            Built on 15 years of institutional pattern recognition.
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: 720,
              margin: "0 auto 20px",
              textAlign: "center",
            }}
          >
            Every dimension in X-Ray is calibrated against live market behavior — not backtested
            theory, not academic models. The diagnostic engine encodes the same framework used on
            institutional desks: Smart Money Concepts, liquidity engineering, order flow analysis,
            kill zone mechanics.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--text-muted)", marginBottom: 40, textAlign: "center" }}>
            The machine doesn&apos;t guess what good trading looks like. It was trained by traders
            who lived it.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <div className="framework-principles">
            {principles.map((p, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  padding: "16px 20px",
                  fontFamily: MONO,
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  textAlign: "left",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
