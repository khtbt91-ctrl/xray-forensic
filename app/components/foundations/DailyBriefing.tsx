'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/lib/supabase'

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD    = '#e5b83c'
const BG_CARD = '#0e1626'
const BG_BASE = '#050811'
const BORDER  = '#1e293b'
const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Space Grotesk', sans-serif"

// ── Session timing (UTC) ───────────────────────────────────────────────────────
const MARKET_SESSIONS = {
  london:  { label: 'LONDON OPEN',   openHour: 7,  closeHour: 16 },
  newYork: { label: 'NEW YORK OPEN', openHour: 13, closeHour: 22 },
} as const

type SessionState = { status: 'active' | 'upcoming' | 'closed'; text: string }

function getSessionStatus(openHour: number, closeHour: number, now: Date): SessionState {
  const cur   = now.getUTCHours() * 60 + now.getUTCMinutes()
  const open  = openHour * 60
  const close = closeHour * 60

  if (cur >= open && cur < close) {
    return { status: 'active', text: 'ACTIVE NOW' }
  }
  if (cur < open) {
    const diff = open - cur
    return { status: 'upcoming', text: `Opens in ${Math.floor(diff / 60)}h ${diff % 60}m` }
  }
  const diff = cur - close
  return { status: 'closed', text: `Closed ${Math.floor(diff / 60)}h ${diff % 60}m ago` }
}

function formatUTCDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    timeZone: 'UTC',
  }).toUpperCase()
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SessionCard({ label, session }: { label: string; session: SessionState }) {
  const textColor =
    session.status === 'active'   ? '#10b981' :
    session.status === 'upcoming' ? GOLD       : '#475569'

  return (
    <div style={{
      flex: 1, minWidth: 130,
      background: BG_BASE,
      border: `1px solid ${BORDER}`,
      borderRadius: 6,
      padding: '10px 14px',
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 9, color: '#475569',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {session.status === 'active' && (
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block',
          }} />
        )}
        <span style={{
          fontFamily: MONO, fontSize: 11, fontWeight: 700,
          color: textColor, letterSpacing: '0.04em',
        }}>
          {session.text}
        </span>
      </div>
    </div>
  )
}

function NewsCard() {
  return (
    <div style={{
      flex: 1, minWidth: 130,
      background: BG_BASE, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '10px 14px',
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 9, color: '#475569',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6,
      }}>
        HIGH IMPACT NEWS
      </div>
      <a
        href="https://www.forexfactory.com/calendar"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: MONO, fontSize: 11, color: '#64748b', textDecoration: 'none', letterSpacing: '0.04em' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = GOLD }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
      >
        Check calendar →
      </a>
    </div>
  )
}

// Pre-hydration skeleton for session row — prevents layout shift
function SessionRowSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
      {['LONDON OPEN', 'NEW YORK OPEN', 'HIGH IMPACT NEWS'].map(l => (
        <div key={l} style={{
          flex: 1, minWidth: 130,
          background: BG_BASE, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '10px 14px',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, color: '#475569',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            {l}
          </div>
          <div style={{ height: 14, width: 80, background: '#1e293b', borderRadius: 3 }} />
        </div>
      ))}
    </div>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface DailyBriefingProps {
  analyses: any[]
  profile: UserProfile | null
  complianceData?: { latest: any; previous: any } | null
  activeProtocol?: { label: string; daysLeft?: number } | null
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function DailyBriefing({
  analyses,
  complianceData,
  activeProtocol,
}: DailyBriefingProps) {
  const router = useRouter()
  // null on server — set on mount to avoid SSR/hydration mismatch on dates
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const hasAnalyses = analyses.length > 0
  const mostRecent  = hasAnalyses ? analyses[0] : null

  const london  = now ? getSessionStatus(MARKET_SESSIONS.london.openHour,  MARKET_SESSIONS.london.closeHour,  now) : null
  const newYork = now ? getSessionStatus(MARKET_SESSIONS.newYork.openHour, MARKET_SESSIONS.newYork.closeHour, now) : null

  // Derive best session from compliance/prescription data.
  // Backend may use different field names — try all known variants.
  const rawSessionData: Record<string, any> | null =
    complianceData?.latest?.session_stats     ??
    complianceData?.latest?.sessions          ??
    complianceData?.latest?.session_breakdown ??
    null

  const bestSession: { name: string; winRate: number } | null = (() => {
    if (!rawSessionData || typeof rawSessionData !== 'object') return null
    const entries = Object.entries(rawSessionData)
    if (entries.length === 0) return null
    return entries
      .map(([name, stats]) => {
        const raw = (stats as any)?.win_rate ?? (stats as any)?.winRate ?? 0
        // Normalise: backend may return 0–1 fraction or 0–100 percentage
        const winRate = raw > 1 ? raw : raw * 100
        return { name, winRate }
      })
      .sort((a, b) => b.winRate - a.winRate)[0]
  })()

  const sessionRow = now ? (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
      <SessionCard label={MARKET_SESSIONS.london.label}  session={london!}  />
      <SessionCard label={MARKET_SESSIONS.newYork.label} session={newYork!} />
      <NewsCard />
    </div>
  ) : (
    <SessionRowSkeleton />
  )

  return (
    <div style={{
      background:   BG_CARD,
      borderTop:    `1px solid ${BORDER}`,
      borderRight:  `1px solid ${BORDER}`,
      borderBottom: `1px solid ${BORDER}`,
      borderLeft:   `3px solid ${GOLD}`,
      borderRadius: '0 8px 8px 0',
      padding: '20px 24px',
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 18,
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 10, color: GOLD,
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          THE MORNING DESK
        </span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: '#475569', letterSpacing: '0.06em' }}>
          {now ? formatUTCDate(now) : ''}
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          STATE 1 — Zero analyses
      ══════════════════════════════════════════════════════════════ */}
      {!hasAnalyses && (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, color: GOLD,
              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              FOUNDATIONS BRIEF
            </div>
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 18, fontWeight: 700,
              color: '#f8fafc', margin: '0 0 10px', lineHeight: 1.3,
            }}>
              Your briefing is locked to your data.
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              Right now this is a generic market view. Upload your trade history and your briefing
              becomes personal — tuned to your sessions, your pairs, your patterns, your leaks.
            </p>
          </div>

          {sessionRow}

          <button
            onClick={() => router.push('/new')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 22px',
              background: GOLD, color: '#000',
              border: 'none', borderRadius: 6,
              fontFamily: DISPLAY, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.02em',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#b88d1d' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = GOLD }}
          >
            Unlock My Briefing →
          </button>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STATE 2 — Has analyses
      ══════════════════════════════════════════════════════════════ */}
      {hasAnalyses && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, color: GOLD,
              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              MORNING DESK
            </div>
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 18, fontWeight: 700,
              color: '#f8fafc', margin: 0, lineHeight: 1.3,
            }}>
              Today&apos;s session conditions.
            </h2>
          </div>

          {sessionRow}

          {/* Personal intel card */}
          <div style={{
            background:   BG_BASE,
            borderTop:    `1px solid rgba(229,184,60,0.15)`,
            borderRight:  `1px solid rgba(229,184,60,0.15)`,
            borderBottom: `1px solid rgba(229,184,60,0.15)`,
            borderLeft:   `3px solid ${GOLD}`,
            borderRadius: '0 6px 6px 0',
            padding: '14px 16px',
            marginBottom: activeProtocol ? 12 : 0,
          }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, color: GOLD,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              PERSONAL INTEL
            </div>
            {bestSession ? (
              <p style={{ fontFamily: MONO, fontSize: 12, color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
                YOUR EDGE:{' '}
                <span style={{ color: GOLD, fontWeight: 700 }}>{bestSession.name.toUpperCase()}</span>
                {' '}session.{' '}
                <span style={{ color: '#10b981', fontWeight: 700 }}>{bestSession.winRate.toFixed(0)}%</span>
                {' '}win rate in your last{' '}
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{mostRecent?.total_trades ?? '—'}</span>
                {' '}trades.
              </p>
            ) : (
              <p style={{ fontFamily: MONO, fontSize: 12, color: '#475569', lineHeight: 1.65, margin: 0 }}>
                Upload more trades to unlock session intelligence.
              </p>
            )}
          </div>

          {/* Active protocol reminder */}
          {activeProtocol && (
            <div style={{
              background: BG_BASE, border: `1px solid ${BORDER}`, borderRadius: 6,
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: GOLD, boxShadow: `0 0 6px ${GOLD}`, display: 'inline-block',
              }} />
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#94a3b8', letterSpacing: '0.04em' }}>
                <span style={{ color: GOLD, fontWeight: 700 }}>ACTIVE PROTOCOL:</span>
                {' '}{activeProtocol.label}
                {activeProtocol.daysLeft != null && (
                  <> —{' '}<span style={{ color: '#f8fafc', fontWeight: 700 }}>{activeProtocol.daysLeft} days left</span></>
                )}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
