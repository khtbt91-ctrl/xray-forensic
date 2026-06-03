'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { UserProfile } from '@/lib/supabase'
import DailyBriefing   from './DailyBriefing'
import DeskNoteFeed    from './DeskNoteFeed'
import ActiveProtocols from './ActiveProtocols'
import OperatorRank    from './OperatorRank'

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
  const { user } = useAuth()

  // Default: expanded for < 3 analyses (still in foundations territory)
  const defaultOpen = analyses.length < 3
  const [open, setOpen] = useState(defaultOpen)

  // Sync if analyses count crosses the threshold after mount (e.g. after a new upload)
  useEffect(() => {
    setOpen(analyses.length < 3)
  }, [analyses.length])

  // Fetch completed protocol IDs once, so we can pass activeProtocol to DailyBriefing
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

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

  const activeProtocol = getFirstActiveProtocol(analyses.length, completedIds)

  return (
    <div style={{ marginBottom: 28 }}>

      {/* ── Header bar (always visible) ── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: BG_CARD,
          borderTop:    `1px solid ${BORDER}`,
          borderRight:  `1px solid ${BORDER}`,
          borderBottom: open ? 'none' : `1px solid ${BORDER}`,
          borderLeft:   `3px solid ${GOLD}`,
          borderRadius: open ? '0 8px 0 0' : '0 8px 8px 0',
          padding: '14px 20px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Left: label + subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 14, fontWeight: 700,
            color: '#f8fafc', whiteSpace: 'nowrap', letterSpacing: '-0.01em',
          }}>
            FOUNDATIONS
          </span>
          <span style={{
            fontFamily: MONO, fontSize: 11, color: '#475569',
            letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            New to trading? Start here.
          </span>
        </div>

        {/* Right: chevron */}
        <ChevronIcon open={open} />
      </button>

      {/* ── Expanded body ── */}
      {open && (
        <div style={{
          background: '#050811',
          border: `1px solid ${BORDER}`,
          borderTop: 'none',
          borderLeft: `3px solid ${GOLD}`,
          borderRadius: '0 0 8px 0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {/* 1. Daily Briefing */}
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
