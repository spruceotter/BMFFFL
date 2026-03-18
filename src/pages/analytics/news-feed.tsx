import { useState } from 'react';
import Head from 'next/head';
import { Newspaper, ExternalLink, AlertTriangle, TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'ALL' | 'BREAKING' | 'OFFSEASON' | 'BMFFFL';

type ImpactLevel =
  | 'MAJOR_BUY'
  | 'BUY'
  | 'HOLD'
  | 'MONITOR'
  | 'SELL'
  | 'CUT'
  | 'STABLE'
  | 'CORE'
  | 'SELL_ONE';

interface NewsItem {
  id: string;
  headline: string;
  date: string;
  source: string;
  category: 'BREAKING' | 'OFFSEASON' | 'BMFFFL';
  impact: ImpactLevel;
  context: string;
  player?: string;
  owner?: string;
}

interface ExternalSource {
  name: string;
  description: string;
  url: string;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NEWS_ITEMS: NewsItem[] = [
  // Breaking News
  {
    id: 'bn-1',
    headline: 'Combine Week: Tetairoa McMillan runs 4.39 40-yard dash, solidifying status as top WR prospect',
    date: 'March 3, 2026',
    source: 'NFL Combine',
    category: 'BREAKING',
    impact: 'BUY',
    context:
      'McMillan\'s elite athleticism confirms what dynasty managers suspected — he\'s the clear WR1 in this class. Expect top-10 pick range and immediate dynasty value upon landing spot confirmation.',
    player: 'Tetairoa McMillan',
  },
  {
    id: 'bn-2',
    headline: 'Ashton Jeanty declares for 2026 NFL Draft — Boise State RB projects as top-5 pick',
    date: 'February 20, 2026',
    source: 'ESPN',
    category: 'BREAKING',
    impact: 'MAJOR_BUY',
    context:
      'The most dominant college back in recent memory is heading to the NFL. Jeanty\'s vision, explosiveness, and contact balance give him legitimate RB1 upside in dynasty leagues regardless of landing spot.',
    player: 'Ashton Jeanty',
  },
  {
    id: 'bn-3',
    headline: 'Lamar Jackson signs 5-year extension with Baltimore Ravens',
    date: 'February 28, 2026',
    source: 'NFL Network',
    category: 'BREAKING',
    impact: 'STABLE',
    context:
      'Jackson remains locked in Baltimore through his prime years. Dynasty managers holding Lamar have franchise-level stability at QB — no concern about landing spot or motivation.',
    player: 'Lamar Jackson',
  },
  {
    id: 'bn-4',
    headline: 'Jayden Daniels named Washington Commanders franchise QB for 2026+',
    date: 'March 1, 2026',
    source: 'Washington Post',
    category: 'BREAKING',
    impact: 'BUY',
    context:
      'The Commanders are officially building around Daniels for the long haul. His rushing upside gives him a sky-high ceiling in dynasty leagues — the buy window may already be closing.',
    player: 'Jayden Daniels',
  },
  {
    id: 'bn-5',
    headline: 'Tony Pollard released by Tennessee Titans',
    date: 'February 15, 2026',
    source: 'NFL Network',
    category: 'BREAKING',
    impact: 'CUT',
    context:
      'Pollard\'s tenure in Tennessee ends with a whimper. At 28 with declining production and no guaranteed role, his dynasty value is severely diminished. Cut or drop in most dynasty formats.',
    player: 'Tony Pollard',
  },
  {
    id: 'bn-6',
    headline: 'Davante Adams restructures contract with Raiders for reduced role',
    date: 'February 22, 2026',
    source: 'Rotowire',
    category: 'BREAKING',
    impact: 'SELL',
    context:
      'A reduced-role restructure at age 33 is the writing on the wall for Adams in dynasty. His target share is unlikely to recover. Sell into any remaining name value before the decline becomes undeniable.',
    player: 'Davante Adams',
  },
  {
    id: 'bn-7',
    headline: 'Breece Hall expected to be healthy for 2026 after managing knee',
    date: 'March 5, 2026',
    source: 'NY Jets Official',
    category: 'BREAKING',
    impact: 'HOLD',
    context:
      'Hall\'s health report is encouraging — the knee has been managed conservatively and he is on track for a full 2026 campaign. Dynasty managers should hold and monitor camp reports.',
    player: 'Breece Hall',
  },
  {
    id: 'bn-8',
    headline: 'CeeDee Lamb\'s contract extension talks ongoing with Dallas Cowboys',
    date: 'March 8, 2026',
    source: 'The Athletic',
    category: 'BREAKING',
    impact: 'MONITOR',
    context:
      'Extension talks are progressing but no deal is imminent. Lamb\'s dynasty value is ceiling-locked in Dallas regardless — monitor the outcome but do not panic-sell a top-3 dynasty WR over contract noise.',
    player: 'CeeDee Lamb',
  },
  // Offseason Moves
  {
    id: 'os-1',
    headline: 'Zach Moss signs with Cincinnati Bengals — potential RB2 for 2026',
    date: 'March 10, 2026',
    source: 'NFL Transaction Wire',
    category: 'OFFSEASON',
    impact: 'MONITOR',
    context:
      'Moss joins a Bengals offense that needs a reliable ground game complement to Joe Mixon. His role remains unclear but the opportunity is there — watch preseason reps before committing.',
    player: 'Zach Moss',
  },
  {
    id: 'os-2',
    headline: 'AJ Brown requests trade from Philadelphia Eagles — dynasty implications massive',
    date: 'March 12, 2026',
    source: 'ESPN',
    category: 'OFFSEASON',
    impact: 'BUY',
    context:
      'Brown\'s trade request is a seismic dynasty event. Wherever he lands becomes an instant WR1 target-share windfall. Buy the destination aggressively once his new team is confirmed.',
    player: 'AJ Brown',
  },
  {
    id: 'os-3',
    headline: 'Stefon Diggs released by New England Patriots',
    date: 'March 6, 2026',
    source: 'NFL Network',
    category: 'OFFSEASON',
    impact: 'SELL',
    context:
      'At 32, Diggs is now a free agent with no guaranteed opportunity. His dynasty value is near zero — sell or cut unless he lands somewhere with a clear path to a featured role.',
    player: 'Stefon Diggs',
  },
  {
    id: 'os-4',
    headline: 'Tyreek Hill rumored to be available for trade',
    date: 'March 11, 2026',
    source: 'PFF',
    category: 'OFFSEASON',
    impact: 'SELL',
    context:
      'Trade rumors around Hill are a red flag for dynasty managers. Age 32, potential team in flux, and declining volume in Miami — sell into the name value before the trade confirms a worse situation.',
    player: 'Tyreek Hill',
  },
  // BMFFFL Alerts
  {
    id: 'bm-1',
    headline: 'JuicyBussy\'s Bijan Robinson entering contract year — production expected to spike',
    date: 'March 2026',
    source: 'BMFFFL Intel',
    category: 'BMFFFL',
    impact: 'HOLD',
    context:
      'Robinson\'s contract year creates a powerful incentive for monster production. He will be running hard all season. JuicyBussy should resist any sell offers — the 2026 upside is real.',
    player: 'Bijan Robinson',
    owner: 'JuicyBussy',
  },
  {
    id: 'bm-2',
    headline: 'MLSchools12\'s Lamar Jackson extended — dynasty bedrock secured',
    date: 'March 2026',
    source: 'BMFFFL Intel',
    category: 'BMFFFL',
    impact: 'CORE',
    context:
      'Lamar\'s extension locks in MLSchools12\'s QB situation through the prime dynasty window. This is a cornerstone asset — build around it, don\'t touch it.',
    player: 'Lamar Jackson',
    owner: 'MLSchools12',
  },
  {
    id: 'bm-3',
    headline: 'tdtd19844 (reigning champion) has Jayden Daniels + Anthony Richardson depth — rich at QB',
    date: 'March 2026',
    source: 'BMFFFL Intel',
    category: 'BMFFFL',
    impact: 'SELL_ONE',
    context:
      'The defending champ is flush at QB with two high-upside young arms. Selling one into the QB-needy market could fund a significant roster upgrade elsewhere. Maximize the surplus.',
    owner: 'tdtd19844',
  },
  {
    id: 'bm-4',
    headline: 'Tubes94\'s Breece Hall health update positive — 2026 upside intact',
    date: 'March 2026',
    source: 'BMFFFL Intel',
    category: 'BMFFFL',
    impact: 'HOLD',
    context:
      'Hall\'s clean bill of health means Tubes94\'s RB core is intact heading into 2026. The buy window is closing — anyone targeting Hall should move soon before the price rises.',
    player: 'Breece Hall',
    owner: 'Tubes94',
  },
];

const EXTERNAL_SOURCES: ExternalSource[] = [
  {
    name: 'FantasyPros',
    description: 'Expert consensus rankings, news, and dynasty analysis',
    url: 'https://www.fantasypros.com/nfl/news/',
    color: '#3b82f6',
  },
  {
    name: 'Rotowire',
    description: 'Player news, injury reports, and depth chart analysis',
    url: 'https://www.rotowire.com/football/news.php',
    color: '#10b981',
  },
  {
    name: 'RotoWorld',
    description: 'Breaking NFL news and fantasy impact analysis',
    url: 'https://www.nbcsports.com/fantasy/football/news',
    color: '#f59e0b',
  },
  {
    name: 'PFF Dynasty',
    description: 'Pro Football Focus dynasty rankings and grades',
    url: 'https://www.pff.com/fantasy/rankings/dynasty',
    color: '#a855f7',
  },
  {
    name: 'Dynasty Nerds',
    description: 'Dynasty-specific analysis and prospect profiles',
    url: 'https://www.dynastynerds.com',
    color: '#ef4444',
  },
  {
    name: 'Sleeper',
    description: 'Live BMFFFL league activity and waiver wire',
    url: 'https://sleeper.app',
    color: '#ffd700',
  },
];

// ─── Impact badge config ───────────────────────────────────────────────────────

const IMPACT_CONFIG: Record<
  ImpactLevel,
  { label: string; bg: string; text: string; border: string; icon: 'up' | 'down' | 'flat' }
> = {
  MAJOR_BUY: {
    label: '↑↑↑ MAJOR BUY',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    icon: 'up',
  },
  BUY: {
    label: '↑↑ BUY',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: 'up',
  },
  HOLD: {
    label: '↑ HOLD',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    icon: 'flat',
  },
  MONITOR: {
    label: '↓ MONITOR',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: 'flat',
  },
  SELL: {
    label: '↓↓ SELL',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    icon: 'down',
  },
  CUT: {
    label: '↓↓↓ CUT',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/40',
    icon: 'down',
  },
  STABLE: {
    label: '— STABLE',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    icon: 'flat',
  },
  CORE: {
    label: '★ CORE',
    bg: 'bg-[#ffd700]/10',
    text: 'text-[#ffd700]',
    border: 'border-[#ffd700]/30',
    icon: 'up',
  },
  SELL_ONE: {
    label: '↓ SELL ONE',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: 'down',
  },
};

const CATEGORY_CONFIG: Record<
  'BREAKING' | 'OFFSEASON' | 'BMFFFL',
  { label: string; bg: string; text: string; border: string }
> = {
  BREAKING: {
    label: 'Breaking News',
    bg: 'bg-[#e94560]/10',
    text: 'text-[#e94560]',
    border: 'border-[#e94560]/30',
  },
  OFFSEASON: {
    label: 'Offseason Move',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  BMFFFL: {
    label: 'BMFFFL Alert',
    bg: 'bg-[#ffd700]/10',
    text: 'text-[#ffd700]',
    border: 'border-[#ffd700]/30',
  },
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function ImpactBadge({ impact }: { impact: ImpactLevel }) {
  const cfg = IMPACT_CONFIG[impact];
  const Icon =
    cfg.icon === 'up' ? TrendingUp : cfg.icon === 'down' ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border',
        cfg.bg,
        cfg.text,
        cfg.border
      )}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: NewsItem['category'] }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest border',
        cfg.bg,
        cfg.text,
        cfg.border
      )}
    >
      {cfg.label}
    </span>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 hover:border-[#3a5f80] transition-colors duration-150 flex flex-col gap-3">
      {/* Top row: category + impact */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={item.category} />
        <ImpactBadge impact={item.impact} />
      </div>

      {/* Headline */}
      <h3 className="text-base font-bold text-white leading-snug">
        {item.headline}
      </h3>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{item.date}</span>
        <span className="text-slate-700">·</span>
        <span className="font-medium text-slate-400">{item.source}</span>
        {item.player && (
          <>
            <span className="text-slate-700">·</span>
            <span className="px-2 py-0.5 rounded bg-[#0d1b2a] border border-[#2d4a66] text-[#ffd700] font-semibold">
              {item.player}
            </span>
          </>
        )}
        {item.owner && (
          <>
            <span className="text-slate-700">·</span>
            <span className="px-2 py-0.5 rounded bg-[#1a1a2e] border border-[#2d4a66] text-sky-400 font-semibold">
              {item.owner}
            </span>
          </>
        )}
      </div>

      {/* Context */}
      <p className="text-sm text-slate-400 leading-relaxed">{item.context}</p>
    </article>
  );
}

function FilterButton({
  tab,
  active,
  count,
  onClick,
}: {
  tab: FilterTab;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const LABELS: Record<FilterTab, string> = {
    ALL: 'All',
    BREAKING: 'Breaking',
    OFFSEASON: 'Offseason Moves',
    BMFFFL: 'BMFFFL Alerts',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60',
        active
          ? 'bg-[#ffd700] text-[#0d1b2a] shadow-md shadow-[#ffd700]/20'
          : 'bg-[#16213e] text-slate-400 border border-[#2d4a66] hover:text-white hover:border-[#3a5f80]'
      )}
      aria-pressed={active}
    >
      {LABELS[tab]}
      <span
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold',
          active ? 'bg-[#0d1b2a]/30 text-[#0d1b2a]' : 'bg-[#0d1b2a] text-slate-500'
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewsFeedPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const filteredItems =
    activeTab === 'ALL'
      ? NEWS_ITEMS
      : NEWS_ITEMS.filter((item) => item.category === activeTab);

  const tabCounts: Record<FilterTab, number> = {
    ALL: NEWS_ITEMS.length,
    BREAKING: NEWS_ITEMS.filter((i) => i.category === 'BREAKING').length,
    OFFSEASON: NEWS_ITEMS.filter((i) => i.category === 'OFFSEASON').length,
    BMFFFL: NEWS_ITEMS.filter((i) => i.category === 'BMFFFL').length,
  };

  const TABS: FilterTab[] = ['ALL', 'BREAKING', 'OFFSEASON', 'BMFFFL'];

  return (
    <>
      <Head>
        <title>News Feed — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Fantasy-relevant NFL news and dynasty alerts for BMFFFL managers. March 2026 offseason coverage including combine results, free agency, and BMFFFL-specific roster alerts."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Newspaper className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            BMFFFL News Feed
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            Fantasy-relevant NFL news for dynasty managers — March 2026. Curated offseason
            coverage including combine results, free agency moves, and BMFFFL-specific roster alerts.
          </p>
        </header>

        {/* ── Filter tabs ─────────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="group"
          aria-label="Filter news by category"
        >
          {TABS.map((tab) => (
            <FilterButton
              key={tab}
              tab={tab}
              active={activeTab === tab}
              count={tabCounts[tab]}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>

        {/* ── News grid ───────────────────────────────────────────────────── */}
        <section aria-label="News items" aria-live="polite" aria-atomic="false">
          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#2d4a66] bg-[#0d1b2a] p-12 text-center">
              <p className="text-slate-500 text-sm">No items in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* ── External sources ────────────────────────────────────────────── */}
        <section
          className="mt-12 rounded-xl border border-[#2d4a66] bg-[#16213e] p-6"
          aria-labelledby="external-sources-heading"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
              <ExternalLink className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <h2 id="external-sources-heading" className="text-base font-bold text-white">
              External Sources
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXTERNAL_SOURCES.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-4 py-3 hover:border-[#3a5f80] transition-colors duration-150"
              >
                <span
                  className="mt-0.5 shrink-0 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: source.color }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-[#ffd700] transition-colors duration-100 leading-tight">
                    {source.name}
                    <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </p>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">
                    {source.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── BMFFFL Alerts callout ────────────────────────────────────────── */}
        <section
          className="mt-6 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-5"
          aria-labelledby="bmfffl-alerts-heading"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5 p-2 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20">
              <Bell className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="bmfffl-alerts-heading" className="text-sm font-bold text-[#ffd700] mb-1">
                BMFFFL-Specific Alerts Active
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Switch to the <strong className="text-white">BMFFFL Alerts</strong> tab to see news items
                directly relevant to current BMFFFL roster situations — buy windows, sell signals,
                and dynasty opportunities specific to league owners.
              </p>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ──────────────────────────────────────────────────── */}
        <div
          className="mt-8 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-5 py-4 flex items-start gap-3"
          role="note"
          aria-label="Disclaimer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Disclaimer:</span> News items are
              curated and may not reflect the most current information. Check Sleeper for live
              league activity.
            </p>
            <p className="text-xs text-slate-500 italic leading-relaxed">
              Your Commissioner monitors the NFL&rsquo;s offseason machinations with appropriate
              vigilance. One must stay informed to remain competitive. ~Love, Bimfle.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
