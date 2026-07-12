"use client";

/**
 * MECHANISM — 3-STEP — rebuilt per structural redesign (2026-07-12).
 * Ghost-numeral device lifted directly from campaign carousel slides 02-04
 * (day1-carousel-how-xray-works). Step 2 headline drops "WITH AI" (D-7 —
 * master brief confirms reports are rule-based, not AI-narrative, at launch).
 */
export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      badge: "[DATA INGESTION]",
      title: "Upload Your Trade Log",
      body: "Export your MT5 trade history (.csv, .htm, or .xlsx) and upload it. Browser-level processing — your raw data is never stored.",
    },
    {
      num: "02",
      badge: "[FORENSIC SCANNING]",
      title: "X-Ray Reads the Numbers",
      body: "The engine scores behavior across 7 institutional dimensions — win rate, expectancy, payoff, drawdown, and more. Rule-based. No opinions.",
    },
    {
      num: "03",
      badge: "[OPTIMIZATION REPORT]",
      title: "Get Your Diagnostic Report",
      body: "Ranked prescriptions with estimated dollar impact per month. Follow them. Upload again. Track the delta.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "96px 24px",
        background: "#0A0E14",
        borderTop: "1px solid #26313F",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#38BDF8",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          THE MECHANISM
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            textAlign: "center",
            color: "#E6EDF3",
            margin: "0 0 64px",
          }}
        >
          Three steps. No black box.
        </h2>

        {/* Desktop: 3-card grid with ghost numerals */}
        <div className="mechanism-grid">
          {steps.map((step) => (
            <div key={step.num} className="mechanism-card" style={{ position: "relative" }}>
              <span
                aria-hidden
                className="ghost-numeral mechanism-ghost"
                style={{ fontSize: "200px", top: "-40px", left: "-10px" }}
              >
                {step.num}
              </span>
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: "#131A24",
                  border: "1px solid #26313F",
                  borderRadius: "10px",
                  padding: "32px 28px",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    color: "#38BDF8",
                    margin: "0 0 8px",
                  }}
                >
                  STEP {step.num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    color: "#8B98A9",
                    margin: "0 0 14px",
                  }}
                >
                  {step.badge}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#E6EDF3",
                    margin: "0 0 12px",
                    lineHeight: 1.25,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#8B98A9", lineHeight: 1.7, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile 1→2→3 rail (CSS-driven, same markup) */}
      </div>

      <style>{`
        .mechanism-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .mechanism-ghost { display: block; }
        @media (max-width: 768px) {
          .mechanism-grid {
            grid-template-columns: 1fr;
            gap: 0;
            position: relative;
            padding-left: 28px;
            border-left: 2px solid #26313F;
            margin-left: 6px;
          }
          .mechanism-card { margin-bottom: 32px; }
          .mechanism-card:last-child { margin-bottom: 0; }
          .mechanism-ghost {
            font-size: 110px !important;
            top: -10px !important;
            left: -20px !important;
            opacity: 0.06;
          }
          .mechanism-card::before {
            content: "";
            position: absolute;
            left: -35px;
            top: 20px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #38BDF8;
          }
        }
      `}</style>
    </section>
  );
}
