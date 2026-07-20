import { Grid, CtaLight, CtaSecondary, MonoLabel } from "./primitives";
import ReportArtifact from "./ReportArtifact";

/**
 * Hero — asymmetric 7/5, product as evidence. AD ruling §2:
 * headline cols 1-7, pane cols 8-12 bleeding past the frame (desktop only,
 * the page's one grid-break). Accent: the single word "Lose". H1 clamp capped
 * at 96px so the locked 17ch first line holds the 7-col measure (reconciled
 * copy flag, 2026-07-20).
 */

export default function Hero() {
  return (
    <section className="overflow-x-clip bg-brand-bg">
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-16 md:px-8 md:pb-44 md:pt-24">
        <Grid className="items-center">
          <div className="md:col-span-7">
            <MonoLabel className="text-[color:var(--text-secondary)]">
              Your trade history already knows the answer
            </MonoLabel>
            <h1 className="mt-5 font-display text-[clamp(42px,7vw,96px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-[color:var(--text-primary)]">
              The Only Platform
              <br />
              That Tells You
              <br />
              WHY You <span className="text-brand-accent">Lose</span>
            </h1>
            <p className="mt-7 max-w-[46ch] font-sans text-lg leading-relaxed text-[color:var(--text-secondary)] md:text-xl">
              Upload your MT5 history. See the seven behavioral dimensions that
              are costing you money &mdash; scored by a deterministic engine.
              Same input, same verdict, every time. No black box.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <CtaLight href="/new">Get Diagnosed</CtaLight>
              <CtaSecondary href="/sample">See Sample Verdict</CtaSecondary>
            </div>
            <p className="mt-6 font-mono text-[11px] tracking-[0.12em] text-[color:var(--text-muted)]">
              MT5 EXPORT &middot; FREE TIER &middot; NO CARD
            </p>
          </div>

          {/* Evidence pane — bleeds off the right edge at desktop only */}
          <div className="md:col-span-5 md:-mr-14 lg:-mr-20">
            <ReportArtifact />
          </div>
        </Grid>
      </div>
    </section>
  );
}
