import { useState } from 'react';
import Head from 'next/head';
import { BarChart2, Trophy, TrendingUp, ArrowLeftRight, Star, Layers } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type SeasonYear = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

interface SeasonData {
  year: SeasonYear;
  champion: string;
  championSeed: number;
  runnerUp: string;
  regularSeasonWinner: string;
  regularSeasonRecord: string;
  totalTrades: number;
  avgPointsPerWeek: number;
  leagueHighScore: number;
  leagueHighScorer: string;
  playoffTeams: number;
  storyline: string;
  notable: string;
}

// ─── Season Data ─────────────────────────────────────────────────────────────

const SEASONS: Record<SeasonYear, SeasonData> = {
  2020: {
    year: 2020,
    champion: 'Cogdeill11',
    championSeed: 2,
    runnerUp: 'rbr',
    regularSeasonWinner: 'Cogdeill11',
    regularSeasonRecord: '11-3',
    totalTrades: 31,
    avgPointsPerWeek: 151.2,
    leagueHighScore: 245.8,
    leagueHighScorer: 'Cogdeill11',
    playoffTeams: 6,
    storyline:
      'The inaugural BMFFFL season. Cogdeill11 dominated wire-to-wire, winning the regular season and the championship in the founding year of the dynasty.',
    notable: 'Inaugural season. CMC acquired by Cogdeill11 in the most-talked-about startup trade.',
  },
  2021: {
    year: 2021,
    champion: 'MLSchools12',
    championSeed: 3,
    runnerUp: 'Cogdeill11',
    regularSeasonWinner: 'Cogdeill11',
    regularSeasonRecord: '12-2',
    totalTrades: 38,
    avgPointsPerWeek: 148.6,
    leagueHighScore: 245.8,
    leagueHighScorer: 'JuicyBussy',
    playoffTeams: 6,
    storyline:
      "MLSchools12 avenged a prior loss by knocking off the regular season favorite Cogdeill11 in the championship. JuicyBussy's consolation game 245.8 set the all-time BMFFFL single-game record.",
    notable: "JuicyBussy's 245.8 is the highest single-game score in league history (consolation bowl, Week 16).",
  },
  2022: {
    year: 2022,
    champion: 'tdtd19844',
    championSeed: 4,
    runnerUp: 'Grandes',
    regularSeasonWinner: 'Cogdeill11',
    regularSeasonRecord: '11-3',
    totalTrades: 44,
    avgPointsPerWeek: 154.3,
    leagueHighScore: 218.4,
    leagueHighScorer: 'tdtd19844',
    playoffTeams: 6,
    storyline:
      'The first major upset championship. tdtd19844 entered as a 4-seed and dispatched three higher seeds, including Cogdeill11 in the semifinals, to claim the first ring for a non-Cogdeill11/MLSchools12 owner.',
    notable: 'Full PPR and Superflex format adopted at the 2022 Owners Meeting — highest scoring season to that point.',
  },
  2023: {
    year: 2023,
    champion: 'Cogdeill11',
    championSeed: 1,
    runnerUp: 'JuicyBussy',
    regularSeasonWinner: 'Cogdeill11',
    regularSeasonRecord: '12-2',
    totalTrades: 52,
    avgPointsPerWeek: 152.1,
    leagueHighScore: 224.6,
    leagueHighScorer: 'MLSchools12',
    playoffTeams: 6,
    storyline:
      "Cogdeill11 returned to the mountaintop after a two-year drought, going wire-to-wire as the top seed and defeating JuicyBussy's 6th-seed Cinderella run in the championship. The most trades in a single season to that point — 52.",
    notable: 'JuicyBussy won as a 6-seed, defeating the 2, 3, and 4 seeds before falling to Cogdeill11. Most trades in single season (52 at the time).',
  },
  2024: {
    year: 2024,
    champion: 'JuicyBussy',
    championSeed: 2,
    runnerUp: 'MLSchools12',
    regularSeasonWinner: 'MLSchools12',
    regularSeasonRecord: '11-3',
    totalTrades: 47,
    avgPointsPerWeek: 158.9,
    leagueHighScore: 231.2,
    leagueHighScorer: 'JuicyBussy',
    playoffTeams: 6,
    storyline:
      "JuicyBussy completed a dynasty-defining run, winning the championship in dominant fashion. MLSchools12 led the regular season but was stopped short in the title game, setting the stage for an all-time rivalry.",
    notable: 'Highest-scoring regular season average through 2024. League fully settled on Sleeper platform.',
  },
  2025: {
    year: 2025,
    champion: 'rbr',
    championSeed: 4,
    runnerUp: 'JuicyBussy',
    regularSeasonWinner: 'MLSchools12',
    regularSeasonRecord: '13-1',
    totalTrades: 45,
    avgPointsPerWeek: 161.4,
    leagueHighScore: 228.8,
    leagueHighScorer: 'MLSchools12',
    playoffTeams: 6,
    storyline:
      'MLSchools12 authored the greatest regular season in BMFFFL history at 13-1, but was eliminated in the semifinals. rbr (Really Big Rings) emerged from the 4-seed to win the championship — the second low-seed winner in league history.',
    notable: 'MLSchools12 went 13-1 (best record in BMFFFL history) but lost in the semis. rbr won as a 4-seed.',
  },
};

const SEASON_YEARS = Object.keys(SEASONS).map(Number) as SeasonYear[];

// ─── Evolution Table Data ─────────────────────────────────────────────────────

interface EvolutionRow {
  year: SeasonYear;
  champion: string;
  seed: number;
  regularWinner: string;
  trades: number;
  avgPPW: number;
  highScore: number;
}

const EVOLUTION_ROWS: EvolutionRow[] = SEASON_YEARS.map(y => {
  const s = SEASONS[y];
  return {
    year: y,
    champion: s.champion,
    seed: s.championSeed,
    regularWinner: s.regularSeasonWinner,
    trades: s.totalTrades,
    avgPPW: s.avgPointsPerWeek,
    highScore: s.leagueHighScore,
  };
});

// ─── Stat Row Component ───────────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  highlight?: boolean;
}

function StatRow({ label, valueA, valueB, highlight }: StatRowProps) {
  return (
    <div className={cn(
      'grid grid-cols-[1fr_auto_1fr] gap-4 py-3 px-4 rounded-lg',
      highlight ? 'bg-[#ffd700]/5 border border-[#ffd700]/10' : 'bg-[#0d1b2a]'
    )}>
      <div className="text-right">{valueA}</div>
      <div className="flex items-center justify-center min-w-[80px]">
        <span className={cn(
          'text-[10px] font-semibold uppercase tracking-wider text-center leading-tight',
          highlight ? 'text-[#ffd700]/70' : 'text-slate-600'
        )}>
          {label}
        </span>
      </div>
      <div className="text-left">{valueB}</div>
    </div>
  );
}

// ─── Season Selector ─────────────────────────────────────────────────────────

interface SelectorProps {
  label: string;
  value: SeasonYear;
  onChange: (y: SeasonYear) => void;
  disabledYear: SeasonYear;
}

function SeasonSelector({ label, value, onChange, disabledYear }: SelectorProps) {
  return (
    <div className="flex-1">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">{label}</p>
      <div className="flex gap-1.5 flex-wrap">
        {SEASON_YEARS.map(y => (
          <button
            key={y}
            onClick={() => onChange(y)}
            disabled={y === disabledYear}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-black border transition-colors duration-150',
              y === value
                ? 'bg-[#ffd700] text-[#1a1a2e] border-[#ffd700]'
                : y === disabledYear
                ? 'opacity-30 cursor-not-allowed border-[#2d4a66] bg-[#0d1b2a] text-slate-600'
                : 'border-[#2d4a66] bg-[#16213e] text-slate-300 hover:border-[#ffd700]/40 hover:text-white'
            )}
            aria-pressed={y === value}
            aria-label={`Select ${y} season`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SeasonSnapshotPage() {
  const [seasonA, setSeasonA] = useState<SeasonYear>(2023);
  const [seasonB, setSeasonB] = useState<SeasonYear>(2025);

  const dataA = SEASONS[seasonA];
  const dataB = SEASONS[seasonB];

  return (
    <>
      <Head>
        <title>Season Snapshot — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL season snapshot comparison tool. Compare any two of the six BMFFFL seasons side by side — champions, scoring, trades, and key storylines."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Season Snapshot
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Compare any two BMFFFL seasons side by side. Six years of dynasty history in one view.
          </p>
        </header>

        {/* ── Season Selectors ────────────────────────────────────────────── */}
        <section aria-labelledby="selector-heading" className="mb-8 rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
          <h2 id="selector-heading" className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">
            Select Two Seasons to Compare
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <SeasonSelector
              label="Season A"
              value={seasonA}
              onChange={y => {
                if (y !== seasonB) setSeasonA(y);
                else setSeasonA(y === 2020 ? 2021 : 2020);
              }}
              disabledYear={seasonB}
            />
            <div className="hidden sm:flex items-end pb-2">
              <ArrowLeftRight className="w-5 h-5 text-[#2d4a66]" aria-hidden="true" />
            </div>
            <SeasonSelector
              label="Season B"
              value={seasonB}
              onChange={y => {
                if (y !== seasonA) setSeasonB(y);
                else setSeasonB(y === 2025 ? 2024 : 2025);
              }}
              disabledYear={seasonA}
            />
          </div>
        </section>

        {/* ── Comparison Panel ────────────────────────────────────────────── */}
        <section aria-labelledby="comparison-heading" className="mb-12">
          <h2 id="comparison-heading" className="sr-only">Season Comparison</h2>

          {/* Season header cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[dataA, dataB].map((data, i) => (
              <div
                key={data.year}
                className={cn(
                  'rounded-xl border p-4 sm:p-5',
                  i === 0
                    ? 'border-[#ffd700]/40 bg-[#ffd700]/5'
                    : 'border-blue-500/30 bg-blue-500/5'
                )}
              >
                <p className={cn('text-xs font-semibold uppercase tracking-wider mb-1', i === 0 ? 'text-[#ffd700]/70' : 'text-blue-400/70')}>
                  Season {i === 0 ? 'A' : 'B'}
                </p>
                <p className={cn('text-3xl sm:text-4xl font-black leading-none', i === 0 ? 'text-[#ffd700]' : 'text-blue-400')}>
                  {data.year}
                </p>
              </div>
            ))}
          </div>

          {/* Stat grid */}
          <div className="space-y-2">

            <StatRow
              label="Champion"
              highlight
              valueA={
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{dataA.champion}</p>
                    <p className="text-[10px] text-slate-500">Seed #{dataA.championSeed}</p>
                  </div>
                  <Trophy className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                </div>
              }
              valueB={
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black text-white">{dataB.champion}</p>
                    <p className="text-[10px] text-slate-500">Seed #{dataB.championSeed}</p>
                  </div>
                </div>
              }
            />

            <StatRow
              label="Runner-Up"
              valueA={<p className="text-sm font-bold text-slate-300">{dataA.runnerUp}</p>}
              valueB={<p className="text-sm font-bold text-slate-300">{dataB.runnerUp}</p>}
            />

            <StatRow
              label="Reg. Season Winner"
              valueA={
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{dataA.regularSeasonWinner}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{dataA.regularSeasonRecord}</p>
                </div>
              }
              valueB={
                <div>
                  <p className="text-sm font-bold text-white">{dataB.regularSeasonWinner}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{dataB.regularSeasonRecord}</p>
                </div>
              }
            />

            <StatRow
              label="Total Trades"
              valueA={
                <div className="flex items-center justify-end gap-2">
                  <p className="text-lg font-black text-[#ffd700] tabular-nums">{dataA.totalTrades}</p>
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                </div>
              }
              valueB={
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                  <p className="text-lg font-black text-[#ffd700] tabular-nums">{dataB.totalTrades}</p>
                </div>
              }
            />

            <StatRow
              label="Avg Points / Week"
              valueA={
                <p className="text-lg font-black text-emerald-400 tabular-nums font-mono">
                  {dataA.avgPointsPerWeek.toFixed(1)}
                </p>
              }
              valueB={
                <p className="text-lg font-black text-emerald-400 tabular-nums font-mono">
                  {dataB.avgPointsPerWeek.toFixed(1)}
                </p>
              }
            />

            <StatRow
              label="League High Score"
              valueA={
                <div className="text-right">
                  <p className="text-base font-black text-[#e94560] tabular-nums font-mono">{dataA.leagueHighScore}</p>
                  <p className="text-[10px] text-slate-500">{dataA.leagueHighScorer}</p>
                </div>
              }
              valueB={
                <div>
                  <p className="text-base font-black text-[#e94560] tabular-nums font-mono">{dataB.leagueHighScore}</p>
                  <p className="text-[10px] text-slate-500">{dataB.leagueHighScorer}</p>
                </div>
              }
            />

          </div>
        </section>

        {/* ── Storylines ──────────────────────────────────────────────────── */}
        <section aria-labelledby="storylines-heading" className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="storylines-heading" className="text-base font-black text-white uppercase tracking-wider">
              Season Storylines
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[dataA, dataB].map((data, i) => (
              <div key={data.year} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn(
                    'inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border',
                    i === 0
                      ? 'border-[#ffd700]/40 bg-[#ffd700]/10 text-[#ffd700]'
                      : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                  )}>
                    {data.year}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">{data.storyline}</p>
                <div className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Notable</p>
                  <p className="text-xs text-slate-400 leading-snug">{data.notable}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── League Evolution Table ───────────────────────────────────────── */}
        <section aria-labelledby="evolution-heading" className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <Layers className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="evolution-heading" className="text-2xl font-black text-white">
              League Evolution
            </h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-[#2d4a66] text-slate-400 bg-[#16213e]">
              All 6 Seasons
            </span>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs" aria-label="BMFFFL league evolution by season">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Season</th>
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Champion</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Seed</th>
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Reg. Season Winner</th>
                    <th scope="col" className="px-4 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider">Trades</th>
                    <th scope="col" className="px-4 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider">Avg PPW</th>
                    <th scope="col" className="px-4 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider">High Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {EVOLUTION_ROWS.map((row, idx) => {
                    const isCurrentA = row.year === seasonA;
                    const isCurrentB = row.year === seasonB;
                    const isLatest = row.year === 2025;

                    return (
                      <tr
                        key={row.year}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isCurrentA ? 'ring-1 ring-inset ring-[#ffd700]/20 bg-[#ffd700]/5' :
                          isCurrentB ? 'ring-1 ring-inset ring-blue-500/20 bg-blue-500/5' :
                          idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'font-black tabular-nums',
                              isCurrentA ? 'text-[#ffd700]' :
                              isCurrentB ? 'text-blue-400' :
                              isLatest ? 'text-white' : 'text-slate-300'
                            )}>
                              {row.year}
                            </span>
                            {isCurrentA && (
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-[#ffd700]/40 bg-[#ffd700]/10 text-[#ffd700]">A</span>
                            )}
                            {isCurrentB && (
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-blue-500/30 bg-blue-500/10 text-blue-400">B</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Trophy className="w-3 h-3 text-[#ffd700]/60 shrink-0" aria-hidden="true" />
                            <span className="font-semibold text-white">{row.champion}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black border',
                            row.seed === 1
                              ? 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]'
                              : row.seed >= 4
                              ? 'bg-[#e94560]/10 border-[#e94560]/30 text-[#e94560]'
                              : 'bg-[#2d4a66] border-[#3a5f80] text-slate-300'
                          )}>
                            {row.seed}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-medium">{row.regularWinner}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-300">
                          {row.trades}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-400">
                          {row.avgPPW.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-[#e94560]">
                          {row.highScore.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Totals row */}
                <tfoot>
                  <tr className="bg-[#0f2744] border-t-2 border-[#2d4a66]">
                    <td colSpan={4} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      6-Season Totals / Averages
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-[#ffd700] tabular-nums">
                      {EVOLUTION_ROWS.reduce((s, r) => s + r.trades, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-emerald-400 tabular-nums">
                      {(EVOLUTION_ROWS.reduce((s, r) => s + r.avgPPW, 0) / EVOLUTION_ROWS.length).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-[#e94560] tabular-nums">
                      {Math.max(...EVOLUTION_ROWS.map(r => r.highScore)).toFixed(1)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug">
            Seed column reflects playoff seeding of the eventual champion.
            &ldquo;A&rdquo; and &ldquo;B&rdquo; labels highlight the two seasons currently selected for comparison.
            Avg PPW = league average points per team per week, regular season only.
          </p>
        </section>

        {/* Footer */}
        <p className="text-xs text-center text-slate-600">
          Data reflects BMFFFL league history 2020–2025. Stats are estimates based on league records.
          Full historical data will be available via Sleeper API integration in Phase G.
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
