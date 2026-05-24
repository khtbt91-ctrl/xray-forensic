"use client";

import Link from "next/link";
import { FadeInUp } from "./shared";

export default function FinalCta() {
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
            <Link href="/new" className="btn btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
              Get Diagnosed
            </Link>
            <Link href="/sample" className="btn btn-ghost" style={{ fontSize: 15, padding: "14px 32px" }}>
              See Sample Verdict
            </Link>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}
