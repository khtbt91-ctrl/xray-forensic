"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { MONO, FadeInUp } from "../shared";

const SPACE = "'Space Grotesk', sans-serif";

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: string;
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
      {hint && (
        <p style={{ fontFamily: MONO, fontSize: 10, color: '#94a3b8', marginTop: 5, marginBottom: 0, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default function LeakCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState(25000);
  const [tradesPerMonth, setTradesPerMonth] = useState(60);
  const [slippagePips, setSlippagePips] = useState(1.5);
  const [commissionPerLot, setCommissionPerLot] = useState(7);

  const avgTradeSize = monthlyVolume / tradesPerMonth;
  const lotsPerTrade = avgTradeSize / 200000;
  const commissionCost = tradesPerMonth * commissionPerLot * lotsPerTrade * 100;
  const slippageCost = tradesPerMonth * slippagePips * lotsPerTrade * 10;
  const totalLeak = commissionCost + slippageCost;

  const fmt = (n: number) => "$" + Math.max(1, Math.round(n)).toLocaleString();

  const fmtVolume = (v: number) => {
    if (v >= 1000) return "$" + (v / 1000).toLocaleString() + "K";
    return "$" + v.toLocaleString();
  };

  const fmtCommission = (v: number) =>
    "$" + (v % 1 === 0 ? v.toString() : v.toFixed(1)) + "/lot";

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp>
        <p style={{
          fontFamily: MONO, fontSize: 10, color: '#e5b83c',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          textAlign: 'center', marginBottom: 16, margin: '0 0 16px',
        }}>
          MECHANICAL LEAK ESTIMATOR
        </p>
        <h2 style={{
          fontSize: "clamp(24px, 3.5vw, 40px)",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "-0.02em",
          margin: "0 0 28px",
        }}>
          How much are your leaks costing you?
        </h2>
      </FadeInUp>

      {/* Explanation */}
      <FadeInUp delay={0.05}>
        <div style={{
          maxWidth: 620,
          margin: '0 auto 52px',
          background: 'rgba(30,41,59,0.4)',
          border: '1px solid #1e293b',
          borderRadius: 8,
          padding: '20px 24px',
        }}>
          <p style={{
            fontFamily: SPACE,
            fontSize: 16,
            fontWeight: 700,
            color: '#e5b83c',
            margin: '0 0 10px',
          }}>
            Your Mechanical Leak
          </p>
          <p style={{
            fontFamily: MONO,
            fontSize: 12,
            color: '#64748b',
            lineHeight: 1.7,
            margin: '0 0 8px',
          }}>
            Before behavioral patterns — before revenge trades, missed stops, or bad entries —
            your account bleeds from mechanical costs alone. Commission and slippage on every
            trade, every month, guaranteed.
          </p>
          <p style={{
            fontFamily: MONO,
            fontSize: 12,
            color: '#64748b',
            lineHeight: 1.7,
            margin: 0,
          }}>
            This calculator shows that floor. X-Ray finds what&apos;s above it.
          </p>
        </div>
      </FadeInUp>

      <div className="calc-grid" style={{ gap: 28, alignItems: "start" }}>
        {/* Sliders */}
        <FadeInUp delay={0.1}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "32px 36px" }}>
            <SliderRow
              label="Monthly trading volume"
              value={monthlyVolume}
              min={1000}
              max={500000}
              step={1000}
              onChange={setMonthlyVolume}
              format={fmtVolume}
            />
            <SliderRow
              label="Trades / month"
              value={tradesPerMonth}
              min={10}
              max={500}
              step={5}
              onChange={setTradesPerMonth}
              format={v => v + " trades"}
            />
            <SliderRow
              label="Commission per lot"
              value={commissionPerLot}
              min={0}
              max={25}
              step={0.5}
              onChange={setCommissionPerLot}
              format={fmtCommission}
              hint="(some brokers charge up to $25/lot)"
            />
            <SliderRow
              label="Slippage per trade"
              value={slippagePips}
              min={0.1}
              max={5.0}
              step={0.1}
              onChange={setSlippagePips}
              format={v => v.toFixed(1) + " pips"}
            />
          </div>
        </FadeInUp>

        {/* Results */}
        <FadeInUp delay={0.2}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "32px 36px", fontFamily: MONO }}>
            <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--text-muted)", marginBottom: 12 }}>
                TOTAL MECHANICAL LEAK
              </div>
              <div style={{ fontSize: 44, fontWeight: 500, color: "var(--loss)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                −{fmt(totalLeak)}
                <span style={{ fontSize: 16, color: '#64748b', marginLeft: 4 }}>/mo</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>Commission</span>
                <span style={{ color: "var(--loss)", fontVariantNumeric: "tabular-nums" }}>−{fmt(commissionCost)}/mo</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>Slippage</span>
                <span style={{ color: "var(--loss)", fontVariantNumeric: "tabular-nums" }}>−{fmt(slippageCost)}/mo</span>
              </div>
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14, marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 500 }}>
                <span style={{ color: "var(--text-primary)" }}>Total leak</span>
                <span style={{ color: "var(--loss)", fontVariantNumeric: "tabular-nums" }}>−{fmt(totalLeak)}/mo</span>
              </div>
            </div>

            <div style={{ padding: "14px 16px", background: "rgba(88,166,255,0.05)", border: "1px solid rgba(88,166,255,0.18)", borderRadius: 6, marginBottom: 16 }}>
              <p style={{ fontFamily: MONO, fontSize: 11, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                This is before behavioral leaks. Upload your trades to see the real number.
              </p>
            </div>

            <p style={{ fontFamily: MONO, fontSize: 10, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Estimate only. Actual costs vary by broker, pair, and market conditions.
            </p>
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
