import { Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BracketMatchup {
  team1: string;
  score1: number;
  team2: string;
  score2: number;
  winner: string;
}

export interface BracketData {
  semis: BracketMatchup[];
  finals: BracketMatchup;
  thirdPlace?: BracketMatchup;
}

interface PlayoffBracketProps {
  year: number;
  bracket: BracketData;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MatchupCardProps {
  matchup: BracketMatchup;
  /** Visually elevate championship matchup */
  isChampionship?: boolean;
  /** Optional label shown above the card */
  label?: string;
  className?: string;
}

function MatchupCard({
  matchup,
  isChampionship = false,
  label,
  className,
}: MatchupCardProps) {
  const team1Won = matchup.winner === matchup.team1;
  const team2Won = matchup.winner === matchup.team2;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Round label */}
      {label && (
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-widest mb-1',
            isChampionship ? 'text-[#ffd700]' : 'text-slate-500'
          )}
        >
          {label}
        </p>
      )}

      <div
        className={cn(
          'rounded-xl border overflow-hidden',
          'bg-[#16213e]',
          isChampionship
            ? 'border-[#ffd700]/60 shadow-lg shadow-[#ffd700]/10'
            : 'border-[#2d4a66]'
        )}
      >
        {/* Championship header banner */}
        {isChampionship && (
          <div
            className="flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border-b border-[#ffd700]/30"
            aria-hidden="true"
          >
            <Trophy className="w-3.5 h-3.5 text-[#ffd700]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd700]">
              Championship
            </span>
          </div>
        )}

        {/* Team 1 row */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3',
            team1Won && isChampionship && 'bg-[#ffd700]/5'
          )}
        >
          <span
            className={cn(
              'text-sm font-semibold truncate mr-3',
              team1Won ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.team1}
            {team1Won && (
              <span
                className={cn(
                  'ml-2 text-[10px] font-black uppercase tracking-wider',
                  isChampionship ? 'text-[#ffd700]' : 'text-[#22c55e]'
                )}
                aria-label="Winner"
              >
                W
              </span>
            )}
          </span>
          <span
            className={cn(
              'font-mono text-sm tabular-nums font-bold shrink-0',
              team1Won ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.score1.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2d4a66] mx-4" aria-hidden="true" />

        {/* Team 2 row */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3',
            team2Won && isChampionship && 'bg-[#ffd700]/5'
          )}
        >
          <span
            className={cn(
              'text-sm font-semibold truncate mr-3',
              team2Won ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.team2}
            {team2Won && (
              <span
                className={cn(
                  'ml-2 text-[10px] font-black uppercase tracking-wider',
                  isChampionship ? 'text-[#ffd700]' : 'text-[#22c55e]'
                )}
                aria-label="Winner"
              >
                W
              </span>
            )}
          </span>
          <span
            className={cn(
              'font-mono text-sm tabular-nums font-bold shrink-0',
              team2Won ? 'text-white' : 'text-slate-500'
            )}
          >
            {matchup.score2.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Connector arrow (desktop only) ──────────────────────────────────────────

function Connector() {
  return (
    <div
      className="hidden md:flex flex-col items-center justify-center self-stretch px-1"
      aria-hidden="true"
    >
      <div className="flex-1 w-px bg-[#2d4a66]" />
      <div className="w-3 h-px bg-[#2d4a66]" />
      <div className="flex-1 w-px bg-[#2d4a66]" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Read-only playoff bracket display.
 * Renders Semis → Finals in a visual flow with winner highlighting.
 *
 * @example
 * <PlayoffBracket year={2025} bracket={bracketData} />
 */
export default function PlayoffBracket({ year, bracket }: PlayoffBracketProps) {
  return (
    <div aria-label={`${year} playoff bracket`}>

      {/* ── Bracket heading ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
        <h2 className="text-2xl font-black text-white">{year} Playoffs</h2>
      </div>

      {/*
        Layout strategy:
        - Mobile: stacked vertically (semis → finals → 3rd place)
        - Desktop: horizontal flow with connecting lines
      */}

      {/* ── Desktop: horizontal bracket ──────────────────────────────────── */}
      <div className="hidden md:flex items-start gap-0">

        {/* Semis column */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Semifinals
          </p>
          {bracket.semis.map((matchup, idx) => (
            <MatchupCard
              key={idx}
              matchup={matchup}
            />
          ))}
        </div>

        {/* Connector */}
        <Connector />

        {/* Finals column */}
        <div className="flex flex-col justify-center flex-1" style={{ alignSelf: 'center' }}>
          <MatchupCard
            matchup={bracket.finals}
            isChampionship
            label="Championship"
          />
        </div>
      </div>

      {/* ── Mobile: stacked bracket ──────────────────────────────────────── */}
      <div className="md:hidden space-y-6">

        {/* Semis */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Semifinals
          </p>
          <div className="space-y-3">
            {bracket.semis.map((matchup, idx) => (
              <MatchupCard key={idx} matchup={matchup} />
            ))}
          </div>
        </div>

        {/* Finals */}
        <div>
          <MatchupCard
            matchup={bracket.finals}
            isChampionship
            label="Championship"
          />
        </div>
      </div>

      {/* ── 3rd place match (both breakpoints) ───────────────────────────── */}
      {bracket.thirdPlace && (
        <div className="mt-8 pt-6 border-t border-[#2d4a66]">
          <MatchupCard
            matchup={bracket.thirdPlace}
            label="3rd Place"
          />
        </div>
      )}
    </div>
  );
}
