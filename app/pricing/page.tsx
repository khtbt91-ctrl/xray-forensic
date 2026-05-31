"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import NavBar from "../components/NavBar";

const GOLD = "#C9A84C";
const MONO = "JetBrains Mono, monospace";

const TIERS = [
  {
    id: "signal",
    name: "SIGNAL",
    price: null as string | null,
    tagline: "One diagnosis. Real evidence.",
    features: [
      { text: "1 analysis per month", included: true },
      { text: "Basic 7-dimension report", included: true },
      { text: "Prescriptions", included: false },
      { text: "Compliance tracking", included: false },
    ],
    cta: "Get Started",
    popular: false,
    free: true,
  },
  {
    id: "forensic",
    name: "FORENSIC",
    price: "29" as string | null,
    tagline: "Full forensic read. Your first real mirror.",
    features: [
      { text: "4 analyses per month", included: true },
      { text: "Full AI diagnostic report", included: true },
      { text: "5 ranked prescriptions", included: true },
      { text: "What-If engine (2/mo)", included: true },
      { text: "Compliance tracking", included: true },
    ],
    cta: "Upgrade to Forensic",
    popular: false,
    free: false,
  },
  {
    id: "operator",
    name: "OPERATOR",
    price: "79" as string | null,
    tagline: "Institutional-grade behavioral intelligence.",
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "Everything in Forensic", included: true },
      { text: "Trader DNA profile", included: true },
      { text: "Anonymous benchmarking", included: true },
      { text: "Broker connection (Phase 2)", included: true },
    ],
    cta: "Upgrade to Operator",
    popular: true,
    free: false,
  },
  {
    id: "elite",
    name: "ELITE",
    price: "149" as string | null,
    tagline: "The risk desk you never had.",
    features: [
      { text: "Everything in Operator", included: true },
      { text: "Real-time behavioral alerts", included: true },
      { text: "Discipline certification", included: true },
      { text: "5 broker connections", included: true },
      { text: "Priority diagnosis", included: true },
    ],
    cta: "Upgrade to Elite",
    popular: false,
    free: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  // Route the free CTA based on auth state and remaining quota.
  // analyses_limit === -1 means unlimited (never treat as reached).
  const limitReached =
    !!profile &&
    profile.analyses_limit !== -1 &&
    profile.analyses_used >= profile.analyses_limit;
  const freeCTAHref = !user ? "/login" : limitReached ? "/dashboard" : "/new";
  const freeCTALabel = limitReached ? "View Dashboard" : "Get Started";

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A", color: "var(--text-primary)" }}>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1023px) {
          .pricing-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <NavBar />

      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <p style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: GOLD,
          margin: "0 0 20px",
        }}>
          PRICING
        </p>
        <h1 style={{
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
          lineHeight: 1.15,
          margin: "0 0 20px",
        }}>
          Forensic intelligence.<br />Priced for operators.
        </h1>
        <p style={{
          fontSize: 16,
          color: "#9CA3AF",
          lineHeight: 1.7,
          maxWidth: 520,
          margin: "0 auto",
        }}>
          Every tier includes the same diagnostic engine. Higher tiers unlock
          deeper tracking, more analyses, and real-time intervention.
        </p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 96px" }}>
        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              style={{
                position: "relative",
                background: "var(--bg-card)",
                border: `1px solid ${tier.popular ? GOLD : "var(--border-subtle)"}`,
                borderRadius: 10,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                boxShadow: tier.popular ? `0 0 40px rgba(201,168,76,0.10)` : "none",
              }}
            >
              {/* MOST POPULAR badge */}
              {tier.popular && (
                <div style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: GOLD,
                  color: "#000000",
                  fontSize: 10,
                  fontFamily: MONO,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "4px 14px",
                  borderRadius: "0 0 6px 6px",
                  whiteSpace: "nowrap",
                }}>
                  MOST POPULAR
                </div>
              )}

              {/* Tier name */}
              <p style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: GOLD,
                margin: tier.popular ? "20px 0 8px" : "0 0 8px",
              }}>
                {tier.name}
              </p>

              {/* Tagline */}
              <p style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                margin: "0 0 20px",
                lineHeight: 1.5,
              }}>
                {tier.tagline}
              </p>

              {/* Price */}
              {tier.free ? (
                <div style={{ marginBottom: 28 }}>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 56,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    lineHeight: 1,
                    display: "block",
                  }}>
                    Free
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 28 }}>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    paddingTop: 10,
                    lineHeight: 1,
                  }}>
                    $
                  </span>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 56,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    lineHeight: 1,
                  }}>
                    {tier.price}
                  </span>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 20,
                    color: "#9CA3AF",
                    alignSelf: "flex-end",
                    paddingBottom: 6,
                    lineHeight: 1,
                  }}>
                    /mo
                  </span>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: "var(--border-subtle)", marginBottom: 24 }} />

              {/* Features */}
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 32px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flex: 1,
              }}>
                {tier.features.map((f) => (
                  <li
                    key={f.text}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      fontSize: 15,
                      color: f.included ? "#E5E7EB" : "#4B5563",
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{
                      color: f.included ? GOLD : "#374151",
                      flexShrink: 0,
                      fontFamily: MONO,
                      fontSize: 13,
                      marginTop: 1,
                    }}>
                      {f.included ? "✓" : "—"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.free ? (
                <Link
                  href={freeCTAHref}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 20px",
                    background: "transparent",
                    border: "1px solid var(--border-active)",
                    borderRadius: 6,
                    color: "var(--text-secondary)",
                    fontFamily: MONO,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  {freeCTALabel}
                </Link>
              ) : (
                <button
                  onClick={() => router.push(`/payment?tier=${tier.id}&amount=${tier.price ?? ""}`)}
                  style={{
                    padding: "12px 20px",
                    background: tier.popular ? GOLD : "transparent",
                    border: `1px solid ${tier.popular ? GOLD : "var(--border-active)"}`,
                    borderRadius: 6,
                    color: tier.popular ? "#000000" : "var(--text-secondary)",
                    fontFamily: MONO,
                    fontSize: 13,
                    fontWeight: tier.popular ? 700 : 500,
                    cursor: "pointer",
                    width: "100%",
                    transition: "all 0.15s",
                  }}
                >
                  {tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Institutional / SOVEREIGN waitlist strip */}
      <div style={{
        borderTop: "1px solid #222",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: GOLD,
          margin: "0 0 24px",
        }}>
          INSTITUTIONAL · PHASE 3
        </p>
        <p style={{
          fontSize: 18,
          color: "#9CA3AF",
          lineHeight: 1.7,
          maxWidth: 540,
          margin: "0 auto 36px",
        }}>
          Trading desk infrastructure. Multi-account visibility. Automated risk protocols.
          Real-time behavioral intervention at scale.
        </p>
        <a
          href="mailto:support@xrayforensic.com?subject=SOVEREIGN%20waitlist"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "transparent",
            border: `1px solid ${GOLD}`,
            borderRadius: 6,
            color: GOLD,
            fontFamily: MONO,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Join the waitlist →
        </a>
      </div>

      {/* Bottom strip */}
      <div style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.6, margin: "0 0 4px" }}>
          Not sure which tier fits?
        </p>
        <p style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.6, margin: "0 0 4px" }}>
          Run your first diagnosis free.
        </p>
        <p style={{ fontSize: 22, fontWeight: 400, color: "#9CA3AF", lineHeight: 1.6, margin: "0 0 36px" }}>
          The report will tell you.
        </p>
        <Link
          href="/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 36px",
            background: GOLD,
            color: "#000000",
            fontFamily: MONO,
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 6,
            textDecoration: "none",
            letterSpacing: "0.06em",
          }}
        >
          Start Free →
        </Link>
      </div>
    </main>
  );
}
                                                                                                                                                                                                                                                                                                                                      