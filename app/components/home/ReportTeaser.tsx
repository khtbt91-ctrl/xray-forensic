import { Section, MonoLabel, CtaSecondary, DemoTag } from "./primitives";

/**
 * Inside the Report — editorial document spread. AD ruling §6: 5/7 reversed
 * from the hero. Mono TOC cols 1-5; offset-stacked coded page panes cols 6-12,
 * topmost rotated ≤2° with the section's single accent (active-page border).
 */

const TOC = [
  { n: "01", label: "SUMMARY", pg: "02" },
  { n: "02", label: "SEVEN-DIMENSION SCORECARD", pg: "02" },
  { n: "03", label: "ARCHETYPE: REVENGE_CHASER", pg: "03" },
  { n: "04", label: "DOLLAR-LEAK BREAKDOWN", pg: "04" },
  { n: "05", label: "RANKED PRESCRIPTIONS", pg: "05" },
  { n: "06", label: "RE-TEST PROTOCOL", pg: "06" },
];

function PagePane({
  title,
  rows,
  className = "",
  accent = false,
}: {
  title: string;
  rows: [string, string][];
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[3px] border bg-brand-card p-4 ${
        accent ? "border-brand-accent-dim" : "border-brand-border"
      } ${className}`}
    >
      <div className="flex items-baseline justify-between border-b border-brand-border pb-2">
        <span className="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-[color:var(--text-secondary)]">
          {title}
        </span>
        <span className="font-mono text-[9px] tracking-[0.1em] text-warning">EXAMPLE</span>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        {rows.map(([l, r]) => (
          <div key={l} className="flex justify-between gap-3 font-mono text-[10px] tabular-nums">
            <span className="text-[color:var(--text-muted)]">{l}</span>
            <span className="text-[color:var(--text-secondary)]">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportTeaser() {
  return (
    <Section bg="slate">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <MonoLabel>Inside the Report</MonoLabel>
          <p className="mt-4 max-w-[44ch] font-sans text-lg leading-relaxed text-[color:var(--text-secondary)]">
            This is the actual report a trader gets &mdash; not a mockup.
          </p>
          <ol className="mt-8 list-none border-t border-brand-border p-0">
            {TOC.map((t) => (
              <li
                key={t.n}
                className="flex items-baseline gap-3 border-b border-brand-border py-3 font-mono text-[12.5px] tracking-[0.04em]"
              >
                <span className="text-[color:var(--text-muted)]">{t.n}</span>
                <span className="text-[color:var(--text-secondary)]">{t.label}</span>
                <span
                  aria-hidden="true"
                  className="mx-1 flex-1 border-b border-dotted border-brand-border"
                />
                <span className="tabular-nums text-[color:var(--text-muted)]">{t.pg}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <CtaSecondary href="/sample">See Sample Verdict</CtaSecondary>
          </div>
        </div>

        <div className="md:col-span-7">
          {/* fanned document spread — each layer sits in normal flow and is
              pulled up over the one before it, so every pane keeps a visible
              title strip (AD ruling §6) and the section reserves zero dead
              space (no fixed-height container, no position:absolute stack) */}
          <div className="relative mx-auto max-w-[560px]">
            <PagePane
              title="PG 4 — DOLLAR-LEAK BREAKDOWN"
              rows={[
                ["REVENGE CLUSTER", "–$1,684.90"],
                ["SIZE-UP AFTER LOSS", "–$761.00"],
                ["OUT-OF-SESSION", "–$312.00"],
              ]}
              className="ml-auto w-[78%]"
            />
            <PagePane
              title="PG 2 — SEVEN-DIMENSION SCORECARD"
              rows={[
                ["BEHAVIORAL CONTROL", "22 / 100"],
                ["RISK ARCHITECTURE", "39 / 100"],
                ["LIQUIDITY AWARENESS", "54 / 100"],
                ["SESSION DISCIPLINE", "71 / 100"],
              ]}
              className="mr-auto -mt-[100px] w-[82%]"
            />
            <PagePane
              title="PG 1 — VERDICT SUMMARY"
              accent
              rows={[
                ["FILE", "XR-04417"],
                ["ARCHETYPE", "REVENGE_CHASER (91%)"],
                ["TRADES ANALYZED", "412"],
                ["NET (WINDOW)", "–$2,140.18"],
                ["PRESCRIPTIONS", "5 RANKED"],
              ]}
              className="ml-auto -mt-[112px] w-[88%] -rotate-1"
            />
            <p className="mt-5">
              <DemoTag />
            </p>
          </div>
          <p className="mt-4 font-sans text-[12.5px] text-[color:var(--text-muted)]">
            Real pages from a live sample report &mdash; not a template.
          </p>
        </div>
      </div>
    </Section>
  );
}
