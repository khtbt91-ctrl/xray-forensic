'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to where they were going
        const returnTo =
          localStorage.getItem('xray_return_to') || '/new'
        localStorage.removeItem('xray_return_to')
        router.push(returnTo)
      }
    })

    return () => subscription.unsubscribe()
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
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        Signing you in...
      </p>
    </div>
  )
}
