---
name: xray-forensic
description: Activate whenever working on xray-web
or institutional-xray projects.
---

# X-Ray Forensic — Session Skill

## STATUS: LAUNCH READY
Platform live at xrayforensic.com
Backend live at Railway
All reports rule-based (no AI yet)
Revenue target: Week 1

## Two Projects
- xray-web (C:\Users\USER\xray-web) = Next.js → Vercel
- institutional-xray (C:\Users\USER\institutional-xray) = Python → Railway
- NEVER modify both in one session

## Live Infrastructure
- Domain: xrayforensic.com
- API: https://xray-api-production.up.railway.app
- Supabase: https://cwafqxlohsgskixgeryh.supabase.co
- Email: hello@xrayforensic.com

## Launch Tiers (Honest)
LIVE NOW:
  signal (free) → limited report (NEEDS GATING)
  audit ($29/mo) → full rule-based report
  spot-audit ($49 one-time) → full report
  pre-challenge ($79 one-time) → full + Monte Carlo
  failure-autopsy ($99 one-time) → full + focused

COMING SOON (greyed out):
  forensic ($79/mo) → needs Claude API
  guardian ($149/mo) → needs live connector
  sovereign ($399/mo) → needs B2B features

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
