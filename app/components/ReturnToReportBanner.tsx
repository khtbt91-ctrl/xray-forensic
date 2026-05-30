'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type LastReport = {
  reportId: string
  expiresAt: number
}

export default function ReturnToReportBanner() {
  const pathname = usePathname()
  const [lastReport, setLastReport] = useState<LastReport | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('xray_last_report')
    if (!saved) return

    try {
      const access = JSON.parse(saved)
      const now = Date.now()

      // Expired — remove
      if (now > access.expiresAt) {
        localStorage.removeItem('xray_last_report')
        return
      }

      // Valid — show banner
      setLastReport({ reportId: access.reportId, expiresAt: access.expiresAt })
    } catch {
      // Corrupt entry — clear it
      localStorage.removeItem('xray_last_report')
    }
  }, [pathname])

  if (!lastReport) return null

  // Don't prompt to "return" to the report you're already viewing
  if (pathname === `/report/${lastReport.reportId}`) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--accent-primary)',
      borderRadius: '8px',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      zIndex: 40,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      whiteSpace: 'nowrap'
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        Your report is ready
      </span>

      <a
        href={`/report/${lastReport.reportId}`}
        style={{
          background: 'var(--accent-primary)',
          color: 'var(--bg-base)',
          padding: '6px 16px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: 600
        }}
      >
        View Report →
      </a>
      <button
        onClick={() => {
          localStorage.removeItem('xray_last_report')
          setLastReport(null)
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0 4px'
        }}
      >
        ×
      </button>
    </div>
  )
}
