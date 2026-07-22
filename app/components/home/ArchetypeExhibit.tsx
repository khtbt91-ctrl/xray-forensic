import { Section } from "./primitives";

/**
 * Exhibit A — the signature editorial section. AD ruling §5: sanctioned
 * centered exception. Equity-curve excerpt cols 3-9; numbered serif-italic
 * annotations in the margins (odd left, even right), tied to curve points.
 * ZERO brand-accent — curve uses profit/loss data colors only.
 * Mobile: annotations become a numbered caption list below the chart.
 */

const ANNOTATIONS = [
  { n: "1", side: "left", text: "Trade 142 closes for –$340. A clean setup. Ordinary variance — the kind every account absorbs." },
  { n: "2", side: "right", text: "Trade 143 opens four minutes later. No new confluence, no new structure. This is where the pattern starts." },
  { n: "3", side: "left", text: "Trades 144 through 156 — thirteen trades in fifty-one minutes. Win rate inside this run: 15%." },
  { n: "4", side: "right", text: "Trade 157 closes the sequence. The account is down $1,684 from these fifteen minutes alone. The curve never recovers this session." },
] as const;

/** Static equity-curve excerpt with numbered point markers. */
function Curve() {
  return (
    <svg
      viewBox="0 0 640 240"
      className="h-auto w-full"
      role="img"
      aria-label="Annotated equity curve reconstruction of a revenge-trading sequence — example, demo account"
    >
      {/* faint baseline grid */}
      {[60, 120, 180].map((y) => (
        <line key={y} x1="0" y1={y} x2="640" y2={y} className="[stroke:theme(colors.brand-border)]" strokeWidth="0.5" strokeDasharray="2 6" />
      ))}
      {/* stable run → marker 1 */}
      <polyline points="0,96 60,90 110,80 150,84 200,72 236,66" fill="none" className="[stroke:theme(colors.profit)]" strokeWidth="2" />
      {/* the slide: 2 → 3 → 4 */}
      <polyline points="236,66 262,110 284,100 306,138 330,128 356,168 384,158 412,196" fill="none" className="[stroke:theme(colors.loss)]" strokeWidth="2" />
      {/* flatline after */}
      <polyline points="412,196 470,190 540,182 640,186" fill="none" className="[stroke:theme(colors.brand-border)]" strokeWidth="2" />
      {/* numbered markers */}
      {[
        { n: "1", x: 236, y: 66 },
        { n: "2", x: 262, y: 110 },
        { n: "3", x: 330, y: 128 },
        { n: "4", x: 412, y: 196 },
      ].map((m) => (
        <g key={m.n}>
          <circle cx={m.x} cy={m.y} r="9" className="[fill:theme(colors.brand-bg)] [stroke:theme(colors.brand-border)]" strokeWidth="1" />
          <text
            x={m.x}
            y={m.y + 3.5}
            textAnchor="middle"
            className="font-mono [fill:var(--text-secondary)]"
            fontSize="10"
            fontWeight="700"
          >
            {m.n}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Annotation({ n, text, align }: { n: string; text: string; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "md:text-right" : ""}>
      <span className="font-mono text-[12px] font-bold text-[color:var(--text-secondary)]">
        ({n})
      </span>
      <p className="mt-1.5 font-['IBM_Plex_Serif',serif] text-[15px] italic leading-relaxed text-[color:var(--text-secondary)]">
        {text}
      </p>
    </div>
  );
}

export default function ArchetypeExhibit() {
  const left = ANNOTATIONS.filter((a) => a.side === "left");
  const right = ANNOTATIONS.filter((a) => a.side === "right");
  return (
    <Section bg="bg">
      <p className="mx-auto max-w-[58ch] text-center font-sans text-lg leading-relaxed text-[color:var(--text-secondary)]">
        One session, annotated. This is what the revenge-trading pattern
        actually looks like on an equity curve.
      </p>

      <div className="mt-12 grid grid-cols-1 items-stretch gap-10 md:grid-cols-12 md:gap-x-8">
        {/* left margin annotations — (1) tracks the peak, (3) the slide */}
        <div className="hidden flex-col justify-between py-6 md:col-span-2 md:flex">
          {left.map((a) => <Annotation key={a.n} n={a.n} text={a.text} align="left" />)}
        </div>

        {/* the exhibit frame */}
        <figure className="relative m-0 md:col-span-8">
          <div className="rounded-[4px] border border-brand-border bg-brand-slate p-6 pt-12 md:p-8 md:pt-14">
            <span className="absolute left-6 top-5 font-mono text-[11px] font-bold tracking-[0.16em] text-[color:var(--text-primary)] md:left-8">
              EXHIBIT A
            </span>
            <span className="absolute right-6 top-5 hidden font-mono text-[10px] tracking-[0.1em] text-[color:var(--text-muted)] sm:block md:right-8">
              FILE XR-04417 &mdash; ARCHETYPE: REVENGE_CHASER
            </span>
            <Curve />
          </div>
          <figcaption className="mt-3 font-mono text-[10.5px] tracking-[0.1em] text-warning">
            RECONSTRUCTION FROM A DEMO ACCOUNT &mdash; EXAMPLE &mdash; ILLUSTRATIVE ONLY
          </figcaption>
        </figure>

        {/* right margin annotations — (2) tracks the break, (4) the close */}
        <div className="hidden flex-col justify-between py-6 md:col-span-2 md:flex">
          {right.map((a) => <Annotation key={a.n} n={a.n} text={a.text} align="right" />)}
        </div>

        {/* mobile: numbered caption list below the chart */}
        <div className="flex flex-col gap-6 md:hidden">
          {ANNOTATIONS.map((a) => <Annotation key={a.n} n={a.n} text={a.text} align="left" />)}
        </div>
      </div>
    </Section>
  );
}
