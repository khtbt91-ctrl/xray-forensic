"use client";

import { useState } from "react";
import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

type Feature = { text: string; included: boolean };

const TIERS: {
  name: string;
  price: string;
  tagline: string;
  features: Feature[];
  cta: string;
  href: string;
  highlight: boolean;
  popular: boolean;
  accent: string;
}[] = [
  {
    name: "SIGNAL",
    price: "Free",
    tagline: "One diagnosis. Real evidence.",
    features: [
      { text: "1 analysis per month", included: true },
      { text: "Basic 7-dimension report", included: true },
      { text: "Prescriptions", included: false },
      { text: "Compliance tracking", included: false },
    ],
    cta: "Get Started",
    href: "/pricing",
    highlight: false,
    popular: false,
    accent: "var(--text-secondary)",
  },
  {
    name: "FORENSIC",
    price: "$29/mo",
    tagline: "Full forensic read. Your first real mirror.",
    features: [
      { text: "4 analyses per month", included: true },
      { text: "Full AI diagnostic report", included: true },
      { text: "5 ranked prescriptions", included: true },
      { text: "What-If engine (2/mo)", included: true },
      { text: "Compliance tracking", included: true },
    ],
    cta: "Start with Forensic",
    href: "/pricing",
    highlight: false,
    popular: false,
    accent: "var(--accent-primary)",
  },
  {
    name: "OPERATOR",
    price: "$79/mo",
    tagline: "Institutional-grade behavioral intelligence.",
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "Everything in Forensic", included: true },
      { text: "Trader DNA profile", included: true },
      { text: "Anonymous benchmarking", included: true },
      { text: "Broker connection (Phase 2)", included: true },
    ],
    cta: "Go Operator",
    href: "/pricing",
    highlight: true,
    popular: true,
    accent: "var(--accent-primary)",
  },
  {
    name: "ELITE",
    price: "$149/mo",
    tagline: "The risk desk you never had.",
    features: [
      { text: "Everything in Operator", included: true },
      { text: "Real-time behavioral alerts", included: true },
      { text: "Discipline certification", included: true },
      { text: "5 broker connections", included: true },
      { text: "Priority diagnosis", included: true },
    ],
    cta: "Go Elite",
    href: "/pricing",
    highlight: false,
    popular: false,
    accent: "var(--accent-primary)",
  },
];

export default function TierCards() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  return (
    <section id="pricing" style={{ padding: "0 0 100px" }}>
      <FadeInUp style={{ textAlign: "center", width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 12,
            width: "100%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
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
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {tier.features.map((f, fi) => (
                      <li key={fi} style={{ fontSize: 12, color: f.included ? "var(--text-secondary)" : "#4B5563", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.4 }}>
                        <span style={{ color: f.included ? tier.accent : "#374151", flexShrink: 0 }}>
                          {f.included ? "—" : "—"}
                        </span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: "auto", paddingTop: 20 }}>
                  <Link
                    href={tier.href}
                    className={tier.highlight ? "btn btn-primary" : "btn btn-ghost"}
                    style={{ width: "100%", fontSize: 13, display: "inline-flex", justifyContent: "center" }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </FadeInUp>
    </section>
  );
}
