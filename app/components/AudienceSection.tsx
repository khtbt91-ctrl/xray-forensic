"use client";

import { MONO, FadeInUp } from "./shared";

const cards = [
  {
    accent: "var(--loss)",
    title: "THE LOSING TRADER",
    body: "You've tried journals. You've tried mentors. None showed you the $4,753 sitting in your no-stop trades. X-Ray doesn't coach you. It exposes the pattern — then gives you the prescription to break it.",
  },
  {
    accent: "var(--profit)",
    title: "THE PROFITABLE TRADER",
    body: "You make money. You don't know why — or how fragile it is. X-Ray maps your edge across 7 dimensions so you know which sessions to protect, and where one bad week undoes three good months.",
  },
  {
    accent: "var(--warning)",
    title: "THE PROP FIRM CHALLENGER",
    body: "You've paid $1,500 across three challenges. Failed all three. X-Ray runs Monte Carlo on your actual stats: 23% pass probability. DD breach on day 7. Get the Pre-Challenge Clearance before you fund again.",
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
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
