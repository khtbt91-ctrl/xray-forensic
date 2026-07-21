/**
 * The hero's evidence: a coded terminal-pane fragment of a real report.
 * Server-rendered HTML — crisp at any DPI, zero JS, no image LCP risk.
 * All data = FILE XR-04417 demo case file (copy-home-v3.md). The pane's
 * scanline is the page's only on-load motion, gated behind motion-safe.
 * No brand-accent anywhere in this pane (AD ruling §2) — data colors only.
 */

const ROWS: { label: string; value: string; tone?: "loss" }[] = [
  { label: "ARCHETYPE", value: "REVENGE_CHASER (91%)" },
  { label: "TRADES ANALYZED", value: "412" },
  { label: "BEHAVIORAL CONTROL", value: "22 / 100" },
  { label: "LARGEST LEAK", value: "–$1,684.90", tone: "loss" },
  { label: "NET (WINDOW)", value: "–$2,140.18", tone: "loss" },
];

export default function ReportArtifact() {
  // pr compensates the hero's bleed margin: the frame bleeds off-page, the data never does
  return (
    <figure className="relative overflow-hidden rounded-[4px] border border-brand-border bg-brand-card md:pr-14 lg:pr-20">
      {/* scanline — motion-safe only; static pane under reduced motion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full motion-safe:animate-scan"
      >
        <div className="h-10 w-full bg-gradient-to-b from-transparent via-brand-card-hover/60 to-transparent" />
      </div>

      <figcaption className="relative flex items-center justify-between gap-4 border-b border-brand-border px-5 py-3">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[color:var(--text-secondary)]">
          FILE XR-04417 &mdash; XAUUSD &mdash; LONDON
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-warning">
          Example &mdash; demo account
        </span>
      </figcaption>

      <div className="relative px-5 py-5">
        <dl className="flex flex-col gap-3.5">
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between gap-6 font-mono text-[13px] tabular-nums"
            >
              <dt className="whitespace-nowrap tracking-[0.06em] text-[color:var(--text-muted)]">
                {r.label}
              </dt>
              <dd
                className={`m-0 whitespace-nowrap font-semibold ${
                  r.tone === "loss" ? "text-loss" : "text-[color:var(--text-primary)]"
                }`}
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative border-t border-brand-border px-5 py-2.5">
        <span className="font-mono text-[10.5px] tracking-[0.08em] text-[color:var(--text-muted)]">
          verdict computed 07:41:12 &mdash; rule-based, reproducible
        </span>
      </div>
    </figure>
  );
}
