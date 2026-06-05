"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NavBar from "../components/NavBar";

const MONO = "JetBrains Mono, monospace";
const SERIF = "'IBM Plex Serif', serif";

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
      { threshold: 0.05, rootMargin: "-30px" }
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

function Label({ text, color }: { text: string; color?: string }) {
  return (
    <p
      style={{
        fontFamily: MONO,
        fontSize: "0.7rem",
        color: color ?? "var(--text-muted)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        margin: "0 0 16px",
      }}
    >
      {text}
    </p>
  );
}

function SectionHeadline({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: "0 0 24px",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <div className="about-hero-inner">
      <FadeIn>
        <Label text="The Origin Story" color="var(--accent-primary)" />
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            margin: "0 0 32px",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Built from experience.
          <br />
          <span style={{ color: "var(--text-secondary)" }}>Not theory.</span>
        </h1>
      </FadeIn>
      <FadeIn
        delay={0.1}
        style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 20 }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          X-Ray was built by a professional trader with 15 years of live market experience across
          foreign exchange, commodities, indices, and digital assets. Not backtested theory. Not
          academic research. Live capital, live markets, live consequences.
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          After 15 years of studying why traders fail — not in textbooks, but in real-time on
          institutional charts — the patterns became undeniable. The same behavioral signatures.
          The same liquidity misreads. The same psychological sequences. Every time. Across every
          market.
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          X-Ray encodes those 15 years into a proprietary diagnostic framework. The methodology
          is not borrowed from public sources. It was built trade by trade, pattern by pattern,
          over a decade and a half of institutional observation.
        </p>
      </FadeIn>
    </div>
  );
}

/* ─── CORE BELIEFS ─────────────────────────────────────────────────────────── */

const BELIEFS = [
  {
    num: "01",
    title: "The data doesn't lie.",
    body: "Hard truths from your own trade history are the only actionable feedback that matters. Narrative, excuses, and market blame are expensive habits.",
  },
  {
    num: "02",
    title: "Patterns repeat.",
    body: "Human psychology is consistent. The same behavioral signatures appear across every market, every account size, every experience level. Without exception.",
  },
  {
    num: "03",
    title: "Discipline is measurable.",
    body: "Good execution isn't a feeling — it's a score. It can be tracked, diagnosed, and systematically improved when you have the right diagnostic tools.",
  },
  {
    num: "04",
    title: "Most losses are preventable.",
    body: "Not all of them. But the behavioral ones — repeating mistakes, emotional overrides, sizing errors — are entirely fixable with accurate self-knowledge.",
  },
];

function CoreBeliefsSection() {
  return (
    <section style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="about-inner">
        <FadeIn>
          <Label text="What We Believe" />
          <SectionHeadline>The principles behind the diagnostic.</SectionHeadline>
        </FadeIn>
        <div className="beliefs-grid">
          {BELIEFS.map((b, i) => (
            <FadeIn key={b.num} delay={i * 0.08}>
              <div
                className="card"
                style={{ padding: 28, height: "100%", boxSizing: "border-box" }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.65rem",
                    color: "var(--accent-primary)",
                    letterSpacing: "0.12em",
                    marginBottom: 14,
                  }}
                >
                  {b.num}
                </div>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: "0 0 10px",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  {b.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── THE INTELLIGENCE ─────────────────────────────────────────────────────── */

function IntelligenceSection() {
  return (
    <section
      style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="about-inner">
        <FadeIn>
          <Label text="The Intelligence" />
          <SectionHeadline>Not an algorithm. A practitioner.</SectionHeadline>
        </FadeIn>
        <div className="intelligence-grid">
          {/* Left — Human Layer */}
          <FadeIn delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 20px",
                }}
              >
                15 Years. Live Markets. Real Capital.
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.72,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  The diagnostic framework behind X-Ray was not built in a laboratory. It was
                  built on live trading desks, across foreign exchange, gold, indices, and digital
                  assets — in real market conditions with real money at risk.
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.72,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  Every threshold, every behavioral flag, every prescription in the protocol
                  library reflects patterns observed across thousands of live trades and hundreds
                  of trader profiles studied over 15 years.
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.72,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  When X-Ray tells you your stop placement is in a liquidity pool — that
                  observation comes from someone who has engineered those pools, studied them, and
                  traded around them for over a decade.
                </p>
              </div>
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--accent-primary)" }}>
                  Human expertise. Machine precision. Combined.
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Right — Technology Layer */}
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 20px",
                }}
              >
                Proprietary. Evolving. Compounding.
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.72,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  The diagnostic engine applies a multi-dimensional framework developed exclusively
                  for X-Ray. The specific methodology, scoring architecture, and pattern recognition
                  logic are proprietary and not publicly disclosed.
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.72,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  Every analysis the platform runs improves the next one. Every trader diagnosed
                  adds to a growing intelligence base that no competitor can replicate — because
                  the data compounds with time, not with investment.
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.72,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  This is not a tool built on borrowed frameworks. It is a system built on 15
                  years of institutional observation, encoded into machine-readable logic, and
                  continuously refined.
                </p>
              </div>
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: "var(--warning)" }}>
                  The methodology is proprietary. The results are yours.
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── ROADMAP ───────────────────────────────────────────────────────────────── */

type PhaseStatus = "COMPLETE" | "ACTIVE" | "NEXT" | "PLANNED" | "VISION";

const STATUS_COLORS: Record<PhaseStatus, string> = {
  COMPLETE: "var(--profit)",
  ACTIVE: "var(--accent-primary)",
  NEXT: "var(--warning)",
  PLANNED: "var(--text-muted)",
  VISION: "var(--text-muted)",
};

const PHASES: { phase: string; status: PhaseStatus; title: string; body: string }[] = [
  {
    phase: "Phase 0",
    status: "COMPLETE",
    title: "Forensic Foundation",
    body: "CSV parser, 7-dimension behavioral scoring, rule-based insights engine, protocol library. Tested and validated on real trade data.",
  },
  {
    phase: "Phase 1",
    status: "ACTIVE",
    title: "The Platform",
    body: "Self-serve web application. Upload, pay, diagnose. AI-powered forensic reports. Prop firm context mode. Live at xrayforensic.com.",
  },
  {
    phase: "Phase 2",
    status: "NEXT",
    title: "Intelligence Layer",
    body: "Trader DNA profiles. Prescription compliance tracking. Pre-session briefing. What-If engine. Anonymous peer benchmarking.",
  },
  {
    phase: "Phase 3",
    status: "PLANNED",
    title: "Live Intervention",
    body: "Real-time account monitoring. Behavioral alerts before damage occurs — not after. Automated protection protocols. Multi-account visibility. [Further details withheld]",
  },
  {
    phase: "Phase 4",
    status: "PLANNED",
    title: "AI Diagnostic Intelligence",
    body: "Conversational AI diagnostic layer. Natural language trade analysis. AI-powered signal intelligence framework. A proprietary model trained exclusively on forensically-diagnosed trading behavior — the only model of its kind in existence. [Architecture details proprietary]",
  },
  {
    phase: "Phase 5",
    status: "PLANNED",
    title: "Funded Account Program",
    body: "Proprietary funded trader evaluation program. X-Ray-verified discipline certification as qualification pathway. Terms and structure to be announced. Expression of interest opens Phase 4. [Program details to be released]",
  },
  {
    phase: "Phase 6",
    status: "VISION",
    title: "The Institutional Layer",
    body: "White-label forensic intelligence for prop firms and trading desks. Institutional-grade behavioral risk management tools. Firm-wide trader analytics. Partnership program for qualified institutions. [Invitation only]",
  },
];

function RoadmapSection() {
  return (
    <section style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="about-inner">
        <FadeIn>
          <Label text="Roadmap" />
          <SectionHeadline>Where we&apos;ve been. Where we&apos;re going.</SectionHeadline>
        </FadeIn>
        <div style={{ position: "relative", marginTop: 40 }}>
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 6,
              bottom: 6,
              width: 1,
              background: "var(--border-subtle)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {PHASES.map((p, i) => {
              const isActive = p.status === "ACTIVE";
              const isComplete = p.status === "COMPLETE";
              const dotBg = isActive
                ? "var(--accent-primary)"
                : isComplete
                ? "var(--profit)"
                : "var(--bg-elevated)";
              const dotBorder = isActive
                ? "var(--accent-primary)"
                : isComplete
                ? "var(--profit)"
                : "var(--border-active)";

              return (
                <FadeIn key={p.phase} delay={i * 0.06}>
                  <div
                    style={{
                      position: "relative",
                      paddingLeft: 52,
                      paddingBottom: i < PHASES.length - 1 ? 44 : 0,
                    }}
                  >
                    <div
                      className={isActive ? "timeline-dot-active" : ""}
                      style={{
                        position: "absolute",
                        left: 14,
                        top: 5,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: dotBg,
                        border: `2px solid ${dotBorder}`,
                        zIndex: 1,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {p.phase}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: "0.62rem",
                          color: STATUS_COLORS[p.status],
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "2px 7px",
                          border: `1px solid ${STATUS_COLORS[p.status]}`,
                          borderRadius: 3,
                          opacity: 0.9,
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: "0 0 8px",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.88rem",
                        lineHeight: 1.65,
                        color: "var(--text-secondary)",
                        margin: 0,
                        maxWidth: 580,
                      }}
                    >
                      {p.body}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CLOSING STATEMENT ────────────────────────────────────────────────────── */

function ClosingSection() {
  return (
    <section style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="about-inner">
        <FadeIn style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <blockquote
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontStyle: "italic",
              color: "var(--text-primary)",
              lineHeight: 1.55,
              margin: "0 0 36px",
              padding: 0,
              border: "none",
            }}
          >
            &ldquo;The traders who improve are not more talented. They are more honest about
            what the data shows. X-Ray provides the data. The rest is on you.&rdquo;
          </blockquote>
          <div style={{ marginBottom: 36 }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                margin: "0 0 6px",
              }}
            >
              — Built by a trader who spent 15 years learning what the data shows.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              — Encoded into a system so you don&apos;t have to.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/new"
              className="btn btn-primary"
              style={{ fontSize: "0.9rem", padding: "10px 24px" }}
            >
              Get Diagnosed
            </Link>
            <Link
              href="/sample"
              className="btn btn-ghost"
              style={{ fontSize: "0.9rem", padding: "10px 24px" }}
            >
              View Sample Verdict
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── WAITLIST ─────────────────────────────────────────────────────────────── */

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    await supabase.from("waitlist").upsert({ email: email.trim() }, { onConflict: "email" });
    setSubmitted(true);
  };

  return (
    <section
      style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="about-inner">
        <FadeIn style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Label text="Stay Ahead" />
          <SectionHeadline>Be first when Phase 4 opens.</SectionHeadline>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              margin: "0 0 32px",
            }}
          >
            AI live assessment. Signal intelligence. Funded account program. Expression of
            interest list opens first.
          </p>

          {submitted ? (
            <div
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--profit)",
                borderRadius: 8,
                padding: "24px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  color: "var(--profit)",
                  letterSpacing: "0.12em",
                  marginBottom: 10,
                }}
              >
                ✓ CONFIRMED
              </div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                You&apos;re on the list. We&apos;ll reach out when Phase 4 opens.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="waitlist-input"
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: "0.9rem", padding: "10px 24px", whiteSpace: "nowrap" }}
              >
                Join the List
              </button>
            </form>
          )}

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              margin: "16px 0 0",
            }}
          >
            No spam. No selling your data. One email when Phase 4 opens. Unsubscribe anytime.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "24px 40px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          margin: "0 0 8px",
        }}
      >
        Built on 15 years of institutional trading. Not financial advice. Diagnostic analysis only.
      </p>
      <p style={{ margin: "0 0 8px" }}>
        <Link
          href="/"
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          Home
        </Link>
        <span style={{ color: "var(--border-subtle)", margin: "0 10px" }}>·</span>
        <Link
          href="/about"
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "var(--accent-primary)",
            textDecoration: "none",
          }}
        >
          About
        </Link>
        <span style={{ color: "var(--border-subtle)", margin: "0 10px" }}>·</span>
        <Link
          href="/privacy"
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          Privacy Policy
        </Link>
        <span style={{ color: "var(--border-subtle)", margin: "0 10px" }}>·</span>
        <Link
          href="/terms"
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          Terms of Service
        </Link>
      </p>
      <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
        &copy; 2026 X-Ray &middot; Forensic trade diagnostic &middot; Not financial advice
        &middot; All trading involves risk
      </p>
    </footer>
  );
}

/* ─── PAGE ─────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      <NavBar />
      <HeroSection />
      <CoreBeliefsSection />
      <IntelligenceSection />
      <RoadmapSection />
      <ClosingSection />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
