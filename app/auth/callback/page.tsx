'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Completing sign-in...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = await getSupabaseClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth error:', error)
          setStatus('Sign-in failed. Redirecting...')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        if (data.session) {
          const returnTo = localStorage.getItem('xray_return_to') || '/'
          localStorage.removeItem('xray_return_to')
          setStatus('Signed in! Redirecting...')
          router.push(returnTo)
          return
        }

        // No session yet — wait for SIGNED_IN event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              subscription.unsubscribe()
              const returnTo = localStorage.getItem('xray_return_to') || '/'
              localStorage.removeItem('xray_return_to')
              setStatus('Signed in! Redirecting...')
              router.push(returnTo)
            }
          }
        )

        // Fallback after 5 seconds
        setTimeout(() => {
          subscription.unsubscribe()
          router.push('/')
        }, 5000)
      } catch (e) {
        console.error('Callback error:', e)
        router.push('/')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid var(--accent-primary)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        {status}
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
