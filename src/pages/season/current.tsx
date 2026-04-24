import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAGUE_ID = '1312123497203376128';
const SEASON_YEAR = 2026;

// ─── Types ────────────────────────────────────────────────────────────────────

interface StandingRow {
  rosterId: number;
  rank: number;
  owner: string;
  teamName: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
}

interface LiveMatchup {
  week: number;
  team1: string;
  team1Score: number;
  team2: string;
  team2Score: number;
  isComplete: boolean;
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 text-[#ffd700] animate-spin" aria-hidden="true" />
      <p className="text-slate-400 text-sm">Loading live season data…</p>
    </div>
  );
}

function StandingsTable({ standings }: { standings: StandingRow[] }) {
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
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-28">Status</th>
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
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{row.owner}</span>
                      {row.teamName && row.teamName !== row.owner && (
                        <span className="text-xs text-slate-500">{row.teamName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#22c55e]">{row.wins}</td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-[#ef4444]">{row.losses}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums">
                    {row.pointsFor > 0 ? row.pointsFor.toFixed(2) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400 tabular-nums">
                    {row.pointsAgainst > 0 ? row.pointsAgainst.toFixed(2) : '—'}
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

function MatchupsPanel({ matchups, week }: { matchups: LiveMatchup[]; week: number }) {
  if (matchups.length === 0) {
    return (
      <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-8 text-center">
        <p className="text-slate-400 text-sm">No matchups yet — season starts soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">Week {week}</span>
        {matchups.some(m => !m.isComplete) && (
          <span className="text-xs text-slate-400 ml-1">(in progress)</span>
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
                'font-semibold text-sm',
                m.isComplete && m.team1Score > m.team2Score ? 'text-[#22c55e]' : 'text-slate-300'
              )}>
                {m.team1}
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
                'font-semibold text-sm',
                m.isComplete && m.team2Score > m.team1Score ? 'text-[#22c55e]' : 'text-slate-300'
              )}>
                {m.team2}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. NFL state (current week)
        const nflState = await fetchJson<SeasonState>('https://api.sleeper.app/v1/state/nfl');
        const week = Math.max(1, nflState.week || 1);
        setCurrentWeek(week);

        // 2. Users (display names)
        const users = await fetchJson<Array<{ user_id: string; display_name: string; metadata?: { team_name?: string } }>>(
          `https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`
        );
        const userMap: Record<string, { name: string; teamName: string }> = {};
        for (const u of users) {
          userMap[u.user_id] = {
            name: u.display_name,
            teamName: u.metadata?.team_name ?? u.display_name,
          };
        }

        // 3. Rosters (W/L/pts)
        const rosters = await fetchJson<Array<{
          roster_id: number;
          owner_id: string;
          settings: { wins: number; losses: number; ties: number; fpts: number; fpts_decimal?: number; fpts_against?: number; fpts_against_decimal?: number };
        }>>(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`);

        // Build standings
        const rows: StandingRow[] = rosters.map((r) => {
          const user = r.owner_id ? userMap[r.owner_id] : null;
          const ptsFor = (r.settings.fpts ?? 0) + (r.settings.fpts_decimal ?? 0) / 100;
          const ptsAgainst = (r.settings.fpts_against ?? 0) + (r.settings.fpts_against_decimal ?? 0) / 100;
          return {
            rosterId: r.roster_id,
            rank: 0,
            owner: user?.name ?? `Roster ${r.roster_id}`,
            teamName: user?.teamName ?? '',
            wins: r.settings.wins ?? 0,
            losses: r.settings.losses ?? 0,
            ties: r.settings.ties ?? 0,
            pointsFor: ptsFor,
            pointsAgainst: ptsAgainst,
          };
        });

        // Sort: wins desc → pts desc
        rows.sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor);
        rows.forEach((r, i) => { r.rank = i + 1; });
        setStandings(rows);

        // 4. Current week matchups (only if season has started)
        if (nflState.seasonType === 'regular' || nflState.week > 0) {
          try {
            const rawMatchups = await fetchJson<Array<{
              roster_id: number;
              matchup_id: number;
              points: number;
            }>>(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${week}`);

            // Group by matchup_id
            const matchupMap: Record<number, { rosterId: number; points: number }[]> = {};
            for (const m of rawMatchups) {
              if (!matchupMap[m.matchup_id]) matchupMap[m.matchup_id] = [];
              matchupMap[m.matchup_id].push({ rosterId: m.roster_id, points: m.points });
            }

            // Build matchup display objects
            const rosterToOwner: Record<number, string> = {};
            for (const r of rosters) {
              const user = r.owner_id ? userMap[r.owner_id] : null;
              rosterToOwner[r.roster_id] = user?.name ?? `Roster ${r.roster_id}`;
            }

            const liveMatchups: LiveMatchup[] = Object.values(matchupMap).map((pair) => {
              const [a, b] = pair;
              return {
                week,
                team1: rosterToOwner[a?.rosterId ?? 0] ?? 'TBD',
                team1Score: a?.points ?? 0,
                team2: rosterToOwner[b?.rosterId ?? 0] ?? 'TBD',
                team2Score: b?.points ?? 0,
                isComplete: (a?.points ?? 0) > 0 || (b?.points ?? 0) > 0,
              };
            });

            setMatchups(liveMatchups);
          } catch {
            // Matchups not yet available (pre-season) — silent
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
    `Defending champion: tdtd19844 (THE Shameful Saggy sack), who defeated Tubes94 in the 2025 title game.`,
    `New for ${SEASON_YEAR}: 2026 NFL Draft class fully absorbed — watch for rookie breakouts in the dynasty landscape.`,
  ];

  return (
    <>
      <Head>
        <title>{SEASON_YEAR} Season — BMFFFL</title>
        <meta name="description" content={`BMFFFL ${SEASON_YEAR} current season — live standings and matchups.`} />
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
            {/* Year */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
                BMFFFL Season — Live
              </p>
              <h1 className="text-7xl sm:text-9xl font-black text-[#ffd700] leading-none tabular-nums">
                {SEASON_YEAR}
              </h1>
            </div>

            {/* Status card */}
            <div className="flex-1 sm:pb-3">
              <div className="inline-flex flex-col gap-2 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/30 px-5 py-4 shadow-lg shadow-[#22c55e]/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">
                    In Progress
                  </span>
                </div>
                <p className="text-xl font-black text-white">
                  {loading ? 'Loading…' : `Week ${currentWeek}`}
                </p>
                <p className="text-sm text-slate-400">
                  Defending champion: <span className="text-white font-semibold">tdtd19844</span>
                </p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

              {/* Standings — 2 cols */}
              <section className="lg:col-span-2" aria-labelledby="standings-heading">
                <h2 id="standings-heading" className="text-2xl font-black text-white mb-5">
                  Current Standings
                </h2>
                <StandingsTable standings={standings} />
              </section>

              {/* Matchups — 1 col */}
              <section aria-labelledby="matchups-heading">
                <h2 id="matchups-heading" className="text-2xl font-black text-white mb-5">
                  {matchups.length > 0 ? 'This Week' : 'Matchups'}
                </h2>
                <MatchupsPanel matchups={matchups} week={currentWeek} />
              </section>
            </div>

            {/* ── Season Context ─────────────────────────────────────────── */}
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

            {/* ── Season nav ────────────────────────────────────────────── */}
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
