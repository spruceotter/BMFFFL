import Link from 'next/link';
import { Trophy, Database } from 'lucide-react';

// ─── Component ─────────────────────────────────────────────────────────────
// Minimal footer — main nav handles all section navigation.
// Footer shows only brand, links not prominently in the main nav, and attribution.

export default function Footer() {
  return (
    <footer className="bg-[#0d1020] border-t border-[#2d4a66] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-500">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <span className="font-black tracking-widest text-white text-sm">BMFFFL</span>
            <span className="text-slate-600">&copy; 2020&ndash;{new Date().getFullYear()}</span>
          </div>

          {/* A few links NOT duplicated in the primary nav CTA flow */}
          <nav aria-label="Footer links">
            <ul className="flex items-center gap-5" role="list">
              {[
                { label: 'Join the League', href: '/join' },
                { label: 'Bimflé Chat',     href: '/bimfle' },
                { label: 'League Lore',     href: '/league-lore' },
                { label: 'Shame Board',     href: '/history/shame-board' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#ffd700] transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Data attribution */}
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Data via Sleeper API</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
