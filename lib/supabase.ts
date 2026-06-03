import { createClient } from "@supabase/supabase-js";

// Smart storage — routes writes to localStorage (remember=true) or sessionStorage (remember=false).
// getItem checks sessionStorage first so session-only logins are found on refresh.
const _smartStorage = typeof window === 'undefined' ? undefined : (() => {
  let _writeTarget: Storage = localStorage
  return {
    getItem:    (key: string) => sessionStorage.getItem(key) ?? localStorage.getItem(key),
    setItem:    (key: string, value: string) => _writeTarget.setItem(key, value),
    removeItem: (key: string) => { localStorage.removeItem(key); sessionStorage.removeItem(key) },
    setMode:    (remember: boolean) => { _writeTarget = remember ? localStorage : sessionStorage },
  }
})()

export function setAuthStorageMode(remember: boolean) {
  _smartStorage?.setMode(remember)
}

export const supabase = createClient(
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
)

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
