import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
};
