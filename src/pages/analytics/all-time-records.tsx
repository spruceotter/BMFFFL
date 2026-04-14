import { useState } from 'react';
import Head from 'next/head';
import { Trophy, Star, TrendingUp, Calendar, Award, Target, Flame, BarChart2, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecordEntry {
  rank: 1 | 2 | 3;
  label: string;
  sublabel?: string;
  value: string;
  note?: string;
}

interface RecordCategory {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  entries: RecordEntry[];
  footnote?: string;
}

// ─── Medal Helpers ────────────────────────────────────────────────────────────

const MEDAL_STYLES: Record<1 | 2 | 3, string> = {
  1: 'text-[#ffd700] border-[#ffd700]/40 bg-[#ffd700]/10',
  2: 'text-slate-300 border-slate-300/40 bg-slate-300/10',
  3: 'text-amber-600 border-amber-600/40 bg-amber-600/10',
};

const MEDAL_LABELS: Record<1 | 2 | 3, string> = {
  1: '1st',
  2: '2nd',
  3: '3rd',
};

function MedalBadge({ rank }: { rank: 1 | 2 | 3 }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-black tabular-nums shrink-0',
        MEDAL_STYLES[rank]
      )}
      aria-label={`${MEDAL_LABELS[rank]} place`}
    >
      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
    </span>
  );
}

// ─── Static Records Data ──────────────────────────────────────────────────────

const RECORD_CATEGORIES: RecordCategory[] = [
  {
    id: 'single-season-winpct',
    title: 'Best Single-Season Win %',
    icon: TrendingUp,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '2023 Season', value: '13-1 (.929)', note: 'Dominated regular season; JuicyBussy won championship as #6 seed' },
      { rank: 1, label: 'MLSchools12', sublabel: '2025 Season', value: '13-1 (.929)', note: 'Best record in league history (tied); eliminated in playoffs by tdtd19844' },
      { rank: 3, label: 'MLSchools12 / Tubes94', sublabel: '2021 / 2024', value: '11-3 (.786)', note: 'MLSchools12 won 2021 championship; Tubes94 went 11-3 in 2024 regular season' },
    ],
    footnote: 'Regular season only (14-game schedule). Ties broken by points scored.',
  },
  {
    id: 'most-career-wins',
    title: 'Most Career Regular-Season Wins',
    icon: Trophy,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', value: '68 wins', note: '6 seasons — has never had a losing record' },
      { rank: 2, label: 'SexMachineAndyD', value: '50 wins', note: 'Consistent contender, elusive championship' },
      { rank: 3, label: 'rbr', value: '44 wins', note: '2× runner-up (2021, 2022) — close but no rings' },
    ],
  },
  {
    id: 'best-career-winpct',
    title: 'Best Career Win %',
    icon: Star,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', value: '.819 (68-15)', note: 'Most dominant career record in BMFFFL history' },
      { rank: 2, label: 'SexMachineAndyD', value: '.602 (50-33)', note: 'Well above .500 across full career' },
      { rank: 3, label: 'JuicyBussy', value: '.554 (46-37)', note: '2023 champion — winning record every active season' },
    ],
    footnote: 'Minimum 30 games played. Career totals through 2025 season.',
  },
  {
    id: 'most-championships',
    title: 'Most Championship Rings',
    icon: Award,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', value: '4 rings', note: '2016, 2019, 2021, 2024 — most championship wins in league history across ESPN and Sleeper eras' },
      { rank: 2, label: 'Cogdeill11', value: '2 rings', note: '2017 (ESPN era) & 2020 — two-time champion, most decorated non-MLSchools12 franchise' },
      { rank: 3, label: '4-way tie', sublabel: 'SexMachineAndyD, Grandes, JuicyBussy, tdtd19844', value: '1 ring each', note: 'SexMachineAndyD (2018), Grandes (2022), JuicyBussy (2023), tdtd19844 (2025)' },
    ],
    footnote: 'As of end of 2025 season. 10 championships awarded across 10 seasons (2016–2025). Includes ESPN era (2016–2019) and Sleeper era (2020–2025).',
  },
  {
    id: 'lowest-seed-champion',
    title: 'Lowest Seed to Win Championship',
    icon: Target,
    iconColor: 'text-emerald-400',
    entries: [
      { rank: 1, label: 'JuicyBussy', sublabel: '2023 Champion', value: '#6 Seed', note: 'Lowest seed ever to win — Cinderella run through playoffs' },
      { rank: 2, label: 'Grandes', sublabel: '2022 Champion', value: '#4 Seed', note: 'Upset champion — overcame top seeds in bracket' },
      { rank: 2, label: 'tdtd19844', sublabel: '2025 Champion', value: '#4 Seed', note: 'Two 4-seed champions: Grandes in 2022 and tdtd19844 in 2025 — both Cinderella runs' },
    ],
    footnote: 'Seed at time of playoff bracket seeding (top-4 regular season records earn byes).',
  },
  {
    id: 'most-runner-ups',
    title: 'Most Runner-Up Finishes',
    icon: Shield,
    iconColor: 'text-slate-400',
    entries: [
      { rank: 1, label: 'SexMachineAndyD', value: '2 runner-ups', note: '2021 & 2024 — lost to MLSchools12 both times; heartbreak on the biggest stage' },
      { rank: 2, label: '4-way tie', sublabel: 'rbr, eldridsm, eldridm20, Tubes94', value: '1 each', note: 'rbr (2022), eldridsm (2020), eldridm20 (2023), Tubes94 (2025)' },
    ],
    footnote: 'Runner-up = championship game appearance, no ring. Sleeper era (2020–2025). ESPN era runner-up data pending.',
  },
  {
    id: 'highest-points',
    title: 'Highest Single-Season Points Scored',
    icon: Flame,
    iconColor: 'text-orange-400',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '2025 Season', value: '2,161.42 pts', note: 'Record-setting offensive output — highest single-season total in BMFFFL history' },
      { rank: 2, label: 'MLSchools12', sublabel: '2024 Season', value: '~2,080 pts', note: 'Estimated — second-highest scoring season' },
      { rank: 3, label: 'JuicyBussy', sublabel: '2021 Week 16', value: '245.8 single game', note: 'Highest single-game score in BMFFFL history (consolation bracket)' },
    ],
    footnote: 'Regular season totals. Single-game record from consolation bracket Week 16, 2021.',
  },
  {
    id: 'most-playoff-apps',
    title: 'Most Career Playoff Appearances',
    icon: Calendar,
    iconColor: 'text-blue-400',
    entries: [
      { rank: 1, label: 'MLSchools12', value: '6 / 6 (100%)', note: 'Made playoffs every single season — unmatched consistency in the league' },
      { rank: 2, label: 'SexMachineAndyD / rbr', value: '5+ appearances', note: 'Elite playoff consistency across multiple seasons' },
      { rank: 3, label: 'JuicyBussy / eldridm20', value: '4-5 appearances', note: 'Solid playoff regulars' },
    ],
    footnote: 'Playoff appearances since each owner\'s first season. MLSchools12 active since 2020.',
  },
  {
    id: 'longest-drought',
    title: 'Longest Post-Championship Playoff Drought',
    icon: BarChart2,
    iconColor: 'text-[#e94560]',
    entries: [
      { rank: 1, label: 'Cogdeill11', value: '5 consecutive misses', note: 'Won championship in 2020, then missed playoffs 2021–2025 — the steepest fall in BMFFFL history' },
      { rank: 2, label: 'tdtd19844', sublabel: 'Before 2025 run', value: '3 years (2020–2022)', note: 'Missed playoffs after inaugural season, eventually rose to win 2025 title' },
      { rank: 3, label: 'Escuelas', value: '2 years (2022–2023)', note: 'Joined 2022, missed first two seasons before improvement in 2024–2025' },
    ],
    footnote: 'Cogdeill11 record is active through 2025 — the most dramatic dynasty decline in league history.',
  },
];

// ─── Category Card ─────────────────────────────────────────────────────────────

function RecordCard({ category }: { category: RecordCategory }) {
  const Icon = category.icon;
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2d4a66] bg-[#0f2744]">
        <div className="p-1.5 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
          <Icon className={cn('w-4 h-4', category.iconColor)} aria-hidden="true" />
        </div>
        <h2 className="text-sm font-bold text-white leading-tight">{category.title}</h2>
      </div>

      {/* Entries */}
      <ul className="divide-y divide-[#1e3347]" aria-label={category.title}>
        {category.entries.map((entry, idx) => (
          <li
            key={idx}
            className={cn(
              'flex items-start gap-3 px-5 py-4 transition-colors duration-100 hover:bg-[#1f3550]',
              entry.rank === 1 && 'bg-[#ffd700]/3'
            )}
          >
            <MedalBadge rank={entry.rank} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className={cn(
                  'font-bold text-sm leading-tight',
                  entry.rank === 1 ? 'text-white' : 'text-slate-200'
                )}>
                  {entry.label}
                </span>
                {entry.sublabel && (
                  <span className="text-[11px] text-slate-500 font-medium">{entry.sublabel}</span>
                )}
              </div>
              <p className={cn(
                'text-sm font-mono font-bold mt-0.5 tabular-nums',
                entry.rank === 1 ? 'text-[#ffd700]' :
                entry.rank === 2 ? 'text-slate-300' :
                'text-amber-700'
              )}>
                {entry.value}
              </p>
              {entry.note && (
                <p className="text-[11px] text-slate-500 leading-snug mt-1">{entry.note}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Footnote */}
      {category.footnote && (
        <div className="px-5 py-3 border-t border-[#1e3347] bg-[#0d1b2a]/40">
          <p className="text-[11px] text-slate-600 leading-snug">{category.footnote}</p>
        </div>
      )}
    </div>
  );
}

// ─── Summary Stats Row ─────────────────────────────────────────────────────────

function SummaryStats() {
  const stats = [
    { label: 'Seasons Played', value: '6', sub: '2020 – 2025', color: 'text-[#ffd700]' },
    { label: 'Total Champions', value: '6', sub: '5 unique owners', color: 'text-emerald-400' },
    { label: 'Active Owners', value: '12', sub: 'League full since 2022', color: 'text-blue-400' },
    { label: 'Dominant Record', value: '68-15', sub: 'MLSchools12 all-time', color: 'text-[#ffd700]' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
          <p className={cn('text-2xl font-black tabular-nums leading-none', s.color)}>{s.value}</p>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-1">{s.sub}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Category Filter ────────────────────────────────────────────────────────

const FILTER_OPTIONS = ['All', 'Wins', 'Championships', 'Points', 'Streaks'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

const CATEGORY_FILTER_MAP: Record<FilterOption, string[]> = {
  All: RECORD_CATEGORIES.map(c => c.id),
  Wins: ['single-season-winpct', 'most-career-wins', 'best-career-winpct', 'most-playoff-apps'],
  Championships: ['most-championships', 'lowest-seed-champion', 'most-runner-ups'],
  Points: ['highest-points'],
  Streaks: ['longest-drought'],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllTimeRecordsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const visibleIds = CATEGORY_FILTER_MAP[activeFilter];
  const visibleCategories = RECORD_CATEGORIES.filter(c => visibleIds.includes(c.id));

  return (
    <>
      <Head>
        <title>All-Time Records — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL all-time records leaderboard — best win percentages, most championships, highest scoring seasons, longest playoff streaks, and more."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            All-Time Records
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            BMFFFL historical records leaderboard &mdash; the best, the worst, and everything in between across 6 seasons (2020&ndash;2025).
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-8" aria-label="League summary statistics">
          <SummaryStats />
        </section>

        {/* Filter bar */}
        <section className="mb-8" aria-label="Category filter">
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Filter by category</p>
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border',
                  activeFilter === opt
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
                aria-pressed={activeFilter === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Record category grid */}
        <section aria-label="All-time record categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {visibleCategories.map(cat => (
              <RecordCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-10 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Data note:</span> Records reflect verified career totals through the 2025 season.
            Single-game and single-season records are based on league records — exact game scores pending full Sleeper API integration (Phase G).
            Win/loss records use 14-game regular seasons (2020 had 13-game format for some owners).
            MLSchools12 career record: 68-15 (.819) &bull; SexMachineAndyD: 50-33 (.602) &bull; JuicyBussy: 46-37 (.554).
          </p>
        </div>

      </div>
    </>
  );
}
