'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signIn(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send link. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
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
          X-RAY FORENSIC
        </p>

        {!sent ? (
          <>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textAlign: 'center',
                marginBottom: '8px',
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                textAlign: 'center',
                fontSize: '0.85rem',
                marginBottom: '32px',
              }}
            >
              Enter your email. We&apos;ll send a magic link — no password
              needed.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit()
                }}
                placeholder="your@email.com"
                autoFocus
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${
                    email.includes('@')
                      ? 'var(--accent-primary)'
                      : 'var(--border-subtle)'
                  }`,
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  color: 'var(--loss)',
                  fontSize: '0.8rem',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: 'var(--accent-primary)',
                color: 'var(--bg-base)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>

            <p
              style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                marginTop: '24px',
              }}
            >
              No account? One is created automatically on first sign-in.
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(63,185,80,0.1)',
                border: '2px solid var(--profit)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '1.5rem',
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              Check your email
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.65,
                marginBottom: '24px',
              }}
            >
              We sent a magic link to{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
              Click it to sign in. No password needed.
            </p>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
              }}
            >
              Check your spam folder if you don&apos;t see it.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              style={{
                marginTop: '24px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
