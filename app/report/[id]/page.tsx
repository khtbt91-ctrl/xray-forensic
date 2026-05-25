'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ReportPage() {
  const params = useParams()
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
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
    if (params.id) load()
  }, [params.id])

  if (loading) return (
    <>
      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
      <div style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--accent-primary)',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
        }}>
          LOADING REPORT...
        </div>
        <div style={{
          width: '200px',
          height: '2px',
          background: 'var(--bg-elevated)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '40%',
            height: '100%',
            background: 'var(--accent-primary)',
            animation: 'slide 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </>
  )

  if (error) return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--loss)',
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      {error}
    </div>
  )

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <a href="/" style={{
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          textDecoration: 'none',
        }}>
          ← Back
        </a>
        <span style={{
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.05em',
        }}>
          X-RAY FORENSIC · {String(params.id).slice(0, 8).toUpperCase()}
        </span>
        <button
          onClick={() => {
            const iframe = document.querySelector('iframe')
            if (iframe?.contentWindow) {
              iframe.contentWindow.print()
            }
          }}
          style={{
            background: 'var(--accent-primary)',
            color: '#0D1117',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Download PDF
        </button>
      </div>

      <iframe
        src={reportUrl!}
        style={{
          width: '100%',
          height: 'calc(100vh - 49px)',
          border: 'none',
          display: 'block',
        }}
        title="X-Ray Forensic Report"
      />
    </div>
  )
}
