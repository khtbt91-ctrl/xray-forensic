"use client";

import React from "react";
import Link from "next/link";
import Disclaimer from "../../components/Disclaimer";

const MONO = "JetBrains Mono, monospace";

const DIMENSIONS = [
  { label: "HTF Bias", score: 42 },
  { label: "Liquidity", score: 38 },
  { label: "OTE Zone", score: 55 },
  { label: "OB/FVG", score: 48 },
  { label: "Session", score: 31 },
  { label: "Risk", score: 45 },
  { label: "Behavioral", score: 18 },
];

const SESSIONS = [
  { session: "Asian", trades: 42, winRate: "63.8%", pnl: "+$310.80", positive: true },
  { session: "London KZ", trades: 198, winRate: "31.2%", pnl: "-$687.40", positive: false },
  { session: "NY KZ", trades: 170, winRate: "25.9%", pnl: "-$414.45", positive: false },
  { session: "Off-Session", trades: 229, winRate: "50.4%", pnl: "-$2,425.46", positive: false },
];

function barColor(score: number) {
  if (score < 40) return "var(--loss)";
  if (score <= 60) return "var(--warning)";
  return "var(--profit)";
}

function SectionCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "28px 32px", marginBottom: 24 }}>
      <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 20px" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function MetricCell({ label, value, color = "var(--text-primary)" }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 6px" }}>{label}</p>
      <p style={{ fontFamily: MONO, fontSize: 17, color, margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function FlagCard({
  title,
  count,
  color,
  stats,
}: {
  title: string;
  count: string;
  color: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "20px 24px" }}>
      <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color, margin: "0 0 8px" }}>{title}</p>
      <p style={{ fontFamily: MONO, fontSize: 22, color: "var(--text-primary)", margin: "0 0 12px", fontWeight: 500 }}>{count}</p>
      {stats.map((s) => (
        <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)" }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SamplePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Watermark — fixed overlay, pointer-events none */}
      <div
        aria-hidden
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "hidden" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "-30%",
              top: `${i * 12 - 8}%`,
              width: "160%",
              fontFamily: MONO,
              fontSize: 20,
              color: "var(--text-primary)",
              opacity: 0.06,
              transform: "rotate(-30deg)",
              whiteSpace: "nowrap",
              userSelect: "none",
              letterSpacing: "0.04em",
            }}
          >
            SAMPLE — Get your full X-Ray at xray.app &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SAMPLE — Get your full X-Ray at xray.app &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SAMPLE — Get your full X-Ray at xray.app
          </div>
        ))}
      </div>

      {/* Sticky banner */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
            ← X-Ray
          </Link>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--warning)" }}>
            SAMPLE REPORT — Demo Trader — 639 Trades Analyzed
          </span>
        </div>
        <Link href="/new" className="btn btn-primary" style={{ fontSize: 13 }}>
          Get Your Own X-Ray →
        </Link>
      </div>

      {/* Report content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Section 1: Summary */}
        <SectionCard label="Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 24 }}>
            <MetricCell label="Client" value="Demo Trader" />
            <MetricCell label="Period" value="Nov 2025 — May 2026" />
            <MetricCell label="Total Trades" value="639" />
            <MetricCell label="Net P&L" value="-$3,527.31" color="var(--loss)" />
            <MetricCell label="Win Rate" value="37.8%" />
            <MetricCell label="Profit Factor" value="0.32" color="var(--loss)" />
            <MetricCell label="Max Drawdown" value="$4,013.46" color="var(--loss)" />
          </div>
        </SectionCard>

        {/* Section 2: 7 Dimension Scores */}
        <SectionCard label="7 Diagnostic Dimensions">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {DIMENSIONS.map((d) => (
              <div key={d.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-secondary)" }}>{d.label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: barColor(d.score), fontWeight: 500 }}>{d.score}/100</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.score}%`, background: barColor(d.score), borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 3: Behavioral Flags */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 16px" }}>
            Behavioral Flags
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <FlagCard
              title="Revenge Trades"
              count="276 detected"
              color="var(--loss)"
              stats={[
                { label: "Net impact", value: "-$16.86 net" },
                { label: "Win rate", value: "29.1% WR" },
              ]}
            />
            <FlagCard
              title="No Stop Loss"
              count="48 trades"
              color="var(--warning)"
              stats={[{ label: "Total impact", value: "-$4,753.95" }]}
            />
            <FlagCard
              title="Oversized"
              count="12 trades"
              color="var(--profit)"
              stats={[{ label: "Net P&L", value: "+$112.14" }]}
            />
          </div>
        </div>

        {/* Section 4: Session Performance */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden", marginBottom: 48 }}>
          <div style={{ padding: "18px 28px", borderBottom: "1px solid var(--border-subtle)" }}>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
              Session Performance
            </p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Session", "Trades", "Win Rate", "Net P&L"].map((h) => (
                  <th
                    key={h}
                    style={{ padding: "12px 28px", textAlign: "left", fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)", fontWeight: 400 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map((row, i) => (
                <tr key={row.session} style={{ borderBottom: i < SESSIONS.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <td style={{ padding: "14px 28px", fontFamily: MONO, fontSize: 13, color: "var(--text-primary)" }}>{row.session}</td>
                  <td style={{ padding: "14px 28px", fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)" }}>{row.trades}</td>
                  <td style={{ padding: "14px 28px", fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)" }}>{row.winRate}</td>
                  <td style={{ padding: "14px 28px", fontFamily: MONO, fontSize: 13, color: row.positive ? "var(--profit)" : "var(--loss)" }}>{row.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "40px 32px" }}>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 24px" }}>
            This is the free tier. The full forensic audit goes deeper.
          </p>
          <Link href="/new" className="btn btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
            Get Your X-Ray
          </Link>
        </div>
      </div>

      <Disclaimer />
    </main>
  );
}
