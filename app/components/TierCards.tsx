"use client";

import { useState } from "react";
import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

const TIERS = [
  {
    name: "SIGNAL",
    price: "Free",
    tagline: "One diagnosis. Real evidence. Enough to know if you need the full picture.",
    inheritedFrom: null as string | null,
    features: [
      "1 audit/month",
      "7 dimension scores (one-line finding each)",
      "Session P&L breakdown",
      "Top 3 behavioral flags with dollar cost",
      "Watermarked report",
    ],
    cta: "Get Diagnosed",
    href: "/new?tier=signal",
    mailto: false,
    highlight: false,
    popular: false,
    accent: "var(--text-secondary)",
  },
  {
    name: "AUDIT",
    price: "$29/mo",
    tagline: "Full forensic read. Your first real mirror.",
    inheritedFrom: "SIGNAL" as string | null,
    features: [
      "3 audits/month",
      "Full forensic narrative",
      "Ranked prescriptions",
      "Drill-down trade inspection",
      "Cost of indiscipline breakdown",
    ],
    cta: "Get AUDIT",
    href: "/new?tier=audit",
    mailto: false,
    highlight: false,
    popular: false,
    accent: "var(--accent-primary)",
  },
  {
    name: "FORENSIC",
    price: "$79/mo",
    tagline: "Institutional-grade behavioral intelligence.",
    inheritedFrom: "AUDIT" as string | null,
    features: [
      "10 audits/month",
      "Forensic AI narrative",
      "Prop firm challenge mode",
      "Pre-mortem Monte Carlo simulation",
      "Trader DNA profile",
      "Compliance tracking",
      "Pre-session briefing",
      "What-If engine",
    ],
    cta: "Get FORENSIC",
    href: "/new?tier=forensic",
    mailto: false,
    highlight: true,
    popular: true,
    accent: "var(--accent-primary)",
  },
  {
    name: "GUARDIAN",
    price: "$149/mo",
    tagline: "The risk desk you never had.",
    inheritedFrom: "FORENSIC" as string | null,
    features: [
      "Unlimited audits",
      "Live MT5 sync",
      "Telegram behavioral watchdog",
      "Circuit breaker automation",
      "5 connected accounts",
      "Discipline certification",
    ],
    cta: "Get GUARDIAN",
    href: "/new?tier=guardian",
    mailto: false,
    highlight: false,
    popular: false,
    accent: "var(--warning)",
  },
  {
    name: "SOVEREIGN",
    price: "$399/mo",
    tagline: "White-label intelligence for firms.",
    inheritedFrom: "GUARDIAN" as string | null,
    features: [
      "50 accounts",
      "Firm-wide analytics",
      "Custom rule engine",
      "API access",
      "White-label reports",
    ],
    cta: "Contact",
    href: "mailto:hello@xrayforensic.com",
    mailto: true,
    highlight: false,
    popular: false,
    accent: "var(--accent-secondary)",
  },
];

export default function TierCards() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

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
            overflowY: "visible",
            paddingTop: 20,
            paddingBottom: 16,
            paddingLeft: "max(40px, calc((100vw - 1180px) / 2))",
            paddingRight: "max(40px, calc((100vw - 1180px) / 2))",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border-subtle) transparent",
          }}
        >
          {TIERS.map((tier) => {
            const isHovered = hoveredTier === tier.name;
            const borderColor = tier.highlight
              ? "var(--accent-primary)"
              : isHovered
              ? "var(--border-active)"
              : "var(--border-subtle)";
            const shadow = tier.highlight
              ? isHovered
                ? "0 0 30px rgba(88,166,255,0.15)"
                : "0 0 20px rgba(88,166,255,0.1)"
              : "none";

            return (
              <div
                key={tier.name}
                onMouseEnter={() => setHoveredTier(tier.name)}
                onMouseLeave={() => setHoveredTier(null)}
                style={{
                  flexShrink: 0,
                  width: 244,
                  minHeight: 520,
                  display: "flex",
                  flexDirection: "column",
                  background: tier.highlight ? "var(--bg-elevated)" : "var(--bg-card)",
                  border: `1px solid ${borderColor}`,
                  borderRadius: 10,
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "visible",
                  boxShadow: shadow,
                  willChange: "transform",
                  transition: "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {tier.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--accent-primary)",
                      color: "var(--bg-base)",
                      padding: "4px 16px",
                      borderRadius: 4,
                      fontSize: "0.65rem",
                      fontFamily: MONO,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                      zIndex: 10,
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

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {tier.inheritedFrom && (
                    <p style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      margin: "0 0 12px",
                      paddingBottom: 8,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}>
                      Everything in {tier.inheritedFrom}, plus:
                    </p>
                  )}
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {tier.features.map((f, fi) => (
                      <li key={fi} style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.4 }}>
                        <span style={{ color: tier.accent, flexShrink: 0 }}>—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: "auto", paddingTop: 20 }}>
                  {tier.mailto ? (
                    <a
                      href={tier.href}
                      className={tier.highlight ? "btn btn-primary" : "btn btn-ghost"}
                      style={{ width: "100%", fontSize: 13, display: "inline-flex", justifyContent: "center" }}
                    >
                      {tier.cta}
                    </a>
                  ) : (
                    <Link
                      href={tier.href}
                      className={tier.highlight ? "btn btn-primary" : "btn btn-ghost"}
                      style={{ width: "100%", fontSize: 13, display: "inline-flex", justifyContent: "center" }}
                    >
                      {tier.cta}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </FadeInUp>
    </section>
  );
}
