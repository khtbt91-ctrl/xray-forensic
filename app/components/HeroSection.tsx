"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FEED_EVENTS = [
  { msg: "276 revenge re-entries — XAUUSD London", risk: true },
  { msg: "Off-session leak detected — GBPUSD Asian", risk: false },
  { msg: "91% losses from zero stop-loss — NAS100", risk: true },
  { msg: "Winning 60% — still net negative", risk: false },
  { msg: "Oversizing after 3-loss streak — GBPJPY", risk: true },
  { msg: "Kill zone compliance: 22% — EURUSD", risk: false },
  { msg: "Profit factor 0.71 — XAUUSD", risk: true },
  { msg: "Streak tilt: position size +340%", risk: true },
];

export default function HeroSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(5);
  const [slippage, setSlippage] = useState(1.25);
  const [commission, setCommission] = useState(7.5);

  const leakEstimate = Math.round(
    volume * (slippage * 800 + commission * 150)
  );

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
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "7fr 5fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div>
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
              [SYSTEM AUDIT STAGE: ONLINE]
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
              maxWidth: "520px",
              margin: "0 0 10px",
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
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
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
                if (!loading) {
                  e.currentTarget.style.background = "#b88d1d";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#e5b83c";
                }
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
                e.currentTarget.style.borderColor = "#475569";
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
              color: "#475569",
              letterSpacing: "0.08em",
              marginTop: "24px",
            }}
          >
            MT5 · Binance · Bybit · OKX · Bitget · BingX
          </p>
        </div>

        {/* ── RIGHT COLUMN — Leak Estimator ── */}
        <div
          className="glow-gold"
          style={{
            background: "#0e1626",
            border: "1px solid rgba(229,184,60,0.45)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#e5b83c",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              LEAK ESTIMATOR
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b83c" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>

          {/* Sliders */}
          <div style={{ padding: "20px" }}>
            {/* Volume slider */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  Monthly Trade Volume
                </label>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#e5b83c",
                  fontWeight: 700,
                }}>
                  ${volume}M
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#e5b83c", height: "4px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#475569" }}>$1M</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#475569" }}>$10M</span>
              </div>
            </div>

            {/* Slippage slider */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  Avg Slippage (pips)
                </label>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#e5b83c",
                  fontWeight: 700,
                }}>
                  {slippage.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#e5b83c", height: "4px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#475569" }}>0.5</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#475569" }}>2.0</span>
              </div>
            </div>

            {/* Commission slider */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  Commission per lot ($)
                </label>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#e5b83c",
                  fontWeight: 700,
                }}>
                  ${commission.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={10}
                step={0.5}
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#e5b83c", height: "4px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#475569" }}>$5</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#475569" }}>$10</span>
              </div>
            </div>

            {/* Output */}
            <div style={{
              background: "#050811",
              border: "1px solid rgba(229,184,60,0.2)",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "#94a3b8",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                ESTIMATED MONTHLY LEAKS:
              </p>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "28px",
                fontWeight: 700,
                color: "#e5b83c",
                lineHeight: 1,
              }}>
                ${leakEstimate.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Live feed */}
          <div style={{
            borderTop: "1px solid #1e293b",
            height: "120px",
            overflow: "hidden",
            position: "relative",
          }}>
            <div style={{
              padding: "8px 14px 4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: "#e5b83c",
                letterSpacing: "0.12em",
              }}>
                [LIVE FEED]
              </span>
              <span
                className="pulse-subtle"
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                }}
              />
            </div>
            <div
              className="feed-scroll"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {[...FEED_EVENTS, ...FEED_EVENTS].map((ev, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 14px",
                  }}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    color: "#475569",
                  }}>
                    {ev.msg}
                  </span>
                  {ev.risk && (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "8px",
                      color: "#ef4444",
                      letterSpacing: "0.08em",
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}>
                      [RISK FACTOR: HIGH]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .hero-section-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .feed-scroll {
          animation: feed-up 12s linear infinite;
        }
        @keyframes feed-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
}
