"use client";

import { useState, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import { MONO, FadeInUp } from "./shared";

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
          {format(value)}
        </span>
      </div>
      <Slider.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: 20, cursor: "pointer" }}
      >
        <Slider.Track style={{ background: "var(--border-subtle)", borderRadius: 4, flexGrow: 1, height: 4, position: "relative" }}>
          <Slider.Range style={{ position: "absolute", background: "var(--accent-primary)", borderRadius: 4, height: "100%" }} />
        </Slider.Track>
        <Slider.Thumb
          style={{
            display: "block",
            width: 16,
            height: 16,
            background: "var(--text-primary)",
            borderRadius: "50%",
            border: "2px solid var(--accent-primary)",
            outline: "none",
            cursor: "grab",
            flexShrink: 0,
          }}
        />
      </Slider.Root>
    </div>
  );
}

export default function LeakCalculator() {
  const [values, setValues] = useState({
    balance: 10000,
    trades: 50,
    winRate: 42,
    avgRR: 1.5,
    revengePct: 20,
    noSlPct: 10,
  });

  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSliderChange = (key: string, value: number) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setValues(prev => ({ ...prev, [key]: value }));
    }, 300);
  };

  const { balance, trades, winRate, avgRR, revengePct, noSlPct } = values;

  const avgRisk = balance * 0.01;
  const wr = winRate / 100;
  const rp = revengePct / 100;
  const nsp = noSlPct / 100;

  const evNormal = avgRisk * (wr * avgRR - (1 - wr));
  const evRevenge = avgRisk * (wr * 0.5 * (avgRR * 0.8) - (1 - wr * 0.5));
  const evNoSl = avgRisk * (wr * avgRR - (1 - wr) * 2);

  const recovRevenge = Math.max(0, trades * rp * (evNormal - evRevenge));
  const recovStops = Math.max(0, trades * nsp * (evNormal - evNoSl));
  const monthlyLeak = recovRevenge + recovStops;

  const fmt = (n: number) => "$" + Math.abs(Math.round(n)).toLocaleString();

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: "0 0 56px",
          }}
        >
          How much are your leaks costing you?
        </h2>
      </FadeInUp>

      <div className="calc-grid" style={{ gap: 28, alignItems: "start" }}>
        <FadeInUp delay={0.1}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "32px 36px" }}>
            <SliderRow label="Account balance" value={balance} min={1000} max={500000} step={1000} onChange={(v) => handleSliderChange('balance', v)} format={(v) => "$" + v.toLocaleString()} />
            <SliderRow label="Trades / month" value={trades} min={10} max={500} onChange={(v) => handleSliderChange('trades', v)} format={(v) => `${v}`} />
            <SliderRow label="Win rate" value={winRate} min={20} max={80} onChange={(v) => handleSliderChange('winRate', v)} format={(v) => `${v}%`} />
            <SliderRow label="Average R:R" value={avgRR} min={0.5} max={5} step={0.1} onChange={(v) => handleSliderChange('avgRR', v)} format={(v) => `${v.toFixed(1)}R`} />
            <SliderRow label="Revenge trade %" value={revengePct} min={0} max={60} onChange={(v) => handleSliderChange('revengePct', v)} format={(v) => `${v}%`} />
            <SliderRow label="No-SL trade %" value={noSlPct} min={0} max={50} onChange={(v) => handleSliderChange('noSlPct', v)} format={(v) => `${v}%`} />
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "32px 36px", fontFamily: MONO }}>
            <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--text-muted)", marginBottom: 12 }}>
                ESTIMATED MONTHLY LEAK
              </div>
              <div style={{ fontSize: 44, fontWeight: 500, color: "var(--loss)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                −{fmt(monthlyLeak)}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>Remove revenge trades</span>
                <span style={{ color: "var(--profit)", fontVariantNumeric: "tabular-nums" }}>+{fmt(recovRevenge)}/mo</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>Add stops to all trades</span>
                <span style={{ color: "var(--profit)", fontVariantNumeric: "tabular-nums" }}>+{fmt(recovStops)}/mo</span>
              </div>
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14, marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 500 }}>
                <span style={{ color: "var(--text-primary)" }}>POTENTIAL RECOVERY</span>
                <span style={{ color: "var(--profit)", fontVariantNumeric: "tabular-nums" }}>{fmt(monthlyLeak)}/mo</span>
              </div>
            </div>

            <div style={{ marginTop: 28, padding: "14px 16px", background: "rgba(88,166,255,0.05)", border: "1px solid rgba(88,166,255,0.18)", borderRadius: 6, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              One FORENSIC analysis: $79.{" "}
              <br />
              Your leaks:{" "}
              <span style={{ color: "var(--loss)", fontVariantNumeric: "tabular-nums" }}>
                {fmt(monthlyLeak)}/month.
              </span>
            </div>
          </div>
        </FadeInUp>
      </div>

      <FadeInUp delay={0.3} style={{ textAlign: "center", width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
        <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 13, color: "var(--text-muted)", marginTop: 28, width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
          The machine doesn&apos;t guess. It counts.
        </p>
      </FadeInUp>
    </section>
  );
}
