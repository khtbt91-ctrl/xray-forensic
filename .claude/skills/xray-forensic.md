---
name: xray-forensic
description: Activate whenever working on xray-web
or institutional-xray projects.
---

# X-Ray Forensic — Session Skill

## STATUS: LIVE — AUTH ACTIVE
Platform live at https://www.xrayforensic.com
Backend live at Railway
Auth live: Google OAuth + magic link
All reports rule-based (Claude API = Phase 2)
Revenue target: active

## Two Projects
- xray-web (C:\Users\USER\xray-web) = Next.js → Railway (vibrant-flow)
- institutional-xray (C:\Users\USER\institutional-xray) = Python → Railway (delightful-miracle)
- NEVER modify both in one session

## Live Infrastructure
- Domain: https://www.xrayforensic.com (CANONICAL — always www.)
- API: https://xray-api-production.up.railway.app
- Supabase: https://cwafqxlohsgskixgeryh.supabase.co
- Email: hello@xrayforensic.com

## AUTH SYSTEM (LIVE)

Frontend: Supabase Auth + Google OAuth
  - Google OAuth primary (one-click)
  - Magic link email fallback
  - Session persists via localStorage
  - storageKey: 'xray-auth-token'

Backend: JWT verification on /analyze
  - Bearer token from session.access_token
  - Usage tracked per user per month
  - Limit enforced: signal=1, audit=3,
    forensic=10, guardian/sovereign=unlimited

Key files:
  lib/supabase.ts — client + UserProfile type
  lib/auth-context.tsx — AuthProvider, useAuth
  app/login/page.tsx — Google + magic link
  app/auth/callback/page.tsx — OAuth callback
  app/dashboard/page.tsx — usage + history
  app/new/page.tsx — gated, limit enforced

Admin CLI:
  py manage_user.py list
  py manage_user.py info EMAIL
  py manage_user.py upgrade EMAIL TIER
  py manage_user.py reset EMAIL

## SUPABASE TABLES (LIVE)
  analyses — all reports, linked to user_id
  pending_payments — crypto payment flow
  tier_limits — analyses per tier per month
  tiers — tier definitions
  training_data — future ML training
  user_profiles — user tier + usage tracking
  prescriptions — compliance tracking (NEW)

## GOOGLE OAUTH SETUP
  Google Cloud Project: X-Ray Forensic
  OAuth Client: Web application
  Redirect URI:
    https://cwafqxlohsgskixgeryh.supabase.co/auth/v1/callback
  Supabase Site URL: https://www.xrayforensic.com
  Supabase Redirect URLs:
    https://www.xrayforensic.com/auth/callback
    https://xrayforensic.com/auth/callback
    http://localhost:3000/auth/callback

## COMPLIANCE TRACKER (LIVE)
  Table: prescriptions
  Dashboard: month-on-month comparison
  Shows: revenge count, no-SL, WR, PF, P/L
  Verdict: improving / partial / regression

## TESTIMONIAL SYSTEM (LIVE)
  Source: lib/testimonials.ts
  Placements:
    - Landing page: TestimonialsSection
    - Report page: ReportUpgradeNudge
    - Tier cards: proof lines
  To add testimonial: edit lib/testimonials.ts
  Data needed: name, location, instrument,
    flag_label, flag_amount, quote

## DOMAIN
  Frontend: https://www.xrayforensic.com
  Backend API: https://xray-api-production.up.railway.app
  CANONICAL: www.xrayforensic.com
  NOTE: always use www. prefix everywhere

## RAILWAY PROJECTS
  vibrant-flow → Next.js frontend (xray-web)
    Variables: NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY, ADMIN_KEY

  delightful-miracle → Python backend (xray-api)
    Variables: SUPABASE_URL, SUPABASE_KEY,
      ADMIN_KEY, ANTHROPIC_API_KEY

## WALLET ADDRESSES (Trust Wallet — permanent)
  BEP20: 0x620869b71e673bFfeAc79420a7141fE8853ba67e
  TRC20: TYoZG5HUq8gVh2cgiarCDXV2rbdnetaZhs
  WARNING: These are Trust Wallet addresses.
  NEVER replace with Binance deposit addresses.

## Tier System (LIVE)
  signal (free) → 1 analysis/mo — limited report
  audit ($29/mo) → 3 analyses/mo — full rule-based
  forensic ($79/mo) → 10 analyses/mo — full + AI (Claude API)
  guardian ($149/mo) → unlimited — gated (waitlist)
  sovereign ($399/mo) → unlimited — gated (waitlist)

## COMPLETE FEATURE LIST (ALL LIVE)
  ✅ MT5 forex analysis
  ✅ Crypto analysis (Binance/Bybit/OKX/Bitget/BingX)
  ✅ EA Autopsy + MQL5 export script
  ✅ 12 forensic modules (audit + forensic tiers)
  ✅ 3 tier depths (signal/audit/forensic)
  ✅ Crypto payment + TX verification polling
  ✅ QR codes for wallet addresses
  ✅ Payment confirmation CLI
  ✅ Google OAuth + magic link auth
  ✅ User profiles + tier enforcement
  ✅ Monthly usage limits
  ✅ Dashboard with past reports
  ✅ Compliance tracker (month-on-month)
  ✅ Testimonial system (3 placements)
  ✅ 24h report access via localStorage
  ✅ Support button (WhatsApp/Telegram/Email)
  ✅ Tools page + MQL5 download
  ✅ Back button browser history
  ✅ Admin CLIs (confirm_payment, manage_user)
  ✅ GUARDIAN/SOVEREIGN gated (waitlist)
  ✅ Landing page fully optimized

## Design System (LOCKED)
--bg-base: #0D1117
--bg-card: #161B22
--bg-elevated: #21262D
--border-subtle: #30363D
--border-active: #8B949E
--text-primary: #E6EDF3
--text-secondary: #8B949E
--text-muted: #6E7681
--accent-primary: #58A6FF
--accent-hover: #79B8FF
--accent-secondary: #A371F7
--profit: #3FB950
--loss: #F85149
--warning: #D29922

Fonts: Inter + JetBrains Mono + IBM Plex Serif Italic

## Alignment Rules (CRITICAL)
All eyebrows/labels: textAlign center, width 100%
Nav descriptor: textAlign LEFT
Footer bottom: textAlign center
globals.css has !important overrides for these

## Brand Voice
Never: AI-powered, easy, simple, revolutionary,
  guaranteed, community, family
Always: forensic, diagnosis, verdict, prescription,
  evidence, confession, leak
CTA: "Get Diagnosed"
Tone: clinical, specific, unflinching

## Hard Rules
1. No framer-motion — CSS only
2. No new dependencies without approval
3. npm run build zero errors before push
4. Always push after commit
5. Report commit hash after session
6. <a> for mailto, NOT <Link>
7. useSearchParams in useEffect only
8. Never use ! on nullable state
9. Supabase uploads: content-type text/html
10. Currency: font-variant-numeric tabular-nums
11. Revenue funds features. Don't build unbillable.
12. Do not build what cannot be sold TODAY.

## Competitive Intel (from research)
X-Ray is UNIQUE in: verdict system, dollar-priced
leaks, protocol library, Monte Carlo pre-mortem
Competitors are journals/trackers — none do forensics
Price sweet spot: $29-49/mo for solo traders
CSV acceptable if reliable — auto-sync is Phase 3
Prop firm market: 5-10% pass rate, $4,270 avg spend
Top markets: US, UK, India, Brazil, Australia

## Common Session Starters
1. State which project
2. Read this skill
3. Check git status
4. Build after changes
5. Push after commit
6. Report hash
