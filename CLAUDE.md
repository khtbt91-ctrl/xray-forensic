# X-Ray Forensic — Frontend Instructions

## Project Identity
This is the NEXT.JS FRONTEND (xray-web).
Never modify institutional-xray in this session unless explicitly told.
Backend path: C:\Users\USER\institutional-xray

## What This Is
X-Ray Forensic is a self-serve forensic trade
diagnostic platform. Traders upload MT5 CSV history,
get diagnosed through 7 institutional dimensions,
receive a verdict, prescriptions, and protocols.
Fully automated. Zero manual intervention.

Domain: xrayforensic.com
Slogan: "Diagnose. Prescribe. Recover."
Headline: "Your trades confess everything."

## Current State — LIVE WITH AUTH
- Platform LIVE at https://www.xrayforensic.com (canonical: www.)
- Frontend LIVE at Railway (vibrant-flow)
- Backend API: https://xray-api-production.up.railway.app
- Auth LIVE: Google OAuth + magic link (Supabase)
- Tier gating LIVE: signal=1, audit=3, forensic=10, guardian/sovereign=unlimited
- All reports are RULE-BASED (no LLM yet)
- Stripe keys configured (not wired up yet)

## Architecture

### Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (utility classes only — no compiler, use core utilities)
- Supabase (auth + storage)

### Key Files
```
xray-web/
├── app/
│   ├── page.tsx                  # Homepage (landing)
│   ├── layout.tsx                # Root layout — AuthProvider, NavBar, ReturnToReportBanner
│   ├── globals.css               # Design system CSS variables + animations
│   ├── components/
│   │   ├── NavBar.tsx            # Shared fixed nav (height 64px, position: fixed)
│   │   ├── HeroSection.tsx       # Landing hero
│   │   ├── HowItWorks.tsx        # "Three steps. One verdict." section
│   │   ├── RadarSection.tsx      # 7-dimension radar chart
│   │   ├── FrameworkSection.tsx  # 7 Diagnostic Dimensions detail
│   │   ├── LeakCalculator.tsx    # Interactive dollar-leak calculator
│   │   ├── TierCards.tsx         # Pricing cards
│   │   ├── TestimonialsSection.tsx
│   │   ├── ReturnToReportBanner.tsx  # Fixed bottom banner
│   │   └── FinalCta.tsx
│   ├── dashboard/page.tsx        # User dashboard
│   ├── new/page.tsx              # Upload wizard (multi-step)
│   ├── pricing/page.tsx          # Standalone pricing page
│   ├── payment/page.tsx          # Crypto payment flow
│   ├── roadmap/page.tsx          # Public roadmap
│   ├── report/[id]/page.tsx      # Report viewer
│   ├── login/page.tsx            # Auth page
│   └── auth/callback/page.tsx    # Supabase OAuth callback
├── lib/
│   ├── auth-context.tsx          # AuthProvider — useAuth() hook
│   ├── supabase.ts               # Supabase client + UserProfile type
│   ├── testimonials.ts           # Testimonials array
│   └── tiers.ts                  # Tier definitions
└── CLAUDE.md                     # This file
```

### Homepage Section Order (app/page.tsx)
1. NavBar
2. HeroSection
3. HowItWorks
4. TrustBar
5. PainWall
6. PreChallengeSection
7. RadarSection
8. FrameworkSection
9. MetricBar
10. HonestyGradient
11. CaseStudies
12. TestimonialsSection
13. AudienceSection
14. ProtocolsSection
15. LeakCalculator  ← moved here 2026-05-31
16. TierCards
17. OneTimeProducts
18. SamplePreview
19. ComparisonSection
20. FaqSection
21. FinalCta

## Design System (LOCKED)

### CSS Variables (globals.css)
```css
--bg-base:        #0D1117
--bg-card:        #161B22
--bg-elevated:    #21262D
--border-subtle:  #30363D
--border-active:  #8B949E
--text-primary:   #E6EDF3
--text-secondary: #8B949E
--text-muted:     #6E7681
--accent-primary: #58A6FF
--accent-secondary: #A371F7
--profit:         #3FB950
--loss:           #F85149
--warning:        #D29922
```

### JS Constants (use in all components)
```ts
const GOLD = "#C9A84C"
const BG   = "#0A0A0A"
const MONO = "JetBrains Mono, monospace"
const GRAY = "#9CA3AF"
```

### Typography Standards
| Element       | Desktop | Mobile | Weight | Color  |
|---------------|---------|--------|--------|--------|
| h1 / hero     | 56px    | 36px   | 800    | #E6EDF3 |
| h2            | 40px    | 28px   | 700    | #E6EDF3 |
| Section label | 11px    | 11px   | 400    | #C9A84C |
| Body          | 15-16px | 15px   | 400    | #9CA3AF |

Section labels: uppercase, letter-spacing 0.15em, JetBrains Mono
Hero headlines only: IBM Plex Serif Italic
Section spacing: minimum 96px between sections

### Buttons
Gold CTA: background #C9A84C, color #000, font-weight 700
Ghost:    border 1px solid #30363D, color #E6EDF3
Danger:   border 1px solid #F85149, color #F85149

### NavBar
- position: fixed, top 0, height 64px, z-index 50
- Pages using NavBar need paddingTop: 80px on their container
- Import: `import NavBar from '../components/NavBar'`
  (adjust relative path based on depth)

## Auth System

### How it works
1. Supabase handles auth (magic link + Google OAuth)
2. On auth, AuthProvider in layout.tsx fetches /user/profile from Railway API
3. Profile is cached in context — access via `useAuth()`
4. JWT token sent as `Authorization: Bearer {token}` to backend

### useAuth() hook
```ts
const { user, session, profile, loading, signOut, refreshProfile } = useAuth()
```
- `profile` contains: tier_id, analyses_used, analyses_limit, subscription_status
- `refreshProfile()` re-fetches from API (call after tier upgrade)
- `loading` is true until initial profile fetch resolves

### Profile fetch dedup (2026-05-31)
lastFetchedToken ref prevents duplicate calls when
initAuth + onAuthStateChange INITIAL_SESSION fire simultaneously.
Do NOT add additional fetchProfile/refreshProfile calls in components
without checking if they're necessary.

## Rules for Development
1. Read this file before every session
2. No framer-motion — CSS animations only
3. No localStorage for auth state — Supabase handles it
4. `npm run build` zero errors before pushing
5. Never break the existing auth flow
6. All CTAs use gold (#C9A84C) not blue
7. NavBar is the shared component — never create inline navs
8. Pages using fixed NavBar need paddingTop: 80px minimum
9. Mobile-first: test at 375px before any push

## Brand Voice Rules
Never: AI-powered, easy, simple, revolutionary,
  guaranteed, community, family
Always: forensic, diagnosis, verdict, prescription,
  evidence, confession, leak, measurement
CTA: "Get Diagnosed" (not "Start Free")
Tone: clinical, specific, unflinching, actionable

---

## Cowork Session Instructions

### How to Start Every Session
Paste this at the start of every Cowork session:

"I'm continuing work on X-Ray Forensic.
Frontend: C:\Users\USER\xray-web
Backend: C:\Users\USER\institutional-xray
Live: https://www.xrayforensic.com
API: https://xray-api-production.up.railway.app
Admin: admin@xrayforensic.com
Read CLAUDE.md before doing anything."

### Standard Workflow
1. Read CLAUDE.md first
2. Read the specific file(s) related to the task
3. Show a diff before applying any change
4. Commit with descriptive message
5. Push and confirm Railway redeploys
6. Test on live site before moving to next task

### Git Workflow
```
cd C:\Users\USER\xray-web
git add [files]
git commit -m "type: description"
git push origin main
```
Commit types: fix / feat / style / refactor / docs

### Testing Protocol
After every deploy:
1. Hard refresh (Ctrl+Shift+R)
2. Test auth flows in incognito
3. Check Railway vibrant-flow logs for errors
4. Verify at 375px (DevTools device toolbar)

---

## Known Issues (update as fixed)

### Active
- [ ] /analyze returns 502 (backend issue — see institutional-xray/CLAUDE.md)
- [ ] Typography audit not yet complete — inconsistencies remain
- [ ] Mobile audit not yet complete — 375px issues unfixed

### Fixed This Session (2026-05-31)
- [x] NavBar missing from /pricing, /new, /dashboard, /payment — added
- [x] /user/profile called 6-8x per load — fixed with token dedup ref
- [x] LeakCalculator buried — moved 2 sections earlier (before TierCards)
- [x] Testimonial placeholder slots — 2 commented-out slots added
- [x] Phase 3 roadmap badge — was already PLANNED (no change needed)
- [x] ReturnToReportBanner on /roadmap /pricing /payment — already excluded
- [x] Blue buttons — only roadmap ACTIVE dot uses blue (intentional)

### Previously Fixed
- [x] Dashboard blank screen for new users
- [x] Upgrade button → /pricing
- [x] Banner hidden on dashboard/auth/login
- [x] All hello@xray.trade → support@xrayforensic.com
- [x] Tier mismatch landing vs pricing page

---

## What's Next (priority order)

### Urgent
1. Fix /analyze 502 (backend — watch Railway delightful-miracle logs)
2. Typography audit — audit every page against standards above
3. Mobile audit — 375px, fix overflow, tap targets, text sizes

### Next
4. Homepage: fix gap between HeroSection and HowItWorks
5. FrameworkSection: verify all 7 dimension cards have content + click handlers
6. Collect 2-3 real beta testimonials, uncomment placeholders in testimonials.ts
7. Post-signup onboarding flow

### Phase 2
8. Compliance tracker UI (prescriptions saved to DB)
9. Trader DNA profile page
10. Stripe payment integration (replace crypto)
