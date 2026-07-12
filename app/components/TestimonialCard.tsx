import type { Testimonial } from '@/lib/testimonials'

export default function TestimonialCard({
  testimonial,
  compact = false,
}: {
  testimonial: Testimonial
  compact?: boolean
}) {
  if (testimonial.pending) {
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: compact ? '16px' : '24px',
          opacity: 0.4,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            ?
          </div>
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              COMMUNITY MEMBER
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              Diagnosis in progress...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: compact ? '16px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderTop: '3px solid var(--accent-primary)',
      }}
    >
      {/* Flag highlight */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            {testimonial.flag_label}
            {testimonial.flag_count ? ` · ${testimonial.flag_count} trades` : ''}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: compact ? '1.25rem' : '1.5rem',
              fontWeight: 700,
              color: 'var(--loss)',
              margin: 0,
            }}
          >
            {testimonial.flag_amount}
          </p>
        </div>

        {testimonial.verified && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--profit)',
              background: 'rgba(63,185,80,0.1)',
              border: '1px solid rgba(63,185,80,0.3)',
              padding: '3px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ✓ VERIFIED
          </span>
        )}
      </div>

      {/* Quote */}
      {!compact && (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
            margin: 0,
            borderLeft: '2px solid var(--border-subtle)',
            paddingLeft: '12px',
          }}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      )}

      {/* Disclaimer */}
      {!compact && testimonial.disclaimer && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {testimonial.disclaimer}
        </p>
      )}

      {/* Author */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-active)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent-primary)',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {testimonial.avatar_initials}
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {testimonial.name}
          </p>
          <p
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            {testimonial.instrument} · {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  )
}
