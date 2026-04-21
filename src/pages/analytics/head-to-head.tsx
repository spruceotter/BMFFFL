import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Swords, Info, Flame, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import { StatBadge } from '@/components/ui/StatComponents';

// ─── Owner Data ───────────────────────────────────────────────────────────────

const OWNERS_DATA = [
  { slug: 'cogdeill11',    name: 'Cogdeill11',      rings: 2, wins: 68, losses: 22, playoffApps: 5, dynastyRank: 3  },
  { slug: 'mlschools12',   name: 'MLSchools12',     rings: 1, wins: 55, losses: 35, playoffApps: 4, dynastyRank: 2  },
  { slug: 'rbr',           name: 'rbr',             rings: 1, wins: 52, losses: 38, playoffApps: 4, dynastyRank: 4  },
  { slug: 'juicybussy',    name: 'JuicyBussy',      rings: 1, wins: 48, losses: 42, playoffApps: 3, dynastyRank: 5  },
  { slug: 'tdtd19844',     name: 'tdtd19844',       rings: 1, wins: 45, losses: 45, playoffApps: 3, dynastyRank: 6  },
  { slug: 'sexmachineandy',name: 'SexMachineAndyD', rings: 0, wins: 44, losses: 46, playoffApps: 3, dynastyRank: 7  },
  { slug: 'eldridm20',     name: 'eldridm20',       rings: 0, wins: 42, losses: 48, playoffApps: 2, dynastyRank: 8  },
  { slug: 'tubes94',       name: 'Tubes94',         rings: 0, wins: 35, losses: 35, playoffApps: 1, dynastyRank: 1  },
  { slug: 'grandes',       name: 'Grandes',         rings: 0, wins: 40, losses: 50, playoffApps: 2, dynastyRank: 9  },
  { slug: 'eldridsm',      name: 'eldridsm',        rings: 0, wins: 32, losses: 58, playoffApps: 1, dynastyRank: 11 },
  { slug: 'cmaleski',      name: 'Cmaleski',        rings: 0, wins: 30, losses: 60, playoffApps: 0, dynastyRank: 12 },
  { slug: 'bimfle',        name: 'Bimfle',          rings: 0, wins: 10, losses: 20, playoffApps: 0, dynastyRank: 10 },
];

// ─── H2H Approximation ───────────────────────────────────────────────────────
//
// Derives a rough estimated head-to-head record between any two owners.
// Higher all-time win percentage owners tend to win more matchups.
// This is an approximation — exact records require full Sleeper matchup data.

function estimatedH2H(ownerA: typeof OWNERS_DATA[0], ownerB: typeof OWNERS_DATA[0]): { wins: number; losses: number } {
  const totalA = ownerA.wins + ownerA.losses;
  const totalB = ownerB.wins + ownerB.losses;
  const pctA = totalA > 0 ? ownerA.wins / totalA : 0.5;
  const pctB = totalB > 0 ? ownerB.wins / totalB : 0.5;

  // Approximate games played between these two: about 2 per season they overlap
  // Tubes94 joined 2022 (4 seasons), Bimfle joined 2024 (2 seasons), others 6 seasons
  const seasonsA = ownerA.slug === 'tubes94' ? 4 : ownerA.slug === 'bimfle' ? 2 : 6;
  const seasonsB = ownerB.slug === 'tubes94' ? 4 : ownerB.slug === 'bimfle' ? 2 : 6;
  const overlapSeasons = Math.min(seasonsA, seasonsB);
  const totalGames = overlapSeasons * 2; // ~2 matchups per season

  if (totalGames === 0) return { wins: 0, losses: 0 };

  // Win probability weighted by relative strength
  const combined = pctA + pctB;
  const probA = combined > 0 ? pctA / combined : 0.5;

  const estWins = Math.round(probA * totalGames);
  const estLosses = totalGames - estWins;

  return { wins: estWins, losses: estLosses };
}

// ─── Notable Rivalries ────────────────────────────────────────────────────────

interface Rivalry {
  ownerA: string;
  ownerB: string;
  title: string;
  description: string;
  icon: 'flame' | 'trophy' | 'swords';
}

const NOTABLE_RIVALRIES: Rivalry[] = [
  {
    ownerA: 'Cogdeill11',
    ownerB: 'MLSchools12',
    title: 'The GOAT Debate',
    description: '2020 championship matchup, multiple playoff crossings across six seasons. The two most decorated managers in BMFFFL history trading blows at the top.',
    icon: 'trophy',
  },
  {
    ownerA: 'MLSchools12',
    ownerB: 'SexMachineAndyD',
    title: 'The Two-Final Rivalry',
    description: 'MLSchools12 and MilwaukeeBrowns (SexMachineAndyD) met in the championship game TWICE — 2021 and 2024. MLSchools12 won both. SexMachineAndyD remains the only team to lose two championship games to the same opponent.',
    icon: 'trophy',
  },
  {
    ownerA: 'Grandes',
    ownerB: 'rbr',
    title: '2022 Championship — Commissioner Takes All',
    description: 'Grandes defeated rbr 137.82–115.08 in the 2022 championship game, with the league Commissioner claiming the title. rbr\'s best season (10-4) ended in heartbreak on the biggest stage.',
    icon: 'trophy',
  },
  {
    ownerA: 'JuicyBussy',
    ownerB: 'eldridm20',
    title: '2023 Championship — The Cinderella Final',
    description: 'JuicyBussy completed the most improbable championship run in BMFFFL history, defeating eldridm20 in the 2023 final as the #6 seed. Both teams had eliminated MLSchools12 (13-1) earlier in the bracket.',
    icon: 'swords',
  },
  {
    ownerA: 'tdtd19844',
    ownerB: 'Tubes94',
    title: '2025 Championship — The Resurrection Final',
    description: 'tdtd19844 completed the greatest comeback arc in league history — from 3-11 in 2022 to 2025 champion. Defeated Tubes94 152.92–135.08 in the final, capping a 3-0 playoff run that included eliminating #1 seed MLSchools12.',
    icon: 'trophy',
  },
];

// ─── Dominant Matchup Rankings (approximate from playoff history) ─────────────

const DOMINANCE_RANKINGS = [
  { name: 'Cogdeill11',      distinctOpponents: 8, playoffWins: 7, note: 'Most playoff wins all-time' },
  { name: 'MLSchools12',     distinctOpponents: 7, playoffWins: 5, note: '2021 & 2024 champion, 6 straight playoff appearances' },
  { name: 'rbr',             distinctOpponents: 6, playoffWins: 4, note: '2022 runner-up, strong career record' },
  { name: 'JuicyBussy',      distinctOpponents: 5, playoffWins: 4, note: '2023 champion — Cinderella run as the #6 seed' },
  { name: 'tdtd19844',       distinctOpponents: 5, playoffWins: 3, note: '2022 champion' },
  { name: 'SexMachineAndyD', distinctOpponents: 5, playoffWins: 2, note: 'Consistent playoff presence, no ring yet' },
  { name: 'Tubes94',         distinctOpponents: 3, playoffWins: 2, note: 'High ceiling since joining in 2022' },
  { name: 'eldridm20',       distinctOpponents: 4, playoffWins: 1, note: 'Playoff experience, competitive' },
  { name: 'Grandes',         distinctOpponents: 3, playoffWins: 1, note: 'Occasional playoff entrant' },
  { name: 'eldridsm',        distinctOpponents: 2, playoffWins: 0, note: 'One playoff appearance all-time' },
  { name: 'Bimfle',          distinctOpponents: 0, playoffWins: 0, note: 'Still establishing footprint (joined 2024)' },
  { name: 'Cmaleski',        distinctOpponents: 0, playoffWins: 0, note: 'No playoff appearances — rebuilding' },
];

// ─── Cell Color for H2H Win % ─────────────────────────────────────────────────

function getH2HCellColor(wins: number, losses: number, isSelf: boolean): string {
  if (isSelf) return 'bg-[#0d1b2a] text-slate-700';
  if (wins === 0 && losses === 0) return 'bg-slate-800/30 text-slate-600';
  const total = wins + losses;
  const pct = wins / total;
  if (pct >= 0.7)  return 'bg-emerald-500/20 text-emerald-300 font-semibold';
  if (pct >= 0.55) return 'bg-blue-500/15 text-blue-300';
  if (pct <= 0.3)  return 'bg-[#e94560]/20 text-[#e94560]/80';
  if (pct <= 0.45) return 'bg-orange-500/15 text-orange-300';
  return 'bg-slate-700/30 text-slate-400';
}

// ─── Rivalry Icon ─────────────────────────────────────────────────────────────

function RivalryIcon({ type }: { type: Rivalry['icon'] }) {
  if (type === 'flame') return <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />;
  if (type === 'trophy') return <Trophy className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />;
  return <Swords className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HeadToHeadPage() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Build the full 12×12 approximation matrix
  const matrix = useMemo(() => {
    return OWNERS_DATA.map(rowOwner =>
      OWNERS_DATA.map(colOwner => {
        if (rowOwner.slug === colOwner.slug) return { wins: -1, losses: -1, self: true };
        const result = estimatedH2H(rowOwner, colOwner);
        return { wins: result.wins, losses: result.losses, self: false };
      })
    );
  }, []);

  return (
    <>
      <Head>
        <title>Head-to-Head Records — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football head-to-head records matrix, notable rivalries, and all-time matchup dominance rankings."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Swords className="w-3.5 h-3.5" aria-hidden="true" />
            Head-to-Head
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            Head-to-Head Records
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            All-time matchup history across six seasons of BMFFFL dynasty competition.
          </p>
        </header>

        {/* Phase G data note */}
        <div className="mb-8 rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-blue-400 mb-1">Live H2H Data — Phase G</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Exact head-to-head records require full matchup data from the Sleeper API.
              The matrix below uses approximations derived from all-time win percentages and schedule overlap.
              Precise per-matchup records, weekly scores, and head-to-head streaks will be available in Phase G.
            </p>
          </div>
        </div>

        {/* H2H Matrix */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-white">Approximate All-Time Matrix</h2>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">70%+ win rate</span>
              <span className="px-2 py-1 rounded bg-blue-500/15 text-blue-300 border border-blue-500/20">55–70%</span>
              <span className="px-2 py-1 rounded bg-slate-700/30 text-slate-400 border border-slate-700/40">45–55%</span>
              <span className="px-2 py-1 rounded bg-orange-500/15 text-orange-300 border border-orange-500/20">30–45%</span>
              <span className="px-2 py-1 rounded bg-[#e94560]/20 text-[#e94560]/80 border border-[#e94560]/20">Under 30%</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs" aria-label="Head-to-head approximation matrix">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[#0f2744] z-10 min-w-[110px]">
                      Owner ↓ vs →
                    </th>
                    {OWNERS_DATA.map((o, ci) => (
                      <th
                        key={o.slug}
                        scope="col"
                        className={cn(
                          'px-2 py-3 text-center font-semibold uppercase tracking-wider whitespace-nowrap transition-colors',
                          hoveredCol === ci ? 'text-[#ffd700] bg-[#ffd700]/5' : 'text-slate-400'
                        )}
                        style={{ minWidth: '56px' }}
                      >
                        <span className="inline-block max-w-[48px] truncate" title={o.name}>
                          {o.name.slice(0, 6)}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {OWNERS_DATA.map((rowOwner, ri) => (
                    <tr
                      key={rowOwner.slug}
                      className={cn(
                        'transition-colors',
                        hoveredRow === ri ? 'bg-[#1f3550]' : ri % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                      onMouseEnter={() => setHoveredRow(ri)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Row label */}
                      <td
                        className={cn(
                          'px-3 py-2.5 font-semibold whitespace-nowrap sticky left-0 z-10 transition-colors',
                          hoveredRow === ri ? 'bg-[#1f3550] text-white' : ri % 2 === 0 ? 'bg-[#1a2d42] text-slate-200' : 'bg-[#162638] text-slate-200'
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {rowOwner.rings > 0 && (
                            <Trophy className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />
                          )}
                          {rowOwner.name}
                        </div>
                      </td>

                      {/* Matrix cells */}
                      {matrix[ri].map((cell, ci) => (
                        <td
                          key={OWNERS_DATA[ci].slug}
                          className="px-2 py-2 text-center"
                          onMouseEnter={() => setHoveredCol(ci)}
                          onMouseLeave={() => setHoveredCol(null)}
                        >
                          <span
                            className={cn(
                              'inline-flex items-center justify-center rounded px-1.5 py-1 text-[11px] tabular-nums transition-colors',
                              cell.self
                                ? 'bg-[#0d1b2a] text-slate-700 select-none'
                                : getH2HCellColor(cell.wins, cell.losses, cell.self)
                            )}
                            title={cell.self ? rowOwner.name : `${rowOwner.name} vs ${OWNERS_DATA[ci].name}: ~${cell.wins}W-${cell.losses}L`}
                          >
                            {cell.self ? '—' : `${cell.wins}-${cell.losses}`}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug">
            * All records are approximations derived from all-time win percentages and seasons of overlap. Values are not sourced from actual matchup data.
            Phase G will replace this matrix with exact historical records from the Sleeper API.
          </p>
        </section>

        {/* Notable Rivalries */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-5 h-5 text-orange-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white">Notable Rivalries</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {NOTABLE_RIVALRIES.map((rivalry, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 hover:border-[#3a5f80] transition-colors"
              >
                {/* Matchup header */}
                <div className="flex items-start gap-3 mb-3">
                  <RivalryIcon type={rivalry.icon} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-tight mb-1">{rivalry.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatBadge label="" value={rivalry.ownerA} color="gold" size="sm" />
                      <span className="text-slate-500 text-xs font-bold">vs</span>
                      <StatBadge label="" value={rivalry.ownerB} color="blue" size="sm" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {rivalry.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Matchup Dominance Rankings */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white">Matchup Dominance Rankings</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5 max-w-2xl">
            Approximate ranking of who has beaten the most distinct opponents across regular season and playoff matchups.
            Based on all-time records and playoff results — not exact Sleeper data.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Matchup dominance rankings">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-12">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Owner</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Distinct Opp. Beaten</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Playoff Wins</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {DOMINANCE_RANKINGS.map((row, idx) => {
                    const owner = OWNERS_DATA.find(o => o.name === row.name);
                    const isTop3 = idx < 3;
                    return (
                      <tr
                        key={row.name}
                        className={cn(
                          'transition-colors hover:bg-[#1f3550]',
                          idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                          isTop3 && 'ring-1 ring-inset ring-[#ffd700]/10'
                        )}
                      >
                        <td className={cn(
                          'px-4 py-3 font-black tabular-nums text-base',
                          isTop3 ? 'text-[#ffd700]' : 'text-slate-600'
                        )}>
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {owner && owner.rings > 0 && (
                              <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                            )}
                            <span className="font-semibold text-white">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center w-8 h-7 rounded text-sm font-bold tabular-nums',
                            row.distinctOpponents >= 6 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                            row.distinctOpponents >= 3 ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                            row.distinctOpponents > 0  ? 'bg-slate-500/15 text-slate-400 border border-slate-500/20' :
                            'text-slate-600'
                          )}>
                            {row.distinctOpponents > 0 ? row.distinctOpponents : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            'font-bold tabular-nums',
                            row.playoffWins >= 5 ? 'text-[#ffd700]' :
                            row.playoffWins >= 3 ? 'text-emerald-400' :
                            row.playoffWins >= 1 ? 'text-blue-400' :
                            'text-slate-600'
                          )}>
                            {row.playoffWins > 0 ? row.playoffWins : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                          {row.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Info callout */}
        <div className="mt-10 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-400 leading-relaxed">
            The H2H matrix and dominance rankings above are editorial approximations based on all-time win percentages,
            seasons active, and playoff results. They do not represent exact per-matchup records.
            Phase G will integrate full historical matchup data from the Sleeper API, enabling exact records,
            winning streaks, average score differentials, and more.
          </p>
        </div>

        <p className="mt-8 text-xs text-center text-slate-600">
          Rivalry notes sourced from league history and playoff records. Matrix values are estimates. Phase G delivers exact data.
        </p>

      </div>
    </>
  );
}
