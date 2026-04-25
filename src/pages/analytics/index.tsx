import Head from 'next/head';
import Link from 'next/link';
import {
  BarChart2,
  Users,
  ArrowLeftRight,
  ClipboardList,
  UserSearch,
  FlaskConical,
  CheckCircle2,
  Sword,
  Trophy,
  TrendingUp,
  Newspaper,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Static League Stats Data ─────────────────────────────────────────────────

interface SeasonRow {
  season: number;
  avgScore: number;
  highScore: string;
  champion: string;
}

const SEASON_STATS: SeasonRow[] = [
  { season: 2020, avgScore: 151.2, highScore: '245.8*', champion: 'Cogdeill11' },
  { season: 2021, avgScore: 148.6, highScore: '245.8',  champion: 'MLSchools12' },
  { season: 2022, avgScore: 154.3, highScore: '218.4',  champion: 'Grandes' },
  { season: 2023, avgScore: 152.1, highScore: '224.6',  champion: 'JuicyBussy' },
  { season: 2024, avgScore: 158.9, highScore: '231.2',  champion: 'MLSchools12' },
  { season: 2025, avgScore: 161.4, highScore: '228.8',  champion: 'tdtd19844' },
];

// ─── Live Tools Config ────────────────────────────────────────────────────────

interface LiveTool {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

interface ComingSoonTool {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  plannedPhase: string;
  teaser: string[];
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
      Live
    </span>
  );
}

function ComingSoonBadge({ phase = 'Phase G' }: { phase?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560]">
      <FlaskConical className="w-3 h-3" aria-hidden="true" />
      {phase}
    </span>
  );
}

// ─── League Stats section (live data, links to individual pages) ──────────────

function LeagueStatsSection() {
  return (
    <div className="mt-5">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
        Season Snapshot
      </p>
      <div className="overflow-x-auto rounded-lg border border-[#2d4a66]">
        <table className="min-w-full text-xs" aria-label="Season stats">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">Season</th>
              <th scope="col" className="px-3 py-2 text-right text-slate-400 font-semibold uppercase tracking-wider">Avg Score</th>
              <th scope="col" className="px-3 py-2 text-right text-slate-400 font-semibold uppercase tracking-wider">High Score</th>
              <th scope="col" className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">Champion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {SEASON_STATS.map((row, idx) => {
              const isEven   = idx % 2 === 0;
              const isLatest = idx === SEASON_STATS.length - 1;
              const hasRecord = row.highScore.startsWith('245');

              return (
                <tr
                  key={row.season}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                    isLatest && 'ring-1 ring-inset ring-[#ffd700]/10'
                  )}
                >
                  <td className={cn('px-3 py-2 font-bold tabular-nums', isLatest ? 'text-[#ffd700]' : 'text-white')}>
                    {row.season}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-300 tabular-nums">
                    {row.avgScore.toFixed(1)}
                  </td>
                  <td className={cn('px-3 py-2 text-right font-mono tabular-nums font-semibold', hasRecord ? 'text-[#e94560]' : 'text-slate-300')}>
                    {row.highScore}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {row.champion}
                    {isLatest && (
                      <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] font-bold uppercase tracking-wider border border-[#ffd700]/30">
                        Reigning
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-600 leading-snug">
        * 245.8 was JuicyBussy&rsquo;s consolation game in Week 16, 2021 — highest single-game score in BMFFFL history.
      </p>
    </div>
  );
}

// ─── Live Tool Card ───────────────────────────────────────────────────────────

function LiveToolCard({ title, description, href, icon: Icon, badge }: Omit<LiveTool, 'id'>) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-[#2d4a66] bg-[#16213e] p-6 flex flex-col gap-3 hover:border-[#ffd700]/40 hover:bg-[#1a2d42] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0 group-hover:border-[#ffd700]/30 transition-colors">
            <Icon className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {badge && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700]">
              {badge}
            </span>
          )}
          <LiveBadge />
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs text-[#ffd700]/70 group-hover:text-[#ffd700] transition-colors font-medium">
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        Open Tool
      </div>
    </Link>
  );
}

// ─── Coming Soon Card ─────────────────────────────────────────────────────────

function ComingSoonCard({ title, description, icon: Icon, plannedPhase, teaser }: Omit<ComingSoonTool, 'id'>) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6 flex flex-col gap-3 opacity-80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
            <Icon className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-slate-400 leading-tight">{title}</h2>
        </div>
        <div className="shrink-0">
          <ComingSoonBadge phase={plannedPhase} />
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      <ul className="mt-1 space-y-1.5" aria-label="Planned features">
        {teaser.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#2d4a66] shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const liveTools: LiveTool[] = [
    {
      id: 'rosters',
      title: 'Dynasty Roster Values',
      description: 'Dynasty tier breakdowns and value scores for all 12 BMFFFL rosters. See who is contending vs. rebuilding.',
      href: '/analytics/rosters',
      icon: Users,
      badge: 'Phase E',
    },
    {
      id: 'owners',
      title: 'Owner Performance Dashboard',
      description: 'Season-by-season win rates, scoring averages, playoff appearances, and championship history for every manager.',
      href: '/analytics/owners',
      icon: Trophy,
      badge: 'Phase E',
    },
    {
      id: 'head-to-head',
      title: 'Head-to-Head Records',
      description: 'All-time matchup records between every pair of BMFFFL owners. Who owns who?',
      href: '/analytics/head-to-head',
      icon: Sword,
      badge: 'Phase E',
    },
    {
      id: 'mock-draft',
      title: '2026 Mock Draft Simulator',
      description: 'Simulate the 2026 BMFFFL rookie draft. Set your draft order and build mock boards for all 12 teams.',
      href: '/analytics/mock-draft',
      icon: ClipboardList,
      badge: 'Phase E',
    },
    {
      id: 'nfl-draft',
      title: '2026 NFL Draft Tracker',
      description: 'Track 2026 NFL Draft prospects with dynasty value overlays, positional rankings, and BMFFFL roster impact.',
      href: '/nfl-draft/2026',
      icon: TrendingUp,
      badge: 'Phase E',
    },
    {
      id: 'dynasty-rankings',
      title: 'Dynasty Rankings',
      description: 'March 2026 consensus dynasty rankings for the top 50 NFL players, filterable by position and BMFFFL owner.',
      href: '/analytics/dynasty-rankings',
      icon: BarChart2,
      badge: 'Phase E',
    },
    {
      id: 'free-agency',
      title: '2026 Free Agency Tracker',
      description: 'Dynasty impact analysis of key 2026 NFL free agent moves — signed, tagged, and still available.',
      href: '/analytics/free-agency',
      icon: Newspaper,
      badge: 'Phase E',
    },
    {
      id: 'trade-analyzer',
      title: 'Trade Analyzer',
      description: 'Evaluate trade proposals using dynasty value scores. Input players and picks on each side for a fair-value breakdown.',
      href: '/analytics/trade-analyzer',
      icon: ArrowLeftRight,
      badge: 'Phase E',
    },
    {
      id: 'trade-ledger',
      title: 'Trade Ledger',
      description: 'Complete chronological history of all 257+ BMFFFL trades. Filter by owner, season, and player.',
      href: '/analytics/trade-ledger',
      icon: ClipboardList,
    },
    {
      id: 'season-snapshot',
      title: 'Season Snapshot',
      description: 'Season-by-season comparison tool — standings, scoring, and team evolution across all 10 BMFFFL seasons.',
      href: '/analytics/season-snapshot',
      icon: BarChart2,
    },
    {
      id: 'playoff-probability',
      title: 'Playoff Probability',
      description: 'Monte Carlo simulations projecting each team\'s playoff odds based on current standings and remaining schedule.',
      href: '/analytics/playoff-probability',
      icon: TrendingUp,
    },
    {
      id: 'rb-aging-curve',
      title: 'RB Aging Curve',
      description: 'Dynasty aging curve analysis for BMFFFL running backs — when to buy, hold, and sell based on age and role.',
      href: '/analytics/rb-aging-curve',
      icon: TrendingUp,
    },
    {
      id: 'buy-sell',
      title: 'Buy / Sell / Hold',
      description: 'March 2026 dynasty trade recommendations for BMFFFL roster assets. Filterable by recommendation and position.',
      href: '/analytics/buy-sell',
      icon: TrendingUp,
    },
    {
      id: 'scoring-trends',
      title: 'Scoring Trends',
      description: 'Season-by-season scoring analysis — league averages, career scoring leaders, and team trends 2020-2025.',
      href: '/analytics/scoring-trends',
      icon: BarChart2,
    },
    {
      id: 'historical-points',
      title: 'Historical Points',
      description: 'Per-season and career scoring averages for all 12 BMFFFL owners. Color-coded above/below league average.',
      href: '/analytics/historical-points',
      icon: BarChart2,
    },
    {
      id: 'injury-risk',
      title: 'Injury Risk Watchlist',
      description: 'Current injury risk assessment for BMFFFL roster players. High / medium / low risk with dynasty impact notes.',
      href: '/analytics/injury-risk',
      icon: UserSearch,
    },
    {
      id: 'champion-retrospective',
      title: 'Champion Retrospective',
      description: 'Deep dive into every BMFFFL championship roster — key players, what won it, and dynasty lessons from each title.',
      href: '/analytics/champion-retrospective',
      icon: Trophy,
    },
    {
      id: 'draft-pick-calculator',
      title: 'Draft Pick Calculator',
      description: 'Dynasty pick trade value calculator. Build out trade scenarios with 2026-2028 picks and get a fair-value score.',
      href: '/analytics/draft-pick-calculator',
      icon: ClipboardList,
    },
    {
      id: 'coaching-changes',
      title: 'Coaching Changes',
      description: '2026 NFL offseason coaching change tracker — dynasty impact on BMFFFL players, sorted by severity.',
      href: '/analytics/coaching-changes',
      icon: Users,
    },
    {
      id: 'target-share',
      title: 'Target Share & Air Yards',
      description: '2025 season WR/TE target share breakdown by BMFFFL roster. Treemap + sortable stats table.',
      href: '/analytics/target-share',
      icon: BarChart2,
    },
    {
      id: 'data-export',
      title: 'Data Export',
      description: 'Download BMFFFL historical data as JSON or CSV — standings, champions, H2H records, draft picks.',
      href: '/analytics/data-export',
      icon: Newspaper,
    },
  ];

  const comingSoonTools: ComingSoonTool[] = [
    {
      id: 'live-sleeper',
      title: 'Live Sleeper Data',
      description: 'Real-time roster sync, waiver wire activity, and trade history pulled directly from the Sleeper API.',
      icon: UserSearch,
      plannedPhase: 'Phase G',
      teaser: [
        'Live roster sync from Sleeper API',
        'Waiver wire and trade transaction feed',
        'Injured reserve and taxi squad tracking',
        'Automated dynasty value alerts on roster changes',
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Analytics — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football analytics dashboard — dynasty rankings, roster values, owner performance, head-to-head records, mock draft, and NFL draft tracker."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            Analytics Hub
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Advanced tools and historical data for BMFFFL dynasty managers.
          </p>
        </header>

        {/* League Stats — always-visible snapshot */}
        <section className="mb-12 rounded-xl border border-[#2d4a66] bg-[#16213e] p-6" aria-labelledby="league-stats-heading">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
              <BarChart2 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="league-stats-heading" className="text-lg font-bold text-white leading-tight">League Stats</h2>
              <p className="text-xs text-slate-500">Historical scoring snapshot — all 10 seasons</p>
            </div>
          </div>
          <LeagueStatsSection />
        </section>

        {/* What's Live Now */}
        <section className="mb-10" aria-labelledby="live-tools-heading">
          <div className="flex items-center gap-3 mb-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <h2 id="live-tools-heading" className="text-xl font-bold text-white">
              Live Now — Phase E Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {liveTools.map(tool => (
              <LiveToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                badge={tool.badge}
              />
            ))}
          </div>
        </section>

        {/* Coming in Phase G */}
        <section aria-labelledby="coming-soon-heading">
          <div className="flex items-center gap-3 mb-5">
            <FlaskConical className="w-5 h-5 text-[#e94560] shrink-0" aria-hidden="true" />
            <h2 id="coming-soon-heading" className="text-xl font-bold text-slate-400">
              Coming in Phase G
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {comingSoonTools.map(tool => (
              <ComingSoonCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                plannedPhase={tool.plannedPhase}
                teaser={tool.teaser}
              />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-12 text-xs text-center text-slate-600">
          Phase G features require Sleeper API integration and live dynasty value data.
          All tools subject to change as scope is finalized.
        </p>

      </div>
    </>
  );
}
