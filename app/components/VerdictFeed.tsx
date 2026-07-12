"use client";

import { useEffect, useState } from "react";

const MONO = "var(--font-mono)";
const SPACE = "var(--font-sans)";

const ARCHETYPE_LEAK: Record<string, string> = {
  "Session Tourist":    "Off-session trading leak",
  "Revenge Chaser":    "Revenge re-entry pattern",
  "Risk Mismanager":   "Position oversizing detected",
  "Disciplined Sniper": "Minimal mechanical costs only",
  "Improving Student": "Kill zone compliance gap",
  "Streak Tilter":     "Tilt after loss runs",
  "Overtrader":        "Trade frequency leak",
};

const ACCOUNT_LABELS: Record<string, string> = {
  personal:             "PERSONAL ACCOUNT",
  prop_firm_challenge: "PROP FIRM CHALLENGE",
  funded:              "FUNDED ACCOUNT",
};

interface Verdict {
  archetype: string;
  score: number;
  account_type: string;
  time_ago: string;
  total_trades: number;
  is_example?: boolean;
}

function scoreColor(score: number): string {
  if (score < 40) return "var(--loss)";
  if (score <= 70) return "#38BDF8";
  return "#10b981";
}

function VerdictCard({ verdict }: { verdict: Verdict }) {
  const leak = ARCHETYPE_LEAK[verdict.archetype] ?? "Behavioral leak detected";
  const acctLabel = ACCOUNT_LABELS[verdict.account_type] ?? verdict.account_type.replace(/_/g, " ").toUpperCase();

  return (
    <div style={{
      background: '#131A24',
      border: '1px solid #26313F',
      borderRadius: 8,
      padding: '22px 26px',
      width: 360,
      maxWidth: '100%',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      {verdict.is_example && (
        <span style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: MONO, fontSize: 8, color: 'var(--text-muted)',
          letterSpacing: '0.1em', background: '#26313F',
          padding: '2px 6px', borderRadius: 3,
        }}>EXAMPLE</span>
      )}

      <div style={{
        fontFamily: MONO, fontSize: 9, color: 'var(--text-muted)',
        letterSpacing: '0.12em', marginBottom: 16,
      }}>
        JUST DIAGNOSED · {acctLabel}
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-muted)' }}>Archetype:&nbsp;</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-primary)', fontWeight: 700 }}>
          {verdict.archetype.toUpperCase()}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-muted)' }}>Overall Score:&nbsp;</span>
        <span style={{
          fontFamily: MONO, fontSize: 11, fontWeight: 700,
          color: scoreColor(verdict.score),
        }}>
          {verdict.score}/100
        </span>
      </div>

      <div style={{ marginBottom: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text-muted)' }}>Biggest Leak:</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 12, color: '#8B98A9', marginBottom: 18 }}>
        {leak}
      </div>

      <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--border-subtle)' }}>
        {verdict.time_ago}
        {verdict.total_trades ? ` · ${verdict.total_trades.toLocaleString()} trades analyzed` : ''}
      </div>
    </div>
  );
}

export default function VerdictFeed() {
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recent-verdicts`)
      .then(r => r.json())
      .then((data: any) => {
        if (data.verdicts?.length > 0) {
          setVerdicts(data.verdicts.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (verdicts.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      const t = setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % verdicts.length);
        setFading(false);
      }, 500);
      return () => clearTimeout(t);
    }, 8000);
    return () => clearInterval(interval);
  }, [verdicts.length]);

  if (verdicts.length === 0) return null;

  const current = verdicts[activeIdx];

  return (
    <section style={{ padding: '96px 0', background: '#0A0E14' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{
            fontFamily: MONO, fontSize: 10, color: '#38BDF8',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>
            LIVE DIAGNOSTIC FEED
          </p>
          <h2 style={{
            fontFamily: SPACE,
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}>
            What X-Ray is finding right now.
          </h2>
          <p style={{
            fontFamily: MONO, fontSize: 12, color: 'var(--text-muted)',
            letterSpacing: '0.04em', margin: 0,
          }}>
            Anonymized. Real accounts. Real patterns. Updated continuously.
          </p>
        </div>

        {/* Single card with fade transition */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            <VerdictCard verdict={current} />
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {verdicts.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFading(true);
                setTimeout(() => { setActiveIdx(i); setFading(false); }, 300);
              }}
              style={{
                width: i === activeIdx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === activeIdx ? '#38BDF8' : '#26313F',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
              aria-label={`Show verdict ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
