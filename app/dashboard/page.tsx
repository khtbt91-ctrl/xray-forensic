'use client'
import { Component, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import NavBar from '../components/NavBar'
import FoundationsSection from '../components/foundations/FoundationsSection'

// ── Error boundary ────────────────────────────────────────────────────────────

class DashboardErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#050811', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#ef4444', letterSpacing: '0.1em' }}>DASHBOARD ERROR</p>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>Something went wrong loading your dashboard.</p>
          <a href="/dashboard" style={{ color: '#e5b83c', fontSize: '0.8rem', textDecoration: 'none' }}>Reload →</a>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Score helpers ─────────────────────────────────────────────────────────────

function getScoreStyle(score: number) {
  if (score >= 8.5) return { color: '#10b981', tier: 'Gold' }
  if (score >= 7.0) return { color: '#e5b83c', tier: 'Silver' }
  return { color: '#ef4444', tier: 'Red' }
}

// ── Compliance sidebar ────────────────────────────────────────────────────────

function ComplianceTracker({ complianceData }: { complianceData: { latest: any; previous: any } | null }) {
  // Derive real bars from complianceData.latest if available
  const latest = complianceData?.latest

  // Map Supabase prescription fields to 0-100 bar values
  const bars = latest ? [
    {
      label: 'The 95/5 Discipline',
      // scores.behavioral_control is 0-10 → normalize to %; fallback: penalise revenge trades
      value: latest.scores?.behavioral_control != null
        ? Math.round(latest.scores.behavioral_control * 10)
        : Math.max(0, Math.min(100, 100 - (latest.revenge_count || 0) * 5)),
      color: '#e5b83c',
    },
    {
      label: 'Stop-Loss Protocols',
      value: latest.scores?.risk_discipline != null
        ? Math.round(latest.scores.risk_discipline * 10)
        : Math.max(0, Math.min(100, 100 - (latest.no_sl_count || 0) * 3)),
      color: '#e5b83c',
    },
    {
      label: 'Position Sizing',
      value: latest.scores?.position_sizing != null
        ? Math.round(latest.scores.position_sizing * 10)
        : Math.min(100, Math.round((latest.profit_factor || 0) * 50)),
      color: '#e5b83c',
    },
    {
      label: 'Emotional Control',
      value: latest.scores?.emotional_control != null
        ? Math.round(latest.scores.emotional_control * 10)
        : Math.round((latest.win_rate || 0) * 100),
      color: undefined, // set below
    },
  ] : null

  if (bars) {
    // Emotional control amber if below 80
    bars[3].color = bars[3].value < 80 ? '#f59e0b' : '#e5b83c'
  }

  const avgCompliance = bars
    ? Math.round(bars.reduce((s, b) => s + b.value, 0) / bars.length)
    : null

  return (
    <div style={{ background: '#0e1626', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>
          Compliance Tracker
        </span>
        {/* TrendingDown icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b83c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      </div>

      {bars ? (
        <>
          {/* Progress bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bars.map((bar) => (
              <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94a3b8' }}>{bar.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: bar.color }}>{bar.value}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#0b1220', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${bar.value}%`,
                    background: bar.color,
                    borderRadius: '100px',
                    boxShadow: bar.color === '#e5b83c' ? '0 0 8px #e5b83c' : undefined,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* System threshold */}
          <div style={{ background: '#050811', border: '1px solid #1e293b', borderRadius: '6px', padding: '14px', textAlign: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#e5b83c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
              [SYSTEM THRESHOLD]
            </span>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Average compliance above{' '}
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>85%</span>
              {' '}required for Operator eligibility. Current:{' '}
              <span style={{ color: avgCompliance != null && avgCompliance >= 85 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                {avgCompliance}%
              </span>
            </p>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#475569', lineHeight: 1.7 }}>
            Complete your first analysis to unlock compliance tracking.
          </p>
          <a href="/new" style={{ display: 'inline-block', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#e5b83c', textDecoration: 'none', border: '1px solid rgba(229,184,60,0.3)', borderRadius: '4px', padding: '6px 14px' }}>
            Upload Trade Data →
          </a>
        </div>
      )}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, color, icon, sub }: {
  label: string
  value: string
  color: string
  icon: React.ReactNode
  sub?: string
}) {
  return (
    <div style={{ background: '#0e1626', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2rem', fontWeight: 700, color, lineHeight: 1 }}>
          {value}
        </span>
        {sub && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569' }}>{sub}</span>
        )}
      </div>
      <div style={{ padding: '14px', borderRadius: '8px', background: '#0b1220', border: '1px solid #1e293b', color: '#475569', flexShrink: 0 }}>
        {icon}
      </div>
    </div>
  )
}

// ── Main content ──────────────────────────────────────────────────────────────

function DashboardContent() {
  const { user, session, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [complianceData, setComplianceData] = useState<{ latest: any; previous: any } | null>(null)

  // ── Auth guards (unchanged) ──
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!loading && user && !profile) {
      const timer = setTimeout(() => router.push('/new'), 2000)
      return () => clearTimeout(timer)
    }
  }, [loading, user, profile, router])

  useEffect(() => {
    if (!user) return
    fetchAnalyses()
    fetchCompliance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // ── Login ping — updates discipline streak in DB on each dashboard load ──
  useEffect(() => {
    if (!user || !session?.access_token) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login-ping`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .catch(() => null) // silent — streak is non-critical
  }, [user, session?.access_token])

  // ── Data fetching (unchanged logic, added overall_score + archetype) ──
  const fetchAnalyses = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase
        .from('analyses')
        .select('id, created_at, tier_id, net_pnl, total_trades, win_rate, client_name, overall_score, archetype')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20)
      setAnalyses(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchCompliance = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(2)
      if (data && data.length >= 2) {
        setComplianceData({ latest: data[0], previous: data[1] })
      } else if (data && data.length === 1) {
        // Single snapshot — still populate sidebar, just no comparison
        setComplianceData({ latest: data[0], previous: data[0] })
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ── Loading state ──
  if (loading) return (
    <div style={{ background: '#050811', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '100px', background: '#0e1626', borderRadius: '8px' }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="skeleton" style={{ height: '400px', background: '#0e1626', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '400px', background: '#0e1626', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  )

  if (!user) return <div style={{ background: '#050811', minHeight: '100vh' }} />

  if (!profile) return (
    <div style={{ background: '#050811', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '20px', height: '20px', border: '2px solid #1e293b', borderTopColor: '#e5b83c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em' }}>SETTING UP YOUR ACCOUNT...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  // ── Derived stats ──
  const usagePercent = profile.analyses_limit === -1 ? 0 : (profile.analyses_used / profile.analyses_limit) * 100

  const avgScore = analyses.length > 0 && analyses.some(a => a.overall_score != null)
    ? analyses.reduce((s, a) => s + (a.overall_score || 0), 0) / analyses.filter(a => a.overall_score != null).length
    : null

  const biggestLeak = analyses.length > 0
    ? analyses.reduce((min, a) => (a.net_pnl || 0) < min ? (a.net_pnl || 0) : min, analyses[0].net_pnl || 0)
    : null

  const biggestLeakArchetype = biggestLeak !== null
    ? analyses.find(a => a.net_pnl === biggestLeak)?.archetype ?? null
    : null

  return (
    <div style={{ background: '#050811', minHeight: '100vh' }} className="circuit-overlay fade-in-on-enter">
      <NavBar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ── Header ribbon ── */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.01em' }}>
              Trader Diagnosis Dashboard
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(229,184,60,0.08)', border: '1px solid rgba(229,184,60,0.2)', borderRadius: '4px', padding: '3px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#e5b83c', letterSpacing: '0.06em' }}>
                {/* UserCheck icon */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                OPERATOR ID: {user.email}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94a3b8' }}>• Live Forensic Feed</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            {profile.can_analyze ? (
              <a
                href="/new"
                id="btn-new-analysis"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#e5b83c', color: '#000', borderRadius: '6px', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', boxShadow: '0 4px 12px rgba(229,184,60,0.15)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Analysis
              </a>
            ) : (
              <a href="/new?upgrade=true" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#e5b83c', color: '#000', borderRadius: '6px', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '13px' }}>
                Upgrade Tier →
              </a>
            )}
            <button
              onClick={signOut}
              style={{ background: 'transparent', border: '1px solid #1e293b', color: '#475569', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Foundations ── */}
        <FoundationsSection
          analyses={analyses}
          profile={profile}
          complianceData={complianceData}
        />

        {/* ── 4 KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}
          className="stats-kpis-grid">
          <StatCard
            label="Total Analyses"
            value={String(profile.total_analyses ?? analyses.length)}
            color="#f8fafc"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="6" height="18"/><rect x="9" y="8" width="6" height="13"/><rect x="16" y="13" width="6" height="8"/></svg>}
          />
          <StatCard
            label="Average Score"
            value={avgScore != null ? avgScore.toFixed(1) : '—'}
            color="#e5b83c"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>}
          />
          <StatCard
            label="Biggest Leak"
            value={biggestLeak !== null ? `${biggestLeak < 0 ? '-' : '+'}$${Math.abs(biggestLeak).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—'}
            color={biggestLeak !== null && biggestLeak < 0 ? '#ef4444' : '#10b981'}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            sub={biggestLeakArchetype ?? undefined}
          />
          <StatCard
            label="Prescriptions Followed"
            value="—"
            color="#10b981"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
            sub="coming soon"
          />
        </div>

        {/* Usage bar (below cards, full-width, only for limited tiers) */}
        {profile.analyses_limit !== -1 && (
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569', whiteSpace: 'nowrap' }}>
              {profile.analyses_used}/{profile.analyses_limit} this month
            </span>
            <div style={{ flex: 1, height: '3px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(usagePercent, 100)}%`, background: usagePercent >= 100 ? '#ef4444' : usagePercent >= 80 ? '#f59e0b' : '#e5b83c', borderRadius: '2px', transition: 'width 300ms ease' }} />
            </div>
          </div>
        )}

        {/* ── Main body: 2/3 table + 1/3 sidebar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Analysis History Table */}
          <div style={{ background: '#0e1626', border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>

            {/* Table header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #1e293b', background: 'rgba(11,18,32,0.4)' }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>
                Analysis History
              </span>
              {!loadingData && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569', letterSpacing: '0.06em' }}>
                  Showing {analyses.length} {analyses.length === 1 ? 'log' : 'logs'}
                </span>
              )}
            </div>

            {/* Table content */}
            {loadingData ? (
              <div style={{ padding: '24px' }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '48px', background: '#0b1220', borderRadius: '6px', marginBottom: '8px' }} />)}
              </div>
            ) : analyses.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '17px', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>Run your first diagnosis</p>
                <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Upload your MT5 trade history to get your forensic report.</p>
                <a href="/new" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', background: '#e5b83c', color: '#000', borderRadius: '6px', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '13px' }}>
                  Upload Trade Data →
                </a>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      {['Date', 'Trades', 'Score', 'Archetype', 'Action'].map(col => (
                        <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analyses.map((analysis) => {
                      const score = analysis.overall_score
                      const scoreStyle = score != null ? getScoreStyle(score) : null
                      const isGood = analysis.archetype === 'Optimal' || analysis.archetype === 'Disciplined'
                      return (
                        <tr
                          key={analysis.id}
                          style={{ borderBottom: '1px solid rgba(30,41,59,0.5)', transition: 'background 0.15s', cursor: 'default' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(20,30,53,0.5)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 500 }}>
                            {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {analysis.client_name && (
                              <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>{analysis.client_name}</div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{analysis.total_trades}</td>
                          <td style={{ padding: '14px 16px' }}>
                            {score != null ? (
                              <span style={{ color: scoreStyle!.color, fontWeight: 700 }}>
                                {score.toFixed(1)} ({scoreStyle!.tier})
                              </span>
                            ) : (
                              <span style={{ color: '#475569' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {analysis.archetype ? (
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                background: isGood ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: isGood ? '#10b981' : '#ef4444',
                                border: `1px solid ${isGood ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                              }}>
                                {analysis.archetype}
                              </span>
                            ) : (
                              <span style={{ color: '#475569' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <a
                              id={`btn-view-${analysis.id}`}
                              href={`/report/${analysis.id}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 600, color: '#e5b83c', textDecoration: 'none', border: '1px solid rgba(229,184,60,0.3)', borderRadius: '4px', padding: '5px 10px', transition: 'border-color 0.15s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,184,60,0.08)'; e.currentTarget.style.borderColor = 'rgba(229,184,60,0.6)' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(229,184,60,0.3)' }}
                            >
                              View Report
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Compliance Tracker sidebar */}
          <ComplianceTracker complianceData={complianceData} />
        </div>

        {/* ── Next diagnosis prompt ── */}
        {analyses.length > 0 && profile.can_analyze && (
          <div style={{ marginTop: '24px', padding: '20px 24px', background: 'rgba(229,184,60,0.04)', border: '1px solid rgba(229,184,60,0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#e5b83c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                READY FOR NEXT DIAGNOSIS?
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Upload your latest history. X-Ray will show if your behavior improved since last time.
              </p>
            </div>
            <a href="/new" style={{ padding: '10px 20px', background: '#e5b83c', color: '#000', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", whiteSpace: 'nowrap' }}>
              Upload New History →
            </a>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  )
}
