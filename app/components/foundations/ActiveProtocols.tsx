'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD    = '#e5b83c'
const BG_CARD = '#0e1626'
const BG_BASE = '#050811'
const BORDER  = '#1e293b'
const MONO    = "var(--font-mono)"
const DISPLAY = "'Space Grotesk', sans-serif"

// ── Protocol definitions ───────────────────────────────────────────────────────

type CheckCondition = 'analyses_count > 0' | 'analyses_count > 1' | 'manual_complete'

interface ProtocolDef {
  id: string
  label: string
  tag: 'START HERE' | 'FOUNDATIONS'
  description: string
  xp: number
  action: string | null
  actionLabel: string | null
  checkCondition: CheckCondition
  dependsOn?: string
}

const PROTOCOLS: ProtocolDef[] = [
  {
    id: 'first_diagnosis',
    label: 'FIRST DIAGNOSIS',
    tag: 'START HERE',
    description: 'Upload your MT5 trade export and receive your forensic verdict. Your first analysis is free.',
    xp: 100,
    action: '/new',
    actionLabel: 'Upload Now →',
    checkCondition: 'analyses_count > 0',
  },
  {
    id: 'unlock_briefing',
    label: 'UNLOCK YOUR BRIEFING',
    tag: 'FOUNDATIONS',
    description: 'Run your first diagnosis to unlock your personalized Morning Desk. Generic briefings become personal.',
    xp: 50,
    action: null,
    actionLabel: null,
    checkCondition: 'analyses_count > 0',
    dependsOn: 'first_diagnosis',
  },
  {
    id: 'clean_week',
    label: 'THE CLEAN WEEK',
    tag: 'FOUNDATIONS',
    description: 'Trade for 7 days using a stop loss on every single position. Upload your history at the end. We verify it.',
    xp: 200,
    action: null,
    actionLabel: 'Log Progress →',
    checkCondition: 'manual_complete',
  },
  {
    id: 'session_discipline',
    label: 'THE SESSION TEST',
    tag: 'FOUNDATIONS',
    description: 'Trade only during your highest-performing session for 3 consecutive days. Your data shows which one.',
    xp: 150,
    action: '/dashboard',
    actionLabel: 'Check My Sessions →',
    checkCondition: 'manual_complete',
    dependsOn: 'first_diagnosis',
  },
  {
    id: 'second_diagnosis',
    label: 'THE FOLLOW-UP',
    tag: 'FOUNDATIONS',
    description: 'Run a second diagnosis 30 days after your first. See if your prescriptions moved the needle.',
    xp: 150,
    action: '/new',
    actionLabel: 'Run Diagnosis →',
    checkCondition: 'analyses_count > 1',
    dependsOn: 'first_diagnosis',
  },
]

// ── Status derivation ──────────────────────────────────────────────────────────

type ProtocolStatus = 'completed' | 'active' | 'locked'

interface ProtocolState {
  def: ProtocolDef
  status: ProtocolStatus
}

function isDependencyMet(
  depId: string,
  analysesCount: number,
  completedIds: Set<string>,
): boolean {
  if (completedIds.has(depId)) return true
  const dep = PROTOCOLS.find(p => p.id === depId)
  if (!dep) return false
  if (dep.checkCondition === 'analyses_count > 0') return analysesCount > 0
  if (dep.checkCondition === 'analyses_count > 1') return analysesCount > 1
  return false
}

function deriveStatus(
  def: ProtocolDef,
  analysesCount: number,
  completedIds: Set<string>,
): ProtocolStatus {
  // Check dependency — satisfied by DB row OR by auto-condition
  if (def.dependsOn && !isDependencyMet(def.dependsOn, analysesCount, completedIds)) return 'locked'

  // Check auto-completion conditions
  if (def.checkCondition === 'analyses_count > 0' && analysesCount > 0) return 'completed'
  if (def.checkCondition === 'analyses_count > 1' && analysesCount > 1) return 'completed'

  // Manual protocols: check if row exists in foundations_protocols
  if (def.checkCondition === 'manual_complete' && completedIds.has(def.id)) return 'completed'

  return 'active'
}

// ── Icon helpers ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="#10b981" strokeWidth="1.5" />
      <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3" y="7" width="10" height="8" rx="2" stroke="var(--text-muted)" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CircleIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke={active ? GOLD : 'var(--border-subtle)'} strokeWidth="1.5" />
      {active && <circle cx="8" cy="8" r="3" fill={GOLD} />}
    </svg>
  )
}

// ── Single protocol card ───────────────────────────────────────────────────────

function ProtocolCard({ state, depLabel }: { state: ProtocolState; depLabel?: string }) {
  const router = useRouter()
  const { def, status } = state

  const isCompleted = status === 'completed'
  const isLocked    = status === 'locked'
  const isActive    = status === 'active'

  const borderColor = isCompleted ? '#10b981' : isActive ? GOLD : '#1e293b'
  const opacity     = isLocked ? 0.45 : 1

  return (
    <div style={{
      background: BG_BASE,
      borderTop:    `1px solid ${isCompleted ? 'rgba(16,185,129,0.25)' : isActive ? 'rgba(229,184,60,0.2)' : BORDER}`,
      borderRight:  `1px solid ${isCompleted ? 'rgba(16,185,129,0.25)' : isActive ? 'rgba(229,184,60,0.2)' : BORDER}`,
      borderBottom: `1px solid ${isCompleted ? 'rgba(16,185,129,0.25)' : isActive ? 'rgba(229,184,60,0.2)' : BORDER}`,
      borderLeft:   `3px solid ${borderColor}`,
      borderRadius: '0 8px 8px 0',
      padding: '14px 16px',
      opacity,
      transition: 'opacity 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Status icon */}
        <div style={{ marginTop: 2, flexShrink: 0 }}>
          {isCompleted && <CheckIcon />}
          {isLocked    && <LockIcon />}
          {isActive    && <CircleIcon active />}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{
              fontFamily: MONO, fontSize: 11, fontWeight: 700,
              color: isCompleted ? '#10b981' : isActive ? '#f8fafc' : 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}>
              {def.label}
            </span>

            {/* Tag */}
            {def.tag === 'START HERE' && (
              <span style={{
                fontFamily: MONO, fontSize: 8, fontWeight: 700,
                background: GOLD, color: '#000',
                borderRadius: 3, padding: '2px 7px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                START HERE
              </span>
            )}
            {def.tag === 'FOUNDATIONS' && (
              <span style={{
                fontFamily: MONO, fontSize: 8,
                color: GOLD, border: `1px solid rgba(229,184,60,0.4)`,
                borderRadius: 3, padding: '1px 6px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                FOUNDATIONS
              </span>
            )}

            {/* Completed badge */}
            {isCompleted && (
              <span style={{
                fontFamily: MONO, fontSize: 9, color: '#10b981',
                marginLeft: 'auto', letterSpacing: '0.06em',
              }}>
                COMPLETED +{def.xp} XP
              </span>
            )}

            {/* XP label (active) */}
            {isActive && (
              <span style={{
                fontFamily: MONO, fontSize: 9, color: 'var(--text-muted)',
                marginLeft: 'auto', letterSpacing: '0.06em',
              }}>
                +{def.xp} XP
              </span>
            )}
          </div>

          {/* Description */}
          {!isCompleted && (
            <p style={{
              fontFamily: MONO, fontSize: 11, color: 'var(--text-muted)',
              lineHeight: 1.6, margin: '0 0 10px',
            }}>
              {def.description}
            </p>
          )}

          {/* Locked message */}
          {isLocked && depLabel && (
            <p style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text-muted)', margin: '0 0 0', letterSpacing: '0.04em' }}>
              Complete{' '}
              <span style={{ color: 'var(--text-muted)' }}>{depLabel}</span>
              {' '}to unlock
            </p>
          )}

          {/* Action button */}
          {isActive && def.action && def.actionLabel && (
            <button
              onClick={() => router.push(def.action!)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '7px 14px',
                background: 'transparent',
                border: `1px solid rgba(229,184,60,0.4)`,
                borderRadius: 5,
                fontFamily: MONO, fontSize: 11, color: GOLD,
                cursor: 'pointer', letterSpacing: '0.06em',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(229,184,60,0.08)'
                e.currentTarget.style.borderColor = 'rgba(229,184,60,0.7)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(229,184,60,0.4)'
              }}
            >
              {def.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface ActiveProtocolsProps {
  analyses: any[]
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ActiveProtocols({ analyses }: ActiveProtocolsProps) {
  const { user } = useAuth()
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loadingProtocols, setLoadingProtocols] = useState(true)

  useEffect(() => {
    if (!user) { setLoadingProtocols(false); return }

    const load = async () => {
      try {
        const supabase = await getSupabaseClient()
        const { data } = await supabase
          .from('foundations_protocols')
          .select('protocol_id')
          .eq('user_id', user.id)
        if (data) setCompletedIds(new Set(data.map((r: any) => r.protocol_id)))
      } catch (e) {
        console.error('[Protocols] fetch error:', e)
      } finally {
        setLoadingProtocols(false)
      }
    }

    load()
  }, [user])

  const analysesCount = analyses.length

  // Build a label lookup for dependency messaging
  const labelById = Object.fromEntries(PROTOCOLS.map(p => [p.id, p.label]))

  const states: ProtocolState[] = PROTOCOLS.map(def => ({
    def,
    status: deriveStatus(def, analysesCount, completedIds),
  }))

  const completedCount = states.filter(s => s.status === 'completed').length

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 14,
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 10, color: GOLD,
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          ACTIVE PROTOCOLS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {completedCount}/{PROTOCOLS.length} COMPLETE
        </span>
      </div>

      {loadingProtocols ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 72, background: BG_BASE,
              border: `1px solid ${BORDER}`, borderRadius: 8,
            }} className="skeleton" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {states.map(state => (
            <ProtocolCard
              key={state.def.id}
              state={state}
              depLabel={state.def.dependsOn ? labelById[state.def.dependsOn] : undefined}
            />
          ))}
        </div>
      )}

      {/* Progress note */}
      {!loadingProtocols && completedCount === PROTOCOLS.length && (
        <div style={{
          marginTop: 16,
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 6, padding: '12px 16px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: DISPLAY, fontSize: 13, color: '#10b981', margin: 0, fontWeight: 600 }}>
            All protocols complete. Foundations established.
          </p>
        </div>
      )}
    </div>
  )
}
