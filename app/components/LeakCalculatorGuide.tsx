"use client";

import { useState } from "react";

/**
 * X-Ray Forensic — Leak Calculator + "How to use it" guide.
 * Standalone, interactive, transparent math. Recolored to live tokens.
 * Wire into app/page.tsx (e.g. after PreChallengeSection or before TierCards).
 */

const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";
const GOLD = "#e5b83c";
const LOSS = "#f85149";
const BG = "#050811";
const CARD = "#0e1626";
const BORDER = "#1e293b";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

const LEAKS: Record<string, { label: string; multiple: number; hint: string }> = {
  revenge: { label: "Revenge trading", multiple: 1.8, hint: "Entering again right after a loss to win it back." },
  oversize: { label: "Oversizing after a loss", multiple: 1.7, hint: "Increasing size to recover faster." },
  offsession: { label: "Trading outside kill zones", multiple: 1.5, hint: "Entries outside London/NY hours." },
  movestop: { label: "Moving the stop loss", multiple: 2.0, hint: "Widening the stop on losing trades." },
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
      <div style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
        border: `1px solid ${GOLD}`, color: GOLD, fontFamily: MONO,
        fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
      }}>{n}</div>
      <div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 4, fontFamily: SPACE }}>{title}</div>
        <div style={{ color: MUTED, fontSize: 14, lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  );
}

export default function LeakCalculatorGuide() {
  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(2);
  const [perWeek, setPerWeek] = useState(15);
  const [leak, setLeak] = useState("revenge");
  const [freq, setFreq] = useState(0.3);

  const perTrade = account * (riskPct / 100);
  const leakedPerYear = Math.round(perWeek * 52 * freq);
  const mult = LEAKS[leak].multiple;
  // Extra loss the leak adds vs a clean, break-even trade = (multiple - 1) × risk.
  const annualBleed = Math.round(leakedPerYear * perTrade * (mult - 1));
  const beWith = Math.min(95, Math.round(50 + (mult - 1) * 18));

  const field: React.CSSProperties = {
    width: "100%", background: BG, border: `1px solid ${BORDER}`,
    color: TEXT, fontFamily: MONO, fontSize: 14, padding: "10px 12px", borderRadius: 6,
  };
  const labelS: React.CSSProperties = { display: "block", color: MUTED, fontSize: 12, marginBottom: 6, fontFamily: MONO };

  return (
    <section style={{ maxWidth: 980, margin: "96px auto", padding: "0 20px" }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>
        The Leak Calculator
      </div>
      <h2 style={{ color: TEXT, fontSize: 32, fontWeight: 700, margin: "0 0 10px", fontFamily: SPACE }}>
        See what one bad habit costs you per year — before you upload anything.
      </h2>
      <p style={{ color: MUTED, fontSize: 16, maxWidth: 720, lineHeight: 1.6, marginBottom: 36 }}>
        The Leak Calculator estimates the annual dollar cost of a single recurring behavior using your own
        numbers. It is the free preview of what a full diagnosis quantifies across all seven dimensions.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="leak-grid">
        <div>
          <Step n={1} title="Enter your baseline">
            Average account size, typical risk per trade (%), and trades per week. Don&apos;t know your risk %?
            Use 2% — that&apos;s the failing-trader average.
          </Step>
          <Step n={2} title="Pick the leak">
            Choose the behavior you suspect, then estimate how often it happens (e.g. 3 of every 10 trades).
          </Step>
          <Step n={3} title="Read the verdict">
            You get the estimated <strong style={{ color: TEXT }}>annual bleed</strong> and how far the leak
            pushes your <strong style={{ color: TEXT }}>break-even win rate</strong>. That gap is your edge, leaking out.
          </Step>
          <div style={{ marginTop: 24, padding: 16, background: BG, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
            <div style={{ color: MUTED, fontSize: 11, fontFamily: MONO, marginBottom: 8 }}>THE MATH (no black box)</div>
            <code style={{ color: MUTED, fontSize: 12, fontFamily: MONO, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
{`per-trade risk $ = account × risk%
leaked / year    = trades/wk × 52 × frequency
annual bleed     = leaked/yr × risk$ × (loss_mult − 1)`}
            </code>
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={labelS}>Account ($)</label>
              <input style={field} type="number" value={account} onChange={(e) => setAccount(+e.target.value)} /></div>
            <div><label style={labelS}>Risk / trade (%)</label>
              <input style={field} type="number" value={riskPct} onChange={(e) => setRiskPct(+e.target.value)} /></div>
            <div><label style={labelS}>Trades / week</label>
              <input style={field} type="number" value={perWeek} onChange={(e) => setPerWeek(+e.target.value)} /></div>
            <div><label style={labelS}>Leak frequency</label>
              <select style={field} value={freq} onChange={(e) => setFreq(+e.target.value)}>
                <option value={0.1}>1 in 10</option>
                <option value={0.2}>2 in 10</option>
                <option value={0.3}>3 in 10</option>
                <option value={0.5}>5 in 10</option>
              </select></div>
          </div>
          <label style={labelS}>The leak</label>
          <select style={{ ...field, marginBottom: 6 }} value={leak} onChange={(e) => setLeak(e.target.value)}>
            {Object.entries(LEAKS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 20 }}>{LEAKS[leak].hint}</div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
            <div style={{ color: MUTED, fontSize: 12, fontFamily: MONO }}>ESTIMATED ANNUAL BLEED</div>
            <div style={{ color: LOSS, fontSize: 40, fontWeight: 800, fontFamily: MONO, lineHeight: 1.2 }}>
              −${Math.abs(annualBleed).toLocaleString()}
            </div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 8 }}>
              ~{leakedPerYear} leaked trades/yr · break-even win rate
              <span style={{ color: TEXT }}> 50% → </span><span style={{ color: LOSS }}>{beWith}%</span>
            </div>
            <div style={{ color: MUTED, fontSize: 12, marginTop: 14, fontStyle: "italic" }}>
              Estimate from your inputs, not your real history. Upload your trades for the exact figure across all 7 dimensions.
            </div>
            <a href="/new" style={{
              display: "inline-block", marginTop: 16, background: GOLD, color: "#000",
              fontWeight: 700, padding: "12px 20px", borderRadius: 6, textDecoration: "none", fontSize: 14, fontFamily: SPACE,
            }}>Get the exact number →</a>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .leak-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
