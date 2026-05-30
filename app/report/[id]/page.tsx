'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReportUpgradeNudge from '@/app/components/ReportUpgradeNudge'

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
      <div style={{ background: 'var(--bg-base)', padding: '0 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ReportUpgradeNudge currentTier={reportTier} />
        </div>
      </div>
    </div>
  )
}
