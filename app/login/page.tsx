'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const GOLD = '#C9A84C'
const MONO = 'JetBrains Mono, monospace'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError('Invalid email or password.'); return }
    router.push('/dashboard')
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
    background: '#111111',
    border: '1px solid #333333',
    borderRadius: 6,
    padding: '14px 16px',
    color: '#FFFFFF',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#9CA3AF',
    marginBottom: 6,
    fontFamily: MONO,
  }

  return (
    <div style={{
      background: '#0A0A0A',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ maxWidth: 440, width: '100%' }}>

        {/* Brand */}
        <p style={{
          fontFamily: MONO,
          fontSize: 11,
          color: GOLD,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          margin: '0 0 32px',
        }}>
          X-RAY FORENSIC
        </p>

        {/* Card */}
        <div style={{
          background: '#0D1117',
          border: '1px solid #21262D',
          borderRadius: 12,
          padding: 48,
        }}>

          {/* Title */}
          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            margin: '0 0 8px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 14,
            color: '#9CA3AF',
            textAlign: 'center',
            margin: mode === 'signin' ? '0 0 32px' : '0 0 28px',
            lineHeight: 1.5,
            minHeight: 20,
          }}>
            {mode === 'signin' ? 'Forensic intelligence for serious traders.' : ''}
          </p>

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && mode === 'signin') handleSignIn() }}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#333333' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: mode === 'signin' ? 0 : 12 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={(e) => { if (e.key === 'Enter' && mode === 'signin') handleSignIn() }}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#333333' }}
            />
          </div>

          {/* Forgot password — sign in only */}
          {mode === 'signin' && (
            <div style={{ textAlign: 'right', margin: '6px 0 16px' }}>
              <button
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: MONO,
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Confirm password — sign up only */}
          {mode === 'signup' && (
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSignUp() }}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#333333' }}
              />
            </div>
          )}

          {/* Primary button */}
          <button
            onClick={mode === 'signin' ? handleSignIn : handleSignUp}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(201,168,76,0.55)' : GOLD,
              color: '#000000',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              fontFamily: MONO,
              transition: 'background 0.15s',
            }}
          >
            {loading
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
              : (mode === 'signin' ? 'Sign In →' : 'Create Account →')
            }
          </button>

          {/* Feedback */}
          {error && (
            <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: '#22C55E', fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
              {success}
            </p>
          )}
        </div>

        {/* Mode toggle */}
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginTop: 24 }}>
          {mode === 'signin' ? (
            <>Don&apos;t have an account?{' '}
              <button onClick={() => switchMode('signup')} style={{
                background: 'none', border: 'none', color: GOLD,
                fontSize: 13, cursor: 'pointer', padding: 0,
              }}>
                Create one
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => switchMode('signin')} style={{
                background: 'none', border: 'none', color: GOLD,
                fontSize: 13, cursor: 'pointer', padding: 0,
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
