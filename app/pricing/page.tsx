"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import NavBar from "../components/NavBar";

const GOLD = "#38BDF8";
const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Inter', sans-serif";

const TIERS = [
  {
    id: "signal",
    name: "SIGNAL",
    price: null as string | null,
    tagline: "Find out what's costing you money.",
    features: [
      { text: "1 analysis per month", included: true },
      { text: "7-dimension score breakdown", included: true },
      { text: "Top 2 prescriptions", included: true },
      { text: "Basic behavioral flags", included: true },
    ],
    cta: "Get Diagnosed",
    popular: false,
    free: true,
  },
  {
    id: "forensic",
    name: "FORENSIC",
    price: "29" as string | null,
    tagline: "Fix it. Measure it. See the delta.",
    features: [
      { text: "4 analyses per month", included: true },
      { text: "Full report — all flags, all dimensions", included: true },
      { text: "5 ranked prescriptions with dollar targets", included: true },
      { text: "Score delta vs previous upload", included: true },
      { text: "Progress history", included: true },
    ],
    cta: "Start Forensic",
    popular: true,
    free: false,
  },
  {
    id: "operator",
    name: "OPERATOR",
    price: "79" as string | null,
    tagline: "Your trading has a permanent diagnostic layer.",
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "Everything in Forensic", included: true },
      { text: "Full behavioral narrative report", included: true },
      { text: "Trader DNA profile", included: true },
      { text: "Anonymous benchmarking", included: true },
      { text: "Compliance tracker", included: true },
    ],
    cta: "Go Operator",
    popular: false,
    free: false,
  },
  {
    id: "elite",
    name: "ELITE",
    price: "149" as string | null,
    tagline: "Built for funded traders who can't afford mistakes.",
    features: [
      { text: "Everything in Operator", included: true },
      { text: "Pre-Challenge Clearance — know your pass probability before you fund", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new features", included: true },
    ],
    cta: "Go Elite",
    popular: false,
    free: false,
  },
];

function PricingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const showLimitBanner = searchParams.get("reason") === "limit_reached" && !bannerDismissed;

  const highlight = searchParams.get("highlight");
  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`tier-${highlight}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.boxShadow = `0 0 0 2px ${GOLD}`;
    const timer = setTimeout(() => { el.style.boxShadow = ""; }, 2000);
    return () => clearTimeout(timer);
  }, [highlight]);

  const limitReached =
    !!profile &&
    profile.analyses_limit !== -1 &&
    profile.analyses_used >= profile.analyses_limit;
  const freeCTAHref = !user ? "/signup" : "/dashboard";
  const freeCTALabel = !user ? "Start Free →" : "View Dashboard →";

  return (
    <main style={{ minHeight: "100vh", background: "#0A0E14", color: "#E6EDF3" }}>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 1023px) {
          .pricing-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <NavBar />

      {/* Limit-reached upgrade prompt — shown when redirected from /new */}
      {showLimitBanner && (
        <div style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "calc(64px + 24px) 24px 0",
        }}>
          <div style={{
            background: "rgba(56, 189, 248,0.06)",
            border: `1px solid ${GOLD}`,
            borderRadius: 8,
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}>
            <p style={{
              fontFamily: MONO,
              fontSize: 13,
              color: GOLD,
              margin: 0,
              lineHeight: 1.5,
            }}>
              You&apos;ve used your free analysis this month. Upgrade to run more.
            </p>
            <button
              onClick={() => setBannerDismissed(true)}
              style={{
                background: "transparent",
                border: "none",
                color: GOLD,
                fontFamily: MONO,
                fontSize: 16,
                cursor: "pointer",
                padding: "0 4px",
                flexShrink: 0,
                lineHeight: 1,
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: showLimitBanner ? "40px 24px 64px" : "calc(64px + 80px) 24px 64px", textAlign: "center" }}>
        <p style={{
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: GOLD,
          margin: "0 0 16px",
        }}>
          LICENSE PLANS
        </p>
        <h1 style={{
          fontFamily: SPACE,
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#E6EDF3",
          lineHeight: 1.1,
          margin: "0 0 16px",
          textTransform: "uppercase",
        }}>
          Institutional Tier Pricing
        </h1>
        <p style={{
          fontSize: 16,
          color: "#8B98A9",
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
              id={`tier-${tier.id}`}
              className={tier.popular ? "glow-accent" : ""}
              style={{
                position: "relative",
                background: "#131A24",
                border: tier.popular ? `2px solid ${GOLD}` : "1px solid #26313F",
                borderRadius: 12,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                transform: tier.popular ? "translateY(-6px) scale(1.02)" : "none",
                zIndex: tier.popular ? 10 : 1,
                transition: "border-color 0.2s",
                overflow: "hidden",
              }}
            >
              {/* Corner ribbon for most popular */}
              {tier.popular && (
                <div style={{
                  position: "absolute",
                  top: "14px",
                  right: "-28px",
                  background: GOLD,
                  color: "#000",
                  fontSize: "10px",
                  fontFamily: MONO,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "4px 36px",
                  transform: "rotate(45deg)",
                  transformOrigin: "center",
                  whiteSpace: "nowrap",
                }}>
                  MOST CHOSEN
                </div>
              )}

              {/* Tier name */}
              <p style={{
                fontFamily: MONO,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: tier.popular ? GOLD : "#8B98A9",
                margin: "0 0 6px",
              }}>
                {tier.name}
              </p>

              {/* Tagline */}
              <p style={{
                fontSize: 13,
                color: "#8B98A9",
                margin: "0 0 20px",
                lineHeight: 1.5,
              }}>
                {tier.tagline}
              </p>

              {/* Price */}
              {tier.free ? (
                <div style={{ marginBottom: 24 }}>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 40,
                    fontWeight: 800,
                    color: "#E6EDF3",
                    lineHeight: 1,
                    display: "block",
                  }}>
                    Free
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    paddingTop: 6,
                    lineHeight: 1,
                  }}>
                    $
                  </span>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 40,
                    fontWeight: 800,
                    color: "#E6EDF3",
                    lineHeight: 1,
                  }}>
                    {tier.price}
                  </span>
                  <span style={{
                    fontFamily: MONO,
                    fontSize: 14,
                    color: "var(--text-muted)",
                    alignSelf: "flex-end",
                    paddingBottom: 4,
                    lineHeight: 1,
                  }}>
                    /mo
                  </span>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: "#26313F", marginBottom: 20 }} />

              {/* Features */}
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 28px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
              }}>
                {tier.features.map((f) => (
                  <li key={f.text} style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    fontSize: 13,
                    color: f.included ? "var(--text-primary)" : "var(--text-muted)",
                    lineHeight: 1.4,
                  }}>
                    <span style={{
                      color: f.included ? GOLD : "var(--border-subtle)",
                      flexShrink: 0,
                      fontFamily: MONO,
                      fontSize: 13,
                      marginTop: 1,
                    }}>
                      {f.included ? "✓" : "—"}
                    </span>
                    <span style={{ textDecoration: f.included ? "none" : "line-through" }}>
                      {f.text}
                    </span>
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
                    background: "#0F141D",
                    border: "1px solid #26313F",
                    borderRadius: 6,
                    color: "#8B98A9",
                    fontFamily: SPACE,
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                >
                  {freeCTALabel}
                </Link>
              ) : (
                <button
                  onClick={() => router.push(`/payment?tier=${tier.id}&amount=${tier.price ?? ""}`)}
                  style={{
                    padding: "12px 20px",
                    background: tier.popular ? GOLD : "#0F141D",
                    border: `1px solid ${tier.popular ? GOLD : "#26313F"}`,
                    borderRadius: 6,
                    color: tier.popular ? "#000000" : "#8B98A9",
                    fontFamily: SPACE,
                    fontSize: 13,
                    fontWeight: tier.popular ? 700 : 600,
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

      {/* Partnership line */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
        <p style={{
          fontFamily: MONO,
          fontSize: 12,
          color: "var(--text-muted)",
          letterSpacing: "0.04em",
        }}>
          Institutional and prop firm partnerships →{" "}
          <a
            href="mailto:admin@xrayforensic.com"
            style={{ color: "#8B98A9", textDecoration: "none" }}
          >
            admin@xrayforensic.com
          </a>
        </p>
      </div>

      {/* Bottom CTA */}
      <div style={{
        borderTop: "1px solid #26313F",
        background: "#131A24",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: SPACE,
          fontSize: 24,
          fontWeight: 700,
          color: "#E6EDF3",
          lineHeight: 1.5,
          margin: "0 0 4px",
        }}>
          Not sure which tier fits?
        </p>
        <p style={{
          fontFamily: SPACE,
          fontSize: 24,
          fontWeight: 400,
          color: "#8B98A9",
          lineHeight: 1.5,
          margin: "0 0 32px",
        }}>
          Run your first diagnosis free. The report will tell you.
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
            fontFamily: SPACE,
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Start Free →
        </Link>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingPageInner />
    </Suspense>
  );
}
