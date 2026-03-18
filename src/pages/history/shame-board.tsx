import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { TrendingDown, ArrowUp, ChevronUp, ChevronDown, Trophy, Flame } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MoodieBowlEntry {
  year: number;
  owner: string;
  note: string;
  confirmed: boolean;
}

interface InfamyCard {
  year: number;
  owner: string;
  record: string;
  wins: number;
  losses: number;
  title: string;
  description: string;
  irony?: string;
}

interface RedemptionArc {
  owner: string;
  lowYear: number;
  lowRecord: string;
  highYear: number;
  highResult: string;
  description: string;
}

interface WorstSeasonRow {
  rank: number;
  owner: string;
  season: number;
  record: string;
  wins: number;
  losses: number;
  pointsFor: number;
  notes: string;
  isMoodieBowl?: boolean;
}

type SortKey = 'rank' | 'owner' | 'season' | 'wins' | 'losses' | 'pointsFor';
type SortDir = 'asc' | 'desc';

// ─── Data ─────────────────────────────────────────────────────────────────────

const MOODIE_BOWL_RESULTS: MoodieBowlEntry[] = [
  {
    year: 2025,
    owner: 'Grandes',
    note: 'The Commissioner\'s lowest moment. Moodie Bowl confirmed.',
    confirmed: true,
  },
  {
    year: 2024,
    owner: 'Escuelas',
    note: 'Worst regular-season record (3-11, 1,312 pts). Historically tracked.',
    confirmed: false,
  },
  {
    year: 2023,
    owner: 'Escuelas',
    note: 'Worst regular-season record (2-12). Historically tracked.',
    confirmed: false,
  },
  {
    year: 2022,
    owner: 'tdtd19844',
    note: 'Worst regular-season record (3-11). Historically tracked.',
    confirmed: false,
  },
  {
    year: 2021,
    owner: 'Tubes94',
    note: 'Worst regular-season record (2-12). Debut season. Historically tracked.',
    confirmed: false,
  },
  {
    year: 2020,
    owner: 'eldridm20 / Grandes',
    note: 'Both finished 4-9. Historically tracked.',
    confirmed: false,
  },
];

const INFAMY_CARDS: InfamyCard[] = [
  {
    year: 2021,
    owner: 'Tubes94',
    record: '2-12',
    wins: 2,
    losses: 12,
    title: 'The Worst Debut in BMFFFL History',
    description:
      '"Swamp Donkey\'s" went 2-12 in their inaugural season — a record that stood as the sole 2-12 season for two years. They renamed the team "Burn it all" the following season, which about sums it up.',
    irony: 'Went on to become the 2025 championship runner-up.',
  },
  {
    year: 2023,
    owner: 'Escuelas',
    record: '2-12',
    wins: 2,
    losses: 12,
    title: 'History Repeated',
    description:
      'The second 2-12 season in BMFFFL history. Escuelas matched Tubes94\'s dubious record almost to the week. They then followed it up with a 3-11 season in 2024 — becoming the only owner with back-to-back sub-4-win campaigns.',
    irony: undefined,
  },
  {
    year: 2022,
    owner: 'tdtd19844',
    record: '3-11',
    wins: 3,
    losses: 11,
    title: 'The Depths of the Rebuild',
    description:
      'Three wins. Eleven losses. The 2022 season looked like the end for tdtd19844. It was not.',
    irony: 'Three years later: 2025 Champion.',
  },
  {
    year: 2025,
    owner: 'Grandes',
    record: '4-10 (Moodie Bowl)',
    wins: 4,
    losses: 10,
    title: "The Commissioner's Lowest Moment",
    description:
      'Won the 2022 championship. Finished last in 2025. The fastest championship-to-Moodie arc in league history — three years from title to toilet bowl.',
    irony: undefined,
  },
];

const REDEMPTION_ARCS: RedemptionArc[] = [
  {
    owner: 'Tubes94',
    lowYear: 2021,
    lowRecord: '2-12',
    highYear: 2025,
    highResult: 'Runner-Up',
    description:
      'The greatest single rebuild arc in BMFFFL history. From the worst debut season ever recorded to the championship game — four years of grinding, drafting, and not giving up.',
  },
  {
    owner: 'tdtd19844',
    lowYear: 2022,
    lowRecord: '3-11',
    highYear: 2025,
    highResult: 'CHAMPION',
    description:
      'Bottom to champion in three years. tdtd19844 turned the 2022 basement into fuel, rebuilt through the draft, and hoisted the trophy in 2025. The ultimate revenge arc.',
  },
];

const WORST_SEASONS: WorstSeasonRow[] = [
  { rank: 1,  owner: 'Tubes94',    season: 2021, record: '2-12',  wins: 2,  losses: 12, pointsFor: 1475.72, notes: 'Debut season' },
  { rank: 2,  owner: 'Escuelas',   season: 2023, record: '2-12',  wins: 2,  losses: 12, pointsFor: 1526.06, notes: '—' },
  { rank: 3,  owner: 'tdtd19844',  season: 2022, record: '3-11',  wins: 3,  losses: 11, pointsFor: 1529.58, notes: '—' },
  { rank: 4,  owner: 'Escuelas',   season: 2024, record: '3-11',  wins: 3,  losses: 11, pointsFor: 1312.36, notes: 'Lowest single-season points' },
  { rank: 5,  owner: 'Tubes94',    season: 2022, record: '4-10',  wins: 4,  losses: 10, pointsFor: 1340.28, notes: '—' },
  { rank: 6,  owner: 'Cogdeill11', season: 2024, record: '4-10',  wins: 4,  losses: 10, pointsFor: 1670.02, notes: '—' },
  { rank: 7,  owner: 'Cmaleski',   season: 2024, record: '4-10',  wins: 4,  losses: 10, pointsFor: 1718.72, notes: '—' },
  { rank: 8,  owner: 'Grandes',    season: 2025, record: '4-10',  wins: 4,  losses: 10, pointsFor: 1548.32, notes: 'Moodie Bowl', isMoodieBowl: true },
  { rank: 9,  owner: 'Grandes',    season: 2020, record: '4-9',   wins: 4,  losses: 9,  pointsFor: 1697.70, notes: '—' },
  { rank: 10, owner: 'eldridm20',  season: 2020, record: '4-9',   wins: 4,  losses: 9,  pointsFor: 1625.74, notes: '—' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function winPct(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '.000';
  return (wins / total).toFixed(3).replace('0.', '.');
}

function sortRows(rows: WorstSeasonRow[], key: SortKey, dir: SortDir): WorstSeasonRow[] {
  return [...rows].sort((a, b) => {
    let av: string | number;
    let bv: string | number;

    switch (key) {
      case 'rank':      av = a.rank;       bv = b.rank;       break;
      case 'owner':     av = a.owner;      bv = b.owner;      break;
      case 'season':    av = a.season;     bv = b.season;     break;
      case 'wins':      av = a.wins;       bv = b.wins;       break;
      case 'losses':    av = a.losses;     bv = b.losses;     break;
      case 'pointsFor': av = a.pointsFor;  bv = b.pointsFor;  break;
      default:          av = a.rank;       bv = b.rank;
    }

    if (typeof av === 'string' && typeof bv === 'string') {
      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortButton({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === currentKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider',
        'transition-colors duration-100 select-none',
        active ? 'text-[#e94560]' : 'text-slate-400 hover:text-white',
        className
      )}
      aria-sort={active ? (currentDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      <span className="flex flex-col -space-y-1" aria-hidden="true">
        <ChevronUp
          className={cn(
            'w-2.5 h-2.5',
            active && currentDir === 'asc' ? 'text-[#e94560]' : 'text-slate-600'
          )}
        />
        <ChevronDown
          className={cn(
            'w-2.5 h-2.5',
            active && currentDir === 'desc' ? 'text-[#e94560]' : 'text-slate-600'
          )}
        />
      </span>
    </button>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ShameBoardPage() {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sortedRows = sortRows(WORST_SEASONS, sortKey, sortDir);

  return (
    <>
      <Head>
        <title>Shame Board — BMFFFL</title>
        <meta
          name="description"
          content="The BMFFFL Bottom Dwellers Hall of Dishonor — celebrating the Moodie Bowl, worst seasons, and the greatest rebuild arcs in dynasty history."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-150"
          >
            <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" aria-hidden="true" />
            League History
          </Link>
        </nav>

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <header className="mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            Hall of Dishonor
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-3">
            Shame Board
          </h1>
          <p className="text-slate-400 text-lg mb-6">
            The BMFFFL Bottom Dwellers Hall of Dishonor
          </p>

          {/* Bimfle intro */}
          <blockquote className="max-w-2xl mx-auto sm:mx-0 rounded-xl bg-[#16213e] border border-[#2d4a66] p-5 text-left">
            <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
              "I document all outcomes with equal care and dignity. Every dynasty requires a
              champion of the consolation bracket. The records below are preserved not out of
              cruelty, but out of respect for the full arc of competition. The basement has
              produced some of this league's greatest stories."
            </p>
            <footer className="text-xs text-[#ffd700] font-semibold not-italic tracking-wide">
              ~Love, Bimfle
            </footer>
          </blockquote>
        </header>

        {/* ── The Moodie Bowl ───────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="moodie-bowl-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#e94560]/10 border border-[#e94560]/30 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            </div>
            <h2
              id="moodie-bowl-heading"
              className="text-2xl font-black text-white"
            >
              The Moodie Bowl
            </h2>
          </div>

          <div className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 p-6 mb-6">
            <p className="text-slate-300 text-sm leading-relaxed">
              At the end of every BMFFFL season, while the glory-seekers compete in the
              championship bracket, two managers fight a different battle:{' '}
              <span className="text-white font-bold">the Moodie Bowl</span> — the consolation
              bracket final. The winner earns the dubious honor of "not last." The loser earns
              last place, the worst draft pick, and full Shame Board immortality. It is contested
              with real emotion, because nobody wants to be the one staring up from the bottom.
            </p>
          </div>

          {/* Moodie Bowl results list */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
            <div className="bg-[#0f2744] border-b border-[#2d4a66] px-5 py-3 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Moodie Bowl — Known Results
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/20 text-[#e94560] font-semibold uppercase tracking-wider">
                Last Place
              </span>
            </div>
            <ul className="divide-y divide-[#1e3347]">
              {MOODIE_BOWL_RESULTS.map((entry, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <li
                    key={entry.year}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-4',
                      isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}
                  >
                    {/* Year */}
                    <span className="text-2xl font-black text-[#e94560] tabular-nums w-16 shrink-0">
                      {entry.year}
                    </span>

                    {/* Owner + confirmed badge */}
                    <div className="flex items-center gap-2 w-40 shrink-0">
                      <span className="text-white font-bold text-sm">{entry.owner}</span>
                      {entry.confirmed && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e94560]/20 text-[#e94560] font-bold uppercase tracking-wider border border-[#e94560]/30">
                          Confirmed
                        </span>
                      )}
                    </div>

                    {/* Note */}
                    <span className="text-xs text-slate-400 leading-relaxed">
                      {entry.note}
                      {!entry.confirmed && (
                        <span className="ml-1.5 text-slate-600 italic">
                          (pre-tracking era — worst regular-season record used as proxy)
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── Worst Seasons Hall of Infamy ──────────────────────────────── */}
        <section className="mb-16" aria-labelledby="infamy-heading">
          <h2
            id="infamy-heading"
            className="text-2xl font-black text-white mb-6"
          >
            Worst Seasons — Hall of Infamy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INFAMY_CARDS.map((card) => (
              <article
                key={`${card.owner}-${card.year}`}
                className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-6 flex flex-col gap-4 hover:border-[#e94560]/40 transition-colors duration-200"
              >
                {/* Year + record */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-5xl font-black text-[#e94560] leading-none tabular-nums">
                    {card.year}
                  </span>
                  <div className="text-right">
                    <div className="text-white font-black text-base leading-tight">{card.owner}</div>
                    <div className="font-mono font-bold text-sm text-slate-300 mt-0.5">{card.record}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      .{String(Math.round((card.wins / (card.wins + card.losses)) * 1000)).padStart(3, '0')}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-white leading-snug">{card.title}</h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{card.description}</p>

                {/* Irony note */}
                {card.irony && (
                  <div className="border-t border-[#2d4a66] pt-3 flex items-start gap-2">
                    <ArrowUp
                      className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-xs text-[#ffd700] font-semibold italic leading-snug">
                      {card.irony}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ── Rebuild Redemption ────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="redemption-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            </div>
            <h2
              id="redemption-heading"
              className="text-2xl font-black text-white"
            >
              Rebuild Redemption Arcs
            </h2>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl">
            The Shame Board is not just a record of failure — it is a testament to resilience.
            Some of the league's greatest comeback stories began at the very bottom of this page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REDEMPTION_ARCS.map((arc) => (
              <article
                key={arc.owner}
                className="rounded-xl bg-[#16213e] border border-[#ffd700]/20 p-6 flex flex-col gap-5 hover:border-[#ffd700]/50 transition-colors duration-200"
              >
                {/* Owner name */}
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                  <span className="text-white font-black text-lg leading-none">{arc.owner}</span>
                </div>

                {/* Arc timeline */}
                <div className="flex items-center gap-3">
                  {/* Low point */}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-2xl font-black text-[#e94560] tabular-nums leading-none">
                      {arc.lowYear}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{arc.lowRecord}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">Bottom</span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full h-px bg-gradient-to-r from-[#e94560] to-[#ffd700]" />
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">rebuild</span>
                  </div>

                  {/* High point */}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-2xl font-black text-[#ffd700] tabular-nums leading-none">
                      {arc.highYear}
                    </span>
                    <span className="text-xs font-bold text-[#ffd700]">{arc.highResult}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">Peak</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">{arc.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Bottom 10 Worst Seasons Table ─────────────────────────────── */}
        <section className="mb-16" aria-labelledby="bottom10-heading">
          <h2
            id="bottom10-heading"
            className="text-2xl font-black text-white mb-2"
          >
            Bottom 10 Worst Regular Seasons
          </h2>
          <p className="text-slate-500 text-xs mb-6">
            Ranked by wins (ascending), then losses (descending), then points for (ascending).
            Click column headers to sort.
          </p>

          <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
            <div className="overflow-x-auto">
              <table
                className="min-w-full text-sm"
                aria-label="Bottom 10 worst regular seasons in BMFFFL history"
              >
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left w-14">
                      <SortButton
                        label="Rank"
                        sortKey="rank"
                        currentKey={sortKey}
                        currentDir={sortDir}
                        onSort={handleSort}
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-left min-w-[130px]">
                      <SortButton
                        label="Owner"
                        sortKey="owner"
                        currentKey={sortKey}
                        currentDir={sortDir}
                        onSort={handleSort}
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-center w-20">
                      <SortButton
                        label="Season"
                        sortKey="season"
                        currentKey={sortKey}
                        currentDir={sortDir}
                        onSort={handleSort}
                        className="justify-center"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-center w-20">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Record
                      </span>
                    </th>
                    <th scope="col" className="px-4 py-3 text-center w-16">
                      <SortButton
                        label="W"
                        sortKey="wins"
                        currentKey={sortKey}
                        currentDir={sortDir}
                        onSort={handleSort}
                        className="justify-center"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-center w-16">
                      <SortButton
                        label="L"
                        sortKey="losses"
                        currentKey={sortKey}
                        currentDir={sortDir}
                        onSort={handleSort}
                        className="justify-center"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-center w-24">
                      <SortButton
                        label="Pts For"
                        sortKey="pointsFor"
                        currentKey={sortKey}
                        currentDir={sortDir}
                        onSort={handleSort}
                        className="justify-center"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-left min-w-[160px]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Notes
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1e3347]">
                  {sortedRows.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    const isVeryBad = row.wins <= 2;
                    const isMoodie = row.isMoodieBowl === true;

                    return (
                      <tr
                        key={`${row.owner}-${row.season}`}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                          isVeryBad && 'ring-1 ring-inset ring-[#e94560]/20'
                        )}
                      >
                        {/* Rank */}
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'text-sm font-black tabular-nums',
                              row.rank === 1 ? 'text-[#e94560]' : 'text-slate-500'
                            )}
                          >
                            #{row.rank}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{row.owner}</span>
                            {isMoodie && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e94560]/15 text-[#e94560] font-bold uppercase tracking-wider border border-[#e94560]/25">
                                Moodie
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Season */}
                        <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums">
                          {row.season}
                        </td>

                        {/* Record */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              'font-mono font-bold text-sm',
                              isVeryBad ? 'text-[#e94560]' : 'text-slate-300'
                            )}
                          >
                            {row.record}
                          </span>
                        </td>

                        {/* Wins */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              'font-mono font-semibold text-sm',
                              row.wins <= 2 ? 'text-[#e94560]' : 'text-[#22c55e]'
                            )}
                          >
                            {row.wins}
                          </span>
                        </td>

                        {/* Losses */}
                        <td className="px-4 py-3 text-center font-mono font-semibold text-[#ef4444] text-sm">
                          {row.losses}
                        </td>

                        {/* Points For */}
                        <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums text-xs">
                          {row.pointsFor.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        {/* Notes */}
                        <td className="px-4 py-3 text-xs text-slate-500 italic">
                          {row.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-600 italic">
            * Escuelas 2024 holds the record for lowest single-season points (1,312.36) in
            BMFFFL history, despite not holding the worst win-loss record.
          </p>
        </section>

        {/* ── Back to History ───────────────────────────────────────────── */}
        <div className="border-t border-[#2d4a66] pt-8">
          <Link
            href="/history"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-5 py-3',
              'bg-[#16213e] border-[#2d4a66] text-slate-300 text-sm font-semibold',
              'hover:border-[#ffd700]/50 hover:text-[#ffd700] hover:bg-[#1a2d42]',
              'transition-all duration-150'
            )}
          >
            <ArrowUp className="w-4 h-4 rotate-[-90deg]" aria-hidden="true" />
            Back to League History
          </Link>
        </div>

      </div>
    </>
  );
}
