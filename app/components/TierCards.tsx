"use client";

import { useState } from "react";
import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

type Feature = { text: string; included: boolean };

type Tier = {
  name: string;
  price: string;
  tagline: string;
  hook: string;
  features: Feature[];
  cta: string;
  href: string;
  highlight: boolean;
  popular: boolean;
  accent: string;
  disabled?: boolean;
  badge?: string;
};

const TIERS: Tier[] = [
  {
    name: "SIGNAL",
    price: "Free",
    tagline: "See your leaks once.",
    hook: "Start here. No credit card.",
    features: [
      { text: "1 full analysis per month", included: true },
      { text: "7-dimension score breakdown", included: true },
      { text: "Top 3 behavioral flags", included: true },
      { text: "Prescriptions", included: false },
      { text: "Progress vs last upload", included: false },
    ],
    cta: "Get Diagnosed",
    href: "/new",
    highlight: false,
    popular: false,
    accent: "var(--text-secondary)",
  },
  {
    name: "FORENSIC",
    price: "$29/mo",
    tagline: "Track whether you're actually improving.",
    hook: "Every upload compares to your last. Your scores move. The leaks shrink — or they don't. The data decides.",
    features: [
      { text: "3 analyses per month", included: true },
      { text: "Full report — all flags, all dimensions", included: true },
      { text: "5 ranked prescriptions with dollar targets", included: true },
      { text: "Score delta vs previous upload", included: true },
      { text: "Progress history", included: true },
    ],
    cta: "Start Forensic",
    href: "/new?tier=forensic",
    highlight: true,
    popular: true,
    accent: "#C9A84C",
  },
  {
    name: "OPERATOR",
    price: "$79/mo",
    tagline: "Institutional-grade behavioral intelligence.",
    hook: "10 analyses per month. Weekly uploads show weekly change. Monthly uploads build the arc.",
    features: [
      { text: "10 analyses per month", included: true },
      { text: "Everything in Forensic", included: true },
      { text: "AI narrative diagnosis", included: true },
      { text: "Trader DNA profile", included: true },
      { text: "Anonymous benchmarking", included: true },
    ],
    cta: "Go Operator",
    href: "/new?tier=operator",
    highlight: false,
    popular: false,
    accent: "var(--accent-primary)",
  },
  {
    name: "GUARDIAN",
    price: "$149/mo",
    tagline: "The risk desk you never had.",
    hook: "Unlimited analyses. Real-time behavioral alerts before you pull the trigger — not after.",
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "Everything in Forensic", included: true },
      { text: "Real-time behavioral alerts", included: true },
      { text: "5 broker connections", included: true },
      { text: "Discipline certification", included: true },
    ],
    cta: "Join Waitlist",
    href: "mailto:admin@xrayforensic.com?subject=Guardian%20Waitlist",
    highlight: false,
    popular: false,
    accent: "var(--warning)",
    disabled: true,
    badge: "PHASE 3",
  },
  {
    name: "SOVEREIGN",
    price: "$399/mo",
    tagline: "Institutional and prop firm layer.",
    hook: "White-label forensic intelligence for prop firms and trading desks. Behavioral risk at scale.",
    features: [
      { text: "Everything in Guardian", included: true },
      { text: "50 accounts managed", included: true },
      { text: "Firm-wide trader analytics", included: true },
      { text: "White-label reports", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Contact Us",
    href: "mailto:admin@xrayforensic.com?subject=Sovereign%20Inquiry",
    highlight: false,
    popular: false,
    accent: "var(--accent-secondary)",
    disabled: true,
    badge: "PHASE 3",
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
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#C9A84C",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Diagnostic Depth
        </p>
        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
          }}
        >
          One report changes the picture.
          <br />
          Every report changes the trader.
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 8px" }}>
          Each upload is compared to your last. Your scores move. Your leaks shrink — or they don&apos;t. The data decides.
        </p>
        <Link
          href="/sample"
          style={{ fontFamily: MONO, fontSize: 11, color: "var(--accent-primary)", letterSpacing: "0.08em", textDecoration: "none", display: "inline-block", marginBottom: 40 }}
        >
          View sample report →
        </Link>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        {/* Outer: horizontal scroll container */}
        <div style={{ overflowX: "auto", overflowY: "visible", paddingBottom: 16, scrollbarWidth: "thin", scrollbarColor: "var(--border-subtle) transparent" }}>
          {/* Inner: centers cards on wide screens, allows scroll on narrow */}
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              padding: "20px 40px 4px",
              minWidth: "max-content",
              margin: "0 auto",
            }}
          >
          {TIERS.map((tier) => {
            const isHovered = hoveredTier === tier.name;
            const borderColor = tier.highlight
              ? "#C9A84C"
              : tier.disabled
              ? "var(--border-subtle)"
              : isHovered
              ? "var(--border-active)"
              : "var(--border-subtle)";
            const shadow = tier.highlight
              ? isHovered
                ? "0 0 30px rgba(201,168,76,0.2)"
                : "0 0 20px rgba(201,168,76,0.1)"
              : "none";

            return (
              <div
                key={tier.name}
                onMouseEnter={() => !tier.disabled && setHoveredTier(tier.name)}
                onMouseLeave={() => setHoveredTier(null)}
                style={{
                  flexShrink: 0,
                  width: 220,
                  minHeight: 520,
                  display: "flex",
                  flexDirection: "column",
                  background: tier.highlight ? "var(--bg-elevated)" : "var(--bg-card)",
                  border: `1px solid ${borderColor}`,
                  borderRadius: 10,
                  padding: "28px 22px",
                  position: "relative",
                  overflow: "visible",
                  boxShadow: shadow,
                  opacity: tier.disabled ? 0.6 : 1,
                  willChange: "transform",
                  transition: "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
                  transform: (!tier.disabled && isHovered) ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {tier.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#C9A84C",
                      color: "#000",
                      padding: "4px 16px",
                      borderRadius: 4,
                      fontSize: "0.65rem",
                      fontFamily: MONO,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                      zIndex: 10,
                    }}
                  >
                    MOST CHOSEN
                  </div>
                )}
                {tier.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--bg-elevated)",
                      color: tier.accent,
                      border: `1px solid ${tier.accent}`,
                      padding: "3px 12px",
                      borderRadius: 4,
                      fontSize: "0.6rem",
                      fontFamily: MONO,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                      zIndex: 10,
                    }}
                  >
                    {tier.badge}
                  </div>
                )}


<p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.16em", color: tier.accent, margin: `${(tier.popular || tier.badge) ? 12 : 0}px 0 8px` }}>
                  {tier.name}
                </p>
                <p style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500, margin: "0 0 8px", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                  {tier.price}
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px", lineHeight: 1.3 }}>
                  {tier.tagline}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.6, fontStyle: "italic" }}>
                  {tier.hook}
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
                    style={{
                      width: "100%",
                      fontSize: 13,
                      display: "inline-flex",
                      justifyContent: "center",
                      padding: "11px 20px",
                      borderRadius: 6,
                      fontWeight: 700,
                      textDecoration: "none",
                      background: tier.highlight ? "#C9A84C" : "transparent",
                      color: tier.highlight ? "#000" : "var(--text-primary)",
                      border: tier.highlight ? "none" : "1px solid var(--border-subtle)",
                      transition: "opacity 150ms ease",
                    }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            );
          })}
          </div> {/* inner: flex centering */}
        </div> {/* outer: horizontal scroll */}
      </FadeInUp>
    </section>
  );
}
