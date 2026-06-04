'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const GOLD    = '#e5b83c'
const CARD    = '#0e1626'
const BORDER  = '#1e293b'
const MONO    = '"JetBrains Mono", monospace'
const DISPLAY = '"Space Grotesk", sans-serif'

// Day-of-week pattern knowledge (trained, offline)
const DAY_PATTERNS: Record<number, {
  label: string
  pattern: string
  risk: 'low' | 'medium' | 'high'
  recommendation: string
}> = {
  0: {
    label: 'SUNDAY',
    pattern: 'Market closed. Asian session opens tonight.',
    risk: 'low',
    recommendation: "Review your week. Plan next week's sessions.",
  },
  1: {
    label: 'MONDAY',
    pattern: 'Weekly range setting. First moves are often reversed '
           + 'as institutions establish weekly positions.',
    risk: 'medium',
    recommendation: 'Wait for London open to confirm direction. '
                  + 'Avoid pre-London entries.',
  },
  2: {
    label: 'TUESDAY',
    pattern: 'Highest institutional volume day. Most reliable '
           + 'directional moves of the week originate Tuesday-Wednesday.',
    risk: 'low',
    recommendation: 'Peak opportunity window. Stick to your '
                  + 'session discipline — quality over quantity.',
  },
  3: {
    label: 'WEDNESDAY',
    pattern: 'Mid-week continuation. Weekly narrative usually '
           + 'clear by now. Strong follow-through sessions.',
    risk: 'low',
    recommendation: 'Trade with the established weekly direction. '
                  + 'Your best setups are available now.',
  },
  4: {
    label: 'THURSDAY',
    pattern: 'Central bank risk day. ECB and BOE decisions '
           + 'fall on Thursdays. Elevated volatility likely.',
    risk: 'high',
    recommendation: 'Reduce position size by 50% during '
                  + 'news windows. Wait for volatility to settle.',
  },
  5: {
    label: 'FRIDAY',
    pattern: 'Institutional position squaring. Spreads widen '
           + 'significantly after 18:00 UTC. Weekly close positioning.',
    risk: 'medium',
    recommendation: 'Take profits by NY close. No new positions '
                  + 'after 18:00 UTC. Lock in the week.',
  },
  6: {
    label: 'SATURDAY',
    pattern: 'Market closed.',
    risk: 'low',
    recommendation: "Review your week's trades. Prepare your plan for Monday.",
  },
}

interface Analysis {
  session_discipline_score?: number
  behavioral_control_score?: number
  biggest_leak?: string
  archetype?: string
  trades_count?: number
}

interface Prescription {
  title: string
  action: string
}

interface CalendarEvent {
  time: string
  currency: string
  event: string
}

export interface PreSessionBriefProps {
  analyses: Analysis[]
  prescriptions?: Prescription[]
  disciplineStreak: number
  calendarEvents?: CalendarEvent[]
}

export default function PreSessionBrief({
  analyses,
  prescriptions = [],
  disciplineStreak,
  calendarEvents = [],
}: PreSessionBriefProps) {
  const router = useRouter()
  const [acknowledged, setAcknowledged] = useState(false)
  const [alreadyAcked, setAlreadyAcked] = useState(false)

  const today      = new Date()
  const dayOfWeek  = today.getUTCDay()
  const dayPattern = DAY_PATTERNS[dayOfWeek]
  const hasData    = analyses && analyses.length > 0
  const latest     = hasData ? analyses[0] : null

  // Check if already acknowledged today
  useEffect(() => {
    const lastAck = localStorage.getItem('xray_presession_ack')
    if (lastAck === today.toDateString()) {
      setAlreadyAcked(true)
      setAcknowledged(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAcknowledge = () => {
    localStorage.setItem('xray_presession_ack', today.toDateString())
    setAcknowledged(true)
    setAlreadyAcked(true)
  }

  const riskColor = {
    low:    '#10b981',
    medium: GOLD,
    high:   '#ef4444',
  }[dayPattern.risk]

  const todayStr = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Collapsed / acknowledged state
  if (alreadyAcked && acknowledged) {
    return (
      <div style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderLeft: '3px solid #10b981',
        borderRadius: 8,
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="#10b981" />
            <polyline
              points="4.5,8 7,10.5 11.5,5.5"
              stroke="#10b981" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span style={{
            fontFamily: MONO, fontSize: 11, color: '#10b981', letterSpacing: '0.08em',
          }}>
            PRE-SESSION BRIEF ACKNOWLEDGED — {todayStr.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => { setAcknowledged(false); setAlreadyAcked(false) }}
          style={{
            background: 'transparent', border: 'none',
            color: '#475569', fontFamily: MONO, fontSize: 10, cursor: 'pointer',
          }}
        >
          Review again →
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${GOLD}`,
      borderRadius: 8,
      padding: '20px 24px',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16, paddingBottom: 12,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 10, color: GOLD,
            letterSpacing: '0.15em', marginBottom: 4,
          }}>
            BEFORE YOU TRADE — {dayPattern.label}
          </div>
          <div style={{
            fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: '#f8fafc',
          }}>
            {todayStr}
          </div>
        </div>
        <div style={{
          background: `${riskColor}22`, border: `1px solid ${riskColor}`,
          borderRadius: 4, padding: '4px 10px',
          fontFamily: MONO, fontSize: 10, color: riskColor,
          fontWeight: 700, letterSpacing: '0.08em',
        }}>
          {dayPattern.risk.toUpperCase()} RISK DAY
        </div>
      </div>

      {/* Session Intelligence */}
      <div style={{
        background: '#050811', border: `1px solid ${BORDER}`,
        borderRadius: 6, padding: '12px 16px', marginBottom: 12,
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 9, color: '#475569',
          letterSpacing: '0.12em', marginBottom: 6,
        }}>
          SESSION INTELLIGENCE
        </div>
        <p style={{
          fontFamily: MONO, fontSize: 12, color: '#cbd5e1',
          lineHeight: 1.6, margin: '0 0 8px',
        }}>
          {dayPattern.pattern}
        </p>
        <p style={{
          fontFamily: MONO, fontSize: 11, color: GOLD, lineHeight: 1.5, margin: 0,
        }}>
          → {dayPattern.recommendation}
        </p>
      </div>

      {/* Economic Calendar Events */}
      {calendarEvents.length > 0 && (
        <div style={{
          background: '#050811',
          border: `1px solid #ef444433`,
          borderLeft: '3px solid #ef4444',
          borderRadius: 6, padding: '12px 16px', marginBottom: 12,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, color: '#ef4444',
            letterSpacing: '0.12em', marginBottom: 8,
          }}>
            HIGH-IMPACT EVENTS TODAY
          </div>
          {calendarEvents.map((ev, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
            }}>
              <span style={{ fontSize: 10 }}>🔴</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#f8fafc' }}>
                {ev.time} UTC — {ev.currency} {ev.event}
              </span>
            </div>
          ))}
          {hasData && (
            <p style={{
              fontFamily: MONO, fontSize: 10, color: '#64748b',
              margin: '8px 0 0', lineHeight: 1.5,
            }}>
              Check your report for performance around high-impact events.
            </p>
          )}
        </div>
      )}

      {/* Personal Data */}
      {hasData && latest && (
        <div style={{
          background: '#050811',
          border: `1px solid ${GOLD}33`,
          borderLeft: `2px solid ${GOLD}`,
          borderRadius: 6, padding: '12px 16px', marginBottom: 12,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, color: GOLD,
            letterSpacing: '0.12em', marginBottom: 8,
          }}>
            YOUR DATA SAYS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {latest.session_discipline_score !== undefined && (
              <div style={{
                fontFamily: MONO, fontSize: 12,
                color: latest.session_discipline_score < 50 ? '#ef4444' : '#10b981',
                lineHeight: 1.5,
              }}>
                → Session discipline: {latest.session_discipline_score}/100
                {latest.session_discipline_score < 50
                  ? ' — stay in your sessions today'
                  : ' — good discipline, maintain it'}
              </div>
            )}
            {latest.behavioral_control_score !== undefined && (
              <div style={{
                fontFamily: MONO, fontSize: 12,
                color: latest.behavioral_control_score < 50 ? '#ef4444' : '#10b981',
                lineHeight: 1.5,
              }}>
                → Behavioral control: {latest.behavioral_control_score}/100
                {latest.behavioral_control_score < 50
                  ? ' — revenge trade risk is elevated for you'
                  : ' — strong control, trust your process'}
              </div>
            )}
            {latest.biggest_leak && (
              <div style={{
                fontFamily: MONO, fontSize: 12, color: '#94a3b8', lineHeight: 1.5,
              }}>
                → Biggest leak: {latest.biggest_leak}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Prescription Reminder */}
      {prescriptions.length > 0 && (
        <div style={{
          background: '#050811', border: `1px solid ${BORDER}`,
          borderRadius: 6, padding: '12px 16px', marginBottom: 12,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, color: '#475569',
            letterSpacing: '0.12em', marginBottom: 6,
          }}>
            TODAY&apos;S DISCIPLINE TARGET
          </div>
          <p style={{
            fontFamily: MONO, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, margin: 0,
          }}>
            &ldquo;{prescriptions[0].action}&rdquo;
          </p>
        </div>
      )}

      {/* No data nudge */}
      {!hasData && (
        <div style={{
          background: '#050811', border: `1px solid ${BORDER}`,
          borderRadius: 6, padding: '12px 16px', marginBottom: 12,
        }}>
          <p style={{
            fontFamily: MONO, fontSize: 12, color: '#475569', lineHeight: 1.6, margin: 0,
          }}>
            Run your first diagnosis to unlock personalized pre-session intelligence —
            tailored to your specific leaks, sessions, and patterns.
          </p>
        </div>
      )}

      {/* Discipline Streak */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16, padding: '8px 12px',
        background: '#050811', border: `1px solid ${BORDER}`, borderRadius: 6,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#475569' }}>
          DISCIPLINE STREAK
        </span>
        <span style={{
          fontFamily: MONO, fontSize: 14,
          color: disciplineStreak > 0 ? GOLD : '#334155',
          fontWeight: 700,
        }}>
          {disciplineStreak} {disciplineStreak === 1 ? 'day' : 'days'}
        </span>
      </div>

      {/* Acknowledge Button */}
      <button
        onClick={handleAcknowledge}
        style={{
          width: '100%', background: GOLD, color: '#000',
          border: 'none', borderRadius: 6, padding: '12px 20px',
          fontFamily: DISPLAY, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', letterSpacing: '0.05em',
        }}
      >
        I&apos;ve read this — entering trading mode
      </button>
      <p style={{
        fontFamily: MONO, fontSize: 10, color: '#334155',
        textAlign: 'center', margin: '8px 0 0',
      }}>
        Acknowledging adds to your discipline streak
      </p>
    </div>
  )
}
