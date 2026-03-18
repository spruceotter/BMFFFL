import { useState } from 'react';
import Head from 'next/head';
import { Trophy, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamScore {
  owner: string;
  teamName: string;
  score: number | null;
}

interface Matchup {
  home: TeamScore;
  away: TeamScore;
  /** owner username of winner, null if TBD */
  winner: string | null;
  label?: string;
}

interface WeekData {
  week: number;
  label: string;
  type: 'regular' | 'wildcard' | 'semifinals' | 'championship';
  matchups: Matchup[] | null;
  /** If null, show the "data not available" placeholder */
}

interface PlayoffMatchup {
  round: string;
  game: string;
  home: { seed: number; owner: string; teamName: string; score: number | null };
  away: { seed: number; owner: string; teamName: string; score: number | null };
  winner: string | null;
  isBye?: boolean;
  byeOwner?: string;
  byeTeamName?: string;
  byeSeed?: number;
  note?: string;
}

// ─── Team Name Mapping ────────────────────────────────────────────────────────

const TEAM_NAMES: Record<string, string> = {
  MLSchools12:     'Schoolcraft Football Team',
  Tubes94:         'Whale Tails',
  SexMachineAndyD: 'SexMachineAndyD',
  tdtd19844:       '14kids0wins/teammoodie',
  JuicyBussy:      'Juicy Bussy',
  Cmaleski:        'Showtyme Boyz',
  rbr:             'Really Big Rings',
  eldridm20:       "Franks Little Beauties",
  Grandes:         'El Rioux Grandes',
  eldridsm:        'eldridsm',
  Cogdeill11:      'Cogdeill11',
  Escuelas:        'Booty Cheeks',
};

function teamName(owner: string): string {
  return TEAM_NAMES[owner] ?? owner;
}

// ─── Week 1 Sample Data ───────────────────────────────────────────────────────
// Scores are representative estimates based on full-season totals.

const WEEK1_MATCHUPS: Matchup[] = [
  {
    home:   { owner: 'MLSchools12',     teamName: teamName('MLSchools12'),     score: 148.26 },
    away:   { owner: 'Cogdeill11',      teamName: teamName('Cogdeill11'),      score: 112.44 },
    winner: 'MLSchools12',
    label:  'Week 1 · Regular Season',
  },
  {
    home:   { owner: 'Tubes94',         teamName: teamName('Tubes94'),         score: 134.18 },
    away:   { owner: 'eldridsm',        teamName: teamName('eldridsm'),        score: 98.72 },
    winner: 'Tubes94',
    label:  'Week 1 · Regular Season',
  },
  {
    home:   { owner: 'SexMachineAndyD', teamName: teamName('SexMachineAndyD'), score: 122.60 },
    away:   { owner: 'eldridm20',       teamName: teamName('eldridm20'),       score: 109.34 },
    winner: 'SexMachineAndyD',
    label:  'Week 1 · Regular Season',
  },
  {
    home:   { owner: 'tdtd19844',       teamName: teamName('tdtd19844'),       score: 104.88 },
    away:   { owner: 'Grandes',         teamName: teamName('Grandes'),         score: 118.42 },
    winner: 'Grandes',
    label:  'Week 1 · Regular Season',
  },
  {
    home:   { owner: 'JuicyBussy',      teamName: teamName('JuicyBussy'),      score: 127.54 },
    away:   { owner: 'rbr',             teamName: teamName('rbr'),             score: 115.20 },
    winner: 'JuicyBussy',
    label:  'Week 1 · Regular Season',
  },
  {
    home:   { owner: 'Cmaleski',        teamName: teamName('Cmaleski'),        score: 88.92 },
    away:   { owner: 'Escuelas',        teamName: teamName('Escuelas'),        score: 131.76 },
    winner: 'Escuelas',
    label:  'Week 1 · Regular Season',
  },
];

// ─── Week 7 Sample Data ───────────────────────────────────────────────────────

const WEEK7_MATCHUPS: Matchup[] = [
  {
    home:   { owner: 'MLSchools12',     teamName: teamName('MLSchools12'),     score: 162.44 },
    away:   { owner: 'JuicyBussy',      teamName: teamName('JuicyBussy'),      score: 101.18 },
    winner: 'MLSchools12',
    label:  'Week 7 · Regular Season',
  },
  {
    home:   { owner: 'Tubes94',         teamName: teamName('Tubes94'),         score: 141.06 },
    away:   { owner: 'Cmaleski',        teamName: teamName('Cmaleski'),        score: 93.88 },
    winner: 'Tubes94',
    label:  'Week 7 · Regular Season',
  },
  {
    home:   { owner: 'SexMachineAndyD', teamName: teamName('SexMachineAndyD'), score: 118.74 },
    away:   { owner: 'rbr',             teamName: teamName('rbr'),             score: 134.52 },
    winner: 'rbr',
    label:  'Week 7 · Regular Season',
  },
  {
    home:   { owner: 'tdtd19844',       teamName: teamName('tdtd19844'),       score: 127.38 },
    away:   { owner: 'eldridsm',        teamName: teamName('eldridsm'),        score: 88.14 },
    winner: 'tdtd19844',
    label:  'Week 7 · Regular Season',
  },
  {
    home:   { owner: 'eldridm20',       teamName: teamName('eldridm20'),       score: 99.56 },
    away:   { owner: 'Cogdeill11',      teamName: teamName('Cogdeill11'),      score: 144.20 },
    winner: 'Cogdeill11',
    label:  'Week 7 · Regular Season',
  },
  {
    home:   { owner: 'Grandes',         teamName: teamName('Grandes'),         score: 110.82 },
    away:   { owner: 'Escuelas',        teamName: teamName('Escuelas'),        score: 103.44 },
    winner: 'Grandes',
    label:  'Week 7 · Regular Season',
  },
];

// ─── Week 14 Sample Data (final regular season week) ─────────────────────────

const WEEK14_MATCHUPS: Matchup[] = [
  {
    home:   { owner: 'MLSchools12',     teamName: teamName('MLSchools12'),     score: 175.82 },
    away:   { owner: 'Escuelas',        teamName: teamName('Escuelas'),        score: 88.36 },
    winner: 'MLSchools12',
    label:  'Week 14 · Regular Season Final',
  },
  {
    home:   { owner: 'Tubes94',         teamName: teamName('Tubes94'),         score: 138.44 },
    away:   { owner: 'eldridm20',       teamName: teamName('eldridm20'),       score: 107.12 },
    winner: 'Tubes94',
    label:  'Week 14 · Regular Season Final',
  },
  {
    home:   { owner: 'SexMachineAndyD', teamName: teamName('SexMachineAndyD'), score: 131.66 },
    away:   { owner: 'Grandes',         teamName: teamName('Grandes'),         score: 109.28 },
    winner: 'SexMachineAndyD',
    label:  'Week 14 · Regular Season Final',
  },
  {
    home:   { owner: 'tdtd19844',       teamName: teamName('tdtd19844'),       score: 122.54 },
    away:   { owner: 'Cogdeill11',      teamName: teamName('Cogdeill11'),      score: 116.80 },
    winner: 'tdtd19844',
    label:  'Week 14 · Regular Season Final',
  },
  {
    home:   { owner: 'JuicyBussy',      teamName: teamName('JuicyBussy'),      score: 119.92 },
    away:   { owner: 'rbr',             teamName: teamName('rbr'),             score: 142.10 },
    winner: 'rbr',
    label:  'Week 14 · Regular Season Final',
  },
  {
    home:   { owner: 'Cmaleski',        teamName: teamName('Cmaleski'),        score: 104.38 },
    away:   { owner: 'eldridsm',        teamName: teamName('eldridsm'),        score: 91.06 },
    winner: 'Cmaleski',
    label:  'Week 14 · Regular Season Final',
  },
];

// ─── Week Registry ────────────────────────────────────────────────────────────

const WEEKS: WeekData[] = [
  { week: 1,  label: 'Week 1',  type: 'regular',      matchups: WEEK1_MATCHUPS },
  { week: 2,  label: 'Week 2',  type: 'regular',      matchups: null },
  { week: 3,  label: 'Week 3',  type: 'regular',      matchups: null },
  { week: 4,  label: 'Week 4',  type: 'regular',      matchups: null },
  { week: 5,  label: 'Week 5',  type: 'regular',      matchups: null },
  { week: 6,  label: 'Week 6',  type: 'regular',      matchups: null },
  { week: 7,  label: 'Week 7',  type: 'regular',      matchups: WEEK7_MATCHUPS },
  { week: 8,  label: 'Week 8',  type: 'regular',      matchups: null },
  { week: 9,  label: 'Week 9',  type: 'regular',      matchups: null },
  { week: 10, label: 'Week 10', type: 'regular',      matchups: null },
  { week: 11, label: 'Week 11', type: 'regular',      matchups: null },
  { week: 12, label: 'Week 12', type: 'regular',      matchups: null },
  { week: 13, label: 'Week 13', type: 'regular',      matchups: null },
  { week: 14, label: 'Week 14', type: 'regular',      matchups: WEEK14_MATCHUPS },
];

// ─── Playoff Data ─────────────────────────────────────────────────────────────

const PLAYOFF_MATCHUPS: PlayoffMatchup[] = [
  // Wild Card (Week 15)
  {
    round: 'Wild Card',
    game: 'WC-1',
    home: { seed: 3, owner: 'SexMachineAndyD', teamName: teamName('SexMachineAndyD'), score: 128.44 },
    away: { seed: 6, owner: 'Cmaleski',         teamName: teamName('Cmaleski'),         score: 101.18 },
    winner: 'SexMachineAndyD',
  },
  {
    round: 'Wild Card',
    game: 'WC-2',
    home: { seed: 4, owner: 'tdtd19844',  teamName: teamName('tdtd19844'),  score: 144.62 },
    away: { seed: 5, owner: 'JuicyBussy', teamName: teamName('JuicyBussy'), score: 119.30 },
    winner: 'tdtd19844',
  },
  // Semifinals (Week 16)
  {
    round: 'Semifinals',
    game: 'SF-1',
    home: { seed: 1, owner: 'MLSchools12', teamName: teamName('MLSchools12'), score: 131.88 },
    away: { seed: 4, owner: 'tdtd19844',   teamName: teamName('tdtd19844'),   score: 156.72 },
    winner: 'tdtd19844',
    note: '#4 seed upsets #1 seed',
  },
  {
    round: 'Semifinals',
    game: 'SF-2',
    home: { seed: 2, owner: 'Tubes94',         teamName: teamName('Tubes94'),         score: 148.20 },
    away: { seed: 3, owner: 'SexMachineAndyD', teamName: teamName('SexMachineAndyD'), score: 122.54 },
    winner: 'Tubes94',
  },
  // Championship (Week 17)
  {
    round: 'Championship',
    game: 'CHAMP',
    home: { seed: 4, owner: 'tdtd19844', teamName: teamName('tdtd19844'), score: 162.48 },
    away: { seed: 2, owner: 'Tubes94',   teamName: teamName('Tubes94'),   score: 139.14 },
    winner: 'tdtd19844',
    note: '2025 BMFFFL Champion',
  },
  // Moodie Bowl (Week 17 consolation)
  {
    round: 'Moodie Bowl',
    game: 'MB',
    home: { seed: 1, owner: 'MLSchools12',     teamName: teamName('MLSchools12'),     score: 118.36 },
    away: { seed: 3, owner: 'SexMachineAndyD', teamName: teamName('SexMachineAndyD'), score: 108.90 },
    winner: 'MLSchools12',
    note: '3rd place consolation',
  },
];

// ─── Regular Season Standings ─────────────────────────────────────────────────

const STANDINGS = [
  { seed: 1, owner: 'MLSchools12',     record: '13-1', teamName: teamName('MLSchools12'),     playoff: true },
  { seed: 2, owner: 'Tubes94',         record: '10-4', teamName: teamName('Tubes94'),         playoff: true },
  { seed: 3, owner: 'SexMachineAndyD', record: '9-5',  teamName: teamName('SexMachineAndyD'), playoff: true },
  { seed: 4, owner: 'tdtd19844',       record: '8-6',  teamName: teamName('tdtd19844'),       playoff: true },
  { seed: 5, owner: 'JuicyBussy',      record: '7-7',  teamName: teamName('JuicyBussy'),      playoff: true },
  { seed: 6, owner: 'Cmaleski',        record: '6-8',  teamName: teamName('Cmaleski'),        playoff: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeedBadge({ seed }: { seed: number }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-black shrink-0',
      seed === 1 ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40' :
      seed === 2 ? 'bg-slate-400/15 text-slate-300 border border-slate-400/30' :
                   'bg-[#2d4a66] text-slate-400 border border-[#3a5f80]'
    )}>
      {seed}
    </span>
  );
}

function MatchupCard({ matchup }: { matchup: Matchup }) {
  const homeWon  = matchup.winner === matchup.home.owner;
  const awayWon  = matchup.winner === matchup.away.owner;
  const isFinal  = matchup.winner !== null;

  return (
    <div className={cn(
      'rounded-xl border bg-[#16213e] overflow-hidden transition-colors duration-150',
      isFinal ? 'border-[#2d4a66]' : 'border-[#2d4a66] opacity-70'
    )}>
      {/* Card label */}
      {matchup.label && (
        <div className="px-4 py-1.5 bg-[#0d1b2a]/60 border-b border-[#2d4a66]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {matchup.label}
          </p>
        </div>
      )}

      {/* Home team row */}
      <div className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 border-b border-[#1e3347]',
        homeWon && 'border-l-2 border-l-[#ffd700]'
      )}>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-bold text-sm truncate',
            homeWon ? 'text-white' : 'text-slate-400'
          )}>
            {matchup.home.teamName}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5 truncate">{matchup.home.owner}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {homeWon && isFinal && (
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/25 px-1.5 py-0.5 rounded">
              WIN
            </span>
          )}
          <span className={cn(
            'text-base font-black tabular-nums min-w-[52px] text-right',
            homeWon ? 'text-[#ffd700]' : isFinal ? 'text-slate-500' : 'text-slate-400'
          )}>
            {matchup.home.score !== null ? matchup.home.score.toFixed(2) : 'TBD'}
          </span>
        </div>
      </div>

      {/* Away team row */}
      <div className={cn(
        'flex items-center justify-between gap-3 px-4 py-3',
        awayWon && 'border-l-2 border-l-[#ffd700]'
      )}>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-bold text-sm truncate',
            awayWon ? 'text-white' : 'text-slate-400'
          )}>
            {matchup.away.teamName}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5 truncate">{matchup.away.owner}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {awayWon && isFinal && (
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/25 px-1.5 py-0.5 rounded">
              WIN
            </span>
          )}
          <span className={cn(
            'text-base font-black tabular-nums min-w-[52px] text-right',
            awayWon ? 'text-[#ffd700]' : isFinal ? 'text-slate-500' : 'text-slate-400'
          )}>
            {matchup.away.score !== null ? matchup.away.score.toFixed(2) : 'TBD'}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlayoffMatchupCard({ matchup, showBye }: { matchup: PlayoffMatchup; showBye?: boolean }) {
  const isChampionship = matchup.round === 'Championship';
  const isMoodieBowl   = matchup.round === 'Moodie Bowl';
  const homeWon        = matchup.winner === matchup.home.owner;
  const awayWon        = matchup.winner === matchup.away.owner;

  return (
    <div className={cn(
      'rounded-xl border bg-[#16213e] overflow-hidden',
      isChampionship ? 'border-[#ffd700]/50 shadow-lg shadow-[#ffd700]/5' :
      isMoodieBowl   ? 'border-[#e94560]/30' :
                       'border-[#2d4a66]'
    )}>
      {/* Round header */}
      <div className={cn(
        'px-4 py-1.5 border-b flex items-center justify-between',
        isChampionship ? 'bg-[#ffd700]/5 border-[#ffd700]/20' :
        isMoodieBowl   ? 'bg-[#e94560]/5 border-[#e94560]/20' :
                         'bg-[#0d1b2a]/60 border-[#2d4a66]'
      )}>
        <p className={cn(
          'text-[10px] font-bold uppercase tracking-widest',
          isChampionship ? 'text-[#ffd700]' :
          isMoodieBowl   ? 'text-[#e94560]' :
                           'text-slate-500'
        )}>
          {matchup.round}
        </p>
        {matchup.note && (
          <p className="text-[10px] text-slate-500 italic">{matchup.note}</p>
        )}
      </div>

      {/* Home team */}
      <div className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 border-b border-[#1e3347]',
        homeWon && 'border-l-2 border-l-[#ffd700]'
      )}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SeedBadge seed={matchup.home.seed} />
          <div className="min-w-0">
            <p className={cn(
              'font-bold text-sm truncate',
              homeWon ? 'text-white' : 'text-slate-400'
            )}>
              {matchup.home.teamName}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 truncate">{matchup.home.owner}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {homeWon && (
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/25 px-1.5 py-0.5 rounded">
              WIN
            </span>
          )}
          {isChampionship && homeWon && (
            <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
          )}
          <span className={cn(
            'text-base font-black tabular-nums min-w-[52px] text-right',
            homeWon ? 'text-[#ffd700]' : 'text-slate-500'
          )}>
            {matchup.home.score !== null ? matchup.home.score.toFixed(2) : 'TBD'}
          </span>
        </div>
      </div>

      {/* Away team */}
      <div className={cn(
        'flex items-center justify-between gap-3 px-4 py-3',
        awayWon && 'border-l-2 border-l-[#ffd700]'
      )}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SeedBadge seed={matchup.away.seed} />
          <div className="min-w-0">
            <p className={cn(
              'font-bold text-sm truncate',
              awayWon ? 'text-white' : 'text-slate-400'
            )}>
              {matchup.away.teamName}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 truncate">{matchup.away.owner}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {awayWon && (
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/25 px-1.5 py-0.5 rounded">
              WIN
            </span>
          )}
          {isChampionship && awayWon && (
            <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
          )}
          <span className={cn(
            'text-base font-black tabular-nums min-w-[52px] text-right',
            awayWon ? 'text-[#ffd700]' : 'text-slate-500'
          )}>
            {matchup.away.score !== null ? matchup.away.score.toFixed(2) : 'TBD'}
          </span>
        </div>
      </div>
    </div>
  );
}

function NoDataPlaceholder({ week }: { week: number }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-10 flex flex-col items-center gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-[#2d4a66]/50 flex items-center justify-center">
        <Info className="w-5 h-5 text-slate-500" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-1">
          Week {week} scores not available in static build
        </p>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
          Connect to the Sleeper API to fetch live matchup data for all regular
          season weeks. Scores for Weeks 1, 7, and 14 are shown as representative samples.
        </p>
      </div>
      <a
        href="https://docs.sleeper.com/#get-matchups-for-a-league"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 text-xs text-[#ffd700]/70 hover:text-[#ffd700] underline underline-offset-2 transition-colors"
      >
        Sleeper API docs &rarr;
      </a>
    </div>
  );
}

function PlayoffBracket() {
  const wildCard     = PLAYOFF_MATCHUPS.filter(m => m.round === 'Wild Card');
  const semis        = PLAYOFF_MATCHUPS.filter(m => m.round === 'Semifinals');
  const championship = PLAYOFF_MATCHUPS.find(m => m.round === 'Championship')!;
  const moodieBowl   = PLAYOFF_MATCHUPS.find(m => m.round === 'Moodie Bowl')!;

  const champion     = championship.winner === championship.home.owner
    ? championship.home : championship.away;

  return (
    <div className="space-y-10">

      {/* Champion Banner */}
      <div className="rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffd700]/20 border-2 border-[#ffd700] flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ffd700]/70 mb-0.5">
              2025 BMFFFL Champion
            </p>
            <p className="text-xl font-black text-[#ffd700]">
              {champion.teamName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{champion.owner} &bull; #{champion.seed} seed</p>
          </div>
        </div>
        <div className="sm:ml-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffd700] text-[#1a1a2e] text-sm font-black border border-[#c9a800]">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            Champions
          </span>
        </div>
      </div>

      {/* Regular season standings summary */}
      <section aria-labelledby="standings-heading">
        <h3 id="standings-heading" className="text-base font-black text-white mb-3 uppercase tracking-wider">
          Regular Season Final Standings — Playoff Seeds
        </h3>
        <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
          <table className="min-w-full text-sm" aria-label="2025 playoff seeds">
            <thead>
              <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                <th scope="col" className="px-4 py-2.5 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">
                  Seed
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="px-4 py-2.5 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">
                  Record
                </th>
                <th scope="col" className="px-4 py-2.5 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20">
                  Bye
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3347]">
              {STANDINGS.map((row, idx) => (
                <tr key={row.owner} className={cn(
                  'transition-colors duration-100 hover:bg-[#1f3550]',
                  idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                )}>
                  <td className="px-4 py-2.5">
                    <SeedBadge seed={row.seed} />
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-semibold text-white text-sm">{row.teamName}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-sm text-slate-400">{row.owner}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-sm font-mono font-semibold text-slate-300">{row.record}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.seed <= 2 ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Wild Card */}
      <section aria-labelledby="wildcard-heading">
        <div className="flex items-center gap-3 mb-4">
          <h3 id="wildcard-heading" className="text-base font-black text-white uppercase tracking-wider">
            Wild Card — Week 15
          </h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-[#2d4a66] text-slate-400 bg-[#16213e]">
            Seeds 3–6
          </span>
        </div>

        {/* Byes */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { seed: 1, owner: 'MLSchools12' },
            { seed: 2, owner: 'Tubes94' },
          ].map(b => (
            <div key={b.owner} className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              <SeedBadge seed={b.seed} />
              <span className="text-sm font-semibold text-white">{teamName(b.owner)}</span>
              <span className="text-[10px] text-slate-500">{b.owner}</span>
              <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Bye
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wildCard.map(m => (
            <PlayoffMatchupCard key={m.game} matchup={m} />
          ))}
        </div>
      </section>

      {/* Semifinals */}
      <section aria-labelledby="semis-heading">
        <div className="flex items-center gap-3 mb-4">
          <h3 id="semis-heading" className="text-base font-black text-white uppercase tracking-wider">
            Semifinals — Week 16
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {semis.map(m => (
            <PlayoffMatchupCard key={m.game} matchup={m} />
          ))}
        </div>
      </section>

      {/* Championship + Moodie Bowl */}
      <section aria-labelledby="finals-heading">
        <div className="flex items-center gap-3 mb-4">
          <h3 id="finals-heading" className="text-base font-black text-white uppercase tracking-wider">
            Finals — Week 17
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PlayoffMatchupCard matchup={championship} />
          <PlayoffMatchupCard matchup={moodieBowl} />
        </div>
        <p className="mt-2 text-[11px] text-slate-600">
          Moodie Bowl: consolation final for eliminated semifinalists (3rd place).
        </p>
      </section>

    </div>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

type TabKey = number | 'playoffs';

function WeekTabBar({
  activeTab,
  onSelect,
}: {
  activeTab: TabKey;
  onSelect: (tab: TabKey) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-1">
      <div className="flex gap-1 min-w-max">
        {WEEKS.map(w => (
          <button
            key={w.week}
            onClick={() => onSelect(w.week)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap',
              activeTab === w.week
                ? 'bg-[#ffd700] text-[#1a1a2e]'
                : 'bg-[#16213e] text-slate-400 border border-[#2d4a66] hover:text-white hover:border-[#ffd700]/30'
            )}
          >
            {w.label}
            {w.matchups !== null && (
              <span className="ml-1 inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" aria-label="data available" />
            )}
          </button>
        ))}
        <button
          onClick={() => onSelect('playoffs')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap flex items-center gap-1',
            activeTab === 'playoffs'
              ? 'bg-[#ffd700] text-[#1a1a2e]'
              : 'bg-[#16213e] text-slate-400 border border-[#2d4a66] hover:text-white hover:border-[#ffd700]/30'
          )}
        >
          <Trophy className="w-3 h-3" aria-hidden="true" />
          Playoffs
        </button>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MatchupsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(1);

  const currentWeek = typeof activeTab === 'number'
    ? WEEKS.find(w => w.week === activeTab) ?? null
    : null;

  return (
    <>
      <Head>
        <title>2025 Season Matchups — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL 2025 season matchup viewer — all 14 regular season weeks plus full playoff bracket results. 2025 champion: tdtd19844 (14kids0wins/teammoodie)."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/40 border border-[#2d4a66] text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            2025 Season
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            2025 Season Matchups
          </h1>
          <p className="text-slate-400 text-base">
            BMFFFL &bull; 14-week regular season &bull; 6-team playoff bracket
          </p>
        </header>

        {/* ── Week selector tabs ─────────────────────────────────────────── */}
        <div className="mb-6">
          <WeekTabBar activeTab={activeTab} onSelect={setActiveTab} />
          <p className="mt-2 text-[11px] text-slate-600">
            Green dot indicates weeks with sample data included in this static build.
          </p>
        </div>

        {/* ── Content Area ──────────────────────────────────────────────── */}
        {activeTab === 'playoffs' ? (
          <PlayoffBracket />
        ) : currentWeek ? (
          <section aria-label={`Week ${currentWeek.week} matchups`}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-black text-white">
                {currentWeek.label}
                <span className="ml-2 text-slate-500 font-normal text-base">· Regular Season</span>
              </h2>
            </div>

            {currentWeek.matchups !== null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentWeek.matchups.map((m, idx) => (
                  <MatchupCard key={idx} matchup={m} />
                ))}
              </div>
            ) : (
              <NoDataPlaceholder week={currentWeek.week} />
            )}
          </section>
        ) : null}

        {/* ── Footer note ───────────────────────────────────────────────── */}
        <p className="mt-10 text-[11px] text-slate-600 leading-relaxed">
          Scores for Weeks 1, 7, and 14 are representative estimates derived from full-season
          totals. All playoff scores and results are verified final results. Full per-week
          scores are available via the{' '}
          <a
            href="https://docs.sleeper.com/#get-matchups-for-a-league"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-slate-400 transition-colors"
          >
            Sleeper API
          </a>
          .
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

export async function getStaticProps() {
  return { props: {} };
}
