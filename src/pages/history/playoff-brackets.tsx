import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, ArrowLeft, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamEntry {
  seed: number;
  name: string;
  record?: string;
  score?: number;
  winner: boolean;
  bye?: boolean;
}

interface Matchup {
  round: 'QF' | 'SF' | 'Championship';
  top: TeamEntry;
  bottom: TeamEntry;
  upset?: boolean;
  note?: string;
}

interface MoodieBowl {
  winner: string;
  loser: string;
  note?: string;
}

interface SeasonBracket {
  year: number;
  champion: string;
  championSeed: number;
  cinderella?: boolean;
  cinderellaNote?: string;
  summary: string;
  quarterFinals: [Matchup, Matchup];
  semiFinals: [Matchup, Matchup];
  championship: Matchup;
  moodieBowl?: MoodieBowl;
}

// ─── Bracket Data ─────────────────────────────────────────────────────────────

const BRACKETS: SeasonBracket[] = [
  {
    year: 2025,
    champion: 'tdtd19844',
    championSeed: 4,
    summary: 'The ultimate dark horse. tdtd19844 went 8-6, entered as the 4th seed, and took down the 13-1 MLSchools12 in the semis — the biggest upset in BMFFFL playoff history. Then defeated Tubes94 in the championship 152.92–135.08. MLSchools12\'s dominant regular season ended without a ring.',
    quarterFinals: [
      {
        round: 'QF',
        top: { seed: 3, name: 'JuicyBussy', record: '7-7', score: 178.40, winner: false },
        bottom: { seed: 6, name: 'Cmaleski', record: '6-8', score: 192.60, winner: true },
        upset: true,
        note: '#6 over #3',
      },
      {
        round: 'QF',
        top: { seed: 4, name: 'tdtd19844', record: '8-6', score: 168.50, winner: true },
        bottom: { seed: 5, name: 'SexMachineAndyD', record: '9-5', score: 152.30, winner: false },
        upset: false,
      },
    ],
    semiFinals: [
      {
        round: 'SF',
        top: { seed: 1, name: 'MLSchools12', record: '13-1', score: 162.80, winner: false, bye: true },
        bottom: { seed: 4, name: 'tdtd19844', record: '8-6', score: 178.20, winner: true },
        upset: true,
        note: '#4 upsets #1 — 13-1 season ends in heartbreak',
      },
      {
        round: 'SF',
        top: { seed: 2, name: 'Tubes94', record: '10-4', score: 189.20, winner: true, bye: true },
        bottom: { seed: 6, name: 'Cmaleski', record: '6-8', score: 155.40, winner: false },
        upset: false,
      },
    ],
    championship: {
      round: 'Championship',
      top: { seed: 4, name: 'tdtd19844', record: '8-6', score: 152.92, winner: true },
      bottom: { seed: 2, name: 'Tubes94', record: '10-4', score: 135.08, winner: false },
      upset: false,
      note: 'Dark horse champion — 4th seed claims the crown',
    },
    moodieBowl: {
      winner: 'Grandes',
      loser: 'Cogdeill11',
      note: 'Grandes wins the Moodie Bowl (avoids last place)',
    },
  },
  {
    year: 2024,
    champion: 'MLSchools12',
    championSeed: 1,
    summary: 'MLSchools12 claims their fourth all-time championship (second Sleeper-era), surviving a bracket with three 10+ win teams. SexMachineAndyD posted the best regular season record (11-3) but fell in the title game — their second runner-up finish.',
    quarterFinals: [
      {
        round: 'QF',
        top: { seed: 3, name: 'Tubes94', record: '10-4', winner: true },
        bottom: { seed: 6, name: 'tdtd19844', record: '8-6', winner: false },
        upset: false,
      },
      {
        round: 'QF',
        top: { seed: 2, name: 'SexMachineAndyD', record: '11-3', winner: true },
        bottom: { seed: 5, name: 'rbr', record: '8-6', winner: false },
        upset: false,
      },
    ],
    semiFinals: [
      {
        round: 'SF',
        top: { seed: 1, name: 'MLSchools12', record: '11-3', winner: true, bye: true },
        bottom: { seed: 3, name: 'Tubes94', record: '10-4', winner: false },
        upset: false,
      },
      {
        round: 'SF',
        top: { seed: 2, name: 'SexMachineAndyD', record: '11-3', winner: true },
        bottom: { seed: 4, name: 'JuicyBussy', record: '9-5', winner: false },
        upset: false,
      },
    ],
    championship: {
      round: 'Championship',
      top: { seed: 1, name: 'MLSchools12', record: '11-3', score: 185, winner: true },
      bottom: { seed: 2, name: 'SexMachineAndyD', record: '11-3', score: 162, winner: false },
      upset: false,
    },
  },
  {
    year: 2023,
    champion: 'JuicyBussy',
    championSeed: 6,
    cinderella: true,
    cinderellaNote: 'The lowest seed (6th) ever to win the BMFFFL — 3 consecutive road upsets',
    summary: 'The greatest Cinderella run in BMFFFL history. JuicyBussy entered as the 6th seed and won three straight games to claim the title. Meanwhile eldridm20 slayed the 13-1 #1 seed MLSchools12 in the semis.',
    quarterFinals: [
      {
        round: 'QF',
        top: { seed: 5, name: 'eldridm20', winner: true, score: 154.30 },
        bottom: { seed: 4, name: 'SexMachineAndyD', winner: false, score: 138.00 },
        upset: true,
        note: '#5 over #4',
      },
      {
        round: 'QF',
        top: { seed: 6, name: 'JuicyBussy', winner: true },
        bottom: { seed: 3, name: 'eldridsm', winner: false },
        upset: true,
        note: '#6 over #3',
      },
    ],
    semiFinals: [
      {
        round: 'SF',
        top: { seed: 5, name: 'eldridm20', score: 154.30, winner: true },
        bottom: { seed: 1, name: 'MLSchools12', record: '13-1', score: 148.00, winner: false, bye: true },
        upset: true,
        note: 'Giant kill — 13-1 #1 seed falls',
      },
      {
        round: 'SF',
        top: { seed: 6, name: 'JuicyBussy', winner: true },
        bottom: { seed: 2, name: 'rbr', winner: false, bye: true },
        upset: true,
        note: '#6 over #2',
      },
    ],
    championship: {
      round: 'Championship',
      top: { seed: 6, name: 'JuicyBussy', winner: true },
      bottom: { seed: 5, name: 'eldridm20', winner: false },
      upset: false,
      note: '6th seed wins it all',
    },
  },
  {
    year: 2022,
    champion: 'Grandes',
    championSeed: 3,
    summary: 'Grandes beat MLSchools12 in the semis by just 2.80 points, then claimed the title over rbr — who was appearing in their second straight runner-up finish. First non-top-2 champion in BMFFFL history.',
    quarterFinals: [
      {
        round: 'QF',
        top: { seed: 3, name: 'Grandes', winner: true },
        bottom: { seed: 5, name: 'SexMachineAndyD', winner: false },
        upset: false,
      },
      {
        round: 'QF',
        top: { seed: 4, name: 'eldridsm', winner: true },
        bottom: { seed: 6, name: 'eldridm20', winner: false },
        upset: false,
      },
    ],
    semiFinals: [
      {
        round: 'SF',
        top: { seed: 3, name: 'Grandes', winner: true },
        bottom: { seed: 1, name: 'MLSchools12', winner: false, bye: true },
        upset: true,
        note: '#3 over #1 — by 2.8 pts',
      },
      {
        round: 'SF',
        top: { seed: 2, name: 'rbr', winner: true, bye: true },
        bottom: { seed: 4, name: 'eldridsm', winner: false },
        upset: false,
      },
    ],
    championship: {
      round: 'Championship',
      top: { seed: 3, name: 'Grandes', winner: true },
      bottom: { seed: 2, name: 'rbr', winner: false },
      upset: false,
      note: 'rbr\'s 2nd straight runner-up',
    },
  },
  {
    year: 2021,
    champion: 'MLSchools12',
    championSeed: 1,
    summary: 'MLSchools12 went 12-1 in the regular season and backed it up in the playoffs. rbr fell in the championship for the second consecutive year. eldridsm made an unexpected run to the semis after beating Grandes.',
    quarterFinals: [
      {
        round: 'QF',
        top: { seed: 3, name: 'JuicyBussy', winner: true },
        bottom: { seed: 6, name: 'eldridm20', winner: false },
        upset: false,
      },
      {
        round: 'QF',
        top: { seed: 2, name: 'rbr', winner: true },
        bottom: { seed: 5, name: 'Grandes', winner: false },
        upset: false,
      },
    ],
    semiFinals: [
      {
        round: 'SF',
        top: { seed: 1, name: 'MLSchools12', record: '12-1', winner: true, bye: true },
        bottom: { seed: 3, name: 'JuicyBussy', winner: false },
        upset: false,
      },
      {
        round: 'SF',
        top: { seed: 2, name: 'rbr', winner: true },
        bottom: { seed: 4, name: 'eldridsm', winner: false },
        upset: false,
      },
    ],
    championship: {
      round: 'Championship',
      top: { seed: 1, name: 'MLSchools12', record: '12-1', winner: true },
      bottom: { seed: 2, name: 'rbr', winner: false },
      upset: false,
      note: 'rbr runner-up for 2nd straight year',
    },
  },
  {
    year: 2020,
    champion: 'Cogdeill11',
    championSeed: 2,
    summary: 'The inaugural BMFFFL championship, decided by just 4.76 points — the closest title game in league history. eldridsm was the hero of the bracket, knocking out the 11-2 #1 seed MLSchools12 in the semis.',
    quarterFinals: [
      {
        round: 'QF',
        top: { seed: 3, name: 'eldridsm', record: '8-5', winner: true },
        bottom: { seed: 4, name: 'rbr', record: '8-5', winner: false },
        upset: false,
      },
      {
        round: 'QF',
        top: { seed: 5, name: 'JuicyBussy', record: '9-4', winner: true },
        bottom: { seed: 6, name: 'Grandes', record: '8-5', winner: false },
        upset: true,
        note: '#5 over #6 (lower seed)',
      },
    ],
    semiFinals: [
      {
        round: 'SF',
        top: { seed: 3, name: 'eldridsm', score: 181.00, winner: true },
        bottom: { seed: 1, name: 'MLSchools12', record: '11-2', winner: false, bye: true },
        upset: true,
        note: '181 pts — giant killer',
      },
      {
        round: 'SF',
        top: { seed: 2, name: 'Cogdeill11', record: '10-3', winner: true, bye: true },
        bottom: { seed: 5, name: 'JuicyBussy', winner: false },
        upset: false,
      },
    ],
    championship: {
      round: 'Championship',
      top: { seed: 2, name: 'Cogdeill11', record: '10-3', score: 203.10, winner: true },
      bottom: { seed: 3, name: 'eldridsm', record: '8-5', score: 198.34, winner: false },
      upset: false,
      note: 'Closest title in history — 4.76 pt margin',
    },
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TeamRow({
  entry,
  isTop,
}: {
  entry: TeamEntry;
  isTop: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 transition-colors',
        entry.winner
          ? 'bg-[#ffd700]/5 border-[#ffd700]/30'
          : 'bg-transparent border-transparent',
        isTop ? 'rounded-t-lg border-t border-x' : 'rounded-b-lg border-b border-x border-t border-[#2d4a66]'
      )}
    >
      {/* Seed bubble */}
      <span
        className={cn(
          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
          entry.winner ? 'bg-[#ffd700]/20 text-[#ffd700]' : 'bg-[#2d4a66]/60 text-slate-400'
        )}
      >
        {entry.seed}
      </span>

      {/* Name */}
      <span
        className={cn(
          'flex-1 truncate text-sm font-medium',
          entry.winner ? 'text-white' : 'text-slate-400',
          entry.bye && 'opacity-60'
        )}
      >
        {entry.name}
        {entry.bye && <span className="ml-1 text-[10px] text-slate-500">(bye)</span>}
      </span>

      {/* Record */}
      {entry.record && (
        <span className="text-[10px] text-slate-500 flex-shrink-0">{entry.record}</span>
      )}

      {/* Score */}
      {entry.score !== undefined && (
        <span
          className={cn(
            'text-xs font-bold flex-shrink-0 ml-1',
            entry.winner ? 'text-[#ffd700]' : 'text-slate-500'
          )}
        >
          {entry.score.toFixed(2)}
        </span>
      )}

      {/* W/L dot */}
      <span
        className={cn(
          'h-2 w-2 rounded-full flex-shrink-0',
          entry.winner ? 'bg-[#22c55e]' : 'bg-[#ef4444]/60'
        )}
      />
    </div>
  );
}

function MatchupCard({ matchup }: { matchup: Matchup }) {
  return (
    <div className="relative">
      {matchup.upset && (
        <span className="absolute -top-2 right-2 z-10 rounded-full bg-[#e94560] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
          UPSET
        </span>
      )}
      <div
        className={cn(
          'rounded-lg border overflow-hidden',
          matchup.upset ? 'border-[#e94560]/50' : 'border-[#2d4a66]'
        )}
      >
        <TeamRow entry={matchup.top} isTop />
        <div className="h-px bg-[#2d4a66]" />
        <TeamRow entry={matchup.bottom} isTop={false} />
      </div>
      {matchup.note && (
        <p className="mt-1 text-center text-[10px] italic text-slate-500">{matchup.note}</p>
      )}
    </div>
  );
}

function RoundLabel({ label }: { label: string }) {
  return (
    <div className="mb-3 text-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

function ChampionCard({ name, seed }: { name: string; seed: number }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-[#ffd700]/60 bg-[#ffd700]/10 px-4 py-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
      <Trophy className="h-7 w-7 text-[#ffd700]" />
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/70">Champion</p>
        <p className="mt-0.5 text-base font-bold text-[#ffd700]">{name}</p>
        <p className="text-[11px] text-slate-400">Seed #{seed}</p>
      </div>
    </div>
  );
}

function BracketView({ bracket }: { bracket: SeasonBracket }) {
  return (
    <div className="space-y-6">
      {/* Cinderella banner */}
      {bracket.cinderella && bracket.cinderellaNote && (
        <div className="flex items-start gap-2 rounded-lg border border-[#e94560]/40 bg-[#e94560]/5 px-4 py-3">
          <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e94560]" />
          <p className="text-sm text-[#e94560]">{bracket.cinderellaNote}</p>
        </div>
      )}

      {/* Season summary */}
      <p className="text-sm leading-relaxed text-slate-400">{bracket.summary}</p>

      {/* Bracket grid — QF | SF | Championship | Champion */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-3 mb-1">
            <RoundLabel label="Quarterfinals" />
            <RoundLabel label="Semifinals" />
            <RoundLabel label="Championship" />
            <RoundLabel label="Champion" />
          </div>

          {/* Bracket rows */}
          <div className="grid grid-cols-4 gap-3">
            {/* QF column */}
            <div className="flex flex-col gap-4 justify-around">
              <MatchupCard matchup={bracket.quarterFinals[0]} />
              <MatchupCard matchup={bracket.quarterFinals[1]} />
            </div>

            {/* SF column */}
            <div className="flex flex-col gap-4 justify-around">
              <MatchupCard matchup={bracket.semiFinals[0]} />
              <MatchupCard matchup={bracket.semiFinals[1]} />
            </div>

            {/* Championship column */}
            <div className="flex flex-col justify-center">
              <MatchupCard matchup={bracket.championship} />
            </div>

            {/* Champion column */}
            <div className="flex flex-col justify-center">
              <ChampionCard name={bracket.champion} seed={bracket.championSeed} />
            </div>
          </div>
        </div>
      </div>

      {/* Moodie Bowl */}
      {bracket.moodieBowl && (
        <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Moodie Bowl (Last Place Game)
          </p>
          <p className="text-sm text-slate-400">
            <span className="font-medium text-slate-300">{bracket.moodieBowl.winner}</span>
            {' '}def.{' '}
            <span className="font-medium text-slate-300">{bracket.moodieBowl.loser}</span>
            {' '}—{' '}
            <span className="italic text-slate-500">{bracket.moodieBowl.note}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlayoffBracketsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const activeBracket = BRACKETS.find((b) => b.year === selectedYear) ?? BRACKETS[0];

  return (
    <>
      <Head>
        <title>Playoff Brackets | BMFFFL Dynasty</title>
        <meta
          name="description"
          content="Interactive playoff bracket visualizer for all 6 BMFFFL seasons — seeds, matchups, scores, upsets, and champions from 2020 to 2025."
        />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white">
        {/* Back link */}
        <div className="border-b border-[#2d4a66]">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              History
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* ── Header ── */}
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e94560]">
              BMFFFL · 2020–2025
            </p>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Playoff History
            </h1>
            <p className="mx-auto max-w-xl text-slate-400">
              All 6 BMFFFL championship brackets — seeds, matchups, upsets, and the moments that
              defined every title run.
            </p>
          </div>

          {/* ── Season selector ── */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {BRACKETS.map((b) => (
              <button
                key={b.year}
                onClick={() => setSelectedYear(b.year)}
                className={cn(
                  'rounded-full border px-5 py-1.5 text-sm font-medium transition-all duration-150',
                  selectedYear === b.year
                    ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]'
                    : 'border-[#2d4a66] bg-[#16213e] text-slate-300 hover:border-[#ffd700]/40 hover:text-white',
                  b.cinderella && selectedYear !== b.year && 'border-[#e94560]/30'
                )}
              >
                {b.year}
                {b.cinderella && (
                  <span className="ml-1.5 text-[9px] font-bold text-[#e94560]">★</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Active bracket panel ── */}
          <div className="rounded-2xl border border-[#2d4a66] bg-[#16213e] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{activeBracket.year} Playoffs</h2>
              <div className="flex items-center gap-2">
                {activeBracket.cinderella && (
                  <span className="rounded-full bg-[#e94560]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#e94560]">
                    Cinderella Season
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-full bg-[#ffd700]/10 px-3 py-1 text-[11px] font-semibold text-[#ffd700]">
                  <Trophy className="h-3 w-3" />
                  {activeBracket.champion}
                </span>
              </div>
            </div>

            <BracketView bracket={activeBracket} />
          </div>

          {/* ── Legend ── */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              Winner
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]/60" />
              Eliminated
            </span>
            <span className="flex items-center gap-1.5">
              <span className="rounded-full bg-[#e94560] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                UPSET
              </span>
              Lower seed beats higher seed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#e94560] text-sm">★</span>
              Cinderella season
            </span>
          </div>

          {/* ── All-time quick stats ── */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Championships', value: '6', sub: 'seasons played' },
              { label: 'Unique Champions', value: '4', sub: 'different winners' },
              { label: 'Lowest Seed to Win', value: '#6', sub: 'JuicyBussy 2023' },
              { label: 'Closest Title', value: '4.76 pts', sub: 'Cogdeill11 2020' },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4 text-center"
              >
                <p className="text-xl font-bold text-[#ffd700]">{value}</p>
                <p className="mt-0.5 text-xs font-semibold text-white">{label}</p>
                <p className="text-[11px] text-slate-500">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <div className="mt-12 border-t border-[#2d4a66] pt-8 text-center text-xs text-slate-500">
            <p>
              6 seasons · 6 champions · 1 dynasty —{' '}
              <span className="text-slate-400">BMFFFL est. 2020</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
