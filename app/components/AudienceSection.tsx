"use client";

import { MONO, FadeInUp } from "./shared";

const cards = [
  {
    accent: "var(--loss)",
    title: "THE LOSING TRADER",
    body: "You've tried journals. You've tried mentors. None showed you the $4,753 sitting in your no-stop trades. X-Ray doesn't coach you. It exposes the pattern — then gives you the prescription to break it.",
    scenarios: null,
  },
  {
    accent: "var(--profit)",
    title: "THE PROFITABLE TRADER",
    body: "You've been profitable for six months. You don't know if it's skill or variance. X-Ray maps your edge across 7 dimensions — which sessions generate your returns, which behaviors are leaking them, and exactly how fragile your edge is before the market corrects it.",
    scenarios: null,
  },
  {
    accent: "var(--warning)",
    title: "THE PROP FIRM TRADER",
    body: null,
    scenarios: [
      {
        label: "BEFORE THE CHALLENGE",
        text: "You've paid $1,500 across three attempts. Failed all three. X-Ray runs Monte Carlo on your actual stats: 23% pass probability. DD breach predicted on day 7. Get the Pre-Challenge Clearance — or stop donating evaluation fees.",
      },
      {
        label: "INSIDE A FUNDED ACCOUNT",
        text: "You passed. Now you're protecting a real payout. X-Ray maps your behavioral risk: which sessions to avoid, your revenge-trade signature, and the exact daily limit that keeps your account alive.",
      },
    ],
  },
];

export default function AudienceSection() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp style={{ textAlign: "center", width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 48,
            width: "100%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          WHO THIS IS FOR
        </p>
      </FadeInUp>
      <FadeInUp delay={0.1}>
        <div className="who-cards">
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderLeft: `3px solid ${card.accent}`,
                borderRadius: 8,
                padding: "2rem",
              }}
            >
              <h3
                style={{
                  fontFamily: MONO,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  margin: "0 0 14px",
                  letterSpacing: "0.06em",
                  lineHeight: 1.4,
                }}
              >
                {card.title}
              </h3>
              {card.body && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>
                  {card.body}
                </p>
              )}
              {card.scenarios && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {card.scenarios.map((s, j) => (
                    <div
                      key={j}
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 6,
                        padding: "14px 16px",
                      }}
                    >
                      <p style={{
                        fontFamily: MONO,
                        fontSize: "0.65rem",
                        color: card.accent,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        margin: "0 0 8px",
                      }}>
                        {s.label}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>
                        {s.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
