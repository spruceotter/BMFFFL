import Head from 'next/head';
import { BarChart2, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type PositionKey = 'QB' | 'RB' | 'WR' | 'TE';

interface TeamRow {
  id: string;
  owner: string;
  isChampion?: boolean;
  scores: Record<PositionKey, number>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSITIONS: PositionKey[] = ['QB', 'RB', 'WR', 'TE'];

const TEAMS: TeamRow[] = [
  { id: 'mlschools12',     owner: 'MLSchools12',     scores: { QB: 5, RB: 4, WR: 5, TE: 3 } },
  { id: 'tubes94',         owner: 'Tubes94',          scores: { QB: 4, RB: 5, WR: 4, TE: 4 } },
  { id: 'sexmachineandyd', owner: 'SexMachineAndyD',  scores: { QB: 4, RB: 3, WR: 5, TE: 3 } },
  { id: 'juicybussy',      owner: 'JuicyBussy',       scores: { QB: 3, RB: 5, WR: 4, TE: 2 } },
  { id: 'rbr',             owner: 'rbr',              scores: { QB: 4, RB: 4, WR: 4, TE: 3 } },
  { id: 'tdtd19844',       owner: 'tdtd19844',        isChampion: true, scores: { QB: 3, RB: 4, WR: 4, TE: 3 } },
  { id: 'eldridsm',        owner: 'eldridsm',         scores: { QB: 3, RB: 3, WR: 4, TE: 3 } },
  { id: 'eldridm20',       owner: 'eldridm20',        scores: { QB: 4, RB: 3, WR: 3, TE: 4 } },
  { id: 'cmaleski',        owner: 'Cmaleski',         scores: { QB: 3, RB: 3, WR: 5, TE: 2 } },
  { id: 'grandes',         owner: 'Grandes',          scores: { QB: 2, RB: 3, WR: 3, TE: 3 } },
  { id: 'cogdeill11',      owner: 'Cogdeill11',       scores: { QB: 3, RB: 2, WR: 3, TE: 2 } },
  { id: 'escuelas',        owner: 'Escuelas',         scores: { QB: 2, RB: 2, WR: 2, TE: 2 } },
];

// ─── League scarcity: 5 = very high scarcity, 1 = low scarcity ───────────────

const SCARCITY_LEVEL: Record<PositionKey, { level: number; label: string; description: string }> = {
  QB: { level: 3, label: 'Moderate', description: '4 teams have QB1s — 8 have QB2s or worse' },
  RB: { level: 4, label: 'High', description: 'Only 3 teams have true RB1s — most thin at RB2' },
  WR: { level: 2, label: 'Lower', description: 'More WR depth distributed across the league' },
  TE: { level: 5, label: 'Very High', description: 'Only 2 teams have true TE1s — overwhelming TE2 market' },
};

// ─── Trade market signals ─────────────────────────────────────────────────────

interface TradeSignal {
  position: PositionKey;
  sellers: { owner: string; note: string }[];
  buyers: { owner: string; note: string }[];
}

const TRADE_SIGNALS: TradeSignal[] = [
  {
    position: 'WR',
    sellers: [
      { owner: 'Cmaleski',       note: 'WR5 dominant, RB only adequate' },
      { owner: 'SexMachineAndyD', note: 'WR5 elite room, TE thin' },
    ],
    buyers: [
      { owner: 'Escuelas',   note: 'WR2 — critical need' },
      { owner: 'Cogdeill11', note: 'WR3 — below average' },
      { owner: 'Grandes',    note: 'WR3 — needs upgrade' },
    ],
  },
  {
    position: 'RB',
    sellers: [
      { owner: 'Tubes94',    note: 'RB5 — best backfield in league' },
      { owner: 'JuicyBussy', note: 'RB5 — deep and young' },
    ],
    buyers: [
      { owner: 'SexMachineAndyD', note: 'RB3 — clear weakness' },
      { owner: 'eldridm20',       note: 'RB3 — aging room' },
      { owner: 'Cmaleski',        note: 'RB3 — needs volume back' },
      { owner: 'Escuelas',        note: 'RB2 — near barren' },
    ],
  },
  {
    position: 'TE',
    sellers: [
      { owner: 'Tubes94',   note: 'TE4 — elite and deep at position' },
      { owner: 'eldridm20', note: 'TE4 — has surplus TE value' },
    ],
    buyers: [
      { owner: 'JuicyBussy', note: 'TE2 — glaring hole' },
      { owner: 'Cmaleski',   note: 'TE2 — no starter' },
      { owner: 'Cogdeill11', note: 'TE2 — barren at TE' },
      { owner: 'Escuelas',   note: 'TE2 — needs everything' },
    ],
  },
  {
    position: 'QB',
    sellers: [
      { owner: 'MLSchools12', note: 'QB5 — could deal depth' },
    ],
    buyers: [
      { owner: 'Grandes',  note: 'QB2 — needs franchise anchor' },
      { owner: 'Escuelas', note: 'QB2 — critical rebuild need' },
    ],
  },
];

// ─── Cell color helpers ───────────────────────────────────────────────────────

function cellColor(score: number): string {
  switch (score) {
    case 5: return 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/40';
    case 4: return 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/35';
    case 3: return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/35';
    case 2: return 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/35';
    case 1: return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/35';
    default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

function cellBg(score: number): string {
  switch (score) {
    case 5: return 'bg-[#ffd700]/10';
    case 4: return 'bg-[#4ade80]/8';
    case 3: return 'bg-[#f59e0b]/8';
    case 2: return 'bg-[#f97316]/8';
    case 1: return 'bg-[#ef4444]/8';
    default: return '';
  }
}

function scoreLabel(score: number): string {
  switch (score) {
    case 5: return 'Dominant';
    case 4: return 'Strong';
    case 3: return 'Adequate';
    case 2: return 'Weak';
    case 1: return 'Barren';
    default: return '—';
  }
}

function scarcityColor(level: number): string {
  switch (level) {
    case 5: return 'text-[#ef4444]';
    case 4: return 'text-[#f97316]';
    case 3: return 'text-[#f59e0b]';
    case 2: return 'text-[#4ade80]';
    case 1: return 'text-slate-400';
    default: return 'text-slate-400';
  }
}

function scarcityBg(level: number): string {
  switch (level) {
    case 5: return 'bg-[#ef4444]/15 border-[#ef4444]/30 text-[#ef4444]';
    case 4: return 'bg-[#f97316]/15 border-[#f97316]/30 text-[#f97316]';
    case 3: return 'bg-[#f59e0b]/15 border-[#f59e0b]/30 text-[#f59e0b]';
    case 2: return 'bg-[#4ade80]/15 border-[#4ade80]/30 text-[#4ade80]';
    case 1: return 'bg-slate-500/15 border-slate-500/30 text-slate-400';
    default: return 'bg-slate-500/15 border-slate-500/30 text-slate-400';
  }
}

const POS_ACCENT: Record<PositionKey, string> = {
  QB: 'text-red-400 border-red-500/30 bg-red-500/10',
  RB: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  WR: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  TE: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
};

// ─── Computed column averages ─────────────────────────────────────────────────

function colAverage(pos: PositionKey): string {
  const total = TEAMS.reduce((sum, t) => sum + t.scores[pos], 0);
  return (total / TEAMS.length).toFixed(1);
}

function rowTotal(team: TeamRow): number {
  return POSITIONS.reduce((sum, p) => sum + team.scores[p], 0);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeatCell({ score }: { score: number }) {
  return (
    <td className={cn('px-2 py-0 text-center', cellBg(score))}>
      <div className={cn(
        'inline-flex items-center justify-center w-12 h-10 rounded-lg border text-sm font-black tabular-nums mx-auto',
        cellColor(score)
      )}>
        {score}
      </div>
    </td>
  );
}

function ScarcityBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Scarcity level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={cn(
            'h-2 w-5 rounded-sm transition-colors',
            i <= level ? scarcityColor(level).replace('text-', 'bg-') : 'bg-slate-700'
          )}
        />
      ))}
    </div>
  );
}

function TradeCard({ signal }: { signal: TradeSignal }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2d4a66] bg-[#0f2744]">
        <span className={cn(
          'inline-flex items-center justify-center px-2 py-0.5 rounded border text-xs font-black w-10',
          POS_ACCENT[signal.position]
        )}>
          {signal.position}
        </span>
        <span className="text-sm font-bold text-white">Trade Market</span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-[#1e3347]">
        {/* Sellers */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Sellers</span>
          </div>
          <ul className="space-y-2">
            {signal.sellers.map((s) => (
              <li key={s.owner}>
                <p className="text-xs font-bold text-white leading-tight">{s.owner}</p>
                <p className="text-[10px] text-slate-500 leading-snug">{s.note}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Buyers */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Buyers</span>
          </div>
          <ul className="space-y-2">
            {signal.buyers.map((b) => (
              <li key={b.owner}>
                <p className="text-xs font-bold text-white leading-tight">{b.owner}</p>
                <p className="text-[10px] text-slate-500 leading-snug">{b.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScarcityHeatmapPage() {
  return (
    <>
      <Head>
        <title>Positional Scarcity Heatmap — BMFFFL Analytics</title>
        <meta
          name="description"
          content="League-wide positional scarcity heatmap for all 12 BMFFFL dynasty rosters. Identify trade targets and market inefficiencies — March 2026 offseason."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Positional Scarcity Heatmap
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            League-wide roster strength by position &mdash; March 2026 offseason
          </p>
        </header>

        {/* Heatmap table */}
        <section className="mb-10" aria-label="Positional scarcity heatmap">
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Roster strength heatmap by team and position">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[160px]">
                      Team
                    </th>
                    {POSITIONS.map(pos => (
                      <th key={pos} scope="col" className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[80px]">
                        <span className={cn('inline-flex items-center justify-center px-2 py-0.5 rounded border w-10', POS_ACCENT[pos])}>
                          {pos}
                        </span>
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[72px]">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {TEAMS.map((team, idx) => (
                    <tr
                      key={team.id}
                      className={cn(
                        'border-b border-[#1e3347] transition-colors duration-100',
                        idx % 2 === 0 ? 'bg-[#0d1b2a]' : 'bg-[#111f30]',
                        'hover:bg-[#1f3550]'
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white leading-tight">{team.owner}</span>
                          {team.isChampion && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#ffd700]/40 bg-[#ffd700]/10 text-[#ffd700] text-[9px] font-black uppercase tracking-wider"
                              title="Reigning champion"
                            >
                              CHAMP
                            </span>
                          )}
                        </div>
                      </td>
                      {POSITIONS.map(pos => (
                        <HeatCell key={pos} score={team.scores[pos]} />
                      ))}
                      <td className="px-3 py-3 text-center">
                        <span className={cn(
                          'text-sm font-black tabular-nums',
                          rowTotal(team) >= 17 ? 'text-[#ffd700]' :
                          rowTotal(team) >= 14 ? 'text-[#4ade80]' :
                          rowTotal(team) >= 11 ? 'text-[#f59e0b]' :
                          'text-[#f97316]'
                        )}>
                          {rowTotal(team)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Averages footer */}
                <tfoot>
                  <tr className="bg-[#0f2744] border-t-2 border-[#2d4a66]">
                    <td className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      League Avg
                    </td>
                    {POSITIONS.map(pos => (
                      <td key={pos} className="px-2 py-3 text-center">
                        <span className="text-sm font-black tabular-nums text-slate-300">
                          {colAverage(pos)}
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center">
                      <Minus className="w-3.5 h-3.5 text-slate-600 mx-auto" aria-hidden="true" />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Score legend */}
          <div className="mt-3 flex flex-wrap items-center gap-3" aria-label="Score legend">
            {[5, 4, 3, 2, 1].map(score => (
              <div key={score} className="flex items-center gap-1.5">
                <div className={cn(
                  'w-6 h-5 rounded border text-[10px] font-black flex items-center justify-center',
                  cellColor(score)
                )}>
                  {score}
                </div>
                <span className="text-[11px] text-slate-500">{scoreLabel(score)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* League scarcity summary */}
        <section className="mb-10" aria-label="League-wide positional scarcity">
          <h2 className="text-lg font-black text-white mb-4">League Scarcity Index</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POSITIONS.map(pos => {
              const s = SCARCITY_LEVEL[pos];
              return (
                <div key={pos} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn('inline-flex items-center justify-center px-2 py-0.5 rounded border text-xs font-black w-10', POS_ACCENT[pos])}>
                      {pos}
                    </span>
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider', scarcityBg(s.level))}>
                      {s.label}
                    </span>
                  </div>
                  <ScarcityBar level={s.level} />
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Scarcity level measures how rare elite talent is at each position across the 12-team league. Higher scarcity = greater trade leverage for owners who hold that position.
          </p>
        </section>

        {/* Trade market signals */}
        <section className="mb-10" aria-label="Trade market signals">
          <h2 className="text-lg font-black text-white mb-1">Trade Market Signals</h2>
          <p className="text-sm text-slate-400 mb-4">
            Teams with surplus at a position that could be paired with teams that have a deficit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {TRADE_SIGNALS.map(signal => (
              <TradeCard key={signal.position} signal={signal} />
            ))}
          </div>
        </section>

        {/* Bimfle note */}
        <section
          className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's note"
        >
          <p className="text-xs text-[#ffd700]/60 uppercase tracking-widest font-semibold mb-2">A Note from Bimfle</p>
          <p className="text-sm text-slate-300 leading-relaxed italic">
            &ldquo;The positional scarcity map reveals the invisible architecture of the trade market.
            Those who possess what others desperately need hold considerable leverage.
            Tight end, this season, is a seller&rsquo;s market.&rdquo;
          </p>
          <p className="mt-2 text-xs text-[#ffd700]/50 font-semibold">&mdash; Love, Bimfle</p>
        </section>

      </div>
    </>
  );
}
