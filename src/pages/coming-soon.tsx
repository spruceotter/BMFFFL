import Head from 'next/head';
import Link from 'next/link';
import { Clock, Wrench } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Coming Soon Page ─────────────────────────────────────────────────────────
// Hub for features currently in development. Moved here 2026-04-14 per
// Commissioner request — these pages need Convex data wiring before launch.

const COMING_SOON_FEATURES = [
  // Season
  { label: 'Current Season Hub',   href: '/season',                          category: 'Season',    note: 'Needs live Sleeper data' },
  { label: '2026 Rookie Draft',    href: '/season/rookie-draft-2026',        category: 'Season',    note: 'Draft not yet occurred' },
  // Analytics — needs real data wiring
  { label: 'Analytics Hub',        href: '/analytics',                       category: 'Analytics', note: 'Needs Convex wiring' },
  { label: 'Championship Window',  href: '/analytics/championship-window',   category: 'Analytics', note: 'Needs Convex wiring' },
  { label: 'Contract Simulator',   href: '/analytics/contract-sim',          category: 'Analytics', note: 'In development' },
  { label: 'Devy Tracker',         href: '/analytics/devy-tracker',          category: 'Analytics', note: 'In development' },
  { label: 'FAAB History',         href: '/analytics/faab-history',          category: 'Analytics', note: 'Needs Sleeper data' },
  { label: 'Manager Trends',       href: '/analytics/manager-trends',        category: 'Analytics', note: 'In development' },
  { label: 'Mock Draft Simulator', href: '/analytics/mock-draft',            category: 'Analytics', note: 'In development' },
  { label: 'Multi-Season View',    href: '/analytics/multi-season',          category: 'Analytics', note: 'Needs Convex wiring' },
  { label: 'Price Check',          href: '/analytics/price-check',           category: 'Analytics', note: 'In development' },
  { label: 'RB Aging Curve',       href: '/analytics/rb-aging-curve',        category: 'Analytics', note: 'In development' },
  { label: 'Team Builder',         href: '/analytics/team-builder',          category: 'Analytics', note: 'In development' },
  { label: 'Trade Analyzer',       href: '/analytics/trade-analyzer',        category: 'Analytics', note: 'In development' },
  { label: 'Trade Analyzer v2',    href: '/analytics/trade-analyzer-v2',     category: 'Analytics', note: 'In development' },
  { label: 'Trade Value Chart',    href: '/analytics/trade-value-chart',     category: 'Analytics', note: 'Needs Convex wiring' },
  { label: 'Transaction Browser',  href: '/analytics/transaction-browser',   category: 'Analytics', note: 'Needs Sleeper data' },
  { label: 'Win % Trends',         href: '/analytics/win-percentage-trends', category: 'Analytics', note: 'Needs Convex wiring' },
  // Resources
  { label: 'League Chat',          href: '/resources/live-chat',             category: 'Resources', note: 'In development' },
  { label: 'Voting System',        href: '/resources/voting',                category: 'Resources', note: 'In development' },
  { label: 'Sleeper OAuth',        href: '/analytics/sleeper-oauth',         category: 'Resources', note: 'Auth flow in progress' },
];

const categories = ['Season', 'Analytics', 'Resources'] as const;

export default function ComingSoonPage() {
  return (
    <>
      <Head>
        <title>Coming Soon — BMFFFL</title>
        <meta name="description" content="Features currently in development for BMFFFL." />
      </Head>

      <main className="min-h-screen bg-gray-950 text-white px-4 py-12 max-w-4xl mx-auto">
        <div className="mb-10 flex items-center gap-3">
          <Clock className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold">Coming Soon</h1>
            <p className="text-gray-400 mt-1">
              These features are in development or need live data wiring. Check back soon.
            </p>
          </div>
        </div>

        {categories.map(category => {
          const items = COMING_SOON_FEATURES.filter(f => f.category === category);
          return (
            <section key={category} className="mb-10">
              <h2 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-4 py-3',
                      'bg-gray-800 hover:bg-gray-700 transition-colors',
                      'border border-gray-700'
                    )}
                  >
                    <span className="font-medium text-sm">{item.label}</span>
                    <span className="text-xs text-gray-500 ml-3">{item.note}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
