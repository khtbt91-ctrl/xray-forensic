"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode, FormEvent } from "react";
import NavBar from "../components/NavBar";

const MONO = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";
const GOLD = "#e5b83c";

type Status = "COMPLETE" | "ACTIVE" | "NEXT" | "PLANNED" | "VISION";

const DOT_COLOR: Record<Status, string> = {
  COMPLETE: "#10b981",
  ACTIVE:   "#3b82f6",
  NEXT:     "#e5b83c",
  PLANNED:  "#475569",
  VISION:   "#8b5cf6",
};

const BADGE_BG: Record<Status, string> = {
  COMPLETE: "rgba(16,185,129,0.1)",
  ACTIVE:   "rgba(59,130,246,0.1)",
  NEXT:     "rgba(229,184,60,0.1)",
  PLANNED:  "rgba(71,85,105,0.1)",
  VISION:   "rgba(139,92,246,0.1)",
};

const CARD_BG: Record<Status, string> = {
  COMPLETE: "rgba(14,22,38,0.8)",
  ACTIVE:   "#10192d",
  NEXT:     "rgba(16,25,45,0.8)",
  PLANNED:  "rgba(14,22,38,0.8)",
  VISION:   "rgba(14,22,38,0.8)",
};

const CARD_BORDER: Record<Status, string> = {
  COMPLETE: "#1e293b",
  ACTIVE:   "#3b82f6",
  NEXT:     "rgba(229,184,60,0.2)",
  PLANNED:  "#1e293b",
  VISION:   "rgba(139,92,246,0.2)",
};

const DOT_ANIM: Record<Status, string> = {
  COMPLETE: "",
  ACTIVE:   "roadmap-dot-active",
  NEXT:     "",
  PLANNED:  "",
  VISION:   "",
};

interface Phase {
  num: string;
  status: Status;
  title: string;
  body: string;
}

const ACT1: Phase[] = [
  {
    num: "PHASE 0",
    status: "COMPLETE",
    title: "Forensic Foundation",
    body: "The engine exists. CSV parser, 7-dimension behavioral scoring, rule-based insights engine, protocol library. Tested and validated on 639 real trades.",
  },
  {
    num: "PHASE 1",
    status: "ACTIVE",
    title: "The Platform",
    body: "Live at xrayforensic.com. Upload your trades, receive a forensic diagnosis. AI-powered reports. Prop firm challenge mode. Pre-challenge Monte Carlo simulation. The first tool of its kind.",
  },
];

const ACT2: Phase[] = [
  {
    num: "PHASE 2",
    status: "NEXT",
    title: "Intelligence Layer",
    body: "Your trading has a pattern. Phase 2 makes it visible over time. Trader DNA profiles. Prescription compliance tracking. What-If engine. Pre-session briefings. Anonymous peer benchmarking. Subscription tiers.",
  },
  {
    num: "PHASE 3",
    status: "PLANNED",
    title: "Live Intervention",
    body: "Diagnosis after the fact is valuable. Intervention before damage occurs is different.\n\nReal-time account monitoring. Behavioral alerts before you pull the trigger — not after. Automated protection protocols. Multi-account visibility.\n[Further details withheld]",
  },
];

const ACT3: Phase[] = [
  {
    num: "PHASE 4",
    status: "PLANNED",
    title: "AI Diagnostic Intelligence",
    body: "A model trained exclusively on forensically-diagnosed trading behavior. Conversational. It has read every trade you've ever taken. Ask it anything.\n[Architecture details proprietary]",
  },
  {
    num: "PHASE 5",
    status: "PLANNED",
    title: "Funded Account Program",
    body: "X-Ray-verified discipline certification as the qualification pathway. Not a challenge. Not a fee. Proven behavioral consistency is the application.\nCapital is the reward.\n[Program structure to be announced]",
  },
  {
    num: "PHASE 6",
    status: "VISION",
    title: "The Institutional Layer",
    body: "White-label forensic intelligence for prop firms and trading desks. Behavioral risk management at scale. Firm-wide trader analytics.\n[Invitation only]",
  },
];

/* ─── FadeIn ───────────────────────────────────────────────────────────────── */

function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.style.transitionDelay = `${delay}s`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("about-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "-20px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="about-fade" style={style}>
      {children}
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "calc(64px + 80px) 40px 64px" }}>
      <FadeIn>
        <p style={{
          fontFamily: MONO,
          fontSize: 11,
          color: GOLD,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: "0 0 16px",
        }}>
          PRODUCT EVOLUTION
        </p>
        <h1 style={{
          fontFamily: SPACE,
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          color: "#f8fafc",
          margin: "0 0 16px",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
        }}>
          Platform Development Roadmap
        </h1>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          color: "#94a3b8",
          lineHeight: 1.65,
          maxWidth: 520,
          margin: 0,
        }}>
          Built in sequence. Each phase funds the next. Where we&apos;ve been — and where we&apos;re going.
        </p>
      </FadeIn>
    </div>
  );
}

/* ─── Act divider ──────────────────────────────────────────────────────────── */

function ActDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 56, marginTop: 24 }}>
      <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
      <span style={{
        fontFamily: MONO,
        fontSize: 11,
        color: GOLD,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
    </div>
  );
}

/* ─── Phase item ───────────────────────────────────────────────────────────── */

function PhaseItem({ phase, isLast }: { phase: Phase; isLast: boolean }) {
  const dotColor = DOT_COLOR[phase.status];
  const animClass = DOT_ANIM[phase.status];

  return (
    <FadeIn>
      <div style={{
        position: "relative",
        paddingLeft: 52,
        paddingBottom: isLast ? 0 : 48,
      }}>
        {/* Timeline dot */}
        <div
          className={animClass}
          style={{
            position: "absolute",
            left: 14,
            top: 6,
            width: 13,
            height: 13,
            borderRadius: "50%",
            background: dotColor,
            border: `2px solid ${dotColor}`,
            zIndex: 1,
            boxShadow: phase.status === "ACTIVE" ? `0 0 10px ${dotColor}55` : "none",
          }}
        />

        {/* Card */}
        <div style={{
          background: CARD_BG[phase.status],
          border: `1px solid ${CARD_BORDER[phase.status]}`,
          borderRadius: 10,
          padding: "20px 24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: MONO,
              fontSize: 11,
              color: dotColor,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              {phase.num}
            </span>
            <span style={{
              fontFamily: MONO,
              fontSize: "0.62rem",
              color: dotColor,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "2px 8px",
              background: BADGE_BG[phase.status],
              border: `1px solid ${dotColor}40`,
              borderRadius: 3,
            }}>
              {phase.status}
            </span>
          </div>

          <h3 style={{
            fontFamily: SPACE,
            fontSize: 20,
            fontWeight: 700,
            color: "#f8fafc",
            margin: "0 0 10px",
            lineHeight: 1.25,
            textTransform: "uppercase",
          }}>
            {phase.title}
          </h3>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
            color: "#94a3b8",
            margin: 0,
            maxWidth: 540,
            whiteSpace: "pre-line",
            fontWeight: 300,
          }}>
            {phase.body}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Act block ────────────────────────────────────────────────────────────── */

function ActBlock({ label, phases, marginTop = 96 }: { label: string; phases: Phase[]; marginTop?: number }) {
  return (
    <div style={{ marginTop }}>
      <ActDivider label={label} />
      <div style={{ position: "relative" }}>
        {/* Vertical timeline line */}
        <div style={{
          position: "absolute",
          left: 20,
          top: 6,
          bottom: 6,
          width: 1,
          background: "#1e293b",
          zIndex: 0,
        }} />
        {phases.map((p, i) => (
          <PhaseItem key={p.num} phase={p} isLast={i === phases.length - 1} />
        ))}
      </div>
    </div>
  );
}

/* ─── Timeline section ─────────────────────────────────────────────────────── */

function TimelineSection() {
  return (
    <section style={{ borderTop: "1px solid #1e293b" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 40px 96px" }}>
        <ActBlock label="PROOF" phases={ACT1} marginTop={0} />
        <ActBlock label="WHAT'S COMING FOR YOU" phases={ACT2} />
        <ActBlock label="WHAT THIS BECOMES" phases={ACT3} />
      </div>
    </section>
  );
}

/* ─── Funded CTA ───────────────────────────────────────────────────────────── */

function FundedCtaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, type: "funded" }),
      });
      if (!res.ok) throw new Error("api_failed");
      setSubmitted(true);
    } catch {
      window.open(
        `mailto:admin@xrayforensic.com?subject=Funded%20Account%20Interest&body=${encodeURIComponent(trimmed)}`,
        "_blank"
      );
      setSubmitted(true);
    }
  }

  return (
    <section style={{ background: "#0b1220", borderTop: "1px solid #1e293b", padding: "80px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <p style={{
            fontFamily: MONO,
            fontSize: 11,
            color: GOLD,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: "0 0 20px",
          }}>
            On the Horizon
          </p>
          <h2 style={{
            fontFamily: SPACE,
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 800,
            color: "#f8fafc",
            margin: "0 0 24px",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}>
            Funded.
          </h2>
          <div style={{ maxWidth: 540, margin: "0 auto 40px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.65, color: "#94a3b8", margin: "0 0 14px" }}>
              Not by passing a challenge.
              <br />
              By proving you&apos;re already disciplined.
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.65, color: "#94a3b8", margin: 0 }}>
              X-Ray Phase 5 opens a proprietary funded account pathway for
              traders who hold verified discipline certification. Expression of
              interest is open now.
            </p>
          </div>

          {submitted ? (
            <div style={{
              background: "#0e1626",
              border: "1px solid #10b981",
              borderRadius: 8,
              padding: "24px 28px",
              maxWidth: 480,
              margin: "0 auto",
            }}>
              <p style={{ fontFamily: MONO, fontSize: "0.72rem", color: "#10b981", letterSpacing: "0.12em", margin: "0 0 10px" }}>
                ✓ REGISTERED
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "#f8fafc", margin: 0 }}>
                You&apos;re on the list. We&apos;ll be in touch when Phase 5 opens.
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  maxWidth: 520,
                  margin: "0 auto 16px",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="funded-input"
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    background: "#0e1626",
                    border: "1px solid #1e293b",
                    borderRadius: 6,
                    padding: "12px 16px",
                    color: "#f8fafc",
                    fontSize: 15,
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#1e293b" }}
                />
                <button
                  type="submit"
                  style={{
                    background: GOLD,
                    color: "#000",
                    border: "none",
                    borderRadius: 6,
                    padding: "12px 24px",
                    fontFamily: SPACE,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#b88d1d" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = GOLD }}
                >
                  Register Interest →
                </button>
              </form>
              <p style={{ fontFamily: MONO, fontSize: 11, color: "#475569", letterSpacing: "0.06em", margin: 0 }}>
                Limited positions. Certification-gated. No fee to apply.
              </p>
            </>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Footer tagline ───────────────────────────────────────────────────────── */

function FooterTagline() {
  return (
    <footer style={{ padding: "48px 24px", textAlign: "center", borderTop: "1px solid #1e293b", background: "#050811" }}>
      <p style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        lineHeight: 1.65,
        color: "#475569",
        fontStyle: "italic",
        margin: 0,
      }}>
        We build in sequence.
        <br />
        Each phase funds the next.
        <br />
        The platform you see today is the foundation — not the ceiling.
      </p>
    </footer>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function RoadmapPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#050811", color: "#f8fafc" }}>
      <NavBar />
      <HeroSection />
      <TimelineSection />
      <FundedCtaSection />
      <FooterTagline />
    </main>
  );
}
