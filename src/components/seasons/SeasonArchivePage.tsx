import Link from 'next/link';
import { Trophy, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import StandingsTable from '@/components/tables/StandingsTable';
import type { StandingsRow } from '@/components/tables/StandingsTable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayoffMatchup {
  round: 'quarterfinal' | 'semifinal' | 'championship' | 'consolation';
  home: string;
  homeScore: number;
  away: string;
  awayScore: number;
  winner: string;
}

interface SeasonData {
  year: number;
  champion: string;
  championOwner: string;
  runnerUp: string;
  regularSeasonWinner: string;
  championshipScore: string;  // e.g. "150.90 - 103.38"
  standings: Array<{
    rank: number;
    teamName: string;
    owner: string;
    wins: number;
    losses: number;
    pointsFor: number;
  }>;
  playoffs: PlayoffMatchup[];
  narratives: string[];       // key story bullets
}

interface SeasonArchivePageProps {
  season: SeasonData;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ROUND_CONFIG: Record<PlayoffMatchup['round'], { label: string; order: number }> = {
  quarterfinal:  { label: 'Quarterfinals',  order: 1 },
  semifinal:     { label: 'Semifinals',     order: 2 },
  championship:  { label: 'Championship',   order: 3 },
  consolation:   { label: 'Consolation',    order: 4 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildStandingsRows(
  standings: SeasonData['standings']
): StandingsRow[] {
  return standings.map((s) => ({
    rank: s.rank,
    teamName: s.teamName,
    ownerName: s.owner,
    wins: s.wins,
    losses: s.losses,
    pointsFor: s.pointsFor,
    playoffSeed: s.rank <= 6 ? s.rank : undefined,
  }));
}

function groupMatchupsByRound(
  matchups: PlayoffMatchup[]
): Array<{ round: PlayoffMatchup['round']; matchups: PlayoffMatchup[] }> {
  const order: PlayoffMatchup['round'][] = ['quarterfinal', 'semifinal', 'championship', 'consolation'];
  const map = new Map<PlayoffMatchup['round'], PlayoffMatchup[]>();
  for (const m of matchups) {
    const arr = map.get(m.round) ?? [];
    arr.push(m);
    map.set(m.round, arr);
  }
  return order
    .filter((r) => map.has(r))
    .map((r) => ({ round: r, matchups: map.get(r)! }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatchupCard({ matchup }: { matchup: PlayoffMatchup }) {
  const isChampionship = matchup.round === 'championship';
  const homeWon = matchup.winner === matchup.home;
  const awayWon = matchup.winner === matchup.away;

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden',
        'bg-[#16213e] transition-all duration-150',
        isChampionship
          ? 'border-[#ffd700]/60 shadow-lg shadow-[#ffd700]/10'
          : 'border-[#2d4a66]'
      )}
    >
      {isChampionship && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border-b border-[#ffd700]/30">
          <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">
            Championship
          </span>
        </div>
      )}

      <div className="p-4 space-y-2">
        {/* Home team row */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-sm font-semibold',
              homeWon ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.home}
            {homeWon && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#ffd700]">
                W
              </span>
            )}
          </span>
          <span
            className={cn(
              'font-mono text-sm tabular-nums font-bold',
              homeWon ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.homeScore.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2d4a66]" />

        {/* Away team row */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-sm font-semibold',
              awayWon ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.away}
            {awayWon && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#ffd700]">
                W
              </span>
            )}
          </span>
          <span
            className={cn(
              'font-mono text-sm tabular-nums font-bold',
              awayWon ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.awayScore.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Full-page season archive component.
 * Renders champion header, regular-season standings, playoff bracket,
 * and season storylines.
 */
export default function SeasonArchivePage({ season }: SeasonArchivePageProps) {
  const standingsRows = buildStandingsRows(season.standings);
  const groupedMatchups = groupMatchupsByRound(season.playoffs);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

      {/* ── Back navigation ─────────────────────────────────────────────── */}
      <Link
        href="/history"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150 mb-8 group"
      >
        <ChevronLeft
          className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to League History
      </Link>

      {/* ── Season header ────────────────────────────────────────────────── */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 mb-6">
          {/* Year */}
          <span
            className="text-7xl sm:text-9xl font-black text-[#ffd700] leading-none tabular-nums"
            aria-label={`Season ${season.year}`}
          >
            {season.year}
          </span>

          {/* Champion info */}
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <span className="text-xs font-bold text-[#ffd700] uppercase tracking-widest">
                Champion
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">
              {season.champion}
            </h1>
            <p className="text-slate-400 text-sm">
              {season.championOwner}
            </p>
          </div>
        </div>

        {/* Championship score + regular season winner cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#16213e] border border-[#ffd700]/30 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Championship Score
            </p>
            <p className="text-xl font-bold text-white font-mono">
              {season.championshipScore}
            </p>
          </div>

          <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Regular Season Winner
            </p>
            <p className="text-xl font-bold text-white">
              {season.regularSeasonWinner}
            </p>
          </div>
        </div>
      </header>

      {/* ── Regular season standings ─────────────────────────────────────── */}
      <section
        className="mb-14"
        aria-labelledby="standings-heading"
      >
        <h2
          id="standings-heading"
          className="text-2xl font-black text-white mb-6"
        >
          Regular Season Standings
        </h2>
        {standingsRows.length > 0 ? (
          <StandingsTable standings={standingsRows} />
        ) : (
          <p className="text-slate-500 text-sm italic">
            Standings data unavailable for this season.
          </p>
        )}
      </section>

      {/* ── Playoffs section ─────────────────────────────────────────────── */}
      {groupedMatchups.length > 0 && (
        <section
          className="mb-14"
          aria-labelledby="playoffs-heading"
        >
          <h2
            id="playoffs-heading"
            className="text-2xl font-black text-white mb-6"
          >
            Playoffs
          </h2>

          <div className="space-y-8">
            {groupedMatchups.map(({ round, matchups }) => {
              const isChampRound = round === 'championship';
              return (
                <div key={round}>
                  <h3
                    className={cn(
                      'text-sm font-bold uppercase tracking-widest mb-3',
                      isChampRound ? 'text-[#ffd700]' : 'text-slate-400'
                    )}
                  >
                    {ROUND_CONFIG[round].label}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchups.map((m, idx) => (
                      <MatchupCard
                        key={`${round}-${idx}`}
                        matchup={m}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Season storylines ────────────────────────────────────────────── */}
      {season.narratives.length > 0 && (
        <section
          className="mb-10"
          aria-labelledby="narratives-heading"
        >
          <h2
            id="narratives-heading"
            className="text-2xl font-black text-white mb-6"
          >
            Season Storylines
          </h2>

          <ul className="space-y-3">
            {season.narratives.map((narrative, idx) => (
              <li
                key={idx}
                className="flex gap-3 items-start"
              >
                <span
                  className="mt-1.5 w-2 h-2 rounded-full bg-[#e94560] shrink-0"
                  aria-hidden="true"
                />
                <p className="text-slate-300 leading-6">{narrative}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Footer nav ───────────────────────────────────────────────────── */}
      <div className="mt-12 pt-8 border-t border-[#2d4a66]">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150 group"
        >
          <ChevronLeft
            className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to League History
        </Link>
      </div>
    </div>
  );
}
