'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getSupabaseClient, setAuthStorageMode, UserProfile } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const lastFetchedToken = useRef<string | null>(null)

  const fetchProfile = useCallback(async (token: string) => {
    // Skip duplicate calls (initAuth + onAuthStateChange INITIAL_SESSION fire simultaneously)
    if (lastFetchedToken.current === token) return
    lastFetchedToken.current = token
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
      // Non-ok (404, 500): profile stays null — this is acceptable.
      // User state is NOT touched — a profile failure never logs the user out.
    } catch (e) {
      // Network error: same — profile stays null, user remains authenticated.
      console.error('[Auth] Profile fetch failed:', e)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    // Subscription is created asynchronously now (after the lazily-loaded
    // client resolves), so the cleanup closure below can't reference it
    // directly the way the old synchronous version could — this holds
    // whatever unsubscribe fn ends up created, if any, for both the normal
    // unmount path and the race where unmount happens mid-flight.
    let unsubscribe: (() => void) | null = null

    const initAuth = async () => {
      try {
        const supabase = await getSupabaseClient()
        if (!mounted) return

        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.access_token) {
            await fetchProfile(session.access_token)
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return
            try {
              setSession(session)
              setUser(session?.user ?? null)
              if (session?.access_token) {
                await fetchProfile(session.access_token)
              } else {
                // Explicit sign-out or expired session — clear profile
                setProfile(null)
              }
            } catch (e) {
              console.error('[Auth] onAuthStateChange error:', e)
            } finally {
              if (mounted) setLoading(false)
            }
          }
        )

        if (mounted) {
          unsubscribe = () => subscription.unsubscribe()
        } else {
          // Unmounted while the client/session promise was in flight —
          // nothing left to hold the subscription open for.
          subscription.unsubscribe()
        }
      } catch (e) {
        console.error('[Auth] initAuth error:', e)
        // Do not set user — if getSession() fails, we don't know state.
        // Loading will clear in finally so the app doesn't hang.
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [fetchProfile])

  // Unified sign-in via password. Storage mode is set before signInWithPassword
  // so Supabase writes the token to the correct storage (localStorage vs sessionStorage).
  const signIn = async (email: string, password: string, rememberMe = true) => {
    setAuthStorageMode(rememberMe)
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const supabase = await getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
