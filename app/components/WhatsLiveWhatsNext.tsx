"use client";

import Link from "next/link";

/**
 * WHAT'S LIVE / WHAT'S NEXT — Section 9 (NEW), structural redesign (2026-07-12).
 * Resolves D-1 structurally: reuses /roadmap's own LIVE/BUILDING/CLASSIFIED
 * status-badge device instead of scattering not-yet-live features across the
 * page as if live. Badge content reflects today's compliance fix (a66ae04):
 * Monte Carlo pass-probability is CLASSIFIED/roadmap, explicitly NOT live —
 * matches /roadmap Phase 4 ("We are not ready to talk about this yet") and
 * the FaqSection fix ("Not yet... roadmap, not live today").
 */

type Status = "live" | "building" | "classified";

const BADGES: { status: Status; label: string; example: string }[] = [
  {
    status: "live",
    label: "LIVE",
    example: "7-dimension behavioral scoring, full forensic verdict, dollar-costed leaks — today.",
  },
  {
    status: "building",
    label: "BUILDING",
    example: "Pre-session tactical briefing and end-of-session debrief protocol.",
  },
  {
    status: "classified",
    label: "CLASSIFIED",
    example: "Prop-firm pass-probability simulation. Not live. No date yet.",
  },
];

const STATUS_COLOR: Record<Status, string> = {
  live: "#10b981",
  building: "#38BDF8",
  classified: "#475569",
};

export default function WhatsLiveWhatsNext() {
  return (
    <section style={{ background: "#0A0E14", borderTop: "1px solid #26313F", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
          NO OVERCLAIMING
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 40px)", color: "#E6EDF3", margin: "0 0 48px" }}>
          What&apos;s live. What&apos;s next.
        </h2>

        <div className="whats-live-rail">
          {BADGES.map((b) => (
            <div
              key={b.status}
              style={{
                flex: 1,
                background: "#131A24",
                border: b.status === "classified" ? `1px dashed ${STATUS_COLOR[b.status]}` : `1px solid ${STATUS_COLOR[b.status]}55`,
                borderRadius: 8,
                padding: "24px 20px",
                textAlign: "left",
              }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700,
                letterSpacing: "0.1em", color: STATUS_COLOR[b.status], marginBottom: 12,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[b.status], display: "inline-block" }} />
                {b.label}
              </span>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                {b.example}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/roadmap"
          style={{ display: "inline-block", marginTop: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#38BDF8", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          See the Full Roadmap →
        </Link>
      </div>

      <style>{`
        .whats-live-rail { display: flex; gap: 16px; }
        @media (max-width: 768px) {
          .whats-live-rail { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}
