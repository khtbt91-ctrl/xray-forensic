export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Export your history',
      body: 'Download your MT5 trade history as HTML or CSV. Crypto traders export from Binance, Bybit, OKX, Bitget, or BingX. Takes 30 seconds.',
      detail: 'No broker credentials. No MT5 password. Just a file.'
    },
    {
      number: '02',
      title: 'X-Ray runs the forensics',
      body: 'The engine processes every trade through 12 diagnostic modules — damage cascade, profit giveback, sequence decay, emotional sizing, and more.',
      detail: '41 data points per trade. 670 trades in 60 seconds.'
    },
    {
      number: '03',
      title: 'Receive your verdict',
      body: 'A scored report across 7 institutional dimensions. Priority actions ranked by dollar impact. Triggered protocols. A prescription with a measurable target.',
      detail: 'Not coaching. Not encouragement. A diagnosis.'
    }
  ]

  return (
    <section id="how-it-works" style={{
      padding: '80px 24px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem',
        color: 'var(--accent-primary)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        THE PROCESS
      </p>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        textAlign: 'center',
        marginBottom: '56px'
      }}>
        Three steps. One verdict.
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px'
      }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            position: 'relative',
            padding: '28px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            borderTop: '3px solid var(--accent-primary)'
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--border-subtle)',
              display: 'block',
              marginBottom: '16px',
              lineHeight: 1
            }}>
              {step.number}
            </span>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '10px'
            }}>
              {step.title}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.65,
              marginBottom: '12px'
            }}>
              {step.body}
            </p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic'
            }}>
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
