import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Target, BarChart2, Filter } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'WR' | 'TE';
type SortKey = 'tgtPct' | 'airYdPct' | 'rec' | 'yards' | 'tds';
type SortDir = 'asc' | 'desc';
type Owner = 'MLSchools12' | 'JuicyBussy' | 'tdtd19844' | 'Grandes' | 'Tubes94';

interface Player {
  name: string;
  team: string;
  pos: Position;
  tgtPct: number;
  airYdPct: number;
  rec: number;
  yards: number;
  tds: number;
  owner: Owner;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAYERS: Player[] = [
  { name: "CeeDee Lamb",      team: "DAL", pos: "WR", tgtPct: 28, airYdPct: 35, rec: 101, yards: 1480, tds: 11, owner: "MLSchools12" },
  { name: "Ja'Marr Chase",    team: "CIN", pos: "WR", tgtPct: 26, airYdPct: 32, rec: 96,  yards: 1420, tds: 10, owner: "MLSchools12" },
  { name: "Tyreek Hill",      team: "MIA", pos: "WR", tgtPct: 24, airYdPct: 28, rec: 88,  yards: 1320, tds: 9,  owner: "JuicyBussy"  },
  { name: "Justin Jefferson", team: "MIN", pos: "WR", tgtPct: 25, airYdPct: 30, rec: 94,  yards: 1390, tds: 8,  owner: "JuicyBussy"  },
  { name: "Puka Nacua",       team: "LAR", pos: "WR", tgtPct: 22, airYdPct: 25, rec: 82,  yards: 1180, tds: 7,  owner: "tdtd19844"   },
  { name: "Nico Collins",     team: "HOU", pos: "WR", tgtPct: 20, airYdPct: 28, rec: 78,  yards: 1150, tds: 8,  owner: "tdtd19844"   },
  { name: "Jaylen Waddle",    team: "MIA", pos: "WR", tgtPct: 18, airYdPct: 20, rec: 72,  yards: 1020, tds: 6,  owner: "MLSchools12" },
  { name: "Davante Adams",    team: "LAR", pos: "WR", tgtPct: 16, airYdPct: 22, rec: 68,  yards: 980,  tds: 7,  owner: "MLSchools12" },
  { name: "Jordan Addison",   team: "MIN", pos: "WR", tgtPct: 15, airYdPct: 18, rec: 65,  yards: 890,  tds: 5,  owner: "MLSchools12" },
  { name: "Ricky Pearsall",   team: "SF",  pos: "WR", tgtPct: 14, airYdPct: 20, rec: 60,  yards: 850,  tds: 4,  owner: "MLSchools12" },
  { name: "AJ Brown",         team: "PHI", pos: "WR", tgtPct: 22, airYdPct: 28, rec: 82,  yards: 1250, tds: 8,  owner: "Grandes"     },
  { name: "Drake London",     team: "ATL", pos: "WR", tgtPct: 18, airYdPct: 22, rec: 72,  yards: 1050, tds: 6,  owner: "Tubes94"     },
  { name: "Deebo Samuel",     team: "SF",  pos: "WR", tgtPct: 12, airYdPct: 15, rec: 52,  yards: 720,  tds: 4,  owner: "MLSchools12" },
  { name: "Travis Kelce",     team: "KC",  pos: "TE", tgtPct: 20, airYdPct: 14, rec: 88,  yards: 920,  tds: 8,  owner: "JuicyBussy"  },
  { name: "Sam LaPorta",      team: "DET", pos: "TE", tgtPct: 16, airYdPct: 12, rec: 72,  yards: 780,  tds: 7,  owner: "MLSchools12" },
  { name: "Brock Bowers",     team: "LV",  pos: "TE", tgtPct: 22, airYdPct: 16, rec: 90,  yards: 1020, tds: 6,  owner: "tdtd19844"   },
  { name: "George Kittle",    team: "SF",  pos: "TE", tgtPct: 18, airYdPct: 12, rec: 68,  yards: 720,  tds: 6,  owner: "MLSchools12" },
];

// ─── Owner Colors ─────────────────────────────────────────────────────────────

const OWNER_COLORS: Record<Owner, { bg: string; border: string; text: string; dot: string }> = {
  MLSchools12: { bg: 'bg-blue-900/70',   border: 'border-blue-500',   text: 'text-blue-300',   dot: '#3b82f6' },
  JuicyBussy:  { bg: 'bg-purple-900/70', border: 'border-purple-500', text: 'text-purple-300', dot: '#a855f7' },
  tdtd19844:   { bg: 'bg-emerald-900/70',border: 'border-emerald-500',text: 'text-emerald-300',dot: '#10b981' },
  Grandes:     { bg: 'bg-orange-900/70', border: 'border-orange-500', text: 'text-orange-300', dot: '#f97316' },
  Tubes94:     { bg: 'bg-rose-900/70',   border: 'border-rose-500',   text: 'text-rose-300',   dot: '#f43f5e' },
};

const ALL_OWNERS: Owner[] = ['MLSchools12', 'JuicyBussy', 'tdtd19844', 'Grandes', 'Tubes94'];

// ─── Treemap Cell ─────────────────────────────────────────────────────────────

interface TreemapCellProps {
  player: Player;
  widthPct: number;
}

function TreemapCell({ player, widthPct }: TreemapCellProps) {
  const colors = OWNER_COLORS[player.owner];
  // Height scales with target share: base 80px + up to 120px more
  const heightPx = 80 + Math.round((player.tgtPct / 28) * 120);

  return (
    <div
      className={cn(
        'relative group overflow-hidden rounded border cursor-default select-none transition-all duration-200',
        colors.bg,
        colors.border,
        'hover:z-10 hover:scale-[1.03] hover:shadow-xl'
      )}
      style={{ width: `${widthPct}%`, height: `${heightPx}px`, minWidth: '60px' }}
    >
      {/* Normal state */}
      <div className="flex flex-col items-center justify-center h-full px-1 text-center group-hover:opacity-0 transition-opacity duration-150">
        <span className="font-bold text-white text-xs leading-tight truncate w-full text-center">
          {player.name.split(' ').pop()}
        </span>
        <span className="text-[#ffd700] font-black text-base leading-tight">
          {player.tgtPct}%
        </span>
        <span className={cn('text-[10px] font-medium leading-tight mt-0.5', colors.text)}>
          {player.pos}
        </span>
      </div>

      {/* Hover tooltip overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-center px-2 py-1.5 bg-[#0d1b2a]/95 backdrop-blur-sm">
        <p className="text-white font-bold text-xs leading-tight mb-1 truncate">{player.name}</p>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-1">
            <span className="text-[#8fa3b8] text-[10px]">Team</span>
            <span className="text-white text-[10px] font-semibold">{player.team}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span className="text-[#8fa3b8] text-[10px]">Tgt%</span>
            <span className="text-[#ffd700] text-[10px] font-bold">{player.tgtPct}%</span>
          </div>
          <div className="flex justify-between gap-1">
            <span className="text-[#8fa3b8] text-[10px]">AirYd%</span>
            <span className="text-white text-[10px] font-semibold">{player.airYdPct}%</span>
          </div>
          <div className="flex justify-between gap-1">
            <span className="text-[#8fa3b8] text-[10px]">Rec/Yds</span>
            <span className="text-white text-[10px] font-semibold">{player.rec}/{player.yards}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span className="text-[#8fa3b8] text-[10px]">TDs</span>
            <span className="text-white text-[10px] font-semibold">{player.tds}</span>
          </div>
          <div className={cn('text-[10px] font-semibold mt-0.5 truncate', colors.text)}>
            {player.owner}
          </div>
        </div>
      </div>

      {/* Position badge */}
      <div className={cn(
        'absolute top-1 left-1 text-[9px] font-bold px-1 rounded',
        player.pos === 'TE' ? 'bg-amber-600/80 text-amber-100' : 'bg-sky-700/80 text-sky-100'
      )}>
        {player.pos}
      </div>
    </div>
  );
}

// ─── Treemap ──────────────────────────────────────────────────────────────────

function Treemap({ players }: { players: Player[] }) {
  const totalTgt = players.reduce((s, p) => s + p.tgtPct, 0);

  // Group by owner, sort each group by tgtPct desc
  const byOwner = ALL_OWNERS.map(owner => ({
    owner,
    players: players.filter(p => p.owner === owner).sort((a, b) => b.tgtPct - a.tgtPct),
  })).filter(g => g.players.length > 0);

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
      <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
        <Target className="w-5 h-5 text-[#ffd700]" />
        2025 Target Share by BMFFFL Roster
      </h2>
      <p className="text-[#8fa3b8] text-xs mb-4">
        Cell size proportional to target share %. Hover for full stats.
      </p>

      {/* Owner rows */}
      <div className="space-y-2">
        {byOwner.map(({ owner, players: ownerPlayers }) => {
          const ownerTgt = ownerPlayers.reduce((s, p) => s + p.tgtPct, 0);
          const ownerPct = Math.round((ownerTgt / totalTgt) * 100);
          const colors = OWNER_COLORS[owner];

          return (
            <div key={owner}>
              {/* Row label */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.dot }}
                />
                <span className={cn('text-xs font-semibold', colors.text)}>{owner}</span>
                <span className="text-[#4a6a80] text-xs">— {ownerPct}% of total display share</span>
              </div>

              {/* Cells row */}
              <div className="flex flex-wrap gap-1">
                {ownerPlayers.map(player => {
                  // Width relative to this owner's slice of total, min 8%
                  const widthPct = Math.max(8, Math.round((player.tgtPct / totalTgt) * 100 * (100 / ownerPct)));
                  return (
                    <TreemapCell
                      key={player.name}
                      player={player}
                      widthPct={Math.min(widthPct, 45)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-[#2d4a66] flex flex-wrap gap-3">
        {ALL_OWNERS.map(owner => {
          const colors = OWNER_COLORS[owner];
          const ownerPlayers = players.filter(p => p.owner === owner);
          if (!ownerPlayers.length) return null;
          return (
            <div key={owner} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: colors.dot }}
              />
              <span className="text-[#8fa3b8] text-xs">{owner}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-600 flex-shrink-0" />
          <span className="text-[#8fa3b8] text-xs">TE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-700 flex-shrink-0" />
          <span className="text-[#8fa3b8] text-xs">WR</span>
        </div>
      </div>
    </div>
  );
}

// ─── Owner Concentration Cards ────────────────────────────────────────────────

function OwnerConcentration({ players }: { players: Player[] }) {
  const totalTgt = players.reduce((s, p) => s + p.tgtPct, 0);

  const ownerStats = ALL_OWNERS.map(owner => {
    const ownerPlayers = players.filter(p => p.owner === owner);
    const combinedTgt = ownerPlayers.reduce((s, p) => s + p.tgtPct, 0);
    const pct = Math.round((combinedTgt / totalTgt) * 100);
    const wrCount = ownerPlayers.filter(p => p.pos === 'WR').length;
    const teCount = ownerPlayers.filter(p => p.pos === 'TE').length;
    return { owner, combinedTgt, pct, wrCount, teCount, playerCount: ownerPlayers.length };
  }).filter(o => o.playerCount > 0).sort((a, b) => b.pct - a.pct);

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-[#ffd700]" />
        Owner Target Share Concentration
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ownerStats.map(({ owner, combinedTgt, pct, wrCount, teCount }) => {
          const colors = OWNER_COLORS[owner];
          return (
            <div
              key={owner}
              className={cn(
                'rounded-lg border p-3 flex flex-col gap-1',
                colors.bg,
                colors.border
              )}
            >
              <span className={cn('text-xs font-bold truncate', colors.text)}>{owner}</span>
              <span className="text-[#ffd700] font-black text-2xl leading-none">{pct}%</span>
              <span className="text-[#8fa3b8] text-[11px]">of displayed share</span>
              <div className="mt-1 pt-1 border-t border-white/10">
                <div className="flex gap-2 text-[10px] text-[#8fa3b8]">
                  <span>{wrCount} WR{wrCount !== 1 ? 's' : ''}</span>
                  {teCount > 0 && <span>{teCount} TE{teCount !== 1 ? 's' : ''}</span>}
                </div>
                <div className="text-[11px] text-white/70 mt-0.5">
                  Combined: {combinedTgt}% raw tgt
                </div>
              </div>
              {/* Mini bar */}
              <div className="w-full bg-[#0d1b2a] rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: colors.dot }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[#4a6a80] text-xs mt-3">
        * Concentration % based on sum of displayed target share figures across all {players.length} listed WRs/TEs.
      </p>
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="text-[#2d4a66] ml-1">⇅</span>;
  return <span className="text-[#ffd700] ml-1">{dir === 'desc' ? '↓' : '↑'}</span>;
}

// ─── Stats Table ──────────────────────────────────────────────────────────────

function StatsTable({ players }: { players: Player[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('tgtPct');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [posFilter, setPosFilter] = useState<'all' | Position>('all');
  const [ownerFilter, setOwnerFilter] = useState<'all' | Owner>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    return players
      .filter(p => posFilter === 'all' || p.pos === posFilter)
      .filter(p => ownerFilter === 'all' || p.owner === ownerFilter)
      .sort((a, b) => {
        const mult = sortDir === 'desc' ? -1 : 1;
        return mult * (a[sortKey] - b[sortKey]);
      });
  }, [players, posFilter, ownerFilter, sortKey, sortDir]);

  const headerCell = (label: string, key: SortKey) => (
    <th
      className="px-3 py-2 text-left text-xs font-semibold text-[#8fa3b8] cursor-pointer hover:text-white whitespace-nowrap select-none"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon active={sortKey === key} dir={sortDir} />
    </th>
  );

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="text-white font-bold text-lg flex items-center gap-2 mr-auto">
          <Filter className="w-5 h-5 text-[#ffd700]" />
          Player Stats Table
        </h2>

        {/* Position filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8fa3b8] text-xs">Pos:</span>
          {(['all', 'WR', 'TE'] as const).map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-semibold border transition-colors',
                posFilter === pos
                  ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                  : 'bg-[#0d1b2a] text-[#8fa3b8] border-[#2d4a66] hover:border-[#ffd700] hover:text-[#ffd700]'
              )}
            >
              {pos.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Owner filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#8fa3b8] text-xs">Owner:</span>
          <button
            onClick={() => setOwnerFilter('all')}
            className={cn(
              'px-2.5 py-1 rounded text-xs font-semibold border transition-colors',
              ownerFilter === 'all'
                ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                : 'bg-[#0d1b2a] text-[#8fa3b8] border-[#2d4a66] hover:border-[#ffd700] hover:text-[#ffd700]'
            )}
          >
            All
          </button>
          {ALL_OWNERS.map(owner => {
            const colors = OWNER_COLORS[owner];
            const active = ownerFilter === owner;
            return (
              <button
                key={owner}
                onClick={() => setOwnerFilter(owner)}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold border transition-colors',
                  active
                    ? cn(colors.bg, colors.border, colors.text)
                    : 'bg-[#0d1b2a] text-[#8fa3b8] border-[#2d4a66] hover:border-[#2d4a66]'
                )}
              >
                {owner}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[#4a6a80] text-xs mb-3">
        Showing {filtered.length} of {players.length} players. Click column headers to sort.
      </p>

      <div className="overflow-x-auto rounded-lg border border-[#2d4a66]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
              <th className="px-3 py-2 text-left text-xs font-semibold text-[#8fa3b8] whitespace-nowrap">Player</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[#8fa3b8]">Team</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[#8fa3b8]">Pos</th>
              {headerCell('Target%', 'tgtPct')}
              {headerCell('AirYd%', 'airYdPct')}
              {headerCell('Rec', 'rec')}
              {headerCell('Yards', 'yards')}
              {headerCell('TDs', 'tds')}
              <th className="px-3 py-2 text-left text-xs font-semibold text-[#8fa3b8] whitespace-nowrap">Owner</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player, i) => {
              const colors = OWNER_COLORS[player.owner];
              return (
                <tr
                  key={player.name}
                  className={cn(
                    'border-b border-[#1a2e42] transition-colors hover:bg-[#1e3a52]',
                    i % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#132032]'
                  )}
                >
                  <td className="px-3 py-2 font-semibold text-white whitespace-nowrap">{player.name}</td>
                  <td className="px-3 py-2 text-[#8fa3b8] font-mono text-xs">{player.team}</td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold',
                      player.pos === 'TE'
                        ? 'bg-amber-600/30 text-amber-300 border border-amber-600/50'
                        : 'bg-sky-700/30 text-sky-300 border border-sky-700/50'
                    )}>
                      {player.pos}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#0d1b2a] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-[#ffd700]"
                          style={{ width: `${(player.tgtPct / 28) * 100}%` }}
                        />
                      </div>
                      <span className="text-[#ffd700] font-bold text-xs whitespace-nowrap">{player.tgtPct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-[#0d1b2a] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-sky-500"
                          style={{ width: `${(player.airYdPct / 35) * 100}%` }}
                        />
                      </div>
                      <span className="text-sky-300 font-semibold text-xs whitespace-nowrap">{player.airYdPct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-white font-semibold text-right tabular-nums">{player.rec}</td>
                  <td className="px-3 py-2 text-white font-semibold text-right tabular-nums">{player.yards.toLocaleString()}</td>
                  <td className="px-3 py-2 text-white font-semibold text-right tabular-nums">{player.tds}</td>
                  <td className="px-3 py-2">
                    <span className={cn('text-xs font-semibold', colors.text)}>{player.owner}</span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-[#4a6a80] text-sm">
                  No players match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TargetSharePage() {
  return (
    <>
      <Head>
        <title>Target Share & Air Yards | BMFFFL Analytics</title>
        <meta
          name="description"
          content="2025 WR/TE target share and air yards analysis across BMFFFL dynasty rosters."
        />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

          {/* Page Header */}
          <div className="border-b border-[#2d4a66] pb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#16213e] border border-[#2d4a66]">
                <Target className="w-6 h-6 text-[#ffd700]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Target Share &amp; Air Yards
                </h1>
                <p className="text-[#8fa3b8] text-sm mt-0.5">
                  2025 Season — WR/TE target distribution across BMFFFL rosters
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#4a6a80]">
              <span>{PLAYERS.filter(p => p.pos === 'WR').length} wide receivers</span>
              <span>·</span>
              <span>{PLAYERS.filter(p => p.pos === 'TE').length} tight ends</span>
              <span>·</span>
              <span>{ALL_OWNERS.length} BMFFFL owners</span>
              <span>·</span>
              <span>2025 regular season</span>
            </div>
          </div>

          {/* Owner Concentration */}
          <OwnerConcentration players={PLAYERS} />

          {/* Treemap */}
          <Treemap players={PLAYERS} />

          {/* Stats Table */}
          <StatsTable players={PLAYERS} />

        </div>
      </div>
    </>
  );
}
