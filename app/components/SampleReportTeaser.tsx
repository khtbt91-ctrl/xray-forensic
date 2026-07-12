"use client";

import Link from "next/link";

/**
 * SAMPLE REPORT TEASER — Section 8 (NEW), structural redesign (2026-07-12).
 * Beat 5 of the campaign arc: "get your diagnostic report" gets its own
 * hero beat instead of a small footer/nav link. Presented tilted 2-3deg,
 * like a photographed piece of evidence, per Art Director ruling.
 *
 * NEEDS FLAGGED (per art-direction-rulings-v1.md Section 8): the real
 * cropped/tilted screenshot of the live /sample page does not exist yet —
 * Designer owns producing that asset. This build composes the SAME data
 * model /sample/page.tsx renders (Summary metrics + one flag card) as a
 * code composition so nothing here is fabricated content, but it is a
 * placeholder for the eventual image asset, not the final artifact.
 */
export default function SampleReportTeaser() {
  return (
    <section style={{ background: "#0A0E14", padding: "96px 24px", overflow: "hidden" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
          SEE THE EVIDENCE
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", color: "#E6EDF3", margin: "0 0 48px" }}>
          This is what your trade history looks like, read forensically.
        </h2>

        {/* Tilted evidence card */}
        <div className="sample-teaser-card" style={{ maxWidth: 640, margin: "0 auto 32px", position: "relative" }}>
          <div
            style={{
              transform: "rotate(-2.5deg)",
              background: "#131A24",
              border: "1px solid #26313F",
              borderRadius: 12,
              padding: "28px 32px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
              position: "relative",
            }}
          >
            <span style={{
              position: "absolute", top: 12, right: 16, fontFamily: "var(--font-mono)",
              fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)",
              border: "1px solid var(--border-subtle)", padding: "2px 8px", borderRadius: 4,
            }}>
              SAMPLE — ILLUSTRATIVE
            </span>

            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "left", margin: "0 0 16px" }}>
              SUMMARY
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "0 0 6px", letterSpacing: "0.08em" }}>BEHAVIORAL SCORE</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: "#ef4444", margin: 0, fontWeight: 700 }}>18/100</p>
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "0 0 6px", letterSpacing: "0.08em" }}>ARCHETYPE</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: "#E6EDF3", margin: 0, fontWeight: 700 }}>Revenge Chaser</p>
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "0 0 6px", letterSpacing: "0.08em" }}>QUANTIFIED COST</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: "#38BDF8", margin: 0, fontWeight: 700 }}>-$3,200</p>
              </div>
            </div>

            <div className="sample-teaser-flag" style={{ background: "#0A0E14", border: "1px solid #26313F", borderLeft: "3px solid #38BDF8", borderRadius: 8, padding: "14px 16px", textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#38BDF8", margin: "0 0 6px" }}>
                BEHAVIORAL FLAG · 276 INSTANCES
              </p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                Revenge trading detected across 3 losing runs. 41% of winners closed early.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/sample"
          style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#38BDF8", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          View the Full Sample Report →
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .sample-teaser-card > div { padding: 20px 20px !important; }
          .sample-teaser-flag { display: none !important; }
        }
      `}</style>
    </section>
  );
}
