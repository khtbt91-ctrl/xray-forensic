'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

const GOLD    = '#e5b83c'
const BG_CARD = '#0e1626'
const BG_BASE = '#050811'
const BORDER  = '#1e293b'
const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Space Grotesk', sans-serif"
const GREEN   = '#10b981'
const RED_C   = '#ef4444'

// ── Pill selector ─────────────────────────────────────────────────────────────

function Pill({
  label, selected, onClick, color = GOLD,
}: {
  label: string; selected: boolean; onClick: () => void; color?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 6,
        border: `1px solid ${selected ? color : BORDER}`,
        background: selected ? 'rgba(229,184,60,0.10)' : 'transparent',
        color: selected ? color : '#64748b',
        fontFamily: MONO,
        fontSize: 12,
        letterSpacing: '0.06em',
        fontWeight: selected ? 700 : 400,
        cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s, background 0.15s',
      }}
    >
      {label.toUpperCase()}
    </button>
  )
}

// ── XP toast ──────────────────────────────────────────────────────────────────

function XpToast() {
  return (
    <div style={{
      position: 'absolute',
      top: -40,
      right: 0,
      background: '#0e1626',
      border: `1px solid ${GOLD}`,
      borderRadius: 6,
      padding: '6px 14px',
      fontFamily: MONO,
      fontSize: 12,
      color: GOLD,
      fontWeight: 700,
      letterSpacing: '0.08em',
      animation: 'pfToastIn 0.25s ease, pfToastOut 0.4s ease 2.4s forwards',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      +15 XP
    </div>
  )
}

// ── Clearance result card ──────────────────────────────────────────────────────

function formatSession(s: string): string {
  if (s === 'ny') return 'NY'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function ClearanceCard({ result }: { result: any }) {
  const clearance = result.clearance ?? result.clearance_level ?? 'green'
  const limits    = result.limits ?? result.limits_json ?? {}
  const oneRule   = result.one_rule
  const reasons: string[] = result.reasons ?? []

  const borderColor = clearance === 'green' ? GREEN : clearance === 'amber' ? GOLD : RED_C

  const statusLabel = clearance === 'green'
    ? '🟢 CLEARED FOR OPERATIONS'
    : clearance === 'amber'
    ? '🟡 RESTRICTED OPERATIONS'
    : '🔴 STAND DOWN ADVISED'

  const statusColor = clearance === 'green' ? GREEN : clearance === 'amber' ? GOLD : RED_C

  const limitsText = (() => {
    const parts: string[] = []
    if (limits.max_trades != null)         parts.push(`Max ${limits.max_trades} trades`)
    if (limits.max_risk_pct != null)       parts.push(`Max ${limits.max_risk_pct}% risk`)
    if (limits.sessions?.length)           parts.push((limits.sessions as string[]).map(formatSession).join(' · '))
    if (limits.cooldown_after_loss_min)    parts.push(`${limits.cooldown_after_loss_min}min cooldown after any loss`)
    return parts.join(' · ')
  })()

  return (
    <div style={{
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: 8,
      padding: '20px 24px',
      animation: 'pfSlideUp 0.3s ease',
    }}>
      <style>{`
        @keyframes pfSlideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        @keyframes pfToastIn  { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
        @keyframes pfToastOut { from { opacity:1 } to { opacity:0 } }
      `}</style>

      {/* Status label */}
      <div style={{
        fontFamily: MONO, fontSize: 11, fontWeight: 700,
        color: statusColor, letterSpacing: '0.12em', marginBottom: 14,
      }}>
        {statusLabel}
      </div>

      {/* GREEN / AMBER — limits row */}
      {clearance !== 'red' && limitsText && (
        <div style={{
          fontFamily: MONO, fontSize: 13, color: '#f8fafc',
          lineHeight: 1.6, marginBottom: reasons.length > 0 ? 12 : 16,
        }}>
          {limitsText}
        </div>
      )}

      {/* AMBER — reasons */}
      {clearance === 'amber' && reasons.length > 0 && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {reasons.map((r: string, i: number) => (
            <div key={i} style={{ fontFamily: MONO, fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
              → {r}
            </div>
          ))}
        </div>
      )}

      {/* RED — stand-down content */}
      {clearance === 'red' && (
        <>
          <div style={{
            fontFamily: DISPLAY, fontSize: 15, fontWeight: 500,
            color: '#f8fafc', lineHeight: 1.6, marginBottom: 12,
          }}>
            The data says: not today.
          </div>
          {reasons.length > 0 && (
            <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {reasons.map((r: string, i: number) => (
                <div key={i} style={{ fontFamily: MONO, fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
                  → {r}
                </div>
              ))}
            </div>
          )}
          <div style={{
            fontFamily: MONO, fontSize: 11, color: GREEN,
            lineHeight: 1.6, marginBottom: 16,
          }}>
            Standing down today protects your streak. No trades = discipline held.
          </div>
        </>
      )}

      {/* One rule */}
      {oneRule && (
        <>
          <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 14 }} />
          <div style={{
            fontFamily: MONO, fontSize: 10, color: GOLD,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            TODAY&apos;S ONE RULE
          </div>
          <div style={{
            fontFamily: DISPLAY, fontSize: 15, fontWeight: 700,
            color: '#f8fafc', lineHeight: 1.5,
          }}>
            {oneRule}
          </div>
        </>
      )}
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PreFlightClearanceProps {
  analyses: any[]
  calendarEvents: { time: string; currency: string; event: string }[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PreFlightClearance({ analyses: _analyses, calendarEvents }: PreFlightClearanceProps) {
  const { session } = useAuth()
  const API = process.env.NEXT_PUBLIC_API_URL

  type Stage = 'loading' | 'form' | 'computing' | 'result'
  const [stage, setStage]             = useState<Stage>('loading')
  const [result, setResult]           = useState<any>(null)
  const [showXpToast, setShowXpToast] = useState(false)

  // Form inputs
  const [sleep,     setSleep]     = useState<string | null>(null)
  const [emotion,   setEmotion]   = useState<string | null>(null)
  const [yesterday, setYesterday] = useState<string | null>(null)
  const [intent,    setIntent]    = useState<string | null>(null)

  // Check for existing checkin today
  useEffect(() => {
    if (!session?.access_token) { setStage('form'); return }
    fetch(`${API}/user/preflight/today`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.checkin) { setResult(d.checkin); setStage('result') }
        else            setStage('form')
      })
      .catch(() => setStage('form'))
  }, [session?.access_token, API])

  const canSubmit = !!(sleep && emotion && yesterday && intent)

  const handleSubmit = async () => {
    if (!canSubmit || !session?.access_token) return
    setStage('computing')
    try {
      const res = await fetch(`${API}/user/preflight`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sleep_quality:    sleep,
          emotional_state:  emotion,
          yesterday_result: yesterday,
          intent,
        }),
      })
      const data = await res.json()
      setResult(data)
      setStage('result')
      setShowXpToast(true)
      setTimeout(() => setShowXpToast(false), 3000)
    } catch {
      setStage('form')
    }
  }

  // ── Loading ──
  if (stage === 'loading') return (
    <div style={{
      background: BG_CARD, border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${GOLD}`, borderRadius: 8,
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        border: `2px solid ${BORDER}`, borderTopColor: GOLD,
        animation: 'spin 0.8s linear infinite', flexShrink: 0,
      }} />
      <span style={{ fontFamily: MONO, fontSize: 11, color: '#475569' }}>
        Checking clearance status...
      </span>
    </div>
  )

  // ── Computing ──
  if (stage === 'computing') return (
    <div style={{
      background: BG_CARD, border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${GOLD}`, borderRadius: 8,
      padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        border: `2px solid ${BORDER}`, borderTopColor: GOLD,
        animation: 'spin 0.8s linear infinite', flexShrink: 0,
      }} />
      <div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: GOLD, letterSpacing: '0.1em' }}>
          COMPUTING CLEARANCE...
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#475569', marginTop: 3 }}>
          Analysing risk factors against your profile.
        </div>
      </div>
    </div>
  )

  // ── Result ──
  if (stage === 'result' && result) return (
    <div style={{ position: 'relative' }}>
      {showXpToast && <XpToast />}
      <ClearanceCard result={result} />
    </div>
  )

  // ── Form ──
  const questions = [
    {
      id: 'sleep', label: 'SLEEP', value: sleep, set: setSleep,
      options: [
        { key: 'good',    display: 'Good' },
        { key: 'average', display: 'Average' },
        { key: 'poor',    display: 'Poor',    color: RED_C },
      ],
    },
    {
      id: 'emotion', label: 'STATE', value: emotion, set: setEmotion,
      options: [
        { key: 'calm',     display: 'Calm' },
        { key: 'neutral',  display: 'Neutral' },
        { key: 'stressed', display: 'Stressed', color: '#f59e0b' },
        { key: 'angry',    display: 'Angry',    color: RED_C },
      ],
    },
    {
      id: 'yesterday', label: 'YESTERDAY', value: yesterday, set: setYesterday,
      options: [
        { key: 'green',    display: 'Green',         color: GREEN },
        { key: 'red',      display: 'Red',           color: RED_C },
        { key: 'no_trade', display: "Didn't trade" },
      ],
    },
    {
      id: 'intent', label: 'TODAY FEELS LIKE', value: intent, set: setIntent,
      options: [
        { key: 'normal',  display: 'Normal day' },
        { key: 'big_day', display: 'Big day',    color: '#f59e0b' },
      ],
    },
  ]

  return (
    <div style={{
      background: BG_CARD, border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${GOLD}`, borderRadius: 8,
      padding: '20px 24px',
    }}>

      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, color: GOLD,
          letterSpacing: '0.15em', marginBottom: 6,
        }}>
          PRE-FLIGHT CLEARANCE
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
          Before you trade — 15 seconds.
        </div>
      </div>

      {/* Calendar warning */}
      {calendarEvents.length > 0 && (
        <div style={{
          background: BG_BASE, border: `1px solid #ef444422`,
          borderLeft: '2px solid #ef4444',
          borderRadius: 5, padding: '8px 14px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: RED_C, fontSize: 11 }}>⚠</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: RED_C }}>
            {calendarEvents.length} high-impact event{calendarEvents.length !== 1 ? 's' : ''} today
            {' '}— already factored into your clearance
          </span>
        </div>
      )}

      {/* Question rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {questions.map(q => (
          <div key={q.id}>
            <div style={{
              fontFamily: MONO, fontSize: 11, color: '#64748b',
              letterSpacing: '0.12em', marginBottom: 8,
            }}>
              {q.label}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {q.options.map(opt => (
                <Pill
                  key={opt.key}
                  label={opt.display}
                  selected={q.value === opt.key}
                  onClick={() => q.set(opt.key)}
                  color={opt.color ?? GOLD}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          marginTop: 20, width: '100%', padding: '12px',
          background: canSubmit ? GOLD : '#1e293b',
          color: canSubmit ? '#000' : '#334155',
          border: 'none', borderRadius: 6,
          fontFamily: DISPLAY, fontSize: 13, fontWeight: 700,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
          letterSpacing: '0.02em',
        }}
      >
        {canSubmit ? 'Request Clearance →' : 'Answer all questions to continue'}
      </button>
    </div>
  )
}
