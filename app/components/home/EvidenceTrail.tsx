import type { ReactNode } from "react";
import { Section, MonoLabel } from "./primitives";

/**
 * Evidence Trail — the mechanism as one continuous ledger, not three cards.
 * AD ruling §3: sticky mono numeral rail cols 1-2 (desktop), steps cols 3-12
 * split copy/fragment, fragments always right, hairline dividers, 96px internal
 * rhythm, ghost numerals at low opacity, ZERO brand-accent in this section.
 * Mobile: inline numeral chip replaces the sticky rail.
 */

function Fragment({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[4px] border border-brand-border bg-brand-card p-5">
      {children}
    </div>
  );
}

function MonoRow({ left, right, tone }: { left: string; right?: string; tone?: "loss" | "dim" }) {
  return (
    <div className="flex items-baseline justify-between gap-4 font-mono text-[12.5px] tabular-nums leading-relaxed">
      <span className={tone === "dim" ? "text-[color:var(--text-muted)]" : "text-[color:var(--text-secondary)]"}>
        {left}
      </span>
      {right ? (
        <span className={`whitespace-nowrap font-semibold ${tone === "loss" ? "text-loss" : "text-[color:var(--text-primary)]"}`}>
          {right}
        </span>
      ) : null}
    </div>
  );
}

const STEPS: {
  numeral: string;
  headline: string;
  body: string;
  fragment: ReactNode;
  caption?: string;
}[] = [
  {
    numeral: "01",
    headline: "Upload Your MT5 History",
    body: "Export from MT5 as .csv, .htm, .html, .xlsx, or .xml. That's the only format the engine reads — no manual tagging, no journaling app to migrate from.",
    fragment: (
      <Fragment>
        <div className="flex min-h-[96px] flex-col items-center justify-center gap-4 rounded-[3px] border border-dashed border-brand-border py-6">
          <span className="font-mono text-[11px] tracking-[0.14em] text-[color:var(--text-muted)]">
            DROP MT5 EXPORT HERE
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {[".csv", ".htm", ".html", ".xlsx", ".xml"].map((ext) => (
              <span
                key={ext}
                className="rounded-[2px] border border-brand-border px-2 py-1 font-mono text-[11px] text-[color:var(--text-secondary)]"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      </Fragment>
    ),
  },
  {
    numeral: "02",
    headline: "The Engine Scores You — and Shows Its Work",
    body: "Every verdict ships with the math behind it. No hidden weighting, nothing to take on faith.",
    fragment: (
      <Fragment>
        <MonoRow left="EXAMPLE — DEMO ACCOUNT" tone="dim" />
        <div className="mt-3 flex flex-col gap-1.5 border-t border-brand-border pt-3">
          <MonoRow left="276 trades entered <15min after a prior loss" />
          <MonoRow left="→ flagged: REVENGE pattern" tone="dim" />
          <MonoRow left="net result of flagged set" right="–$1,684.90" tone="loss" />
          <MonoRow left="avg per flagged trade" right="–$6.10" tone="loss" />
          <MonoRow left="win rate, flagged set" right="29.1%" />
          <MonoRow left="win rate, rest of account" right="46.8%" />
        </div>
      </Fragment>
    ),
    caption: 'Same input, same output. Every time. That’s what "deterministic" means here.',
  },
  {
    numeral: "03",
    headline: "Get Ranked Prescriptions",
    body: "Not a to-do list — a ranked order of what to fix first, priced by what it's actually costing you.",
    fragment: (
      <Fragment>
        <MonoRow left="EXAMPLE — DEMO ACCOUNT" tone="dim" />
        <div className="mt-3 flex flex-col gap-2.5 border-t border-brand-border pt-3">
          <MonoRow left="01 Enforce a 30-min cooldown after any loss" right="–$1,684.90" tone="loss" />
          <MonoRow left="02 Cap position size at pre-loss baseline" right="–$761.00" tone="loss" />
          <MonoRow left="03 Trade only inside London/NY kill zones" right="–$312.00" tone="loss" />
        </div>
      </Fragment>
    ),
  },
];

export default function EvidenceTrail() {
  return (
    <Section id="evidence" bg="slate">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
        {/* Sticky numeral rail — desktop only */}
        <div className="hidden md:col-span-2 md:block">
          <div className="sticky top-24">
            <MonoLabel>The Mechanism</MonoLabel>
          </div>
        </div>

        <div className="md:col-span-10">
          <MonoLabel className="mb-10 block md:hidden">The Mechanism</MonoLabel>
          {STEPS.map((step, i) => (
            <article
              key={step.numeral}
              className={`relative grid grid-cols-1 gap-8 py-12 md:grid-cols-10 md:gap-x-8 ${
                i > 0 ? "border-t border-brand-border" : ""
              } ${i === 0 ? "pt-0" : ""} ${i === STEPS.length - 1 ? "pb-0" : ""}`}
            >
              {/* ghost numeral */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-6 hidden select-none font-mono text-[140px] font-bold leading-none text-[color:var(--text-primary)] opacity-[0.05] md:block"
              >
                {step.numeral}
              </span>

              <div className="relative md:col-span-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-bold text-[color:var(--text-secondary)] md:hidden">
                    {step.numeral}
                  </span>
                  <MonoLabel className="text-[10.5px]">STEP {step.numeral}</MonoLabel>
                </div>
                <h3 className="mt-3 font-sans text-2xl font-bold leading-snug text-[color:var(--text-primary)]">
                  {step.headline}
                </h3>
                <p className="mt-3 max-w-[52ch] font-sans text-[15.5px] leading-relaxed text-[color:var(--text-secondary)]">
                  {step.body}
                </p>
                {step.caption ? (
                  <p className="mt-4 font-mono text-[12px] leading-relaxed text-[color:var(--text-muted)]">
                    {step.caption}
                  </p>
                ) : null}
              </div>

              <div className="relative md:col-span-4">{step.fragment}</div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
