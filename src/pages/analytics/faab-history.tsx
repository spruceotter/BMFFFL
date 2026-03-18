import { useState } from 'react';
import Head from 'next/head';
import { DollarSign, Trophy, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BidRecord {
  rank: number;
  owner: string;
  player: string;
  amount: number;
  week: number;
  outcome: 'won' | 'lost';
  note?: string;
}

interface BalanceRow {
  owner: string;
  remaining: number;
  spent: number;
  style: 'aggressive' | 'moderate' | 'conservative';
}

interface AllTimeRecord {
  label: string;
  value: string;
  detail: string;
  color: 'gold' | 'blue' | 'green' | 'red' | 'purple';
}

interface EfficiencyRow {
  rank: number;
  owner: string;
  score: number;
  note: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOP_BIDS_2025: BidRecord[] = [
  { rank: 1,  owner: 'Tubes94',          player: "De'Von Achane",    amount: 42, week: 4,  outcome: 'won',  note: 'After injury to starter' },
  { rank: 2,  owner: 'MLSchools12',       player: 'Kyren Williams',   amount: 38, week: 3,  outcome: 'won' },
  { rank: 3,  owner: 'JuicyBussy',        player: 'Kareem Hunt',      amount: 35, week: 6,  outcome: 'won' },
  { rank: 4,  owner: 'tdtd19844',         player: 'Rico Dowdle',      amount: 31, week: 9,  outcome: 'won',  note: 'Helped their championship run' },
  { rank: 5,  owner: 'SexMachineAndyD',   player: 'Ezekiel Elliott',  amount: 28, week: 5,  outcome: 'lost', note: 'Lost to higher bid' },
  { rank: 6,  owner: 'rbr',               player: 'Antonio Gibson',   amount: 27, week: 7,  outcome: 'won' },
  { rank: 7,  owner: 'Cmaleski',          player: 'Chuba Hubbard',    amount: 25, week: 8,  outcome: 'won' },
  { rank: 8,  owner: 'Grandes',           player: 'AJ Dillon',        amount: 22, week: 2,  outcome: 'won' },
  { rank: 9,  owner: 'eldridsm',          player: 'Tyler Boyd',       amount: 20, week: 11, outcome: 'won' },
  { rank: 10, owner: 'eldridm20',         player: 'Zay Jones',        amount: 18, week: 10, outcome: 'won' },
];

const BALANCES_2025: BalanceRow[] = [
  { owner: 'Escuelas',        remaining: 52, spent: 48,  style: 'conservative' },
  { owner: 'Cogdeill11',      remaining: 45, spent: 55,  style: 'conservative' },
  { owner: 'rbr',             remaining: 35, spent: 65,  style: 'conservative' },
  { owner: 'tdtd19844',       remaining: 31, spent: 69,  style: 'moderate' },
  { owner: 'eldridsm',        remaining: 28, spent: 72,  style: 'moderate' },
  { owner: 'Cmaleski',        remaining: 24, spent: 76,  style: 'moderate' },
  { owner: 'Tubes94',         remaining: 22, spent: 78,  style: 'moderate' },
  { owner: 'eldridm20',       remaining: 19, spent: 81,  style: 'moderate' },
  { owner: 'JuicyBussy',      remaining: 18, spent: 82,  style: 'aggressive' },
  { owner: 'SexMachineAndyD', remaining: 15, spent: 85,  style: 'aggressive' },
  { owner: 'Grandes',         remaining: 12, spent: 88,  style: 'aggressive' },
  { owner: 'MLSchools12',     remaining: 8,  spent: 92,  style: 'aggressive' },
];

const ALL_TIME_RECORDS: AllTimeRecord[] = [
  {
    label: 'Largest Single Bid Ever',
    value: '$48',
    detail: 'MLSchools12, 2023 — Justin Jefferson handcuff',
    color: 'gold',
  },
  {
    label: 'Most FAAB Spent in a Season',
    value: '$91',
    detail: 'JuicyBussy, 2022 season',
    color: 'red',
  },
  {
    label: 'Most Efficient Season',
    value: '$69 spent',
    detail: 'tdtd19844, 2025 — won the championship',
    color: 'green',
  },
  {
    label: 'Least Spent, Made Playoffs',
    value: '$29 spent',
    detail: 'rbr, 2021 — reached the finals',
    color: 'blue',
  },
  {
    label: 'Most Bids Won in a Season',
    value: '14 wins',
    detail: 'MLSchools12, 2023 season',
    color: 'purple',
  },
];

const EFFICIENCY_RANKINGS: EfficiencyRow[] = [
  { rank: 1,  owner: 'tdtd19844',       score: 9.2, note: '2025 champ, conservative spender' },
  { rank: 2,  owner: 'rbr',             score: 8.7, note: 'Consistent returns across seasons' },
  { rank: 3,  owner: 'MLSchools12',     score: 8.1, note: 'High spend, high returns' },
  { rank: 4,  owner: 'JuicyBussy',      score: 7.9, note: 'Aggressive but calculated' },
  { rank: 5,  owner: 'Tubes94',         score: 7.4, note: 'Strong targeted bids' },
  { rank: 6,  owner: 'Cmaleski',        score: 6.8, note: 'Selective, solid hit rate' },
  { rank: 7,  owner: 'eldridsm',        score: 6.4, note: 'Mid-range bids, mid results' },
  { rank: 8,  owner: 'eldridm20',       score: 6.1, note: 'Still developing strategy' },
  { rank: 9,  owner: 'SexMachineAndyD', score: 5.7, note: 'Occasionally overbids on misses' },
  { rank: 10, owner: 'Grandes',         score: 5.3, note: 'Aggressive spend, mixed results' },
  { rank: 11, owner: 'Cogdeill11',      score: 4.9, note: 'Too conservative — missed opportunities' },
  { rank: 12, owner: 'Escuelas',        score: 4.2, note: 'Barely used budget — still learning FAAB' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STYLE_LABEL: Record<BalanceRow['style'], string> = {
  aggressive:   'Aggressive',
  moderate:     'Moderate',
  conservative: 'Conservative',
};

const STYLE_CLASSES: Record<BalanceRow['style'], string> = {
  aggressive:   'text-[#e94560] bg-[#e94560]/10 border-[#e94560]/30',
  moderate:     'text-amber-400 bg-amber-400/10 border-amber-400/30',
  conservative: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
};

const BAR_CLASSES: Record<BalanceRow['style'], string> = {
  aggressive:   'bg-[#e94560]',
  moderate:     'bg-amber-500',
  conservative: 'bg-emerald-500',
};

const RECORD_COLOR: Record<AllTimeRecord['color'], { border: string; icon: string; value: string }> = {
  gold:   { border: 'border-[#ffd700]/30 bg-[#ffd700]/5',  icon: 'text-[#ffd700]',  value: 'text-[#ffd700]' },
  blue:   { border: 'border-blue-500/30 bg-blue-500/5',    icon: 'text-blue-400',   value: 'text-blue-400' },
  green:  { border: 'border-emerald-500/30 bg-emerald-500/5', icon: 'text-emerald-400', value: 'text-emerald-400' },
  red:    { border: 'border-[#e94560]/30 bg-[#e94560]/5',  icon: 'text-[#e94560]',  value: 'text-[#e94560]' },
  purple: { border: 'border-purple-500/30 bg-purple-500/5', icon: 'text-purple-400', value: 'text-purple-400' },
};

type Season = '2025' | '2024' | '2023';
const SEASONS: Season[] = ['2025', '2024', '2023'];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaabHistoryPage() {
  const [activeSeason, setActiveSeason] = useState<Season>('2025');

  const maxSpent = Math.max(...BALANCES_2025.map(r => r.spent));

  return (
    <>
      <Head>
        <title>FAAB Bid History — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Full FAAB bid history across all BMFFFL seasons — biggest bids, most aggressive bidders, efficiency ratings, and budget management strategies."
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
            FAAB Bid History
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            The complete auction record &mdash; biggest bids, budget strategies, and FAAB efficiency across every season. $100 budget per team.
          </p>
        </header>

        {/* Season selector */}
        <div className="flex items-center gap-2 mb-10" role="tablist" aria-label="Season selector">
          {SEASONS.map(s => (
            <button
              key={s}
              role="tab"
              aria-selected={activeSeason === s}
              onClick={() => setActiveSeason(s)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-bold transition-all duration-150 border',
                activeSeason === s
                  ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700] shadow-md shadow-[#ffd700]/20'
                  : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:text-white hover:border-slate-500'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Coming soon for non-2025 */}
        {activeSeason !== '2025' && (
          <div className="mb-10 rounded-xl border border-[#2d4a66] bg-[#16213e] p-10 text-center">
            <BarChart2 className="w-10 h-10 text-slate-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-slate-400 font-semibold text-lg mb-1">{activeSeason} Season Data</p>
            <p className="text-slate-500 text-sm">Historical bid data for {activeSeason} is coming soon. Check back after the season archive is complete.</p>
          </div>
        )}

        {activeSeason === '2025' && (
          <>
            {/* Section 1: FAAB Balances */}
            <section className="mb-12" aria-labelledby="balances-heading">
              <h2 id="balances-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                2025 FAAB Balances
              </h2>
              <p className="text-slate-500 text-sm mb-5">End-of-season remaining balance per team. $100 starting budget.</p>

              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] divide-y divide-[#1e3347] overflow-hidden">
                {BALANCES_2025.map((row) => {
                  const barPct = Math.round((row.spent / maxSpent) * 100);
                  return (
                    <div
                      key={row.owner}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4 hover:bg-[#1f3550] transition-colors duration-100"
                    >
                      {/* Owner + badge */}
                      <div className="flex items-center gap-3 sm:w-52 shrink-0">
                        <span className="font-semibold text-slate-200 text-sm">{row.owner}</span>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
                          STYLE_CLASSES[row.style]
                        )}>
                          {STYLE_LABEL[row.style]}
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 h-2.5 rounded-full bg-[#0d1b2a] overflow-hidden" aria-hidden="true">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', BAR_CLASSES[row.style])}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-400 tabular-nums w-16 text-right shrink-0">
                          ${row.spent} spent
                        </span>
                      </div>

                      {/* Remaining */}
                      <div className="sm:w-28 shrink-0 text-right">
                        <span className={cn(
                          'text-sm font-black font-mono tabular-nums',
                          row.remaining >= 40 ? 'text-emerald-400' :
                          row.remaining >= 20 ? 'text-amber-400' :
                          'text-[#e94560]'
                        )}>
                          ${row.remaining}
                        </span>
                        <span className="text-slate-600 text-xs font-medium"> left</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Top Bids */}
            <section className="mb-12" aria-labelledby="top-bids-heading">
              <h2 id="top-bids-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" aria-hidden="true" />
                Top Bids This Season
              </h2>
              <p className="text-slate-500 text-sm mb-5">Biggest single FAAB bids of the 2025 season, ranked by amount.</p>

              <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm" aria-label="Top FAAB bids 2025">
                    <thead>
                      <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                        <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Owner</th>
                        <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell w-20">Week</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">Bid</th>
                        <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">Outcome</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3347]">
                      {TOP_BIDS_2025.map((bid, idx) => (
                        <tr
                          key={bid.rank}
                          className={cn(
                            'transition-colors duration-100 hover:bg-[#1f3550]',
                            idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                            bid.rank <= 3 && 'bg-[#ffd700]/3'
                          )}
                        >
                          <td className="px-4 py-3">
                            <span className={cn(
                              'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black',
                              bid.rank === 1 ? 'bg-[#ffd700] text-[#0d1b2a]' :
                              bid.rank === 2 ? 'bg-slate-400 text-[#0d1b2a]' :
                              bid.rank === 3 ? 'bg-amber-700 text-white' :
                              'bg-[#1e3347] text-slate-400'
                            )}>
                              {bid.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-white">{bid.player}</span>
                            <p className="text-[11px] text-slate-500 mt-0.5 sm:hidden">{bid.owner} &bull; Wk {bid.week}</p>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs text-slate-300">{bid.owner}</span>
                          </td>
                          <td className="px-4 py-3 text-center hidden md:table-cell">
                            <span className="text-xs font-mono text-slate-400 tabular-nums">Wk {bid.week}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={cn(
                              'text-sm font-black font-mono tabular-nums',
                              bid.rank <= 3 ? 'text-[#ffd700]' : 'text-slate-300'
                            )}>
                              ${bid.amount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
                              bid.outcome === 'won'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30'
                            )}>
                              {bid.outcome === 'won' ? 'Won' : 'Lost'}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-xs text-slate-500">{bid.note ?? '—'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 3: All-Time Records */}
            <section className="mb-12" aria-labelledby="records-heading">
              <h2 id="records-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                All-Time FAAB Records
              </h2>
              <p className="text-slate-500 text-sm mb-5">The most notable FAAB milestones in BMFFFL history.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_TIME_RECORDS.map((rec) => {
                  const colors = RECORD_COLOR[rec.color];
                  return (
                    <div
                      key={rec.label}
                      className={cn('rounded-xl border p-5', colors.border)}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <Award className={cn('w-4 h-4 shrink-0 mt-0.5', colors.icon)} aria-hidden="true" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-snug">{rec.label}</p>
                      </div>
                      <p className={cn('text-3xl font-black tabular-nums leading-none mb-2', colors.value)}>
                        {rec.value}
                      </p>
                      <p className="text-xs text-slate-500 leading-snug">{rec.detail}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Efficiency Leaderboard */}
            <section className="mb-12" aria-labelledby="efficiency-heading">
              <h2 id="efficiency-heading" className="text-xl font-black text-white mb-1 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" aria-hidden="true" />
                FAAB Efficiency Leaderboard
              </h2>
              <p className="text-slate-500 text-sm mb-5">Championship points per $1 of FAAB spent. Score out of 10.0.</p>

              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] divide-y divide-[#1e3347] overflow-hidden">
                {EFFICIENCY_RANKINGS.map((row) => (
                  <div
                    key={row.owner}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#1f3550] transition-colors duration-100"
                  >
                    {/* Rank */}
                    <span className={cn(
                      'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black shrink-0',
                      row.rank === 1 ? 'bg-[#ffd700] text-[#0d1b2a]' :
                      row.rank === 2 ? 'bg-slate-400 text-[#0d1b2a]' :
                      row.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-[#1e3347] text-slate-500'
                    )}>
                      {row.rank}
                    </span>

                    {/* Owner + note */}
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-slate-200 text-sm">{row.owner}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{row.note}</p>
                    </div>

                    {/* Score bar */}
                    <div className="hidden sm:flex items-center gap-2 w-40 shrink-0">
                      <div className="flex-1 h-2 rounded-full bg-[#0d1b2a] overflow-hidden" aria-hidden="true">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            row.score >= 8 ? 'bg-[#ffd700]' :
                            row.score >= 6.5 ? 'bg-emerald-500' :
                            row.score >= 5 ? 'bg-amber-500' :
                            'bg-[#e94560]'
                          )}
                          style={{ width: `${(row.score / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Score value */}
                    <span className={cn(
                      'text-base font-black font-mono tabular-nums shrink-0 w-12 text-right',
                      row.score >= 8 ? 'text-[#ffd700]' :
                      row.score >= 6.5 ? 'text-emerald-400' :
                      row.score >= 5 ? 'text-amber-400' :
                      'text-[#e94560]'
                    )}>
                      {row.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bimfle Note */}
            <div className="mb-10 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-6 py-5">
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;FAAB management is the truest expression of dynasty wisdom. Those who hoard their budget shall find themselves outbid when it matters most.&rdquo;
              </p>
              <p className="text-xs text-[#ffd700] font-semibold mt-2">&mdash; Love, Bimfle.</p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">2025 Season Data</span> &mdash; FAAB amounts and outcomes are curated records from the 2025 BMFFFL season.
            $100 blind-auction budget per team per season. Earlier season archives coming soon.
          </p>
        </div>

      </div>
    </>
  );
}
