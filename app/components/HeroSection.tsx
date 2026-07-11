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
        background: "#050811",
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
            background: "rgba(229,184,60,0.08)",
            border: "1px solid rgba(229,184,60,0.2)",
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
              background: "#e5b83c",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#e5b83c",
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
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.8rem, 5.5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 20px",
            color: "#f8fafc",
          }}
        >
          YOUR TRADES
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #e5b83c 0%, #b88d1d 100%)",
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
            color: "#94a3b8",
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
            color: "#e5b83c",
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
              background: loading ? "rgba(229,184,60,0.5)" : "#e5b83c",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(229,184,60,0.25)",
              transition: "background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#b88d1d";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#e5b83c";
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
              background: "#0e1626",
              color: "#94a3b8",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-active)";
              e.currentTarget.style.color = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e293b";
              e.currentTarget.style.color = "#94a3b8";
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
