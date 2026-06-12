'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { UserProfile } from '@/lib/supabase'
import DailyBriefing      from './DailyBriefing'
import DeskNoteFeed       from './DeskNoteFeed'
import ActiveProtocols    from './ActiveProtocols'
import OperatorRank       from './OperatorRank'
import PreFlightClearance from './PreFlightClearance'

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD    = '#e5b83c'
const BG_CARD = '#0e1626'
const BORDER  = '#1e293b'
const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Space Grotesk', sans-serif"

// ── Chevron icon ───────────────────────────────────────────────────────────────
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" aria-hidden
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
        flexShrink: 0,
      }}
    >
      <polyline
        points="3,6 8,11 13,6"
        stroke="#475569" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Protocol completion derivation (mirrors ActiveProtocols logic) ─────────────
// We re-derive here so FoundationsSection can pass activeProtocol to DailyBriefing
// without making DailyBriefing dependent on another fetch.

type CheckCondition = 'analyses_count > 0' | 'analyses_count > 1' | 'manual_complete'

interface ProtocolDef {
  id: string
  label: string
  checkCondition: CheckCondition
  dependsOn?: string
}

const PROTOCOL_DEFS: ProtocolDef[] = [
  { id: 'first_diagnosis',  label: 'FIRST DIAGNOSIS',      checkCondition: 'analyses_count > 0' },
  { id: 'unlock_briefing',  label: 'UNLOCK YOUR BRIEFING', checkCondition: 'analyses_count > 0',  dependsOn: 'first_diagnosis' },
  { id: 'clean_week',       label: 'THE CLEAN WEEK',       checkCondition: 'manual_complete' },
  { id: 'session_discipline',label: 'THE SESSION TEST',    checkCondition: 'manual_complete',     dependsOn: 'first_diagnosis' },
  { id: 'second_diagnosis', label: 'THE FOLLOW-UP',        checkCondition: 'analyses_count > 1',  dependsOn: 'first_diagnosis' },
]

function deriveIsCompleted(
  def: ProtocolDef,
  analysesCount: number,
  completedIds: Set<string>,
): boolean {
  if (def.dependsOn && !completedIds.has(def.dependsOn)) return false
  if (def.checkCondition === 'analyses_count > 0') return analysesCount > 0
  if (def.checkCondition === 'analyses_count > 1') return analysesCount > 1
  if (def.checkCondition === 'manual_complete')    return completedIds.has(def.id)
  return false
}

function getFirstActiveProtocol(
  analysesCount: number,
  completedIds: Set<string>,
): { label: string } | null {
  for (const def of PROTOCOL_DEFS) {
    const depMet = !def.dependsOn || completedIds.has(def.dependsOn)
    const isDone = deriveIsCompleted(def, analysesCount, completedIds)
    if (depMet && !isDone) return { label: def.label }
  }
  return null
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface FoundationsSectionProps {
  analyses: any[]
  profile: UserProfile | null
  complianceData?: { latest: any; previous: any } | null
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function FoundationsSection({
  analyses,
  profile,
  complianceData,
}: FoundationsSectionProps) {
  const { user, session } = useAuth()

  // Default: expanded only when user has no analyses yet
  const defaultOpen = analyses.length === 0
  const [open, setOpen] = useState(defaultOpen)

  // Sync if analyses count changes after mount (e.g. first upload completes)
  useEffect(() => {
    setOpen(analyses.length === 0)
  }, [analyses.length])

  // Fetch completed protocol IDs once, so we can pass activeProtocol to DailyBriefing
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [calendarEvents, setCalendarEvents] = useState<{ time: string; currency: string; event: string }[]>([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const { data } = await supabase
          .from('foundations_protocols')
          .select('protocol_id')
          .eq('user_id', user.id)
        if (data) setCompletedIds(new Set(data.map((r: any) => r.protocol_id)))
      } catch (e) {
        console.error('[FoundationsSection] protocol fetch error:', e)
      }
    }
    load()
  }, [user])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/today`)
      .then(r => r.json())
      .then(d => setCalendarEvents(d.events || []))
      .catch(() => {})
  }, [])

  const activeProtocol = getFirstActiveProtocol(analyses.length, completedIds)

  return (
    <div style={{ marginBottom: 28 }}>

      {/* ── Header bar (always visible) ── */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v) }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'linear-gradient(135deg, rgba(229,184,60,0.08) 0%, rgba(229,184,60,0.03) 50%, transparent 100%)',
          borderTop:    '2px solid #e5b83c',
          borderRight:  '1px solid rgba(229,184,60,0.3)',
          borderBottom: open ? 'none' : '1px solid rgba(229,184,60,0.3)',
          borderLeft:   '1px solid rgba(229,184,60,0.3)',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          padding: '14px 20px',
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: '0 0 20px rgba(229,184,60,0.06), inset 0 1px 0 rgba(229,184,60,0.1)',
        }}
      >
        {/* Left: label + subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 14, fontWeight: 700,
            color: GOLD, whiteSpace: 'nowrap', letterSpacing: '0.2em',
          }}>
            FOUNDATIONS
          </span>
          <Link
            href="/foundations"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: MONO, fontSize: 11, color: GOLD,
              letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f0c84a' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = GOLD }}
          >
            New to trading? Start here. →
          </Link>
        </div>

        {/* Right: chevron */}
        <ChevronIcon open={open} />
      </div>

      {/* ── Expanded body ── */}
      {open && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,184,60,0.04) 0%, rgba(229,184,60,0.01) 50%, transparent 100%)',
          borderRight:  '1px solid rgba(229,184,60,0.3)',
          borderBottom: '1px solid rgba(229,184,60,0.3)',
          borderLeft:   '1px solid rgba(229,184,60,0.3)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 4px 20px rgba(229,184,60,0.06)',
        }}>
          {/* 1. Pre-Flight Clearance */}
          <PreFlightClearance
            analyses={analyses}
            calendarEvents={calendarEvents}
          />

          {/* 2. Daily Briefing */}
          <DailyBriefing
            analyses={analyses}
            profile={profile}
            complianceData={complianceData}
            activeProtocol={activeProtocol}
          />

          {/* 2. Operator Rank */}
          <OperatorRank />

          {/* 3. Active Protocols */}
          <ActiveProtocols analyses={analyses} />

          {/* 4. Desk Note Feed */}
          <DeskNoteFeed analyses={analyses} complianceData={complianceData} />
        </div>
      )}
    </div>
  )
}
