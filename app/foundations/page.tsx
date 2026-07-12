"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";

// ── Design tokens ────────────────────────────────────────────────────────────
const GOLD    = "#e5b83c";
const BG      = "#050811";
const CARD    = "#0e1626";
const BORDER  = "#1e293b";
const MONO    = "var(--font-mono)";
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY    = "var(--font-sans)";

// ── Smooth-scroll helper (offsets for sticky nav) ────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

// ── Chevron icon ─────────────────────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }}
    >
      <polyline points="3,6 8,11 13,6" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Generic accordion card ────────────────────────────────────────────────────
function AccordionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, background: open ? "#111827" : CARD, border: "none", cursor: "pointer",
          padding: "14px 18px", textAlign: "left", transition: "background 0.2s",
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: "#f8fafc", lineHeight: 1.4 }}>
          {title}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div style={{ background: "#0a1120", borderTop: `1px solid ${BORDER}`, padding: "16px 18px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Section-1 accordion card (PLAIN / DEEPER / WHY / X-RAY tag) ──────────────
function MechanicsCard({
  title, plain, deeper, why, xray,
}: { title: string; plain: string; deeper: string; why: string; xray: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, background: open ? "#111827" : CARD, border: "none", cursor: "pointer",
          padding: "14px 18px", textAlign: "left", transition: "background 0.2s",
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: "#f8fafc", lineHeight: 1.4 }}>
          {title}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div style={{ background: "#0a1120", borderTop: `1px solid ${BORDER}`, padding: "18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <p style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
              PLAIN VERSION
            </p>
            <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>{plain}</p>
          </div>
          <div>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
              DEEPER
            </p>
            <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{deeper}</p>
          </div>
          <div>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "#ef4444", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
              WHY IT COSTS YOU MONEY
            </p>
            <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{why}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
              X-RAY SCORES THIS AS:
            </p>
            <span style={{
              fontFamily: MONO, fontSize: 10, color: GOLD, background: "rgba(229,184,60,0.1)",
              border: `1px solid rgba(229,184,60,0.3)`, borderRadius: 4, padding: "2px 8px",
              letterSpacing: "0.06em",
            }}>
              {xray}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Setup card ────────────────────────────────────────────────────────────────
function SetupCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
      borderRadius: "0 6px 6px 0", padding: "20px 22px",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em" }}>{number}</span>
        <span style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────────────
function TimelineItem({ week, heading, body }: { week: string; heading: string; body: string }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* Left: dot + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%", background: GOLD,
          border: `2px solid ${GOLD}`, flexShrink: 0, marginTop: 4,
          boxShadow: `0 0 8px rgba(229,184,60,0.4)`,
        }} />
        <div style={{ flex: 1, width: 1, background: BORDER, marginTop: 6 }} />
      </div>
      {/* Right: content */}
      <div style={{ paddingBottom: 32 }}>
        <p style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>
          {week}
        </p>
        <p style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, color: "#f8fafc", margin: "0 0 8px" }}>
          {heading}
        </p>
        <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

// ── Glossary term ─────────────────────────────────────────────────────────────
function GlossaryEntry({ term, def }: { term: string; def: string }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: `1px solid rgba(30,41,59,0.6)` }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, color: GOLD }}>{term}</span>
      <span style={{ fontFamily: BODY, fontSize: 14, color: "#94a3b8", marginLeft: 8 }}>— {def}</span>
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
      {text}
    </p>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function FoundationsPage() {
  const anchorPills = [
    { label: "THE ABSOLUTE BASICS", id: "basics" },
    { label: "HOW PRICE MOVES",     id: "how-price-moves" },
    { label: "YOUR FIRST SETUPS",   id: "first-setups" },
    { label: "THE 30-DAY PATH",     id: "path" },
    { label: "GLOSSARY",            id: "glossary" },
  ];

  return (
    <main className="circuit-overlay" style={{ minHeight: "100vh", background: BG, color: "#f8fafc" }}>
      <NavBar />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 0" }}>

        {/* ══════════════════════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{ paddingTop: 60, paddingBottom: 56, borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ fontFamily: MONO, fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 18px" }}>
            FIELD MANUAL
          </p>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 16px", lineHeight: 1.15 }}>
            Never traded before? Read this first.
          </h1>
          <p style={{ fontFamily: BODY, fontSize: 16, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 620 }}>
            We assume you know nothing. Every term is explained before it is used. Read it in order — each section builds on the one before. By the end you will understand your own X-Ray report.
          </p>

          {/* Anchor pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {anchorPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => scrollTo(pill.id)}
                style={{
                  fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: GOLD, background: "rgba(229,184,60,0.06)", border: `1px solid rgba(229,184,60,0.35)`,
                  borderRadius: 4, padding: "6px 12px", cursor: "pointer", transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(229,184,60,0.14)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(229,184,60,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(229,184,60,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 0 — THE ABSOLUTE BASICS
        ══════════════════════════════════════════════════════════════════════ */}
        <section id="basics" style={{ padding: "64px 0 48px" }}>
          <SectionLabel text="00 · THE ABSOLUTE BASICS" />
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 12px" }}>
            Start here. Truly here.
          </h2>
          <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 640 }}>
            If you already know what a pip and a stop loss are, skip to the next section. If not, this is the most important part.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AccordionCard title="WHAT TRADING ACTUALLY IS">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                You are buying something hoping its price goes up, or betting it goes down. In forex and gold trading you are trading one currency or asset against another — for example XAUUSD means Gold priced in US Dollars. If you think gold will rise, you &ldquo;buy&rdquo; (go long). If you think it will fall, you &ldquo;sell&rdquo; (go short). Profit is the difference between where you got in and where you got out.
              </p>
            </AccordionCard>

            <AccordionCard title="LONG vs SHORT">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                Long = you bought, you profit if price goes UP.<br />
                Short = you sold first, you profit if price goes DOWN.<br /><br />
                Yes, you can make money when price falls. That is the one thing that confuses every beginner. You are not required to own the thing to sell it in trading.
              </p>
            </AccordionCard>

            <AccordionCard title="WHAT IS A PIP">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                A pip is the smallest standard unit of price movement. On most forex pairs it is the 4th decimal place. On gold (XAUUSD) traders usually count it as a $1 move. When someone says &ldquo;I made 50 pips&rdquo; they mean price moved 50 of these units in their favor. It is just a way to measure distance on a price chart.
              </p>
            </AccordionCard>

            <AccordionCard title="WHAT IS A LOT (POSITION SIZE)">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                A lot is how much you are trading. A bigger lot means each pip of movement is worth more money — more profit if right, more loss if wrong. Beginners blow accounts by trading lots too big for their account. Position size is the single biggest controllable risk. Start small. Smaller than feels exciting.
              </p>
            </AccordionCard>

            <AccordionCard title="STOP LOSS — THE MOST IMPORTANT TOOL">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                A stop loss is an automatic exit you set BEFORE entering. It closes your trade at a price you choose if it goes against you, capping your loss. Without one, a single bad trade can erase weeks of gains — or the whole account. A trade without a stop loss is not a trade. It is a gamble with no limit. X-Ray will flag every trade you took without one.
              </p>
            </AccordionCard>

            <AccordionCard title="TAKE PROFIT — LOCKING IN THE WIN">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                The opposite of a stop loss. An automatic exit you set at a price where you will be happy to take your profit. It removes the emotion of deciding when to get out while you are winning — which is when emotion is most dangerous.
              </p>
            </AccordionCard>

            <AccordionCard title="RISK-TO-REWARD — THE MATH THAT MATTERS">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                If you risk $100 to make $200, that is a 1-to-2 risk-to-reward (written 1:2). The beautiful part: at 1:2 you can be WRONG more than half the time and still make money. Most beginners obsess over being right. Profitable traders obsess over risk-to-reward. The math does not care about your feelings.
              </p>
            </AccordionCard>

            <AccordionCard title="WHY MOST BEGINNERS LOSE">
              <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                Not because they pick the wrong direction — many win more than half their trades and still lose money. They lose because: position sizes too big, no stop loss, revenge trading after a loss, and trading at random times. Every one of these is fixable. That is the entire point of X-Ray — it shows you which of these is bleeding you, in dollars.
              </p>
            </AccordionCard>
          </div>
        </section>

        <div style={{ height: 1, background: BORDER }} />

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1 — HOW PRICE MOVES
        ══════════════════════════════════════════════════════════════════════ */}
        <section id="how-price-moves" style={{ padding: "64px 0 48px" }}>
          <SectionLabel text="01 · HOW PRICE MOVES" />
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 12px" }}>
            Now the part that separates pros from the crowd.
          </h2>
          <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 640 }}>
            These are the concepts X-Ray scores you on. Each one now assumes you understood Section 0. Take them slowly.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MechanicsCard
              title="LIQUIDITY (the stop-loss hunt)"
              plain="Big players push price to where lots of stop losses sit, trigger them, then move the real direction."
              deeper="Stops cluster just above recent highs and below recent lows. Institutions need those orders to fill their large positions, so price is driven there first — the 'sweep' — before the actual move."
              why="Your stop is probably sitting exactly where they are hunting. You get stopped out, then watch price go where you thought."
              xray="Liquidity Awareness"
            />
            <MechanicsCard
              title="ORDER BLOCKS"
              plain="The exact candle where big money entered — price often comes back to it."
              deeper="The last opposing candle before a strong move marks where large orders originated. Price frequently returns to 'fill' remaining orders before continuing."
              why="Entering mid-move means bad prices. Waiting for the return to the order block means better risk-to-reward."
              xray="OB/FVG Confluence"
            />
            <MechanicsCard
              title="FAIR VALUE GAPS"
              plain="When price moves too fast it leaves a gap, and it usually comes back to fill it."
              deeper="A fast move leaves an imbalance — an unfilled range between candles. It acts like a magnet; price often returns to rebalance before continuing."
              why="Chasing the fast move gets you the worst entry. The gap fill is the second chance at a good one."
              xray="OB/FVG Confluence"
            />
            <MechanicsCard
              title="MARKET STRUCTURE (trend direction)"
              plain="Higher highs = uptrend. Lower lows = downtrend. When that breaks, control is shifting."
              deeper="Break of Structure (BOS) confirms the trend continues. Change of Character (CHoCH) is the first sign it may be reversing. Reading these tells you who is in control right now."
              why="Trading against the higher-timeframe trend is the most common beginner mistake. It feels smart. It is expensive."
              xray="HTF Bias Alignment"
            />
            <MechanicsCard
              title="SESSIONS / KILL ZONES (timing)"
              plain="The market only really moves at certain hours. Trade then, not at random."
              deeper="London open (07:00–10:00 UTC) and New York open (13:00–16:00 UTC) are when the big institutional volume hits. The Asian session is usually quiet and range-bound."
              why="Trading outside these windows is trading when the big players are asleep — thin moves, traps, and the single biggest leak X-Ray finds in most accounts."
              xray="Session Discipline"
            />
            <MechanicsCard
              title="THE OPTIMAL ENTRY (OTE)"
              plain="After a move, wait for price to pull back about 70% before entering — better price, tighter risk."
              deeper="The 0.705–0.79 Fibonacci retracement zone of an impulse move offers the best risk-to-reward entry. (We define Fibonacci in the glossary — for now, just 'a measured pullback level.')"
              why="Entering at the start of a pullback means a wide stop. Waiting for the OTE zone means a tight stop and a bigger reward."
              xray="OTE Discipline"
            />
            <MechanicsCard
              title="RISK ARCHITECTURE"
              plain="How much you bet per trade matters more than where you enter."
              deeper="Risking 1% per trade survives a 10-loss streak with 90% of your account intact. Risking 5% does not survive it. Combine with 1:2 risk-to-reward and the math carries you even with a sub-50% win rate."
              why="This is the difference between a rough month and a blown account."
              xray="Risk Architecture"
            />
            <MechanicsCard
              title="BEHAVIORAL CONTROL"
              plain="The biggest leak is not your strategy. It is you after a loss."
              deeper="Revenge trading, oversizing after a win, moving your stop, overtrading out of boredom. These are psychology, not analysis. They are the most expensive mistakes and the most fixable."
              why="X-Ray data shows behavioral leaks cost more than bad entries — by a wide margin."
              xray="Behavioral Control"
            />
          </div>
        </section>

        <div style={{ height: 1, background: BORDER }} />

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 2 — YOUR FIRST SETUPS
        ══════════════════════════════════════════════════════════════════════ */}
        <section id="first-setups" style={{ padding: "64px 0 48px" }}>
          <SectionLabel text="02 · YOUR FIRST SETUPS" />
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 12px" }}>
            Three things you can actually try.
          </h2>
          <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 640 }}>
            On a DEMO account first — fake money, real practice. Never risk real money learning. Each setup tells you exactly when, where in, where out.
          </p>

          {/* Demo account callout */}
          <div style={{
            background: "rgba(229,184,60,0.05)", border: `1px solid rgba(229,184,60,0.3)`,
            borderRadius: 6, padding: "16px 20px", marginBottom: 28,
          }}>
            <p style={{ fontFamily: BODY, fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: GOLD }}>WHAT IS A DEMO ACCOUNT?</span>{" "}
              Every broker offers a free practice account with fake money that moves on real prices. You place real trades with zero financial risk. Use it until you are consistently disciplined — not just lucky.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SetupCard number="SETUP 01" title="THE LIQUIDITY SWEEP REVERSAL">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SetupRow label="When" value="London open, 07:00–10:00 UTC" />
                <SetupRow label="The idea" value="Wait for price to spike past the Asian session high or low (the 'sweep' — grabbing stops), then reverse." />
                <SetupRow label="Get in" value="After the spike, when price turns back and breaks a small structure the other way." />
                <SetupRow label="Stop loss" value="Just beyond the spike's tip." />
                <SetupRow label="Take profit" value="The opposite side of the range (aim for at least 1:2 risk-to-reward)." />
                <div style={{ marginTop: 4, padding: "10px 14px", background: "rgba(229,184,60,0.05)", borderRadius: 4, borderLeft: `2px solid ${GOLD}` }}>
                  <p style={{ fontFamily: BODY, fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                    <span style={{ color: GOLD, fontWeight: 600 }}>Why it works:</span> You enter AFTER the stop hunt, going the real direction instead of being the one who got hunted.
                  </p>
                </div>
              </div>
            </SetupCard>

            <SetupCard number="SETUP 02" title="THE ORDER BLOCK RETEST">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SetupRow label="When" value="New York open, 13:00–16:00 UTC" />
                <SetupRow label="The idea" value="Find the candle that launched a strong move (the order block). Wait for price to come back to it." />
                <SetupRow label="Get in" value="When price returns to that candle and shows rejection (a long wick, or a strong opposite candle)." />
                <SetupRow label="Stop loss" value="Just beyond the far edge of that candle." />
                <SetupRow label="Take profit" value="The recent high or low (aim 1:2 minimum)." />
                <div style={{ marginTop: 4, padding: "10px 14px", background: "rgba(229,184,60,0.05)", borderRadius: 4, borderLeft: `2px solid ${GOLD}` }}>
                  <p style={{ fontFamily: BODY, fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                    <span style={{ color: GOLD, fontWeight: 600 }}>Why it works:</span> You enter where big money entered, at a good price, not chasing.
                  </p>
                </div>
              </div>
            </SetupCard>

            <SetupCard number="SETUP 03" title="THE DISCIPLINE BASELINE (the most important)">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                  This is not a pattern. It is a rule.
                </p>
                <p style={{ fontFamily: BODY, fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                  Take ZERO trades outside London and New York hours for two full weeks. None. No exceptions.
                </p>
                <div style={{ marginTop: 4, padding: "10px 14px", background: "rgba(229,184,60,0.05)", borderRadius: 4, borderLeft: `2px solid ${GOLD}` }}>
                  <p style={{ fontFamily: BODY, fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                    <span style={{ color: GOLD, fontWeight: 600 }}>Why it works:</span> For most struggling traders, simply removing off-hours trades flips the account from losing to winning without changing anything else. Before you optimize entries, stop the biggest bleed: trading when you should not be.
                  </p>
                </div>
              </div>
            </SetupCard>
          </div>

          <p style={{ fontFamily: BODY, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: "24px 0 0" }}>
            These are starting points, not promises. Practice on demo, then upload your results to X-Ray to see which fits how you actually behave.{" "}
            <Link href="/new" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>
              Run a free diagnosis →
            </Link>
          </p>
        </section>

        <div style={{ height: 1, background: BORDER }} />

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 3 — THE 30-DAY PATH
        ══════════════════════════════════════════════════════════════════════ */}
        <section id="path" style={{ padding: "64px 0 48px" }}>
          <SectionLabel text="03 · THE 30-DAY PATH" />
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 40px" }}>
            A month that builds a real foundation.
          </h2>

          <div style={{ paddingLeft: 8 }}>
            <TimelineItem
              week="WEEK 1 — WATCH, DO NOT TRADE"
              heading="Train your eyes before your hands."
              body="Zero trades, even demo. Open a chart of XAUUSD. Watch the London and New York opens live. Mark the recent highs and lows. Watch how price spikes past them then reverses. You are training your eyes. This week is free and the most skipped — do not skip it."
            />
            <TimelineItem
              week="WEEK 2 — DEMO ONLY"
              heading="Execute correctly, not profitably."
              body="Open a free demo account. Run Setup 1 or 2. Stop loss on every single trade. Maximum 2 trades per day. Goal is not profit — it is doing it correctly, repeatedly."
            />
            <TimelineItem
              week="WEEK 3 — GET YOUR FIRST DIAGNOSIS"
              heading="Measure what you actually did."
              body="Export your demo trade history. Upload it to X-Ray. Get your first forensic verdict and your 7-dimension scores. Now you have a baseline and your first prescription — a specific thing to fix."
            />
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%", background: GOLD,
                  border: `2px solid ${GOLD}`, flexShrink: 0, marginTop: 4,
                  boxShadow: `0 0 8px rgba(229,184,60,0.4)`,
                }} />
              </div>
              <div style={{ paddingBottom: 8 }}>
                <p style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>
                  WEEK 4 — FIX ONE THING
                </p>
                <p style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, color: "#f8fafc", margin: "0 0 8px" }}>
                  Apply the prescription.
                </p>
                <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 12px" }}>
                  Apply your single top prescription. Trade only your best session. Upload again at week&rsquo;s end. Compare the two reports. Did the number move? This loop — trade, diagnose, fix, repeat — is how real traders are built. Not by reading. By measuring.
                </p>
                <Link
                  href="/new"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontFamily: MONO, fontSize: 11, color: GOLD,
                    textDecoration: "none", letterSpacing: "0.06em",
                    border: `1px solid rgba(229,184,60,0.35)`, borderRadius: 4,
                    padding: "6px 12px", background: "rgba(229,184,60,0.06)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(229,184,60,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(229,184,60,0.06)"; }}
                >
                  Run your first diagnosis →
                </Link>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 32, padding: "20px 24px",
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6,
          }}>
            <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              After 30 days you will not be an expert. You will be something rarer: a beginner who measures instead of guesses. That is the whole game.
            </p>
          </div>
        </section>

        <div style={{ height: 1, background: BORDER }} />

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 4 — GLOSSARY
        ══════════════════════════════════════════════════════════════════════ */}
        <section id="glossary" style={{ padding: "64px 0 48px" }}>
          <SectionLabel text="04 · GLOSSARY" />
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 10px" }}>
            Every term, defined plainly.
          </h2>
          <p style={{ fontFamily: BODY, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 600 }}>
            When your report or this page uses a word you do not know, it is here.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "0 40px",
          }}>
            <div>
              <GlossaryEntry term="Long" def="A trade that profits if price goes up." />
              <GlossaryEntry term="Short" def="A trade that profits if price goes down." />
              <GlossaryEntry term="Pip" def="The smallest standard unit of price movement." />
              <GlossaryEntry term="Lot" def="How big your trade is; bigger lot = more money per pip." />
              <GlossaryEntry term="Stop Loss" def="Automatic exit that caps your loss if wrong." />
              <GlossaryEntry term="Take Profit" def="Automatic exit that locks in your gain." />
              <GlossaryEntry term="Risk-to-Reward (RR)" def="How much you risk vs how much you aim to make; 1:2 means risk 1 to make 2." />
              <GlossaryEntry term="Drawdown" def="How much your account has dropped from its peak." />
              <GlossaryEntry term="Demo Account" def="Free practice account with fake money on real prices." />
              <GlossaryEntry term="Spread" def="The small built-in cost of every trade." />
              <GlossaryEntry term="Profit Factor" def="Total wins divided by total losses; above 1.0 means profitable." />
              <GlossaryEntry term="SMC (Smart Money Concepts)" def="A trading approach focused on how big institutions move price." />
              <GlossaryEntry term="ICT (Inner Circle Trader)" def="The name associated with popularizing many of these concepts." />
            </div>
            <div>
              <GlossaryEntry term="Liquidity" def="Clusters of orders (often stop losses) that big players target." />
              <GlossaryEntry term="Liquidity Sweep" def="When price spikes to grab those orders then reverses." />
              <GlossaryEntry term="BSL / SSL" def="Buy-Side / Sell-Side Liquidity; pools of orders above highs / below lows." />
              <GlossaryEntry term="Order Block" def="The candle where big money entered before a strong move." />
              <GlossaryEntry term="Fair Value Gap (FVG)" def="A price gap left by a fast move that often gets filled." />
              <GlossaryEntry term="BOS" def="Break of Structure; confirms the trend continues." />
              <GlossaryEntry term="CHoCH" def="Change of Character; first sign of a possible reversal." />
              <GlossaryEntry term="OTE" def="Optimal Trade Entry; the ~70% pullback zone for entries." />
              <GlossaryEntry term="Fibonacci" def="A tool that measures pullback levels as percentages of a move." />
              <GlossaryEntry term="HTF / LTF" def="Higher / Lower Time Frame (e.g. daily vs 15-min)." />
              <GlossaryEntry term="Kill Zone" def="The high-activity session windows (London / NY open)." />
              <GlossaryEntry term="Session" def="A trading period: London, New York, or Asian." />
              <GlossaryEntry term="Displacement" def="A strong, fast price move showing intent." />
              <GlossaryEntry term="Imbalance" def="Another word for a fair value gap." />
              <GlossaryEntry term="Confluence" def="Multiple reasons lining up at one price level." />
              <GlossaryEntry term="Revenge Trade" def="An emotional trade taken to 'win back' a loss." />
            </div>
          </div>
        </section>

        <div style={{ height: 1, background: BORDER }} />

        {/* ══════════════════════════════════════════════════════════════════════
            BOTTOM CTA
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "64px 0 80px" }}>
          <div style={{
            background: CARD, border: `1px solid rgba(229,184,60,0.35)`,
            borderRadius: 8, padding: "40px 40px",
            boxShadow: "0 0 40px rgba(229,184,60,0.08)",
          }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 700, color: "#f8fafc", margin: "0 0 12px" }}>
              Ready to see your own numbers?
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 16, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 500 }}>
              Reading about mistakes is theory. Seeing yours, in dollars, is the work. Your first diagnosis is free.
            </p>
            <Link
              href="/new"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: DISPLAY, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.04em",
                background: GOLD, color: "#000", border: "none", borderRadius: 4,
                padding: "12px 24px", textDecoration: "none",
                transition: "box-shadow 0.2s, transform 0.15s",
                boxShadow: "0 0 20px rgba(229,184,60,0.25)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(229,184,60,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(229,184,60,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Run Your First Diagnosis →
            </Link>
          </div>
        </section>

      </div>{/* /max-width container */}

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, background: BG }}>
        <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div className="footer-grid">
            <div>
              <p style={{ fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 700, color: "#f8fafc", letterSpacing: "0.04em", margin: "0 0 4px" }}>
                X-RAY FORENSIC
              </p>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 14px" }}>
                FORENSIC TRADE DIAGNOSTIC
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                Built on 15 years of institutional trading.<br />
                Not financial advice. Diagnostic analysis only.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                PLATFORM
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/#how-it-works" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>How It Works</Link>
                <Link href="/#pricing"      style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Pricing</Link>
                <Link href="/foundations"   style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Foundations</Link>
                <Link href="/new"           style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Get Diagnosed</Link>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                LEGAL
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/about"   style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>About</Link>
                <Link href="/privacy" style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link>
                <Link href="/terms"   style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, paddingBottom: 24, textAlign: "center" }}>
            <p style={{ fontFamily: MONO, fontSize: "9px", color: "#10b981", letterSpacing: "0.12em", marginBottom: "8px" }}>
              [SYSTEM STATUS: ONLINE]
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--text-muted)", margin: "0 0 8px" }}>
              For prop firms and institutional desks:{" "}
              <a href="mailto:admin@xrayforensic.com" style={{ color: GOLD, textDecoration: "none" }}>
                admin@xrayforensic.com
              </a>
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>
              &copy; 2026 X-Ray Forensic &middot; Not financial advice &middot; All trading involves risk
            </p>
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          #glossary > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

// ── Setup row helper (inline, file-scoped) ─────────────────────────────────
function SetupRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", paddingTop: 2, minWidth: 80 }}>
        {label}
      </span>
      <span style={{ fontFamily: BODY, fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}
