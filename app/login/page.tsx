'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

const GOLD = '#e5b83c'
const MONO = "'JetBrains Mono', monospace"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => { setError(''); setSuccess('') }

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next)
    setPassword('')
    setConfirmPassword('')
    clearMessages()
  }

  const handleSignIn = async () => {
    clearMessages()
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    try {
      await signIn(email, password, rememberMe)
      router.push('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    clearMessages()
    if (!email || !password || !confirmPassword) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError("Passwords don't match."); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('Check your email to confirm your account, then sign in.')
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address first.'); return }
    clearMessages()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('Check your email for a reset link.')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0a0f1e',
    border: '1px solid #1e293b',
    borderRadius: 6,
    padding: '14px 16px',
    color: '#f8fafc',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#94a3b8',
    marginBottom: 6,
    fontFamily: MONO,
  }

  return (
    <div
      className="circuit-overlay"
      style={{
        background: '#050811',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: 440, width: '100%' }}>

        {/* Brand label */}
        <p style={{
          fontFamily: MONO,
          fontSize: 11,
          color: GOLD,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          margin: '0 0 24px',
        }}>
          X-RAY FORENSIC
        </p>

        {/* Card */}
        <div style={{
          background: '#0e1626',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 48,
          boxShadow: '0 0 40px rgba(229,184,60,0.05)',
        }}>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 40,
            fontWeight: 800,
            color: '#f8fafc',
            textAlign: 'center',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h1>

          {/* Subtitle */}
          {mode === 'signin' && (
            <p style={{
              fontSize: 14,
              color: '#94a3b8',
              textAlign: 'center',
              margin: '0 0 32px',
              lineHeight: 1.5,
            }}>
              Forensic intelligence for serious traders.
            </p>
          )}
          {mode === 'signup' && <div style={{ marginBottom: 28 }} />}

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && mode === 'signin') handleSignIn() }}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#1e293b' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => { if (e.key === 'Enter' && mode === 'signin') handleSignIn() }}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#1e293b' }}
            />
          </div>

          {/* Remember me + Forgot password — sign in only */}
          {mode === 'signin' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 20px' }}>

              {/* Remember this device checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div
                  onClick={() => setRememberMe(v => !v)}
                  role="checkbox"
                  aria-checked={rememberMe}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setRememberMe(v => !v) }}
                  style={{
                    width: 15,
                    height: 15,
                    border: `2px solid ${rememberMe ? GOLD : '#334155'}`,
                    borderRadius: 3,
                    background: rememberMe ? GOLD : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    outline: 'none',
                  }}
                >
                  {rememberMe && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => setRememberMe(v => !v)}
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: '#64748b',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  REMEMBER THIS DEVICE
                </span>
              </div>

              {/* Forgot password */}
              <button
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: MONO,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Confirm password — sign up only */}
          {mode === 'signup' && (
            <div style={{ marginBottom: 12, marginTop: 12 }}>
              <label style={labelStyle}>Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSignUp() }}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#1e293b' }}
              />
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={mode === 'signin' ? handleSignIn : handleSignUp}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(229,184,60,0.5)' : GOLD,
              color: '#000000',
              border: 'none',
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: mode === 'signup' ? 8 : 0,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#b88d1d' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = GOLD }}
          >
            {loading
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
              : (mode === 'signin' ? 'Sign In →' : 'Create Account →')
            }
          </button>

          {/* Feedback */}
          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: '#10b981', fontSize: 13, marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
              {success}
            </p>
          )}
        </div>

        {/* Mode toggle */}
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 24 }}>
          {mode === 'signin' ? (
            <>Don&apos;t have an account?{' '}
              <button onClick={() => switchMode('signup')} style={{
                background: 'none', border: 'none', color: GOLD,
                fontSize: 13, cursor: 'pointer', padding: 0,
                fontFamily: 'inherit',
              }}>
                Create one
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => switchMode('signin')} style={{
                background: 'none', border: 'none', color: GOLD,
                fontSize: 13, cursor: 'pointer', padding: 0,
                fontFamily: 'inherit',
              }}>
                Sign in
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  )
}
