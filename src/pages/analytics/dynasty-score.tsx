import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, ChevronDown, ChevronUp, BarChart2, Info, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import dynastyScoresRaw from '../../../public/data/dynasty-scores.json';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonEntry {
  rs_wins: number;
  rank: number | null;
  place_pts: number;
  playoff_wins: number;
  season_score: number;
}

interface RankingEntry {
  rank: number;
  owner: string;
  combined_total: number;
  espn_total: number;
  sleeper_total: number;
  seasons: Record<string, SeasonEntry>;
}

// ─── Display Helpers ──────────────────────────────────────────────────────────

const DISPLAY_NAMES: Record<string, string> = {
  mlschools12:     'MLSchools12',
  sexmachineandyd: 'SexMachineAndyD',
  cogdeill11:      'Cogdeill11',
  grandes:         'Grandes',
  rbr:             'RBR',
  eldridsm:        'EldrIdSM',
  juicybussy:      'JuicyBussy',
  tdtd19844:       'tdtd19844',
  eldridm20:       'EldridM20',
  tubes94:         'Tubes94',
  cmaleski:        'CMaleski',
  mmoodie12:       'MMoodie12',
  escuelas:        'Escuelas',
  miroslav081:     'Miroslav081',
};

const OWNER_COLORS: Record<string, string> = {
  mlschools12:     '#ffd700',
  sexmachineandyd: '#e94560',
  cogdeill11:      '#3b82f6',
  grandes:         '#10b981',
  rbr:             '#f59e0b',
  eldridsm:        '#8b5cf6',
  juicybussy:      '#ec4899',
  tdtd19844:       '#06b6d4',
  eldridm20:       '#84cc16',
  tubes94:         '#f97316',
  cmaleski:        '#94a3b8',
  mmoodie12:       '#64748b',
  escuelas:        '#475569',
  miroslav081:     '#334155',
};

const SEASONS = ['2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
const ESPN_SEASONS = new Set(['2016','2017','2018','2019']);
const SLEEPER_SEASONS = new Set(['2020','2021','2022','2023','2024','2025']);

const PLACE_LABELS: Record<number, string> = {
  1: '🏆 Champion',
  2: '🥈 Runner-up',
  3: '🥉 3rd Place',
  4: '4th Place',
  5: 'Made PO',
  6: 'Made PO',
};

function rankSuffix(r: number) {
  if (r === 1) return '1st';
  if (r === 2) return '2nd';
  if (r === 3) return '3rd';
  return `${r}th`;
}

// ─── Section Label (matching site design) ────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
      <span
        className="block w-4 h-px opacity-70"
        style={{ background: 'linear-gradient(90deg, #ffd700, #ffb70000)' }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

// ─── Formula Card ─────────────────────────────────────────────────────────────

function FormulaCard() {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded bg-[#1a1a2e] border border-[#2d4a66]">
          <Info className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        </div>
        <SectionLabel>Scoring Formula</SectionLabel>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {[
          { label: 'Champion', pts: '+10.0' },
          { label: 'Runner-up', pts: '+6.0' },
          { label: '3rd Place', pts: '+4.0' },
          { label: '4th Place', pts: '+2.0' },
          { label: 'Made Playoffs', pts: '+1.0' },
          { label: 'Per RS Win', pts: '+0.10' },
          { label: 'Per PO Win', pts: '+0.25' },
        ].map(({ label, pts }) => (
          <div key={label} className="flex items-center justify-between gap-2 bg-[#0f2744] rounded px-2.5 py-1.5 border border-[#1e3347]">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono font-bold text-[#ffd700] tabular-nums">{pts}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#2d4a66] border border-[#4a6b8a]" />
          ESPN era: 2016–2019 (v3 API)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1e4a3a] border border-[#2d7a5a]" />
          Sleeper era: 2020–2025
        </span>
      </div>
    </div>
  );
}

// ─── Season Breakdown Row ─────────────────────────────────────────────────────

function SeasonBreakdownRow({ season, entry }: { season: string; entry: SeasonEntry | undefined }) {
  const isEspn = ESPN_SEASONS.has(season);

  if (!entry) {
    return (
      <td
        className={cn(
          'px-2 py-2 text-center text-[10px] tabular-nums',
          isEspn ? 'bg-[#1a2233]' : 'bg-[#111e2e]'
        )}
      >
        <span className="text-slate-700">—</span>
      </td>
    );
  }

  const { place_pts, rs_wins, playoff_wins, season_score, rank } = entry;

  return (
    <td
      className={cn(
        'px-2 py-1.5 text-center align-top',
        isEspn ? 'bg-[#1a2233]' : 'bg-[#111e2e]'
      )}
    >
      <div className="text-[11px] font-bold tabular-nums text-white">
        {season_score.toFixed(2)}
      </div>
      {rank && (
        <div className="text-[9px] text-slate-500 leading-tight">
          {rank <= 4 ? rankSuffix(rank) : 'PO'}
        </div>
      )}
      <div className="text-[9px] text-slate-600 leading-tight">
        {rs_wins}W · {playoff_wins > 0 ? `${playoff_wins}po` : ''}
      </div>
    </td>
  );
}

// ─── Main Rankings Table ──────────────────────────────────────────────────────

function RankingsTable({ rankings, expanded }: { rankings: RankingEntry[]; expanded: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
      <table className="min-w-full text-xs" aria-label="Dynasty score rankings">
        <thead>
          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
            <th scope="col" className="px-4 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider w-8">#</th>
            <th scope="col" className="px-4 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Owner</th>
            <th scope="col" className="px-4 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider">
              <span className="text-[#ffd700]">Total</span>
            </th>
            <th scope="col" className="px-4 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">ESPN</th>
            <th scope="col" className="px-4 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Sleeper</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3347]">
          {rankings.map((entry, idx) => {
            const color = OWNER_COLORS[entry.owner] ?? '#94a3b8';
            const displayName = DISPLAY_NAMES[entry.owner] ?? entry.owner;
            const isTop3 = entry.rank <= 3;

            return (
              <tr
                key={entry.owner}
                className={cn(
                  'transition-colors duration-100 hover:bg-[#1f3550]',
                  idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                  isTop3 && 'ring-1 ring-inset ring-[#ffd700]/10'
                )}
              >
                {/* Rank */}
                <td className="px-4 py-3">
                  {entry.rank === 1 ? (
                    <Trophy className="w-4 h-4 text-[#ffd700]" aria-label="1st place" />
                  ) : (
                    <span className="text-slate-500 font-bold tabular-nums">{entry.rank}</span>
                  )}
                </td>

                {/* Owner */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-5 rounded-sm shrink-0"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    <Link
                      href={`/owners/${entry.owner}`}
                      className="font-bold hover:underline"
                      style={{ color }}
                    >
                      {displayName}
                    </Link>
                  </div>
                </td>

                {/* Combined */}
                <td className="px-4 py-3 text-right">
                  <span className="text-base font-black text-white tabular-nums">
                    {entry.combined_total.toFixed(2)}
                  </span>
                </td>

                {/* ESPN */}
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  <span className={cn('font-mono tabular-nums', entry.espn_total > 0 ? 'text-slate-300' : 'text-slate-600')}>
                    {entry.espn_total > 0 ? entry.espn_total.toFixed(2) : '—'}
                  </span>
                </td>

                {/* Sleeper */}
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  <span className={cn('font-mono tabular-nums', entry.sleeper_total > 0 ? 'text-slate-300' : 'text-slate-600')}>
                    {entry.sleeper_total > 0 ? entry.sleeper_total.toFixed(2) : '—'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Season-by-Season Breakdown Table ────────────────────────────────────────

function SeasonBreakdown({ rankings }: { rankings: RankingEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
      <table className="text-xs border-collapse" aria-label="Season-by-season dynasty scores">
        <thead>
          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
            <th scope="col" className="px-4 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10 min-w-[130px]">
              Owner
            </th>
            {/* ESPN era header */}
            <th
              scope="colgroup"
              colSpan={4}
              className="px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#6b8aaa] border-r border-[#2d4a66] bg-[#0d1e35]"
            >
              ESPN 2016–2019
            </th>
            {/* Sleeper era header */}
            <th
              scope="colgroup"
              colSpan={6}
              className="px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#10b981]/70 bg-[#0a1f1a]"
            >
              Sleeper 2020–2025
            </th>
          </tr>
          <tr className="bg-[#0a1827] border-b border-[#2d4a66]">
            <th scope="col" className="px-4 py-1.5 text-left text-slate-500 sticky left-0 bg-[#0a1827] z-10">
              <span className="sr-only">Owner</span>
            </th>
            {SEASONS.map(s => (
              <th
                key={s}
                scope="col"
                className={cn(
                  'px-2 py-1.5 text-center font-semibold text-slate-500 uppercase tracking-wider w-16',
                  ESPN_SEASONS.has(s) ? 'bg-[#0f1c2e]' : 'bg-[#0a1720]',
                  s === '2019' && 'border-r border-[#2d4a66]'
                )}
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3347]">
          {rankings.map((entry, idx) => {
            const color = OWNER_COLORS[entry.owner] ?? '#94a3b8';
            const displayName = DISPLAY_NAMES[entry.owner] ?? entry.owner;

            return (
              <tr
                key={entry.owner}
                className={cn(
                  'transition-colors duration-100 hover:bg-[#1f3550]/50',
                  idx % 2 === 0 ? '' : ''
                )}
              >
                {/* Owner name - sticky */}
                <td className={cn(
                  'px-4 py-2 sticky left-0 z-10 border-r border-[#2d4a66]',
                  idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                )}>
                  <span className="font-bold text-[11px]" style={{ color }}>
                    {displayName}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono tabular-nums mt-0.5">
                    {entry.combined_total.toFixed(2)} pts
                  </div>
                </td>

                {/* Season cells */}
                {SEASONS.map(s => (
                  <SeasonBreakdownRow
                    key={s}
                    season={s}
                    entry={entry.seasons[s] as SeasonEntry | undefined}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Bar Chart Visual ─────────────────────────────────────────────────────────

function DynastyBars({ rankings }: { rankings: RankingEntry[] }) {
  const maxTotal = rankings[0]?.combined_total ?? 1;

  return (
    <div className="space-y-2">
      {rankings.map(entry => {
        const color = OWNER_COLORS[entry.owner] ?? '#94a3b8';
        const displayName = DISPLAY_NAMES[entry.owner] ?? entry.owner;
        const espnPct = (entry.espn_total / maxTotal) * 100;
        const sleeperPct = (entry.sleeper_total / maxTotal) * 100;

        return (
          <div key={entry.owner} className="flex items-center gap-3">
            <div className="w-28 shrink-0 text-right">
              <span className="text-[11px] font-bold" style={{ color }}>
                {displayName}
              </span>
            </div>
            <div className="flex-1 flex h-5 rounded overflow-hidden bg-[#0f2744]" role="meter" aria-valuenow={entry.combined_total} aria-valuemax={maxTotal} aria-label={`${displayName}: ${entry.combined_total} dynasty points`}>
              {entry.espn_total > 0 && (
                <div
                  className="h-full transition-all"
                  style={{ width: `${espnPct}%`, backgroundColor: color, opacity: 0.5 }}
                  title={`ESPN: ${entry.espn_total.toFixed(2)}`}
                />
              )}
              {entry.sleeper_total > 0 && (
                <div
                  className="h-full transition-all"
                  style={{ width: `${sleeperPct}%`, backgroundColor: color }}
                  title={`Sleeper: ${entry.sleeper_total.toFixed(2)}`}
                />
              )}
            </div>
            <div className="w-16 shrink-0 text-right">
              <span className="text-xs font-black text-white tabular-nums">
                {entry.combined_total.toFixed(1)}
              </span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-4 pt-1 pl-[7.5rem] text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-[#ffd700] opacity-50" />
          ESPN 2016–2019
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-[#ffd700]" />
          Sleeper 2020–2025
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DynastyScorePage() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const rankings = (dynastyScoresRaw as { rankings: RankingEntry[] }).rankings;
  const top3 = rankings.slice(0, 3);

  return (
    <>
      <Head>
        <title>Dynasty Score — BMFFFL</title>
        <meta
          name="description"
          content="All-time BMFFFL dynasty score rankings — 10 seasons of championship points, playoff finishes, and win bonuses from 2016 to 2025."
        />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Back nav */}
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Analytics Hub
        </Link>

        {/* Page header */}
        <header className="mb-10">
          <SectionLabel>League Analytics</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Score
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            All-time BMFFFL franchise rankings — 10 seasons (2016–2025) of championship finishes, playoff wins, and regular season performance combined into a single score.
          </p>
        </header>

        {/* Formula */}
        <div className="mb-8">
          <FormulaCard />
        </div>

        {/* Top 3 Podium */}
        <section className="mb-8" aria-labelledby="podium-heading">
          <SectionLabel>All-Time Podium</SectionLabel>
          <h2 id="podium-heading" className="sr-only">Top 3 All-Time Dynasty Scores</h2>
          <div className="grid grid-cols-3 gap-3">
            {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
              const podiumRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
              if (!entry) return null;
              const color = OWNER_COLORS[entry.owner] ?? '#94a3b8';
              const displayName = DISPLAY_NAMES[entry.owner] ?? entry.owner;
              const heights = ['h-24', 'h-32', 'h-20'];

              return (
                <div
                  key={entry.owner}
                  className={cn(
                    'rounded-xl border bg-[#16213e] p-4 flex flex-col items-center justify-end text-center',
                    podiumRank === 1 ? 'border-[#ffd700]/40 ring-1 ring-[#ffd700]/20' : 'border-[#2d4a66]',
                    heights[podiumIdx]
                  )}
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  <div className="text-lg font-black" style={{ color }}>
                    {podiumRank === 1 ? '🏆' : podiumRank === 2 ? '🥈' : '🥉'}
                  </div>
                  <div className="text-[11px] font-bold mt-1" style={{ color }}>
                    {displayName}
                  </div>
                  <div className="text-xl font-black text-white tabular-nums mt-0.5">
                    {entry.combined_total.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    dynasty pts
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bar chart */}
        <section className="mb-8 rounded-xl border border-[#2d4a66] bg-[#16213e] p-5" aria-labelledby="bars-heading">
          <SectionLabel>All-Time Rankings</SectionLabel>
          <h2 id="bars-heading" className="text-lg font-bold text-white mb-4">Franchise Dynasty Points</h2>
          <DynastyBars rankings={rankings} />
        </section>

        {/* Main table */}
        <section className="mb-6" aria-labelledby="table-heading">
          <SectionLabel>Full Standings</SectionLabel>
          <h2 id="table-heading" className="text-lg font-bold text-white mb-3">Dynasty Score Leaderboard</h2>
          <RankingsTable rankings={rankings} expanded={false} />
        </section>

        {/* Season breakdown toggle */}
        <section className="mb-8" aria-labelledby="breakdown-heading">
          <button
            onClick={() => setShowBreakdown(v => !v)}
            className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#2d4a66] bg-[#16213e] hover:border-[#ffd700]/30 hover:bg-[#1a2d42] transition-all p-4"
            aria-expanded={showBreakdown}
            aria-controls="season-breakdown-panel"
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <div className="text-left">
                <div className="text-sm font-bold text-white" id="breakdown-heading">Season-by-Season Breakdown</div>
                <div className="text-xs text-slate-500">All 10 seasons · 2016–2025 · scores per owner per year</div>
              </div>
            </div>
            {showBreakdown
              ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            }
          </button>

          {showBreakdown && (
            <div id="season-breakdown-panel" className="mt-3">
              <SeasonBreakdown rankings={rankings} />
              <p className="mt-2 text-[11px] text-slate-600 leading-snug px-1">
                Each cell shows season score · finish / RS wins · PO wins. — = did not play that season.
                ESPN era (2016–2019) data sourced from ESPN Fantasy v3 API. Sleeper era (2020–2025) from Sleeper API database.
              </p>
            </div>
          )}
        </section>

        {/* Footer note */}
        <p className="text-[11px] text-slate-600 text-center leading-relaxed">
          Dynasty Score covers all 10 BMFFFL seasons (ESPN 2016–2019, Sleeper 2020–2025).
          Formula: Champion 10pts · Runner-up 6pts · 3rd 4pts · 4th 2pts · Made Playoffs 1pt · +0.10/RS win · +0.25/PO win.
        </p>

      </div>
    </>
  );
}
