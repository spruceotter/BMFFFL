import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import { getOwnerToken, ARCHETYPE_LABELS } from '@/lib/owner-tokens';

// ─── Owner Data ───────────────────────────────────────────────────────────────

// All-time champions (ESPN + Sleeper era) — verified 2026-04-25:
// 2016=MLSchools12, 2017=Cogdeill11, 2018=SexMachineAndyD, 2019=MLSchools12
// 2020=Cogdeill11, 2021=MLSchools12, 2022=Grandes, 2023=JuicyBussy, 2024=MLSchools12, 2025=tdtd19844
const OWNERS = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    teamName: 'The Murder Boners',
    championships: [2016, 2019, 2021, 2024],
    runnerUps: [],
    playoffApps: 6,
    wins: 68, losses: 15,
    dynastyRank: 1,
    status: 'Four-time champion (2016, 2019, 2021, 2024). All-time wins leader (.820 win%). Six consecutive playoff appearances. The defining dynasty of the BMFFFL era.',
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    teamName: 'Whale Tails',
    championships: [],
    runnerUps: [2025],
    playoffApps: 2,
    wins: 34, losses: 36,
    dynastyRank: 2,
    status: 'Runner-up 2025 after an 11-3 regular season in 2024. Joined in 2021. One of two favorites for the 2026 championship.',
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    teamName: 'SexMachineAndyD',
    championships: [2018],
    runnerUps: [2021, 2024],
    playoffApps: 4,
    wins: 50, losses: 33,
    dynastyRank: 3,
    status: '2018 ESPN champion. Runner-up in 2021 and 2024. Four Sleeper playoff appearances. The league\'s most consistent multi-era performer.',
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    teamName: 'Juicy Bussy',
    championships: [2023],
    runnerUps: [],
    playoffApps: 5,
    wins: 46, losses: 37,
    dynastyRank: 4,
    status: '2023 champion as the 6th seed. Holds the all-time single-week scoring record (245.80 pts, Week 16 2021). The most explosive offense in the league.',
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    teamName: 'Really Big Rings',
    championships: [],
    runnerUps: [2022],
    playoffApps: 4,
    wins: 44, losses: 39,
    dynastyRank: 5,
    status: '2022 runner-up (lost to Grandes in finals). Reached the 2021 semis. Consistently competitive without the championship breakthrough.',
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    teamName: 'Cogdeill11',
    championships: [2017, 2020],
    runnerUps: [],
    playoffApps: 2,
    wins: 38, losses: 45,
    dynastyRank: 6,
    status: 'Two-time champion (2017 ESPN, 2020 Sleeper). Won the tightest championship on record (203.10–198.34). Has not made the playoffs since 2021.',
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    teamName: 'El Rioux Grandes',
    championships: [2022],
    runnerUps: [],
    playoffApps: 3,
    wins: 42, losses: 41,
    dynastyRank: 7,
    status: '2022 champion. Commissioner and founding member. The fastest title-to-last trajectory in the record: champion in 2022, Moodie Bowl in 2025.',
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    teamName: '14kids0wins/teammoodie',
    championships: [2025],
    runnerUps: [],
    playoffApps: 3,
    wins: 36, losses: 47,
    dynastyRank: 8,
    status: '2025 champion. Reigning champion entering 2026. Dramatic rebuild arc: 3-11 in 2022, champion in 2025.',
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    teamName: 'eldridsm',
    championships: [],
    runnerUps: [2020],
    playoffApps: 3,
    wins: 41, losses: 42,
    dynastyRank: 9,
    status: '2020 runner-up. Eliminated the #1 seed MLSchools12 in the 2020 semis with 181 points. Three playoff appearances (2020, 2022, 2023).',
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    teamName: 'Franks Little Beauties',
    championships: [],
    runnerUps: [2023],
    playoffApps: 2,
    wins: 39, losses: 44,
    dynastyRank: 10,
    status: '2023 runner-up. Eliminated the #1 seed MLSchools12 (13-1) in the 2023 semis with 154.30 points. Dangerous in single-elimination.',
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    teamName: 'Showtyme Boyz',
    championships: [],
    runnerUps: [],
    playoffApps: 2,
    wins: 36, losses: 47,
    dynastyRank: 11,
    status: 'Two playoff appearances (2023, 2025). In 2025 scored 1,990 pts (3rd in league) while going 6-8. The league\'s most underrated team by record.',
  },
  {
    slug: 'escuelas',
    displayName: 'Escuelas',
    teamName: 'Booty Cheeks',
    championships: [],
    runnerUps: [],
    playoffApps: 0,
    wins: 15, losses: 41,
    dynastyRank: 12,
    status: 'Joined 2022. No playoff appearances yet. 2025 was the first season with a winning-ish record (6-8). Long rebuild ahead.',
  },
];

// ─── Sort Logic ───────────────────────────────────────────────────────────────

type SortKey = 'dynastyRank' | 'wins' | 'alpha';

function sortOwners(owners: typeof OWNERS, key: SortKey) {
  return [...owners].sort((a, b) => {
    if (key === 'dynastyRank') return a.dynastyRank - b.dynastyRank;
    if (key === 'wins') return b.wins - a.wins;
    if (key === 'alpha') return a.displayName.localeCompare(b.displayName);
    return 0;
  });
}

// ─── Owner Summary Card ───────────────────────────────────────────────────────

function OwnerSummaryCard({ owner }: { owner: typeof OWNERS[number] }) {
  const isChampion = owner.championships.length > 0;
  const total = owner.wins + owner.losses;
  const winPct = total > 0 ? (owner.wins / total) : 0;
  const winPctStr = winPct.toFixed(3).replace(/^0/, '');
  const token = getOwnerToken(owner.slug);

  return (
    <Link
      href={`/owners/${owner.slug}`}
      className={cn(
        'block rounded-xl p-5 transition-all duration-200',
        'bg-[#16213e] border hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5',
        isChampion
          ? 'border-[#ffd700]/40 hover:border-[#ffd700]/70'
          : 'border-[#2d4a66] hover:border-[#3a5f80]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar — emoji token or fallback initial */}
          <div
            className={cn(
              'w-11 h-11 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              isChampion
                ? 'bg-[#ffd700]/10 border-[#ffd700]'
                : 'bg-[#0f3460] border-[#2d4a66]'
            )}
          >
            {token ? (
              <span className="text-xl leading-none" role="img" aria-label={token.personality}>
                {token.emoji}
              </span>
            ) : (
              <span className={cn('text-lg font-black', isChampion ? 'text-[#ffd700]' : 'text-slate-300')}>
                {owner.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-white truncate leading-tight">{owner.displayName}</p>
            <p className="text-xs text-slate-400 truncate">{owner.teamName}</p>
            {token && (
              <p className="text-[10px] mt-0.5 truncate" style={{ color: token.color }}>
                {token.personality}
              </p>
            )}
          </div>
        </div>

        {/* Dynasty Rank badge */}
        <Badge variant={owner.dynastyRank === 1 ? 'champion' : 'default'} size="sm">
          #{owner.dynastyRank}
        </Badge>
      </div>

      {/* Championship rings */}
      <div className="mb-3">
        {owner.championships.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {owner.championships.map((year) => (
              <span
                key={year}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 text-[#ffd700] text-xs font-bold"
                title={`${year} Champion`}
              >
                <Trophy className="w-3 h-3" aria-hidden="true" />
                {year}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-500 italic">No titles yet</span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col items-center p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Record</span>
          <span className="text-sm font-mono font-bold text-slate-200">{owner.wins}-{owner.losses}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Win%</span>
          <span className="text-sm font-mono font-bold text-[#22c55e]">{winPctStr}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Playoffs</span>
          <span className="text-sm font-mono font-bold text-slate-200">{owner.playoffApps}</span>
        </div>
      </div>

      {/* Status line */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{owner.status}</p>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OwnersIndexPage() {
  const [sortKey, setSortKey] = useState<SortKey>('dynastyRank');
  const sorted = sortOwners(OWNERS, sortKey);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'dynastyRank', label: 'By Dynasty Rank' },
    { key: 'wins', label: 'By All-Time Wins' },
    { key: 'alpha', label: 'Alphabetical' },
  ];

  return (
    <>
      <Head>
        <title>Owners — BMFFFL Dynasty</title>
        <meta name="description" content="All 12 BMFFFL dynasty fantasy football team owners and their career records." />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
              BMFFFL · All 12 Teams
            </p>
            <h1 className="text-4xl font-black text-white">Owners</h1>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-slate-500 uppercase tracking-wider mr-1">Sort:</span>
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150',
                  sortKey === key
                    ? 'bg-[#ffd700] text-[#0d1b2a] font-bold'
                    : 'bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:border-[#3a5f80] hover:text-white'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Owners grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((owner) => (
              <OwnerSummaryCard key={owner.slug} owner={owner} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
