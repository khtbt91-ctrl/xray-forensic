---
name: run-xray-web
description: >
  Run, start, launch, screenshot, or test the X-Ray Next.js web application
  (xray-web/). Bloomberg Terminal aesthetic, 4 pages: landing, /new analysis
  flow, /report/[id], /sample.
---

# X-Ray Web App

Next.js 14 + TypeScript + Tailwind web app. Bloomberg Terminal aesthetic.
Driven with `chromium-cli` (browser already open). Dev server runs on
**port 3099**.

---

## Prerequisites

```bash
node --version   # 22.x
npm --version    # 10.x

# One-time install
cd C:\Users\USER\xray-web
npm install --legacy-peer-deps

# Copy and fill env
copy .env.local.example .env.local
# Fill NEXT_PUBLIC_API_URL=http://localhost:8099 at minimum
```

The FastAPI backend (`run-xray-api`) must be running before uploading a CSV.
For browsing the landing page and `/new`, the backend is not required.

---

## Build

No separate build step for dev. For production:

```bash
cd C:\Users\USER\xray-web
npm run build
```

---

## Run (agent path) — chromium-cli

Start the dev server (runs in background), then drive with the browser tools.

### Start server

```bash
cd C:\Users\USER\xray-web && npm run dev -- --port 3099 > /tmp/xray_web.log 2>&1 &
# Wait ~8 seconds for first compile
curl -s -o /dev/null -w "%{http_code}" http://localhost:3099/
# Expect: 200
```

### Drive with browser tools (MCP)

```
tabs_context_mcp(createIfEmpty=true)
→ navigate(tabId, "http://localhost:3099")          # landing page
→ computer(action="screenshot", save_to_disk=true)  # capture

→ navigate(tabId, "http://localhost:3099/new")      # Step 1 form
→ computer(action="screenshot", save_to_disk=true)

→ navigate(tabId, "http://localhost:3099/sample")   # sample report iframe
→ computer(action="screenshot", save_to_disk=true)
```

### Verified interactions (2026-05-24)

- Landing page: hero + 3 feature columns + pricing cards render in dark mode
- `/new` Step 1: 4 account type cards, "Prop Firm Challenge" reveals firm
  selector (FTMO/Apex/The5ers/Topstep/custom) + 6 numeric fields
- Tier selector: Basic $49 / Pro $99 cards toggle correctly
- `/report/[id]` fetches analysis from FastAPI and renders report in iframe
- `/sample` shows sample report from `NEXT_PUBLIC_API_URL/static/test_nollm.html`

---

## Run (human path)

```powershell
cd C:\Users\USER\xray-web
npm run dev -- --port 3099
# Open http://localhost:3099 in browser
```

Ctrl-C to stop.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, feature columns, pricing, CTAs |
| `/new` | 3-step flow: Context Profile → Stripe Payment → Upload + Process |
| `/report/[id]` | Full-page iframe of the HTML report; top bar with Download PDF |
| `/sample` | Iframe of `test_nollm.html` with sample-report banner |

---

## Design System

Applied globally via CSS variables in `app/globals.css`:

```
--bg-base: #0D1117       background
--bg-card: #161B22       card surfaces
--accent-primary: #58A6FF  links, CTAs, highlights
--profit: #3FB950        P&L positive
--loss: #F85149          P&L negative
```

Body font: Inter. Financial data: JetBrains Mono (`.mono` class or `font-family: JetBrains Mono`).

---

## End-to-end flow (mock Stripe)

The Stripe verify endpoint accepts any `session_id` starting with `dev_` without
hitting the real Stripe API:

```
http://localhost:3099/new?step=2&session_id=dev_test
```

This drops directly into Step 3 (Upload & Process). Then:
1. Drop `REPORT_HISTORY.csv.csv` onto the upload dropzone
2. Click "Run X-Ray Analysis →"
3. FastAPI processes → returns `analysis_id`
4. Browser redirects to `/report/<analysis_id>`

Requires FastAPI running at `NEXT_PUBLIC_API_URL` (port 8099 by default).

---

## Env vars

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | No (local) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No (local) | Supabase anon key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No (local) | Stripe publishable key |
| `STRIPE_SECRET_KEY` | For real payments | Stripe secret key |
| `NEXT_PUBLIC_API_URL` | Yes | FastAPI base URL |
| `NEXT_PUBLIC_SAMPLE_URL` | No | Direct URL to sample HTML |

Set placeholders in `.env.local` for local dev (Supabase/Stripe calls will fail
gracefully with error messages).

---

## Gotchas

- **`next.config.ts` not supported**: Next.js 14.2.x only accepts
  `next.config.js` or `next.config.mjs`. Use `next.config.mjs`.
- **`npm install --legacy-peer-deps`**: Some React 18 peer dependencies need
  the legacy flag.
- **Step URL is 0-indexed**: `/new?step=2` = Upload screen (not `step=3`).
  The Stripe success_url in `app/api/stripe/checkout/route.ts` must use
  `step=2`.
- **Sample page iframe**: Local dev points to `NEXT_PUBLIC_API_URL/static/...`
  which requires serving the `output/` directory as a static mount. For
  production, set `NEXT_PUBLIC_SAMPLE_URL` to the Supabase Storage public URL
  of `test_nollm.html`.
- **`GET /analysis/{id}` returns 503 without Supabase**: `/report/[id]` will
  show an error unless the FastAPI has Supabase configured or the response is
  mocked.
- **Stripe placeholder keys**: Dev mode (`session_id=dev_*`) bypasses Stripe.
  For real payments, configure Stripe env vars and set up a webhook if needed
  for dispute handling.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Error: Configuring Next.js via 'next.config.ts' is not supported` | Delete `next.config.ts`, use `next.config.mjs` instead |
| Port 3099 not up after 8s | Check `/tmp/xray_web.log`; likely a TS compile error |
| `/report/[id]` shows "Analysis not found" | FastAPI needs Supabase configured; or use `/new?step=2&session_id=dev_test` and the local report URL |
| Blank iframe on `/sample` | Set `NEXT_PUBLIC_SAMPLE_URL` to a reachable URL of `test_nollm.html` |
| `npm run build` fails on missing env vars | Add placeholder values to `.env.local` for all `NEXT_PUBLIC_` vars |
