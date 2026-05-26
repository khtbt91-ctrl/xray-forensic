"use client";

import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

const TIERS = [
  {
    name: "SIGNAL",
    price: "Free",
    tagline: "One diagnosis. Real evidence. Enough to know if you need the full picture.",
    features: [
      "1 full audit per month",
      "7 dimension scores with one-line finding each",
      "Session P&L breakdown",
      "Top 3 behavioral flags with dollar cost",
      "Watermarked report (no prescription)",
    ],
    cta: "Get Diagnosed",
    href: "/new",
    highlight: false,
    popular: false,
    accent: "var(--text-secondary)",
  },
  {
    name: "AUDIT",
    price: "$29/mo",
    tagline: "Full forensic read. Your first real mirror.",
    features: ["3 audits/month", "Full narrative", "Ranked prescriptions", "Drill-down stats", "Cost of indiscipline"],
    cta: "Get AUDIT",
    href: "/new",
    highlight: false,
    popular: false,
    accent: "var(--accent-primary)",
  },
  {
    name: "FORENSIC",
    price: "$79/mo",
    tagline: "Institutional-grade behavioral intelligence.",
    features: ["10 audits/month", "AI diagnosis", "Prop firm mode", "Pre-mortem analysis", "DNA profile", "Compliance tracking", "Pre-session briefing", "What-if engine"],
    cta: "Get FORENSIC",
    href: "/new",
    highlight: true,
    popular: true,
    accent: "var(--accent-primary)",
  },
  {
    name: "GUARDIAN",
    price: "$149/mo",
    tagline: "The risk desk you never had.",
    features: ["Unlimited audits", "Everything in FORENSIC", "Live MT5 sync", "Telegram watchdog", "Circuit breaker", "5 accounts", "Certification"],
    cta: "Get GUARDIAN",
    href: "/new",
    highlight: false,
    popular: false,
    accent: "var(--accent-secondary)",
  },
  {
    name: "SOVEREIGN",
    price: "$399/mo",
    tagline: "White-label intelligence for firms.",
    features: ["50 accounts", "Firm-wide analytics", "Custom rule engine", "API access", "White-label"],
    cta: "Contact",
    href: "mailto:your-email@example.com",
    highlight: false,
    popular: false,
    accent: "var(--warning)",
  },
];

export default function TierCards() {
  return (
    <section id="pricing" style={{ padding: "0 0 100px" }}>
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          CLEARANCE LEVELS
        </p>
        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: "0 0 48px",
          }}
        >
          Choose your diagnostic depth.
        </h2>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 16,
            paddingLeft: "max(40px, calc((100vw - 1180px) / 2))",
            paddingRight: "max(40px, calc((100vw - 1180px) / 2))",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border-subtle) transparent",
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                flexShrink: 0,
                width: 244,
                minHeight: 500,
                background: tier.highlight ? "var(--bg-elevated)" : "var(--bg-card)",
                border: tier.highlight ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                borderRadius: 10,
                padding: "28px 24px",
                position: "relative",
                overflow: "visible",
                boxShadow: tier.highlight ? "0 0 36px rgba(88,166,255,0.14)" : "none",
              }}
            >
              {tier.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--accent-primary)",
                    color: "#0D1117",
                    fontSize: 10,
                    fontFamily: MONO,
                    letterSpacing: "0.12em",
                    padding: "3px 12px",
                    borderRadius: "4px 4px 0 0",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.16em", color: tier.accent, margin: "0 0 8px", marginTop: tier.popular ? 12 : 0 }}>
                {tier.name}
              </p>
              <p style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500, margin: "0 0 8px", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                {tier.price}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.45 }}>
                {tier.tagline}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {tier.features.map((f, fi) => (
                  <li key={fi} style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.4 }}>
                    <span style={{ color: tier.accent, flexShrink: 0 }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              {tier.name === "SIGNAL" && (
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                  marginTop: '16px',
                  lineHeight: '1.5',
                }}>
                  The prescription and protocol library unlock from AUDIT tier.
                </p>
              )}
              <Link
                href={tier.href}
                className={tier.highlight ? "btn btn-primary" : "btn btn-ghost"}
                style={{ width: "100%", fontSize: 13 }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
