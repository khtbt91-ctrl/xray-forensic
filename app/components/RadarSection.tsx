"use client";

import { useState, useEffect, useRef } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MONO, FadeInUp } from "./shared";

const GOLD = "var(--accent-primary)";

const DIMENSIONS = [
  {
    key: "HTF BIAS",
    hook: "Fighting the trend?",
    score: 42,
    finding: "You fought the D1 trend on 58% of your trades. That's not bad luck — that's a system failure.",
  },
  {
    key: "LIQUIDITY",
    hook: "Stops where they hunt?",
    score: 38,
    finding: "62% of your entries run straight into opposing liquidity. You're handing institutions your stop.",
  },
  {
    key: "OTE DISCIPLINE",
    hook: "Chasing entries?",
    score: 55,
    finding: "Only 31% of entries hit the 0.618–0.786 OTE zone. You're paying full price for discounted levels.",
  },
  {
    key: "OB/FVG CONFLUENCE",
    hook: "Entering on one reason?",
    score: 48,
    finding: "52% of entries ignore the nearest institutional imbalance. That's not a strategy — that's noise.",
  },
  {
    key: "SESSION DISCIPLINE",
    hook: "Trading dead hours?",
    score: 31,
    finding: "Your London win rate runs 18 pts below your Asian baseline — inverted from institutional norms. You're trading the right hours with the wrong process.",
  },
  {
    key: "RISK ARCHITECTURE",
    hook: "One bad day away?",
    score: 45,
    finding: "Lot size variance is 3.2× — one bad session at max size ends your account.",
  },
  {
    key: "BEHAVIORAL CONTROL",
    hook: "Revenge trading?",
    score: 18,
    finding: "276 revenge trades. Your lowest score. This is the diagnosis, not the symptom.",
  },
];

export default function RadarSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (animated) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 200);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "-80px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  const data = DIMENSIONS.map((d) => ({
    dim: d.key,
    score: animated ? d.score : 100,
    fullMark: 100,
  }));

  const activeDim = activeInsight ? DIMENSIONS.find((d) => d.key === activeInsight) : null;

  // D-8: mobile replaces the radar with a worst-to-best ranked bar list, not a shrunk chart.
  const rankedWorstFirst = [...DIMENSIONS].sort((a, b) => a.score - b.score);

  return (
    <section ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            width: "100%",
            display: "block",
            margin: "0 auto",
            marginBottom: 12,
          }}
        >
          7 DIAGNOSTIC DIMENSIONS
        </p>
        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
          }}
        >
          Every weakness has a dollar amount.
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", marginBottom: 52 }}>
          Click any dimension label to see the finding.
        </p>
      </FadeInUp>

      {/* Mobile (<640px) — ranked bar list, worst-to-best, replaces the radar entirely (D-8).
          Display is controlled entirely by the .radar-mobile-only / .radar-desktop-only CSS
          classes in globals.css — no inline `display` here, since an inline style would win
          over the media query and defeat the breakpoint swap (bug found + fixed in screenshot
          QA, 2026-07-12: mobile was rendering the desktop chart because of exactly this). */}
      <div className="radar-mobile-only">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rankedWorstFirst.map((d) => {
            const isActive = activeInsight === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setActiveInsight(isActive ? null : d.key)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "var(--bg-card)",
                  border: `1px solid ${isActive ? "var(--accent-primary)" : "var(--border-subtle)"}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: "#E6EDF3" }}>
                    {d.key}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--accent-primary)" }}>{d.score}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#0A0E14", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${d.score}%`,
                      height: "100%",
                      background: "var(--accent-primary)",
                      borderRadius: 3,
                    }}
                  />
                </div>
                {isActive && (
                  <p style={{ marginTop: 10, marginBottom: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-primary)" }}>
                    {d.finding}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="radar-desktop-only radar-desktop-inner">
        <div style={{ width: "100%", overflowX: "auto" }}>
        <div className="radar-chart-frame" style={{ width: "100%", height: 500, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              fontFamily: MONO,
              fontSize: 9,
              color: "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
              padding: "2px 8px",
              letterSpacing: "0.1em",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            DEMO ACCOUNT DATA
          </span>

          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius="60%">
                <PolarGrid stroke="var(--border-subtle)" />
                <PolarAngleAxis
                  dataKey="dim"
                  tick={(props) => {
                    const { x, y, cx, cy, payload } = props as unknown as {
                      x: number;
                      y: number;
                      cx: number;
                      cy: number;
                      payload: { value: string };
                    };
                    const dim = DIMENSIONS.find((d) => d.key === payload.value);
                    if (!dim) return <g />;

                    const isActive = payload.value === activeInsight;
                    const isHovered = hoveredDim === payload.value;

                    // Push labels further from center to clear the outermost grid ring
                    const EXTRA = 22;
                    const dx = x - (cx ?? 0);
                    const dy = y - (cy ?? 0);
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const scale = (dist + EXTRA) / dist;
                    const lx = (cx ?? 0) + dx * scale;
                    const ly = (cy ?? 0) + dy * scale;

                    const nameColor = isActive
                      ? "var(--accent-primary)"
                      : isHovered
                      ? "var(--text-primary)"
                      : "#E6EDF3";

                    return (
                      <g
                        onClick={() =>
                          setActiveInsight(activeInsight === payload.value ? null : payload.value)
                        }
                        onMouseEnter={() => setHoveredDim(payload.value)}
                        onMouseLeave={() => setHoveredDim(null)}
                        cursor="pointer"
                      >
                        <text
                          x={lx}
                          y={ly}
                          textAnchor="middle"
                          fontFamily={MONO}
                          style={{ cursor: "pointer", transition: "fill 150ms ease" }}
                        >
                          <tspan
                            x={lx}
                            dy="-0.6em"
                            fontSize={11}
                            fill={nameColor}
                            fontWeight={isActive ? 600 : 400}
                          >
                            {dim.key}
                          </tspan>
                          <tspan
                            x={lx}
                            dy="1.4em"
                            fontSize={9}
                            fill="#8B949E"
                            fontStyle="italic"
                          >
                            {dim.hook}
                          </tspan>
                        </text>
                      </g>
                    );
                  }}
                />
                <Radar
                  dataKey="score"
                  stroke="var(--accent-primary)"
                  fill="var(--accent-primary)"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  isAnimationActive
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
        </div>

        {activeDim && (
          <div
            className="insight-popup"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--accent-primary)",
              borderRadius: 8,
              padding: "16px 24px",
              maxWidth: 480,
              width: "100%",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: GOLD,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              {activeDim.key}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: "var(--text-secondary)",
                fontStyle: "italic",
                display: "block",
                marginTop: 3,
              }}
            >
              {activeDim.hook}
            </span>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.65 }}>
              {activeDim.finding}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
