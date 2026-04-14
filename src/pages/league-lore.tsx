import Head from 'next/head';
import Link from 'next/link';
import {
  Trophy,
  Star,
  Clock,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

type LoreIconType = 'trophy' | 'star' | 'clock' | 'book';

interface LoreEntry {
  id: string;
  year: string;
  title: string;
  story: string;
  icon: LoreIconType;
  highlight?: boolean;
}

const LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'founding',
    year: '2016',
    title: 'The Founding',
    story:
      'The BMFFFL was born out of dissatisfaction with prior league leadership. A group of friends decided they could do better — and the Best Motherfucking Fantasy Football League was born, with Grandes as founding Commissioner.',
    icon: 'star',
  },
  {
    id: 'sleeper-migration',
    year: '2019',
    title: 'The Move to Sleeper',
    story:
      'After years on another platform, the BMFFFL migrated to Sleeper, modernizing the league experience. The first Sleeper season (2019) saw 0.00 scores from legacy teams still learning the new system.',
    icon: 'clock',
  },
  {
    id: 'cogdeill-title',
    year: '2020',
    title: "Cogdeill11's Sleeper Title",
    story:
      "In the first full Sleeper dynasty season, Cogdeill11 claimed the inaugural championship — defeating eldridsm 203.10–198.34 in a thriller. Their only Sleeper-era title; Cogdeill11 also won the ESPN-era 2017 championship.",
    icon: 'trophy',
  },
  {
    id: 'murder-boners-dynasty',
    year: '2021–2022',
    title: 'Murder Boners Rise, Then Grandes Strikes',
    story:
      'MLSchools12 (The Murder Boners) won the 2021 championship, dominating the regular season. In 2022, Commissioner Grandes made history — defeating rbr 137.82–115.08 to claim the title and cement the league\'s founding dynasty.',
    icon: 'trophy',
    highlight: true,
  },
  {
    id: 'cinderella-championship',
    year: '2023',
    title: 'The Cinderella Championship',
    story:
      'JuicyBussy entered as the #6 seed and won the whole thing. MLSchools12 went 13–1 in the regular season — the best record in league history — but fell before the finals. The Moodie Bowl matchup saw Tubes94 defeat Escuelas.',
    icon: 'star',
    highlight: true,
  },
  {
    id: 'the-return',
    year: '2024',
    title: 'The Return of The Murder Boners',
    story:
      'MLSchools12 returned to dominance — defeating SexMachineAndyD 168.40–146.86 to claim their 4th all-time championship. After winning 2021, sitting out as Grandes (2022) and JuicyBussy (2023) took their turns, The Murder Boners reclaimed the crown.',
    icon: 'trophy',
    highlight: true,
  },
  {
    id: 'underdog-rises',
    year: '2025',
    title: 'The Underdog Rises',
    story:
      'tdtd19844, after years near the bottom of the standings, claimed the 2025 championship — the most surprising title run in league history.',
    icon: 'star',
  },
  {
    id: 'ai-archive',
    year: 'Ongoing',
    title: 'The AI Archive',
    story:
      'Commissioner Grandes appointed Bimfle as the AI Commissioner Assistant, launching the digital archive platform.',
    icon: 'book',
  },
];

// ─── Icon renderer ────────────────────────────────────────────────────────────

function LoreIcon({
  type,
  className,
}: {
  type: LoreIconType;
  className?: string;
}) {
  const cls = cn('shrink-0', className);
  switch (type) {
    case 'trophy': return <Trophy  className={cls} aria-hidden="true" />;
    case 'star':   return <Star    className={cls} aria-hidden="true" />;
    case 'clock':  return <Clock   className={cls} aria-hidden="true" />;
    case 'book':   return <BookOpen className={cls} aria-hidden="true" />;
  }
}

// ─── Timeline card ────────────────────────────────────────────────────────────

function LoreCard({
  entry,
  isLast,
}: {
  entry: LoreEntry;
  isLast: boolean;
}) {
  const { year, title, story, icon, highlight } = entry;

  return (
    <div className="relative flex gap-5 sm:gap-6">

      {/* ── Timeline spine ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center shrink-0">
        {/* Node */}
        <div
          className={cn(
            'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0',
            highlight
              ? 'bg-[#ffd700]/10 border-[#ffd700]/60 shadow-[0_0_16px_rgba(255,215,0,0.15)]'
              : 'bg-[#16213e] border-[#2d4a66]'
          )}
        >
          <LoreIcon
            type={icon}
            className={cn('w-4 h-4', highlight ? 'text-[#ffd700]' : 'text-slate-400')}
          />
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 bg-gradient-to-b from-[#2d4a66] to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Card body ──────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex-1 min-w-0 rounded-xl border p-5 mb-8',
          'bg-[#16213e]',
          highlight
            ? 'border-[#ffd700]/30 shadow-lg shadow-[#ffd700]/5'
            : 'border-[#2d4a66]'
        )}
      >
        {/* Year badge + title row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest leading-none',
              highlight
                ? 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30'
                : 'bg-[#0d1b2a] text-slate-400 border border-[#2d4a66]'
            )}
          >
            {year}
          </span>
          <h2
            className={cn(
              'text-base font-black leading-snug',
              highlight ? 'text-[#ffd700]' : 'text-white'
            )}
          >
            {title}
          </h2>
        </div>

        {/* Narrative */}
        <p className="text-sm text-slate-300 leading-relaxed">{story}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeagueLorePage() {
  return (
    <>
      <Head>
        <title>League Lore — BMFFFL</title>
        <meta
          name="description"
          content="The history and defining moments of the BMFFFL — from its founding in 2016 to the latest championship run."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">League Lore</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              BMFFFL History
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            League{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffffff 60%, #e94560 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Lore
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            The key moments, upsets, and dynasties that define the{' '}
            <strong className="text-white">Best Motherfucking Fantasy Football League</strong>.
            From a founding in dissatisfaction to a decade of champions.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { label: 'Seasons', value: '10' },
              { label: 'Champions', value: '6' },
              { label: 'Founded', value: '2016' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-4 text-center"
              >
                <p className="text-2xl font-black text-[#ffd700] leading-none mb-1">{value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-10">
          <Clock className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Timeline
          </span>
          <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
        </div>

        {/* Lore entries */}
        <div>
          {LORE_ENTRIES.map((entry, idx) => (
            <LoreCard
              key={entry.id}
              entry={entry}
              isLast={idx === LORE_ENTRIES.length - 1}
            />
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-[#16213e] border border-[#2d4a66] p-8 text-center mt-4">
          <Trophy className="w-8 h-8 text-[#ffd700] mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-black text-white mb-2">The Story Continues</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Explore full season breakdowns, all-time records, and the owners who shaped BMFFFL history.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/history"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm',
                'bg-[#e94560] text-white hover:bg-[#c73652]',
                'transition-colors duration-150 shadow-lg shadow-[#e94560]/20'
              )}
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              League History
            </Link>
            <Link
              href="/records"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm',
                'bg-[#1a2d42] text-white border border-[#2d4a66]',
                'hover:border-[#ffd700] hover:text-[#ffd700]',
                'transition-colors duration-150'
              )}
            >
              <Star className="w-4 h-4" aria-hidden="true" />
              All-Time Records
            </Link>
          </div>
        </div>

        {/* Fine print */}
        <p className="mt-8 text-xs text-center text-slate-600">
          BMFFFL — Established 2016. Lore compiled by Bimfle, AI Commissioner Assistant.
        </p>
      </div>
    </>
  );
}
