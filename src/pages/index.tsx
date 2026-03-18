import Head from 'next/head';
import Link from 'next/link';
import { Trophy, Users, ArrowRight, TrendingUp, Repeat2, Calendar, Bot } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import ArticleCard from '@/components/articles/ArticleCard';
import OwnerCard from '@/components/owners/OwnerCard';
import BimfleWidget from '@/components/BimfleWidget';
import DidYouKnow from '@/components/ui/DidYouKnow';
import type { ArticleCardData } from '@/components/articles/ArticleCard';
import type { OwnerCardData } from '@/components/owners/OwnerCard';
import { cn } from '@/lib/cn';

// ─── Hardcoded league quick stats ──────────────────────────────────────────

const QUICK_STATS = [
  { label: 'Seasons',    value: '6',    subtext: '2020 – 2025',             icon: Calendar },
  { label: 'Teams',      value: '12',   subtext: 'Dynasty format',           icon: Users },
  { label: 'Champions',  value: '5',    subtext: '5 unique champions',       icon: Trophy },
  { label: 'Trades',     value: '257',  subtext: 'All-time trades made',     icon: Repeat2 },
] as const;

// ─── Placeholder recent articles ────────────────────────────────────────────

const RECENT_ARTICLES: ArticleCardData[] = [
  {
    slug:        'state-of-the-league-march-2026',
    title:       'State of the League: March 2026',
    subtitle:    'Six seasons in, the landscape has never been more competitive. A full breakdown of where every owner stands.',
    author:      'Flint',
    publishedAt: '2026-03-15',
    category:    'analysis',
    tags:        ['2026', 'offseason', 'analysis'],
  },
  {
    slug:        '2026-rookie-draft-preview',
    title:       '2026 Rookie Draft Preview',
    subtitle:    'The incoming class ranked from 1 to 30. Which dynasty teams are best positioned to capitalize?',
    author:      'Flint',
    publishedAt: '2026-03-12',
    category:    'preview',
    tags:        ['draft', 'rookies', '2026'],
  },
  {
    slug:        'buyers-sellers-2026',
    title:       'Buyers and Sellers: March 2026',
    subtitle:    'Who to buy, who to sell, and who to hold in the current dynasty market.',
    author:      'Flint',
    publishedAt: '2026-03-08',
    category:    'strategy',
    tags:        ['strategy', 'offseason', 'dynasty'],
  },
];

// ─── Placeholder all-time top 3 owners ──────────────────────────────────────

const TOP_OWNERS: OwnerCardData[] = [
  {
    name:               'MLSchools12',
    teamName:           'Schoolcraft Football Team',
    allTimeRecord:      { wins: 68, losses: 15, ties: 0, winPct: 0.819 },
    championships:      2,
    playoffAppearances: 6,
    winPct:             0.819,
  },
  {
    name:               'SexMachineAndyD',
    teamName:           'SexMachineAndyD',
    allTimeRecord:      { wins: 50, losses: 33, ties: 0, winPct: 0.602 },
    championships:      0,
    playoffAppearances: 4,
    winPct:             0.602,
  },
  {
    name:               'JuicyBussy',
    teamName:           'Juicy Bussy',
    allTimeRecord:      { wins: 46, losses: 37, ties: 0, winPct: 0.554 },
    championships:      1,
    playoffAppearances: 5,
    winPct:             0.554,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Head>
        <title>BMFFFL — Best MFing Fantasy Football League</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football league — 6 seasons of excellence, 12 teams, and counting."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-[#0d1b2a] border-b border-[#2d4a66]"
        aria-labelledby="hero-heading"
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#e94560]/5 blur-3xl" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#ffd700]/5 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">

          {/* Season status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" aria-hidden="true" />
            2026 Offseason — Rookie Draft in June 2026
          </div>

          {/* Main title */}
          <h1
            id="hero-heading"
            className="text-6xl sm:text-8xl font-black tracking-tighter text-white mb-4"
            style={{ letterSpacing: '-0.04em' }}
          >
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffffff 50%, #e94560 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              BMFFFL
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-slate-300 font-medium mb-2">
            6 seasons of dynasty excellence.
          </p>
          <p className="text-sm text-slate-500 mb-3">
            Best MFing Fantasy Football League &mdash; Full PPR Dynasty &bull; 12 Teams &bull; Sleeper
          </p>
          {/* Reigning champion */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-sm font-semibold mb-10">
            <Trophy className="w-4 h-4" aria-hidden="true" />
            2025 Champion: tdtd19844 (14kids0wins/teammoodie)
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/history"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm',
                'bg-[#e94560] text-white hover:bg-[#c73652]',
                'transition-colors duration-150 shadow-lg shadow-[#e94560]/20'
              )}
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              League History
            </Link>
            <Link
              href="/season"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm',
                'bg-[#1a2d42] text-white border border-[#2d4a66]',
                'hover:border-[#ffd700] hover:text-[#ffd700]',
                'transition-colors duration-150'
              )}
            >
              This Season
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Stats Row ──────────────────────────────────────────────── */}
      <section
        className="bg-[#0d1b2a] border-b border-[#2d4a66]"
        aria-labelledby="stats-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 id="stats-heading" className="sr-only">League Quick Stats</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_STATS.map(({ label, value, subtext, icon: Icon }) => (
              <StatCard
                key={label}
                label={label}
                value={value}
                subtext={subtext}
                className="text-center items-center"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Commissioner's Dispatch ──────────────────────────────────────── */}
      <section
        className="bg-[#0d1b2a] border-b border-[#2d4a66]"
        aria-labelledby="dispatch-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ background: '#ffd70015', border: '1px solid #ffd70040' }}
            >
              <Bot className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="dispatch-heading"
                className="text-xl font-black text-white leading-tight"
              >
                Commissioner&apos;s Dispatch
              </h2>
              <p className="text-xs text-slate-500 leading-tight">
                BMFFFL &middot; March 2026
              </p>
            </div>
          </div>

          {/* Announcements */}
          <div className="flex flex-col gap-3">
            {[
              "The 2026 Rookie Draft is scheduled for the first Friday of June. I encourage all esteemed managers to prepare their draft boards with appropriate diligence. ~Love, Bimfle.",
              "I am pleased to announce that the 2025 season archives are now fully compiled. tdtd19844 (14kids0wins/teammoodie) is hereby recognized as the 2025 BMFFFL Champion. The Commissioner sends his congratulations. ~Love, Bimfle.",
              "The annual Owners Meeting agenda has been published. All proprietors are encouraged to review the proposed constitution amendments before the May convening. ~Love, Bimfle.",
            ].map((announcement, idx) => (
              <div
                key={idx}
                className="flex gap-4 px-4 py-3 rounded-lg"
                style={{
                  background: '#16213e',
                  border: '1px solid #2d4a66',
                  borderLeft: '3px solid #ffd700',
                }}
              >
                <Bot
                  className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#ffd700]"
                  aria-hidden="true"
                />
                <p className="text-sm text-slate-300 leading-relaxed">
                  {announcement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Did You Know? ────────────────────────────────────────────────── */}
      <section
        className="bg-[#0d1b2a] border-b border-[#2d4a66]"
        aria-label="Did You Know? league facts"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DidYouKnow />
        </div>
      </section>

      {/* ── All-Time Standings Preview ───────────────────────────────────── */}
      <section
        className="bg-[#0d1b2a] border-b border-[#2d4a66]"
        aria-labelledby="standings-preview-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                id="standings-preview-heading"
                className="text-2xl font-black text-white"
              >
                All-Time Leaders
              </h2>
              <p className="text-sm text-slate-400 mt-1">Top performers across all 6 seasons</p>
            </div>
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-sm text-[#ffd700] hover:text-[#fff0a0] transition-colors duration-150 font-medium"
            >
              Full History
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Top 3 owner cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TOP_OWNERS.map((owner, idx) => (
              <div key={owner.name} className="relative">
                {/* Rank badge */}
                <div
                  className={cn(
                    'absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2',
                    idx === 0
                      ? 'bg-[#ffd700] text-[#1a1a2e] border-[#c9a800]'
                      : idx === 1
                      ? 'bg-[#c0c0c0] text-[#1a1a2e] border-[#9ca3af]'
                      : 'bg-[#cd7f32] text-white border-[#a0632a]'
                  )}
                  aria-label={`Rank ${idx + 1}`}
                >
                  {idx + 1}
                </div>
                <OwnerCard owner={owner} variant="expanded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Articles ──────────────────────────────────────────────── */}
      <section
        className="bg-[#0d1b2a]"
        aria-labelledby="articles-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                id="articles-heading"
                className="text-2xl font-black text-white"
              >
                Latest Articles
              </h2>
              <p className="text-sm text-slate-400 mt-1">Analysis, recaps, and strategy</p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm text-[#ffd700] hover:text-[#fff0a0] transition-colors duration-150 font-medium"
            >
              All Articles
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_ARTICLES.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer spacer / bottom CTA ───────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Since 2020
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            The best league you&apos;re not in.
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            12 managers. Full PPR dynasty. Rookie drafts. 257 trades. One trophy.
          </p>
        </div>
      </section>

      {/* ── Bimfle chatbot widget ─────────────────────────────────────────── */}
      <BimfleWidget />
    </>
  );
}
