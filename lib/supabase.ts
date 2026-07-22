import type { SupabaseClient } from "@supabase/supabase-js";

// Smart storage — routes writes to localStorage (remember=true) or sessionStorage (remember=false).
// getItem checks sessionStorage first so session-only logins are found on refresh.
// The chosen mode is persisted under MODE_KEY: without it, a page refresh reset the
// write target to localStorage, so autoRefreshToken silently promoted session-only
// logins into localStorage and they survived browser restarts.
const MODE_KEY = 'xray-auth-mode'
const _smartStorage = typeof window === 'undefined' ? undefined : (() => {
  let _writeTarget: Storage = localStorage.getItem(MODE_KEY) === 'session' ? sessionStorage : localStorage
  return {
    getItem:    (key: string) => sessionStorage.getItem(key) ?? localStorage.getItem(key),
    setItem:    (key: string, value: string) => _writeTarget.setItem(key, value),
    removeItem: (key: string) => { localStorage.removeItem(key); sessionStorage.removeItem(key) },
    setMode:    (remember: boolean) => {
      _writeTarget = remember ? localStorage : sessionStorage
      if (remember) localStorage.removeItem(MODE_KEY)
      else localStorage.setItem(MODE_KEY, 'session')
    },
  }
})()

export function setAuthStorageMode(remember: boolean) {
  _smartStorage?.setMode(remember)
}

// ── Lazy Supabase client ────────────────────────────────────────────────────
// @supabase/supabase-js (GoTrueClient + friends, ~59KB gzipped) used to be a
// static top-level import here, which meant it was bundled into the same
// chunk as the root AuthProvider and downloaded/parsed on EVERY route —
// including static marketing pages with zero auth-gated content — competing
// for bandwidth in the same critical-path burst as render-blocking CSS/fonts.
// Perf fix (home-v3 branch, mobile LCP): the SDK is now dynamically
// import()'d and the client cached as a singleton, so it code-splits into
// its own chunk fetched only when something actually needs it (AuthProvider's
// mount effect, a sign-in, a Supabase-backed fetch) instead of gating first
// paint on every route. Every call site now does
// `const supabase = await getSupabaseClient()` instead of a static import.
let _client: SupabaseClient | null = null;
let _clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabaseClient(): Promise<SupabaseClient> {
  if (_client) return Promise.resolve(_client);
  if (_clientPromise) return _clientPromise;
  _clientPromise = import("@supabase/supabase-js").then(({ createClient }) => {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'xray-auth',
          storage: _smartStorage,
          detectSessionInUrl: true,
        },
      }
    );
    return _client;
  });
  return _clientPromise;
}

// Shape returned by GET /user/profile on the Railway backend.
export type UserProfile = {
  user_id: string;
  email: string;
  tier_id: string;
  analyses_used: number;
  analyses_limit: number;
  subscription_status: string;
  total_analyses: number;
  can_analyze: boolean;
  limit_reason?: string | null;
  roles?: string[];
};
