import { Section, CtaPrimary } from "./primitives";

/**
 * Final CTA — centered exception #2 (AD ruling §9). The page's boldest accent
 * moment: solid accent fill, sanctioned because nothing else shares this
 * screen. Disclaimer plate directly beneath — the page closes by admitting
 * its own compliance frame.
 */

export default function FinalCta() {
  return (
    <Section bg="bg">
      <div className="mx-auto max-w-[760px] text-center">
        <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-extrabold leading-tight tracking-[-0.02em] text-[color:var(--text-primary)]">
          Your Trade History Is Already the Evidence.
        </h2>
        <p className="mt-4 font-sans text-lg text-[color:var(--text-secondary)]">
          Upload it. See what it already knows.
        </p>
        <div className="mt-9">
          <CtaPrimary href="/new">Get Diagnosed</CtaPrimary>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[760px] rounded-[4px] border border-brand-border bg-brand-card px-6 py-5">
        <p className="text-left font-mono text-[12.5px] leading-relaxed text-[color:var(--text-secondary)]">
          X-Ray Forensic is an analytics and education tool. It does not execute
          trades, provide signals, or offer financial advice.
          <br />
          <br />
          Not financial advice. Trading involves risk.
          <br />
          <br />
          All figures, scores, and report fragments shown on this page are
          examples from demo accounts, not real user or funded-account results.
        </p>
      </div>
    </Section>
  );
}
