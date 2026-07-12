"use client";

import { useState } from "react";
import { MONO, FadeInUp } from "./shared";

/**
 * WHO THIS IS FOR — Section 6, structural redesign (2026-07-12).
 * Algo/Crypto card CUT outright (not merged) — Art Director ruling B,
 * confirmed: reversible once D-2 (asset scope) resolves toward crypto.
 * 2+2 asymmetric grid, Prop Firm Trader as anchor (top-left, ~1.4x area).
 * Background shade: CARD (middle of the 5/6/7 alternation).
 */

const cards = [
  {
    key: "prop-firm",
    accent: "var(--warning)",
    title: "THE PROP FIRM TRADER",
    anchor: true,
    body: null as string | null,
    scenarios: [
      {
        label: "BEFORE THE CHALLENGE",
        text: "You've paid $1,500 across three attempts. Failed all three. X-Ray reads your actual stats — daily-loss breach patterns, drawdown timing, sizing behavior — and tells you exactly what fails before you fund again.",
      },
      {
        label: "INSIDE A FUNDED ACCOUNT",
        text: "You passed. Now you're protecting a real payout. X-Ray maps your behavioral risk: which sessions to avoid, your revenge-trade signature, and the exact daily limit that keeps your account alive.",
      },
    ],
  },
  {
    key: "losing",
    accent: "var(--loss)",
    title: "THE LOSING TRADER",
    anchor: false,
    body: "You've tried journals. You've tried mentors. None showed you the $4,753 in stop-loss leaks (demo account). X-Ray doesn't coach you. It exposes the pattern — then gives you the prescription to break it.",
    scenarios: null,
  },
  {
    key: "profitable",
    accent: "#10b981",
    title: "THE PROFITABLE TRADER",
    anchor: false,
    body: "You've been profitable for months. But you don't know if it's skill or variance.\n\nX-Ray maps exactly which sessions generate your returns, which behaviors are quietly eroding them, and how fragile your edge really is.",
    scenarios: null,
  },
  {
    key: "beginner",
    accent: "var(--accent-primary)",
    title: "THE BEGINNER",
    anchor: false,
    body: "You've just started. Everyone's telling you different things. You don't know what you don't know yet.\n\nX-Ray's FOUNDATIONS layer teaches the institutional framework from zero — then diagnoses your first real trades the moment you have history.",
    scenarios: null,
  },
];

function ScenarioBlock({ card }: { card: (typeof cards)[number] }) {
  const [open, setOpen] = useState(false);
  if (!card.scenarios) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Mobile: collapse to accordion (Art Director APPROVED) */}
      <button
        className="scenario-accordion-toggle"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "none",
          fontFamily: MONO,
          fontSize: 11,
          color: card.accent,
          background: "transparent",
          border: `1px solid ${card.accent}`,
          borderRadius: 6,
          padding: "8px 12px",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        {open ? "Hide scenarios ▲" : "See both scenarios ▼"}
      </button>
      <div className={open ? "scenario-body scenario-open" : "scenario-body"}>
        {card.scenarios.map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 6,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: card.accent, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
              {s.label}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AudienceSection() {
  return (
    <section style={{ background: "var(--bg-card)", padding: "96px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <FadeInUp style={{ textAlign: "center", width: "100%", display: "block" }}>
          <p style={{
            fontFamily: MONO, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--text-muted)", textAlign: "center", marginBottom: 48,
          }}>
            WHO THIS IS FOR
          </p>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="who-grid-v2">
            {cards.map((card) => (
              <div
                key={card.key}
                className={card.anchor ? "who-anchor" : undefined}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderLeft: `3px solid ${card.accent}`,
                  borderRadius: 8,
                  padding: card.anchor ? "2.5rem" : "2rem",
                }}
              >
                <h3 style={{
                  fontFamily: MONO, fontSize: card.anchor ? "1rem" : "0.85rem", textTransform: "uppercase",
                  color: "var(--text-primary)", margin: "0 0 14px", letterSpacing: "0.06em", lineHeight: 1.4,
                }}>
                  {card.title}
                </h3>
                {card.body && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {card.body}
                  </p>
                )}
                <ScenarioBlock card={card} />
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .scenario-accordion-toggle { display: block !important; }
          .scenario-body { display: none; }
          .scenario-body.scenario-open { display: block; }
        }
      `}</style>
    </section>
  );
}
