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
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href:  '/about',
    children: [
      { label: 'About BMFFFL',     href: '/about' },
      { label: 'Owners',           href: '/owners' },
      { label: 'Manager Profiles', href: '/managers' },
      { label: 'Rules',            href: '/rules' },
      { label: 'Constitution',     href: '/constitution' },
      { label: 'Bimflé',          href: '/bimfle' },
    ],
  },
  {
    label: 'Current Season',
    href:  '/season/current',
    children: [
      { label: '2026 Season',                href: '/season/current' },
      { label: 'NFL Draft Hub 2026',         href: '/nfl-draft/2026' },
      { label: '🏆 Draft Game',              href: '/nfl-draft/draft-game-2026' },
      { label: 'Draft Game Leaderboard',     href: '/nfl-draft/draft-game-leaderboard-2026' },
    ],
  },
  {
    label: 'League History',
    href:  '/history',
    children: [
      { label: 'League History',        href: '/history' },
      { label: 'League Lore',           href: '/league-lore' },
      { label: 'Historical Standings',  href: '/history/standings' },
      { label: 'Annual Awards',         href: '/history/awards' },
      { label: 'League Encyclopedia',   href: '/history/encyclopedia' },
      { label: 'Shame Board',           href: '/history/shame-board' },
      { label: 'Rivalry',              href: '/rivalry' },
      { label: 'All-Time Records',      href: '/records' },
      { label: 'All Seasons',           href: '/seasons' },
    ],
  },
  {
    // Flint's corner — only live content surfaced
    label: 'Analytics & Articles',
    href:  '/articles',
    children: [
      { label: 'All Articles',      href: '/articles' },
      { label: 'Owner Dashboard',   href: '/analytics/owners' },
      { label: 'All-Time Records',  href: '/analytics/all-time-records' },
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
