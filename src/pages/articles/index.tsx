import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import type { GetStaticProps } from 'next';
import { Trophy, TrendingUp, Tag, BookOpen, Star, Filter } from 'lucide-react';
import { cn } from '@/lib/cn';
import ArticleCard from '@/components/articles/ArticleCard';

// ─── Types ────────────────────────────────────────────────────────────────────

// Extended category type that includes history and reference in addition to
// the core ArticleCategory from schema (analysis | preview | recap | rankings | strategy)
type ExtendedCategory =
  | 'analysis'
  | 'preview'
  | 'strategy'
  | 'history'
  | 'reference'
  | 'recap'
  | 'rankings';

interface ArticleEntry {
  slug: string;
  title: string;
  category: ExtendedCategory;
  publishedAt: string;
  author: string;
  excerpt: string;
  tags: string[];
}

// ─── Article Data ─────────────────────────────────────────────────────────────

const ARTICLES: ArticleEntry[] = [
  {
    slug: 'state-of-the-league-march-2026',
    title: 'State of the League: March 2026',
    category: 'analysis',
    publishedAt: '2026-03-15',
    author: 'Flint',
    excerpt: 'Six seasons in, the landscape has never been more competitive. A full breakdown of where every owner stands.',
    tags: ['2026', 'league'],
  },
  {
    slug: '2026-offseason-outlook',
    title: '2026 Offseason Outlook',
    category: 'preview',
    publishedAt: '2026-03-14',
    author: 'Flint',
    excerpt: 'The offseason moves that will define 2026: free agency, the rookie draft, and who needs to win now.',
    tags: ['2026', 'offseason'],
  },
  {
    slug: '2026-rookie-draft-preview',
    title: '2026 Rookie Draft Preview',
    category: 'preview',
    publishedAt: '2026-03-12',
    author: 'Flint',
    excerpt: 'The incoming class ranked from 1 to 30. Which dynasty teams are best positioned to capitalize?',
    tags: ['draft', '2026'],
  },
  {
    slug: '2026-free-agency-dynasty-impact',
    title: 'Free Agency 2026: Dynasty Impact',
    category: 'analysis',
    publishedAt: '2026-03-10',
    author: 'Flint',
    excerpt: 'Taylor, Walker, and the big moves reshaping the NFL landscape for dynasty managers.',
    tags: ['free agency', '2026'],
  },
  {
    slug: 'buyers-sellers-2026',
    title: 'Buyers and Sellers: March 2026',
    category: 'strategy',
    publishedAt: '2026-03-08',
    author: 'Flint',
    excerpt: 'Who to buy, who to sell, and who to hold in the current dynasty market.',
    tags: ['trade', '2026'],
  },
  {
    slug: '2025-season-breakouts',
    title: '2025 Season Breakouts',
    category: 'analysis',
    publishedAt: '2026-02-15',
    author: 'Flint',
    excerpt: 'The 2025 rookie class proved the skeptics wrong. McMillan, Loveland, and more.',
    tags: ['2025', 'rookies'],
  },
  {
    slug: '2025-season-busts',
    title: 'March 2026 Sell Candidates',
    category: 'strategy',
    publishedAt: '2026-02-10',
    author: 'Flint',
    excerpt: 'Which dynasty assets are at peak value right now? Richardson, LaPorta, and others to move.',
    tags: ['trade', 'sell'],
  },
  {
    slug: 'bmfffl-all-time-records',
    title: 'BMFFFL All-Time Records',
    category: 'history',
    publishedAt: '2026-01-15',
    author: 'Flint',
    excerpt: 'Every record in league history — highest score, most wins, biggest blowout, and more.',
    tags: ['records', 'history'],
  },
  {
    slug: 'champion-timeline-2020-2025',
    title: 'Champion Timeline: 2020–2025',
    category: 'history',
    publishedAt: '2026-01-10',
    author: 'Flint',
    excerpt: 'Six years, six different champions. How each team won and what it meant.',
    tags: ['history', 'champions'],
  },
  {
    slug: '2026-rookie-draft-strategy-guide',
    title: '2026 Rookie Draft Strategy Guide',
    category: 'strategy',
    publishedAt: '2026-03-01',
    author: 'Flint',
    excerpt: 'How to approach the 2026 linear rookie draft: positional strategy, tier breaks, and pick values.',
    tags: ['draft', 'strategy'],
  },
  {
    slug: '2026-draft-rb-class',
    title: '2026 Draft RB Class',
    category: 'preview',
    publishedAt: '2026-02-28',
    author: 'Flint',
    excerpt: 'Running backs in the 2026 NFL Draft: who to target and who to avoid.',
    tags: ['RB', 'draft'],
  },
  {
    slug: '2026-draft-wr-class',
    title: '2026 Draft WR Class',
    category: 'preview',
    publishedAt: '2026-02-26',
    author: 'Flint',
    excerpt: 'The wide receiver class — McMillan leads a historically deep group.',
    tags: ['WR', 'draft'],
  },
  {
    slug: '2026-draft-te-class',
    title: '2026 Draft TE Class',
    category: 'preview',
    publishedAt: '2026-02-24',
    author: 'Flint',
    excerpt: 'Tight end class preview including combine standout Stowers.',
    tags: ['TE', 'draft'],
  },
  {
    slug: '2026-owners-meeting-preview',
    title: '2026 Owners Meeting Preview',
    category: 'analysis',
    publishedAt: '2026-03-05',
    author: 'Flint',
    excerpt: 'What to expect when the league gathers in May — rule proposals and offseason agenda.',
    tags: ['league', '2026'],
  },
  {
    slug: 'bmfffl-league-rules',
    title: 'BMFFFL League Rules',
    category: 'reference',
    publishedAt: '2026-01-01',
    author: 'Flint',
    excerpt: 'The official rules and scoring settings for the 2026 season.',
    tags: ['rules', 'reference'],
  },
  // Phase F + additional articles — March 2026
  { slug: 'year-in-review-2025',           title: 'Year in Review: The 2025 BMFFFL Season',                    category: 'recap',     publishedAt: '2026-03-16', author: 'Flint', excerpt: 'MLSchools12\'s 13-1 run, tdtd19844\'s underdog championship, and the drama that defined 2025.',      tags: ['2025', 'recap'] },
  { slug: '2026-season-preview',           title: '2026 Season Preview: Who Wins It All?',                     category: 'preview',   publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Power rankings entering 2026, key storylines, and predictions for who takes the title.',             tags: ['2026', 'preview'] },
  { slug: 'best-moves-bmfffl-history',     title: 'The Best Moves in BMFFFL History',                          category: 'history',   publishedAt: '2026-03-16', author: 'Flint', excerpt: 'The trades and picks that shaped six seasons of dynasty football.',                                   tags: ['history', 'trades'] },
  { slug: 'worst-trades-bmfffl-history',   title: 'Worst Trades in BMFFFL History',                            category: 'history',   publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Five moves that looked bad in hindsight — and what they cost.',                                       tags: ['history', 'trades'] },
  { slug: 'owner-evolution-bmfffl',        title: 'How Every BMFFFL Owner Has Evolved Over Six Seasons',       category: 'analysis',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'From Cogdeill11\'s 2020 dynasty to MLSchools12\'s dominance — six years of adaptation.',              tags: ['owners', 'history'] },
  { slug: 'nfl-draft-2026-dynasty-impact', title: '2026 NFL Draft Impact on Your Dynasty Roster',              category: 'preview',   publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Which 2026 draftees matter for BMFFFL teams and how landing spots change everything.',                tags: ['2026', 'NFL-draft'] },
  { slug: '2026-rookie-draft-complete-guide', title: 'BMFFFL Rookie Draft 2026: The Complete Guide',           category: 'preview',   publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Class rankings, pick order, team needs, and draft strategy for June 2026.',                          tags: ['2026', 'rookie-draft'] },
  { slug: 'free-agency-2026-dynasty',      title: 'Free Agency 2026: What It Means for Your BMFFFL Roster',   category: 'analysis',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'NFL free agency reshapes the dynasty landscape. Here\'s what BMFFFL managers need to know.',          tags: ['2026', 'free-agency'] },
  { slug: '2026-offseason-power-rankings', title: '2026 Offseason Power Rankings',                              category: 'analysis',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Ranking all 12 BMFFFL teams entering 2026 — dynasty value and championship outlook.',                tags: ['2026', 'power-rankings'] },
  { slug: '2026-rookie-draft-order-analysis', title: 'The 2026 Rookie Draft Order: What We Know and What It Means', category: 'analysis', publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Full breakdown of the 2026 draft order, traded picks, and positional strategy.',                  tags: ['2026', 'draft-order'] },
  { slug: 'position-run-theory',           title: 'Position Run Theory in Dynasty Rookie Drafts',               category: 'strategy',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'When to join a run, when to deviate, and how to build your board around positional scarcity.',       tags: ['strategy', 'draft'] },
  { slug: 'sleeper-platform-guide',        title: 'Sleeper Platform Guide for BMFFFL Owners',                   category: 'reference', publishedAt: '2026-03-16', author: 'Flint', excerpt: 'How to navigate Sleeper — roster management, FAAB, trades, and the API.',                           tags: ['sleeper', 'platform'] },
  { slug: 'te-premium-dynasty',            title: 'TE Premium: Is a First-Round Pick Worth It?',                category: 'strategy',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Analyzing tight end value in Superflex dynasty — when to pay up and when to wait.',                  tags: ['strategy', 'TE'] },
  { slug: 'taxi-squad-strategy',           title: 'Taxi Squad Strategy: Maximizing Your Development Pipeline',  category: 'strategy',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Three free roster slots that most managers underuse. Here\'s how to get the most out of taxi.',      tags: ['strategy', 'taxi-squad'] },
  { slug: 'bmfffl-analytics-manifesto',   title: 'The BMFFFL Analytics Manifesto',                             category: 'strategy',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Six principles for dynasty success derived from six seasons of BMFFFL data.',                        tags: ['strategy', 'analytics'] },
  { slug: 'dynasty-primer-bmfffl',         title: 'Understanding Dynasty Fantasy: A BMFFFL Primer',             category: 'reference', publishedAt: '2026-03-16', author: 'Flint', excerpt: 'New to dynasty? Everything you need to know to compete in the BMFFFL.',                             tags: ['dynasty', 'beginner'] },
  { slug: '6-seasons-what-we-learned',     title: '6 Seasons of Data: What We\'ve Learned About Winning',      category: 'analysis',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Pattern analysis across 83 regular-season weeks: what separates champions from also-rans.',          tags: ['data', 'history'] },
  { slug: 'bmfffl-website-launch',         title: 'The BMFFFL Website Is Live',                                 category: 'analysis',  publishedAt: '2026-03-16', author: 'Flint', excerpt: 'Six seasons of dynasty history, analytics tools, and editorial coverage — all in one place.',          tags: ['announcement'] },
];

// The featured article (always top of the list)
const FEATURED_SLUG = 'state-of-the-league-march-2026';

// ─── Filter Config ────────────────────────────────────────────────────────────

type FilterTab = 'all' | ExtendedCategory;

interface TabConfig {
  id: FilterTab;
  label: string;
  icon?: React.FC<{ className?: string }>;
}

const FILTER_TABS: TabConfig[] = [
  { id: 'all',       label: 'All' },
  { id: 'analysis',  label: 'Analysis',  icon: TrendingUp },
  { id: 'preview',   label: 'Preview',   icon: Star },
  { id: 'strategy',  label: 'Strategy',  icon: Tag },
  { id: 'history',   label: 'History',   icon: Trophy },
  { id: 'reference', label: 'Reference', icon: BookOpen },
];

// ─── Category display config (for the featured card) ────────────────────────

const CATEGORY_CONFIG: Record<ExtendedCategory, { label: string; bg: string; text: string }> = {
  analysis:  { label: 'Analysis',  bg: 'bg-blue-900/60',    text: 'text-blue-300'   },
  preview:   { label: 'Preview',   bg: 'bg-purple-900/60',  text: 'text-purple-300' },
  recap:     { label: 'Recap',     bg: 'bg-green-900/60',   text: 'text-green-300'  },
  rankings:  { label: 'Rankings',  bg: 'bg-amber-900/60',   text: 'text-amber-300'  },
  strategy:  { label: 'Strategy',  bg: 'bg-teal-900/60',    text: 'text-teal-300'   },
  history:   { label: 'History',   bg: 'bg-orange-900/60',  text: 'text-orange-300' },
  reference: { label: 'Reference', bg: 'bg-slate-700/60',   text: 'text-slate-300'  },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Featured Article Card ────────────────────────────────────────────────────

function FeaturedArticleCard({ article }: { article: ArticleEntry }) {
  const catCfg = CATEGORY_CONFIG[article.category];

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        'group block rounded-2xl overflow-hidden',
        'bg-[#1a2d42] border-2 border-[#ffd700]/30',
        'transition-all duration-200',
        'hover:border-[#ffd700]/60 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1'
      )}
      aria-label={`Read featured article: ${article.title}`}
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-[#ffd700]" aria-hidden="true" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Featured badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-bold uppercase tracking-wider">
            <Star className="w-3 h-3" aria-hidden="true" />
            Featured
          </span>

          {/* Category badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide',
              catCfg.bg,
              catCfg.text
            )}
          >
            <Tag className="w-3 h-3" aria-hidden="true" />
            {catCfg.label}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 group-hover:text-[#ffd700] transition-colors duration-150">
          {article.title}
        </h2>

        <p className="text-slate-300 text-base leading-relaxed mb-5 max-w-2xl">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{article.author}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <span className="text-sm text-slate-500 group-hover:text-[#ffd700] transition-colors duration-150 font-semibold">
            Read article &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ArticlesIndexPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const featuredArticle = ARTICLES.find((a) => a.slug === FEATURED_SLUG);

  const filteredArticles = ARTICLES.filter((a) => {
    if (a.slug === FEATURED_SLUG) return false; // featured is shown separately
    if (activeFilter === 'all') return true;
    return a.category === activeFilter;
  });

  // If filter is active and doesn't match featured, still show it in grid too
  const showFeaturedInGrid =
    activeFilter !== 'all' &&
    featuredArticle &&
    featuredArticle.category === activeFilter;

  const gridArticles = showFeaturedInGrid
    ? [featuredArticle, ...filteredArticles]
    : filteredArticles;

  return (
    <>
      <Head>
        <title>Articles — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football articles — analysis, strategy, draft previews, and league history."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Content Hub
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            Articles
          </h1>
          <p className="text-slate-400 text-lg">
            Analysis, strategy, and history for BMFFFL
          </p>
        </header>

        {/* ── Featured article (always shown when filter = all or analysis) */}
        {featuredArticle && activeFilter === 'all' && (
          <div className="mb-10">
            <FeaturedArticleCard article={featuredArticle} />
          </div>
        )}

        {/* ── Category filter tabs ───────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter by category
            </span>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Article category filters"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150',
                    'border',
                    isActive
                      ? 'bg-[#e94560] border-[#e94560] text-white shadow-sm shadow-[#e94560]/30'
                      : 'bg-[#16213e] border-[#2d4a66] text-slate-400 hover:border-[#3a5f80] hover:text-slate-200'
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Article grid ──────────────────────────────────────────────── */}
        {gridArticles.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            role="tabpanel"
            aria-label={`Articles filtered by ${activeFilter}`}
          >
            {gridArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={{
                  slug: article.slug,
                  title: article.title,
                  author: article.author,
                  publishedAt: article.publishedAt,
                  // ArticleCard expects the core ArticleCategory type; cast for
                  // history/reference by mapping to 'analysis' for display only
                  category: (
                    article.category === 'history' || article.category === 'reference'
                      ? 'analysis'
                      : article.category
                  ) as import('@/data/schema').ArticleCategory,
                  tags: article.tags,
                  excerpt: article.excerpt,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="w-12 h-12 text-slate-700 mb-4" aria-hidden="true" />
            <p className="text-slate-500 text-lg font-semibold mb-1">No articles in this category yet</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-sm text-[#e94560] hover:underline"
            >
              Show all articles
            </button>
          </div>
        )}

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
