import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Star, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Season data ─────────────────────────────────────────────────────────────

interface SeasonSummary {
  year: number;
  champion: string;
  teamName: string;
  record: string;
  seed?: number;
  runnerUp: string;
  historyAnchor?: string;
}

const SEASONS: SeasonSummary[] = [
  {
    year: 2025,
    champion:      'tdtd19844',
    teamName:      'THE Shameful Saggy sack',
    record:        '8-6',
    seed:          4,
    runnerUp:      'Tubes94',
    historyAnchor: 'season-2025',
  },
  {
    year: 2024,
    champion:      'MLSchools12',
    teamName:      'Schoolcraft Football Team',
    record:        '10-4',
    seed:          3,
    runnerUp:      'SexMachineAndyD',
    historyAnchor: 'season-2024',
  },
  {
    year: 2023,
    champion:      'JuicyBussy',
    teamName:      'Juicy Bussy',
    record:        '8-6',
    seed:          6,
    runnerUp:      'eldridm20',
    historyAnchor: 'season-2023',
  },
  {
    year: 2022,
    champion:      'Grandes',
    teamName:      'El Rioux Grandes',
    record:        '8-6',
    seed:          4,
    runnerUp:      'rbr',
    historyAnchor: 'season-2022',
  },
  {
    year: 2021,
    champion:      'MLSchools12',
    teamName:      'MLSchools12',
    record:        '11-3',
    runnerUp:      'rbr',
    historyAnchor: 'season-2021',
  },
  {
    year: 2020,
    champion:      'Cogdeill11',
    teamName:      'Cogdeill11',
    record:        '10-3',
    runnerUp:      'eldridsm',
    historyAnchor: 'season-2020',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUpset(s: SeasonSummary): boolean {
  return s.seed !== undefined && s.seed >= 4;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeasonCard({ season, isLatest }: { season: SeasonSummary; isLatest: boolean }) {
  const upset = isUpset(season);
  const href  = season.historyAnchor
    ? `/history#${season.historyAnchor}`
    : '/history';

  return (
    <Link
      href={href}
      className={cn(
        'group relative block rounded-xl border overflow-hidden',
        'bg-[#16213e] transition-all duration-200',
        'hover:scale-[1.01] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#ffd700]',
        upset
          ? 'border-[#e94560]/40 hover:border-[#e94560]/70'
          : 'border-[#2d4a66] hover:border-[#ffd700]/50'
      )}
      aria-label={`${season.year} season — champion ${season.champion}`}
    >
      {/* Top accent */}
      <div
        className={cn(
          'h-0.5 w-full',
          isLatest
            ? 'bg-gradient-to-r from-[#ffd700] via-[#fff0a0] to-[#ffd700]'
            : upset
            ? 'bg-[#e94560]/50'
            : 'bg-[#2d4a66]'
        )}
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Year */}
          <span
            className={cn(
              'text-5xl font-black leading-none tabular-nums',
              isLatest ? 'text-[#ffd700]' : 'text-slate-400 group-hover:text-slate-300'
            )}
          >
            {season.year}
          </span>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5 mt-1">
            {isLatest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 px-2 py-0.5 text-[10px] font-bold text-[#ffd700] uppercase tracking-widest">
                Latest
              </span>
            )}
            {upset && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#e94560]/15 border border-[#e94560]/40 px-2 py-0.5 text-[10px] font-bold text-[#e94560] uppercase tracking-widest"
                title={`#${season.seed} seed championship upset`}
              >
                <Star className="w-3 h-3" aria-hidden="true" />
                #{season.seed} Upset
              </span>
            )}
            {season.seed && !upset && (
              <span className="text-[10px] text-slate-500 font-mono">
                #{season.seed} seed
              </span>
            )}
          </div>
        </div>

        {/* Champion info */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">
              Champion
            </span>
          </div>
          <p className="text-base font-black text-white leading-tight truncate">
            {season.champion}
          </p>
          {season.teamName !== season.champion && (
            <p className="text-xs text-slate-400 truncate">{season.teamName}</p>
          )}
        </div>

        {/* Record + Runner-up */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2d4a66]/60">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
              Record
            </p>
            <p className="text-sm font-mono font-bold text-slate-300">{season.record}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
              Runner-up
            </p>
            <p className="text-sm font-semibold text-slate-400 truncate">{season.runnerUp}</p>
          </div>
        </div>

        {/* Arrow hint */}
        <div className="mt-3 flex justify-end">
          <ArrowRight
            className="w-4 h-4 text-slate-600 group-hover:text-[#ffd700] transition-colors duration-150"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SeasonsIndexPage() {
  return (
    <>
      <Head>
        <title>All Seasons — BMFFFL</title>
        <meta
          name="description"
          content="Every BMFFFL season from 2020 to 2025. Champions, records, and runner-ups for all six seasons of dynasty fantasy football."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Seasons</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Season Archive
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
            All Seasons
          </h1>
          <p className="text-slate-400 text-base max-w-xl">
            Six seasons of BMFFFL dynasty history. From 2020 on ESPN to 2025 on Sleeper —
            five unique champions and counting.
          </p>
        </div>
      </section>

      {/* ── Season grid ──────────────────────────────────────────────────── */}
      <section
        className="bg-[#0d1b2a]"
        aria-labelledby="seasons-grid-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 id="seasons-grid-heading" className="sr-only">Season cards</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEASONS.map((season, idx) => (
              <SeasonCard
                key={season.year}
                season={season}
                isLatest={idx === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom link to full history ───────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">Want the full picture?</h2>
            <p className="text-sm text-slate-400">
              All-time standings, records, and deep dives live on the History page.
            </p>
          </div>
          <Link
            href="/history"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shrink-0',
              'bg-[#e94560] text-white hover:bg-[#c73652]',
              'transition-colors duration-150 shadow-lg shadow-[#e94560]/20'
            )}
          >
            <Trophy className="w-4 h-4" aria-hidden="true" />
            League History
          </Link>
        </div>
      </section>
    </>
  );
}
