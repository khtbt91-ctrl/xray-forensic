"use client";

import { useState } from "react";

/**
 * X-Ray Forensic — Leak Calculator + "How to use it" guide.
 * Section 5 of the structural redesign (2026-07-12): consolidates the old
 * standalone PainWall section into this one as the worked "here's what this
 * looks like on a real demo account" anchor, plus 3 mono taxonomy chips
 * (Revenge Trading / Size Creep / Cutting Winners Early) lifted verbatim from
 * campaign carousel slide 04 — continues the ad's conversation instead of
 * re-explaining the concept from scratch (Art Director REVISE ruling).
 * Background shade: BASE (first of the 5/6/7 alternation).
 */

const MONO  = "'JetBrains Mono', monospace";
const SPACE = "'Inter', sans-serif";
const GOLD  = "#38BDF8";
const LOSS  = "#f85149";
const BG    = "#0A0E14";
const CARD  = "#131A24";
const BORDER = "#26313F";
const TEXT  = "#E6EDF3";
const MUTED = "#8B98A9";

const LEAKS: Record<string, { label: string; multiple: number; hint: string; penalty: number }> = {
  revenge:    { label: "Revenge trading",            multiple: 1.8, penalty: 1.35, hint: "Entering again right after a loss to win it back."   },
  oversize:   { label: "Oversizing after a loss",    multiple: 1.7, penalty: 1.15, hint: "Increasing size to recover faster."                  },
  offsession: { label: "Trading outside kill zones", multiple: 1.5, penalty: 1.15, hint: "Entries outside London/NY hours."                   },
  movestop:   { label: "Moving the stop loss",       multiple: 2.0, penalty: 1.35, hint: "Widening the stop on losing trades."                },
};

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 5, verticalAlign: 'middle' }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 14, height: 14, borderRadius: '50%',
          border: '1px solid var(--border-subtle)', color: 'var(--text-muted)',
          fontSize: 9, fontFamily: MONO, cursor: 'help', userSelect: 'none', flexShrink: 0,
        }}
      >?</span>
      {show && (
        <span style={{
          position: 'absolute', bottom: '100%', left: '50%',
          transform: 'translateX(-50%)', marginBottom: 6,
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: '8px 12px', fontSize: 11, fontFamily: MONO,
          color: MUTED, whiteSpace: 'normal', width: 220, lineHeight: 1.6,
          zIndex: 100, pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

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
  // ── Inputs ─────────────────────────────────────────────────────────────────
  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(2);
  const [perWeek, setPerWeek] = useState(15);
  const [leak,    setLeak]    = useState("revenge");
  const [freq,    setFreq]    = useState(0.3);
  const [winRate, setWinRate] = useState(50);
  const [rr,      setRr]      = useState(1.5);

  // ── Dollar bleed (original) ────────────────────────────────────────────────
  const perTrade      = account * (riskPct / 100);
  const leakedPerYear = Math.round(perWeek * 52 * freq);
  const mult          = LEAKS[leak].multiple;
  const annualBleed   = Math.round(leakedPerYear * perTrade * (mult - 1));
  const beWith        = Math.min(95, Math.round(50 + (mult - 1) * 18));

  // ── Mathematical edge model ────────────────────────────────────────────────
  const wr      = winRate / 100;
  const penalty = LEAKS[leak].penalty;
  const E_b     = wr * rr - (1 - wr);                   // baseline expected value per trade
  const beta_d  = freq * penalty;                        // behavioral drag coefficient
  const W_d     = wr  * (1 - beta_d * 0.5);             // degraded win rate under leak
  const R_d     = rr  * (1 - beta_d * 0.3);             // degraded reward under leak
  const E_d     = W_d * R_d - (1 - W_d);                // degraded expected value per trade
  const decay   = E_b - E_d;                             // edge lost per trade due to leak
  const edgeRecovery = E_b > 0.001
    ? Math.min(999, Math.round((decay / E_b) * 100))
    : null;

  // ── Shared styles ──────────────────────────────────────────────────────────
  const field: React.CSSProperties = {
    width: "100%", background: BG, border: `1px solid ${BORDER}`,
    color: TEXT, fontFamily: MONO, fontSize: 14, padding: "10px 12px", borderRadius: 6,
  };
  const labelRow: React.CSSProperties = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    color: MUTED, fontSize: 12, marginBottom: 6, fontFamily: MONO,
  };
  const labelS: React.CSSProperties = {
    display: "block", color: MUTED, fontSize: 12, marginBottom: 6, fontFamily: MONO,
  };

  return (
    <section style={{ maxWidth: 980, margin: "96px auto", padding: "0 20px", background: BG }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>
        The Leak Calculator
      </div>
      <h2 style={{ color: TEXT, fontSize: 32, fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)" }}>
        See what one bad habit costs you per year — before you upload anything.
      </h2>
      <p style={{ color: MUTED, fontSize: 16, maxWidth: 720, lineHeight: 1.6, marginBottom: 20 }}>
        The Leak Calculator estimates the annual dollar cost of a single recurring behavior using your own
        numbers. It is the free preview of what a full diagnosis quantifies across all seven dimensions.
      </p>

      {/* Worked demo-account anchor — consolidated from the old standalone PainWall section */}
      <div style={{
        background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${LOSS}`,
        borderRadius: 8, padding: "20px 24px", marginBottom: 32,
      }}>
        <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, margin: "0 0 12px" }}>
          FROM A DEMO ACCOUNT EXPORT
        </p>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 800, color: LOSS }}>-$4,753</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Lost to trades with no stop loss</div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 800, color: "#f59e0b" }}>276</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Revenge trades. Same mistake, 276 times.</div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 800, color: GOLD }}>29</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Longest losing streak. Exposed.</div>
          </div>
        </div>
      </div>

      {/* Taxonomy chips — verbatim from campaign carousel slide 04, continuing the same conversation */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        {["REVENGE TRADING", "SIZE CREEP", "CUTTING WINNERS EARLY"].map((chip) => (
          <span key={chip} style={{
            fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: GOLD,
            border: `1px solid ${GOLD}`, borderRadius: 100, padding: "5px 12px",
          }}>
            {chip}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="leak-grid">

        {/* ── Left: instructions ─────────────────────────────────────────── */}
        <div>
          <Step n={1} title="Enter your baseline">
            Average account size, typical risk per trade (%), and trades per week. Don&apos;t know your risk %?
            Use 2% — that&apos;s the failing-trader average.
          </Step>
          <Step n={2} title="Pick the leak">
            Choose the behavior you suspect, then estimate how often it happens (e.g. 3 of every 10 trades).
          </Step>
          <Step n={3} title="Set your edge parameters">
            Enter your baseline win rate and target R:R. The model uses these to calculate what your
            mathematical edge looks like — and how much the leak destroys it.
          </Step>
          <Step n={4} title="Read the verdict">
            You get the estimated <strong style={{ color: TEXT }}>annual dollar bleed</strong>, the{" "}
            <strong style={{ color: TEXT }}>expected edge</strong> you start with, the{" "}
            <strong style={{ color: TEXT }}>behavioral decay</strong> the leak inflicts per trade, and how
            much edge you recover by eliminating it.
          </Step>
          <div style={{ marginTop: 24, padding: 16, background: BG, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
            <div style={{ color: MUTED, fontSize: 11, fontFamily: MONO, marginBottom: 8 }}>THE MATH (no black box)</div>
            <code style={{ color: MUTED, fontSize: 12, fontFamily: MONO, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
{`per-trade risk $  = account × risk%
leaked / year     = trades/wk × 52 × frequency
annual bleed      = leaked/yr × risk$ × (mult − 1)

E_b  = (wr × R:R) − (1 − wr)
β    = frequency × penalty
W_d  = wr × (1 − β × 0.5)
R_d  = R:R × (1 − β × 0.3)
E_d  = W_d × R_d − (1 − W_d)
decay = E_b − E_d`}
            </code>
          </div>
        </div>

        {/* ── Right: calculator card ──────────────────────────────────────── */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>

          {/* Account / risk / trades / frequency */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label htmlFor="calc-account" style={labelS}>Account ($) <Tooltip text="Your average trading account size in USD. Use your current balance." /></label>
              <input id="calc-account" style={field} type="number" value={account} onChange={(e) => setAccount(+e.target.value)} />
            </div>
            <div>
              <label htmlFor="calc-risk-pct" style={labelS}>Risk / trade (%) <Tooltip text="The percentage of your account you risk on each trade. Most retail traders use 1-3%. The failing trader average is 2%." /></label>
              <input id="calc-risk-pct" style={field} type="number" value={riskPct} onChange={(e) => setRiskPct(+e.target.value)} />
            </div>
            <div>
              <label htmlFor="calc-per-week" style={labelS}>Trades / week <Tooltip text="How many trades you typically open per week across all sessions." /></label>
              <input id="calc-per-week" style={field} type="number" value={perWeek} onChange={(e) => setPerWeek(+e.target.value)} />
            </div>
            <div>
              <label htmlFor="calc-freq" style={labelS}>Leak frequency <Tooltip text="How often this behavior happens. '3 in 10' means it occurs in 30% of your trades — 3 out of every 10 positions." /></label>
              <select id="calc-freq" style={field} value={freq} onChange={(e) => setFreq(+e.target.value)}>
                <option value={0.1}>1 in 10</option>
                <option value={0.2}>2 in 10</option>
                <option value={0.3}>3 in 10</option>
                <option value={0.5}>5 in 10</option>
              </select>
            </div>
          </div>

          {/* Leak type */}
          <label htmlFor="calc-leak" style={labelS}>The leak <Tooltip text="The specific behavioral pattern you want to measure. Each has a different loss multiplier and behavioral penalty coefficient." /></label>
          <select id="calc-leak" style={{ ...field, marginBottom: 6 }} value={leak} onChange={(e) => setLeak(e.target.value)}>
            {Object.entries(LEAKS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 20 }}>{LEAKS[leak].hint}</div>

          {/* Win Rate slider */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelRow}>
              <label htmlFor="calc-win-rate">Win Rate (%) <Tooltip text="Your baseline win rate when trading without behavioral leaks." /></label>
              <span style={{ color: TEXT, fontWeight: 700 }}>{winRate}%</span>
            </div>
            <input
              id="calc-win-rate"
              type="range" min={30} max={70} step={1}
              value={winRate} onChange={(e) => setWinRate(+e.target.value)}
              className="calc-slider"
              style={{ width: "100%" }}
              aria-valuetext={`${winRate}%`}
            />
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: 10, fontFamily: MONO, marginTop: 3 }}>
              <span>30%</span>
              <span style={{ color: "var(--text-muted)" }}>Your baseline win rate</span>
              <span>70%</span>
            </div>
          </div>

          {/* R:R slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={labelRow}>
              <label htmlFor="calc-rr">Target R:R <Tooltip text="Your intended reward-to-risk ratio when the trade goes to plan." /></label>
              <span style={{ color: TEXT, fontWeight: 700 }}>{rr.toFixed(1)}</span>
            </div>
            <input
              id="calc-rr"
              type="range" min={0.5} max={3.0} step={0.1}
              value={rr} onChange={(e) => setRr(+e.target.value)}
              className="calc-slider"
              style={{ width: "100%" }}
              aria-valuetext={rr.toFixed(1)}
            />
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: 10, fontFamily: MONO, marginTop: 3 }}>
              <span>0.5</span>
              <span style={{ color: "var(--text-muted)" }}>Your target R:R ratio</span>
              <span>3.0</span>
            </div>
          </div>

          {/* ── Output ─────────────────────────────────────────────────────── */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>

            {/* Annual bleed */}
            <div style={{ color: MUTED, fontSize: 12, fontFamily: MONO }}>
              ESTIMATED ANNUAL BLEED{" "}
              <Tooltip text="The estimated extra money this single behavior costs you per year, on top of what you would lose with clean execution." />
            </div>
            <div style={{ color: LOSS, fontSize: 40, fontWeight: 800, fontFamily: MONO, lineHeight: 1.2 }}>
              −${Math.abs(annualBleed).toLocaleString()}
            </div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 8 }}>
              ~{leakedPerYear} leaked trades/yr · break-even win rate{" "}
              <Tooltip text="The win rate you now need just to break even, because the leak increases your average loss size. Higher = harder to be profitable." />
              <span style={{ color: TEXT }}> 50% → </span>
              <span style={{ color: LOSS }}>{beWith}%</span>
            </div>

            {/* OUTPUT 1 — Mathematical edge model */}
            <div style={{
              marginTop: 18,
              padding: "14px 16px",
              background: BG,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: "0 8px 8px 0",
            }}>
              <div style={{
                color: "var(--text-muted)", fontSize: 10, fontFamily: MONO,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12,
              }}>
                SHARPE RATIO IMPACT
              </div>
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                <div>
                  <div style={{
                    color: "var(--text-muted)", fontSize: 10, fontFamily: MONO,
                    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4,
                  }}>
                    EXPECTED EDGE
                  </div>
                  <div style={{ color: GOLD, fontSize: 20, fontWeight: 700, fontFamily: MONO }}>
                    {E_b >= 0 ? "+" : ""}{E_b.toFixed(2)}
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}> per trade</span>
                  </div>
                </div>
                <div>
                  <div style={{
                    color: "var(--text-muted)", fontSize: 10, fontFamily: MONO,
                    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4,
                  }}>
                    BEHAVIORAL DECAY
                  </div>
                  <div style={{ color: GOLD, fontSize: 20, fontWeight: 700, fontFamily: MONO }}>
                    -{decay.toFixed(2)}
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}> per trade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* OUTPUT 2 — Edge recovery */}
            {edgeRecovery !== null && (
              <div style={{ color: MUTED, fontSize: 13, fontFamily: MONO, marginTop: 12, lineHeight: 1.6 }}>
                Fixing this behavior recovers{" "}
                <span style={{ color: TEXT, fontWeight: 700 }}>{edgeRecovery}%</span>{" "}
                of your hidden mathematical edge.
              </div>
            )}

            {/* Disclaimer */}
            <div style={{
              color: "var(--text-muted)", fontSize: 11, fontFamily: MONO,
              marginTop: 12, lineHeight: 1.6, fontStyle: "italic",
            }}>
              Mathematical model based on your inputs. Not a guarantee of trading performance.
            </div>

            <div style={{ color: MUTED, fontSize: 12, marginTop: 14, fontStyle: "italic" }}>
              Estimate from your inputs, not your real history. Upload your trades for the exact figure across all 7 dimensions.
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: MONO, marginTop: 14, lineHeight: 1.6 }}>
              This is one behavior estimated from your inputs. X-Ray finds all 7 leaks in your actual trade history — with exact dollar amounts from real data.
            </div>
            <a href="/new" style={{
              display: "inline-block", marginTop: 16, background: GOLD, color: "var(--bg)",
              fontWeight: 700, padding: "12px 20px", borderRadius: 6,
              textDecoration: "none", fontSize: 14, fontFamily: SPACE,
            }}>
              Diagnose All 7 Leaks Free →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .leak-grid { grid-template-columns: 1fr !important; display: flex !important; flex-direction: column !important; }
          .leak-grid > div:first-child { order: 2; }
          .leak-grid > div:last-child { order: 1; }
        }
        .calc-slider {
          -webkit-appearance: none; appearance: none;
          height: 4px; background: #26313F; border-radius: 2px;
          outline: none; cursor: pointer;
        }
        .calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 14px; height: 14px; border-radius: 50%;
          background: #38BDF8; cursor: pointer;
          border: 2px solid #131A24;
          box-shadow: 0 0 6px rgba(56, 189, 248,0.5);
        }
        .calc-slider::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%;
          background: #38BDF8; cursor: pointer;
          border: 2px solid #131A24;
          box-shadow: 0 0 6px rgba(56, 189, 248,0.5);
        }
        .calc-slider::-webkit-slider-runnable-track {
          background: #26313F; border-radius: 2px;
        }
      `}</style>
    </section>
  );
}
