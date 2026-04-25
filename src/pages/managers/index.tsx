import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Star, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';

// ─── Manager Data ─────────────────────────────────────────────────────────────

interface Manager {
  slug: string;
  displayName: string;
  teamName: string;
  championships: number[];
  runnerUps: number[];
  overallRecord: { wins: number; losses: number };
  playoffApps: number;
  dynastyRank: number;
  tagline: string;
}

// Champion history validated 2026-04-25. ESPN era (2016-2019) API-verified via lm-api-reads.fantasy.espn.com.
// Sleeper era (2020-2025) verified from SQLite DB.
// Win/loss records: ALL-TIME (ESPN 2016-2019 + Sleeper 2020-2025).
// Sleeper-only owners (joined 2021+): Tubes94, eldridm20, MCSchools — no ESPN era.
const MANAGERS: Manager[] = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    teamName: 'The Murder Boners',
    championships: [2016, 2019, 2021, 2024],
    runnerUps: [2018],
    overallRecord: { wins: 114, losses: 21 },
    playoffApps: 10,
    dynastyRank: 1,
    tagline: "Dynasty's undisputed king — 4x champion (2016, 2019, 2021, 2024)",
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    teamName: 'Earn it',
    championships: [2017, 2020],
    runnerUps: [],
    overallRecord: { wins: 67, losses: 68 },
    playoffApps: 5,
    dynastyRank: 2,
    tagline: '2x champion (2017, 2020) — founding dynasty member',
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    teamName: 'Stand Against Trade Rape',
    championships: [2018],
    runnerUps: [2021, 2024],
    overallRecord: { wins: 78, losses: 57 },
    playoffApps: 6,
    dynastyRank: 3,
    tagline: '2018 champion, 2x runner-up — elite consistency',
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    teamName: 'Juicy Bussy',
    championships: [2023],
    runnerUps: [],
    overallRecord: { wins: 67, losses: 68 },
    playoffApps: 5,
    dynastyRank: 4,
    tagline: '2023 champion — most explosive offense in league history',
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    teamName: 'El Rioux Grandes',
    championships: [2022],
    runnerUps: [2016],
    overallRecord: { wins: 71, losses: 64 },
    playoffApps: 5,
    dynastyRank: 5,
    tagline: '2022 champion — league commissioner',
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    teamName: 'THE Shameful Saggy sack',
    championships: [2025],
    runnerUps: [],
    overallRecord: { wins: 55, losses: 80 },
    playoffApps: 4,
    dynastyRank: 6,
    tagline: '2025 champion — the ultimate dark horse run',
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    teamName: 'Whale Tails',
    championships: [],
    runnerUps: [2025],
    overallRecord: { wins: 34, losses: 36 },
    playoffApps: 2,
    dynastyRank: 7,
    tagline: '2025 runner-up — rising contender',
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    teamName: 'Franks Little Beauties',
    championships: [],
    runnerUps: [2023],
    overallRecord: { wins: 39, losses: 44 },
    playoffApps: 3,
    dynastyRank: 8,
    tagline: '2023 runner-up — consistent playoff finisher',
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    teamName: 'Really Big Rings',
    championships: [],
    runnerUps: [2019, 2022],
    overallRecord: { wins: 73, losses: 62 },
    playoffApps: 8,
    dynastyRank: 9,
    tagline: '2019 & 2022 runner-up — 8x playoffs, most appearances without a title',
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    teamName: 'eldridsm',
    championships: [],
    runnerUps: [2020],
    overallRecord: { wins: 75, losses: 60 },
    playoffApps: 6,
    dynastyRank: 10,
    tagline: '2x runner-up (2017 ESPN, 2020 Sleeper) — 6x playoffs across ESPN and Sleeper eras',
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    teamName: 'Showtyme Boyz',
    championships: [],
    runnerUps: [],
    overallRecord: { wins: 55, losses: 80 },
    playoffApps: 4,
    dynastyRank: 11,
    tagline: 'Consistent weekly scorer — building toward a title',
  },
  {
    slug: 'mcschools',
    displayName: 'MCSchools',
    teamName: 'Booty Cheeks',
    championships: [],
    runnerUps: [],
    overallRecord: { wins: 20, losses: 63 },
    playoffApps: 0,
    dynastyRank: 12,
    tagline: 'Commissioner\'s brother — the rivalry that shaped the league',
  },
];

// ─── Manager Card ─────────────────────────────────────────────────────────────

function ManagerCard({ manager }: { manager: Manager }) {
  const isChampion = manager.championships.length > 0;
  const total = manager.overallRecord.wins + manager.overallRecord.losses;
  const winPct = total > 0 ? (manager.overallRecord.wins / total) : 0;
  const winPctStr = winPct.toFixed(3).replace(/^0/, '');

  return (
    <Link
      href={`/managers/${manager.slug}`}
      className={cn(
        'block rounded-xl p-5 transition-all duration-200',
        'bg-[#16213e] border hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5',
        isChampion
          ? 'border-[#ffd700]/40 hover:border-[#ffd700]/70'
          : 'border-[#2d4a66] hover:border-[#3a5f80]'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={cn(
              'w-11 h-11 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              isChampion
                ? 'bg-[#ffd700]/10 border-[#ffd700]'
                : 'bg-[#0f3460] border-[#2d4a66]'
            )}
          >
            <span
              className={cn(
                'text-lg font-black',
                isChampion ? 'text-[#ffd700]' : 'text-slate-300'
              )}
            >
              {manager.displayName.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <p className="font-bold text-white truncate leading-tight">
              {manager.displayName}
            </p>
            <p className="text-xs text-slate-400 truncate">{manager.teamName}</p>
          </div>
        </div>

        {/* Dynasty rank badge */}
        <Badge
          variant={manager.dynastyRank === 1 ? 'champion' : 'default'}
          size="sm"
        >
          #{manager.dynastyRank}
        </Badge>
      </div>

      {/* Championship rings */}
      <div className="mb-3 min-h-[1.5rem]">
        {manager.championships.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {manager.championships.map((year) => (
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
        ) : manager.runnerUps.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {manager.runnerUps.map((year) => (
              <span
                key={year}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/20 border border-slate-500/40 text-slate-300 text-xs font-semibold"
                title={`${year} Runner-Up`}
              >
                <Star className="w-3 h-3" aria-hidden="true" />
                {year} RU
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
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
            Record
          </span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {manager.overallRecord.wins}-{manager.overallRecord.losses}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
            Win%
          </span>
          <span className="text-sm font-mono font-bold text-[#22c55e]">
            {winPctStr}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
            Playoffs
          </span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {manager.playoffApps}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-xs text-slate-400 leading-relaxed italic">
        {manager.tagline}
      </p>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagersIndexPage() {
  // Sorted by dynasty rank (ascending)
  const sorted = [...MANAGERS].sort((a, b) => a.dynastyRank - b.dynastyRank);

  const totalChampionships = MANAGERS.reduce(
    (acc, m) => acc + m.championships.length,
    0
  );

  return (
    <>
      <Head>
        <title>Manager Profiles — BMFFFL Dynasty</title>
        <meta
          name="description"
          content="All 12 BMFFFL manager team profiles: career records, championships, season history, rosters, and rivalries."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
              BMFFFL · All 12 Teams
            </p>
            <h1 className="text-4xl font-black text-white mb-2">
              Manager Profiles
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Deep-dive profiles for every franchise in the dynasty — career
              stats, season history, rosters, trades, and head-to-head rivalries.
            </p>
          </div>

          {/* League summary bar */}
          <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-[#16213e] border border-[#2d4a66] flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span className="text-sm text-slate-300">
                <span className="font-bold text-white">12</span> managers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span className="text-sm text-slate-300">
                <span className="font-bold text-white">{totalChampionships}</span>{' '}
                championships awarded (2016–2025)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span className="text-sm text-slate-300">
                Sorted by{' '}
                <span className="font-bold text-white">Dynasty Rank</span>
              </span>
            </div>
          </div>

          {/* Championship history banner */}
          <div className="mb-8 rounded-xl bg-[#16213e] border border-[#ffd700]/20 p-5">
            <h2 className="text-sm font-bold text-[#ffd700] uppercase tracking-widest mb-3">
              Championship History
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { year: 2016, winner: 'MLSchools12', note: 'ESPN era' },
                { year: 2017, winner: 'Cogdeill11', note: 'ESPN era' },
                { year: 2018, winner: 'SexMachineAndyD', note: 'ESPN era' },
                { year: 2019, winner: 'MLSchools12', note: 'ESPN era' },
                { year: 2020, winner: 'Cogdeill11', note: 'def. eldridsm' },
                { year: 2021, winner: 'MLSchools12', note: 'def. SexMachineAndyD' },
                { year: 2022, winner: 'Grandes', note: 'def. rbr' },
                { year: 2023, winner: 'JuicyBussy', note: 'def. eldridm20' },
                { year: 2024, winner: 'MLSchools12', note: 'def. SexMachineAndyD' },
                { year: 2025, winner: 'tdtd19844', note: 'def. Tubes94' },
              ].map(({ year, winner, note }) => (
                <div
                  key={year}
                  className="flex flex-col items-center px-4 py-2 rounded-lg bg-[#0d1b2a] border border-[#ffd700]/30 min-w-[100px]"
                >
                  <span className="text-[10px] uppercase tracking-widest text-[#ffd700]/60 mb-0.5">
                    {year}
                  </span>
                  <Trophy
                    className="w-4 h-4 text-[#ffd700] mb-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-bold text-white text-center leading-tight">
                    {winner}
                  </span>
                  {note && (
                    <span className="text-[9px] text-slate-500 mt-0.5 text-center">
                      {note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Manager grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((manager) => (
              <ManagerCard key={manager.slug} manager={manager} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
