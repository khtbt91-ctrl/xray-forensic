"use client";

import Link from "next/link";
import { MONO, FadeInUp } from "./shared";

export default function SamplePreview() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px" }}>
      <FadeInUp style={{ textAlign: "center", width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: 12,
            width: "100%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Sample Report
        </p>
        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: "0 0 48px",
          }}
        >
          This is 10% of what you get.
        </h2>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <iframe
            src="/sample"
            style={{ width: "100%", height: 600, border: "none", display: "block" }}
            title="Sample X-Ray Report"
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              background: "linear-gradient(to bottom, transparent, var(--bg-base))",
              pointerEvents: "none",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link href="/sample" target="_blank" className="btn btn-ghost" style={{ fontSize: 14, padding: "12px 28px" }}>
            See Full Report →
          </Link>
        </div>
      </FadeInUp>
    </section>
  );
}
