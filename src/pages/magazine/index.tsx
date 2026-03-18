import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, TrendingUp, Trophy, Calendar, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Magazine category data ───────────────────────────────────────────────────

const CATEGORIES = [
  {
    id:          'analysis',
    label:       'Analysis',
    icon:        TrendingUp,
    color:       '#e94560',
    description: 'Deep dives into dynasty strategy, roster construction, and league-wide trends.',
    featured:    'State of the League: March 2026',
    featuredSlug:'state-of-the-league-march-2026',
  },
  {
    id:          'preview',
    label:       'Previews',
    icon:        Zap,
    color:       '#ffd700',
    description: 'Season outlooks, draft previews, and what to expect as the year unfolds.',
    featured:    '2026 Rookie Draft Preview',
    featuredSlug:'2026-rookie-draft-preview',
  },
  {
    id:          'recap',
    label:       'Recaps',
    icon:        Trophy,
    color:       '#4ade80',
    description: 'Season recaps, playoff breakdowns, and championship post-mortems.',
    featured:    'Year in Review: The 2025 BMFFFL Season',
    featuredSlug:'year-in-review-2025',
  },
  {
    id:          'strategy',
    label:       'Strategy',
    icon:        BookOpen,
    color:       '#60a5fa',
    description: 'Buyers and sellers, roster philosophy, and dynasty theory for BMFFFL managers.',
    featured:    'Buyers and Sellers: March 2026',
    featuredSlug:'buyers-sellers-2026',
  },
] as const;

// ─── Featured long-form articles ──────────────────────────────────────────────

const LONG_FORM = [
  {
    slug:        'owner-evolution-bmfffl',
    title:       'How Every BMFFFL Owner Has Evolved Over Six Seasons',
    subtitle:    'From Cogdeill11\'s 2020 dynasty to MLSchools12\'s back-to-back titles — six years of adaptation, decline, and resurgence.',
    readTime:    '12 min',
    tag:         'Long Read',
  },
  {
    slug:        'best-moves-bmfffl-history',
    title:       'The Best Moves in BMFFFL History',
    subtitle:    'The trades, waiver adds, and draft selections that shaped six seasons of dynasty football.',
    readTime:    '8 min',
    tag:         'Analysis',
  },
  {
    slug:        '6-seasons-what-we-learned',
    title:       '6 Seasons of Data: What We\'ve Learned About Winning in BMFFFL',
    subtitle:    'Pattern analysis across all 83 regular-season weeks: what separates champions from also-rans.',
    readTime:    '10 min',
    tag:         'Data',
  },
  {
    slug:        'bmfffl-analytics-manifesto',
    title:       'The BMFFFL Analytics Manifesto',
    subtitle:    'How we think about dynasty value, positional scarcity, and long-term roster construction.',
    readTime:    '7 min',
    tag:         'Philosophy',
  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function MagazinePage() {
  return (
    <>
      <Head>
        <title>BMFFFL Magazine — Editorial Coverage</title>
        <meta
          name="description"
          content="BMFFFL editorial content: long-form analysis, season recaps, dynasty strategy, and league coverage since 2020."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">
              BMFFFL Magazine
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Editorial Coverage
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Long-form analysis, season recaps, dynasty strategy, and everything you need
            to dominate the BMFFFL.
          </p>
        </div>
      </section>

      {/* ── Category grid ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(({ id, label, icon: Icon, color, description, featured, featuredSlug }) => (
              <div
                key={id}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 hover:border-[#3d5a7a] transition-colors duration-150"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
                </div>
                <h3 className="font-black text-white text-lg mb-1">{label}</h3>
                <p className="text-slate-400 text-xs mb-3 leading-relaxed">{description}</p>
                <Link
                  href={`/articles/${featuredSlug}`}
                  className="text-xs font-medium hover:underline transition-colors duration-150"
                  style={{ color }}
                >
                  Latest: {featured}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Long-form features ────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">Featured Long Reads</h2>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm text-[#ffd700] hover:text-[#fff0a0] transition-colors duration-150 font-medium"
            >
              All Articles
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {LONG_FORM.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className={cn(
                  'block bg-[#16213e] border border-[#2d4a66] rounded-xl p-6',
                  'hover:border-[#ffd700]/40 transition-colors duration-150 group'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700] bg-[#ffd700]/10 px-2 py-0.5 rounded">
                    {article.tag}
                  </span>
                  <span className="text-xs text-slate-500">{article.readTime} read</span>
                </div>
                <h3 className="font-black text-white text-lg leading-snug mb-2 group-hover:text-[#ffd700] transition-colors duration-150">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{article.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-6">2026 Season Coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/articles/2026-season-preview', label: '2026 Season Preview', sub: 'Who wins it all?' },
              { href: '/season/rookie-draft-2026', label: '2026 Rookie Draft Hub', sub: 'Full draft guide' },
              { href: '/articles/2026-rookie-draft-preview', label: 'Rookie Draft Preview', sub: 'Class breakdown' },
            ].map(({ href, label, sub }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl',
                  'bg-[#16213e] border border-[#2d4a66]',
                  'hover:border-[#e94560]/50 group transition-colors duration-150'
                )}
              >
                <div>
                  <div className="font-semibold text-white text-sm group-hover:text-[#e94560] transition-colors duration-150">
                    {label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#e94560] transition-colors duration-150" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Calendar CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Calendar className="w-5 h-5 text-[#ffd700] mx-auto mb-2" aria-hidden="true" />
          <p className="text-slate-400 text-sm">
            Coverage continues through the 2026 season. Next: NFL Draft coverage (April 2026) → Rookie Draft guide (June 2026).
          </p>
        </div>
      </section>
    </>
  );
}
