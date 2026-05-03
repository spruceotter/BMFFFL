import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line, ReferenceLine, Legend,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Users, Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OwnershipWindow {
  player_id: string;
  owner: string;
  acquisition_type: string;
  acquisition_season: string;
  acquisition_date: number | null;
  acquisition_cost: number | null;
  acquisition_pick: string | null;
  release_type: string;
  release_date: number | null;
  release_season: string | null;
  dynasty_adp_at_acquisition?: {
    rank: number;
    pos_rank: string;
    adp: number;
    year: number;
    percentile: number;
    total_ranked: number;
  } | null;
}

interface WeeklyRecord {
  year: number;
  week: number;
  pts: number;
  started: boolean;
  roster_id: number;
  owner: string;
}

interface DynastyAdpEntry {
  rank: number;
  pos_rank: string;
  adp: number;
}

interface CareerStats {
  total_pts_started: number;
  total_pts_benched: number;
  weeks_started: number;
  weeks_benched: number;
  avg_pts_started: number;
  avg_pts_benched: number;
}

interface PlayerProfile {
  player_id: string;
  name: string;
  position: string;
  nfl_team: string;
  current_bmfffl_owner: string | null;
  ownership_history: OwnershipWindow[];
  weekly_performance: WeeklyRecord[];
  dynasty_adp_history: Record<string, DynastyAdpEntry>;
  career_bmfffl: CareerStats;
}

interface Props {
  player: PlayerProfile;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POS_COLORS: Record<string, string> = {
  QB: 'bg-red-500/20 text-red-300 border-red-500/30',
  RB: 'bg-green-500/20 text-green-300 border-green-500/30',
  WR: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  TE: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  K:  'bg-gray-500/20 text-gray-300 border-gray-500/30',
  DEF:'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const ACQ_LABELS: Record<string, string> = {
  auction_draft: 'Auction Draft',
  rookie_draft_espn: 'Rookie Draft',
  rookie_draft_sleeper: 'Rookie Draft',
  trade: 'Trade',
  waiver: 'Waiver',
  free_agent: 'Free Agent',
  unknown: 'Unknown',
};

const RELEASE_LABELS: Record<string, string> = {
  dropped: 'Dropped',
  traded: 'Traded',
  still_held: 'Current Owner',
};

// owner → consistent color (stable across charts)
const OWNER_PALETTE = [
  '#34d399', '#60a5fa', '#f59e0b', '#f472b6',
  '#a78bfa', '#fb923c', '#4ade80', '#38bdf8',
  '#e879f9', '#facc15',
];

function getOwnerColor(owner: string, allOwners: string[]): string {
  const idx = allOwners.indexOf(owner);
  return OWNER_PALETTE[idx % OWNER_PALETTE.length] ?? '#9ca3af';
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlayerPage({ player }: Props) {
  const posClass = POS_COLORS[player.position] || POS_COLORS.K;

  // All unique owners across history (for color assignment)
  const allOwners = useMemo(() => {
    const set = new Set<string>();
    player.ownership_history.forEach(w => { if (w.owner && w.owner !== 'unknown') set.add(w.owner); });
    player.weekly_performance.forEach(r => { if (r.owner) set.add(r.owner); });
    return Array.from(set);
  }, [player]);

  // Group weekly performance by season
  const weeksByYear = useMemo(() => {
    const map: Record<number, WeeklyRecord[]> = {};
    for (const r of player.weekly_performance) {
      if (!map[r.year]) map[r.year] = [];
      map[r.year].push(r);
    }
    return map;
  }, [player.weekly_performance]);

  const seasons = Object.keys(weeksByYear).map(Number).sort((a, b) => a - b);

  // ADP history sorted
  const adpYears = Object.entries(player.dynasty_adp_history)
    .map(([yr, v]) => ({ year: Number(yr), ...v }))
    .sort((a, b) => a.year - b.year);

  return (
    <>
      <Head>
        <title>{player.name} — BMFFFL</title>
        <meta name="description" content={`${player.name} BMFFFL history: ${player.career_bmfffl.total_pts_started.toFixed(0)} pts started across ${player.career_bmfffl.weeks_started} weeks.`} />
      </Head>

      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

          {/* Back nav */}
          <Link href="/players" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Players
          </Link>

          {/* ── Hero header ──────────────────────────────────────────────── */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-white">{player.name}</h1>
                  <span className={cn('text-sm px-2 py-0.5 rounded border font-mono', posClass)}>
                    {player.position}
                  </span>
                </div>
                {player.nfl_team && (
                  <p className="text-gray-400 text-sm">{player.nfl_team}</p>
                )}
                {player.current_bmfffl_owner && (
                  <p className="text-emerald-400 text-sm mt-1">
                    <span className="text-gray-500">Current BMFFFL owner: </span>
                    {player.current_bmfffl_owner}
                  </p>
                )}
              </div>
            </div>

            {/* Career stat pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <StatPill label="Career Pts (Started)" value={player.career_bmfffl.total_pts_started.toFixed(1)} />
              <StatPill label="Weeks Started" value={player.career_bmfffl.weeks_started} />
              <StatPill label="Avg Pts / Start" value={player.career_bmfffl.avg_pts_started.toFixed(1)} />
              <StatPill label="Times Owned" value={player.ownership_history.filter(w => w.owner !== 'unknown').length} />
            </div>
          </div>

          {/* ── Ownership Timeline ───────────────────────────────────────── */}
          {player.ownership_history.length > 0 && (
            <Section title="Ownership History" icon={<Users className="w-5 h-5 text-emerald-400" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-800">
                      <th className="pb-2 text-left font-medium">Season</th>
                      <th className="pb-2 text-left font-medium">Owner</th>
                      <th className="pb-2 text-left font-medium">How Acquired</th>
                      <th className="pb-2 text-left font-medium">Cost / Pick</th>
                      <th className="pb-2 text-left font-medium">Dyn ADP</th>
                      <th className="pb-2 text-left font-medium">Departure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {player.ownership_history.map((w, i) => {
                      const ownerColor = w.owner !== 'unknown' ? getOwnerColor(w.owner, allOwners) : '#6b7280';
                      const isCurrent = w.release_type === 'still_held';
                      return (
                        <tr key={i} className={cn('transition-colors', isCurrent && 'bg-emerald-500/5')}>
                          <td className="py-2.5 pr-4 font-medium text-white">{w.acquisition_season}</td>
                          <td className="py-2.5 pr-4">
                            <span style={{ color: ownerColor }} className="font-medium">
                              {w.owner === 'unknown' ? '—' : w.owner}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-gray-400">
                            {ACQ_LABELS[w.acquisition_type] || w.acquisition_type}
                          </td>
                          <td className="py-2.5 pr-4 text-gray-400 font-mono text-xs">
                            {w.acquisition_cost != null ? `$${w.acquisition_cost}` : ''}
                            {w.acquisition_pick ?? ''}
                            {!w.acquisition_cost && !w.acquisition_pick ? '—' : ''}
                          </td>
                          <td className="py-2.5 pr-4">
                            {w.dynasty_adp_at_acquisition ? (
                              <span className="text-xs font-mono text-amber-400">
                                #{w.dynasty_adp_at_acquisition.rank} ({w.dynasty_adp_at_acquisition.pos_rank})
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-2.5">
                            {isCurrent ? (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Active Roster
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">
                                {RELEASE_LABELS[w.release_type] || w.release_type}
                                {w.release_season ? ` (${w.release_season})` : ''}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* ── Weekly Performance by Season ─────────────────────────────── */}
          {seasons.length > 0 && (
            <Section title="Weekly Performance" icon={<Calendar className="w-5 h-5 text-emerald-400" />}>
              <div className="space-y-6">
                {seasons.map(yr => (
                  <SeasonChart
                    key={yr}
                    year={yr}
                    weeks={weeksByYear[yr]}
                    allOwners={allOwners}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* ── Dynasty ADP History ──────────────────────────────────────── */}
          {adpYears.length > 1 && (
            <Section title="Dynasty ADP History" icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}>
              <AdpChart adpYears={adpYears} />
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {adpYears.map(a => (
                  <div key={a.year} className="bg-gray-800 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-gray-500">{a.year}</p>
                    <p className="text-white font-bold text-sm">#{a.rank}</p>
                    <p className="text-xs text-amber-400 font-mono">{a.pos_rank}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

        </div>
      </main>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-white tabular-nums">{value}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        {icon}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Season Bar Chart ─────────────────────────────────────────────────────────

function SeasonChart({
  year,
  weeks,
  allOwners,
}: {
  year: number;
  weeks: WeeklyRecord[];
  allOwners: string[];
}) {
  const sorted = [...weeks].sort((a, b) => a.week - b.week);
  // Aggregate multiple same-week entries (can happen with roster duplication)
  const deduped: WeeklyRecord[] = [];
  const seen = new Set<number>();
  for (const r of sorted) {
    if (!seen.has(r.week)) {
      deduped.push(r);
      seen.add(r.week);
    }
  }

  const seasonPtsStarted = deduped.filter(r => r.started).reduce((s, r) => s + r.pts, 0);
  const ownersThisSeason = Array.from(new Set(deduped.map(r => r.owner)));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-300">{year}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {ownersThisSeason.filter(o => o).map(o => (
            <span key={o} style={{ color: getOwnerColor(o, allOwners) }}>{o}</span>
          ))}
          <span className="text-gray-600">{seasonPtsStarted.toFixed(1)} pts started</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={deduped} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `W${v}`}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            content={<WeekTooltip allOwners={allOwners} />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <Bar dataKey="pts" radius={[2, 2, 0, 0]}>
            {deduped.map((r, i) => {
              const ownerColor = getOwnerColor(r.owner, allOwners);
              return (
                <Cell
                  key={i}
                  fill={r.started ? ownerColor : `${ownerColor}40`}
                  stroke={r.started ? ownerColor : 'transparent'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend: solid = started, faded = benched */}
      <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />
          Started
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-emerald-400/25 inline-block" />
          Benched
        </span>
      </div>
    </div>
  );
}

function WeekTooltip({ active, payload, allOwners }: {
  active?: boolean;
  payload?: { payload: WeeklyRecord }[];
  allOwners: string[];
}) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  const ownerColor = getOwnerColor(r.owner, allOwners);
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">Week {r.week} · {r.year}</p>
      <p className="text-white font-bold text-sm">{r.pts.toFixed(2)} pts</p>
      <p style={{ color: ownerColor }}>{r.owner}</p>
      <p className={r.started ? 'text-emerald-400' : 'text-gray-500'}>
        {r.started ? 'Started' : 'Benched'}
      </p>
    </div>
  );
}

// ─── Dynasty ADP Line Chart ───────────────────────────────────────────────────

function AdpChart({ adpYears }: { adpYears: { year: number; rank: number; pos_rank: string; adp: number }[] }) {
  // Invert rank so "better" = higher on chart
  const maxRank = Math.max(...adpYears.map(a => a.rank));
  const data = adpYears.map(a => ({
    year: a.year.toString(),
    rank: a.rank,
    pos_rank: a.pos_rank,
    inverted: maxRank - a.rank + 1,
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="year"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis hide />
        <Tooltip content={<AdpTooltip />} />
        <Line
          type="monotone"
          dataKey="inverted"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 4, fill: '#f59e0b', stroke: '#f59e0b' }}
          activeDot={{ r: 6, fill: '#f59e0b' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function AdpTooltip({ active, payload }: {
  active?: boolean;
  payload?: { payload: { year: string; rank: number; pos_rank: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{d.year}</p>
      <p className="text-amber-400 font-bold text-sm">#{d.rank} overall</p>
      <p className="text-gray-300">{d.pos_rank}</p>
    </div>
  );
}

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const indexPath = path.join(process.cwd(), 'public', 'data', 'player-index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as { player_id: string }[];
  const paths = index.map(p => ({ params: { id: p.player_id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const id = params?.id as string;
  const profilePath = path.join(process.cwd(), 'public', 'data', 'players', `${id}.json`);

  if (!fs.existsSync(profilePath)) {
    return { notFound: true };
  }

  const player: PlayerProfile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
  return { props: { player } };
};
