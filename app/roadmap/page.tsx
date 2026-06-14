"use client";

import { useRef, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";

const MONO  = "'JetBrains Mono', monospace";
const SPACE = "'Space Grotesk', sans-serif";
const GOLD  = "#e5b83c";
const BG    = "#050811";
const CARD  = "#0e1626";
const BORDER = "#1e293b";

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

/* ─── Status config ────────────────────────────────────────────────────────── */

type Status = "live" | "building" | "classified" | "redacted";

const STATUS_DOT: Record<Status, string>    = {
  live:       "#10b981",
  building:   GOLD,
  classified: "#475569",
  redacted:   "#374151",
};
const STATUS_LABEL: Record<Status, string>  = {
  live:       "LIVE",
  building:   "IN PROGRESS",
  classified: "COMING",
  redacted:   "REDACTED",
};
const STATUS_BADGE_BG: Record<Status, string> = {
  live:       "rgba(16,185,129,0.12)",
  building:   "rgba(229,184,60,0.12)",
  classified: "rgba(71,85,105,0.12)",
  redacted:   "rgba(30,41,59,0.4)",
};
const STATUS_CARD_BORDER: Record<Status, string> = {
  live:       "rgba(16,185,129,0.25)",
  building:   `rgba(229,184,60,0.25)`,
  classified: BORDER,
  redacted:   "#1a2030",
};

/* ─── Phase data ───────────────────────────────────────────────────────────── */

interface Phase {
  num:       string;
  status:    Status;
  label:     string;
  body:      string;
  features?: string[];
  teasers?:  string[];
}

const PHASES: Phase[] = [
  {
    num:    "PHASE 1",
    status: "live",
    label:  "FORENSIC ENGINE",
    body:   "The diagnostic core. Upload your trades, receive your verdict.",
    features: [
      "7-dimension behavioral scoring",
      "Institutional archetype detection",
      "Tier-gated prescriptions with dollar impact",
      "The Foundations field manual",
      "Operator rank and discipline tracking",
      "Multi-format MT5 parsing",
    ],
  },
  {
    num:    "PHASE 2",
    status: "building",
    label:  "DAILY INTELLIGENCE",
    body:   "X-Ray becomes something you open every morning before you trade — and every evening after.",
    features: [
      "Pre-session tactical briefing (personalized to your data)",
      "Economic event integration",
      "End-of-session debrief protocol",
      "Discipline streak verification",
      "The briefing gets sharper with every upload",
    ],
  },
  {
    num:     "PHASE 3",
    status:  "classified",
    label:   "THE IMPROVEMENT ENGINE",
    body:    "Your scores don't just measure. They move. Every upload is compared to the last. The question stops being 'how bad is it' and becomes 'how fast am I fixing it.'",
    teasers: [
      "See exactly what changed since your last upload",
      "Retroactively test rules against your own history",
      "Your prescriptions, tracked and verified",
    ],
  },
  {
    num:     "PHASE 4",
    status:  "classified",
    label:   "CHALLENGE INTELLIGENCE",
    body:    "For traders attempting funded challenges. We are not ready to talk about this yet.",
    teasers: [
      "Pass probability. Failure prediction. The math behind whether you're ready.",
    ],
  },
  {
    num:     "PHASE 5",
    status:  "classified",
    label:   "THE NETWORK",
    body:    "When enough traders are diagnosed, patterns emerge that no individual can see alone.",
    teasers: [
      "Your profile compared against thousands. What worked for traders exactly like you.",
    ],
  },
  {
    num:    "PHASE 6",
    status: "redacted",
    label:  "[REDACTED]",
    body:   "This phase exists. Its contents do not — yet.",
  },
];

/* ─── Redacted text block ───────────────────────────────────────────────────── */

function RedactedBlock() {
  const bars = [
    { w: "82%"  },
    { w: "67%"  },
    { w: "75%"  },
    { w: "54%"  },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
      {bars.map((b, i) => (
        <div key={i} style={{
          height: 13,
          width: b.w,
          background: "#0f1520",
          borderRadius: 2,
          border: "1px solid #1a2535",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle gloss line */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "rgba(255,255,255,0.02)",
          }} />
        </div>
      ))}
      <p style={{
        fontFamily: MONO,
        fontSize: 10,
        color: "#334155",
        margin: "4px 0 0",
        letterSpacing: "0.08em",
      }}>
        ████ ██████ ████████████ ██ ████ ███████
      </p>
    </div>
  );
}

/* ─── Phase card ───────────────────────────────────────────────────────────── */

function PhaseCard({ phase, isLast }: { phase: Phase; isLast: boolean }) {
  const dotColor   = STATUS_DOT[phase.status];
  const isBuilding = phase.status === "building";
  const isRedacted = phase.status === "redacted";

  return (
    <FadeIn>
      <div style={{
        position: "relative",
        paddingLeft: 52,
        paddingBottom: isLast ? 0 : 52,
      }}>
        {/* Timeline dot */}
        <div
          className={isBuilding ? "timeline-dot-active" : undefined}
          style={{
            position:    "absolute",
            left:        13,
            top:         8,
            width:       12,
            height:      12,
            borderRadius: "50%",
            background:  dotColor,
            zIndex:      1,
            boxShadow:   phase.status === "live"
              ? `0 0 8px ${dotColor}66`
              : "none",
          }}
        />

        {/* Card */}
        <div style={{
          background:   CARD,
          border:       `1px solid ${STATUS_CARD_BORDER[phase.status]}`,
          borderLeft:   phase.status === "live"
            ? `3px solid ${dotColor}`
            : phase.status === "building"
            ? `3px solid ${dotColor}`
            : `1px solid ${STATUS_CARD_BORDER[phase.status]}`,
          borderRadius: 8,
          padding:      "20px 24px",
          opacity:      isRedacted ? 0.7 : 1,
        }}>

          {/* Top row: phase number + badge */}
          <div style={{
            display:     "flex",
            alignItems:  "center",
            gap:         10,
            marginBottom: 12,
            flexWrap:    "wrap",
          }}>
            <span style={{
              fontFamily:    MONO,
              fontSize:      10,
              color:         "#475569",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              {phase.num}
            </span>

            {/* Status badge */}
            <span
              className={isBuilding ? "animate-pulse-subtle" : undefined}
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           5,
                fontFamily:    MONO,
                fontSize:      "0.6rem",
                color:         dotColor,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding:       "2px 8px",
                background:    STATUS_BADGE_BG[phase.status],
                border:        `1px solid ${dotColor}40`,
                borderRadius:  3,
              }}
            >
              <span style={{
                width:       5,
                height:      5,
                borderRadius: "50%",
                background:  dotColor,
                display:     "inline-block",
                flexShrink:  0,
              }} />
              {isRedacted ? "████████" : STATUS_LABEL[phase.status]}
              {isRedacted && (
                <span style={{ marginLeft: 2, fontSize: "0.7rem" }}>🔒</span>
              )}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily:    SPACE,
            fontSize:      18,
            fontWeight:    700,
            color:         isRedacted ? "#334155" : "#f8fafc",
            margin:        "0 0 10px",
            letterSpacing: "-0.01em",
          }}>
            {phase.label}
          </h3>

          {/* Body */}
          <p style={{
            fontFamily: MONO,
            fontSize:   12,
            lineHeight: 1.7,
            color:      phase.status === "live" ? "#94a3b8" : "#64748b",
            margin:     0,
            maxWidth:   520,
          }}>
            {phase.body}
          </p>

          {/* Feature list (LIVE + BUILDING) */}
          {phase.features && phase.features.length > 0 && (
            <ul style={{
              margin:        "14px 0 0",
              padding:       0,
              listStyle:     "none",
              display:       "flex",
              flexDirection: "column",
              gap:           6,
            }}>
              {phase.features.map((f, i) => (
                <li key={i} style={{
                  fontFamily: MONO,
                  fontSize:   11,
                  color:      phase.status === "live" ? "#64748b" : "#475569",
                  display:    "flex",
                  gap:        8,
                  alignItems: "flex-start",
                  lineHeight: 1.5,
                }}>
                  <span style={{
                    color:     dotColor,
                    flexShrink: 0,
                    marginTop: 1,
                  }}>
                    —
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Teaser lines (CLASSIFIED / COMING) */}
          {phase.teasers && phase.teasers.length > 0 && (
            <div style={{
              marginTop:    14,
              display:      "flex",
              flexDirection: "column",
              gap:          8,
            }}>
              {phase.teasers.map((t, i) => (
                <p key={i} style={{
                  fontFamily: MONO,
                  fontSize:   11,
                  color:      "#475569",
                  margin:     0,
                  lineHeight: 1.6,
                  fontStyle:  "italic",
                  paddingLeft: 12,
                  borderLeft: `2px solid #2d3748`,
                }}>
                  {t}
                </p>
              ))}
            </div>
          )}

          {/* Redacted block */}
          {isRedacted && <RedactedBlock />}
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Page header ──────────────────────────────────────────────────────────── */

function PageHeader() {
  return (
    <div style={{
      maxWidth: 800,
      margin:   "0 auto",
      padding:  "calc(64px + 80px) 40px 64px",
    }}>
      <FadeIn>
        <p style={{
          fontFamily:    MONO,
          fontSize:      10,
          color:         GOLD,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin:        "0 0 20px",
        }}>
          SYSTEM ROADMAP
        </p>

        <h1 style={{
          fontFamily:    SPACE,
          fontSize:      "clamp(2rem, 5vw, 2.5rem)",
          fontWeight:    700,
          color:         "#f8fafc",
          margin:        "0 0 16px",
          lineHeight:    1.1,
          letterSpacing: "-0.02em",
        }}>
          What&apos;s coming.
        </h1>

        <p style={{
          fontSize:   16,
          color:      "#94a3b8",
          lineHeight: 1.65,
          maxWidth:   600,
          margin:     "0 0 28px",
        }}>
          X-Ray Forensic is live and operational. What you see today is Phase 1.
          What&apos;s being built behind it will change how traders develop permanently.
          Some of it is close. Some of it isn&apos;t ready to talk about yet.
        </p>

        {/* Status line */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        20,
          flexWrap:   "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width:        6,
              height:       6,
              borderRadius: "50%",
              background:   "#10b981",
              display:      "inline-block",
              boxShadow:    "0 0 6px #10b98166",
            }} />
            <span style={{
              fontFamily:    MONO,
              fontSize:      11,
              color:         "#10b981",
              letterSpacing: "0.1em",
            }}>
              SYSTEM STATUS: OPERATIONAL
            </span>
          </div>
          <span style={{ color: "#1e293b", fontFamily: MONO, fontSize: 11 }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="timeline-dot-active"
              style={{
                width:        6,
                height:       6,
                borderRadius: "50%",
                background:   GOLD,
                display:      "inline-block",
              }}
            />
            <span style={{
              fontFamily:    MONO,
              fontSize:      11,
              color:         GOLD,
              letterSpacing: "0.1em",
            }}>
              BUILD STATUS: ACTIVE
            </span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

function Timeline() {
  return (
    <section style={{ borderTop: `1px solid ${BORDER}` }}>
      <div style={{
        maxWidth: 800,
        margin:   "0 auto",
        padding:  "64px 40px 96px",
      }}>
        <div style={{ position: "relative" }}>
          {/* Vertical gold line */}
          <div style={{
            position:   "absolute",
            left:       18,
            top:        8,
            bottom:     8,
            width:      2,
            background: `linear-gradient(to bottom, ${GOLD}66, ${GOLD}22 60%, transparent)`,
            zIndex:     0,
          }} />

          {PHASES.map((phase, i) => (
            <PhaseCard
              key={phase.num}
              phase={phase}
              isLast={i === PHASES.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Bottom CTA ───────────────────────────────────────────────────────────── */

function BottomCta() {
  return (
    <section style={{
      background: "#0b1220",
      borderTop:  `1px solid ${BORDER}`,
      padding:    "80px 24px",
    }}>
      <div style={{
        maxWidth:   640,
        margin:     "0 auto",
        textAlign:  "center",
      }}>
        <FadeIn>
          <h2 style={{
            fontFamily:    SPACE,
            fontSize:      "clamp(1.5rem, 4vw, 2rem)",
            fontWeight:    700,
            color:         "#f8fafc",
            margin:        "0 0 16px",
            letterSpacing: "-0.02em",
            lineHeight:    1.2,
          }}>
            Want early access to what&apos;s next?
          </h2>

          <p style={{
            fontSize:   16,
            color:      "#64748b",
            lineHeight: 1.65,
            margin:     "0 0 36px",
            maxWidth:   480,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Join the network. First to know.
            First to test. First to benefit.
          </p>

          <div style={{
            display:        "flex",
            gap:            12,
            justifyContent: "center",
            flexWrap:       "wrap",
            marginBottom:   40,
          }}>
            <a
              href="mailto:admin@xrayforensic.com?subject=Community"
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           6,
                background:    GOLD,
                color:         "#000",
                border:        "none",
                borderRadius:  6,
                padding:       "12px 24px",
                fontFamily:    SPACE,
                fontSize:      14,
                fontWeight:    700,
                cursor:        "pointer",
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition:    "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#b88d1d" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GOLD }}
            >
              Join the Community →
            </a>

            <Link
              href="/new"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            6,
                background:     "transparent",
                color:          GOLD,
                border:         `1px solid ${GOLD}55`,
                borderRadius:   6,
                padding:        "12px 24px",
                fontFamily:     SPACE,
                fontSize:       14,
                fontWeight:     700,
                cursor:         "pointer",
                textDecoration: "none",
                letterSpacing:  "0.02em",
                transition:     "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = GOLD
                e.currentTarget.style.color = "#f8fafc"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${GOLD}55`
                e.currentTarget.style.color = GOLD
              }}
            >
              Get Diagnosed →
            </Link>
          </div>

          <p style={{
            fontFamily:    MONO,
            fontSize:      11,
            color:         "#334155",
            letterSpacing: "0.08em",
            margin:        0,
          }}>
            Built by a trader. For traders. From Beirut.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function RoadmapPage() {
  return (
    <main style={{ minHeight: "100vh", background: BG, color: "#f8fafc" }}>
      <NavBar />
      <PageHeader />
      <Timeline />
      <BottomCta />
    </main>
  );
}
