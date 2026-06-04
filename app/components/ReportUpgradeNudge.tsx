import { verifiedTestimonials } from '@/lib/testimonials'
import TestimonialCard from './TestimonialCard'

export default function ReportUpgradeNudge({
  currentTier,
}: {
  currentTier: string
}) {
  // Only show on signal tier
  if (currentTier !== 'signal') return null

  const proof = verifiedTestimonials.slice(0, 2)

  return (
    <div
      style={{
        margin: '48px 0',
        padding: '32px 24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          color: 'var(--accent-primary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        WHAT THE FULL REPORT REVEALS
      </p>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        You&apos;ve seen the surface.
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          textAlign: 'center',
          fontSize: '0.85rem',
          maxWidth: '480px',
          margin: '0 auto 32px',
        }}
      >
        The FORENSIC report adds priority actions ranked by dollar impact, 5
        prescriptions with measurable targets, and triggered protocols. Here&apos;s
        what other traders found when they upgraded.
      </p>

      {proof.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {proof.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} compact={true} />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <a
          href="/new?tier=forensic"
          style={{
            display: 'inline-block',
            padding: '13px 32px',
            background: 'var(--accent-primary)',
            color: 'var(--bg-base)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          Get Full FORENSIC Report — $29/mo
        </a>
        <a
          href="/payment?tier=forensic&amount=49&type=one-time"
          style={{
            display: 'block',
            color: '#94a3b8',
            fontSize: '0.72rem',
            marginTop: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#e5b83c'; (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
        >
          Or $49 one-time · No commitment
        </a>
      </div>
    </div>
  )
}
