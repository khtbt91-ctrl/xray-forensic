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
│   │   ├── NavBar.tsx            # Shared sticky nav (position: sticky, padding-driven height)
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

### CSS Variables (globals.css) — actual values, verified 2026-07-09
```css
--color-brand-gold:      #e5b83c
--color-brand-gold-dark: #b88d1d
--color-brand-bg:        #050811
--bg-card / --card:      #0e1626
--bg-elevated / --card-hover: #141e35
--border / --border-subtle:  #1e293b
--border-active:         #94a3b8
--text-primary:          #f8fafc
--text-secondary:        #94a3b8
--text-muted:            #7d8ba3   (lightened 2026-07-09 for WCAG AA; was #475569, ~3:1 contrast)
--accent-primary / --accent-secondary: #e5b83c  (both resolve to brand gold — there is no separate secondary hue)
--success / --profit:    #10b981
--danger / --loss:       #ef4444
--warning:               #f59e0b
```
There is no blue accent in the token system. `#3b82f6` seen in a couple of
components historically was leftover hardcoded debt, not a real token —
removed 2026-07-09.

### JS Constants (use in all components)
```ts
const MONO = "JetBrains Mono, monospace"   // from app/components/shared.tsx
const SERIF_ITALIC = "'IBM Plex Serif', serif"  // from app/components/shared.tsx
```
Prefer `var(--accent-primary)` etc. over hardcoding hex — most components
already do this. A few older components still hardcode `#e5b83c` literally;
that's acceptable (it's the correct value) but var() is preferred for new work.

### Typography Standards
| Element       | Desktop           | Weight | Color  |
|---------------|--------------------|--------|--------|
| h1 / hero     | ~56px (clamp)      | 800    | #f8fafc |
| h2 (section)  | clamp(24px, 3.5vw, 40px) | 700 | var(--text-primary) |
| Section label | 11px               | 400    | var(--accent-primary) |
| Body          | 14-16px            | 400    | var(--text-secondary) |

Section headline convention (h2-level): `clamp(24px, 3.5vw, 40px)`, weight 700 —
consolidated across RadarSection, FrameworkSection, TierCards, FaqSection,
VerdictFeed, CaseStudies, HonestyGradient, PreChallengeSection as of 2026-07-09.
Section labels: uppercase, letter-spacing 0.15em, JetBrains Mono
Hero headlines only: IBM Plex Serif Italic
Section spacing: minimum 96px between sections

### Buttons
Gold CTA: background var(--accent-primary) (#e5b83c), color #000, font-weight 700
Ghost:    border 1px solid var(--border-subtle) (#1e293b), color var(--text-primary)
Danger:   border 1px solid var(--loss) (#ef4444), color var(--loss)

### NavBar
- `app/components/NavBar.tsx` actually uses `position: sticky; top: 0; z-index: 50`
  (NOT fixed). Height is not a hardcoded 64px — it's padding-driven (`14px 32px`,
  `56px` fixed height only in the `<768px` mobile media query).
- Because it's sticky (not fixed/overlaid), pages do NOT need a manual
  paddingTop offset for the nav itself — sticky pushes normal document flow.
  (Hero-specific top padding on mobile, e.g. `.hero-section` in globals.css,
  is for visual spacing, not to compensate for an overlaid fixed nav.)
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
6. All CTAs use gold (var(--accent-primary), #e5b83c) not blue
7. NavBar is the shared component — never create inline navs
8. NavBar is sticky, not fixed — no manual paddingTop offset needed for the nav itself
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

### Fixed 2026-07-09 (design/code audit pass)
- [x] Stale gold `#C9A84C` replaced with `var(--accent-primary)` (#e5b83c) in TierCards.tsx and RadarSection.tsx
- [x] RadarSection mobile overflow — chart's fixed `minWidth: 450` now scoped to `.radar-chart-frame` with a `@media (max-width: 768px)` override (300px) plus a self-contained `overflow-x: auto` wrapper
- [x] Leftover blue accent (`#3b82f6`) in HowItWorks step 2 and AudienceSection "Beginner" card replaced with brand gold
- [x] Hardcoded off-palette colors in VerdictFeed.tsx (`#f85149`, `#64748b`, `#334155`, `#e2e8f0`, `#475569`) replaced with `var(--loss)` / `var(--text-muted)` / `var(--text-primary)` / `var(--border-subtle)`
- [x] TierCards.tsx excluded-feature text (`#4B5563`/`#374151`) replaced with `var(--text-muted)` / `var(--border-subtle)`
- [x] `--text-muted` contrast failure fixed — lightened `#475569` → `#7d8ba3` (now ~5.8:1 on `--bg`, passes WCAG AA)
- [x] Typography audit — section h2 headlines consolidated to `clamp(24px, 3.5vw, 40px)` weight 700 across VerdictFeed, CaseStudies, HonestyGradient, PreChallengeSection
- [x] Dead code — 9 unused components (ComparisonSection, LiveTicker, MetricBar, ProtocolsSection, RotatingTagline, SamplePreview, TestimonialsSection, TrustBar, LeakCalculator) moved to `app/components/_archive/`
- [x] Follow-up sweep — same stale-gold/blue/gray hardcoded hex found site-wide (admin, dashboard, login, payment, pricing, tools, report/[id], new, foundations/*, HeroSection, NavBar, LeakCalculatorGuide, page.tsx) replaced with the matching CSS var. Left alone on purpose: `roadmap.tsx`'s own redaction-themed gray palette, and the two legitimate multi-hue category legends (admin `TIER_COLORS`, `DeskNoteFeed` note-type colors) — those aren't bugs, they're intentional categorical color systems.

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
