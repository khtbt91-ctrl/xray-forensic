"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MONO } from "./shared";

const PREVIEW_PROTOCOLS = [
  {
    id: "01",
    title: "THE DEMO DISCIPLINE",
    preview:
      "The method loses money. No behavioral fix repairs a negative-expectancy system. Return to demo until the evidence shows a statistical edge.",
    triggerLines: ["Profit factor < 0.8", "> 15% trades without stop"],
  },
  {
    id: "05",
    title: "THE STOP LOSS MANDATE",
    preview:
      "Every position without a stop loss is an unbounded liability. There is no setup, no conviction, and no market condition that justifies unprotected exposure.",
    triggerLines: ["Any trade closed without a protective stop"],
  },
  {
    id: "06",
    title: "THE REVENGE PROTOCOL",
    preview:
      "Re-entering the market within minutes of a loss is not a trade. It is an emotional transaction with a negative expected value.",
    triggerLines: ["Any re-entry within 15 minutes of a losing close"],
  },
];

function ProtocolCard({
  proto,
}: {
  proto: (typeof PREVIEW_PROTOCOLS)[number];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${hovered ? "var(--border-active)" : "var(--border-subtle)"}`,
        borderRadius: 8,
        padding: "28px 24px",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        boxShadow: hovered
          ? "0 0 0 1px var(--border-active), 0 8px 28px rgba(0,0,0,0.45)"
          : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Protocol number */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: "2.5rem",
          fontWeight: 800,
          color: "var(--text-muted)",
          marginBottom: 14,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {proto.id}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: "0.78rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "var(--text-primary)",
          marginBottom: 16,
          lineHeight: 1.45,
        }}
      >
        {proto.title}
      </div>

      {/* Preview body */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          margin: "0 0 20px",
          flex: 1,
        }}
      >
        {proto.preview}
      </p>

      {/* Trigger tag */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: "0.68rem",
          color: "var(--warning)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: 14,
          lineHeight: 1.5,
        }}
      >
        TRIGGERED BY:{" "}
        {proto.triggerLines.length > 1 ? (
          <>
            {proto.triggerLines[0]}
            <br />
            <span style={{ textTransform: "none", color: "var(--text-muted)" }}>— or —</span>
            <br />
            {proto.triggerLines[1]}
          </>
        ) : (
          proto.triggerLines[0]
        )}
      </div>
    </div>
  );
}

export default function ProtocolsSection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".fade-in-up")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "100px 40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div className="fade-in-up">
          <div style={{ textAlign: "center", marginBottom: 60, width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
            <p
              style={{
                fontFamily: MONO,
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 20,
                textAlign: "center",
                width: "100%",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              WHAT X-RAY PRESCRIBES
            </p>
            <h2
              style={{
                fontFamily: MONO,
                fontSize: "clamp(22px, 3vw, 34px)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                margin: "0 0 20px",
                color: "var(--text-primary)",
                textAlign: "center",
              }}
            >
              12 INSTITUTIONAL PROTOCOLS
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                maxWidth: 560,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              X-Ray doesn&apos;t give you advice. It gives you protocols — the
              doctrines that separate retail from institutional.
            </p>
          </div>
        </div>

        {/* Protocol preview cards */}
        <div className="fade-in-up">
          <div className="protocols-grid">
            {PREVIEW_PROTOCOLS.map((proto) => (
              <ProtocolCard key={proto.id} proto={proto} />
            ))}
          </div>
        </div>

        {/* Footer + CTA */}
        <div className="fade-in-up">
          <div style={{ textAlign: "center", marginTop: 44, width: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: 28,
                textAlign: "center",
                width: "100%",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              9 more protocols included with every diagnosis.
            </p>
            <Link
              href="/new"
              className="btn btn-primary"
              style={{
                fontFamily: MONO,
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                padding: "12px 28px",
                textDecoration: "none",
              }}
            >
              GET YOUR PROTOCOLS →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
