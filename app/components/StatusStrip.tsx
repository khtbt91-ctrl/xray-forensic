"use client";

import { useEffect, useState } from "react";

/**
 * NAV + STATUS STRIP — Section 1, structural redesign (2026-07-12).
 * Merges the old inline trust bar + ActivityCounter into one full-bleed strip.
 * Trimmed to 3 trust claims (from 5) per spec. Focal point is the live stat
 * numeral, not the wordmark — scale contrast kept deliberately low (Art
 * Director ruling): wordmark ~14px vs. stat numeral ~20-24px tabular mono.
 * Mobile: horizontal-scroll row, edge-fade right (not a wrapped grid).
 */

const MONO = "'JetBrains Mono', monospace";

interface BenchmarkStats {
  total_traders_analyzed: number;
  total_leaks_identified: number;
  total_leaks_quantified: number;
}

export default function StatusStrip() {
  const [stats, setStats] = useState<BenchmarkStats>({
    total_traders_analyzed: 0,
    total_leaks_identified: 0,
    total_leaks_quantified: 0,
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/benchmarks`)
      .then((r) => r.json())
      .then((data: any) => {
        setStats({
          total_traders_analyzed: data.total_traders_analyzed || 0,
          total_leaks_identified: data.total_leaks_identified || 0,
          total_leaks_quantified: data.total_leaks_quantified || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        borderTop: "1px solid #26313F",
        borderBottom: "1px solid #26313F",
        background: "#131A24",
        padding: "10px 24px",
        position: "relative",
      }}
    >
      <div className="status-strip-scroll">
        {/* NOW LIVE pill — direct asset lift from day0-announcement-post.png */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 10,
            color: "#10b981",
            letterSpacing: "0.12em",
            border: "1px solid rgba(16,185,129,0.35)",
            borderRadius: 100,
            padding: "3px 10px",
            flexShrink: 0,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          NOW LIVE
        </span>

        {/* Live stat — the focal point of this section */}
        <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: "#38BDF8", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
          {stats.total_traders_analyzed.toLocaleString()}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: "#8B98A9", flexShrink: 0 }}>accounts diagnosed</span>

        <span style={{ color: "#26313F", flexShrink: 0 }}>·</span>

        {/* Trust claims — trimmed to 3, per spec */}
        {["No card required", "Trade data never stored", "MT5 export, not password"].map((item) => (
          <span
            key={item}
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: "#8B98A9",
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#10b981" }}>✓</span>
            {item}
          </span>
        ))}
      </div>

      {/* Edge-fade affordance — quiet horizontal-scroll cue, no arrow icon (deep-banned tell) */}
      <div className="status-strip-fade" aria-hidden />

      <style>{`
        .status-strip-scroll {
          display: flex;
          align-items: center;
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .status-strip-scroll::-webkit-scrollbar { display: none; }
        .status-strip-fade { display: none; }
        @media (max-width: 768px) {
          .status-strip-fade {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 32px;
            background: linear-gradient(to right, transparent, #131A24);
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
}
