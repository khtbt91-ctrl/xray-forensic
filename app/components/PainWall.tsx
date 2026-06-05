"use client";

import { useRef, useState, useEffect } from "react";
import { MONO, useCountUp, FadeInUp } from "./shared";

function StatCard({
  value,
  prefix,
  label,
  accent,
  delay,
}: {
  value: number;
  prefix?: string;
  label: string;
  accent: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          setIsInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayVal = useCountUp(value, 1500, isInView);

  return (
    <div
      ref={ref}
      className="fade-in-up"
      style={{
        transitionDelay: `${delay}s`,
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
        padding: "36px 32px",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 52,
          fontWeight: 500,
          color: accent,
          marginBottom: 12,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {prefix}
        {displayVal.toLocaleString()}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>
        {label}
      </div>
    </div>
  );
}

export default function PainWall() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          FROM A DEMO ACCOUNT EXPORT:
        </p>
      </FadeInUp>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <StatCard value={4753} prefix="$" label="Lost to trades with no stop loss" accent="var(--loss)" delay={0} />
        <StatCard value={276} label="Revenge trades. Same mistake. 276 times." accent="var(--warning)" delay={0.1} />
        <StatCard value={29} label="Longest losing streak. Exposed." accent="var(--accent-primary)" delay={0.2} />
      </div>

      <FadeInUp delay={0.3}>
        <div style={{ textAlign: "center", marginTop: 44, width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
          <p
            style={{
              fontFamily: MONO,
              fontSize: "1.1rem",
              color: "var(--loss)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              margin: "0 0 14px",
              fontVariantNumeric: "tabular-nums",
              textAlign: "center",
              width: "100%",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Verdict: YOUR METHOD LOSES MONEY. NO DISCIPLINE FIXES THIS.
          </p>
          <p style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)", margin: "0 0 4px", textAlign: "center", width: "100%" }}>
            Prescription: Return to demo. Rebuild.
          </p>
          <p style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-secondary)", margin: 0, textAlign: "center", width: "100%" }}>
            Target: Profit factor &gt; 1.3 over 30 trades.
          </p>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            color: 'var(--warning)',
            textAlign: 'center',
            width: '100%',
            display: 'block',
            marginTop: '32px',
            letterSpacing: '0.05em',
          }}>
            5–10% of prop firm challengers pass on first attempt. Your data shows why.
          </p>
        </div>
      </FadeInUp>
    </section>
  );
}
