# X-RAY FORENSIC — DESIGN RULES
# Portable source of truth for all design/build work on this repo.
# Any agent or session building UI here reads this file FIRST.
# Created 2026-07-20 as commit 1 of redesign/home-v3 (web-engineering-standard requirement).

---

## 1. IDENTITY

**Aesthetic:** Bloomberg Terminal meets prop desk. Clinical, evidentiary, unsentimental.
**Quality bar:** Linear.app, Mercury, Ramp, Vercel — if a section would look out of place
on those sites, it fails.
**Product in one line:** rule-based forensic trade-behavior diagnostics. MT5 history in,
7-dimension verdict + archetype + dollar-priced prescriptions out. Deterministic — the
same input always produces the same verdict. It is NOT AI, NOT signals, NOT advice.
**Organizing concept (homepage v3):** the homepage is a case file; the product is the
evidence. Sections SHOW real report/UI fragments instead of describing features.

## 2. COLOR TOKENS

Canonical values. Raw hex is legal ONLY in `app/globals.css` `:root` and
`tailwind.config.ts`. Everywhere else: Tailwind token classes or `var(--*)`.

| Token (Tailwind class) | Hex | Use |
|---|---|---|
| `brand-bg` | `#0A0E14` | page background |
| `brand-slate` | `#0F141D` | alt surface |
| `brand-card` | `#131A24` | panes/cards |
| `brand-card-hover` | `#1A2330` | hover surface |
| `brand-border` | `#26313F` | hairlines, rules |
| `brand-accent` | `#38BDF8` | THE accent. One accent only. |
| `brand-accent-dark` | `#0EA5E9` | accent hover |
| `brand-accent-dim` | `#1E5C78` | accent at rest / subdued |
| `profit` | `#10b981` | positive figures only |
| `loss` | `#ef4444` | negative figures only |
| `warning` | `#f59e0b` | warning STATES only — never decoration |
| text primary | `#E6EDF3` | via `var(--text-primary)` (globals.css) |
| text secondary | `#8B98A9` | via `var(--text-secondary)` |
| text muted | `#7d8ba3` | via `var(--text-muted)` (WCAG AA floor) |

- `brand-gold*` / `--gold` aliases are DEPRECATED (value-swapped to blue). New code
  never references them. Gold `#e5b83c` anywhere = defect.
- Never pure `#000000` or `#FFFFFF`. Text on accent CTAs is `brand-bg` (`#0A0E14`).
- Enforcement (must return only globals.css + tailwind.config.ts):
  `grep -rniE '#[0-9a-f]{3,8}\b' app components lib --include='*.tsx' --include='*.ts' --include='*.css' | grep -v 'app/globals.css' | grep -v 'tailwind.config.ts'`
  Stricter rule for `app/components/home/` + `app/home-v3/`: ANY hex literal is a fail.

## 3. TYPOGRAPHY

| Face | Role | Rules |
|---|---|---|
| Cabinet Grotesk 700/800 | Display, H1/H2 ONLY | Self-hosted woff2 — ONLY 700 + 800 exist; referencing other weights silently falls back. H1 stays 800 (that file is preloaded in layout.tsx). |
| Inter | Body, UI | via next/font `--font-sans` |
| JetBrains Mono | ALL data, numerals, labels, code | `tabular-nums` mandatory on any number |
| IBM Plex Serif 400 italic | Pull-quotes, exhibit annotations ONLY | never body text |

- Type scale is clamp-based. Body line length ≤ ~65ch; display ≤ ~14ch per line.
- Left-aligned by default. Centered text requires an explicit composition ruling.
- DO NOT touch `app/fonts.ts`, the `@font-face` blocks in globals.css, or the
  `CabinetGrotesk-Extrabold.woff2` preload in `app/layout.tsx` — three separate LCP
  regressions were caused and fixed here. No new fonts, no new weights.

## 4. LAYOUT SYSTEM

- 12-col grid, content max-width 1400px, gutters 32px desktop / 20px mobile.
- Sanctioned asymmetry: 7/5, 8/4, offset column starts. Symmetric 50/50 splits and
  full-center sections need a composition ruling.
- Section vertical rhythm: ~128px desktop / ~80px mobile between sections.
- Hairline rules (`1px` `brand-border`) over boxed drop-shadow cards. The page should
  read as one ruled document, not floating rectangles.
- Breakpoints for design + QA: 375 / 768 / 1440.

## 5. BANNED PATTERNS — AUTOMATIC FAIL (the generic-AI blacklist)

- 3-up (or N-up) icon-card feature rows
- Centered-everything sections; mono-caps kicker above every heading
- Gradient blob / mesh backgrounds; glassmorphism
- Ghosted / duplicated / layered headline text effects
- `scale(1.05)`-on-hover cards; stock arrow-in-circle affordances
- Emoji in UI
- ANY element that reserves space while `opacity: 0` waiting for scroll JS
- Banned phrases (agency-wide): "game-changing", "leverage" (verb), "seamlessly",
  "robust", "cutting-edge", "synergy", "best-in-class", "dive into", etc.

## 6. MOTION POLICY

**Rule 0: every element is fully visible in the server-rendered HTML.** No `opacity: 0`
base states anywhere on the homepage. The scroll-reveal dead-zone bug class must be
structurally impossible, not merely tested for.

- `app/components/home/` and `app/home-v3/` never use `.fade-in-up` or `AnimationInit`.
- Allowed, CSS-only, always inside `@media (prefers-reduced-motion: no-preference)`:
  - one-time hero entrance ≤ 400ms (transform/opacity keyframe whose BASE style is the
    final visible state)
  - hover/focus transitions (color/border only — no scale)
  - the `scan` keyframe (tailwind.config.ts) looping subtly inside the hero report pane
- Banned: IntersectionObserver reveals, scroll-linked opacity, `animation-timeline`,
  staggered section entrances, parallax.
- Reduced-motion render must equal the default render minus movement. QA screenshots
  both; any delta beyond motion = fail.

## 7. COMPLIANCE (trading-analysis rules — one FAIL = rejection)

- Education and analytics only. Never investment advice, signals, or execution claims.
- Every figure/chart/score labeled "Example" / "demo account". No exceptions.
- "Not financial advice. Trading involves risk." present on the page.
- NO "AI" claims — the engine is rule-based/deterministic; say exactly that.
- Upload claims: MT5 only (.csv/.htm/.html/.xlsx/.xml). No MT4/cTrader/TradingView.
- Never guarantee or imply profits; never pair a price with an outcome.
- BANNED claim: "turn losing traders into consistently profitable ones".
  Ceiling: "shows you what's destroying your edge — and holds you accountable to fixing it."
- Homepage pricing: SIGNAL Free / FORENSIC $29/mo / OPERATOR $79/mo / ELITE $149/mo.
  The ONLY one-time SKU on the homepage is Spot Forensic $49. Hardcode in the pricing
  component; do NOT import from `lib/tiers.ts` (contains unconfirmed SKUs).
- Compliance grep before every QA round:
  `grep -rniE '\bAI\b|guarantee|MT4|cTrader|win rate|profit' app/components/home app/home-v3 app/page.tsx`

## 8. QA GATES (evidence-attached — a PASS without evidence on disk is VOID)

1. `npm run lint` + `npx tsc --noEmit` + `npm run build` green on EVERY commit.
2. Hex grep (§2) and compliance grep (§7) clean.
3. Full-page Playwright screenshots at 375/768/1440 + stepped top-to-bottom scroll pass
   + a `prefers-reduced-motion: reduce` pass, saved to the evidence folder and reviewed
   frame-by-frame for blank regions, overlaps, doubled text.
4. Lighthouse ONLY against the Vercel preview URL, never localhost. Gates: mobile
   LCP < 1.5s, CLS < 0.02, Performance ≥ 90.
5. Craft deck test names real references (Linear / Mercury / Ramp) with one sentence
   each on whether the build holds up. Build score = LOWEST of structural / craft /
   functional; below 8/10 blocks delivery.
6. Shared-route smoke: `/`, `/pricing`, `/sample` load clean every round.
   Read-only files for homepage work: `NavBar.tsx`, `lib/tiers.ts`, `app/fonts.ts`,
   `app/layout.tsx` font/preload lines, `shared.tsx`.
