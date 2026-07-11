import { testimonials } from '@/lib/testimonials'
import TestimonialCard from '../TestimonialCard'

export default function TestimonialsSection() {
  return (
    <section
      style={{
        padding: '80px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: 'var(--accent-primary)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        REAL DIAGNOSES
      </p>
      <h2
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        What traders actually find.
      </h2>
      <p
        style={{
          color: 'var(--text-muted)',
          textAlign: 'center',
          fontSize: '0.85rem',
          maxWidth: '500px',
          margin: '0 auto 48px',
        }}
      >
        Every number below came from a real trade history upload. Not estimates.
        Not examples. Confessions.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      <p
        style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          marginTop: '32px',
          fontStyle: 'italic',
        }}
      >
        All figures are from real MT5 and crypto exchange exports. Names used
        with permission.
      </p>
    </section>
  )
}
