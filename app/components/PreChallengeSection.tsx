"use client";

import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

export default function PreChallengeSection() {
  return (
    <section
      id="pre-challenge"
      style={{
        background: "var(--bg-card)",
        padding: "80px 24px",
      }}
    >
      <div className="pre-challenge-grid">
        {/* LEFT COLUMN */}
        <FadeInUp>
          <div>
            <p
              style={{
                fontFamily: MONO,
                fontSize: "0.85rem",
                color: "var(--warning)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 16px",
              }}
            >
              PRE-CHALLENGE CLEARANCE
            </p>

            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 24px",
                lineHeight: 1.3,
              }}
            >
              Most traders spend $4,270 across failed challenges. X-Ray tells you if you&apos;re ready before you pay again.
            </h2>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: "52ch",
                margin: "0 0 16px",
              }}
            >
              X-Ray runs Monte Carlo simulation on your actual trade history.
              1,000 simulations. Your real win rate. Your real average loss.
              Your real behavior.
            </p>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: "52ch",
                margin: "0 0 16px",
              }}
            >
              If your pass probability is below 40%, we tell you not to fund.
              If it is above 60%, we give you the exact risk parameters to
              protect the account.
            </p>

            <p
              style={{
                fontFamily: MONO,
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                lineHeight: 1.65,
                maxWidth: "52ch",
                margin: "0 0 32px",
              }}
            >
              Either way, you stop donating evaluation fees to challenges you
              cannot statistically pass.
            </p>

            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginTop: '16px',
              textAlign: 'center',
              width: '100%',
            }}>
              Industry pass rate: 5–10% on first attempt.
              Your actual probability is in your data.
            </p>

            {/* Pricing */}
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "1.75rem",
                  color: "var(--accent-primary)",
                }}
              >
                $79
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginLeft: 8,
                }}
              >
                one-time · Pre-Challenge Clearance
              </span>
            </div>

            <Link
              href="/new"
              style={{
                display: "inline-block",
                background: "var(--accent-primary)",
                color: "var(--bg-base)",
                fontFamily: MONO,
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Get Clearance
            </Link>
          </div>
        </FadeInUp>

        {/* RIGHT COLUMN — pass probability gauge */}
        <FadeInUp delay={0.15}>
          <div>
            {/* Zone 1: NOT READY */}
            <div
              style={{
                background: "rgba(248,81,73,0.15)",
                borderLeft: "3px solid var(--loss)",
                padding: "0 20px",
                height: 80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 4,
              }}
            >
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.7rem",
                  color: "var(--loss)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 4px",
                }}
              >
                NOT READY
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                Pass probability &lt; 40%
              </p>
              <span style={{
                fontSize: '0.65rem',
                color: 'rgba(248,81,73,0.7)',
                fontFamily: 'JetBrains Mono, monospace',
                display: 'block',
                marginTop: '4px',
              }}>
                Most traders after 3+ failed challenges
              </span>
            </div>

            {/* Zone 2: BORDERLINE */}
            <div
              style={{
                background: "rgba(210,153,34,0.15)",
                borderLeft: "3px solid var(--warning)",
                padding: "0 20px",
                height: 80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 4,
              }}
            >
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.7rem",
                  color: "var(--warning)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 4px",
                }}
              >
                BORDERLINE
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                40% — 60% probability
              </p>
            </div>

            {/* Zone 3: CLEARED */}
            <div
              style={{
                background: "rgba(63,185,80,0.15)",
                borderLeft: "3px solid var(--profit)",
                padding: "0 20px",
                height: 80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.7rem",
                  color: "var(--profit)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 4px",
                }}
              >
                CLEARED
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                Pass probability &gt; 60%
              </p>
            </div>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Your actual probability is in your data.
              <br />
              X-Ray computes it. Not estimates it.
            </p>

            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              width: '100%',
              marginTop: '8px',
              fontStyle: 'italic',
            }}>
              Based on QuantVPS and Topstep published data, 2024-2025.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
