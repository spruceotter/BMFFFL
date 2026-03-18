import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'PICK';
type FilterTab = 'ALL' | Position;

interface PlayerRow {
  name: string;
  pos: Position;
  team: string;
  age: number | null;
  value: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAYERS: PlayerRow[] = [
  // QBs
  { name: 'Lamar Jackson',     pos: 'QB', team: 'BAL', age: 28, value: 9200 },
  { name: 'Josh Allen',        pos: 'QB', team: 'BUF', age: 29, value: 9100 },
  { name: 'Jalen Hurts',       pos: 'QB', team: 'PHI', age: 26, value: 8800 },
  { name: 'C.J. Stroud',       pos: 'QB', team: 'HOU', age: 23, value: 8700 },
  { name: 'Anthony Richardson', pos: 'QB', team: 'IND', age: 23, value: 8400 },
  { name: 'Jayden Daniels',    pos: 'QB', team: 'WAS', age: 24, value: 8200 },
  { name: 'Caleb Williams',    pos: 'QB', team: 'CHI', age: 23, value: 7800 },
  { name: 'Jordan Love',       pos: 'QB', team: 'GB',  age: 26, value: 7600 },
  { name: 'Sam Darnold',       pos: 'QB', team: 'MIN', age: 28, value: 6800 },
  { name: 'Kyler Murray',      pos: 'QB', team: 'ARI', age: 27, value: 6500 },

  // RBs
  { name: 'Bijan Robinson',    pos: 'RB', team: 'ATL', age: 23, value: 9400 },
  { name: 'Breece Hall',       pos: 'RB', team: 'NYJ', age: 23, value: 9000 },
  { name: 'Jahmyr Gibbs',      pos: 'RB', team: 'DET', age: 23, value: 8900 },
  { name: "De'Von Achane",     pos: 'RB', team: 'MIA', age: 23, value: 8600 },
  { name: 'Jonathon Brooks',   pos: 'RB', team: 'CAR', age: 22, value: 7800 },
  { name: 'James Cook',        pos: 'RB', team: 'BUF', age: 24, value: 7600 },
  { name: 'Kyren Williams',    pos: 'RB', team: 'LAR', age: 25, value: 7200 },
  { name: 'Rashad White',      pos: 'RB', team: 'TB',  age: 24, value: 6800 },
  { name: 'Javonte Williams',  pos: 'RB', team: 'DEN', age: 24, value: 5900 },
  { name: 'Tony Pollard',      pos: 'RB', team: 'TEN', age: 28, value: 5400 },

  // WRs
  { name: "Ja'Marr Chase",         pos: 'WR', team: 'CIN', age: 25, value: 9800 },
  { name: 'Justin Jefferson',      pos: 'WR', team: 'MIN', age: 26, value: 9600 },
  { name: 'CeeDee Lamb',           pos: 'WR', team: 'DAL', age: 25, value: 9500 },
  { name: 'Puka Nacua',            pos: 'WR', team: 'LAR', age: 24, value: 8800 },
  { name: 'Amon-Ra St. Brown',     pos: 'WR', team: 'DET', age: 25, value: 8700 },
  { name: 'Malik Nabers',          pos: 'WR', team: 'NYG', age: 21, value: 8400 },
  { name: 'Marvin Harrison Jr.',   pos: 'WR', team: 'ARI', age: 22, value: 8300 },
  { name: 'Drake London',          pos: 'WR', team: 'ATL', age: 23, value: 8100 },
  { name: 'Brian Thomas Jr.',      pos: 'WR', team: 'JAX', age: 22, value: 8000 },
  { name: 'Rashee Rice',           pos: 'WR', team: 'KC',  age: 24, value: 7800 },
  { name: 'Tyreek Hill',           pos: 'WR', team: 'MIA', age: 31, value: 5800 },
  { name: 'Davante Adams',         pos: 'WR', team: 'LV',  age: 33, value: 5200 },

  // TEs
  { name: 'Brock Bowers',   pos: 'TE', team: 'LV',  age: 22, value: 9200 },
  { name: 'Sam LaPorta',    pos: 'TE', team: 'DET', age: 23, value: 8200 },
  { name: 'Trey McBride',   pos: 'TE', team: 'ARI', age: 25, value: 8000 },
  { name: 'Tucker Kraft',   pos: 'TE', team: 'GB',  age: 24, value: 7200 },
  { name: 'Jake Ferguson',  pos: 'TE', team: 'DAL', age: 25, value: 7000 },
  { name: 'Dalton Kincaid', pos: 'TE', team: 'BUF', age: 25, value: 6500 },
];

const PICKS: PlayerRow[] = [
  { name: '2026 1.01',             pos: 'PICK', team: '—', age: null, value: 8500 },
  { name: '2026 1.02',             pos: 'PICK', team: '—', age: null, value: 8000 },
  { name: '2026 1.03',             pos: 'PICK', team: '—', age: null, value: 7600 },
  { name: '2026 1.04',             pos: 'PICK', team: '—', age: null, value: 7200 },
  { name: '2026 1.05',             pos: 'PICK', team: '—', age: null, value: 6800 },
  { name: '2026 1.06',             pos: 'PICK', team: '—', age: null, value: 6400 },
  { name: '2026 1.07',             pos: 'PICK', team: '—', age: null, value: 6000 },
  { name: '2026 1.08',             pos: 'PICK', team: '—', age: null, value: 5600 },
  { name: '2026 1.09',             pos: 'PICK', team: '—', age: null, value: 5200 },
  { name: '2026 1.10',             pos: 'PICK', team: '—', age: null, value: 4800 },
  { name: '2026 1.11',             pos: 'PICK', team: '—', age: null, value: 4400 },
  { name: '2026 1.12',             pos: 'PICK', team: '—', age: null, value: 4000 },
  { name: '2026 2.01',             pos: 'PICK', team: '—', age: null, value: 3200 },
  { name: '2026 2.06',             pos: 'PICK', team: '—', age: null, value: 2400 },
  { name: '2026 2.12',             pos: 'PICK', team: '—', age: null, value: 1800 },
  { name: '2027 1st (early)',      pos: 'PICK', team: '—', age: null, value: 4500 },
  { name: '2027 1st (mid)',        pos: 'PICK', team: '—', age: null, value: 3500 },
  { name: '2027 1st (late)',       pos: 'PICK', team: '—', age: null, value: 2800 },
];

const ALL_ROWS: PlayerRow[] = [...PLAYERS, ...PICKS].sort((a, b) => b.value - a.value);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function valueTier(value: number): { label: string; color: string; barColor: string } {
  if (value >= 8000) return { label: 'Elite',   color: 'text-[#ffd700]',  barColor: 'bg-[#ffd700]' };
  if (value >= 6000) return { label: 'Strong',  color: 'text-green-400',  barColor: 'bg-green-500' };
  if (value >= 4000) return { label: 'Average', color: 'text-amber-400',  barColor: 'bg-amber-500' };
  return               { label: 'Fringe',  color: 'text-red-400',   barColor: 'bg-red-500' };
}

const POS_STYLES: Record<Position, { bg: string; text: string }> = {
  QB:   { bg: 'bg-blue-600/20',   text: 'text-blue-400' },
  RB:   { bg: 'bg-green-600/20',  text: 'text-green-400' },
  WR:   { bg: 'bg-orange-600/20', text: 'text-orange-400' },
  TE:   { bg: 'bg-purple-600/20', text: 'text-purple-400' },
  PICK: { bg: 'bg-slate-600/20',  text: 'text-slate-300' },
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL',  label: 'ALL' },
  { key: 'QB',   label: 'QB' },
  { key: 'RB',   label: 'RB' },
  { key: 'WR',   label: 'WR' },
  { key: 'TE',   label: 'TE' },
  { key: 'PICK', label: 'PICKS' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TradeValueChart() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let rows = ALL_ROWS;
    if (activeTab !== 'ALL') {
      rows = rows.filter((r) => r.pos === activeTab);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    return rows;
  }, [activeTab, search]);

  return (
    <>
      <Head>
        <title>Dynasty Trade Value Chart | BMFFFL</title>
        <meta
          name="description"
          content="Bimfle's official dynasty trade value chart — curated player values and rookie pick values for BMFFFL trade negotiations. March 2026."
        />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

          {/* ── Header ── */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Dynasty Trade Value Chart
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Bimfle&apos;s official player values &mdash; March 2026
            </p>
          </div>

          {/* ── Controls ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Position tabs */}
            <div className="flex flex-wrap gap-1">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150',
                    activeTab === key
                      ? 'bg-[#ffd700] text-[#0d1b2a]'
                      : 'bg-[#16213e] text-slate-300 hover:text-white hover:bg-[#1e2f4a]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players or picks…"
                className="w-full sm:w-60 pl-9 pr-4 py-1.5 rounded-md bg-[#16213e] border border-[#2d4a66] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
              />
            </div>
          </div>

          {/* ── Legend ── */}
          <div className="flex flex-wrap gap-3 mb-5 text-xs">
            {[
              { label: 'Elite (8000+)',    color: 'bg-[#ffd700]' },
              { label: 'Strong (6000–7999)', color: 'bg-green-500' },
              { label: 'Average (4000–5999)', color: 'bg-amber-500' },
              { label: 'Fringe (<4000)',   color: 'bg-red-500' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-slate-400">
                <span className={cn('inline-block w-2.5 h-2.5 rounded-sm', color)} />
                {label}
              </span>
            ))}
          </div>

          {/* ── Table ── */}
          <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[3rem_1fr_5rem_4rem_3rem_8rem] gap-x-3 px-4 py-3 border-b border-[#2d4a66] text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="text-right">#</span>
              <span>Player</span>
              <span className="text-center">Pos</span>
              <span className="text-center">Team</span>
              <span className="text-center">Age</span>
              <span className="text-right pr-1">Value</span>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-500 text-sm">
                No results found.
              </div>
            ) : (
              <ul>
                {filtered.map((row, i) => {
                  const tier = valueTier(row.value);
                  const pos  = POS_STYLES[row.pos];
                  const barWidth = `${(row.value / 10000) * 100}%`;

                  return (
                    <li
                      key={row.name}
                      className={cn(
                        'grid grid-cols-[3rem_1fr_5rem_4rem_3rem_8rem] gap-x-3 items-center px-4 py-3',
                        'border-b border-[#0d1b2a]/60 last:border-b-0',
                        'hover:bg-white/[0.03] transition-colors duration-100'
                      )}
                    >
                      {/* Rank */}
                      <span className="text-right text-slate-500 text-sm font-mono tabular-nums">
                        {i + 1}
                      </span>

                      {/* Name + value bar */}
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-white truncate">
                          {row.name}
                        </span>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-[#0d1b2a]/60 overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', tier.barColor)}
                            style={{ width: barWidth }}
                          />
                        </div>
                      </div>

                      {/* Position badge */}
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide',
                            pos.bg, pos.text
                          )}
                        >
                          {row.pos}
                        </span>
                      </div>

                      {/* Team */}
                      <span className="text-center text-xs text-slate-400 font-mono">
                        {row.team}
                      </span>

                      {/* Age */}
                      <span className="text-center text-xs text-slate-400">
                        {row.age ?? '—'}
                      </span>

                      {/* Value */}
                      <div className="text-right">
                        <span className={cn('text-lg font-black tabular-nums', tier.color)}>
                          {row.value.toLocaleString()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ── Footer notes ── */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>Last updated: March 2026</span>
            <span className="hidden sm:block text-slate-700">|</span>
            <span>{ALL_ROWS.length} entries &mdash; values on a 10,000-point scale</span>
          </div>

          <div className="mt-6 bg-[#16213e] border border-[#2d4a66] rounded-xl px-5 py-4">
            <p className="text-sm text-slate-400 italic leading-relaxed">
              These values are approximations suitable for dynasty trade negotiations. Bimfle accepts no
              liability for trades executed in haste or while emotionally compromised.{' '}
              <span className="not-italic text-slate-300 font-semibold">~Love, Bimfle.</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
