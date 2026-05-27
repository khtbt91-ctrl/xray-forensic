"use client";

import { useState, useEffect, useRef } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MONO, FadeInUp } from "./shared";

const RADAR_ACTUAL = [
  { dim: "Fighting the Trend?", score: 42 },
  { dim: "Stops in Kill Zones?", score: 38 },
  { dim: "Chasing Entries?", score: 55 },
  { dim: "Trading Randomly?", score: 48 },
  { dim: "Trading When Bored?", score: 31 },
  { dim: "One Bad Day Away?", score: 45 },
  { dim: "Revenge Trading?", score: 18 },
];

const RADAR_INSIGHTS: Record<string, string> = {
  "Fighting the Trend?":
    "You fought the D1 trend on 58% of your trades. That's not bad luck — that's a system failure.",
  "Stops in Kill Zones?":
    "62% of your entries run straight into opposing liquidity. You're handing institutions your stop.",
  "Chasing Entries?":
    "Only 31% of entries hit the 0.618–0.786 OTE zone. You're paying full price for discounted levels.",
  "Trading Randomly?":
    "52% of entries ignore the nearest institutional imbalance. That's not a strategy — that's noise.",
  "Trading When Bored?":
    "London drops your win rate 18 pts below Asian baseline. You trade London anyway.",
  "One Bad Day Away?":
    "Lot size variance is 3.2× — one bad session at max size ends your account.",
  "Revenge Trading?":
    "276 revenge trades. Your lowest score. This is the diagnosis, not the symptom.",
};

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

  const data = RADAR_ACTUAL.map((d) => ({
    dim: d.dim,
    score: animated ? d.score : 100,
    fullMark: 100,
  }));

  return (
    <section ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
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

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ width: "100%", minWidth: 450, height: 500 }}>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data}>
                <PolarGrid stroke="var(--border-subtle)" />
                <PolarAngleAxis
                  dataKey="dim"
                  tick={(props) => {
                    const { x, y, payload } = props as { x: number; y: number; payload: { value: string } };
                    const isActive = payload.value === activeInsight;
                    return (
                      <g
                        onClick={() => setActiveInsight(activeInsight === payload.value ? null : payload.value)}
                        onMouseEnter={() => setHoveredDim(payload.value)}
                        onMouseLeave={() => setHoveredDim(null)}
                        cursor="pointer"
                      >
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={
                            isActive
                              ? "var(--accent-primary)"
                              : hoveredDim === payload.value
                              ? "var(--text-primary)"
                              : "var(--text-secondary)"
                          }
                          fontSize={11}
                          fontFamily={MONO}
                          style={{
                            cursor: "pointer",
                            textDecoration: hoveredDim === payload.value ? "underline" : "none",
                            transition: "fill 150ms ease",
                          }}
                        >
                          {payload.value}
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

        {activeInsight && (
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
                color: "var(--accent-primary)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {activeInsight}
            </span>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.65 }}>
              {RADAR_INSIGHTS[activeInsight]}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
