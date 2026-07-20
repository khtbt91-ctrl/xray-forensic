import { Section, MonoLabel, DemoTag } from "./primitives";

/**
 * The Seven Dimensions — data-forward ruled table, radar demoted to a margin
 * exhibit. AD ruling §4: table cols 1-9, static hand-drawn SVG radar cols 10-12
 * offset into the gutter. Accent: exactly ONE score bar — the worst dimension.
 * Mobile: ranked worst-to-best list, radar drops entirely.
 */

const DIMENSIONS = [
  { name: "HTF Bias Alignment", def: "Trading with or against higher-timeframe market structure.", score: 68, finding: "Traded against structure on 19% of entries", leak: "–$286" },
  { name: "Liquidity Awareness", def: "Stop placement relative to visible liquidity pools.", score: 54, finding: "Stops placed inside visible liquidity pools on 44% of trades", leak: "–$511" },
  { name: "OTE Zone Discipline", def: "Entry quality inside the optimal trade-entry zone.", score: 61, finding: "31% of entries taken outside the OTE zone", leak: "–$298" },
  { name: "OB/FVG Confluence", def: "Institutional entry confluence — order blocks and fair-value gaps.", score: 58, finding: "37% of entries lack order-block/FVG confluence", leak: "–$340" },
  { name: "Session Discipline", def: "Trading inside the correct kill zones (London/NY) versus outside them.", score: 71, finding: "48 trades placed outside London/NY kill zones", leak: "–$312" },
  { name: "Risk Architecture", def: "Position sizing, stop-loss usage, and risk-reward consistency.", score: 39, finding: "Lot size increased after losses on 63% of losing streaks", leak: "–$761" },
  { name: "Behavioral Control", def: "Revenge trading, overconfidence, and streak bias.", score: 22, finding: "276 of 412 trades entered within 15 minutes of a prior loss", leak: "–$1,684.90", worst: true },
] as const;

/** Static seven-axis radar, server-rendered — no Recharts on this route. */
function Radar() {
  const cx = 100, cy = 100, rMax = 88;
  const scores = DIMENSIONS.map((d) => d.score);
  const point = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  };
  const ring = (r: number) => Array.from({ length: 7 }, (_, i) => point(i, r)).join(" ");
  const data = scores.map((s, i) => point(i, (s / 100) * rMax)).join(" ");
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[220px]" role="img" aria-label="Seven-axis behavioral score radar — example, demo account">
      {[rMax, rMax * 0.66, rMax * 0.33].map((r) => (
        <polygon key={r} points={ring(r)} fill="none" className="[stroke:theme(colors.brand-border)]" strokeWidth="1" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={point(i, rMax).split(",")[0]} y2={point(i, rMax).split(",")[1]} className="[stroke:theme(colors.brand-border)]" strokeWidth="0.5" />
      ))}
      <polygon points={data} className="[fill:theme(colors.brand-accent-dim)] [stroke:theme(colors.brand-accent)]" fillOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );
}

function ScoreBar({ score, worst }: { score: number; worst?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[6px] w-full max-w-[160px] overflow-hidden rounded-[1px] bg-brand-card-hover">
        <div
          className={worst ? "h-full bg-brand-accent" : "h-full bg-[color:var(--text-muted)]"}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-[13px] font-semibold tabular-nums text-[color:var(--text-primary)]">
        {score}
      </span>
    </div>
  );
}

export default function SevenDimensions() {
  const ranked = [...DIMENSIONS].sort((a, b) => a.score - b.score);
  return (
    <Section id="dimensions" bg="card">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-9">
          <MonoLabel>The Seven Dimensions</MonoLabel>
          <p className="mt-4 max-w-[58ch] font-sans text-lg leading-relaxed text-[color:var(--text-secondary)]">
            Seven behavioral dimensions, scored 0&ndash;100 from your own trade
            data. One of them is usually where the money is actually going.
          </p>

          {/* Desktop ruled table */}
          <div className="mt-10 hidden md:block">
            <div className="grid grid-cols-[1.1fr_1.6fr_1fr_0.6fr] gap-x-6 border-b border-brand-border pb-2.5">
              {["Dimension", "Demo finding", "Score / 100", "Leak"].map((h) => (
                <MonoLabel key={h} className="text-[10px]">{h}</MonoLabel>
              ))}
            </div>
            {DIMENSIONS.map((d) => (
              <div
                key={d.name}
                className="grid grid-cols-[1.1fr_1.6fr_1fr_0.6fr] items-center gap-x-6 border-b border-brand-border py-4"
              >
                <div>
                  <p className="font-sans text-[15px] font-bold text-[color:var(--text-primary)]">{d.name}</p>
                  <p className="mt-1 font-sans text-[13px] leading-snug text-[color:var(--text-muted)]">{d.def}</p>
                </div>
                <p className="font-sans text-[14px] leading-snug text-[color:var(--text-secondary)]">{d.finding}</p>
                <ScoreBar score={d.score} worst={"worst" in d && d.worst} />
                <span className="text-right font-mono text-[14px] font-semibold tabular-nums text-loss">{d.leak}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3">
              <DemoTag />
            </div>
          </div>

          {/* Mobile ranked list, worst → best */}
          <div className="mt-8 flex flex-col md:hidden">
            {ranked.map((d) => (
              <div key={d.name} className="border-b border-brand-border py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-sans text-[15px] font-bold text-[color:var(--text-primary)]">{d.name}</p>
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-loss">{d.leak}</span>
                </div>
                <div className="mt-2"><ScoreBar score={d.score} worst={"worst" in d && d.worst} /></div>
                <p className="mt-2 font-sans text-[13px] leading-snug text-[color:var(--text-secondary)]">{d.finding}</p>
              </div>
            ))}
            <div className="pt-3"><DemoTag /></div>
          </div>

          <p className="mt-5 max-w-[76ch] font-sans text-[12.5px] leading-relaxed text-[color:var(--text-muted)]">
            Dimension leaks are diagnostic categories, not a strict partition
            &mdash; a single trade can be flagged under more than one dimension.
            Figures are examples from a demo account and are not additive to net
            account result.
          </p>
        </div>

        {/* Margin radar — desktop only, offset into the gutter */}
        <div className="hidden md:col-span-3 md:block md:-mr-6 md:pt-24">
          <Radar />
          <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-[color:var(--text-muted)]">
            SEVEN-AXIS SCORE &mdash; EXAMPLE, DEMO ACCOUNT
          </p>
        </div>
      </div>
    </Section>
  );
}
