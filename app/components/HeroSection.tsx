"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <section
      className="circuit-overlay"
      style={{
        background: "#0A0E14",
        paddingTop: "calc(64px + 80px)",
        paddingBottom: "80px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(56, 189, 248,0.08)",
            border: "1px solid rgba(56, 189, 248,0.2)",
            borderRadius: "100px",
            padding: "6px 14px",
            marginBottom: "28px",
          }}
        >
          <span
            className="pulse-subtle"
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#38BDF8",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#38BDF8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            [SYSTEM FORENSIC STAGE: ONLINE]
          </span>
        </div>

        {/* H1 */}
        <h1
          className="hero-headline"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(2.8rem, 5.5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 20px",
            color: "#E6EDF3",
          }}
        >
          YOUR TRADES
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            LEAVE EVIDENCE.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subheadline"
          style={{
            fontSize: "16px",
            color: "#8B98A9",
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: "0 auto 10px",
          }}
        >
          Upload your trade history. X-Ray returns a forensic verdict you
          cannot negotiate — and a prescription with a measurable target.
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#38BDF8",
            letterSpacing: "0.1em",
            marginBottom: "36px",
          }}
        >
          [SYSTEM READY: 99.8% UPTIME]
        </p>

        {/* CTAs */}
        <div
          className="hero-ctas"
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
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
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
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
            {loading ? "Processing..." : "Get Diagnosed"}
          </button>

          <Link
            href="/sample"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              background: "#131A24",
              color: "#8B98A9",
              border: "1px solid #26313F",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-active)";
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

        {/* Platform list */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            marginTop: "24px",
          }}
        >
          MT5 · Binance · Bybit · OKX · Bitget · BingX
        </p>
      </div>
    </section>
  );
}
