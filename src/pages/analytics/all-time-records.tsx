import { useState } from 'react';
import Head from 'next/head';
import { Trophy, Star, TrendingUp, Calendar, Award, Target, Flame, BarChart2, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecordEntry {
  rank: 1 | 2 | 3;
  label: string;
  sublabel?: string;
  value: string;
}

interface RecordCategory {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  entries: RecordEntry[];
  footnote?: string;
}

interface FranchiseRow {
  owner: string;
  status: 'Active' | 'Alumni' | 'ESPN Only';
  espnSeasons: string;
  sleeperSeasons: string;
  rsRecord: string; // "114-21"
  rsPct: string;   // "84.4%"
  poRecord: string; // "9-4" — winners-bracket playoff W-L
  playoffs: number;
  rings: number;
  runnerUps: number;
  thirds: number;
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

// ─── Franchise Ledger Data ────────────────────────────────────────────────────
// RS records: ESPN era (2016-2019) + Sleeper era (2020-2025), API-verified.
// PO Record: winners-bracket playoff W-L (Sleeper 2020-2025 from DB; ESPN via bracket API).
// Playoffs = total winners-bracket appearances across all seasons.
// 🏆 = championship wins, 🥈 = runner-up, 🥉 = 3rd-place finishes.

const FRANCHISE_LEDGER: FranchiseRow[] = [
  {
    owner: 'MLSchools12',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '114-21',
    rsPct: '84.4%',
    poRecord: '9-4',
    playoffs: 10,
    rings: 4,
    runnerUps: 1,
    thirds: 4,
  },
  {
    owner: 'SexMachineAndyD',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '78-57',
    rsPct: '57.8%',
    poRecord: '3-5',
    playoffs: 6,
    rings: 1,
    runnerUps: 2,
    thirds: 1,
  },
  {
    owner: 'rbr',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '73-62',
    rsPct: '54.1%',
    poRecord: '5-5',
    playoffs: 8,
    rings: 0,
    runnerUps: 2,
    thirds: 1,
  },
  {
    owner: 'Grandes',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '71-64',
    rsPct: '52.6%',
    poRecord: '5-3',
    playoffs: 5,
    rings: 1,
    runnerUps: 1,
    thirds: 1,
  },
  {
    owner: 'JuicyBussy',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '67-68',
    rsPct: '49.6%',
    poRecord: '4-6',
    playoffs: 5,
    rings: 1,
    runnerUps: 0,
    thirds: 0,
  },
  {
    owner: 'Cogdeill11',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '67-68',
    rsPct: '49.6%',
    poRecord: '2-2',
    playoffs: 5,
    rings: 2,
    runnerUps: 0,
    thirds: 1,
  },
  {
    owner: 'eldridsm',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '75-60',
    rsPct: '55.6%',
    poRecord: '4-10',
    playoffs: 6,
    rings: 0,
    runnerUps: 2,
    thirds: 1,
  },
  {
    owner: 'eldridm20',
    status: 'Active',
    espnSeasons: '—',
    sleeperSeasons: '2020–2025',
    rsRecord: '39-44',
    rsPct: '47.0%',
    poRecord: '4-3',
    playoffs: 3,
    rings: 0,
    runnerUps: 1,
    thirds: 0,
  },
  {
    owner: 'Cmaleski',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '55-80',
    rsPct: '40.7%',
    poRecord: '2-3',
    playoffs: 4,
    rings: 0,
    runnerUps: 0,
    thirds: 0,
  },
  {
    owner: 'tdtd19844',
    status: 'Active',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020–2025',
    rsRecord: '55-80',
    rsPct: '40.7%',
    poRecord: '4-4',
    playoffs: 4,
    rings: 1,
    runnerUps: 0,
    thirds: 0,
  },
  {
    owner: 'Tubes94',
    status: 'Active',
    espnSeasons: '—',
    sleeperSeasons: '2021–2025',
    rsRecord: '34-36',
    rsPct: '48.6%',
    poRecord: '2-2',
    playoffs: 2,
    rings: 0,
    runnerUps: 1,
    thirds: 1,
  },
  {
    owner: 'MCSchools',
    status: 'Alumni',
    espnSeasons: '—',
    sleeperSeasons: '2020–2025',
    rsRecord: '20-63',
    rsPct: '24.1%',
    poRecord: '0-0',
    playoffs: 0,
    rings: 0,
    runnerUps: 0,
    thirds: 0,
  },
  {
    owner: 'mmoodie12',
    status: 'Alumni',
    espnSeasons: '2016–2019',
    sleeperSeasons: '2020',
    rsRecord: '27-38',
    rsPct: '41.5%',
    poRecord: '1-1',
    playoffs: 1,
    rings: 0,
    runnerUps: 0,
    thirds: 1,
  },
  {
    owner: 'miroslav081',
    status: 'ESPN Only',
    espnSeasons: '2016–2019',
    sleeperSeasons: '—',
    rsRecord: '17-35',
    rsPct: '32.7%',
    poRecord: '—',
    playoffs: 0,
    rings: 0,
    runnerUps: 0,
    thirds: 0,
  },
];

// ─── Static Records Data ──────────────────────────────────────────────────────

const RECORD_CATEGORIES: RecordCategory[] = [
  {
    id: 'single-season-winpct',
    title: 'Best Single-Season Win % (Regular Season)',
    icon: TrendingUp,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '2023 & 2025 (tied)', value: '13-1 (.929)' },
      { rank: 3, label: 'MLSchools12', sublabel: '2021', value: '11-3 (.786)' },
      { rank: 3, label: 'Tubes94', sublabel: '2024', value: '11-3 (.786)' },
    ],
    footnote: 'Regular season only (14-game schedule, 13-game in 2020). Ties broken by points scored.',
  },
  {
    id: 'most-career-wins',
    title: 'Most Career Regular-Season Wins',
    icon: Trophy,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '10 seasons (2016–2025)', value: '114-21 (.844)' },
      { rank: 2, label: 'SexMachineAndyD', sublabel: '10 seasons (2016–2025)', value: '78-57 (.578)' },
      { rank: 3, label: 'rbr', sublabel: '10 seasons (2016–2025)', value: '73-62 (.541)' },
    ],
    footnote: 'All-time regular season wins (ESPN 2016–2019 + Sleeper 2020–2025). API-verified.',
  },
  {
    id: 'best-career-winpct',
    title: 'Best Career Win % (Min. 30 Regular-Season Games)',
    icon: Star,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '10 seasons', value: '.844 (114-21)' },
      { rank: 2, label: 'SexMachineAndyD', sublabel: '10 seasons', value: '.578 (78-57)' },
      { rank: 3, label: 'rbr', sublabel: '10 seasons', value: '.541 (73-62)' },
    ],
    footnote: 'All-time regular season record (ESPN 2016–2019 + Sleeper 2020–2025). Minimum 30 games.',
  },
  {
    id: 'most-championships',
    title: 'Most Championship Rings',
    icon: Award,
    iconColor: 'text-[#ffd700]',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '2016, 2019 (ESPN) · 2021, 2024 (Sleeper)', value: '4 rings' },
      { rank: 2, label: 'Cogdeill11', sublabel: '2017 (ESPN) · 2020 (Sleeper)', value: '2 rings' },
      { rank: 3, label: '4-way tie', sublabel: 'SexMachineAndyD · Grandes · JuicyBussy · tdtd19844', value: '1 ring each' },
    ],
    footnote: 'As of end of 2025 season. 10 championships across 10 seasons (2016–2025). Includes ESPN and Sleeper eras.',
  },
  {
    id: 'lowest-seed-champion',
    title: 'Lowest Seed to Win Championship',
    icon: Target,
    iconColor: 'text-emerald-400',
    entries: [
      { rank: 1, label: 'JuicyBussy', sublabel: '2023 Champion', value: '#6 Seed' },
      { rank: 2, label: 'Grandes', sublabel: '2022 Champion', value: '#4 Seed' },
      { rank: 2, label: 'tdtd19844', sublabel: '2025 Champion', value: '#4 Seed' },
    ],
    footnote: 'Seed at playoff bracket seeding. Top records earn first-round byes.',
  },
  {
    id: 'most-runner-ups',
    title: 'Most Runner-Up Finishes (All-Time)',
    icon: Shield,
    iconColor: 'text-slate-400',
    entries: [
      { rank: 1, label: 'SexMachineAndyD', sublabel: '2021 & 2024 (Sleeper)', value: '2 runner-ups' },
      { rank: 1, label: 'rbr', sublabel: '2019 (ESPN) · 2022 (Sleeper)', value: '2 runner-ups' },
      { rank: 3, label: '5-way tie', sublabel: 'MLSchools12 · Grandes · eldridsm · eldridm20 · Tubes94', value: '1 each' },
    ],
    footnote: 'Runner-up = championship game appearance, no ring. All-time (ESPN + Sleeper). API-verified.',
  },
  {
    id: 'highest-points',
    title: 'Highest Single-Season Points Scored',
    icon: Flame,
    iconColor: 'text-orange-400',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '2021 Regular Season', value: '2,327.1 pts' },
      { rank: 2, label: 'MLSchools12', sublabel: '2022 Regular Season', value: '2,260.3 pts' },
      { rank: 3, label: 'JuicyBussy', sublabel: '2021 — Single Game (Wk 16)', value: '245.8 pts' },
    ],
    footnote: 'Season totals from Sleeper DB (2020–2025). Single-game record from consolation bracket Week 16, 2021.',
  },
  {
    id: 'most-playoff-apps',
    title: 'Most Career Playoff Appearances',
    icon: Calendar,
    iconColor: 'text-blue-400',
    entries: [
      { rank: 1, label: 'MLSchools12', sublabel: '4 ESPN + 6 Sleeper · 🏆×4 · 🥈×1 · 🥉×4', value: '10 / 10 seasons (100%)' },
      { rank: 2, label: 'rbr', sublabel: '4 ESPN + 4 Sleeper · 🥈×2 · 🥉×1', value: '8 career appearances' },
      { rank: 3, label: 'SexMachineAndyD', sublabel: '2 ESPN + 4 Sleeper · 🏆×1 · 🥈×2 · 🥉×1', value: '6 career appearances' },
    ],
    footnote: 'All-time playoff appearances including ESPN era (2016–2019). API-verified via ESPN + Sleeper DB.',
  },
  {
    id: 'longest-drought',
    title: 'Longest Post-Championship Playoff Drought',
    icon: BarChart2,
    iconColor: 'text-[#e94560]',
    entries: [
      { rank: 1, label: 'Cogdeill11', sublabel: '2022–2025 (4 consecutive misses)', value: '4 years' },
      { rank: 2, label: 'tdtd19844', sublabel: 'Before 2025 run (2021–2023)', value: '3 years' },
      { rank: 3, label: 'MCSchools', sublabel: '2020–2025 (never made playoffs)', value: '0 appearances' },
    ],
    footnote: 'Cogdeill11 won 2020 championship then missed 4 straight playoff appearances (2022–2025).',
  },
];

// ─── Franchise Ledger Component ───────────────────────────────────────────────

function FranchiseLedger() {
  const [showFormer, setShowFormer] = useState(false);
  const rows = showFormer ? FRANCHISE_LEDGER : FRANCHISE_LEDGER.filter(r => r.status === 'Active');

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#2d4a66] bg-[#0f2744]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
            <Users className="w-4 h-4 text-blue-400" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold text-white leading-tight">All-Time Franchise Ledger</h2>
        </div>
        <button
          onClick={() => setShowFormer(!showFormer)}
          className={cn(
            'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150',
            showFormer
              ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
              : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
          )}
        >
          {showFormer ? 'Active Only' : '+ Alumni / ESPN-Era'}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e3347] bg-[#0d1b2a]/60">
              <th className="text-left px-4 py-3 text-slate-500 font-semibold uppercase tracking-wider">Owner</th>
              <th className="text-left px-3 py-3 text-slate-500 font-semibold uppercase tracking-wider">Seasons</th>
              <th className="text-right px-3 py-3 text-slate-500 font-semibold uppercase tracking-wider">RS W-L</th>
              <th className="text-right px-3 py-3 text-slate-500 font-semibold uppercase tracking-wider">RS%</th>
              <th className="text-right px-3 py-3 text-blue-400 font-semibold uppercase tracking-wider">PO W-L</th>
              <th className="text-right px-3 py-3 text-slate-500 font-semibold uppercase tracking-wider">PO Apps</th>
              <th className="text-right px-3 py-3 text-[#ffd700] font-semibold uppercase tracking-wider">🏆</th>
              <th className="text-right px-3 py-3 text-slate-400 font-semibold uppercase tracking-wider">🥈</th>
              <th className="text-right px-3 py-3 text-amber-700 font-semibold uppercase tracking-wider">🥉</th>
              <th className="text-right px-4 py-3 text-slate-500 font-semibold uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  'hover:bg-[#1f3550] transition-colors duration-100',
                  row.rings > 0 && 'bg-[#ffd700]/2',
                  row.status !== 'Active' && 'opacity-70'
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{row.owner}</div>
                </td>
                <td className="px-3 py-3 text-slate-400">
                  <div>{row.espnSeasons !== '—' ? <span className="text-slate-500">ESPN:</span> : null} {row.espnSeasons !== '—' ? row.espnSeasons : '—'}</div>
                  {row.sleeperSeasons !== '—' && <div><span className="text-slate-500">SL:</span> {row.sleeperSeasons}</div>}
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-slate-200 tabular-nums">{row.rsRecord}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-400 tabular-nums">{row.rsPct}</td>
                <td className="px-3 py-3 text-right font-mono text-blue-300 tabular-nums font-bold">{row.poRecord}</td>
                <td className="px-3 py-3 text-right font-mono text-blue-400 tabular-nums font-bold">{row.playoffs}</td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold">
                  <span className={row.rings > 0 ? 'text-[#ffd700]' : 'text-slate-600'}>
                    {row.rings > 0 ? row.rings : '—'}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums">
                  <span className={row.runnerUps > 0 ? 'text-slate-300' : 'text-slate-600'}>
                    {row.runnerUps > 0 ? row.runnerUps : '—'}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums">
                  <span className={row.thirds > 0 ? 'text-amber-700' : 'text-slate-600'}>
                    {row.thirds > 0 ? row.thirds : '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    row.status === 'Alumni' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  )}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="px-5 py-3 border-t border-[#1e3347] bg-[#0d1b2a]/40">
        <p className="text-[11px] text-slate-600 leading-snug">
          RS W-L = Regular season only. PO W-L = winners-bracket playoff record (Sleeper 2020–2025 DB-verified; ESPN era from bracket API).
          🏆 = championships. 🥈 = runner-up. 🥉 = 3rd place. ESPN era (2016–2019) API-verified via lm-api-reads.fantasy.espn.com.
          eldridm20 joined 2021 · Tubes94 joined 2024 · MCSchools (Booty Cheeks) left after 2025 · mmoodie12 left after 2020.
        </p>
      </div>
    </div>
  );
}

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
    { label: 'Seasons Played', value: '10', sub: '2016 – 2025', color: 'text-[#ffd700]' },
    { label: 'Total Champions', value: '10', sub: '6 unique owners', color: 'text-emerald-400' },
    { label: 'All-Time Franchises', value: '15', sub: '11 active + 4 alumni/ESPN', color: 'text-blue-400' },
    { label: 'Dominant Record', value: '114-21', sub: 'MLSchools12 all-time', color: 'text-[#ffd700]' },
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
          content="BMFFFL all-time records and franchise ledger — career win records, playoff appearances, championships, and complete history for all 15 franchises."
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
            BMFFFL historical records &mdash; franchise ledger, career stats, and all-time records across 10 seasons (2016&ndash;2025) for all 15 franchises, active and alumni.
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-8" aria-label="League summary statistics">
          <SummaryStats />
        </section>

        {/* Franchise Ledger */}
        <section className="mb-10" aria-label="All-time franchise ledger">
          <FranchiseLedger />
        </section>

        {/* Filter bar */}
        <section className="mb-8" aria-label="Category filter">
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Records by category</p>
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
            <span className="text-slate-400 font-semibold">Data note:</span> Regular season records through the 2025 season (ESPN 2016–2019 API-verified via lm-api-reads.fantasy.espn.com + Sleeper 2020–2025 DB-verified).
            Playoff W-L from winners bracket only. eldridsm PO W-L includes ESPN era (as eldge19). Other owners' ESPN playoff W-L pending full verification — Sleeper era only for all others.
            Former owners (full careers): mmoodie12 27-38 RS (.415, 1 playoff app) &bull; miroslav081 17-35 RS (.327) &bull; MCSchools 20-63 RS (.241, 0 playoff apps). eldridsm (Steve) played as eldge19 in ESPN era — records merged.
          </p>
        </div>

      </div>
    </>
  );
}
