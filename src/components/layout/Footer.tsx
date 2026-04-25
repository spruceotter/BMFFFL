import Link from 'next/link';
import { Trophy, Database, BarChart2, History, Calendar, Wrench } from 'lucide-react';

// ─── Footer link columns ───────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  icon: React.ReactNode;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Analytics',
    icon: <BarChart2 className="w-4 h-4" aria-hidden="true" />,
    links: [
      { label: 'All Articles',        href: '/articles' },
      { label: 'All-Time Records',    href: '/analytics/all-time-records' },
      { label: 'Owner Dashboard',     href: '/analytics/owners' },
      { label: 'Owner Profiles',      href: '/managers' },
    ],
  },
  {
    heading: 'History',
    icon: <History className="w-4 h-4" aria-hidden="true" />,
    links: [
      { label: 'History Hub',         href: '/history' },
      { label: 'Season Recap',        href: '/history/season-recap' },
      { label: 'Awards',              href: '/history/awards' },
      { label: 'Playoff Brackets',    href: '/history/playoff-brackets' },
      { label: 'Shame Board',         href: '/history/shame-board' },
      { label: 'Encyclopedia',        href: '/history/encyclopedia' },
    ],
  },
  {
    heading: 'Season',
    icon: <Calendar className="w-4 h-4" aria-hidden="true" />,
    links: [
      { label: '2026 Season',         href: '/season/current' },
      { label: 'NFL Draft Hub',       href: '/nfl-draft/2026' },
      { label: '🏆 Draft Game',       href: '/nfl-draft/draft-game-2026' },
      { label: 'Leaderboard',         href: '/nfl-draft/draft-game-leaderboard-2026' },
    ],
  },
  {
    heading: 'League',
    icon: <Wrench className="w-4 h-4" aria-hidden="true" />,
    links: [
      { label: 'About BMFFFL',        href: '/about' },
      { label: 'Owners',              href: '/owners' },
      { label: 'Constitution',        href: '/constitution' },
      { label: 'League Rules',        href: '/rules' },
      { label: 'League Lore',         href: '/league-lore' },
      { label: 'Bimflé Chat',        href: '/bimfle' },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-[#0d1020] border-t border-[#2d4a66] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Brand row */}
        <div className="mb-10 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
          <span className="text-lg font-black tracking-widest text-white">BMFFFL</span>
          <span className="hidden sm:inline text-slate-600 text-sm ml-2">Best MFing Fantasy Football League</span>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              {/* Column heading */}
              <div className="flex items-center gap-2 mb-4 text-[#ffd700]">
                {col.icon}
                <span className="text-xs font-bold uppercase tracking-widest">{col.heading}</span>
              </div>

              {/* Links */}
              <ul className="space-y-2.5" role="list">
                {col.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#2d4a66]/60 mb-6" aria-hidden="true" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">

          {/* Copyright + tagline */}
          <p>
            BMFFFL &copy; 2020&ndash;{new Date().getFullYear()}{' '}
            <span className="text-slate-600">&middot;</span>{' '}
            Built with{' '}
            <Link href="/bimfle" className="text-slate-400 hover:text-[#ffd700] transition-colors">
              Bimfle
            </Link>
          </p>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <ul className="flex items-center gap-5" role="list">
              {[
                { label: 'About',    href: '/about' },
                { label: 'Rules',    href: '/rules' },
                { label: 'History',  href: '/history' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-[#ffd700] transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Data attribution */}
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Data powered by Sleeper API</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
