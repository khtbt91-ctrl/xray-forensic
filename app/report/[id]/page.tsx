'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ReportPage() {
  const params = useParams()
  const [reportUrl, setReportUrl] = useState<string|null>(null)
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analysis/${params.id}`
        )
        if (!res.ok) throw new Error('Report not found')
        const data = await res.json()
        setReportUrl(data.report_url)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [params.id])

  if (loading) return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-mono)'
    }}>
      Loading report...
    </div>
  )

  if (error) return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--loss)',
      fontFamily: 'var(--font-mono)'
    }}>
      {error}
    </div>
  )

  return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <a
          href="/"
          style={{ color: 'var(--text-secondary)',
            fontSize: '0.85rem' }}
        >
          ← Back
        </a>
        <span style={{
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          Analysis #{params.id}
        </span>
        <button
          onClick={() => window.print()}
          style={{
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Download PDF
        </button>
      </div>

      <iframe
        src={reportUrl!}
        style={{
          width: '100%',
          height: 'calc(100vh - 57px)',
          border: 'none',
          display: 'block'
        }}
        title="X-Ray Forensic Report"
      />
    </div>
  )
}
