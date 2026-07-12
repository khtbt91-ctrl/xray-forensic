'use client'

import { useMemo } from 'react'

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD    = '#e5b83c'
const BG_CARD = '#0e1626'
const BG_BASE = '#050811'
const BORDER  = '#1e293b'
const MONO    = "var(--font-mono)"

// ── Content library ────────────────────────────────────────────────────────────

interface DeskNote {
  id: string
  type: 'personal' | 'market' | 'foundations'
  title: string
  body: string
  tag?: string
}

const DESK_NOTES: DeskNote[] = [
  { id: 'dn-liquidity',    type: 'foundations', title: 'LIQUIDITY',             tag: 'FOUNDATIONS', body: 'Stops cluster above swing highs and below swing lows. Price hunts them before the real move. The sweep is not the trend — it is the bait.' },
  { id: 'dn-risk',         type: 'foundations', title: 'RISK',                  tag: 'FOUNDATIONS', body: '1% risk per trade survives a 10-loss streak with 90% of capital intact. 5% risk does not survive it. The math does not care how confident you are.' },
  { id: 'dn-sessions',     type: 'foundations', title: 'SESSIONS',              tag: 'FOUNDATIONS', body: 'London and New York overlap generates 50% of daily range in 4 hours. Asian session is range-bound by design. Trading Asian like London is fighting the clock.' },
  { id: 'dn-ob',           type: 'foundations', title: 'ORDER BLOCKS',          tag: 'FOUNDATIONS', body: 'An order block is the last opposing candle before a significant move. Institutions leave their footprint there. Price returns to fill their remaining orders.' },
  { id: 'dn-htf',          type: 'foundations', title: 'HTF BIAS',              tag: 'FOUNDATIONS', body: 'Weekly and daily candles determine direction. 15-minute entries against the daily trend are not setups. They are hope dressed as analysis.' },
  { id: 'dn-revenge',      type: 'foundations', title: 'REVENGE TRADING',       tag: 'FOUNDATIONS', body: 'A revenge trade is not a trading decision. It is an emotional response wearing a trading costume. The market does not know you had a loss. It does not care.' },
  { id: 'dn-sl',           type: 'foundations', title: 'STOP LOSSES',           tag: 'FOUNDATIONS', body: 'A trade without a stop loss is not a trade. It is a position with unknown maximum loss. Professionals define risk before entry. Always.' },
  { id: 'dn-killzones',    type: 'foundations', title: 'KILL ZONES',            tag: 'FOUNDATIONS', body: 'London open (07–10 UTC) and New York open (13–16 UTC) are when institutional orders hit the market. These windows produce the majority of meaningful price action.' },
  { id: 'dn-fvg',          type: 'foundations', title: 'FAIR VALUE GAPS',       tag: 'FOUNDATIONS', body: 'A fair value gap is an imbalance — price moved so fast one direction that it left an unfilled range. Price frequently returns to fill it before continuing.' },
  { id: 'dn-sizing',       type: 'foundations', title: 'POSITION SIZING',       tag: 'FOUNDATIONS', body: 'Position size is not about how much you want to make. It is about how much you can lose without it affecting your next decision. Size for the loss, not the gain.' },
  { id: 'dn-bos',          type: 'foundations', title: 'BREAK OF STRUCTURE',    tag: 'FOUNDATIONS', body: 'A break of structure is when price creates a new high above the previous high (bullish) or a new low below the previous low (bearish). It signals a shift in who is in control.' },
  { id: 'dn-patience',     type: 'foundations', title: 'PATIENCE',              tag: 'FOUNDATIONS', body: 'The best traders miss most moves deliberately. They wait for their specific setup at their specific location. Overtrading is not ambition — it is impatience with a cost.' },
  { id: 'dn-confluence',   type: 'foundations', title: 'CONFLUENCES',           tag: 'FOUNDATIONS', body: 'One reason to enter a trade is a guess. Three reasons at the same location is a confluence. Confluences do not guarantee wins — they improve the probability of being right.' },
  { id: 'dn-drawdown',     type: 'foundations', title: 'DRAWDOWN',              tag: 'FOUNDATIONS', body: 'Drawdown is not failure. Every professional strategy has a maximum drawdown. The question is not whether you will have a drawdown — it is whether you planned for it.' },
  { id: 'dn-journal',      type: 'foundations', title: 'JOURNALING',            tag: 'FOUNDATIONS', body: 'A trading journal is not a diary. It is a database. Patterns only become visible when there is enough data to see them. X-Ray builds that database for you automatically.' },
  { id: 'dn-spread',       type: 'foundations', title: 'SPREAD',                tag: 'FOUNDATIONS', body: 'Spread is the guaranteed cost of every trade. On XAUUSD it can be $0.30–$3.00 per pip depending on session and broker. Tight setups with wide spreads are not tight setups.' },
  { id: 'dn-confirm',      type: 'foundations', title: 'CONFIRMATION',          tag: 'FOUNDATIONS', body: 'Entering before confirmation is predicting. Entering after confirmation is reacting. Professionals react. The cost is a slightly worse entry. The benefit is evidence.' },
  { id: 'dn-weekly',       type: 'foundations', title: 'THE WEEKLY RANGE',      tag: 'FOUNDATIONS', body: 'Most weeks, price moves from Monday\'s opening range to sweep liquidity on one side, then reverses to sweep the other side. The weekly narrative is set in the first 24 hours.' },
  { id: 'dn-rr',           type: 'foundations', title: 'RISK TO REWARD',        tag: 'FOUNDATIONS', body: 'A 1:2 risk-to-reward ratio means you can be wrong 60% of the time and still break even. Most traders chase win rate instead of reward ratio. The math favors reward ratio.' },
  { id: 'dn-footprint',    type: 'foundations', title: 'INSTITUTIONAL FOOTPRINT', tag: 'FOUNDATIONS', body: 'Institutions cannot hide their orders. They leave marks: order blocks, fair value gaps, liquidity sweeps. Reading these marks is not prediction — it is forensic analysis.' },
]

// Market condition cards keyed by UTC day-of-week (0=Sun … 6=Sat)
const MARKET_NOTES_BY_DAY: Record<number, DeskNote[]> = {
  0: [ // Sunday
    { id: 'mc-sun-1', type: 'market', title: 'MARKET CONDITIONS', body: 'Sunday open: thin liquidity, wide spreads. Gaps from Friday close are common. Wait for London open before committing to a directional bias.' },
    { id: 'mc-sun-2', type: 'market', title: 'WEEKLY SETUP',      body: 'The first 24 hours of the week set the narrative. Monday\'s opening range is the reference point for the rest of the week\'s liquidity hunt.' },
  ],
  1: [ // Monday
    { id: 'mc-mon-1', type: 'market', title: 'MONDAY OPEN',       body: 'Monday London open: weekly range being set. The first move is often reversed. Wait for confirmation before committing to direction.' },
    { id: 'mc-mon-2', type: 'market', title: 'RANGE FORMATION',   body: 'Price is building its weekly reference this session. Avoid chasing early Monday moves — the range frequently expands in both directions before committing.' },
  ],
  2: [ // Tuesday
    { id: 'mc-tue-1', type: 'market', title: 'MARKET CONDITIONS', body: 'Tuesday tends to produce the weekly high or low. Watch for liquidity sweeps from Monday\'s range. Institutional orders typically hit in the London–NY overlap.' },
    { id: 'mc-tue-2', type: 'market', title: 'KILL ZONE ACTIVE',  body: 'London–NY overlap active between 13:00–16:00 UTC. Peak liquidity window. Best execution conditions of the session.' },
  ],
  3: [ // Wednesday
    { id: 'mc-wed-1', type: 'market', title: 'MID-WEEK PIVOT',    body: 'Wednesday is the most statistically significant reversal day of the week. If price has been trending since Monday, watch for a mid-week reversal setup.' },
    { id: 'mc-wed-2', type: 'market', title: 'MARKET CONDITIONS', body: 'Asian session: range-bound by design. Breakouts during Asian hours are typically swept by London open. Save your risk for the kill zones.' },
  ],
  4: [ // Thursday
    { id: 'mc-thu-1', type: 'market', title: 'THURSDAY TREND',    body: 'Thursday often continues or completes the weekly narrative. If the weekly high/low is already in, Thursday may offer the best continuation setups.' },
    { id: 'mc-thu-2', type: 'market', title: 'MARKET CONDITIONS', body: 'London–NY overlap: peak institutional activity. Orders placed during this window have the tightest spreads and deepest liquidity of the week.' },
  ],
  5: [ // Friday
    { id: 'mc-fri-1', type: 'market', title: 'FRIDAY PROTOCOL',   body: 'Friday NY close: institutional position squaring. Spreads widen. Avoid new entries after 20:00 UTC. Close or reduce open positions before weekend.' },
    { id: 'mc-fri-2', type: 'market', title: 'END OF WEEK',       body: 'Weekly ranges typically complete by Friday\'s NY session. Chasing late Friday moves is trading against profit-taking, not with trend.' },
  ],
  6: [ // Saturday
    { id: 'mc-sat-1', type: 'market', title: 'MARKET CLOSED',     body: 'Retail markets closed. Use this time to journal, review the week\'s trades, and identify what your data shows about your patterns.' },
    { id: 'mc-sat-2', type: 'market', title: 'REVIEW PROTOCOL',   body: 'Weekend review: identify the three best and three worst decisions from this week. Evidence-based improvement requires looking at the record, not feelings.' },
  ],
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Stable daily selection — same picks all day, different each day */
function pickDailyNotes(allNotes: DeskNote[], count: number, dayOfYear: number): DeskNote[] {
  const result: DeskNote[] = []
  const used = new Set<number>()
  for (let i = 0; i < count; i++) {
    const idx = (dayOfYear + i * 7) % allNotes.length
    if (!used.has(idx)) { used.add(idx); result.push(allNotes[idx]) }
  }
  return result
}

function getDayOfYear(d: Date): number {
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0))
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000)
}

function formatToday(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase()
}

// ── Card component ─────────────────────────────────────────────────────────────

const BORDER_COLORS: Record<DeskNote['type'], string> = {
  personal:    GOLD,
  market:      '#3b82f6',  // blue
  foundations: '#10b981',  // green
}

const LABEL_COLORS: Record<DeskNote['type'], string> = {
  personal:    GOLD,
  market:      '#60a5fa',
  foundations: '#34d399',
}

function FeedCard({ note, today }: { note: DeskNote; today: string }) {
  const borderColor = BORDER_COLORS[note.type]
  const labelColor  = LABEL_COLORS[note.type]

  return (
    <div style={{
      background:   BG_BASE,
      borderTop:    `1px solid ${BORDER}`,
      borderRight:  `1px solid ${BORDER}`,
      borderBottom: `1px solid ${BORDER}`,
      borderLeft:   `3px solid ${borderColor}`,
      borderRadius: '0 6px 6px 0',
      padding: '12px 14px',
      flexShrink: 0,
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: MONO, fontSize: 9, fontWeight: 700,
          color: labelColor, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          DESK NOTE — {note.title}
        </span>
        {note.tag === 'FOUNDATIONS' && (
          <span style={{
            fontFamily: MONO, fontSize: 8,
            color: GOLD, border: `1px solid rgba(229,184,60,0.4)`,
            borderRadius: 3, padding: '1px 6px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            FOUNDATIONS
          </span>
        )}
        <span style={{
          marginLeft: 'auto',
          fontFamily: MONO, fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}>
          {today}
        </span>
      </div>

      {/* Body */}
      <p style={{
        fontFamily: MONO, fontSize: 12, color: '#94a3b8',
        lineHeight: 1.65, margin: 0,
      }}>
        {note.body}
      </p>
    </div>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface DeskNoteFeedProps {
  analyses: any[]
  complianceData?: { latest: any; previous: any } | null
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function DeskNoteFeed({ analyses, complianceData }: DeskNoteFeedProps) {
  const now        = new Date()
  const dayOfYear  = getDayOfYear(now)
  const dayOfWeek  = now.getUTCDay()
  const today      = formatToday(now)

  const feed = useMemo(() => {
    const cards: DeskNote[] = []

    // ── PERSONAL INTEL (gold border) ─────────────────────────────────────────
    // Only shown if analyses exist
    if (analyses.length > 0) {
      const latest = analyses[0]

      // Revenge trades insight
      const revengeCount = complianceData?.latest?.revenge_count ?? null
      if (revengeCount != null && revengeCount > 0) {
        cards.push({
          id: 'pi-revenge',
          type: 'personal',
          title: 'PATTERN DETECTED',
          body: `${revengeCount} revenge re-entries detected in your history. Same emotional trigger. Same degraded setup quality. ${revengeCount} data points confirming a single leak.`,
        })
      }

      // Session timing insight
      const rawSessionData: Record<string, any> | null =
        complianceData?.latest?.session_stats     ??
        complianceData?.latest?.sessions          ??
        complianceData?.latest?.session_breakdown ??
        null

      if (rawSessionData) {
        const entries = Object.entries(rawSessionData)
        if (entries.length >= 2) {
          const sorted = entries
            .map(([name, s]) => {
              const raw = (s as any)?.win_rate ?? (s as any)?.winRate ?? 0
              return { name, winRate: raw > 1 ? raw : raw * 100 }
            })
            .sort((a, b) => b.winRate - a.winRate)

          const best  = sorted[0]
          const worst = sorted[sorted.length - 1]

          if (best && worst && best.name !== worst.name) {
            cards.push({
              id: 'pi-session',
              type: 'personal',
              title: 'SESSION INTELLIGENCE',
              body: `You are ${(best.winRate / Math.max(worst.winRate, 1)).toFixed(1)}x more effective in the ${best.name.toUpperCase()} session than ${worst.name.toUpperCase()}. Your last ${latest.total_trades ?? '—'} trades confirm it.`,
            })
          }
        }
      }

      // No-SL insight
      const noSlCount = complianceData?.latest?.no_sl_count ?? null
      if (noSlCount != null && noSlCount > 0) {
        cards.push({
          id: 'pi-nosl',
          type: 'personal',
          title: 'RISK EXPOSURE',
          body: `${noSlCount} trades in your history were executed without a stop loss. Each one had undefined maximum loss. This is not a style choice — it is an unquantified liability.`,
        })
      }
    }

    // ── MARKET CONDITIONS (blue border) ──────────────────────────────────────
    const marketNotes = MARKET_NOTES_BY_DAY[dayOfWeek] ?? []
    cards.push(...marketNotes)

    // ── DESK NOTES / FOUNDATIONS (green border) ───────────────────────────────
    const picked = pickDailyNotes(DESK_NOTES, 3, dayOfYear)
    cards.push(...picked)

    return cards
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyses.length, complianceData, dayOfYear, dayOfWeek])

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 14,
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 10, color: GOLD,
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          INTEL FEED
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {feed.length} ENTRIES — {today}
        </span>
      </div>

      {/* Scrollable feed */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxHeight: 400,
        overflowY: 'auto',
        paddingRight: 4,
        // Custom scrollbar
        scrollbarWidth: 'thin',
        scrollbarColor: '#1e293b transparent',
      }}>
        {feed.length === 0 ? (
          <div style={{
            background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 6,
            padding: '24px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              INTEL FEED LOADING...
            </p>
          </div>
        ) : (
          feed.map(note => (
            <FeedCard key={note.id} note={note} today={today} />
          ))
        )}
      </div>
    </div>
  )
}
