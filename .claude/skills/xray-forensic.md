---
name: xray-forensic
description: Activate whenever working on xray-web 
or institutional-xray projects. Encodes architecture, 
design system, brand voice, tier logic, and constraints.
---

# X-Ray Forensic — Session Skill

## Two Projects — Never Confuse Them
- xray-web (C:\Users\USER\xray-web) = Next.js frontend → Vercel
- institutional-xray (C:\Users\USER\institutional-xray) = Python backend → Railway
- NEVER modify both in one session unless explicitly instructed
- State which project you are working in at the start

## Design System (LOCKED)
```css
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
```

## Fonts
- Inter: body, descriptions, UI
- JetBrains Mono: numbers, verdicts, data, technical labels
- IBM Plex Serif Italic: "What you tell yourself" column ONLY

## Brand Voice
- Never say: AI-powered, easy, simple, revolutionary, 
  guaranteed, community, family
- Always say: forensic, diagnosis, verdict, prescription, 
  evidence, confession, leak
- CTA: "Get Diagnosed" not "Start Free"
- Tone: clinical, specific, unflinching, actionable
- The machine measures. It does not motivate.

## Tier System
3 report levels: signal → audit → forensic
8 tier slugs:
  signal (free) → signal level
  audit ($29/mo) → audit level
  spot-audit ($49 one-time) → audit level
  forensic ($79/mo) → forensic level
  pre-challenge ($79 one-time) → forensic level
  failure-autopsy ($99 one-time) → forensic level
  guardian ($149/mo) → forensic level
  sovereign ($399/mo) → forensic level

Tier data source of truth:
  Frontend: lib/tiers.ts
  Backend: xray/tier_config.py
  Database: Supabase tiers table

## Infrastructure
- Railway API: https://xray-api-production.up.railway.app
- Supabase: https://cwafqxlohsgskixgeryh.supabase.co
- Domain: xrayforensic.com
- Email: hello@xrayforensic.com

## Hard Rules
1. No framer-motion — CSS animations only
2. No new dependencies without approval
3. npm run build must pass with zero errors before push
4. Always git push after committing
5. Report commit hash after every session
6. Use <a> tags for mailto links, not Next.js <Link>
7. useSearchParams must be read in useEffect (hydration safety)
8. Never use non-null assertion (!) on nullable state
9. Supabase Storage uploads: content-type text/html
10. All currency elements: font-variant-numeric: tabular-nums

## Common Session Starters
When starting a session, always:
1. State which project: xray-web or institutional-xray
2. Read CLAUDE.md or this skill file
3. Check git status before making changes
4. npm run build (or python syntax check) after changes
5. git add, commit with descriptive message, push
