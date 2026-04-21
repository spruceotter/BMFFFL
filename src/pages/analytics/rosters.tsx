import { useState } from 'react';
import Head from 'next/head';
import { Users, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import RosterValueCard from '@/components/analytics/RosterValueCard';

// ─── Static Roster Value Data ─────────────────────────────────────────────────

interface RosterValue {
  ownerName: string;
  teamName: string;
  dynastyRank: number;
  totalRosterScore: number;
  breakdown: {
    qb: number;
    rb: number;
    wr: number;
    te: number;
    picks: number;
  };
  championship: boolean;
  trend: 'up' | 'down' | 'neutral';
  keyAssets: string[];
}

const ROSTER_VALUES: RosterValue[] = [
  {
    ownerName: 'Tubes94',
    teamName: 'Whale Tails',
    dynastyRank: 1,
    totalRosterScore: 91.2,
    breakdown: { qb: 18, rb: 24, wr: 22, te: 14, picks: 13 },
    championship: false,
    trend: 'up',
    keyAssets: ['Trevor Lawrence', 'Bijan Robinson', 'Breece Hall'],
  },
  {
    ownerName: 'MLSchools12',
    teamName: 'The Murder Boners',
    dynastyRank: 2,
    totalRosterScore: 88.7,
    breakdown: { qb: 23, rb: 21, wr: 22, te: 13, picks: 10 },
    championship: true,
    trend: 'neutral',
    keyAssets: ['Lamar Jackson', 'CeeDee Lamb', 'CMC'],
  },
  {
    ownerName: 'Cogdeill11',
    teamName: 'Cogdeill11',
    dynastyRank: 3,
    totalRosterScore: 84.5,
    breakdown: { qb: 18, rb: 22, wr: 20, te: 15, picks: 10 },
    championship: true,
    trend: 'neutral',
    keyAssets: ['Omarion Hampton', 'JaMarr Chase', 'Colston Loveland'],
  },
  {
    ownerName: 'rbr',
    teamName: 'Really Big Rings',
    dynastyRank: 4,
    totalRosterScore: 79.3,
    breakdown: { qb: 16, rb: 20, wr: 19, te: 14, picks: 10 },
    championship: false,
    trend: 'down',
    keyAssets: ['Patrick Mahomes', 'Elic Ayomanor', 'Quinshon Judkins'],
  },
  {
    ownerName: 'JuicyBussy',
    teamName: 'Juicy Bussy',
    dynastyRank: 5,
    totalRosterScore: 76.8,
    breakdown: { qb: 17, rb: 18, wr: 20, te: 14, picks: 8 },
    championship: true,
    trend: 'neutral',
    keyAssets: ['Joe Burrow', 'Harold Fannin Jr.', 'Malik Nabers'],
  },
  {
    ownerName: 'tdtd19844',
    teamName: 'tdtd19844',
    dynastyRank: 6,
    totalRosterScore: 68.4,
    breakdown: { qb: 12, rb: 17, wr: 18, te: 13, picks: 8 },
    championship: true,
    trend: 'down',
    keyAssets: ['Kyren Williams', 'Tee Higgins', 'Sam LaPorta'],
  },
  {
    ownerName: 'SexMachineAndyD',
    teamName: 'SexMachineAndyD',
    dynastyRank: 7,
    totalRosterScore: 66.1,
    breakdown: { qb: 18, rb: 15, wr: 17, te: 8, picks: 8 },
    championship: true,
    trend: 'neutral',
    keyAssets: ['Jonathan Taylor', 'Cooper Kupp', 'Davante Adams'],
  },
  {
    ownerName: 'eldridm20',
    teamName: 'Franks Little Beauties',
    dynastyRank: 8,
    totalRosterScore: 72.0,
    breakdown: { qb: 21, rb: 16, wr: 18, te: 9, picks: 8 },
    championship: false,
    trend: 'up',
    keyAssets: ['Josh Allen', 'Luther Burden III', 'James Cook'],
  },
  {
    ownerName: 'Grandes',
    teamName: 'El Rioux Grandes',
    dynastyRank: 9,
    totalRosterScore: 54.7,
    breakdown: { qb: 12, rb: 13, wr: 15, te: 9, picks: 6 },
    championship: false,
    trend: 'neutral',
    keyAssets: ['CJ Stroud', 'Rashee Rice', 'Rhamondre Stevenson'],
  },
  {
    ownerName: 'Bimfle',
    teamName: 'Bimfle',
    dynastyRank: 10,
    totalRosterScore: 58.3,
    breakdown: { qb: 14, rb: 13, wr: 15, te: 10, picks: 6 },
    championship: false,
    trend: 'up',
    keyAssets: ['Jordan Love', 'Zay Flowers', 'Jaylen Warren'],
  },
  {
    ownerName: 'eldridsm',
    teamName: 'eldridsm',
    dynastyRank: 11,
    totalRosterScore: 42.1,
    breakdown: { qb: 8, rb: 10, wr: 12, te: 7, picks: 5 },
    championship: false,
    trend: 'neutral',
    keyAssets: ['Dak Prescott', 'Isiah Pacheco', 'Courtland Sutton'],
  },
  {
    ownerName: 'Cmaleski',
    teamName: 'Showtyme Boyz',
    dynastyRank: 12,
    totalRosterScore: 38.6,
    breakdown: { qb: 6, rb: 9, wr: 11, te: 7, picks: 6 },
    championship: false,
    trend: 'up',
    keyAssets: ['Marvin Harrison Jr.', 'Baker Mayfield', 'David Montgomery'],
  },
];

// ─── Sort Options ─────────────────────────────────────────────────────────────

type SortMode = 'rank' | 'score';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RostersPage() {
  const [sortMode, setSortMode] = useState<SortMode>('rank');

  const sorted = [...ROSTER_VALUES].sort((a, b) => {
    if (sortMode === 'rank') return a.dynastyRank - b.dynastyRank;
    return b.totalRosterScore - a.totalRosterScore;
  });

  return (
    <>
      <Head>
        <title>Dynasty Roster Rankings — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL dynasty roster value rankings for March 2026 — pre-draft. Positional breakdowns, dynasty scores, and key assets for all 12 teams."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            Roster Analytics
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Roster Value Rankings
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            March 2026 &mdash; Pre-Draft
          </p>
        </header>

        {/* ── Context Box ──────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-400 leading-relaxed">
            Rankings based on dynasty value scores considering age, contract status, positional scarcity,
            and pick inventory. Scores are composite out of 100: QB (25), RB (25), WR (25), TE (15),
            Picks (10). Updated <span className="text-slate-300 font-medium">March 2026</span>.
          </p>
        </div>

        {/* ── Sort Toggle ───────────────────────────────────────────────────── */}
        <div className="mb-8 flex items-center gap-1 p-1 rounded-lg bg-[#16213e] border border-[#2d4a66] w-fit">
          <button
            onClick={() => setSortMode('rank')}
            aria-pressed={sortMode === 'rank'}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150',
              sortMode === 'rank'
                ? 'bg-[#ffd700] text-[#0d1b2a]'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            By Dynasty Rank
          </button>
          <button
            onClick={() => setSortMode('score')}
            aria-pressed={sortMode === 'score'}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150',
              sortMode === 'score'
                ? 'bg-[#ffd700] text-[#0d1b2a]'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            By Total Score
          </button>
        </div>

        {/* ── Cards Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sorted.map((entry) => (
            <RosterValueCard
              key={entry.ownerName}
              ownerName={entry.ownerName}
              teamName={entry.teamName}
              dynastyRank={entry.dynastyRank}
              totalRosterScore={entry.totalRosterScore}
              breakdown={entry.breakdown}
              championship={entry.championship}
              trend={entry.trend}
              keyAssets={entry.keyAssets}
            />
          ))}
        </div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <p className="mt-12 text-xs text-center text-slate-600">
          Scores are subjective editorial assessments based on dynasty community values as of March 2026.
          Not derived from a live API. Subject to change as the 2026 rookie draft approaches.
        </p>

      </div>
    </>
  );
}
