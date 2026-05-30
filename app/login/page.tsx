'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Redirects automatically
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Try again.')
      setGoogleLoading(false)
    }
  }

  const handleEmail = async () => {
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
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
      }}>
        {/* Logo */}
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: 'var(--accent-primary)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          X-RAY FORENSIC
        </p>

        {!sent ? (
          <>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textAlign: 'center',
              marginBottom: '8px',
            }}>
              Sign in
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              textAlign: 'center',
              fontSize: '0.85rem',
              marginBottom: '32px',
            }}>
              No password needed.
            </p>

            {/* Google button — primary */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: '#fff',
                color: '#1a1a1a',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                opacity: googleLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '16px',
                transition: 'opacity 150ms',
              }}
            >
              {/* Google SVG icon */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4"
                  d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853"
                  d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                <path fill="#FBBC05"
                  d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                <path fill="#EA4335"
                  d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
              </svg>
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'var(--border-subtle)',
              }} />
              <span style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
              }}>
                or
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'var(--border-subtle)',
              }} />
            </div>

            {/* Email magic link — secondary */}
            {!showEmail ? (
              <button
                onClick={() => setShowEmail(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Continue with Email →
              </button>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEmail()
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
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '10px',
                  }}
                />
                <button
                  onClick={handleEmail}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--accent-primary)',
                    color: 'var(--bg-base)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Sending...' : 'Send Magic Link →'}
                </button>
              </>
            )}

            {error && (
              <p style={{
                color: 'var(--loss)',
                fontSize: '0.8rem',
                marginTop: '12px',
                textAlign: 'center',
              }}>
                {error}
              </p>
            )}

            <p style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              marginTop: '24px',
              lineHeight: 1.5,
            }}>
              No account? One is created automatically on first sign-in.
            </p>
          </>
        ) : (
          /* Email sent state */
          <div style={{ textAlign: 'center' }}>
            <div style={{
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
            }}>
              ✓
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              Check your email
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.65,
              marginBottom: '8px',
            }}>
              Magic link sent to{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {email}
              </strong>.
            </p>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              marginBottom: '24px',
            }}>
              Open it on this device. Check spam if you don&apos;t see it.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setEmail('')
                setShowEmail(false)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
