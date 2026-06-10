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
  if (score >= 80) return { color: '#10b981', tier: 'GOLD' }
  if (score >= 60) return { color: '#e5b83c', tier: 'SILVER' }
  return { color: '#ef4444', tier: 'RED' }
}

// ── Compliance sidebar ────────────────────────────────────────────────────────

function ComplianceTracker({
  session,
  analysesCount,
  onStats,
}: {
  session: any
  analysesCount: number
  onStats?: (total: number, followed: number) => void
}) {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [followed, setFollowed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/prescriptions`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json) {
          const t = json.total || 0
          const f = json.followed || 0
          setPrescriptions(json.prescriptions || [])
          setTotal(t)
          setFollowed(f)
          onStats?.(t, f)
        }
      })
      .finally(() => setLoading(false))
  }, [session?.access_token])

  const markFollowed = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/prescriptions/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'followed' }),
    })
    if (res.ok) {
      setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'followed' } : p))
      const newFollowed = followed + 1
      setFollowed(newFollowed)
      setToast('+25 XP')
      setTimeout(() => setToast(null), 2500)
    }
  }

  const complianceRate = total > 0 ? Math.round((followed / total) * 100) : 0
  const active = prescriptions.filter(p => p.status !== 'followed')
  const done   = prescriptions.filter(p => p.status === 'followed')

  return (
    <div style={{ background: '#0e1626', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      <style>{`
        @keyframes xpFade {
          0%   { opacity:0; transform:translateY(-6px) }
          15%  { opacity:1; transform:none }
          75%  { opacity:1 }
          100% { opacity:0 }
        }
      `}</style>

      {/* XP toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(63,185,80,0.15)', border: '1px solid rgba(63,185,80,0.4)',
          borderRadius: 6, padding: '5px 10px',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
          color: '#3FB950', fontWeight: 700,
          animation: 'xpFade 2.5s ease forwards', pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>
          Compliance Tracker
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b83c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      </div>

      {loading ? (
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <div style={{ width: '18px', height: '18px', border: '2px solid #1e293b', borderTopColor: '#e5b83c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : total === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          {analysesCount === 0 ? (
            <>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#475569', lineHeight: 1.7, margin: '0 0 16px' }}>
                Complete your first analysis to unlock<br />compliance tracking.
              </p>
              <a href="/new" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#e5b83c', textDecoration: 'none', border: '1px solid rgba(229,184,60,0.3)', borderRadius: '4px', padding: '6px 14px' }}>
                Upload Trade Data →
              </a>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#475569', lineHeight: 1.7, margin: '0 0 16px' }}>
                Your next analysis will generate trackable<br />prescriptions. Upload again to activate<br />compliance tracking.
              </p>
              <a href="/new" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#e5b83c', textDecoration: 'none', border: '1px solid rgba(229,184,60,0.3)', borderRadius: '4px', padding: '6px 14px' }}>
                Run New Analysis →
              </a>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Rate bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94a3b8' }}>COMPLIANCE RATE</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#e5b83c' }}>{complianceRate}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#0b1220', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${complianceRate}%`, background: '#e5b83c', borderRadius: '100px', boxShadow: '0 0 8px rgba(229,184,60,0.4)', transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569' }}>
              {followed}/{total} prescriptions followed
            </span>
          </div>

          {/* Active prescriptions */}
          {active.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</span>
              {active.map(p => (
                <button
                  key={p.id}
                  onClick={() => markFollowed(p.id)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'none', border: '1px solid #1e293b', borderRadius: '6px', padding: '10px 12px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,184,60,0.4)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e293b' }}
                >
                  <div style={{ width: '15px', height: '15px', border: '1.5px solid #475569', borderRadius: '3px', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#e2e8f0', lineHeight: 1.5 }}>
                      {p.prescription_text}
                    </span>
                    {p.estimated_impact != null && (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#3FB950' }}>
                        saves ${Math.round(p.estimated_impact).toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Followed prescriptions */}
          {done.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Followed</span>
              {done.slice(0, 3).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', border: '1px solid rgba(63,185,80,0.15)', borderRadius: '6px', padding: '10px 12px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#475569', lineHeight: 1.5, textDecoration: 'line-through' }}>
                    {p.prescription_text}
                  </span>
                </div>
              ))}
              {done.length > 3 && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#475569', textAlign: 'center' }}>
                  +{done.length - 3} more followed
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ scores, width = 80, height = 28 }: { scores: number[], width?: number, height?: number }) {
  if (scores.length === 0) return <svg width={width} height={height} />
  const pad = 3
  const norm = (s: number) => height - pad - (s / 100) * (height - pad * 2)
  const trend = scores[scores.length - 1] - scores[0]
  const color = trend > 3 ? '#3FB950' : trend < -3 ? '#F85149' : '#8B949E'
  if (scores.length === 1) {
    return <svg width={width} height={height}><circle cx={width / 2} cy={norm(scores[0])} r={2.5} fill={color} /></svg>
  }
  const pts = scores.map((s, i) => `${(i / (scores.length - 1)) * width},${norm(s)}`).join(' ')
  const lx = width, ly = norm(scores[scores.length - 1])
  return (
    <svg width={width} height={height}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r={2.5} fill={color} />
    </svg>
  )
}

// ── Trader DNA ────────────────────────────────────────────────────────────────

function TraderDnaSection({ session, tierId }: { session: any, tierId: string }) {
  const [dna, setDna] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const GOLD = '#e5b83c'

  const DIMS = [
    'htf_bias', 'liquidity_awareness', 'ote_discipline', 'ob_fvg_confluence',
    'session_discipline', 'risk_architecture', 'behavioral_control',
  ]
  const tc = (trend: string) => trend === 'improving' ? '#3FB950' : trend === 'worsening' ? '#F85149' : '#8B949E'
  const ts = (trend: string) => trend === 'improving' ? '↑' : trend === 'worsening' ? '↓' : '→'

  useEffect(() => {
    if (!session?.access_token) return
    if (!['guardian', 'sovereign'].includes(tierId)) { setLoading(false); return }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/dna`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(setDna)
      .finally(() => setLoading(false))
  }, [session?.access_token, tierId])

  if (!['forensic', 'guardian', 'sovereign'].includes(tierId)) return null

  if (tierId === 'forensic') return (
    <div style={{ marginTop: 24, padding: '20px 24px', background: '#0e1626', border: '1px solid #1e293b', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 6px' }}>TRADER DNA</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#E6EDF3', margin: '0 0 4px' }}>Behavioral profile across all uploads</p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569', margin: 0 }}>
          Upgrade to GUARDIAN to unlock dimension trend charts, archetype evolution, and your trader fingerprint.
        </p>
      </div>
      <a href="/pricing" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: GOLD, border: '1px solid rgba(229,184,60,0.3)', borderRadius: 4, padding: '8px 16px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
        Upgrade to GUARDIAN →
      </a>
    </div>
  )

  if (loading) return (
    <div style={{ marginTop: 24, padding: '20px 24px', background: '#0e1626', border: '1px solid #1e293b', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 16, height: 16, border: '2px solid #1e293b', borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569' }}>Loading Trader DNA...</span>
    </div>
  )

  if (!dna || dna.insufficient_data) return (
    <div style={{ marginTop: 24, padding: '24px', background: '#0e1626', border: '1px solid #1e293b', borderRadius: 8, textAlign: 'center' }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 10px' }}>TRADER DNA</p>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#E6EDF3', margin: '0 0 6px' }}>Upload again to unlock your Trader DNA profile.</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569', margin: 0 }}>
        Requires 2 or more analyses to detect behavioral patterns.
      </p>
    </div>
  )

  const dims = dna.dimensions || {}
  const archetypeEvolution = dna.archetype_history?.length > 1 && new Set(dna.archetype_history).size > 1

  return (
    <div style={{ marginTop: 24, background: '#0e1626', border: '1px solid #1e293b', borderRadius: 8, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', borderBottom: '1px solid #1e293b', background: 'rgba(11,18,32,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>TRADER DNA</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569' }}>
            {dna.total_analyses} uploads · {dna.date_range}
          </span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569' }}>Behavioral fingerprint</span>
      </div>

      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Left — dimension list */}
        <div>
          {DIMS.map(dk => {
            const d = dims[dk]
            if (!d) return null
            const tcolor = tc(d.trend)
            return (
              <div key={dk} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid rgba(30,41,59,0.5)' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8B949E', width: 140, flexShrink: 0, letterSpacing: '0.05em' }}>
                  {d.label.toUpperCase()}
                </span>
                <Sparkline scores={d.scores} width={72} height={26} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: tcolor, width: 26, textAlign: 'right' }}>
                  {d.latest_score}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: tcolor, minWidth: 30 }}>
                  {d.delta > 0 ? `+${d.delta}` : String(d.delta)}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: tcolor }}>
                  {ts(d.trend)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Right — summary cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { label: 'BEST DIMENSION',  key: dna.best_dimension,  accent: '#3FB950', val: (d: any) => `${d.average}/100` },
            { label: 'NEEDS WORK',      key: dna.worst_dimension, accent: '#F85149', val: (d: any) => `${d.average}/100` },
            { label: 'MOST IMPROVED',   key: dna.most_improved,   accent: GOLD,      val: (d: any) => `+${d.delta}` },
          ] as const).map(({ label, key, accent, val }) => {
            const d = dims[key]
            if (!d) return null
            return (
              <div key={label} style={{ background: '#080f1e', borderRadius: 6, padding: '13px 14px', border: `1px solid ${accent}22` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#475569', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>{label}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: '#E6EDF3' }}>{d.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accent, fontWeight: 700 }}>{val(d)}</span>
                </div>
              </div>
            )
          })}

          {/* Archetype */}
          <div style={{ background: '#080f1e', borderRadius: 6, padding: '13px 14px', border: `1px solid rgba(229,184,60,0.12)`, marginTop: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#475569', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>CURRENT ARCHETYPE</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: GOLD }}>
              {dna.current_archetype ? dna.current_archetype.replace(/_/g, ' ').toUpperCase() : '—'}
            </span>
            {archetypeEvolution && (
              <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8B949E', lineHeight: 1.7 }}>
                {(dna.archetype_history as string[]).map((a, i) => (
                  <span key={i}>
                    {a.replace(/_/g, ' ')}
                    {i < dna.archetype_history.length - 1 && <span style={{ color: GOLD, margin: '0 5px' }}>→</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
  const [rxStats, setRxStats] = useState<{ total: number; followed: number } | null>(null)

  // ── Auth guards (unchanged) ──
  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/dashboard')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, session?.access_token])

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/analyses`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!res.ok) throw new Error('Fetch failed')
      const json = await res.json()
      setAnalyses(json.analyses || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
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

  // Trend: latest analysis score vs previous
  const scoresTrend = analyses.length >= 2 &&
    analyses[0].overall_score != null && analyses[1].overall_score != null
    ? (analyses[0].overall_score as number) - (analyses[1].overall_score as number)
    : null
  const trendLabel = scoresTrend === null ? undefined
    : scoresTrend > 3 ? '↑ improving'
    : scoresTrend < -3 ? '↓ declining'
    : '→ stable'

  const biggestLeak = analyses.length > 0
    ? analyses.reduce((min, a) => (a.net_pnl || 0) < min ? (a.net_pnl || 0) : min, analyses[0].net_pnl || 0)
    : null

  const biggestLeakArchetype = biggestLeak !== null
    ? analyses.find(a => a.net_pnl === biggestLeak)?.archetype_name ?? null
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
                OPERATOR: {(
                  user.user_metadata?.full_name?.split(' ')[0] ||
                  user.user_metadata?.name?.split(' ')[0] ||
                  (user.email?.split('@')[0] ?? 'OPERATOR')
                )}
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
            ) : (['signal', 'forensic'].includes(profile.tier_id) && (
              <a href="/new?upgrade=true" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#e5b83c', color: '#000', borderRadius: '6px', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '13px' }}>
                Upgrade Tier →
              </a>
            ))}
            <button
              onClick={signOut}
              style={{ background: 'transparent', border: '1px solid #1e293b', color: '#475569', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}
            >
              Sign Out
            </button>
          </div>
        </div>

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
            value={avgScore != null ? avgScore.toFixed(0) : '—'}
            color="#e5b83c"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>}
            sub={trendLabel}
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
            value={rxStats && rxStats.total > 0 ? `${rxStats.followed}/${rxStats.total}` : '—'}
            color="#10b981"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
            sub={
              analyses.length === 0
                ? 'run first analysis'
                : rxStats === null || rxStats.total === 0
                ? 'activates on next upload'
                : `${Math.round((rxStats.followed / rxStats.total) * 100)}% follow-through`
            }
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

        {/* ── Foundations ── */}
        <FoundationsSection
          analyses={analyses}
          profile={profile}
        />

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
                      {['Date', 'Trades', 'Score', 'Δ', 'Archetype', 'Action'].map(col => (
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
                      const delta = analysis.delta_overall as number | null | undefined
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
                                {score}/100
                              </span>
                            ) : (
                              <span style={{ color: '#475569' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {delta != null ? (
                              <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 5px',
                                borderRadius: 3,
                                background: delta > 0 ? 'rgba(63,185,80,0.12)' : delta < 0 ? 'rgba(248,81,73,0.12)' : 'rgba(139,148,158,0.12)',
                                color: delta > 0 ? '#3FB950' : delta < 0 ? '#F85149' : '#8B949E',
                                border: `1px solid ${delta > 0 ? 'rgba(63,185,80,0.25)' : delta < 0 ? 'rgba(248,81,73,0.25)' : 'rgba(139,148,158,0.25)'}`,
                              }}>
                                {delta > 0 ? `+${delta}` : delta === 0 ? '—' : String(delta)}
                              </span>
                            ) : (
                              <span style={{ color: '#475569', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {analysis.archetype_name ? (
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                background: 'rgba(139,148,158,0.08)',
                                color: '#8B949E',
                                border: '1px solid rgba(139,148,158,0.2)',
                              }}>
                                {analysis.archetype_name}
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
          <ComplianceTracker
            session={session}
            analysesCount={analyses.length}
            onStats={(t, f) => setRxStats({ total: t, followed: f })}
          />
        </div>

        {/* ── Trader DNA ── */}
        <TraderDnaSection session={session} tierId={profile.tier_id} />

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
