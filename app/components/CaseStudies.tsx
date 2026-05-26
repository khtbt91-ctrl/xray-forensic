"use client";

import { MONO, SERIF_ITALIC, FadeInUp } from "./shared";

const cards = [
  {
    archetype: "BEHAVIORAL · REVENGE TRADER",
    title: "The Revenge Trader",
    before: [
      "276 off-session re-entries detected",
      "Win rate post-loss: 29.1%",
      "Cost: -$16.86 per revenge sequence",
    ],
    verdict:
      "Behavioral protocol triggered. The edge exists. The behavior destroys it.",
    after: "Revenge entries: 12 → 0. Session P/L: recovering.",
  },
  {
    archetype: "RISK · NO-STOP TRADER",
    title: "The No-Stop Gambler",
    before: [
      "48 trades without stop loss",
      "Average unprotected loss: -$99.04",
      "91% of total losses from these 48 trades",
    ],
    verdict:
      "Stop Loss Mandate triggered. Every unprotected position is an unbounded liability.",
    after: "SL compliance: 7.5% → 100%. Max single loss: capped.",
  },
  {
    archetype: "PROP FIRM · CHALLENGE FAILURE",
    title: "The Prop Firm Repeater",
    before: [
      "3 challenges funded. 0 payouts.",
      "Monte Carlo pass probability: 23%",
      "Predicted DD breach: day 7",
    ],
    verdict:
      "Pre-Challenge Clearance required. Current behavior fails before the profit target is reachable.",
    after: "Behavioral score improved. 4th challenge: in progress.",
  },
];

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}
    >
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          REAL PATTERNS. REAL COSTS.
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
          Three traders.
          <br />
          Three verdicts. One platform.
        </h2>
      </FadeInUp>

      <div
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          paddingBottom: 12,
        }}
      >
        {cards.map((card, i) => (
          <FadeInUp
            key={i}
            delay={0.1 + i * 0.1}
            style={{ flex: "1 1 0", minWidth: 300 }}
          >
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                padding: 28,
                position: "relative",
                height: "100%",
              }}
            >
              {/* ILLUSTRATIVE EXAMPLE stamp */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  border: "1px solid var(--border-subtle)",
                  padding: "2px 8px",
                  borderRadius: 2,
                }}
              >
                ILLUSTRATIVE EXAMPLE
              </div>

              {/* Archetype */}
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 10px",
                  paddingTop: 24,
                }}
              >
                {card.archetype}
              </p>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 16px",
                }}
              >
                {card.title}
              </h3>

              {/* Divider */}
              <div
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  marginBottom: 16,
                }}
              />

              {/* BEFORE */}
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.65rem",
                    color: "var(--loss)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "0 0 8px",
                  }}
                >
                  BEFORE
                </p>
                {card.before.map((line, j) => (
                  <p
                    key={j}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      margin: "0 0 4px",
                      lineHeight: 1.5,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* VERDICT */}
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.65rem",
                    color: "var(--warning)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "0 0 8px",
                  }}
                >
                  VERDICT
                </p>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.8rem",
                    color: "var(--text-primary)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {card.verdict}
                </p>
              </div>

              {/* AFTER 30 DAYS */}
              <div>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.65rem",
                    color: "var(--profit)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "0 0 8px",
                  }}
                >
                  AFTER 30 DAYS
                </p>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.85rem",
                    color: "var(--profit)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {card.after}
                </p>
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}
