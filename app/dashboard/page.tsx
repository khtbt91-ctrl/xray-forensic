'use client'
import { Component, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import NavBar from '../components/NavBar'

class DashboardErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#050811',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#ef4444',
            letterSpacing: '0.1em',
          }}>
            DASHBOARD ERROR
          </p>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>
            Something went wrong loading your dashboard.
          </p>
          <a href="/dashboard" style={{ color: '#e5b83c', fontSize: '0.8rem', textDecoration: 'none' }}>
            Reload →
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

function ComplianceVerdict({ latest, previous }: { latest: any; previous: any }) {
  const count = [
    latest.revenge_count < previous.revenge_count,
    latest.no_sl_count < previous.no_sl_count,
    latest.win_rate > previous.win_rate,
    latest.profit_factor > previous.profit_factor,
  ].filter(Boolean).length

  const color = count >= 3 ? '#10b981' : count >= 2 ? '#f59e0b' : '#ef4444'
  const text =
    count >= 3
      ? 'The prescriptions are working. Stay the course.'
      : count >= 2
      ? 'Partial improvement. Review the prescriptions you ignored.'
      : 'Regression detected. The behavior is not changing.'

  return (
    <div style={{
      marginTop: '16px',
      padding: '12px 16px',
      background: '#0b1220',
      borderRadius: '6px',
      borderLeft: `3px solid ${color}`,
    }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.75rem',
        color,
        margin: 0,
      }}>
        {text}
      </p>
    </div>
  )
}

function DashboardContent() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [complianceData, setComplianceData] = useState<{ latest: any; previous: any } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
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

  const fetchAnalyses = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase
        .from('analyses')
        .select('id, created_at, tier_id, net_pnl, total_trades, win_rate, client_name')
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
      }
    } catch (e) {
      console.error(e)
    }
  }

  /* ── Loading skeleton ── */
  if (loading)
    return (
      <div style={{ background: '#050811', minHeight: '100vh', paddingTop: '80px' }}>
        <NavBar />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{
              background: '#0e1626',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              height: '80px',
              marginBottom: '16px',
            }} />
          ))}
        </div>
      </div>
    )

  if (!user) {
    return <div style={{ background: '#050811', minHeight: '100vh' }} />
  }

  if (!profile) {
    return (
      <div style={{
        background: '#050811',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #1e293b',
          borderTopColor: '#e5b83c',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: '#475569',
          letterSpacing: '0.1em',
        }}>
          SETTING UP YOUR ACCOUNT...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const usagePercent =
    profile.analyses_limit === -1
      ? 0
      : (profile.analyses_used / profile.analyses_limit) * 100

  /* Derived stats from analyses */
  const avgWinRate =
    analyses.length > 0
      ? analyses.reduce((sum, a) => sum + (a.win_rate || 0), 0) / analyses.length
      : null
  const biggestLeak =
    analyses.length > 0
      ? analyses.reduce(
          (min, a) => ((a.net_pnl || 0) < min ? a.net_pnl || 0 : min),
          analyses[0].net_pnl || 0
        )
      : null

  return (
    <div style={{ background: '#050811', minHeight: '100vh', paddingTop: '80px' }}>
      <NavBar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#f8fafc',
              margin: '0 0 8px',
            }}>
              Trader Diagnosis Dashboard
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#e5b83c',
                background: 'rgba(229,184,60,0.08)',
                border: '1px solid rgba(229,184,60,0.2)',
                borderRadius: '4px',
                padding: '3px 10px',
                letterSpacing: '0.08em',
              }}>
                OPERATOR ID: {user.email}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#10b981',
                letterSpacing: '0.06em',
              }}>
                • Live Forensic Feed
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {profile.can_analyze ? (
              <a href="/new" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                background: '#e5b83c',
                color: '#000',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
              }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> New Analysis
              </a>
            ) : (
              <a href="/new?upgrade=true" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                background: '#e5b83c',
                color: '#000',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
              }}>
                Upgrade Tier →
              </a>
            )}
            <button onClick={signOut} style={{
              background: 'transparent',
              border: '1px solid #1e293b',
              color: '#475569',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* ── 4 Stats Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {/* Total Analyses */}
          <div style={{
            background: '#0e1626',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              background: '#0b1220',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>Total Analyses</p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '32px',
              fontWeight: 700,
              color: '#f8fafc',
              lineHeight: 1,
            }}>
              {profile.total_analyses ?? analyses.length}
            </p>
          </div>

          {/* This Month */}
          <div style={{
            background: '#0e1626',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              background: '#0b1220',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>This Month</p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '32px',
              fontWeight: 700,
              color: '#e5b83c',
              lineHeight: 1,
            }}>
              {profile.analyses_used}
              <span style={{ fontSize: '16px', color: '#475569', fontWeight: 400 }}>
                /{profile.analyses_limit === -1 ? '∞' : profile.analyses_limit}
              </span>
            </p>
            {profile.analyses_limit !== -1 && (
              <div style={{
                height: '3px',
                background: '#1e293b',
                borderRadius: '2px',
                marginTop: '10px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(usagePercent, 100)}%`,
                  background: usagePercent >= 100 ? '#ef4444' : usagePercent >= 80 ? '#f59e0b' : '#e5b83c',
                  borderRadius: '2px',
                  transition: 'width 300ms ease',
                }} />
              </div>
            )}
          </div>

          {/* Avg Win Rate */}
          <div style={{
            background: '#0e1626',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              background: '#0b1220',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>Avg Win Rate</p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '32px',
              fontWeight: 700,
              color: '#10b981',
              lineHeight: 1,
            }}>
              {avgWinRate !== null ? `${(avgWinRate * 100).toFixed(1)}%` : '—'}
            </p>
          </div>

          {/* Biggest Leak */}
          <div style={{
            background: '#0e1626',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              background: '#0b1220',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>Biggest Leak</p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '32px',
              fontWeight: 700,
              color: biggestLeak !== null && biggestLeak < 0 ? '#ef4444' : '#10b981',
              lineHeight: 1,
            }}>
              {biggestLeak !== null
                ? `${biggestLeak < 0 ? '-' : '+'}$${Math.abs(biggestLeak).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                : '—'}
            </p>
          </div>
        </div>

        {/* ── Compliance comparison ── */}
        {complianceData && (
          <div style={{
            background: '#0e1626',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#e5b83c',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              MONTH-ON-MONTH PROGRESS
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
            }}>
              {[
                { label: 'Revenge Trades', prev: complianceData.previous.revenge_count, curr: complianceData.latest.revenge_count, lower_is_better: true },
                { label: 'No-SL Trades', prev: complianceData.previous.no_sl_count, curr: complianceData.latest.no_sl_count, lower_is_better: true },
                { label: 'Win Rate', prev: complianceData.previous.win_rate, curr: complianceData.latest.win_rate, lower_is_better: false, pct: true },
                { label: 'Profit Factor', prev: complianceData.previous.profit_factor, curr: complianceData.latest.profit_factor, lower_is_better: false },
                { label: 'Net P/L', prev: complianceData.previous.net_pnl, curr: complianceData.latest.net_pnl, lower_is_better: false, money: true },
              ].map((metric, i) => {
                const improved = metric.lower_is_better ? metric.curr < metric.prev : metric.curr > metric.prev
                const unchanged = metric.curr === metric.prev
                const delta = metric.curr - metric.prev
                const deltaPct = metric.prev !== 0 ? (delta / Math.abs(metric.prev)) * 100 : 0
                return (
                  <div key={i} style={{
                    background: '#0b1220',
                    borderRadius: '6px',
                    padding: '12px',
                    borderLeft: `3px solid ${unchanged ? '#1e293b' : improved ? '#10b981' : '#ef4444'}`,
                  }}>
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      color: '#475569',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}>
                      {metric.label}
                    </p>
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color: unchanged ? '#f8fafc' : improved ? '#10b981' : '#ef4444',
                      marginBottom: '2px',
                    }}>
                      {metric.money
                        ? `$${Math.abs(metric.curr).toFixed(0)}`
                        : metric.pct
                        ? `${(metric.curr * 100).toFixed(1)}%`
                        : metric.curr}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: unchanged ? '#475569' : improved ? '#10b981' : '#ef4444' }}>
                      {unchanged ? '→ unchanged' : improved ? '↑ improving' : '↓ regression'}
                      {!unchanged && ` (${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(0)}%)`}
                    </p>
                  </div>
                )
              })}
            </div>
            <ComplianceVerdict latest={complianceData.latest} previous={complianceData.previous} />
          </div>
        )}

        {/* ── Analysis History ── */}
        <div style={{
          background: '#0e1626',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #1e293b',
          }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: '#f8fafc',
              margin: 0,
            }}>
              Analysis History
            </h2>
            {!loadingData && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#475569',
                letterSpacing: '0.06em',
              }}>
                Showing {analyses.length} Logs
              </span>
            )}
          </div>

          {loadingData ? (
            <div style={{ padding: '32px 24px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{
                  height: '52px',
                  background: '#0b1220',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }} />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#f8fafc',
                marginBottom: '8px',
              }}>
                Run your first diagnosis
              </p>
              <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>
                Upload your MT5 trade history to get your forensic report.
              </p>
              <a href="/new" style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 24px',
                background: '#e5b83c',
                color: '#000',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
              }}>
                Upload Trade Data →
              </a>
            </div>
          ) : (
            <div>
              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 100px 80px auto',
                gap: '16px',
                padding: '10px 24px',
                borderBottom: '1px solid #1e293b',
              }}>
                {['Date', 'Trades', 'Net P/L', 'Win Rate', 'Action'].map((col) => (
                  <span key={col} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#475569',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {col}
                  </span>
                ))}
              </div>

              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 100px 80px auto',
                    gap: '16px',
                    padding: '14px 24px',
                    borderBottom: '1px solid rgba(30,41,59,0.5)',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#0b1220' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div>
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      color: '#94a3b8',
                    }}>
                      {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {analysis.client_name && (
                      <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                        {analysis.client_name}
                      </p>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: '#94a3b8',
                  }}>
                    {analysis.total_trades}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '14px',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: (analysis.net_pnl || 0) >= 0 ? '#10b981' : '#ef4444',
                  }}>
                    {(analysis.net_pnl || 0) >= 0 ? '+' : '-'}$
                    {Math.abs(analysis.net_pnl || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: '#94a3b8',
                  }}>
                    {((analysis.win_rate || 0) * 100).toFixed(1)}%
                  </span>
                  <a
                    href={`/report/${analysis.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      color: '#e5b83c',
                      textDecoration: 'none',
                      border: '1px solid rgba(229,184,60,0.3)',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      whiteSpace: 'nowrap',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(229,184,60,0.6)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(229,184,60,0.3)' }}
                  >
                    View Report →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Next diagnosis prompt ── */}
        {analyses.length > 0 && profile.can_analyze && (
          <div style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: 'rgba(229,184,60,0.04)',
            border: '1px solid rgba(229,184,60,0.15)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#e5b83c',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                READY FOR NEXT DIAGNOSIS?
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Upload your latest history. X-Ray will show if your behavior improved since last time.
              </p>
            </div>
            <a href="/new" style={{
              padding: '10px 20px',
              background: '#e5b83c',
              color: '#000',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              whiteSpace: 'nowrap',
            }}>
              Upload New History →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  )
}
