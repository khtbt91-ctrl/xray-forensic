"use client";

const MONO = "'JetBrains Mono', monospace";

// Pre-seeded anonymized findings — replace with API call once real data flows
// Format reflects real X-Ray output language
const FINDINGS = [
  { instrument: "XAUUSD",  flag: "276 revenge re-entries",       leak: "-$4,753",  session: "London",    ago: "2h ago" },
  { instrument: "GBPUSD",  flag: "Off-session leak",             leak: "-$2,425",  session: "Asian",     ago: "5h ago" },
  { instrument: "NAS100",  flag: "91% losses: no stop-loss",     leak: "-$6,118",  session: "NY open",   ago: "7h ago" },
  { instrument: "XAUUSD",  flag: "Winning 60% — still negative", leak: "-$1,840",  session: "London",    ago: "11h ago" },
  { instrument: "GBPJPY",  flag: "Oversizing after losses",      leak: "-$3,290",  session: "London",    ago: "14h ago" },
  { instrument: "EURUSD",  flag: "48 trades without stop",       leak: "-$2,064",  session: "NY",        ago: "1d ago" },
  { instrument: "XAUUSD",  flag: "Asian edge: untapped",         leak: "+$1,920",  session: "Asian",     ago: "1d ago" },
  { instrument: "NAS100",  flag: "Streak tilt detected",         leak: "-$5,440",  session: "NY open",   ago: "2d ago" },
  { instrument: "GBPUSD",  flag: "Kill zone: 22% compliance",    leak: "-$3,105",  session: "London",    ago: "2d ago" },
  { instrument: "XAUUSD",  flag: "Profit factor: 0.71",          leak: "-$8,230",  session: "All",       ago: "3d ago" },
  { instrument: "GBPJPY",  flag: "Daily-loss breach: day 22",    leak: "-$5,010",  session: "London",    ago: "3d ago" },
  { instrument: "EURUSD",  flag: "Risk 2.4% vs survivors 0.8%",  leak: "-$3,880",  session: "NY",        ago: "4d ago" },
  { instrument: "NAS100",  flag: "6.8 trades/day — overtrading", leak: "-$4,210",  session: "NY open",   ago: "4d ago" },
  { instrument: "XAUUSD",  flag: "Stop moved on 19 of 22 losers",leak: "-$2,970",  session: "London",    ago: "5d ago" },
  { instrument: "GBPUSD",  flag: "58% win rate — net negative",  leak: "-$430",    session: "NY",        ago: "5d ago" },
  { instrument: "EURJPY",  flag: "41 entries outside kill zone", leak: "-$1,204",  session: "Asian",     ago: "6d ago" },
  { instrument: "NAS100",  flag: "Pre-challenge pass odds: 9%",  leak: "-$6,640",  session: "NY open",   ago: "6d ago" },
  { instrument: "XAUUSD",  flag: "Demo profitable, live bleeding",leak: "-$1,120",  session: "London",    ago: "1w ago" },
  { instrument: "GBPUSD",  flag: "Oversized 11x after a loss",   leak: "-$2,180",  session: "London",    ago: "1w ago" },
];

// Duplicate for seamless loop
const ALL = [...FINDINGS, ...FINDINGS];

export default function LiveTicker() {
  return (
    <div
      style={{
        borderTop: "1px solid #1e293b",
        borderBottom: "1px solid #1e293b",
        background: "#0e1626",
        overflow: "hidden",
        padding: "10px 0",
        position: "relative",
      }}
    >
      {/* Left fade */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 80,
        background: "linear-gradient(to right, #0e1626, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
        background: "linear-gradient(to left, #0e1626, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Label */}
      <div style={{
        position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
        fontFamily: MONO, fontSize: 9, color: "var(--loss)", letterSpacing: "0.12em",
        textTransform: "uppercase", zIndex: 3,
        background: "#0e1626", padding: "2px 8px",
        border: "1px solid #1e293b", borderRadius: 3,
      }}>
        LIVE
      </div>

      {/* Scrolling track */}
      <div
        className="ticker-track"
        style={{
          display: "flex",
          gap: 0,
          width: "max-content",
          paddingLeft: 120,
        }}
      >
        {ALL.map((f, i) => {
          const isPositive = f.leak.startsWith("+");
          return (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 32px",
                borderRight: "1px solid #1e293b",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 10, color: "#C9A84C", letterSpacing: "0.08em" }}>
                {f.instrument}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {f.flag}
              </span>
              <span style={{
                fontFamily: MONO, fontSize: 11, fontWeight: 600,
                color: isPositive ? "var(--profit)" : "var(--loss)",
              }}>
                {f.leak}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                {f.session} · {f.ago}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
