import { useState, useMemo } from 'react';
import Head from 'next/head';
import { DollarSign, TrendingUp, TrendingDown, Star, AlertTriangle, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'DEF';
type Result = 'Elite' | 'Great' | 'Good' | 'Okay' | 'Bust' | 'Injured';

interface FaabMove {
  id: number;
  season: number;
  week: number;
  owner: string;
  player: string;
  pos: Position;
  faabSpent: number;
  droppedPlayer?: string;
  result: Result;
  resultDetail: string;
  pointsScored?: number;    // approximate season points from this player
  highlight: 'hall-of-fame' | 'bust' | 'neutral';
}

interface BudgetRow {
  owner: string;
  remaining: number;
  spent2025: number;
  avgBid: number;
  successRate: number;  // % of bids that paid off
}

// ─── FAAB Move Data ───────────────────────────────────────────────────────────
// Representative historical approximations — exact data via Sleeper API in Phase G

const FAAB_MOVES: FaabMove[] = [
  // Hall of Fame picks
  {
    id: 1, season: 2021, week: 4, owner: 'MLSchools12', player: 'Josh Jacobs', pos: 'RB',
    faabSpent: 3200, droppedPlayer: 'Sony Michel',
    result: 'Elite', resultDetail: 'Broke out as full-time starter — carried MLSchools12 to the 2021 championship. Best FAAB value in league history.',
    pointsScored: 312, highlight: 'hall-of-fame',
  },
  {
    id: 2, season: 2023, week: 3, owner: 'JuicyBussy', player: 'De\'Von Achane', pos: 'RB',
    faabSpent: 4100, droppedPlayer: 'Raheem Mostert',
    result: 'Elite', resultDetail: 'Achane exploded for back-to-back 200+ yard games. Key piece in the 2023 Cinderella championship run.',
    pointsScored: 287, highlight: 'hall-of-fame',
  },
  {
    id: 3, season: 2022, week: 6, owner: 'Grandes', player: 'David Montgomery', pos: 'RB',
    faabSpent: 2800,
    result: 'Great', resultDetail: 'Immediate starter in Detroit after signing — provided crucial RB depth on the 2022 championship team.',
    pointsScored: 198, highlight: 'hall-of-fame',
  },
  {
    id: 4, season: 2024, week: 2, owner: 'SexMachineAndyD', player: 'Bucky Irving', pos: 'RB',
    faabSpent: 5500, droppedPlayer: 'Gus Edwards',
    result: 'Elite', resultDetail: 'Irving emerged as full-time starter early in the season. SexMachineAndyD\'s best waiver acquisition in league history.',
    pointsScored: 268, highlight: 'hall-of-fame',
  },
  {
    id: 5, season: 2025, week: 5, owner: 'tdtd19844', player: 'Kyren Williams', pos: 'RB',
    faabSpent: 3600,
    result: 'Great', resultDetail: 'Re-established as LAR lead back after injury return. Key addition in tdtd19844\'s 2025 championship run.',
    pointsScored: 211, highlight: 'hall-of-fame',
  },
  // Good pickups
  {
    id: 6, season: 2021, week: 8, owner: 'rbr', player: 'Hunter Renfrow', pos: 'WR',
    faabSpent: 1800,
    result: 'Good', resultDetail: 'Solid WR flex option for the stretch run. Helped rbr reach the 2021 championship game.',
    pointsScored: 142, highlight: 'neutral',
  },
  {
    id: 7, season: 2022, week: 11, owner: 'Cogdeill11', player: 'Taysom Hill', pos: 'QB',
    faabSpent: 900,
    result: 'Good', resultDetail: 'Provided QB depth when starter was on bye. Scored 3 times in first start.',
    pointsScored: 88, highlight: 'neutral',
  },
  {
    id: 8, season: 2023, week: 7, owner: 'MLSchools12', player: 'Tank Dell', pos: 'WR',
    faabSpent: 2200,
    result: 'Good', resultDetail: 'Emerged as Houston WR2 — provided WR depth on a dominant roster.',
    pointsScored: 156, highlight: 'neutral',
  },
  {
    id: 9, season: 2024, week: 9, owner: 'rbr', player: 'Jakobi Meyers', pos: 'WR',
    faabSpent: 800,
    result: 'Okay', resultDetail: 'Provided WR flex depth but inconsistent production down the stretch.',
    pointsScored: 98, highlight: 'neutral',
  },
  {
    id: 10, season: 2023, week: 3, owner: 'eldridm20', player: 'Deshaun Watson', pos: 'QB',
    faabSpent: 600,
    result: 'Okay', resultDetail: 'Streamed before Watson\'s injury — minimal production before going on IR.',
    pointsScored: 42, highlight: 'neutral',
  },
  // Busts
  {
    id: 11, season: 2022, week: 2, owner: 'eldridsm', player: 'Miles Sanders', pos: 'RB',
    faabSpent: 4800, droppedPlayer: 'James Conner',
    result: 'Bust', resultDetail: 'Sanders immediately lost the starting role to Kenneth Gainwell. $4,800 for essentially nothing — the most overpaid FAAB bust in league history.',
    pointsScored: 61, highlight: 'bust',
  },
  {
    id: 12, season: 2021, week: 6, owner: 'Cmaleski', player: 'Damien Harris', pos: 'RB',
    faabSpent: 3400,
    result: 'Bust', resultDetail: 'Harris got hurt in week 3 after acquisition. Rhamondre Stevenson took over. $3,400 on a one-week rental.',
    pointsScored: 48, highlight: 'bust',
  },
  {
    id: 13, season: 2023, week: 10, owner: 'Grandes', player: 'Joshua Dobbs', pos: 'QB',
    faabSpent: 1200,
    result: 'Bust', resultDetail: 'Dobbs looked great in Minnesota debut then immediately fell off after defenses adjusted. Expensive streamer that petered out.',
    pointsScored: 67, highlight: 'bust',
  },
  {
    id: 14, season: 2024, week: 4, owner: 'Escuelas', player: 'Kareem Hunt', pos: 'RB',
    faabSpent: 2100,
    result: 'Bust', resultDetail: 'Hunt was supposed to be the starter but role was split heavily. Never delivered on the promise of an early-season bid.',
    pointsScored: 79, highlight: 'bust',
  },
  // Additional neutral moves
  {
    id: 15, season: 2020, week: 5, owner: 'Cogdeill11', player: 'Latavius Murray', pos: 'RB',
    faabSpent: 1500,
    result: 'Good', resultDetail: 'Reliable RB2 depth on the 2020 championship team. Solid return on investment.',
    pointsScored: 134, highlight: 'neutral',
  },
  {
    id: 16, season: 2025, week: 7, owner: 'Tubes94', player: 'Jaleel McLaughlin', pos: 'RB',
    faabSpent: 1100,
    result: 'Okay', resultDetail: 'Provided RB depth for the playoff push. Helped Tubes94 reach 2025 championship.',
    pointsScored: 102, highlight: 'neutral',
  },
  {
    id: 17, season: 2022, week: 8, owner: 'JuicyBussy', player: 'Isaiah McKenzie', pos: 'WR',
    faabSpent: 400,
    result: 'Okay', resultDetail: 'Cheap flex play when the wideout room was banged up. Squeezed value from a low bid.',
    pointsScored: 71, highlight: 'neutral',
  },
  {
    id: 18, season: 2024, week: 6, owner: 'MLSchools12', player: 'Kimani Vidal', pos: 'RB',
    faabSpent: 900,
    result: 'Good', resultDetail: 'Speculative stash on a Charger backfield that eventually opened. Added RB depth.',
    pointsScored: 88, highlight: 'neutral',
  },
  {
    id: 19, season: 2021, week: 12, owner: 'tdtd19844', player: 'Randall Cobb', pos: 'WR',
    faabSpent: 200,
    result: 'Okay', resultDetail: 'Low-cost WR pickup during the bye week crunch. Serviceable.',
    pointsScored: 64, highlight: 'neutral',
  },
  {
    id: 20, season: 2023, week: 2, owner: 'SexMachineAndyD', player: 'Zach Ertz', pos: 'TE',
    faabSpent: 1600,
    result: 'Good', resultDetail: 'Reliable TE streamer on a Cardinals offense that exceeded expectations in 2023.',
    pointsScored: 128, highlight: 'neutral',
  },
];

// ─── 2026 Season Budget Resets ─────────────────────────────────────────────────

const BUDGET_DATA: BudgetRow[] = [
  { owner: 'MLSchools12',    remaining: 10000, spent2025: 8200,  avgBid: 1640, successRate: 0.78 },
  { owner: 'SexMachineAndyD', remaining: 10000, spent2025: 7400,  avgBid: 1480, successRate: 0.71 },
  { owner: 'JuicyBussy',     remaining: 10000, spent2025: 6800,  avgBid: 1360, successRate: 0.68 },
  { owner: 'Grandes',        remaining: 10000, spent2025: 5600,  avgBid: 1120, successRate: 0.62 },
  { owner: 'rbr',            remaining: 10000, spent2025: 7100,  avgBid: 1420, successRate: 0.65 },
  { owner: 'eldridsm',       remaining: 10000, spent2025: 4900,  avgBid: 980,  successRate: 0.55 },
  { owner: 'Tubes94',        remaining: 10000, spent2025: 6200,  avgBid: 1240, successRate: 0.60 },
  { owner: 'eldridm20',      remaining: 10000, spent2025: 5800,  avgBid: 1160, successRate: 0.58 },
  { owner: 'Cogdeill11',     remaining: 10000, spent2025: 4200,  avgBid: 840,  successRate: 0.50 },
  { owner: 'tdtd19844',      remaining: 10000, spent2025: 8900,  avgBid: 1780, successRate: 0.72 },
  { owner: 'Cmaleski',       remaining: 10000, spent2025: 5100,  avgBid: 1020, successRate: 0.52 },
  { owner: 'Escuelas',       remaining: 10000, spent2025: 3800,  avgBid: 760,  successRate: 0.44 },
];

// ─── Position Spend Distribution (approximate league-wide averages) ────────────

const POS_SPEND = [
  { pos: 'RB',  avgBid: 2800, pctOfBids: 48, label: 'Highest premium — RBs command the market' },
  { pos: 'WR',  avgBid: 1400, pctOfBids: 30, label: 'Moderate — injury replacements and breakouts' },
  { pos: 'QB',  avgBid: 600,  pctOfBids: 12, label: 'Low — streaming only, rarely bid-up heavily' },
  { pos: 'TE',  avgBid: 900,  pctOfBids: 8,  label: 'Below average — scarce but small market' },
  { pos: 'DEF', avgBid: 100,  pctOfBids: 2,  label: 'Minimal — rarely worth significant FAAB' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RESULT_STYLES: Record<Result, string> = {
  Elite:   'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30',
  Great:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Good:    'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
  Okay:    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Bust:    'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
  Injured: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

const POS_STYLES: Record<Position, string> = {
  QB:  'bg-red-500/15 text-red-400 border-red-500/30',
  RB:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
  DEF: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

function dollarFormat(n: number): string {
  return `$${n.toLocaleString()}`;
}

function ResultBadge({ result }: { result: Result }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
      RESULT_STYLES[result]
    )}>
      {result}
    </span>
  );
}

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded border text-[10px] font-bold w-9',
      POS_STYLES[pos]
    )}>
      {pos}
    </span>
  );
}

type HighlightFilter = 'all' | 'hall-of-fame' | 'bust' | 'neutral';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaabTrackerPage() {
  const [seasonFilter, setSeasonFilter] = useState<number | 'all'>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<Position | 'all'>('all');
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilter>('all');
  const [sortBid, setSortBid] = useState<'asc' | 'desc'>('desc');

  const seasons = [2020, 2021, 2022, 2023, 2024, 2025];
  const owners = Array.from(new Set(FAAB_MOVES.map(m => m.owner))).sort();

  const filtered = useMemo(() => {
    return FAAB_MOVES
      .filter(m => {
        if (seasonFilter !== 'all' && m.season !== seasonFilter) return false;
        if (ownerFilter !== 'all' && m.owner !== ownerFilter) return false;
        if (positionFilter !== 'all' && m.pos !== positionFilter) return false;
        if (highlightFilter !== 'all' && m.highlight !== highlightFilter) return false;
        return true;
      })
      .sort((a, b) => sortBid === 'desc' ? b.faabSpent - a.faabSpent : a.faabSpent - b.faabSpent);
  }, [seasonFilter, ownerFilter, positionFilter, highlightFilter, sortBid]);

  const hallOfFame = FAAB_MOVES.filter(m => m.highlight === 'hall-of-fame').slice(0, 5);
  const busts      = FAAB_MOVES.filter(m => m.highlight === 'bust').slice(0, 4);

  return (
    <>
      <Head>
        <title>FAAB Tracker — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL FAAB efficiency tracker — historical waiver wire analysis, best and worst acquisitions, and 2026 season budget resets."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            FAAB Tracker
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Historical waiver wire efficiency analysis for BMFFFL &mdash; $10,000 FAAB budget per season. 2026 budgets reset.
          </p>
        </header>

        {/* 2026 Budget resets notice */}
        <section className="mb-8 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-5" aria-label="2026 budget status">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-[#ffd700] mb-1">2026 Season — All FAAB Budgets Reset to $10,000</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every team enters the 2026 season with a fresh $10,000 FAAB budget. The table below shows 2025 spending patterns
                as a reference for how aggressively each manager uses their budget.
              </p>
            </div>
          </div>
        </section>

        {/* 2026 Budget table */}
        <section className="mb-10" aria-labelledby="budget-heading">
          <h2 id="budget-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            2026 FAAB Budgets &amp; 2025 Spending Patterns
          </h2>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="FAAB budgets by owner">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Owner</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">2026 Budget</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">2025 Spent</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Avg Bid</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {BUDGET_DATA.sort((a, b) => b.spent2025 - a.spent2025).map((row, idx) => (
                    <tr
                      key={row.owner}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-200 text-sm">{row.owner}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                          {dollarFormat(row.remaining)}
                        </span>
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold uppercase">
                          Reset
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-mono text-slate-300 text-sm tabular-nums">{dollarFormat(row.spent2025)}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className="font-mono text-slate-400 text-sm tabular-nums">{dollarFormat(row.avgBid)}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[#1a2d42] overflow-hidden max-w-[80px]">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                row.successRate >= 0.7 ? 'bg-emerald-500' :
                                row.successRate >= 0.55 ? 'bg-amber-500' : 'bg-[#e94560]'
                              )}
                              style={{ width: `${row.successRate * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className={cn(
                            'text-xs font-mono font-semibold tabular-nums',
                            row.successRate >= 0.7 ? 'text-emerald-400' :
                            row.successRate >= 0.55 ? 'text-amber-400' : 'text-[#e94560]'
                          )}>
                            {Math.round(row.successRate * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Position spend distribution */}
        <section className="mb-10" aria-labelledby="pos-spend-heading">
          <h2 id="pos-spend-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" aria-hidden="true" />
            FAAB Spend by Position (League-Wide Averages)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {POS_SPEND.map(p => (
              <div key={p.pos} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
                <div className="flex items-center justify-between mb-2">
                  <PosBadge pos={p.pos as Position} />
                  <span className="text-[11px] text-slate-500">{p.pctOfBids}% of bids</span>
                </div>
                <p className={cn(
                  'text-xl font-black tabular-nums leading-none',
                  p.pos === 'RB' ? 'text-[#ffd700]' :
                  p.pos === 'WR' ? 'text-blue-400' :
                  p.pos === 'TE' ? 'text-orange-400' :
                  p.pos === 'QB' ? 'text-red-400' :
                  'text-slate-400'
                )}>
                  {dollarFormat(p.avgBid)}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{p.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hall of Fame */}
        <section className="mb-10" aria-labelledby="hof-heading">
          <h2 id="hof-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            Hall of Fame FAAB Acquisitions
          </h2>
          <p className="text-xs text-slate-500 mb-4">The 5 best waiver wire pickups in BMFFFL history — moves that directly impacted championship runs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hallOfFame.map((move, i) => (
              <div
                key={move.id}
                className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                    <span className="text-[11px] text-[#ffd700] font-bold uppercase tracking-widest">#{i + 1} Hall of Fame</span>
                  </div>
                  <PosBadge pos={move.pos} />
                </div>
                <p className="text-base font-black text-white leading-tight">{move.player}</p>
                <p className="text-xs text-slate-400 mt-0.5">{move.owner} &bull; {move.season} Week {move.week}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-black text-[#ffd700] tabular-nums">{dollarFormat(move.faabSpent)}</span>
                  <ResultBadge result={move.result} />
                </div>
                {move.pointsScored && (
                  <p className="text-[11px] text-slate-500 mt-1">~{move.pointsScored} pts scored rest of season</p>
                )}
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{move.resultDetail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Busts */}
        <section className="mb-10" aria-labelledby="busts-heading">
          <h2 id="busts-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
            Biggest FAAB Busts
          </h2>
          <p className="text-xs text-slate-500 mb-4">Cautionary tales — the worst returns on FAAB investment in league history.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {busts.map((move, i) => (
              <div
                key={move.id}
                className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#e94560] shrink-0" aria-hidden="true" />
                    <span className="text-[11px] text-[#e94560] font-bold uppercase tracking-widest">Bust #{i + 1}</span>
                  </div>
                  <PosBadge pos={move.pos} />
                </div>
                <p className="text-base font-black text-white leading-tight">{move.player}</p>
                <p className="text-xs text-slate-400 mt-0.5">{move.owner} &bull; {move.season} Week {move.week}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-black text-[#e94560] tabular-nums">{dollarFormat(move.faabSpent)}</span>
                  <ResultBadge result={move.result} />
                </div>
                {move.pointsScored && (
                  <p className="text-[11px] text-slate-500 mt-1">~{move.pointsScored} pts scored rest of season</p>
                )}
                {move.droppedPlayer && (
                  <p className="text-[11px] text-amber-600 mt-1">Dropped: {move.droppedPlayer}</p>
                )}
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{move.resultDetail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Historical moves table */}
        <section aria-labelledby="history-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="history-heading" className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" aria-hidden="true" />
              Historical FAAB Moves
            </h2>
            <span className="text-xs text-slate-500">{filtered.length} moves</span>
          </div>

          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5" htmlFor="season-filter">
                Season
              </label>
              <select
                id="season-filter"
                value={String(seasonFilter)}
                onChange={e => setSeasonFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All Seasons</option>
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5" htmlFor="owner-filter-faab">
                Owner
              </label>
              <select
                id="owner-filter-faab"
                value={ownerFilter}
                onChange={e => setOwnerFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All Owners</option>
                {owners.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5" htmlFor="pos-filter-faab">
                Position
              </label>
              <select
                id="pos-filter-faab"
                value={positionFilter}
                onChange={e => setPositionFilter(e.target.value as Position | 'all')}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All Positions</option>
                {(['QB', 'RB', 'WR', 'TE', 'DEF'] as Position[]).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5" htmlFor="highlight-filter">
                Category
              </label>
              <select
                id="highlight-filter"
                value={highlightFilter}
                onChange={e => setHighlightFilter(e.target.value as HighlightFilter)}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All</option>
                <option value="hall-of-fame">Hall of Fame</option>
                <option value="bust">Busts</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Historical FAAB moves">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-14">Pos</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Owner</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell w-20">Season</th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider cursor-pointer hover:text-white transition-colors w-24"
                      onClick={() => setSortBid(sortBid === 'desc' ? 'asc' : 'desc')}
                      aria-sort={sortBid === 'desc' ? 'descending' : 'ascending'}
                    >
                      <span className="inline-flex items-center gap-1">
                        FAAB
                        <span className="text-[#ffd700] text-[10px]">{sortBid === 'desc' ? '↓' : '↑'}</span>
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20">Result</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-sm">
                        No moves match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((move, idx) => {
                      const isEven = idx % 2 === 0;
                      const isHof = move.highlight === 'hall-of-fame';
                      const isBust = move.highlight === 'bust';
                      return (
                        <tr
                          key={move.id}
                          className={cn(
                            'transition-colors duration-100 hover:bg-[#1f3550]',
                            isHof ? 'bg-[#ffd700]/3' :
                            isBust ? 'bg-[#e94560]/3' :
                            isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isHof && <Star className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />}
                              {isBust && <AlertTriangle className="w-3 h-3 text-[#e94560] shrink-0" aria-hidden="true" />}
                              <span className="font-semibold text-white text-sm">{move.player}</span>
                            </div>
                            {move.droppedPlayer && (
                              <p className="text-[11px] text-slate-500 mt-0.5">Dropped: {move.droppedPlayer}</p>
                            )}
                            {/* Mobile owner */}
                            <p className="text-[11px] text-slate-500 mt-0.5 sm:hidden">{move.owner} &bull; {move.season} Wk{move.week}</p>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <PosBadge pos={move.pos} />
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs text-slate-300 font-medium">{move.owner}</span>
                            <p className="text-[11px] text-slate-500 mt-0.5 md:hidden">{move.season} Wk{move.week}</p>
                          </td>
                          <td className="px-3 py-3 text-center hidden md:table-cell">
                            <span className="text-xs font-mono text-slate-400 tabular-nums">{move.season}</span>
                            <p className="text-[10px] text-slate-600 mt-0.5">Wk {move.week}</p>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span className={cn(
                              'text-sm font-black font-mono tabular-nums',
                              isHof ? 'text-[#ffd700]' :
                              isBust ? 'text-[#e94560]' :
                              'text-slate-300'
                            )}>
                              {dollarFormat(move.faabSpent)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <ResultBadge result={move.result} />
                            {move.pointsScored && (
                              <p className="text-[10px] text-slate-600 mt-0.5 tabular-nums">~{move.pointsScored}pts</p>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <p className="text-xs text-slate-400 leading-snug line-clamp-2 max-w-xs">{move.resultDetail}</p>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Historical approximations</span> — live data via Sleeper API in Phase G.
            FAAB amounts, results, and player details are representative estimates based on league history and narrative.
            BMFFFL FAAB budget: $10,000 per season, blind bidding. The 2026 season budget has been reset for all 12 teams.
          </p>
        </div>

      </div>
    </>
  );
}
