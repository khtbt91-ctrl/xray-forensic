"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * HERO — rebuilt per structural redesign (2026-07-12).
 * Left-anchored per Art Director ruling (overrides prior centered layout —
 * both frozen campaign artboards are left-aligned, ragged-right; centered was
 * a deep-banned-tell per web-craft-standard).
 * H1 resolves D-5: literal FROZEN campaign hook, "Answer." in accent.
 * Eyebrow demotes the landing-copy positioning line to a kicker.
 * Subhead is MT5-explicit per landing-hero-waitlist-v2.md (D-2 working
 * assumption: MT5/forex is the correct asset scope for this build pass).
 */
export default function HeroSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <section
      className="circuit-overlay"
      style={{
        background: "#0A0E14",
        paddingTop: "calc(64px + 88px)",
        paddingBottom: "96px",
        paddingLeft: "24px",
        paddingRight: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost line-chart motif — right third, low opacity, evidence metaphor */}
      <svg
        aria-hidden
        width="480"
        height="320"
        viewBox="0 0 480 320"
        style={{
          position: "absolute",
          right: "-40px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.08,
          pointerEvents: "none",
        }}
        className="hero-ghost-chart"
      >
        <polyline
          points="0,260 60,240 100,255 150,190 200,210 250,140 300,160 350,90 400,110 480,40"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="3"
        />
      </svg>

      <div
        style={{
          maxWidth: 640,
          margin: 0,
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Eyebrow — demoted positioning line (D-5) */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "#38BDF8",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          The Only Platform That Tells You WHY You Lose
        </p>

        {/* H1 — literal FROZEN campaign hook */}
        <h1
          className="hero-headline-v2"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            margin: "0 0 24px",
            color: "#E6EDF3",
          }}
        >
          Your Trade History Already Knows the{" "}
          <span style={{ color: "#38BDF8" }}>Answer.</span>
        </h1>

        {/* Subhead — MT5-explicit */}
        <p
          style={{
            fontSize: "18px",
            fontFamily: "var(--font-sans)",
            color: "#8B98A9",
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: "0 0 32px",
          }}
        >
          Upload your MT5 trade history and get a forensic diagnosis: 7 scored
          behavioral dimensions, your trader archetype, every leak costed in
          dollars, and ranked process fixes. Built from your evidence — never
          from generic tips.
        </p>

        {/* CTAs */}
        <div
          className="hero-ctas-v2"
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              setLoading(true);
              router.push("/new");
            }}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: loading ? "rgba(56, 189, 248,0.5)" : "#38BDF8",
              color: "var(--bg)",
              border: "none",
              borderRadius: "8px",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(56, 189, 248,0.25)",
              transition: "background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#0EA5E9";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#38BDF8";
            }}
          >
            {loading ? "Processing..." : "Run Your Free Analysis"}
          </button>

          <Link
            href="/sample"
            className="hero-secondary-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              background: "transparent",
              color: "#8B98A9",
              border: "1px solid #26313F",
              borderRadius: "8px",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#8B98A9";
              e.currentTarget.style.color = "#E6EDF3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#26313F";
              e.currentTarget.style.color = "#8B98A9";
            }}
          >
            See Sample Verdict
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            marginTop: "28px",
          }}
        >
          MT5 EXPORT · .CSV / .HTM / .XLSX / .XML — NO PASSWORD REQUIRED
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-ghost-chart { opacity: 0.08 !important; right: -140px !important; }
          .hero-ctas-v2 { flex-direction: column !important; align-items: stretch !important; }
          .hero-ctas-v2 > button { order: 1; }
          .hero-secondary-cta { order: 2; margin-top: 8px; }
        }
      `}</style>
    </section>
  );
}
