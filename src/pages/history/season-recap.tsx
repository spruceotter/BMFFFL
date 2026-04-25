import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Star, Zap, TrendingUp, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonRecap {
  year: number;
  champion: string;
  championRecord: string;
  championSeed: number;
  runnerUp: string;
  runnerUpRecord?: string;
  championshipScore?: string;
  keyMoment: string;
  notables: string[];
  seasonHighScorer: string;
  seasonHighPts?: string;
  quote?: string;
  cinderella?: boolean;
  dynastyNote?: string;
}

// ─── Season Data ──────────────────────────────────────────────────────────────

const SEASONS: SeasonRecap[] = [
  {
    year: 2020,
    champion: 'Cogdeill11',
    championRecord: '10-3',
    championSeed: 2,
    runnerUp: 'eldridsm',
    runnerUpRecord: '8-5',
    championshipScore: '203.10 – 198.34',
    keyMoment:
      'Alvin Kamara scored 6 TDs on Christmas Day, swinging multiple playoff matchups across the league.',
    notables: [
      'eldridsm upset #1 seed MLSchools12 (11-2) in the semis with 181 points.',
      'The closest championship in BMFFFL history — decided by just 4.76 points.',
      'MLSchools12 posted the season high with 2,115.74 total points.',
    ],
    seasonHighScorer: 'MLSchools12',
    seasonHighPts: '2,115.74',
    quote: 'Only championship decided by under 5 points in league history.',
  },
  {
    year: 2021,
    champion: 'MLSchools12',
    championRecord: '11-3',
    championSeed: 1,
    runnerUp: 'SexMachineAndyD',
    runnerUpRecord: '10-4',
    championshipScore: '193.10 – 111.34',
    keyMoment:
      'MLSchools12 dominated wire-to-wire — top regular season seed (11-3) and decisive championship win over SexMachineAndyD 193.10–111.34.',
    notables: [
      'Tubes94 joined the league and went 2-12 — worst debut in BMFFFL history.',
      'MCSchools (original team) retired after a 0-14 season — the worst record ever.',
      'JuicyBussy posted a consolation week score of 245.80 — the all-time single-game record.',
    ],
    seasonHighScorer: 'MLSchools12',
    seasonHighPts: '2,327.10',
    dynastyNote: 'MLSchools12 posts the all-time season scoring record (2,327.10 pts).',
  },
  {
    year: 2022,
    champion: 'Grandes',
    championRecord: '8-6',
    championSeed: 4,
    runnerUp: 'rbr',
    keyMoment:
      'Grandes beat MLSchools12 in the semis by just 2.80 points, then rode momentum to the title.',
    notables: [
      '3-way tie at 10-4 between MLSchools12, JuicyBussy, and rbr — wild standings shakeout.',
      'Escuelas joined the league.',
      'tdtd19844 went 3-11, beginning what would become a historic rebuild arc.',
    ],
    seasonHighScorer: 'MLSchools12',
    cinderella: true,
    dynastyNote: 'First 4th-seed champion in BMFFFL history.',
  },
  {
    year: 2023,
    champion: 'JuicyBussy',
    championRecord: '8-6',
    championSeed: 6,
    runnerUp: 'eldridm20',
    keyMoment:
      'eldridm20 eliminated the 13-1 #1 seed MLSchools12 in the semis with 154.30 points, opening the door for the lowest seed to claim a title.',
    notables: [
      'MLSchools12 went 13-1 and still lost in the semis — biggest regular season dominance without a title.',
      'Cogdeill11 crashed to 3-11, a rapid fall from the 2020 championship.',
      'JuicyBussy became the lowest-seeded (6th) champion in league history — 3 straight road upsets.',
    ],
    seasonHighScorer: 'MLSchools12',
    cinderella: true,
    dynastyNote: 'Lowest seed (6th) ever to win the BMFFFL championship.',
  },
  {
    year: 2024,
    champion: 'MLSchools12',
    championRecord: '10-4',
    championSeed: 3,
    runnerUp: 'SexMachineAndyD',
    runnerUpRecord: '11-3',
    keyMoment:
      'SexMachineAndyD posted an 11-3 regular season — the best in the league — but fell in the championship game.',
    notables: [
      'Tubes94 went 10-4 as the #2 seed but was eliminated in the semis.',
      '3 teams with 10+ wins — one of the most competitive regular seasons in league history.',
      'MLSchools12 claims their 4th all-time championship (2016, 2019, 2021, 2024).',
    ],
    seasonHighScorer: 'SexMachineAndyD',
    dynastyNote: 'MLSchools12\'s fourth all-time title — dynasty confirmed across both ESPN and Sleeper eras.',
  },
  {
    year: 2025,
    champion: 'tdtd19844',
    championRecord: '8-6',
    championSeed: 4,
    runnerUp: 'Tubes94',
    runnerUpRecord: '10-4',
    championshipScore: '152.92 – 135.08',
    keyMoment:
      'tdtd19844 upsets the 13-1 MLSchools12 in the semis and then defeats Tubes94 in the championship. The 4th seed writes the ultimate dark horse story.',
    notables: [
      'MLSchools12 goes 13-1 (best regular-season record ever) but is eliminated before the finals.',
      'Grandes finishes last (Moodie Bowl) — fastest championship-to-last trajectory in league history (2022→2025).',
      'tdtd19844 entered the playoffs as a 4th seed with an 8-6 record and won 3 straight to claim the title.',
    ],
    seasonHighScorer: 'MLSchools12',
    dynastyNote: 'tdtd19844 — THE Shameful Saggy Sack claims the crown. The ultimate dark horse.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function YearBadge({ year, isChampion }: { year: number; isChampion?: boolean }) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg',
        isChampion
          ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
          : 'border-[#2d4a66] bg-[#16213e] text-slate-300'
      )}
    >
      {String(year).slice(2)}
    </div>
  );
}

interface SeasonCardProps {
  season: SeasonRecap;
  index: number;
}

function SeasonCard({ season, index }: SeasonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <div id={`season-${season.year}`} className="scroll-mt-24">
      {/* Mobile layout — always stacked */}
      <div className="relative flex gap-4 md:hidden">
        {/* Timeline dot */}
        <div className="flex flex-col items-center">
          <YearBadge year={season.year} isChampion />
          <div className="mt-2 flex-1 border-l-2 border-[#2d4a66]" />
        </div>

        <div className="flex-1 pb-12">
          <CardContent season={season} expanded={expanded} setExpanded={setExpanded} />
        </div>
      </div>

      {/* Desktop layout — alternating left/right */}
      <div className="relative hidden md:flex md:items-start md:gap-0">
        {/* Left side */}
        <div className={cn('flex-1 pr-8', isLeft ? 'text-right' : 'invisible')}>
          {isLeft && <CardContent season={season} expanded={expanded} setExpanded={setExpanded} />}
        </div>

        {/* Center line + badge */}
        <div className="relative flex flex-col items-center" style={{ width: '56px', flexShrink: 0 }}>
          <YearBadge year={season.year} isChampion />
          <div className="mt-2 flex-1 border-l-2 border-[#2d4a66]" style={{ minHeight: '24px' }} />
        </div>

        {/* Right side */}
        <div className={cn('flex-1 pl-8', !isLeft ? '' : 'invisible')}>
          {!isLeft && <CardContent season={season} expanded={expanded} setExpanded={setExpanded} />}
        </div>
      </div>
    </div>
  );
}

interface CardContentProps {
  season: SeasonRecap;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}

function CardContent({ season, expanded, setExpanded }: CardContentProps) {
  return (
    <div
      className={cn(
        'mb-6 rounded-xl border bg-[#16213e] p-5 shadow-lg transition-all duration-200',
        'border-[#2d4a66] hover:border-[#ffd700]/40',
        season.cinderella && 'border-[#e94560]/50 shadow-[#e94560]/5 shadow-md',
        season.dynastyNote && !season.cinderella && 'border-[#ffd700]/30 shadow-[#ffd700]/5 shadow-md'
      )}
    >
      {/* Season year label */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xl font-bold text-[#ffd700]">{season.year}</span>
        <div className="flex gap-1.5">
          {season.cinderella && (
            <span className="rounded-full bg-[#e94560]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#e94560]">
              Cinderella
            </span>
          )}
          {season.dynastyNote && (
            <span className="rounded-full bg-[#ffd700]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#ffd700]">
              Milestone
            </span>
          )}
        </div>
      </div>

      {/* Champion card */}
      <div className="championship-shimmer mb-4 flex items-start gap-3 rounded-lg border border-[#ffd700]/20 p-3">
        <Trophy className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ffd700]" />
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-base font-bold text-[#ffd700]">{season.champion}</span>
            <span className="text-sm text-slate-400">
              {season.championRecord} · Seed {season.championSeed}
            </span>
          </div>
          {season.championshipScore && (
            <div className="mt-0.5 text-xs text-slate-400">
              Championship: {season.championshipScore}
            </div>
          )}
          <div className="mt-0.5 text-xs text-slate-500">
            Runner-up: {season.runnerUp}
            {season.runnerUpRecord && ` (${season.runnerUpRecord})`}
          </div>
        </div>
      </div>

      {/* Key moment */}
      <div className="mb-4 flex gap-2 rounded-lg border border-[#2d4a66] bg-[#0d1b2a]/60 p-3">
        <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e94560]" />
        <div>
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#e94560]">
            Key Moment
          </span>
          <p className="text-sm leading-relaxed text-slate-300">{season.keyMoment}</p>
        </div>
      </div>

      {/* Quote */}
      {season.quote && (
        <blockquote className="mb-4 border-l-2 border-[#ffd700]/40 pl-3 text-xs italic text-slate-400">
          &ldquo;{season.quote}&rdquo;
        </blockquote>
      )}

      {/* Toggle notables */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-2 flex w-full items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className="font-medium uppercase tracking-wider">
          {expanded ? 'Hide details' : 'Show details'}
        </span>
        <span className="text-slate-500">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="space-y-2 pt-1">
          {/* Notables */}
          <ul className="space-y-1.5">
            {season.notables.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-400">
                <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#2d4a66]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>

          {/* Season stats row */}
          <div className="mt-3 flex flex-wrap gap-3 border-t border-[#2d4a66] pt-3">
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-[#ffd700]" />
              <span className="text-slate-500">Season high scorer:</span>
              <span className="font-medium text-slate-300">{season.seasonHighScorer}</span>
              {season.seasonHighPts && (
                <span className="text-slate-500">({season.seasonHighPts} pts)</span>
              )}
            </div>
          </div>

          {/* Dynasty note */}
          {season.dynastyNote && (
            <div className="mt-2 rounded bg-[#ffd700]/5 px-3 py-2 text-xs text-[#ffd700]/80 italic">
              {season.dynastyNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SeasonRecapPage() {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  function scrollToSeason(year: number) {
    setActiveYear(year);
    const el = document.getElementById(`season-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <>
      <Head>
        <title>Season Recaps | BMFFFL Dynasty</title>
        <meta
          name="description"
          content="Interactive timeline of BMFFFL Sleeper era seasons (2020–2025) — champions, key moments, and storylines. ESPN era (2016–2019) at History."
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
              BMFFFL · Sleeper Era · 2020–2025
            </p>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Season Recaps
            </h1>
            <p className="mx-auto max-w-xl text-slate-400">
              Six Sleeper-era seasons of fantasy football history — champions crowned, dynasties
              built, and Cinderella stories written. ESPN era (2016–2019) in the{' '}
              <a href="/history" className="text-[#e94560] hover:underline">History archive</a>.
            </p>
          </div>

          {/* ── Season Selector (tabs) ── */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {SEASONS.map((s) => (
              <button
                key={s.year}
                onClick={() => scrollToSeason(s.year)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150',
                  activeYear === s.year
                    ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]'
                    : 'border-[#2d4a66] bg-[#16213e] text-slate-300 hover:border-[#ffd700]/40 hover:text-white'
                )}
              >
                {s.year}
              </button>
            ))}
          </div>

          {/* ── Timeline ── */}
          <div className="relative">
            {/* Vertical line on desktop — positioned behind cards */}
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-px border-l-2 border-[#2d4a66] md:block"
              aria-hidden="true"
            />

            <div className="space-y-0">
              {SEASONS.map((season, index) => (
                <SeasonCard key={season.year} season={season} index={index} />
              ))}
            </div>
          </div>

          {/* ── Footer note ── */}
          <div className="mt-12 border-t border-[#2d4a66] pt-8 text-center text-xs text-slate-500">
            <p>
              6 Sleeper seasons · 10 total · 1 dynasty —{' '}
              <span className="text-slate-400">BMFFFL est. 2016</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
