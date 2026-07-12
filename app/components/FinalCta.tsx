"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FadeInUp } from "./shared";

export default function FinalCta() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-subtle)" }}>
      <FadeInUp>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "100px 40px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
              lineHeight: 1.15,
            }}
          >
            Your next losing streak is already in your data.
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.6 }}>
            X-Ray finds it before the market does.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => { setLoading(true); router.push('/new'); }}
              disabled={loading}
              className="btn btn-primary"
              style={{ fontSize: 15, padding: "14px 32px" }}
            >
              {loading ? 'Processing...' : 'Get Diagnosed'}
            </button>
            <Link href="/sample" className="btn btn-ghost" style={{ fontSize: 15, padding: "14px 32px" }}>
              See Sample Verdict
            </Link>
          </div>
          <p style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            marginTop: 28,
            lineHeight: 1.6,
          }}>
            X-Ray is a diagnostic tool — not financial advice. We never access your MT5 password
            or broker credentials. Your trade data is analyzed and immediately discarded.{" "}
            <Link href="/tools" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>
              Free export tools available.
            </Link>
          </p>
        </div>
      </FadeInUp>

      {/* Section 11: on-page disclaimer plate — structural, not a footnote (Art Director ruling).
          Verbatim long-form text from landing-hero-waitlist-v2.md, never previously placed
          on-page (only in /privacy, /terms). Never shrinks below 13px, never truncates. */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "48px 40px" }}>
        <div
          className="disclaimer-plate"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: "28px 32px",
            textAlign: "left",
          }}
        >
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 12px",
          }}>
            X-RAY FORENSIC
          </p>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            margin: 0,
          }}>
            This content is for education and information only. It is not investment advice,
            not a recommendation to buy or sell any asset, and not a substitute for advice from
            a licensed financial advisor in your jurisdiction. Trading involves substantial risk
            of loss.
          </p>
        </div>
      </div>
    </section>
  );
}
