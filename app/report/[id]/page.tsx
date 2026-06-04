'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReportUpgradeNudge from '@/app/components/ReportUpgradeNudge'

type RxItem = {
  id: string
  dimension: string
  title: string
  action: string
  rationale: string
  severity: string
  estimated_monthly_savings: number
}

// Persist 24-hour access to the most recently viewed report.
// Re-saving an existing report refreshes its expiry window.
const saveReportAccess = (reportId: string) => {
  const access = {
    reportId,
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000)
  }
  localStorage.setItem('xray_last_report', JSON.stringify(access))
}

export default function ReportPage() {
  const { id } = useParams()
  const [blobUrl, setBlobUrl] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [reportTier, setReportTier] = useState<string>('signal')
  const [rxVisible, setRxVisible] = useState<RxItem[]>([])
  const [rxLockedCount, setRxLockedCount] = useState(0)

  useEffect(() => {
    let objectUrl: string | null = null

    async function loadReport() {
      try {
        // Fetch analysis metadata from Railway backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analysis/${id}`
        )
        if (!res.ok) throw new Error(`Analysis not found`)
        const data = await res.json()
        if (!data.report_url) throw new Error('No report URL')
        setReportTier(data.tier_id || 'signal')
        setRxVisible(data.prescriptions || [])
        setRxLockedCount(data.locked_prescriptions_count || 0)

        // Fetch HTML content from Supabase Storage
        const htmlRes = await fetch(data.report_url)
        if (!htmlRes.ok) throw new Error('Report file not found')
        const htmlText = await htmlRes.text()

        // Validate it's actual HTML
        const trimmed = htmlText.trim()
        if (!trimmed.startsWith('<!DOCTYPE') &&
            !trimmed.startsWith('<html') &&
            !trimmed.startsWith('<!doctype')) {
          throw new Error('Invalid report format')
        }

        // Create blob URL
        const blob = new Blob([htmlText], { type: 'text/html' })
        objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)

        // Report loaded — save / refresh 24h access window
        saveReportAccess(String(id))

      } catch (err: any) {
        setError(err.message || 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    loadReport()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id])

  if (loading) return (
    <div style={{
      background: '#0D1117',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      fontFamily: 'monospace'
    }}>
      <div style={{ color: '#58A6FF', fontSize: '0.85rem',
        letterSpacing: '0.1em' }}>
        LOADING REPORT...
      </div>
      <div style={{ width: '200px', height: '2px',
        background: '#21262D', borderRadius: '2px',
        overflow: 'hidden' }}>
        <div style={{
          width: '40%', height: '100%',
          background: '#58A6FF',
          animation: 'slideLoad 1.5s ease-in-out infinite'
        }} />
      </div>
      <style>{`
        @keyframes slideLoad {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(350%) }
        }
      `}</style>
    </div>
  )

  if (error) return (
    <div style={{
      background: '#0D1117', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: '12px', fontFamily: 'monospace'
    }}>
      <div style={{ color: '#F85149', fontSize: '0.85rem' }}>
        {error}
      </div>
      <a href="/new" style={{ color: '#58A6FF',
        fontSize: '0.75rem' }}>
        ← Try again
      </a>
    </div>
  )

  return (
    <div style={{ background: '#0D1117', minHeight: '100vh' }}>
      <div style={{
        background: '#161B22',
        borderBottom: '1px solid #30363D',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'none', border: 'none', color: '#8B949E',
            fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
        >
          ← Back
        </button>
        <span style={{ color: '#8B949E', fontSize: '0.7rem',
          fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          X-RAY FORENSIC · {String(id).slice(0,8).toUpperCase()}
        </span>
        <button
          onClick={() => {
            const iframe = document.querySelector('iframe')
            iframe?.contentWindow?.print()
          }}
          style={{
            background: '#58A6FF', color: '#0D1117',
            border: 'none', padding: '6px 16px',
            borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600
          }}
        >
          Download PDF
        </button>
      </div>
      <iframe
        src={blobUrl!}
        style={{
          width: '100%',
          height: 'calc(100vh - 49px)',
          border: 'none',
          display: 'block',
          background: '#0D1117'
        }}
        title="X-Ray Forensic Report"
        sandbox="allow-scripts allow-same-origin"
      />
      {/* ── Tier-gated prescription cards ─────────────────────────────── */}
      {rxVisible.length > 0 && (
        <div style={{ background: 'var(--bg-base)', padding: '48px 24px 8px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
              color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase',
              margin: '0 0 6px',
            }}>
              PRIORITY PRESCRIPTIONS
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem',
              fontWeight: 700, color: '#E6EDF3', margin: '0 0 24px',
            }}>
              Your behavioural action list
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Visible prescriptions */}
              {rxVisible.map((rx, i) => (
                <div key={rx.id} style={{
                  background: '#0e1626',
                  border: `1px solid ${
                    rx.severity === 'critical' ? '#F85149' :
                    rx.severity === 'high'     ? '#D29922' : '#30363D'
                  }`,
                  borderRadius: 8,
                  padding: '20px 24px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 8,
                  }}>
                    <p style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                      color: '#8B949E', letterSpacing: '0.08em',
                      textTransform: 'uppercase', margin: 0,
                    }}>
                      RX-{String(i + 1).padStart(2, '0')} · {rx.dimension.replace(/_/g, ' ')}
                    </p>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                      color: '#3FB950', background: 'rgba(63,185,80,0.1)',
                      border: '1px solid rgba(63,185,80,0.2)',
                      borderRadius: 3, padding: '2px 6px', whiteSpace: 'nowrap',
                    }}>
                      saves ${rx.estimated_monthly_savings.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}/mo
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem',
                    fontWeight: 700, color: '#E6EDF3', margin: '0 0 10px',
                  }}>
                    {rx.title}
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
                    color: '#8B949E', lineHeight: 1.65, margin: 0,
                  }}>
                    {rx.action}
                  </p>
                </div>
              ))}

              {/* Locked prescription placeholders */}
              {Array.from({ length: rxLockedCount }).map((_, i) => {
                const nextTier =
                  reportTier === 'signal'   ? 'FORENSIC ($29/mo)' :
                  reportTier === 'forensic' ? 'OPERATOR ($79/mo)' :
                  'the next tier'
                const pricingHref =
                  reportTier === 'signal'   ? '/pricing?highlight=forensic' :
                  reportTier === 'forensic' ? '/pricing?highlight=operator' :
                  '/pricing'
                return (
                  <div key={`locked-${i}`} style={{
                    background: '#0e1626',
                    border: '1px solid #21262D',
                    borderRadius: 8,
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    {/* Lock icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#475569" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <div>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
                        color: '#475569', margin: '0 0 4px',
                      }}>
                        Upgrade to {nextTier} to unlock this prescription
                      </p>
                      <a href={pricingHref} style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                        color: '#58A6FF', textDecoration: 'none',
                      }}>
                        View pricing →
                      </a>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--bg-base)', padding: '0 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ReportUpgradeNudge currentTier={reportTier} />
        </div>
      </div>
    </div>
  )
}
