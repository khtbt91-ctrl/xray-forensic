'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD    = '#e5b83c'
const BG_BASE = '#050811'
const BORDER  = '#1e293b'
const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Space Grotesk', sans-serif"

// ── Rank ladder ────────────────────────────────────────────────────────────────

interface RankTier {
  rank: string
  minXp: number
  maxXp: number | null  // null = no ceiling (top rank)
}

const RANKS: RankTier[] = [
  { rank: 'RECRUIT',        minXp: 0,    maxXp: 99   },
  { rank: 'ANALYST',        minXp: 100,  maxXp: 299  },
  { rank: 'SPECIALIST',     minXp: 300,  maxXp: 599  },
  { rank: 'OPERATOR',       minXp: 600,  maxXp: 999  },
  { rank: 'SENIOR OPERATOR',minXp: 1000, maxXp: 1999 },
  { rank: 'PRINCIPAL',      minXp: 2000, maxXp: null },
]

function getRankTier(xp: number): RankTier {
  return [...RANKS].reverse().find(r => xp >= r.minXp) ?? RANKS[0]
}

function getNextRankTier(current: RankTier): RankTier | null {
  const idx = RANKS.findIndex(r => r.rank === current.rank)
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null
}

/** Progress fraction (0–1) within the current rank band */
function rankProgress(xp: number, tier: RankTier): number {
  if (tier.maxXp === null) return 1
  const band = tier.maxXp - tier.minXp + 1
  return Math.min((xp - tier.minXp) / band, 1)
}

// ── Lock icon (lucide-style, inline SVG) ───────────────────────────────────────
function LockIcon() {
  return (
    <svg
      width="13" height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke={GOLD} strokeWidth="1.4" />
      <path d="M5 7V5.5a3 3 0 0 1 6 0V7" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Rank data shape ────────────────────────────────────────────────────────────
interface RankData {
  xp: number
  operator_rank: string
  discipline_streak: number
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface OperatorRankProps {
  /** Optional pre-fetched rank data — pass if parent already has it */
  rankData?: RankData | null
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function OperatorRank({ rankData: externalData }: OperatorRankProps) {
  const { user } = useAuth()
  const [data, setData] = useState<RankData | null>(externalData ?? null)
  const [loading, setLoading] = useState(!externalData)

  useEffect(() => {
    // If parent supplied data, use it
    if (externalData !== undefined) { setData(externalData); setLoading(false); return }
    if (!user) { setLoading(false); return }

    const load = async () => {
      try {
        const { data: row } = await supabase
          .from('user_profiles')
          .select('xp, operator_rank, discipline_streak')
          .eq('id', user.id)
          .single()
        if (row) setData(row as RankData)
      } catch (e) {
        console.error('[OperatorRank] fetch error:', e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, externalData])

  if (loading) {
    return (
      <div style={{
        background: '#0e1626', border: `1px solid ${BORDER}`, borderRadius: 8,
        padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div className="skeleton" style={{ height: 12, width: 120, background: '#1e293b', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 28, width: 180, background: '#1e293b', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 6,  width: '100%', background: '#1e293b', borderRadius: 4 }} />
      </div>
    )
  }

  // Empty state — new user, no data yet
  const xp      = data?.xp               ?? 0
  const streak  = data?.discipline_streak ?? 0
  // Use DB-stored rank as source of truth; fall back to computed rank
  const tier    = getRankTier(xp)
  const next    = getNextRankTier(tier)
  const pct     = rankProgress(xp, tier)
  const xpToNext = next ? next.minXp - xp : 0

  return (
    <div style={{
      background: '#0e1626',
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      padding: '20px 24px',
    }}>
      {/* Section label */}
      <div style={{
        fontFamily: MONO, fontSize: 10, color: GOLD,
        letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4,
      }}>
        OPERATOR RANK
      </div>

      {/* Rank name */}
      <div style={{
        fontFamily: DISPLAY, fontSize: 22, fontWeight: 700,
        color: '#f8fafc', letterSpacing: '-0.01em', marginBottom: 16,
        lineHeight: 1.2,
      }}>
        {tier.rank}
      </div>

      {/* XP progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          width: '100%', height: 4,
          background: BG_BASE, borderRadius: 100, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct * 100}%`,
            background: GOLD,
            borderRadius: 100,
            boxShadow: `0 0 8px rgba(229,184,60,0.4)`,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* XP label row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: '0.04em' }}>
          {xp} XP
        </span>
        {next ? (
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {xpToNext} XP to {next.rank}
          </span>
        ) : (
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            MAX RANK
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />

      {/* Discipline streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LockIcon />
        <span style={{ fontFamily: MONO, fontSize: 10, color: '#94a3b8', letterSpacing: '0.06em' }}>
          DISCIPLINE STREAK:{'  '}
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 12 }}>
            {streak}
          </span>
          {' '}
          <span style={{ color: 'var(--text-muted)' }}>
            {streak === 1 ? 'day' : 'days'}
          </span>
        </span>
      </div>
    </div>
  )
}
