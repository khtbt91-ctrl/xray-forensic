'use client'
import { Component, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

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
        <div
          style={{
            background: 'var(--bg-base)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--loss)',
              letterSpacing: '0.1em',
            }}
          >
            DASHBOARD ERROR
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Something went wrong loading your dashboard.
          </p>
          <a
            href="/dashboard"
            style={{
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              textDecoration: 'none',
            }}
          >
            Reload →
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

function ComplianceVerdict({
  latest,
  previous,
}: {
  latest: any
  previous: any
}) {
  const count = [
    latest.revenge_count < previous.revenge_count,
    latest.no_sl_count < previous.no_sl_count,
    latest.win_rate > previous.win_rate,
    latest.profit_factor > previous.profit_factor,
  ].filter(Boolean).length

  const color =
    count >= 3
      ? 'var(--profit)'
      : count >= 2
      ? 'var(--warning)'
      : 'var(--loss)'

  const text =
    count >= 3
      ? 'The prescriptions are working. Stay the course.'
      : count >= 2
      ? 'Partial improvement. Review the prescriptions you ignored.'
      : 'Regression detected. The behavior is not changing.'

  return (
    <div
      style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: 'var(--bg-elevated)',
        borderRadius: '6px',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: color,
          margin: 0,
        }}
      >
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
  const [complianceData, setComplianceData] = useState<{
    latest: any
    previous: any
  } | null>(null)

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
        .select(
          'id, created_at, tier_id, net_pnl, total_trades, win_rate, client_name'
        )
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
        setComplianceData({
          latest: data[0],
          previous: data[1],
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading)
    return (
      <div
        style={{
          background: 'var(--bg-base)',
          minHeight: '100vh',
          paddingTop: '80px',
        }}
      >
        <div
          style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}
        >
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                width: '140px',
                height: '10px',
                background: 'var(--bg-elevated)',
                borderRadius: '4px',
                marginBottom: '14px',
              }}
            />
            <div
              style={{
                width: '260px',
                height: '22px',
                background: 'var(--bg-elevated)',
                borderRadius: '4px',
                marginBottom: '10px',
              }}
            />
            <div
              style={{
                width: '90px',
                height: '10px',
                background: 'var(--bg-elevated)',
                borderRadius: '4px',
              }}
            />
          </div>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              height: '88px',
              marginBottom: '24px',
              opacity: 0.5,
            }}
          />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                height: '64px',
                marginBottom: '8px',
                opacity: 0.35,
              }}
            />
          ))}
        </div>
      </div>
    )

  if (!user) {
    // login redirect is in progress via useEffect — hold on bg-base
    return <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }} />
  }

  if (!profile) {
    return (
      <div
        style={{
          background: 'var(--bg-base)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--border-subtle)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}
        >
          SETTING UP YOUR ACCOUNT...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tierColors: Record<string, string> = {
    signal: 'var(--text-muted)',
    audit: 'var(--accent-primary)',
    forensic: 'var(--accent-primary)',
    guardian: 'var(--warning)',
    sovereign: 'var(--accent-secondary)',
  }

  const usagePercent =
    profile.analyses_limit === -1
      ? 0
      : (profile.analyses_used / profile.analyses_limit) * 100

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        paddingTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem',
                color: 'var(--accent-primary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              DIAGNOSTIC DASHBOARD
            </p>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              {user.email}
            </h1>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: tierColors[profile.tier_id] || 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              {profile.tier_id.toUpperCase()} TIER
            </span>
          </div>
          <button
            onClick={signOut}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Usage card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              THIS MONTH
            </p>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.5rem',
                color:
                  usagePercent >= 100
                    ? 'var(--loss)'
                    : 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              {profile.analyses_used}
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  fontWeight: 400,
                }}
              >
                /
                {profile.analyses_limit === -1
                  ? '∞'
                  : profile.analyses_limit}
              </span>
            </p>
            {/* Usage bar */}
            {profile.analyses_limit !== -1 && (
              <div
                style={{
                  height: '4px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '2px',
                  marginTop: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(usagePercent, 100)}%`,
                    background:
                      usagePercent >= 100
                        ? 'var(--loss)'
                        : usagePercent >= 80
                        ? 'var(--warning)'
                        : 'var(--profit)',
                    borderRadius: '2px',
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              TOTAL ANALYSES
            </p>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              {profile.total_analyses}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            {!profile.can_analyze ? (
              <a
                href="/new?upgrade=true"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: 'var(--accent-primary)',
                  color: 'var(--bg-base)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginTop: '8px',
                }}
              >
                Upgrade Tier →
              </a>
            ) : (
              <a
                href="/new"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: 'var(--accent-primary)',
                  color: 'var(--bg-base)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginTop: '8px',
                }}
              >
                New Analysis →
              </a>
            )}
          </div>
        </div>

        {/* Compliance comparison — month-on-month */}
        {complianceData && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '20px 24px',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem',
                color: 'var(--accent-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              MONTH-ON-MONTH PROGRESS
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                {
                  label: 'Revenge Trades',
                  prev: complianceData.previous.revenge_count,
                  curr: complianceData.latest.revenge_count,
                  lower_is_better: true,
                },
                {
                  label: 'No-SL Trades',
                  prev: complianceData.previous.no_sl_count,
                  curr: complianceData.latest.no_sl_count,
                  lower_is_better: true,
                },
                {
                  label: 'Win Rate',
                  prev: complianceData.previous.win_rate,
                  curr: complianceData.latest.win_rate,
                  lower_is_better: false,
                  pct: true,
                },
                {
                  label: 'Profit Factor',
                  prev: complianceData.previous.profit_factor,
                  curr: complianceData.latest.profit_factor,
                  lower_is_better: false,
                },
                {
                  label: 'Net P/L',
                  prev: complianceData.previous.net_pnl,
                  curr: complianceData.latest.net_pnl,
                  lower_is_better: false,
                  money: true,
                },
              ].map((metric, i) => {
                const improved = metric.lower_is_better
                  ? metric.curr < metric.prev
                  : metric.curr > metric.prev
                const unchanged = metric.curr === metric.prev
                const delta = metric.curr - metric.prev
                const deltaPct =
                  metric.prev !== 0
                    ? (delta / Math.abs(metric.prev)) * 100
                    : 0

                return (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: '6px',
                      padding: '12px',
                      borderLeft: `3px solid ${
                        unchanged
                          ? 'var(--border-subtle)'
                          : improved
                          ? 'var(--profit)'
                          : 'var(--loss)'
                      }`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.6rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      {metric.label}
                    </p>
                    <p
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: unchanged
                          ? 'var(--text-primary)'
                          : improved
                          ? 'var(--profit)'
                          : 'var(--loss)',
                        marginBottom: '2px',
                      }}
                    >
                      {metric.money
                        ? `$${Math.abs(metric.curr).toFixed(0)}`
                        : metric.pct
                        ? `${(metric.curr * 100).toFixed(1)}%`
                        : metric.curr}
                    </p>
                    <p
                      style={{
                        fontSize: '0.65rem',
                        color: unchanged
                          ? 'var(--text-muted)'
                          : improved
                          ? 'var(--profit)'
                          : 'var(--loss)',
                      }}
                    >
                      {unchanged
                        ? '→ unchanged'
                        : improved
                        ? '↑ improving'
                        : '↓ regression'}
                      {!unchanged &&
                        ` (${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(0)}%)`}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Verdict */}
            <ComplianceVerdict
              latest={complianceData.latest}
              previous={complianceData.previous}
            />
          </div>
        )}

        {/* Past analyses */}
        <h2
          style={{
            fontWeight: 600,
            marginBottom: '16px',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          PAST DIAGNOSES
        </h2>

        {loadingData ? (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            Loading your analyses...
          </p>
        ) : analyses.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: '16px',
              }}
            >
              No analyses yet.
            </p>
            <a
              href="/new"
              style={{
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Run your first diagnosis →
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {analyses.map((analysis) => (
              <a
                key={analysis.id}
                href={`/report/${analysis.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    'var(--border-active)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    'var(--border-subtle)'
                }}
              >
                <div>
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    {analysis.client_name || 'Unnamed Trader'}
                  </p>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {new Date(analysis.created_at).toLocaleDateString()} ·{' '}
                    {analysis.total_trades} trades ·{' '}
                    {analysis.tier_id?.toUpperCase()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '1rem',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color:
                        (analysis.net_pnl || 0) >= 0
                          ? 'var(--profit)'
                          : 'var(--loss)',
                    }}
                  >
                    {(analysis.net_pnl || 0) >= 0 ? '+' : ''}$
                    {Math.abs(analysis.net_pnl || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {((analysis.win_rate || 0) * 100).toFixed(1)}% WR
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Ready for next diagnosis prompt */}
        {analyses.length > 0 && profile.can_analyze && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px 24px',
              background: 'rgba(88,166,255,0.05)',
              border: '1px solid rgba(88,166,255,0.15)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                READY FOR NEXT DIAGNOSIS?
              </p>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  margin: 0,
                }}
              >
                Upload your latest history. X-Ray will show if your behavior
                improved since last time.
              </p>
            </div>
            <a
              href="/new"
              style={{
                padding: '10px 20px',
                background: 'var(--accent-primary)',
                color: 'var(--bg-base)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
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
