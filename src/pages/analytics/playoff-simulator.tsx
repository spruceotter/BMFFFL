import { useState } from 'react';
import Head from 'next/head';
import { Trophy, RotateCcw, GitBranch, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Competitor {
  seed: number;
  name: string;
  record: string;
  score?: number;
}

interface Matchup {
  id: string;
  week: string;
  home: Competitor;  // higher seed (or carries through)
  away: Competitor;  // lower seed (or carries through)
  actualWinner: number; // seed number of actual winner
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEED_COLORS: Record<number, string> = {
  1: 'text-[#ffd700]',
  2: 'text-rose-400',
  3: 'text-emerald-400',
  4: 'text-blue-400',
  5: 'text-amber-400',
  6: 'text-indigo-400',
};

const SEED_BG: Record<number, string> = {
  1: 'bg-[#ffd700]/10 border-[#ffd700]/30',
  2: 'bg-rose-400/10 border-rose-400/30',
  3: 'bg-emerald-400/10 border-emerald-400/30',
  4: 'bg-blue-400/10 border-blue-400/30',
  5: 'bg-amber-400/10 border-amber-400/30',
  6: 'bg-indigo-400/10 border-indigo-400/30',
};

// The 6 playoff participants, seeded by 2025 regular-season record
// Source: Sleeper DB — 2025 league (1180109269263917056)
const SEEDINGS: Record<number, Competitor> = {
  1: { seed: 1, name: 'MLSchools12',       record: '13-1' },  // #1 overall
  2: { seed: 2, name: 'Tubes94',           record: '10-4' },  // #2 — bye
  3: { seed: 3, name: 'SexMachineAndyD',   record: '9-5'  },  // #3
  4: { seed: 4, name: 'tdtd19844',         record: '8-6'  },  // #4
  5: { seed: 5, name: 'JuicyBussy',        record: '7-7'  },  // #5
  6: { seed: 6, name: 'Cmaleski',          record: '6-8'  },  // #6 wildcard
};

// Actual matchup results — verified against Sleeper DB scores
// QF: #3 vs #6, #4 vs #5 | SF: #1 vs QF2-winner, #2 vs QF1-winner | Final: SF winners
const ACTUAL_MATCHUPS: Matchup[] = [
  {
    id: 'qf1',
    week: 'Week 15',
    home: { ...SEEDINGS[3], score: 142.86 },  // SexMachineAndyD
    away: { ...SEEDINGS[6], score: 173.40 },  // Cmaleski upset!
    actualWinner: 6,
  },
  {
    id: 'qf2',
    week: 'Week 15',
    home: { ...SEEDINGS[4], score: 195.82 },  // tdtd19844
    away: { ...SEEDINGS[5], score: 138.44 },  // JuicyBussy
    actualWinner: 4,
  },
  {
    id: 'sf1',
    week: 'Week 16',
    home: { ...SEEDINGS[1], score: 120.16 },  // MLSchools12 (#1 bye)
    away: { ...SEEDINGS[4], score: 137.70 },  // tdtd19844 upset!
    actualWinner: 4,
  },
  {
    id: 'sf2',
    week: 'Week 16',
    home: { ...SEEDINGS[2], score: 182.36 },  // Tubes94 (#2 bye)
    away: { ...SEEDINGS[6], score: 146.60 },  // Cmaleski
    actualWinner: 2,
  },
  {
    id: 'championship',
    week: 'Week 17',
    home: { ...SEEDINGS[2], score: 135.08 },  // Tubes94
    away: { ...SEEDINGS[4], score: 152.92 },  // tdtd19844 — CHAMPION
    actualWinner: 4,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSeedBadge(seed: number) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black shrink-0 border',
        seed === 1 || seed === 2 ? 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30' : 'bg-[#2d4a66]/60 text-slate-400 border-[#2d4a66]'
      )}
    >
      {seed}
    </span>
  );
}

// ─── Competitor Card ──────────────────────────────────────────────────────────

interface CompetitorCardProps {
  competitor: Competitor;
  isWinner: boolean;
  isLoser: boolean;
  isClickable: boolean;
  onSelect: () => void;
  showScore: boolean;
}

function CompetitorCard({ competitor, isWinner, isLoser, isClickable, onSelect, showScore }: CompetitorCardProps) {
  const color = SEED_COLORS[competitor.seed] ?? 'text-white';
  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={onSelect}
      className={cn(
        'w-full text-left px-3 py-2 rounded-lg border transition-all duration-150',
        isWinner
          ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20'
          : isLoser
          ? 'bg-[#0d1b2a]/60 border-[#2d4a66]/50 opacity-40'
          : 'bg-[#16213e] border-[#2d4a66]',
        isClickable && !isWinner && !isLoser && 'hover:border-[#ffd700]/40 hover:bg-[#ffd700]/5 cursor-pointer',
        isClickable && isLoser && 'hover:opacity-60 hover:border-amber-500/40 cursor-pointer',
        !isClickable && 'cursor-default'
      )}
      aria-label={isClickable ? `Toggle winner: ${competitor.name}` : competitor.name}
    >
      <div className="flex items-center gap-2">
        {getSeedBadge(competitor.seed)}
        <span className={cn('text-sm font-bold truncate flex-1', color)}>
          {competitor.name}
        </span>
        {isWinner && (
          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wide border border-emerald-500/30">
            W
          </span>
        )}
        {isLoser && (
          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[#2d4a66]/40 text-slate-600 font-bold uppercase tracking-wide border border-[#2d4a66]/40">
            L
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-0.5 pl-7">
        <span className="text-[11px] font-mono text-slate-500 tabular-nums">{competitor.record}</span>
        {showScore && competitor.score !== undefined && (
          <span className={cn('text-[11px] font-mono tabular-nums font-semibold', isWinner ? 'text-emerald-400' : 'text-slate-600')}>
            {competitor.score.toFixed(2)} pts
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Matchup Box ──────────────────────────────────────────────────────────────

interface MatchupBoxProps {
  matchup: Matchup;
  simulatedWinner: number; // seed
  isAltered: boolean;
  onToggle: () => void;
  showScores: boolean;
}

function MatchupBox({ matchup, simulatedWinner, isAltered, onToggle, showScores }: MatchupBoxProps) {
  const homeWins = simulatedWinner === matchup.home.seed;
  const awayWins = simulatedWinner === matchup.away.seed;

  return (
    <div className={cn(
      'rounded-xl border p-3 transition-all duration-200',
      isAltered ? 'border-amber-500/40 bg-amber-500/5' : 'border-[#2d4a66] bg-[#16213e]'
    )}>
      {isAltered && (
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3 h-3 text-amber-400" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Alternate Timeline</span>
        </div>
      )}
      <div className="space-y-1.5">
        <CompetitorCard
          competitor={matchup.home}
          isWinner={homeWins}
          isLoser={awayWins}
          isClickable
          onSelect={onToggle}
          showScore={showScores}
        />
        <div className="text-center">
          <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">vs</span>
        </div>
        <CompetitorCard
          competitor={matchup.away}
          isWinner={awayWins}
          isLoser={homeWins}
          isClickable
          onSelect={onToggle}
          showScore={showScores}
        />
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-600 font-medium">{matchup.week} &middot; Click to flip outcome</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlayoffSimulatorPage() {
  // simulatedWinners maps matchup id -> winning seed number
  const [simulatedWinners, setSimulatedWinners] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const m of ACTUAL_MATCHUPS) {
      initial[m.id] = m.actualWinner;
    }
    return initial;
  });
  const [showScores, setShowScores] = useState(true);

  // Derive bracket: who advances from each round
  const qf1Winner = SEEDINGS[simulatedWinners['qf1']];
  const qf2Winner = SEEDINGS[simulatedWinners['qf2']];

  // Semifinal matchups use actual seedings for bye teams (1 & 2)
  // but replace the advancing side with whoever won the QF
  const sf1Matchup: Matchup = {
    id: 'sf1',
    week: 'Week 16',
    home: { ...SEEDINGS[1], score: ACTUAL_MATCHUPS.find(m => m.id === 'sf1')!.home.score },
    away: {
      ...qf1Winner,
      score: simulatedWinners['qf1'] === ACTUAL_MATCHUPS.find(m => m.id === 'sf1')!.away.seed
        ? ACTUAL_MATCHUPS.find(m => m.id === 'sf1')!.away.score
        : undefined,
    },
    actualWinner: ACTUAL_MATCHUPS.find(m => m.id === 'sf1')!.actualWinner,
  };

  const sf2Matchup: Matchup = {
    id: 'sf2',
    week: 'Week 16',
    home: { ...SEEDINGS[2], score: ACTUAL_MATCHUPS.find(m => m.id === 'sf2')!.home.score },
    away: {
      ...qf2Winner,
      score: simulatedWinners['qf2'] === ACTUAL_MATCHUPS.find(m => m.id === 'sf2')!.away.seed
        ? ACTUAL_MATCHUPS.find(m => m.id === 'sf2')!.away.score
        : undefined,
    },
    actualWinner: ACTUAL_MATCHUPS.find(m => m.id === 'sf2')!.actualWinner,
  };

  const sf1Winner = SEEDINGS[simulatedWinners['sf1']];
  const sf2Winner = SEEDINGS[simulatedWinners['sf2']];

  const champMatchup: Matchup = {
    id: 'championship',
    week: 'Week 17',
    home: {
      ...sf1Winner,
      score: simulatedWinners['sf1'] === ACTUAL_MATCHUPS.find(m => m.id === 'championship')!.home.seed
        ? ACTUAL_MATCHUPS.find(m => m.id === 'championship')!.home.score
        : undefined,
    },
    away: {
      ...sf2Winner,
      score: simulatedWinners['sf2'] === ACTUAL_MATCHUPS.find(m => m.id === 'championship')!.away.seed
        ? ACTUAL_MATCHUPS.find(m => m.id === 'championship')!.away.score
        : undefined,
    },
    actualWinner: ACTUAL_MATCHUPS.find(m => m.id === 'championship')!.actualWinner,
  };

  const champion = SEEDINGS[simulatedWinners['championship']];

  const isAltered = (id: string): boolean => {
    const actual = ACTUAL_MATCHUPS.find(m => m.id === id);
    return actual ? simulatedWinners[id] !== actual.actualWinner : false;
  };

  // Any matchup is altered if it differs from actual or if an upstream matchup was altered
  const qf1Altered = isAltered('qf1');
  const qf2Altered = isAltered('qf2');
  const sf1Altered = isAltered('sf1') || qf1Altered;
  const sf2Altered = isAltered('sf2') || qf2Altered;
  const champAltered = isAltered('championship') || sf1Altered || sf2Altered;
  const anyAltered = qf1Altered || qf2Altered || isAltered('sf1') || isAltered('sf2') || isAltered('championship');

  function toggleMatchup(id: string) {
    setSimulatedWinners(prev => {
      const newState = { ...prev };

      if (id === 'qf1') {
        const m = ACTUAL_MATCHUPS.find(x => x.id === 'qf1')!;
        newState['qf1'] = prev['qf1'] === m.home.seed ? m.away.seed : m.home.seed;
        // Reset downstream if winner changed
        newState['sf1'] = ACTUAL_MATCHUPS.find(x => x.id === 'sf1')!.actualWinner;
        newState['championship'] = ACTUAL_MATCHUPS.find(x => x.id === 'championship')!.actualWinner;
      } else if (id === 'qf2') {
        const m = ACTUAL_MATCHUPS.find(x => x.id === 'qf2')!;
        newState['qf2'] = prev['qf2'] === m.home.seed ? m.away.seed : m.home.seed;
        newState['sf2'] = ACTUAL_MATCHUPS.find(x => x.id === 'sf2')!.actualWinner;
        newState['championship'] = ACTUAL_MATCHUPS.find(x => x.id === 'championship')!.actualWinner;
      } else if (id === 'sf1') {
        // Toggle between seed 1 and whoever won qf1
        const seed1 = 1;
        const qf1w = newState['qf1'];
        newState['sf1'] = prev['sf1'] === seed1 ? qf1w : seed1;
        newState['championship'] = ACTUAL_MATCHUPS.find(x => x.id === 'championship')!.actualWinner;
      } else if (id === 'sf2') {
        const seed2 = 2;
        const qf2w = newState['qf2'];
        newState['sf2'] = prev['sf2'] === seed2 ? qf2w : seed2;
        newState['championship'] = ACTUAL_MATCHUPS.find(x => x.id === 'championship')!.actualWinner;
      } else if (id === 'championship') {
        const sf1w = newState['sf1'];
        const sf2w = newState['sf2'];
        newState['championship'] = prev['championship'] === sf1w ? sf2w : sf1w;
      }

      return newState;
    });
  }

  function resetBracket() {
    const reset: Record<string, number> = {};
    for (const m of ACTUAL_MATCHUPS) {
      reset[m.id] = m.actualWinner;
    }
    setSimulatedWinners(reset);
  }

  const champColor = SEED_COLORS[champion.seed] ?? 'text-white';
  const champBg = SEED_BG[champion.seed] ?? 'bg-white/5 border-white/20';
  const isActualChamp = champion.seed === 4; // tdtd19844 (#4 seed)

  return (
    <>
      <Head>
        <title>Playoff Simulator — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2025 BMFFFL Playoff Replay Simulator — view the actual championship bracket and explore what-if scenarios by toggling match outcomes."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Playoff Simulator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            2025 Season — Championship Bracket. Replay history or explore alternate timelines by flipping match outcomes.
          </p>
        </header>

        {/* Controls bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {anyAltered ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Alternate Timeline Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Actual Results</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowScores(v => !v)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                showScores
                  ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                  : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
              )}
              aria-pressed={showScores}
            >
              {showScores ? 'Scores: ON' : 'Scores: OFF'}
            </button>
          </div>

          <button
            type="button"
            onClick={resetBracket}
            disabled={!anyAltered}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-150',
              anyAltered
                ? 'bg-[#16213e] text-slate-300 border-[#2d4a66] hover:border-amber-500/50 hover:text-amber-300'
                : 'opacity-30 bg-[#16213e] text-slate-600 border-[#2d4a66] cursor-not-allowed'
            )}
            aria-label="Reset bracket to actual results"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset to Actual
          </button>
        </div>

        {/* Seedings legend */}
        <section className="mb-6" aria-labelledby="seedings-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
            <h2 id="seedings-heading" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              2025 Playoff Seedings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(seed => {
                const p = SEEDINGS[seed];
                const color = SEED_COLORS[seed];
                const isBye = seed <= 2;
                return (
                  <div
                    key={seed}
                    className={cn(
                      'rounded-lg border px-3 py-2 flex flex-col gap-0.5',
                      isBye ? 'border-[#ffd700]/25 bg-[#ffd700]/5' : 'border-[#2d4a66]/60 bg-[#0d1b2a]/50'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {getSeedBadge(seed)}
                      <span className={cn('text-xs font-bold truncate', color)}>{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-0.5">
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">{p.record}</span>
                      {isBye && (
                        <span className="text-[10px] text-[#ffd700]/70 font-semibold uppercase tracking-wide">Bye</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bracket */}
        <section aria-labelledby="bracket-heading">
          <h2 id="bracket-heading" className="sr-only">Playoff Bracket</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">

            {/* Column 1: Quarterfinals */}
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quarterfinals</span>
                <p className="text-[11px] text-slate-700 mt-0.5">Week 15 &middot; Wild Card Round</p>
              </div>

              <MatchupBox
                matchup={{
                  ...ACTUAL_MATCHUPS.find(m => m.id === 'qf1')!,
                }}
                simulatedWinner={simulatedWinners['qf1']}
                isAltered={qf1Altered}
                onToggle={() => toggleMatchup('qf1')}
                showScores={showScores}
              />

              {/* Bye info */}
              <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/60">Seeds 1 &amp; 2 — First Round Bye</span>
                <div className="mt-2 space-y-1">
                  {[1, 2].map(seed => {
                    const p = SEEDINGS[seed];
                    const color = SEED_COLORS[seed];
                    return (
                      <div key={seed} className="flex items-center justify-center gap-2">
                        {getSeedBadge(seed)}
                        <span className={cn('text-xs font-bold', color)}>{p.name}</span>
                        <span className="text-[11px] font-mono text-slate-600 tabular-nums">{p.record}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <MatchupBox
                matchup={{
                  ...ACTUAL_MATCHUPS.find(m => m.id === 'qf2')!,
                }}
                simulatedWinner={simulatedWinners['qf2']}
                isAltered={qf2Altered}
                onToggle={() => toggleMatchup('qf2')}
                showScores={showScores}
              />
            </div>

            {/* Column 2: Semifinals */}
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Semifinals</span>
                <p className="text-[11px] text-slate-700 mt-0.5">Week 16 &middot; Final Four</p>
              </div>

              <MatchupBox
                matchup={sf1Matchup}
                simulatedWinner={simulatedWinners['sf1']}
                isAltered={sf1Altered}
                onToggle={() => toggleMatchup('sf1')}
                showScores={showScores}
              />

              <div className="flex items-center justify-center py-3">
                <div className="h-px flex-1 bg-[#2d4a66]/40" />
                <span className="px-3 text-xs text-slate-700 font-semibold uppercase tracking-wider">Semifinal Results</span>
                <div className="h-px flex-1 bg-[#2d4a66]/40" />
              </div>

              <MatchupBox
                matchup={sf2Matchup}
                simulatedWinner={simulatedWinners['sf2']}
                isAltered={sf2Altered}
                onToggle={() => toggleMatchup('sf2')}
                showScores={showScores}
              />

              {sf2Altered && simulatedWinners['sf2'] === 5 && simulatedWinners['qf2'] === 5 && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-center">
                  <p className="text-[11px] text-amber-400 font-semibold">The upset is still alive in your simulation!</p>
                </div>
              )}
            </div>

            {/* Column 3: Championship */}
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-[#ffd700]/80 uppercase tracking-widest">Championship</span>
                <p className="text-[11px] text-slate-700 mt-0.5">Week 17 &middot; Title Game</p>
              </div>

              <div className={cn(
                'rounded-xl border-2 p-1',
                champAltered ? 'border-amber-500/50' : 'border-[#ffd700]/40'
              )}>
                <MatchupBox
                  matchup={champMatchup}
                  simulatedWinner={simulatedWinners['championship']}
                  isAltered={champAltered}
                  onToggle={() => toggleMatchup('championship')}
                  showScores={showScores}
                />
              </div>

              {/* Champion display */}
              <div className={cn(
                'rounded-xl border p-4 text-center',
                champAltered ? 'border-amber-500/40 bg-amber-500/5' : 'border-[#ffd700]/40 bg-[#ffd700]/8'
              )}>
                <Trophy
                  className={cn('w-8 h-8 mx-auto mb-2', champAltered ? 'text-amber-400' : 'text-[#ffd700]')}
                  aria-hidden="true"
                />
                <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-1', champAltered ? 'text-amber-500' : 'text-[#ffd700]/70')}>
                  {champAltered ? 'Simulated Champion' : 'BMFFFL Champion'}
                </p>
                <p className={cn('text-xl font-black', champColor)}>{champion.name}</p>
                <p className="text-xs font-mono text-slate-500 tabular-nums mt-0.5">
                  {champion.record} &middot; #{champion.seed} seed
                </p>
                {!champAltered && isActualChamp && (
                  <p className="mt-2 text-[11px] text-amber-400/80 font-medium">
                    2025 BMFFFL Champion
                  </p>
                )}
                {champAltered && (
                  <p className="mt-2 text-[11px] text-amber-400/80 font-medium">
                    What if&hellip; your alternate universe
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Moodie Bowl note */}
        <section className="mt-8" aria-labelledby="moodie-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
            <h2 id="moodie-heading" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Moodie Bowl — Week 17
            </h2>
            <p className="text-sm text-slate-400">
              While the championship unfolded, <span className="text-purple-400 font-bold">Grandes</span> and{' '}
              <span className="text-[#e94560] font-bold">Cogdeill11</span> played in the consolation bracket for the coveted{' '}
              <span className="text-slate-300 font-semibold">last place</span> crown — otherwise known as the Moodie Bowl.
              Grandes lost, finishing the season in last place.
            </p>
          </div>
        </section>

        {/* Results summary — actual champion card */}
        <section className="mt-8" aria-labelledby="champion-summary-heading">
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#ffd700]/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#ffd700]/20 shrink-0">
                <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <h2 id="champion-summary-heading" className="text-base font-bold text-white leading-tight">
                  2025 BMFFFL Champion — tdtd19844
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Championship stats &amp; context
                </p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Final Seed',        value: '#4',        note: '8-6 regular season record' },
                { label: 'Championship Score', value: '152.92',   note: 'vs Tubes94\'s 135.08' },
                { label: 'Playoff Run',        value: '3-0',      note: 'QF → SF → Championship' },
                { label: 'Upset Margin',       value: '17.84 pts', note: 'Won by 17.84 in the final' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#0d1b2a]/50 rounded-lg px-4 py-3 border border-[#ffd700]/15 text-center">
                  <div className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-1">{stat.label}</div>
                  <div className="text-lg font-black text-[#ffd700] tabular-nums">{stat.value}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{stat.note}</div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5 space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-[#ffd700] font-bold">tdtd19844</span> — the #4 seed — pulled off one of the most improbable championship runs in league history. After dominating #5 <span className="text-emerald-400 font-semibold">JuicyBussy</span> in the quarterfinals (195.82 vs 138.44), they upset #1 seed <span className="text-[#ffd700] font-semibold">MLSchools12</span> in the semifinals (137.70 vs 120.16) before topping #2 seed <span className="text-rose-400 font-semibold">Tubes94</span> in the championship (152.92 vs 135.08).
              </p>

              <div className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a]/60 px-4 py-3">
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  &ldquo;Your Commissioner computes that tdtd19844&rsquo;s championship run, while statistically improbable, was executed with considerable verve.&rdquo;
                  <span className="ml-1 not-italic font-semibold text-slate-400">~Love, Bimfle.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="mt-8" aria-labelledby="instructions-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
            <h2 id="instructions-heading" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              How to Use the Simulator
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: '1',
                  title: 'Click any matchup card',
                  desc: 'Click a competitor card in the bracket to flip who wins that matchup.',
                  color: 'text-[#ffd700]',
                  bg: 'border-[#ffd700]/20 bg-[#ffd700]/5',
                },
                {
                  step: '2',
                  title: 'Downstream updates automatically',
                  desc: 'Changing a quarterfinal result cascades through the semifinal and championship rounds.',
                  color: 'text-amber-400',
                  bg: 'border-amber-500/20 bg-amber-500/5',
                },
                {
                  step: '3',
                  title: 'Reset anytime',
                  desc: 'Hit "Reset to Actual" to restore the real 2025 results. Toggle scores on/off as you explore.',
                  color: 'text-emerald-400',
                  bg: 'border-emerald-500/20 bg-emerald-500/5',
                },
              ].map(item => (
                <div key={item.step} className={cn('rounded-lg border p-3', item.bg)}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border shrink-0',
                      item.color,
                      item.bg
                    )}>
                      {item.step}
                    </span>
                    <p className={cn('text-xs font-bold', item.color)}>{item.title}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-7">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
