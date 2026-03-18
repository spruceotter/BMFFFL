import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, LayoutDashboard, Clock, Wrench, FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Search Index ─────────────────────────────────────────────────────────────

interface SearchItem {
  title: string;
  url: string;
  description: string;
  category: 'Pages' | 'Analytics' | 'History' | 'Tools';
}

const SEARCH_INDEX: SearchItem[] = [
  // Pages
  { title: 'Home',             url: '/',                           description: 'BMFFFL dynasty fantasy football league home page',                            category: 'Pages' },
  { title: 'Owners',           url: '/owners',                     description: 'All 12 BMFFFL owners and career records',                                     category: 'Pages' },
  { title: 'MLSchools12',      url: '/owners/mlschools12',         description: 'MLSchools12 owner profile two-time champion Murder Boners',                   category: 'Pages' },
  { title: 'tdtd19844',        url: '/owners/tdtd19844',           description: 'tdtd19844 owner profile 2025 champion reigning',                              category: 'Pages' },
  { title: 'JuicyBussy',       url: '/owners/juicybussy',          description: 'JuicyBussy owner profile 2023 champion all-time scoring record',              category: 'Pages' },
  { title: 'Records',          url: '/records',                    description: 'All-time BMFFFL records scoring championship history',                        category: 'Pages' },
  { title: 'League Rules',     url: '/rules',                      description: 'Official BMFFFL league rules scoring waiver draft',                           category: 'Pages' },
  { title: 'Rules Explainer',  url: '/rules/explainer',            description: 'Interactive rules guide searchable accordion Bimfle',                         category: 'Pages' },
  { title: 'Constitution',     url: '/constitution',               description: 'BMFFFL league constitution official documents',                               category: 'Pages' },
  { title: 'Trades',           url: '/trades',                     description: 'Trade history all trades with grades and analysis',                           category: 'Pages' },
  { title: 'Drafts',           url: '/drafts',                     description: 'Rookie draft history all picks 2020 to 2025',                                 category: 'Pages' },
  { title: 'About BMFFFL',     url: '/about',                      description: 'About the Best Motherfucking Fantasy Football League',                        category: 'Pages' },
  { title: 'Bimfle',           url: '/bimfle',                     description: 'Bimfle AI commissioner Victorian formal chatbot assistant',                   category: 'Pages' },
  { title: 'Commish Speaks',   url: '/articles/commish-speaks',    description: 'Commissioner dispatches Bimfle official announcements',                      category: 'Pages' },
  { title: '2026 Rookie Class', url: '/analytics/rookie-prospects', description: '2026 NFL rookie draft dynasty prospects values rankings',                   category: 'Pages' },

  // Analytics
  { title: 'Analytics Hub',          url: '/analytics',                          description: 'Analytics dashboard statistics dynasty metrics',                         category: 'Analytics' },
  { title: 'Power Rankings',         url: '/analytics/power-rankings',           description: 'Current BMFFFL dynasty power rankings Bimfle',                          category: 'Analytics' },
  { title: 'Dynasty Power Index',    url: '/analytics/dynasty-power-index',      description: 'Dynasty power index DPI composite metric team strength',               category: 'Analytics' },
  { title: 'Trade Value Chart',      url: '/analytics/trade-value-chart',        description: 'Player dynasty trade values QB RB WR TE picks',                        category: 'Analytics' },
  { title: 'Trade Evaluator',        url: '/analytics/trade-evaluator',          description: 'Interactive trade evaluator winner loser verdict',                      category: 'Analytics' },
  { title: 'Keeper Calculator',      url: '/analytics/keeper-calculator',        description: 'Dynasty keep stash hold sell analysis players',                         category: 'Analytics' },
  { title: 'Playoff Simulator',      url: '/analytics/playoff-simulator',        description: '2025 playoff bracket what-if simulator interactive',                    category: 'Analytics' },
  { title: 'Start Sit Analyzer',     url: '/analytics/start-sit',                description: 'Weekly start sit recommendations optimal lineup',                       category: 'Analytics' },
  { title: 'Grudge Match',           url: '/analytics/grudge-match',             description: 'Head to head H2H calculator rivalry two managers',                      category: 'Analytics' },
  { title: 'Dynasty Rankings',       url: '/analytics/dynasty-rankings',         description: 'Dynasty rankings tier list all 12 BMFFFL managers',                    category: 'Analytics' },
  { title: 'Roster Grades',          url: '/analytics/roster-grades',            description: 'Roster construction grades A-F dynasty evaluation',                     category: 'Analytics' },
  { title: 'Draft Grades',           url: '/analytics/draft-grades',             description: 'Historical rookie draft letter grades GPA all seasons',                 category: 'Analytics' },
  { title: 'Manager Efficiency',     url: '/analytics/manager-efficiency',       description: 'Lineup efficiency optimal percentage score management',                  category: 'Analytics' },
  { title: 'Points Against',         url: '/analytics/points-against',           description: 'Points against schedule difficulty luck rating',                        category: 'Analytics' },
  { title: 'Manager Trends',         url: '/analytics/manager-trends',           description: 'Season over season win trends dynasty trajectory',                      category: 'Analytics' },
  { title: 'Boom or Bust',           url: '/analytics/boom-or-bust',             description: 'Scoring variance explosiveness consistency profiles',                    category: 'Analytics' },
  { title: 'Schedule Difficulty',    url: '/analytics/schedule-difficulty',      description: 'Schedule difficulty unlucky lucky expected wins',                        category: 'Analytics' },
  { title: 'Breakout Predictor',     url: '/analytics/breakout-predictor',       description: '2026 breakout candidates young players dynasty',                        category: 'Analytics' },
  { title: 'Championship Window',    url: '/analytics/championship-window',      description: 'Championship window timeline dynasty phase open closing',              category: 'Analytics' },
  { title: 'Age Curve Analysis',     url: '/analytics/age-curve',                description: 'Roster age dynasty phase opening peak closing rebuilding',              category: 'Analytics' },
  { title: 'Biggest Trades',         url: '/analytics/biggest-trades',           description: 'Biggest most impactful trades league history Bimfle verdict',           category: 'Analytics' },
  { title: 'Rivalry Week',           url: '/analytics/rivalry-week',             description: 'Named rivalries H2H history feuds BMFFFL',                             category: 'Analytics' },
  { title: 'FAAB History',           url: '/analytics/faab-history',             description: 'FAAB bid history auction tracker budget management',                    category: 'Analytics' },
  { title: 'Waiver Priority',        url: '/analytics/waiver-priority',          description: 'Waiver wire priority order FAAB strategy guide',                        category: 'Analytics' },

  // History
  { title: 'Season Recap',       url: '/history/season-recap',       description: 'Season by season recap timeline 2020 2025 champions',                    category: 'History' },
  { title: 'Annual Awards',      url: '/history/awards',             description: 'BMFFFL annual awards champion MVP story of the year',                    category: 'History' },
  { title: 'Playoff Brackets',   url: '/history/playoff-brackets',   description: 'All 6 playoff brackets interactive history champions',                  category: 'History' },
  { title: 'Shame Board',        url: '/history/shame-board',        description: 'Shame board bottom dwellers moodie bowl losers',                        category: 'History' },
  { title: 'Team Names History', url: '/history/team-names',         description: 'All team names by season complete history',                             category: 'History' },

  // Tools
  { title: 'Team Builder',       url: '/analytics/team-builder',     description: 'Dynasty team builder simulator build roster rate it',                  category: 'Tools' },
];

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: Array<{
  name: SearchItem['category'];
  icon: React.ElementType;
  color: string;
  border: string;
  badge: string;
}> = [
  { name: 'Pages',     icon: FileText,       color: 'text-blue-400',   border: 'border-blue-700/40',   badge: 'bg-blue-900/40 text-blue-300 border-blue-700/50'   },
  { name: 'Analytics', icon: LayoutDashboard, color: 'text-[#ffd700]',  border: 'border-yellow-700/40', badge: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50' },
  { name: 'History',   icon: Clock,          color: 'text-purple-400', border: 'border-purple-700/40', badge: 'bg-purple-900/40 text-purple-300 border-purple-700/50' },
  { name: 'Tools',     icon: Wrench,         color: 'text-teal-400',   border: 'border-teal-700/40',   badge: 'bg-teal-900/40 text-teal-300 border-teal-700/50'   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX;
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<SearchItem['category'], SearchItem[]> = {
      Pages: [],
      Analytics: [],
      History: [],
      Tools: [],
    };
    for (const item of results) {
      map[item.category].push(item);
    }
    return map;
  }, [results]);

  const hasQuery  = query.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <>
      <Head>
        <title>Site Search — BMFFFL</title>
        <meta
          name="description"
          content="Search every page, tool, and resource on the BMFFFL dynasty fantasy football website."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Site Search</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Site Search
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Find{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffffff 60%, #e94560 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Anything
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            Search every page, tool, and feature across the{' '}
            <strong className="text-white">BMFFFL</strong> website.
          </p>

          {/* ── Search input ── */}
          <div className="relative max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, analytics, owners, tools…"
              autoFocus
              className={cn(
                'w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-slate-500',
                'bg-[#16213e] border border-[#2d4a66]',
                'focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50',
                'text-base transition-colors duration-150'
              )}
              aria-label="Search the BMFFFL website"
            />
          </div>

          {/* ── Result count ── */}
          {hasQuery && (
            <p className="mt-3 text-sm text-slate-400" aria-live="polite" aria-atomic="true">
              {hasResults
                ? <><span className="text-white font-semibold">{results.length}</span> result{results.length !== 1 ? 's' : ''} found</>
                : null}
            </p>
          )}
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Empty state */}
        {hasQuery && !hasResults && (
          <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] px-6 py-12 text-center">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-300 text-lg font-semibold mb-1">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-slate-500 text-sm">
              Try a player name, owner handle, or feature name — e.g. &ldquo;power rankings&rdquo; or &ldquo;JuicyBussy&rdquo;.
            </p>
          </div>
        )}

        {/* Grouped results */}
        {hasResults && (
          <div className="space-y-10">
            {CATEGORIES.map(({ name, icon: Icon, color, badge }) => {
              const items = grouped[name];
              if (items.length === 0) return null;
              return (
                <section key={name} aria-labelledby={`cat-${name}`}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={cn('w-4 h-4', color)} aria-hidden="true" />
                    <h2 id={`cat-${name}`} className={cn('text-sm font-bold uppercase tracking-widest', color)}>
                      {name}
                    </h2>
                    <span className={cn('ml-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border', badge)}>
                      {items.length}
                    </span>
                  </div>

                  {/* Item list */}
                  <ul className="rounded-xl border border-[#2d4a66] overflow-hidden divide-y divide-[#2d4a66]">
                    {items.map((item) => (
                      <li key={item.url}>
                        <Link
                          href={item.url}
                          className="flex items-start justify-between gap-4 px-5 py-4 bg-[#16213e] hover:bg-[#1a2d42] transition-colors duration-100 group"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-[#ffd700] transition-colors duration-100 truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{item.url}</p>
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                          <ArrowRight
                            className="w-4 h-4 text-slate-600 group-hover:text-[#ffd700] flex-shrink-0 mt-0.5 transition-colors duration-100"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        {/* ── Bimfle tip ─────────────────────────────────────────────────────── */}
        <aside
          className="mt-12 rounded-xl bg-[#16213e] border border-[#2d4a66] px-6 py-5 flex items-start gap-4"
          aria-label="Tip from Bimfle"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center">
            <span className="text-[#ffd700] text-base leading-none" aria-hidden="true">B</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-[#ffd700]">Bimfle&apos;s Counsel: </span>
            Your Commissioner recommends beginning with the{' '}
            <Link
              href="/analytics"
              className="text-[#ffd700] underline underline-offset-2 hover:text-white transition-colors duration-150"
            >
              Analytics Hub
            </Link>{' '}
            for a comprehensive overview.{' '}
            <em className="text-slate-400">~Love, Bimfle.</em>
          </p>
        </aside>
      </div>
    </>
  );
}
