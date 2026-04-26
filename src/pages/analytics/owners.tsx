import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Trophy, TrendingUp, TrendingDown, Crown, Users, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import StatCard from '@/components/ui/StatCard';
import { StatBadge, TrendArrow } from '@/components/ui/StatComponents';
import { PageStatusBanner } from '@/components/status/PageStatusBanner';

// ─── Owner Data ───────────────────────────────────────────────────────────────

// Ring counts: all-time championships (ESPN 2016–2019 + Sleeper 2020–2025).
// W/L records: All-time for ESPN-era owners (ESPN 2016–2019 API-verified + Sleeper 2020–2025 DB-verified).
//              Sleeper-only for Tubes94 (joined 2021) and Escuelas/MCSchools (joined 2020).
// playoffApps: ALL-TIME (ESPN winners bracket + Sleeper winners bracket), verified.
// dynastyRank: BMFFFL-internal dynasty value ranking (Tubes94 = hottest current dynasty).
// Sleeper-only (no ESPN era): Tubes94 (joined 2021), Escuelas/MCSchools (joined 2020).
const OWNERS_DATA = [
  { slug: 'cogdeill11',    name: 'Cogdeill11',      rings: 2, wins: 67,  losses: 68, playoffApps: 5,  dynastyRank: 3,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'mlschools12',   name: 'MLSchools12',     rings: 4, wins: 114, losses: 21, playoffApps: 10, dynastyRank: 2,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'rbr',           name: 'rbr',             rings: 0, wins: 73,  losses: 62, playoffApps: 8,  dynastyRank: 4,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'juicybussy',    name: 'JuicyBussy',      rings: 1, wins: 67,  losses: 68, playoffApps: 5,  dynastyRank: 5,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'tdtd19844',     name: 'tdtd19844',       rings: 1, wins: 55,  losses: 80, playoffApps: 4,  dynastyRank: 6,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'sexmachineandy',name: 'SexMachineAndyD', rings: 1, wins: 78,  losses: 57, playoffApps: 6,  dynastyRank: 7,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'eldridm20',     name: 'eldridm20',       rings: 0, wins: 39,  losses: 44, playoffApps: 3,  dynastyRank: 8,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'tubes94',       name: 'Tubes94',         rings: 0, wins: 38,  losses: 42, playoffApps: 2,  dynastyRank: 1,  seasons: [2021,2022,2023,2024,2025] },
  { slug: 'grandes',       name: 'Grandes',         rings: 1, wins: 71,  losses: 64, playoffApps: 5,  dynastyRank: 9,  seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'eldridsm',      name: 'eldridsm',        rings: 0, wins: 59,  losses: 76, playoffApps: 4,  dynastyRank: 11, seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'cmaleski',      name: 'Cmaleski',        rings: 0, wins: 55,  losses: 80, playoffApps: 4,  dynastyRank: 12, seasons: [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  { slug: 'escuelas',      name: 'Escuelas',        rings: 0, wins: 24,  losses: 74, playoffApps: 0,  dynastyRank: 10, seasons: [2020,2021,2022,2023,2024,2025] },
];

// ─── Season Rank Data ─────────────────────────────────────────────────────────

// Index order: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
//  0 = not in league that year
// -1 = in league, ESPN-era full standings not available (only champion #1 confirmed)
// 1–12 = verified final season finish (playoff outcome + reg-season tiebreak for non-playoff teams)
//
// Sleeper era (2020–2025): fully DB-verified via matchup results + playoff bracket data (Flint DB, B757).
// ESPN era (2016–2019):   only champion positions confirmed (ESPN API pull B546).
//
// Champions: 2016=MLSchools12, 2017=Cogdeill11, 2018=SexMachineAndyD, 2019=MLSchools12
//            2020=Cogdeill11, 2021=MLSchools12, 2022=Grandes, 2023=JuicyBussy, 2024=MLSchools12, 2025=tdtd19844
// Runner-ups: 2020=eldridsm, 2021=SexMachineAndyD, 2022=rbr, 2023=eldridm20, 2024=SexMachineAndyD, 2025=Tubes94
const SEASON_RANKS: Record<string, number[]> = {
  //                       2016  2017  2018  2019  2020  2021  2022  2023  2024  2025
  'Cogdeill11':          [  -1,    1,   -1,   -1,    1,    6,    8,   11,   10,   11],
  'MLSchools12':         [   1,   -1,   -1,    1,    3,    1,    3,    3,    1,    3],
  'rbr':                 [  -1,   -1,   -1,   -1,    5,    4,    2,    8,    5,   10],
  'JuicyBussy':          [  -1,   -1,   -1,   -1,    8,    7,    4,    1,    4,    6],
  'tdtd19844':           [  -1,   -1,   -1,   -1,    4,    9,   12,    9,    6,    1],
  'SexMachineAndyD':     [  -1,   -1,    1,   -1,    6,    2,    9,   10,    2,    5],
  'eldridm20':           [  -1,   -1,   -1,   -1,   11,    5,    6,    2,    8,    7],
  'Tubes94':             [   0,    0,    0,    0,    0,   11,   11,    7,    3,    2],
  'Grandes':             [  -1,   -1,   -1,   -1,   10,    3,    1,    4,    7,   12],
  'eldridsm':            [  -1,   -1,   -1,   -1,    2,    8,    5,    6,   11,    9],
  'Cmaleski':            [  -1,   -1,   -1,   -1,    7,   10,    7,    5,    9,    4],
  'Escuelas':            [   0,    0,    0,    0,    9,   12,   10,   12,   12,    8],
};

const SEASONS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// ─── Rank Cell Color ─────────────────────────────────────────────────────────

function getRankColor(rank: number): string {
  if (rank === 0)  return 'bg-slate-800/40 text-slate-600';                                          // not in league
  if (rank === -1) return 'bg-slate-700/30 text-slate-500 border border-slate-600/20';              // ESPN era, data N/A
  if (rank === 1)  return 'bg-[#ffd700]/20 text-[#ffd700] font-bold border border-[#ffd700]/30';
  if (rank <= 3)   return 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20';
  if (rank <= 6)   return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
  if (rank <= 9)   return 'bg-slate-500/15 text-slate-400 border border-slate-500/20';
  return 'bg-[#e94560]/10 text-[#e94560]/80 border border-[#e94560]/20';
}

function getRankLabel(rank: number): string {
  if (rank === 0)  return '—';
  if (rank === -1) return '?';
  return `#${rank}`;
}

// ─── Performance Tier Logic ───────────────────────────────────────────────────

type Tier = 'champion' | 'contender' | 'competitor' | 'rebuilding';

function getOwnerTier(owner: typeof OWNERS_DATA[0]): Tier {
  if (owner.rings >= 2) return 'champion';
  if (owner.rings >= 1 || owner.playoffApps >= 3) return 'contender';
  if (owner.playoffApps >= 1) return 'competitor';
  return 'rebuilding';
}

const TIER_CONFIG: Record<Tier, { label: string; color: string; bg: string; border: string; description: string }> = {
  champion:   { label: 'Champion Tier',   color: 'text-[#ffd700]',    bg: 'bg-[#ffd700]/10',    border: 'border-[#ffd700]/30',    description: '2+ championship rings — BMFFFL royalty' },
  contender:  { label: 'Contender Tier',  color: 'text-emerald-400',  bg: 'bg-emerald-500/10',  border: 'border-emerald-500/30',  description: '1 ring or 3+ playoff appearances' },
  competitor: { label: 'Competitor Tier', color: 'text-blue-400',     bg: 'bg-blue-500/10',     border: 'border-blue-500/30',     description: 'Playoff experience, still seeking first ring' },
  rebuilding: { label: 'Rebuilding Tier', color: 'text-slate-400',    bg: 'bg-slate-500/10',    border: 'border-slate-500/30',    description: 'Building for the future — no playoff appearances yet' },
};

// ─── Owner Detail Stat Helpers ────────────────────────────────────────────────

function getBestSeason(name: string): { year: number; rank: number } | null {
  const ranks = SEASON_RANKS[name];
  if (!ranks) return null;
  let best: { year: number; rank: number } | null = null;
  ranks.forEach((r, i) => {
    if (r > 0 && (!best || r < best.rank)) {
      best = { year: SEASONS[i], rank: r };
    }
  });
  return best;
}

function getWorstSeason(name: string): { year: number; rank: number } | null {
  const ranks = SEASON_RANKS[name];
  if (!ranks) return null;
  let worst: { year: number; rank: number } | null = null;
  ranks.forEach((r, i) => {
    if (r > 0 && (!worst || r > worst.rank)) {
      worst = { year: SEASONS[i], rank: r };
    }
  });
  return worst;
}

function getTrend(name: string): 'up' | 'down' | 'neutral' {
  const ranks = SEASON_RANKS[name];
  if (!ranks) return 'neutral';
  // Compare last two active seasons with known data (r > 0)
  const active = ranks.map((r, i) => ({ r, i })).filter(x => x.r > 0);
  if (active.length < 2) return 'neutral';
  const last = active[active.length - 1].r;
  const prev = active[active.length - 2].r;
  // Lower rank number = better
  if (last < prev) return 'up';
  if (last > prev) return 'down';
  return 'neutral';
}

// ─── All Owners Table ─────────────────────────────────────────────────────────

function AllOwnersTable({ onSelectOwner }: { onSelectOwner: (name: string) => void }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="All owners season-by-season ranks">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                Owner
              </th>
              {SEASONS.map(yr => (
                <th key={yr} scope="col" className={cn(
                  'px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
                  yr <= 2019 ? 'text-slate-500' : 'text-slate-400'
                )}>
                  {yr <= 2019 ? (
                    <span title="ESPN era — full standings not available">{yr}</span>
                  ) : yr}
                </th>
              ))}
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#ffd700]">
                Rings
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                W-L
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {OWNERS_DATA.map((owner, idx) => {
              const ranks = SEASON_RANKS[owner.name] ?? [];
              const trend = getTrend(owner.name);
              const best = getBestSeason(owner.name);
              const winPct = owner.wins + owner.losses > 0
                ? (owner.wins / (owner.wins + owner.losses) * 100).toFixed(0)
                : '0';

              return (
                <tr
                  key={owner.slug}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550] cursor-pointer',
                    idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                  onClick={() => onSelectOwner(owner.name)}
                  title={`View ${owner.name} detail`}
                >
                  {/* Owner name */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {owner.rings > 0 && (
                        <Crown className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                      )}
                      <span className="font-semibold text-white hover:text-[#ffd700] transition-colors">
                        {owner.name}
                      </span>
                      {best?.rank === 1 && (
                        <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] font-bold uppercase border border-[#ffd700]/30">
                          GOAT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Per-season rank cells */}
                  {SEASONS.map((yr, i) => {
                    const rank = ranks[i] ?? 0;
                    return (
                      <td key={yr} className="px-3 py-3 text-center">
                        <span className={cn(
                          'inline-flex items-center justify-center w-8 h-7 rounded text-xs tabular-nums',
                          getRankColor(rank)
                        )}>
                          {getRankLabel(rank)}
                        </span>
                      </td>
                    );
                  })}

                  {/* Rings */}
                  <td className="px-3 py-3 text-center">
                    <span className={cn(
                      'font-bold text-sm',
                      owner.rings > 0 ? 'text-[#ffd700]' : 'text-slate-600'
                    )}>
                      {owner.rings > 0 ? owner.rings : '—'}
                    </span>
                  </td>

                  {/* W-L */}
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-300 tabular-nums">
                      {owner.wins}
                      <span className="text-slate-600">-</span>
                      {owner.losses}
                    </span>
                    <span className="ml-1 text-[10px] text-slate-500">({winPct}%)</span>
                  </td>

                  {/* Trend */}
                  <td className="px-3 py-3 text-center">
                    <TrendArrow direction={trend} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-[#0f2744] border-t border-[#2d4a66] flex flex-wrap gap-3 items-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Rank key:</span>
        {[
          { label: '#1', cls: 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30' },
          { label: '#2-3', cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' },
          { label: '#4-6', cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/20' },
          { label: '#7-9', cls: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' },
          { label: '#10-12', cls: 'bg-[#e94560]/10 text-[#e94560]/80 border border-[#e94560]/20' },
          { label: '?', cls: 'bg-slate-700/30 text-slate-500 border border-slate-600/20' },
          { label: 'N/A', cls: 'bg-slate-800/40 text-slate-600' },
        ].map(item => (
          <span key={item.label} className={cn('inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold', item.cls)}>
            {item.label}
          </span>
        ))}
        <span className="text-[10px] text-slate-600 ml-1">? = ESPN era (2016–2019), champion only confirmed &bull; N/A = not in league &bull; Click row for detail</span>
      </div>
    </div>
  );
}

// ─── Owner Detail View ────────────────────────────────────────────────────────

function OwnerDetailView({ ownerName, onBack }: { ownerName: string; onBack: () => void }) {
  const owner = OWNERS_DATA.find(o => o.name === ownerName);
  if (!owner) return null;

  const ranks = SEASON_RANKS[ownerName] ?? [];
  const best = getBestSeason(ownerName);
  const worst = getWorstSeason(ownerName);
  const trend = getTrend(ownerName);
  const tier = getOwnerTier(owner);
  const tierCfg = TIER_CONFIG[tier];
  const totalGames = owner.wins + owner.losses;
  const winPct = totalGames > 0 ? (owner.wins / totalGames).toFixed(3).replace(/^0/, '') : '.000';

  // Active seasons with known rank data (r > 0)
  const activeSeasons = SEASONS
    .map((yr, i) => ({ year: yr, rank: ranks[i] ?? 0 }))
    .filter(s => s.rank > 0);

  // Avg rank (known seasons only)
  const avgRank = activeSeasons.length > 0
    ? (activeSeasons.reduce((sum, s) => sum + s.rank, 0) / activeSeasons.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* Back button + owner header */}
      <div className="flex items-start gap-4 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white bg-[#16213e] border border-[#2d4a66] hover:border-[#3a5f80] transition-colors"
        >
          ← All Owners
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{owner.name}</h2>
            {owner.rings > 0 && (
              <div className="flex gap-1">
                {Array.from({ length: owner.rings }).map((_, i) => (
                  <Trophy key={i} className="w-5 h-5 text-[#ffd700]" aria-label="Championship ring" />
                ))}
              </div>
            )}
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
              tierCfg.bg, tierCfg.border, tierCfg.color, 'border'
            )}>
              {tierCfg.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Active since {Math.min(...owner.seasons)} &bull; {owner.seasons.length} seasons
          </p>
        </div>
      </div>

      {/* Career stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="All-Time Record" value={`${owner.wins}-${owner.losses}`} subtext={`${winPct} win pct`} trend={trend} />
        <StatCard label="Championships" value={owner.rings} subtext={owner.rings > 0 ? 'Verified rings' : 'Still hunting'} />
        <StatCard label="Playoff Apps" value={owner.playoffApps} subtext={`of ${owner.seasons.length} seasons`} />
        <StatCard label="Avg Finish" value={avgRank} subtext="Known seasons only" />
      </div>

      {/* Season-by-season rank visualization */}
      <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Season-by-Season Finish
        </h3>

        {/* Rank bars */}
        <div className="flex items-end gap-1 sm:gap-2 h-40 mb-3">
          {SEASONS.map((yr, i) => {
            const rank = ranks[i] ?? 0;
            if (rank <= 0) {
              return (
                <div key={yr} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex-1 flex items-end">
                    <div className={cn(
                      'w-full h-1 rounded',
                      rank === -1 ? 'bg-slate-700' : 'bg-slate-800'
                    )} />
                  </div>
                  <span className="text-[9px] text-slate-600 tabular-nums">{yr}</span>
                </div>
              );
            }
            // Bar height: rank 1 = full (100%), rank 12 = tiny (8%)
            const barPct = Math.max(8, 100 - ((rank - 1) / 11) * 92);
            const color = rank === 1
              ? 'bg-[#ffd700]'
              : rank <= 3
                ? 'bg-emerald-500'
                : rank <= 6
                  ? 'bg-blue-500'
                  : rank <= 9
                    ? 'bg-slate-500'
                    : 'bg-[#e94560]';

            return (
              <div key={yr} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center justify-end" style={{ height: '100%' }}>
                  <span className={cn('text-[9px] font-bold mb-1', rank === 1 ? 'text-[#ffd700]' : 'text-slate-400')}>
                    #{rank}
                  </span>
                  <div
                    className={cn('w-full rounded-t transition-all', color)}
                    style={{ height: `${barPct}%` }}
                    title={`${yr}: #${rank}`}
                  />
                </div>
                <span className="text-[9px] text-slate-500 tabular-nums">{yr}</span>
              </div>
            );
          })}
        </div>

        {/* Best / worst callouts */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {best && (
            <div className="rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20 px-3 py-2.5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Best Season</p>
              <p className="text-sm font-bold text-[#ffd700]">{best.year} — #{best.rank}</p>
              {best.rank === 1 && <p className="text-[10px] text-[#ffd700]/60 mt-0.5">League Champion</p>}
            </div>
          )}
          {worst && (
            <div className="rounded-lg bg-[#e94560]/5 border border-[#e94560]/20 px-3 py-2.5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Worst Season</p>
              <p className="text-sm font-bold text-[#e94560]">{worst.year} — #{worst.rank}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Floor finish</p>
            </div>
          )}
        </div>
      </div>

      {/* Season table detail */}
      <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
        <table className="min-w-full text-sm" aria-label={`${ownerName} season breakdown`}>
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Season</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Finish</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {SEASONS.map((yr, i) => {
              const rank = ranks[i] ?? 0;
              if (rank <= 0) {
                return (
                  <tr key={yr} className="bg-[#1a2d42]/40">
                    <td className="px-4 py-2.5 text-slate-600 tabular-nums font-mono">{yr}</td>
                    <td className="px-4 py-2.5 text-center">
                      {rank === -1 ? (
                        <span className={cn('inline-flex items-center justify-center w-9 h-7 rounded text-xs', getRankColor(-1))}>?</span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 text-xs">
                      {rank === -1 ? 'ESPN era — full standings not available' : 'Not in league'}
                    </td>
                  </tr>
                );
              }
              const isChamp = rank === 1;
              const isPlayoff = rank <= 6;
              const note = isChamp
                ? 'League Champion'
                : rank === 2
                  ? 'Runner-up'
                  : rank === 3
                    ? '3rd place'
                    : rank === 4
                      ? '4th place (semifinalist)'
                      : rank <= 6
                        ? 'Playoff appearance (first round exit)'
                        : rank <= 9
                          ? 'Missed playoffs'
                          : 'Cellar finish';

              return (
                <tr
                  key={yr}
                  className={cn(
                    'transition-colors',
                    i % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                    isChamp && 'ring-1 ring-inset ring-[#ffd700]/20'
                  )}
                >
                  <td className={cn('px-4 py-2.5 font-bold tabular-nums font-mono', isChamp ? 'text-[#ffd700]' : 'text-white')}>
                    {yr}
                    {isChamp && (
                      <Trophy className="inline-block ml-1.5 w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={cn('inline-flex items-center justify-center w-9 h-7 rounded text-xs font-bold tabular-nums', getRankColor(rank))}>
                      #{rank}
                    </span>
                  </td>
                  <td className={cn('px-4 py-2.5 text-xs', isChamp ? 'text-[#ffd700]/80 font-semibold' : isPlayoff ? 'text-blue-400/70' : 'text-slate-400')}>
                    {note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Performance Tier Sidebar ─────────────────────────────────────────────────

function PerformanceTierSidebar() {
  const tiers: Tier[] = ['champion', 'contender', 'competitor', 'rebuilding'];

  const ownersByTier = useMemo(() => {
    const map: Record<Tier, typeof OWNERS_DATA> = {
      champion: [], contender: [], competitor: [], rebuilding: [],
    };
    OWNERS_DATA.forEach(o => {
      map[getOwnerTier(o)].push(o);
    });
    return map;
  }, []);

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2d4a66] bg-[#0f2744]">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
          Performance Tiers
        </h3>
      </div>
      <div className="divide-y divide-[#1e3347]">
        {tiers.map(tier => {
          const cfg = TIER_CONFIG[tier];
          const owners = ownersByTier[tier];
          if (owners.length === 0) return null;
          return (
            <div key={tier} className="px-5 py-4">
              <div className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border',
                cfg.bg, cfg.border, cfg.color
              )}>
                {tier === 'champion' && <Crown className="w-3 h-3" aria-hidden="true" />}
                {tier === 'contender' && <Trophy className="w-3 h-3" aria-hidden="true" />}
                {tier === 'competitor' && <TrendingUp className="w-3 h-3" aria-hidden="true" />}
                {tier === 'rebuilding' && <TrendingDown className="w-3 h-3" aria-hidden="true" />}
                {cfg.label}
              </div>
              <p className="text-[11px] text-slate-500 mb-2 leading-snug">{cfg.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {owners.map(o => (
                  <span
                    key={o.slug}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                      'bg-[#0d1b2a] border border-[#2d4a66] text-slate-300'
                    )}
                  >
                    {o.rings > 0 && <Crown className="w-2.5 h-2.5 text-[#ffd700]" aria-hidden="true" />}
                    {o.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Owner Selector Dropdown ──────────────────────────────────────────────────

function OwnerSelector({
  selected,
  onChange,
}: {
  selected: string | null;
  onChange: (name: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  const label = selected ?? 'All Owners';

  return (
    <div className="relative w-full sm:w-64">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold',
          'bg-[#16213e] border transition-colors duration-150',
          open ? 'border-[#ffd700]/50 text-[#ffd700]' : 'border-[#2d4a66] text-white hover:border-[#3a5f80]'
        )}
      >
        <span>{label}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select owner"
          className="absolute z-20 mt-1 w-full rounded-lg border border-[#2d4a66] bg-[#16213e] shadow-2xl overflow-hidden"
        >
          <button
            role="option"
            aria-selected={selected === null}
            onClick={() => { onChange(null); setOpen(false); }}
            className={cn(
              'w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1f3550]',
              selected === null ? 'text-[#ffd700] font-bold bg-[#ffd700]/5' : 'text-slate-300'
            )}
          >
            All Owners
          </button>
          <div className="border-t border-[#2d4a66]" />
          {OWNERS_DATA.map(o => (
            <button
              key={o.slug}
              role="option"
              aria-selected={selected === o.name}
              onClick={() => { onChange(o.name); setOpen(false); }}
              className={cn(
                'w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#1f3550] flex items-center gap-2',
                selected === o.name ? 'text-[#ffd700] font-semibold bg-[#ffd700]/5' : 'text-slate-300'
              )}
            >
              {o.rings > 0 && <Crown className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />}
              {o.name}
              {o.rings > 0 && (
                <span className="ml-auto text-xs text-[#ffd700]/60 tabular-nums">
                  {o.rings}x
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OwnersAnalyticsPage() {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Owner Performance Dashboard — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football owner performance dashboard — season-by-season rankings, career records, and dynasty tier breakdowns for all 12 managers across 10 seasons (2016–2025)."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            Owner Analytics
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            Owner Performance Dashboard
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Season-by-season rankings, career records, and dynasty tier breakdowns for all 12 BMFFFL managers across 10 seasons (2016–2025).
          </p>
        </header>

        {/* Data status notice */}
        <PageStatusBanner
          status="partial"
          notes="Sleeper era (2020–2025): rankings DB-verified via playoff brackets + standings. ESPN era (2016–2019): champion positions only confirmed; full standings not available in DB."
        />

        {/* Controls row */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 font-medium whitespace-nowrap">View Owner:</span>
            <OwnerSelector selected={selectedOwner} onChange={setSelectedOwner} />
          </div>
          {selectedOwner && (
            <div className="flex gap-2 flex-wrap">
              <StatBadge label="W-L" value={`${OWNERS_DATA.find(o => o.name === selectedOwner)?.wins ?? 0}-${OWNERS_DATA.find(o => o.name === selectedOwner)?.losses ?? 0}`} color="blue" />
              <StatBadge label="Rings" value={OWNERS_DATA.find(o => o.name === selectedOwner)?.rings ?? 0} color="gold" />
              <StatBadge label="Playoffs" value={OWNERS_DATA.find(o => o.name === selectedOwner)?.playoffApps ?? 0} color="green" />
            </div>
          )}
        </div>

        {/* Main layout: content + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">

          {/* Main content */}
          <div>
            {selectedOwner ? (
              <OwnerDetailView
                ownerName={selectedOwner}
                onBack={() => setSelectedOwner(null)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">All-Time Season Finishes</h2>
                  <span className="text-xs text-slate-500">2016 – 2025 &bull; Click a row to drill down</span>
                </div>
                <AllOwnersTable onSelectOwner={setSelectedOwner} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="xl:sticky xl:top-6 xl:self-start space-y-6">
            <PerformanceTierSidebar />

            {/* Quick stats */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">League Records</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Most Rings</span>
                  <span className="text-[#ffd700] font-bold">MLSchools12 (4)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Best Win %</span>
                  <span className="text-emerald-400 font-bold">MLSchools12 (.844)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Most Playoff Apps</span>
                  <span className="text-blue-400 font-bold">MLSchools12 (10)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Most Wins (all-time)</span>
                  <span className="text-slate-300 font-bold">MLSchools12 (114)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">2025 Champion</span>
                  <span className="text-[#ffd700] font-bold">tdtd19844</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Hottest Dynasty</span>
                  <span className="text-emerald-400 font-bold">Tubes94</span>
                </div>
              </div>
            </div>
          </aside>

        </div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-center text-slate-600">
          Sleeper era (2020–2025) season finishes are DB-verified: playoff bracket outcomes determine ranks 1–6; regular season standings determine ranks 7–12.
          ESPN era (2016–2019) shows champion (#1) positions only — full standings not available.
          Win/loss totals are all-time (regular season + playoffs). Click any owner row to view their full season breakdown.
        </p>

      </div>
    </>
  );
}
