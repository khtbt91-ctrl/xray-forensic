"use client";

import { FadeInUp } from "./shared";

const stats = [
  { number: "639", label: "Trades in First Diagnosis" },
  { number: "$8,475", label: "In Leaks Found (First 10)" },
  { number: "7", label: "Diagnostic Dimensions" },
  { number: "41", label: "Data Points Per Trade" },
];

export default function MetricBar() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 40px 24px" }}>
      <FadeInUp>
        <div className="metric-bar">
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "2rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  marginBottom: 10,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}
