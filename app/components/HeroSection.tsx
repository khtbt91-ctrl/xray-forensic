"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MONO } from "./shared";

type TLine =
  | { kind: "plain"; text: string }
  | { kind: "red"; text: string }
  | { kind: "mixed"; before: string; gold: string };

const TERMINAL_LINES: TLine[] = [
  { kind: "plain", text: "ANALYZING 639 TRADES..." },
  { kind: "plain", text: "> 276 revenge trades detected." },
  { kind: "mixed", before: "> Cost: ", gold: "-$4,753.95" },
  { kind: "plain", text: "> Stop-less trades = 91% of all losses." },
  { kind: "plain", text: "> Kill zone compliance: 28.6%" },
  { kind: "plain", text: "> Best session? Asian. The one you ignore." },
  { kind: "red", text: "> Verdict: STRUCTURALLY UNPROFITABLE." },
];

function renderTLine(line: TLine) {
  if (line.kind === "red")
    return <span style={{ color: "var(--loss)" }}>{line.text}</span>;
  if (line.kind === "mixed")
    return (
      <span>
        {line.before}
        <span style={{ color: "var(--warning)", fontWeight: 600 }}>{line.gold}</span>
      </span>
    );
  return <span>{line.text}</span>;
}

export default function HeroSection() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 400 + 500));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "72px 40px 100px", textAlign: "center" }}>
      <p
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 20,
        }}
      >
        FORENSIC TRADE DIAGNOSTIC
      </p>

      <h1
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 20px",
          lineHeight: 1.1,
          color: "var(--text-primary)",
        }}
      >
        Your trades confess everything.
      </h1>

      <p
        style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          maxWidth: 580,
          margin: "0 auto 36px",
        }}
      >
        X-Ray processes your MT5 history through 7 institutional dimensions. Returns
        a verdict you cannot negotiate. And a prescription with a target.
      </p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
        <Link href="/new" className="btn btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
          Get Diagnosed
        </Link>
        <Link href="/sample" className="btn btn-ghost" style={{ fontSize: 15, padding: "14px 32px" }}>
          See Sample Verdict
        </Link>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          overflow: "hidden",
          textAlign: "left",
          boxShadow: "0 0 80px rgba(88,166,255,0.05)",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            padding: "11px 16px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "var(--bg-elevated)",
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--loss)", display: "inline-block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--warning)", display: "inline-block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--profit)", display: "inline-block" }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>
            xray-diagnosis — session:demo
          </span>
        </div>
        <div
          style={{
            padding: "28px 32px 32px",
            fontFamily: MONO,
            fontSize: 14,
            lineHeight: 2.1,
            minHeight: 240,
          }}
        >
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i}>{renderTLine(line)}</div>
          ))}
          {visibleLines < TERMINAL_LINES.length && (
            <span className="terminal-cursor">▋</span>
          )}
        </div>
      </div>
    </section>
  );
}
