import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Trophy, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SeasonModeToggle from '@/components/ui/SeasonModeToggle';

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home',           href: '/' },
  { label: 'History',        href: '/history' },
  {
    label: 'Season',
    href:  '/season',
    children: [
      { label: 'Current Season',    href: '/season' },
      { label: 'Matchups',          href: '/season/matchups' },
      { label: '2026 Rookie Draft', href: '/season/rookie-draft-2026' },
      { label: 'Owners Meeting',    href: '/season/owners-meeting-2026' },
      { label: '2026 Season Preview', href: '/season/preview-2026' },
      { label: 'Week 1 Preview',    href: '/season/week1-preview' },
      { label: 'All Seasons',       href: '/seasons' },
      { label: 'League Calendar',   href: '/calendar' },
      { label: 'Playoff Bracket',   href: '/history' },
      { label: 'Historical Standings', href: '/history/standings' },
    ],
  },
  {
    label: 'Analytics',
    href:  '/analytics',
    children: [
      { label: 'Analytics Hub',      href: '/analytics' },
      { label: 'Dashboard',          href: '/analytics/dashboard-widget' },
      { label: 'Dynasty Rankings',   href: '/analytics/dynasty-rankings' },
      { label: 'Keeper Calculator',  href: '/analytics/keeper-calculator' },
      { label: 'Taxi Optimizer',     href: '/analytics/taxi-optimizer' },
      { label: '2026 Rookie Class',  href: '/analytics/rookie-prospects' },
      { label: 'Devy Tracker',       href: '/analytics/devy-tracker' },
      { label: 'NFL Draft Impact',   href: '/analytics/nfl-draft-impact' },
      { label: 'Breakout Predictor', href: '/analytics/breakout-predictor' },
      { label: 'Breakout Tracking',  href: '/analytics/breakout-tracking' },
      { label: 'Points by NFL Team', href: '/analytics/points-by-nfl-team' },
      { label: 'Veteran vs Rookie',  href: '/analytics/veteran-vs-rookie' },
      { label: 'Draft Grades',       href: '/analytics/draft-grades' },
      { label: 'Dynasty Power Index', href: '/analytics/dynasty-power-index' },
      { label: 'Championship Window', href: '/analytics/championship-window' },
      { label: 'Power Rankings',     href: '/analytics/power-rankings' },
      { label: 'Power Rankings Auto', href: '/analytics/power-rankings-auto' },
      { label: 'Roster Values',      href: '/analytics/rosters' },
      { label: 'Roster Grades',      href: '/analytics/roster-grades' },
      { label: 'Owner Dashboard',    href: '/analytics/owners' },
      { label: 'Manager Efficiency', href: '/analytics/manager-efficiency' },
      { label: 'Head-to-Head',       href: '/analytics/head-to-head' },
      { label: 'Rivalry Week',       href: '/analytics/rivalry-week' },
      { label: 'H2H All-Time',       href: '/analytics/h2h-records' },
      { label: '2026 Draft Board',   href: '/analytics/draft-board-2026' },
      { label: 'Startup Draft',      href: '/analytics/startup-draft' },
      { label: 'Mock Draft Sim',     href: '/analytics/mock-draft' },
      { label: 'Draft Room',         href: '/analytics/live-draft' },
      { label: 'Auction Draft',      href: '/analytics/auction-draft' },
      { label: 'Team Builder',       href: '/analytics/team-builder' },
      { label: 'Trade Analyzer',      href: '/analytics/trade-analyzer' },
      { label: 'Trade Analyzer v2',  href: '/analytics/trade-analyzer-v2' },
      { label: 'Trade Evaluator',    href: '/analytics/trade-evaluator' },
      { label: 'Trade Value Chart',  href: '/analytics/trade-value-chart' },
      { label: 'Free Agency',        href: '/analytics/free-agency' },
      { label: 'Training Camp',      href: '/analytics/training-camp' },
      { label: 'Waiver Priority',    href: '/analytics/waiver-priority' },
      { label: 'Landing Spots',      href: '/analytics/landing-spots' },
      { label: 'FAAB Tracker',       href: '/analytics/faab-tracker' },
      { label: 'FAAB History',       href: '/analytics/faab-history' },
      { label: 'FAAB Audit',         href: '/analytics/faab-audit' },
      { label: 'Injury History',     href: '/analytics/injury-history' },
      { label: 'Win % Trends',       href: '/analytics/win-percentage-trends' },
      { label: 'Win Probability',    href: '/analytics/win-probability' },
      { label: 'All-Time Records',   href: '/analytics/all-time-records' },
      { label: 'Positional Needs',   href: '/analytics/positional-needs' },
      { label: 'Scarcity Index',     href: '/analytics/scarcity-index' },
      { label: 'Scarcity Heatmap',   href: '/analytics/scarcity-heatmap' },
      { label: 'Waiver History',     href: '/analytics/waiver-history' },
      { label: 'Dynasty Grades',     href: '/analytics/dynasty-grades' },
      { label: 'Waiver Priority History', href: '/analytics/waiver-history-tracker' },
      { label: 'Trade Ledger',       href: '/analytics/trade-ledger' },
      { label: 'Transaction Browser', href: '/analytics/transaction-browser' },
      { label: 'Biggest Trades',     href: '/analytics/biggest-trades' },
      { label: 'Season Snapshot',    href: '/analytics/season-snapshot' },
      { label: 'Schedule Difficulty', href: '/analytics/schedule-difficulty' },
      { label: 'Schedule Strength v2', href: '/analytics/schedule-strength-v2' },
      { label: 'Multi-Season Standings', href: '/analytics/multi-season' },
      { label: 'Playoff Probability', href: '/analytics/playoff-probability' },
      { label: 'Playoff Simulator',   href: '/analytics/playoff-simulator' },
      { label: 'RB Aging Curve',     href: '/analytics/rb-aging-curve' },
      { label: 'Player Career Arcs', href: '/analytics/player-arcs' },
      { label: 'Age Curve Analysis', href: '/analytics/age-curve' },
      { label: 'Scoring Trends',     href: '/analytics/scoring-trends' },
      { label: 'Boom or Bust',       href: '/analytics/boom-or-bust' },
      { label: 'Manager Trends',     href: '/analytics/manager-trends' },
      { label: 'Buy / Sell / Hold',  href: '/analytics/buy-sell' },
      { label: 'Sell High / Buy Low', href: '/analytics/sell-high' },
      { label: 'Roster Overlap',     href: '/analytics/roster-overlap' },
      { label: 'Start / Sit',        href: '/analytics/start-sit' },
      { label: 'Best Ball Analysis', href: '/analytics/best-ball' },
      { label: 'Best Ball Sim',     href: '/analytics/best-ball-simulator' },
      { label: 'Age-Adjusted',      href: '/analytics/age-adjusted' },
      { label: 'Weekly Recap',       href: '/analytics/weekly-recap' },
      { label: 'Historical Points',  href: '/analytics/historical-points' },
      { label: 'Points Against',     href: '/analytics/points-against' },
      { label: 'Injury Risk',        href: '/analytics/injury-risk' },
      { label: 'Injury Tracker',     href: '/analytics/injury-tracker' },
      { label: 'Champion Retrospective', href: '/analytics/champion-retrospective' },
      { label: 'Pick Calculator',    href: '/analytics/draft-pick-calculator' },
      { label: 'Draft Capital',      href: '/analytics/draft-capital' },
      { label: 'Coaching Changes',   href: '/analytics/coaching-changes' },
      { label: 'Target Share',       href: '/analytics/target-share' },
      { label: 'Data Export',        href: '/analytics/data-export' },
      { label: 'Live Scoring',        href: '/analytics/live-scoring' },
      { label: 'Sleeper Live',       href: '/analytics/sleeper-live' },
      { label: 'News Feed',          href: '/analytics/news-feed' },
      { label: 'Commissioner Dashboard', href: '/analytics/commissioner-dashboard' },
      { label: 'Share Cards',           href: '/analytics/share-cards' },
      { label: 'League Health',         href: '/analytics/league-health' },
      { label: 'Contract Sim',          href: '/analytics/contract-sim' },
      { label: 'Bracket Predictor',     href: '/analytics/bracket-predictor' },
      { label: 'Price Check',           href: '/analytics/price-check' },
    ],
  },
  {
    label: 'Magazine',
    href:  '/magazine',
    children: [
      { label: 'All Articles',    href: '/articles' },
      { label: 'Magazine Hub',    href: '/magazine' },
      { label: 'Analysis',        href: '/articles?category=analysis' },
      { label: 'Previews',        href: '/articles?category=preview' },
      { label: 'Strategy',        href: '/articles?category=strategy' },
      { label: 'Commish Speaks',  href: '/articles/commish-speaks' },
    ],
  },
  {
    label: 'More',
    href:  '/about',
    children: [
      { label: 'About BMFFFL',    href: '/about' },
      { label: 'Manager Profiles', href: '/managers' },
      { label: 'Site Search',     href: '/search' },
      { label: 'League Rules',    href: '/rules' },
      { label: 'Rules Explainer', href: '/rules/explainer' },
      { label: 'Owners',          href: '/owners' },
      { label: 'Records',         href: '/records' },
      { label: 'NFL Draft 2026',  href: '/nfl-draft/2026' },
      { label: 'Trades',          href: '/trades' },
      { label: 'Constitution',    href: '/constitution' },
      { label: 'Bimfle',          href: '/bimfle' },
      { label: 'Rivalry',         href: '/rivalry' },
      { label: 'League Lore',     href: '/league-lore' },
      { label: 'Drafts',          href: '/drafts' },
      { label: 'Resources',       href: '/resources' },
      { label: 'Sleeper OAuth',   href: '/analytics/sleeper-oauth' },
      { label: 'Sleeper Guide',   href: '/resources/sleeper-guide' },
      { label: 'League Chat',     href: '/resources/live-chat' },
      { label: 'Push Notifications', href: '/resources/notifications' },
      { label: 'Webhook Design', href: '/resources/webhooks' },
      { label: 'API Docs',      href: '/resources/api-docs' },
      { label: 'Contribute',    href: '/resources/contribute' },
      { label: 'Voting System', href: '/resources/voting' },
      { label: 'Team Names',      href: '/history/team-names' },
      { label: 'Shame Board',     href: '/history/shame-board' },
      { label: 'Season Recap',    href: '/history/season-recap' },
      { label: 'Playoff Brackets', href: '/history/playoff-brackets' },
      { label: 'Annual Awards',   href: '/history/awards' },
      { label: '2025 Awards Ceremony', href: '/history/awards-ceremony' },
      { label: 'Veto Log',        href: '/history/veto-log' },
      { label: 'Grudge Match',    href: '/analytics/grudge-match' },
      { label: "Commissioner's Vault", href: '/admin/vault' },
      { label: 'Commissioner Toolkit', href: '/admin/commissioner-toolkit' },
      { label: 'League Encyclopedia',  href: '/history/encyclopedia' },
    ],
  },
];

export default function Navigation() {
  const router = useRouter();
  const pathname = router.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Elevate nav on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-shadow duration-200',
          'bg-[#1a1a2e] border-b border-[#2d4a66]',
          scrolled && 'shadow-lg shadow-black/40'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand / Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="BMFFFL Home"
            >
              <Trophy
                className="w-6 h-6 text-[#ffd700] group-hover:scale-110 transition-transform duration-200"
                aria-hidden="true"
              />
              <span className="text-xl font-black tracking-widest text-white group-hover:text-[#ffd700] transition-colors duration-200">
                BMFFFL
              </span>
            </Link>

            {/* Desktop links */}
            <ul ref={dropdownRef} className="hidden md:flex items-center gap-1" role="list">
              {NAV_LINKS.map(({ label, href, children }) => (
                <li key={href} className="relative">
                  {children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === href ? null : href)}
                        className={cn(
                          'inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                          'hover:text-[#ffd700] hover:bg-white/5',
                          isActive(href) ? 'text-[#ffd700]' : 'text-slate-300'
                        )}
                        aria-expanded={openDropdown === href}
                        aria-haspopup="true"
                      >
                        {label}
                        <ChevronDown
                          className={cn(
                            'w-3.5 h-3.5 transition-transform duration-150',
                            openDropdown === href && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      {openDropdown === href && (
                        <ul
                          className={cn(
                            'absolute top-full left-0 mt-1 z-50 w-52',
                            'bg-[#1a1a2e] border border-[#2d4a66] rounded-lg shadow-xl',
                            'py-1 max-h-80 overflow-y-auto'
                          )}
                          role="menu"
                        >
                          {children.map((child) => (
                            <li key={child.href} role="none">
                              <Link
                                href={child.href}
                                className={cn(
                                  'block px-4 py-2 text-sm transition-colors duration-100',
                                  pathname === child.href
                                    ? 'text-[#ffd700] bg-[#ffd700]/5'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                )}
                                role="menuitem"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={href}
                      className={cn(
                        'relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                        'hover:text-[#ffd700] hover:bg-white/5',
                        isActive(href) ? 'text-[#ffd700]' : 'text-slate-300'
                      )}
                      aria-current={isActive(href) ? 'page' : undefined}
                    >
                      {label}
                      {isActive(href) && (
                        <span
                          className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#ffd700]"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Utility buttons: season mode toggle + theme toggle + mobile hamburger */}
            <div className="flex items-center gap-1">
              <SeasonModeToggle className="hidden md:inline-flex mr-1" />
              <ThemeToggle />

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileOpen
                  ? <X className="w-6 h-6" aria-hidden="true" />
                  : <Menu className="w-6 h-6" aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in drawer */}
      <nav
        id="mobile-nav-drawer"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 flex flex-col',
          'bg-[#1a1a2e] border-l border-[#2d4a66] shadow-2xl',
          'transition-transform duration-300 ease-in-out md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2d4a66]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-lg font-black tracking-widest text-white">BMFFFL</span>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer links */}
        <ul className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto" role="list">
          {NAV_LINKS.map(({ label, href, children }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors duration-150',
                  isActive(href)
                    ? 'bg-[#e94560]/10 text-[#ffd700] border-l-2 border-[#ffd700]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )}
                aria-current={isActive(href) ? 'page' : undefined}
                tabIndex={mobileOpen ? 0 : -1}
              >
                {label}
              </Link>
              {children && (
                <ul className="ml-4 mt-1 flex flex-col gap-0.5">
                  {children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-100"
                        tabIndex={mobileOpen ? 0 : -1}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-[#2d4a66]">
          <p className="text-xs text-slate-500">Best MFing Fantasy Football League</p>
        </div>
      </nav>
    </>
  );
}
