'use client'

import dynamic from 'next/dynamic'

/**
 * Deferred below-fold sections — home-v3 mobile LCP fix.
 *
 * ROOT CAUSE (real trace, not guessed — see build notes): this route is
 * fully static (SSG). With all 9 sections server-rendered into one HTML
 * response, the browser had ~750-800 DOM nodes present the moment the
 * parser reached them, then had to run ONE Style+Layout pass over the
 * entire tree as soon as render-blocking CSS/fonts resolved — a 1000ms+
 * main-thread task on a 4x-throttled mobile CPU, with the hero subhead
 * (the real LCP element) stuck waiting behind it.
 *
 * Fix: everything below Hero mounts client-side via next/dynamic with
 * ssr:false, so the initial HTML/first layout pass only covers HomeNav +
 * Hero. Each dynamic import gets its own loading fallback with an explicit
 * min-height, measured from real rendered heights (Playwright
 * getBoundingClientRect at 375/768/1440 against the live preview, the same
 * breakpoints tests/visual.spec.ts checks) so mounting the real section
 * doesn't push anything below it around — no content-visibility experiment
 * this time (that was tried and reverted, see build notes; this is the
 * next/dynamic + Suspense alternative that was flagged as safer).
 *
 * SCOPE DECISION: Hero and SiteFooter stay eagerly server-rendered on
 * purpose — Hero because it holds the LCP element, SiteFooter because it
 * carries the "not financial advice" compliance line and Privacy/Terms
 * links, which should not depend on client JS to exist in the response.
 * Only the seven pure marketing/content sections in between are deferred.
 *
 * TRADE-OFF, flagged for the record: these seven sections are no longer in
 * the server-rendered HTML for genuinely-no-JS clients, and for crawlers
 * they now depend on a JS-rendering pass rather than being present in the
 * first HTML response. Googlebot does execute JS (two-wave indexing), so
 * this is a real but non-fatal SEO risk for a page that will become the
 * public homepage — worth an explicit call before this ships past the
 * temp /home-v3 route, not a settled non-issue.
 */

const noSSR = { ssr: false } as const

export const DeferredEvidenceTrail = dynamic(() => import('./EvidenceTrail'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[1700px] md:min-h-[1430px]" />,
})

export const DeferredSevenDimensions = dynamic(() => import('./SevenDimensions'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[1310px] md:min-h-[1600px]" />,
})

export const DeferredArchetypeExhibit = dynamic(() => import('./ArchetypeExhibit'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[1000px] md:min-h-[1010px]" />,
})

export const DeferredReportTeaser = dynamic(() => import('./ReportTeaser'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[1000px] md:min-h-[750px]" />,
})

export const DeferredHonestyLedger = dynamic(() => import('./HonestyLedger'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[1480px] md:min-h-[1070px]" />,
})

export const DeferredPricingTable = dynamic(() => import('./PricingTable'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[920px] md:min-h-[1110px]" />,
})

export const DeferredFinalCta = dynamic(() => import('./FinalCta'), {
  ...noSSR,
  loading: () => <div aria-hidden="true" className="min-h-[730px] md:min-h-[780px]" />,
})
