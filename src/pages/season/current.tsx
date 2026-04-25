import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Zap, ArrowLeft, Loader2, TrendingUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAGUE_ID = '1312123497203376128';
const SEASON_YEAR = 2026;
const SLEEPER_LEAGUE_URL = `https://sleeper.com/leagues/${LEAGUE_ID}`;

// ─── Owner slug mapping (display_name → /owners/[slug]) ──────────────────────

const OWNER_SLUGS: Record<string, string> = {
  'MLSchools12':     'mlschools12',
  'Tubes94':         'tubes94',
  'SexMachineAndyD': 'sexmachineandy',
  'tdtd19844':       'tdtd19844',
  'JuicyBussy':      'juicybussy',
  'Cmaleski':        'cmaleski',
  'eldridm20':       'eldridm20',
  'eldridsm':        'eldridsm',
  'rbr':             'rbr',
  'Cogdeill11':      'cogdeill11',
  'Grandes':         'grandes',
  'Bimfle':          'bimfle',
};

// Pre-season power ranking (2025 final standing → 2026 projected strength)
// Source: 2025 final standings. Tubes94 (#2 finish), MLSchools12 (13-1 regular season).
const PRESEASON_POWER: Record<string, { rank: number; note: string }> = {
  'Tubes94':         { rank: 1,  note: 'Runner-up 2025. Deep rebuild paid off.' },
  'MLSchools12':     { rank: 2,  note: '13-1 in 2025 regular season. 4× champion (2016, 2019, 2021, 2024).' },
  'SexMachineAndyD': { rank: 3,  note: '9-5 in 2025. Perennial contender.' },
  'tdtd19844':       { rank: 4,  note: 'Defending champion. Proven playoff run.' },
  'JuicyBussy':      { rank: 5,  note: '7-7 in 2025. Former champion (2023).' },
  'Cmaleski':        { rank: 6,  note: '6-8 but 1990 pts — high scorer.' },
  'eldridm20':       { rank: 7,  note: '6-8 in 2025. Perennial mid-tier.' },
  'eldridsm':        { rank: 8,  note: '5-9 but 1751 pts for. Efficient.' },
  'rbr':             { rank: 9,  note: '5-9 in 2025. Strong draft capital.' },
  'Cogdeill11':      { rank: 10, note: '5-9 in 2025. 2× all-time champion (2017, 2020).' },
  'Grandes':         { rank: 11, note: '4-10 in 2025. Commissioner\'s bounce-back year.' },
  'Bimfle':          { rank: 12, note: 'Steward roster (Escuelas). Developmental.' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface StandingRow {
  rosterId: number;
  rank: number;
  powerRank: number;
  powerNote: string;
  owner: string;
  teamName: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  ownerSlug: string | null;
}

interface LiveMatchup {
  week: number;
  team1: string;
  team1Score: number;
  team2: string;
  team2Score: number;
  isComplete: boolean;
  team1Slug: string | null;
  team2Slug: string | null;
}

interface SeasonState {
  week: number;
  season: string;
  seasonType: string;
}

// ─── Sleeper API helpers ──────────────────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json();
}

// Compute live power rank from W/L + pts (in-season)
function computeLivePowerRanks(rows: StandingRow[]): StandingRow[] {
  const maxPts = Math.max(...rows.map(r => r.pointsFor), 1);
  const scored = rows.map(r => ({
    ...r,
    _score: (r.wins / Math.max(r.wins + r.losses, 1)) * 1000 + (r.pointsFor / maxPts) * 200,
  }));
  scored.sort((a, b) => b._score - a._score);
  return scored.map((r, i) => ({ ...r, powerRank: i + 1, powerNote: '' }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 text-[#ffd700] animate-spin" aria-hidden="true" />
      <p className="text-slate-400 text-sm">Loading live season data…</p>
    </div>
  );
}

function OwnerLink({ owner, slug, className }: { owner: string; slug: string | null; className?: string }) {
  if (slug) {
    return (
      <Link
        href={`/owners/${slug}`}
        className={cn('hover:text-[#ffd700] transition-colors duration-150 underline underline-offset-2 decoration-[#ffd700]/30 hover:decoration-[#ffd700]', className)}
      >
        {owner}
      </Link>
    );
  }
  return <span className={className}>{owner}</span>;
}

function StandingsTable({ standings, isPreSeason }: { standings: StandingRow[]; isPreSeason: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Current standings">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-12">Rank</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[140px]">Owner</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">W</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">L</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-28">Pts For</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-28">Pts Agnst</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-24">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {standings.map((row, idx) => {
              const isPlayoff = row.rank <= 6;
              const isLast = row.rank === standings.length;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={row.rosterId}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                        isPlayoff
                          ? 'bg-[#16213e] text-[#22c55e] border border-[#22c55e]/40'
                          : 'bg-[#16213e] text-slate-500 border border-[#2d4a66]'
                      )}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <OwnerLink owner={row.owner} slug={row.ownerSlug} className="font-semibold text-white" />
                      {row.teamName && row.teamName !== row.owner && (
                        <span className="text-xs text-slate-500">{row.teamName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#22c55e]">{row.wins}</td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#ef4444]">{row.losses}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums">
                    {row.pointsFor > 0 ? row.pointsFor.toFixed(2) : isPreSeason ? '—' : '0.00'}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400 tabular-nums">
                    {row.pointsAgainst > 0 ? row.pointsAgainst.toFixed(2) : isPreSeason ? '—' : '0.00'}
                  </td>
                  <td className="px-4 py-3">
                    {isPlayoff ? (
                      <Badge variant="playoff" size="sm">Playoff Track</Badge>
                    ) : isLast ? (
                      <Badge variant="last" size="sm">Last Place</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Regular</Badge>
                    )}
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

function PowerRankingsPanel({ standings, isPreSeason }: { standings: StandingRow[]; isPreSeason: boolean }) {
  const sorted = [...standings].sort((a, b) => a.powerRank - b.powerRank);

  return (
    <div className="space-y-2">
      {isPreSeason && (
        <p className="text-xs text-slate-500 italic mb-3">
          Pre-season projection — based on 2025 final results. Updates live once games begin.
        </p>
      )}
      {sorted.map((row) => (
        <div
          key={row.rosterId}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5',
            'bg-[#16213e] border border-[#2d4a66] hover:border-[#3a5f80] transition-colors duration-100'
          )}
        >
          {/* Power rank number */}
          <span
            className={cn(
              'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black',
              row.powerRank === 1
                ? 'bg-[#ffd700] text-[#1a1a2e]'
                : row.powerRank <= 3
                ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                : row.powerRank <= 6
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'bg-[#1a2d42] text-slate-500 border border-[#2d4a66]'
            )}
          >
            {row.powerRank}
          </span>

          {/* Owner + note */}
          <div className="flex-1 min-w-0">
            <OwnerLink
              owner={row.owner}
              slug={row.ownerSlug}
              className="text-sm font-semibold text-white"
            />
            {row.powerNote && (
              <p className="text-xs text-slate-500 truncate">{row.powerNote}</p>
            )}
          </div>

          {/* Live: pts indicator */}
          {!isPreSeason && row.pointsFor > 0 && (
            <span className="text-xs font-mono text-slate-400 tabular-nums flex-shrink-0">
              {row.pointsFor.toFixed(0)} pts
            </span>
          )}

          {/* W-L */}
          <span className="text-xs text-slate-500 flex-shrink-0 tabular-nums">
            {row.wins}-{row.losses}
          </span>
        </div>
      ))}
    </div>
  );
}

function MatchupsPanel({ matchups, week }: { matchups: LiveMatchup[]; week: number }) {
  if (matchups.length === 0) {
    return (
      <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-8 text-center">
        <p className="text-slate-400 text-sm">No matchups yet — season starts soon.</p>
        <a
          href={SLEEPER_LEAGUE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#ffd700] hover:underline"
        >
          View on Sleeper <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">Week {week}</span>
        {matchups.some(m => !m.isComplete) && (
          <span className="text-xs text-slate-400">(in progress)</span>
        )}
      </div>
      {matchups.map((m, idx) => (
        <div key={idx} className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-4">
          <div className="space-y-2">
            {/* Team 1 */}
            <div className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2',
              m.isComplete && m.team1Score > m.team2Score
                ? 'bg-[#22c55e]/10 border border-[#22c55e]/30'
                : 'bg-[#0f2744] border border-[#2d4a66]'
            )}>
              <span className={cn(
                'text-sm',
                m.isComplete && m.team1Score > m.team2Score ? 'font-bold text-[#22c55e]' : 'font-semibold text-slate-300'
              )}>
                <OwnerLink owner={m.team1} slug={m.team1Slug} />
                {m.isComplete && m.team1Score > m.team2Score && (
                  <span className="ml-2 text-xs font-normal opacity-70">WIN</span>
                )}
              </span>
              <span className={cn(
                'font-mono font-bold tabular-nums',
                m.isComplete && m.team1Score > m.team2Score ? 'text-white' : 'text-slate-400'
              )}>
                {m.team1Score > 0 ? m.team1Score.toFixed(2) : '—'}
              </span>
            </div>
            {/* Team 2 */}
            <div className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2',
              m.isComplete && m.team2Score > m.team1Score
                ? 'bg-[#22c55e]/10 border border-[#22c55e]/30'
                : 'bg-[#0f2744] border border-[#2d4a66]'
            )}>
              <span className={cn(
                'text-sm',
                m.isComplete && m.team2Score > m.team1Score ? 'font-bold text-[#22c55e]' : 'font-semibold text-slate-300'
              )}>
                <OwnerLink owner={m.team2} slug={m.team2Slug} />
                {m.isComplete && m.team2Score > m.team1Score && (
                  <span className="ml-2 text-xs font-normal opacity-70">WIN</span>
                )}
              </span>
              <span className={cn(
                'font-mono font-bold tabular-nums',
                m.isComplete && m.team2Score > m.team1Score ? 'text-white' : 'text-slate-400'
              )}>
                {m.team2Score > 0 ? m.team2Score.toFixed(2) : '—'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CurrentSeasonPage() {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [matchups, setMatchups] = useState<LiveMatchup[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isPreSeason, setIsPreSeason] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. NFL state
        const nflState = await fetchJson<SeasonState>('https://api.sleeper.app/v1/state/nfl');
        const week = Math.max(1, nflState.week || 1);
        const preSeason = nflState.seasonType !== 'regular';
        setCurrentWeek(week);
        setIsPreSeason(preSeason);

        // 2. Users
        const users = await fetchJson<Array<{
          user_id: string;
          display_name: string;
          metadata?: { team_name?: string };
        }>>(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`);
        const userMap: Record<string, { name: string; teamName: string }> = {};
        for (const u of users) {
          userMap[u.user_id] = {
            name: u.display_name,
            teamName: u.metadata?.team_name ?? u.display_name,
          };
        }

        // 3. Rosters
        const rosters = await fetchJson<Array<{
          roster_id: number;
          owner_id: string;
          settings: {
            wins: number; losses: number; ties: number;
            fpts: number; fpts_decimal?: number;
            fpts_against?: number; fpts_against_decimal?: number;
          };
        }>>(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`);

        // Build standings rows
        const rows: StandingRow[] = rosters.map((r) => {
          const user = r.owner_id ? userMap[r.owner_id] : null;
          const name = user?.name ?? `Roster ${r.roster_id}`;
          const ptsFor = (r.settings.fpts ?? 0) + (r.settings.fpts_decimal ?? 0) / 100;
          const ptsAgainst = (r.settings.fpts_against ?? 0) + (r.settings.fpts_against_decimal ?? 0) / 100;
          const pre = PRESEASON_POWER[name];

          return {
            rosterId: r.roster_id,
            rank: 0,
            powerRank: pre?.rank ?? 12,
            powerNote: pre?.note ?? '',
            owner: name,
            teamName: user?.teamName ?? '',
            wins: r.settings.wins ?? 0,
            losses: r.settings.losses ?? 0,
            ties: r.settings.ties ?? 0,
            pointsFor: ptsFor,
            pointsAgainst: ptsAgainst,
            ownerSlug: OWNER_SLUGS[name] ?? null,
          };
        });

        // Sort standings by W/L then pts
        rows.sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor);
        rows.forEach((r, i) => { r.rank = i + 1; });

        // Live power rankings once season is active
        const finalRows = preSeason ? rows : computeLivePowerRanks(rows);
        setStandings(finalRows);

        // 4. Matchups (if regular season)
        if (!preSeason) {
          try {
            const rawMatchups = await fetchJson<Array<{
              roster_id: number;
              matchup_id: number;
              points: number;
            }>>(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${week}`);

            const matchupMap: Record<number, { rosterId: number; points: number }[]> = {};
            for (const m of rawMatchups) {
              if (!matchupMap[m.matchup_id]) matchupMap[m.matchup_id] = [];
              matchupMap[m.matchup_id].push({ rosterId: m.roster_id, points: m.points });
            }

            const rosterToRow: Record<number, StandingRow> = {};
            for (const r of finalRows) rosterToRow[r.rosterId] = r;

            const liveMatchups: LiveMatchup[] = Object.values(matchupMap).map((pair) => {
              const [a, b] = pair;
              const rowA = rosterToRow[a?.rosterId ?? 0];
              const rowB = rosterToRow[b?.rosterId ?? 0];
              return {
                week,
                team1: rowA?.owner ?? 'TBD',
                team1Score: a?.points ?? 0,
                team2: rowB?.owner ?? 'TBD',
                team2Score: b?.points ?? 0,
                isComplete: (a?.points ?? 0) > 0 || (b?.points ?? 0) > 0,
                team1Slug: rowA?.ownerSlug ?? null,
                team2Slug: rowB?.ownerSlug ?? null,
              };
            });

            setMatchups(liveMatchups);
          } catch {
            // Silent — pre-season or API unavailable
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load season data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const seasonContextLines = [
    `The ${SEASON_YEAR} dynasty season features 12 owners competing across 14 regular season weeks, with 6 playoff spots.`,
    `Defending champion: tdtd19844 (THE Shameful Saggy sack), who defeated Tubes94 in the 2025 title game. Tubes94 enters ${SEASON_YEAR} as the pre-season favorite.`,
    `New for ${SEASON_YEAR}: 2026 NFL Draft class fully absorbed. Watch for rookie breakouts — Mendoza, Love, Jeanty, and Tate are the names to know.`,
  ];

  return (
    <>
      <Head>
        <title>{SEASON_YEAR} Season — BMFFFL</title>
        <meta name="description" content={`BMFFFL ${SEASON_YEAR} current season — live standings, power rankings, and matchups.`} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All Seasons
          </Link>
        </div>

        {/* ── Season header ─────────────────────────────────────────────── */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
                BMFFFL Season — Live
              </p>
              <h1 className="text-7xl sm:text-9xl font-black text-[#ffd700] leading-none tabular-nums">
                {SEASON_YEAR}
              </h1>
            </div>

            <div className="flex-1 sm:pb-3">
              <div className="inline-flex flex-col gap-2 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/30 px-5 py-4 shadow-lg shadow-[#22c55e]/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">
                    {loading ? 'Loading…' : isPreSeason ? 'Pre-Season' : 'In Progress'}
                  </span>
                </div>
                <p className="text-xl font-black text-white">
                  {loading ? '…' : isPreSeason ? 'Season Not Yet Started' : `Week ${currentWeek}`}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    Defending champion: <span className="text-white font-semibold">tdtd19844</span>
                  </span>
                  <a
                    href={SLEEPER_LEAGUE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#ffd700] hover:underline"
                  >
                    Sleeper <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main content ──────────────────────────────────────────────── */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="rounded-xl bg-[#e94560]/10 border border-[#e94560]/30 p-6 text-center">
            <p className="text-[#e94560] text-sm font-semibold">Failed to load live data</p>
            <p className="text-slate-400 text-xs mt-1">{error}</p>
          </div>
        ) : (
          <>
            {/* ── Standings + Matchups row ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <section className="lg:col-span-2" aria-labelledby="standings-heading">
                <h2 id="standings-heading" className="text-2xl font-black text-white mb-5">
                  Current Standings
                </h2>
                <StandingsTable standings={standings} isPreSeason={isPreSeason} />
              </section>

              <section aria-labelledby="matchups-heading">
                <h2 id="matchups-heading" className="text-2xl font-black text-white mb-5">
                  {isPreSeason ? 'Matchups' : `Week ${currentWeek}`}
                </h2>
                <MatchupsPanel matchups={matchups} week={currentWeek} />
              </section>
            </div>

            {/* ── Power Rankings ──────────────────────────────────────── */}
            <section className="mb-12" aria-labelledby="power-heading">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                <h2 id="power-heading" className="text-2xl font-black text-white">
                  Power Rankings
                </h2>
                <span className="text-xs text-slate-500 font-normal mt-0.5">
                  {isPreSeason ? '2026 pre-season projection' : 'live — pts + win rate'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PowerRankingsPanel standings={standings} isPreSeason={isPreSeason} />
              </div>
            </section>

            {/* ── Season Context ─────────────────────────────────────── */}
            <section className="mb-12" aria-labelledby="context-heading">
              <h2 id="context-heading" className="text-2xl font-black text-white mb-5">
                Season Context
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {seasonContextLines.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 rounded-xl bg-[#16213e] border border-[#2d4a66] p-5"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="text-sm font-black text-[#ffd700]">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{line}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Quick links ────────────────────────────────────────── */}
            <section className="mb-12" aria-labelledby="links-heading">
              <h2 id="links-heading" className="text-xl font-black text-white mb-4">
                Quick Links
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/owners" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] text-sm transition-all duration-150">
                  <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" /> All Owners
                </Link>
                <Link href="/managers" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] text-sm transition-all duration-150">
                  Manager Profiles
                </Link>
                <Link href="/history/2025" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] text-sm transition-all duration-150">
                  2025 Season
                </Link>
                <Link href="/analytics/all-time-records" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] text-sm transition-all duration-150">
                  All-Time Records
                </Link>
                <a href={SLEEPER_LEAGUE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] text-sm transition-all duration-150">
                  Sleeper App <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </section>

            {/* ── Season nav ─────────────────────────────────────────── */}
            <nav
              className="flex items-center justify-between pt-8 border-t border-[#2d4a66]"
              aria-label="Season navigation"
            >
              <Link
                href="/history/2025"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:text-white hover:border-[#3a5f80] transition-all duration-150 group"
              >
                <Trophy className="w-4 h-4 text-[#ffd700] group-hover:scale-110 transition-transform duration-150" aria-hidden="true" />
                <span>
                  <span className="text-xs text-slate-500 block">Previous Season</span>
                  <span className="font-bold tabular-nums">2025</span>
                </span>
              </Link>
              <Link
                href="/history"
                className="text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
              >
                All Seasons →
              </Link>
            </nav>
          </>
        )}
      </div>
    </>
  );
}
