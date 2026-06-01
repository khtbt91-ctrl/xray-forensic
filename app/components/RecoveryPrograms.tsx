"use client";

/**
 * X-Ray Forensic — "After the Diagnosis" recovery programs section.
 * Recolored to live tokens. Wire into app/page.tsx (e.g. after OneTimeProducts, before FaqSection).
 */

const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";
const GOLD = "#e5b83c";
const CARD = "#0e1626";
const BORDER = "#1e293b";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

const PROGRAMS = [
  {
    tag: "30 DAYS · pairs with Audit",
    title: "Stabilize",
    sub: "The bleeding-stops protocol. One prescription, measured daily.",
    points: [
      "Cap size at your diagnosed safe level — hold it for 30 trades.",
      "Daily-loss circuit breaker installed (the rule that kills 60% of challenges).",
      "Re-upload weekly. Compliance score tracks whether you followed the prescription.",
    ],
    exit: "Behavioral Control ≥ 60 for 30 days → Bronze discipline mark.",
  },
  {
    tag: "90 DAYS · pairs with Forensic",
    title: "Rebuild",
    sub: "Full 7-dimension rehab with the prescription engine.",
    points: [
      "5 ranked, measurable prescriptions refreshed each analysis.",
      "Dual-axis compliance ↔ P/L chart — watch discipline convert to dollars.",
      "What-If engine: “off-session removed → +$932 instead of +$367.”",
    ],
    exit: "≥ 70 across all dimensions for 90 days → Silver.",
  },
  {
    tag: "180 DAYS · pairs with Guardian / Sovereign",
    title: "Certify",
    sub: "Prove it to a prop firm. A verified, public discipline credential.",
    points: [
      "Real-time behavioral alerts before the revenge trade fires.",
      "Prop-firm challenge simulator on your real history (FTMO, Apex rules).",
      "Public verification URL prop firms can check.",
    ],
    exit: "≥ 85 for 180 days → Gold / Platinum certification.",
  },
];

export default function RecoveryPrograms() {
  return (
    <section style={{ maxWidth: 1100, margin: "96px auto", padding: "0 20px" }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>
        After the Diagnosis
      </div>
      <h2 style={{ color: TEXT, fontSize: 32, fontWeight: 700, margin: "0 0 40px", fontFamily: SPACE }}>
        A verdict is not a cure. Here&apos;s the protocol.
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {PROGRAMS.map((p, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: GOLD, letterSpacing: "0.08em", marginBottom: 10 }}>{p.tag}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: MONO, color: MUTED, fontSize: 13 }}>{`0${i + 1}`}</span>
              <h3 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: 0, fontFamily: SPACE }}>{p.title}</h3>
            </div>
            <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{p.sub}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", flexGrow: 1 }}>
              {p.points.map((pt, j) => (
                <li key={j} style={{ color: TEXT, fontSize: 14, lineHeight: 1.5, marginBottom: 10, paddingLeft: 16, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: GOLD }}>▪</span>{pt}
                </li>
              ))}
            </ul>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, color: MUTED, fontSize: 12, fontFamily: MONO }}>
              EXIT: <span style={{ color: TEXT }}>{p.exit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <a href="/new" style={{ display: "inline-block", background: GOLD, color: "#000", fontWeight: 700, padding: "14px 28px", borderRadius: 6, textDecoration: "none", fontSize: 15, fontFamily: SPACE }}>
          Get diagnosed first. The program follows the evidence. →
        </a>
      </div>
    </section>
  );
}
