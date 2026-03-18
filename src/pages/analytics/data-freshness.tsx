import Head from 'next/head';
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import DataTimestamp from '@/components/ui/DataTimestamp';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DataCategory {
  name: string;
  lastUpdated: string; // ISO date string
  description: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const TODAY = '2026-03-16';

const DATA_CATEGORIES: DataCategory[] = [
  {
    name: 'Rosters',
    lastUpdated: '2026-03-15',
    description: 'Dynasty roster compositions and player assignments per team',
  },
  {
    name: 'Power Rankings',
    lastUpdated: '2026-03-14',
    description: 'Weekly dynasty power rankings based on roster value and trajectory',
  },
  {
    name: 'Trade Values',
    lastUpdated: '2026-03-10',
    description: 'Consensus dynasty trade values for players and draft picks',
  },
  {
    name: 'Draft Grades',
    lastUpdated: '2026-03-01',
    description: 'Rookie draft grades and post-draft roster impact assessments',
  },
  {
    name: 'Historical Stats',
    lastUpdated: '2026-03-16',
    description: 'All-time season scoring, standings, and head-to-head records',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysAgo(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  const now = new Date(TODAY).getTime();
  return Math.floor((now - then) / 86_400_000);
}

type Freshness = 'fresh' | 'aging' | 'stale';

function getFreshness(isoDate: string): Freshness {
  const days = getDaysAgo(isoDate);
  if (days <= 1) return 'fresh';
  if (days <= 7) return 'aging';
  return 'stale';
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FreshnessIndicator({ freshness }: { freshness: Freshness }) {
  if (freshness === 'fresh') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
        Fresh
      </span>
    );
  }
  if (freshness === 'aging') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
        <AlertTriangle className="w-3 h-3" aria-hidden="true" />
        Recent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560]">
      <XCircle className="w-3 h-3" aria-hidden="true" />
      Aging
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DataFreshnessPage() {
  return (
    <>
      <Head>
        <title>Data Freshness — BMFFFL Analytics</title>
        <meta
          name="description"
          content="See when BMFFFL data categories were last updated. Rosters, trade values, power rankings, draft grades, and historical stats."
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Data Freshness
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3">
            Data Last Updated
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            Track when each data category was last refreshed. As a static site, data is updated
            manually with each build. Live Sleeper API sync is planned for Phase G.
          </p>
        </header>

        {/* Data categories table */}
        <section aria-labelledby="data-categories-heading" className="mb-10">
          <h2
            id="data-categories-heading"
            className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3"
          >
            Data Categories
          </h2>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="min-w-full text-sm" aria-label="Data category freshness">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {DATA_CATEGORIES.map((cat, idx) => {
                  const freshness = getFreshness(cat.lastUpdated);
                  const daysAgo = getDaysAgo(cat.lastUpdated);

                  return (
                    <tr
                      key={cat.name}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{cat.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                      </td>
                      <td className="px-5 py-4">
                        <DataTimestamp date={cat.lastUpdated} />
                        <p className="text-xs text-slate-600 mt-0.5">
                          {formatDate(cat.lastUpdated)}
                          {daysAgo === 0 ? ' (today)' : daysAgo === 1 ? ' (yesterday)' : ` (${daysAgo}d ago)`}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <FreshnessIndicator freshness={freshness} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Freshness legend */}
        <section aria-labelledby="freshness-legend-heading" className="mb-10">
          <h2
            id="freshness-legend-heading"
            className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3"
          >
            Freshness Legend
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-emerald-400">Fresh</span>
              </div>
              <p className="text-xs text-slate-500">Updated within the last 24 hours</p>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-yellow-400">Recent</span>
              </div>
              <p className="text-xs text-slate-500">Updated within the last 7 days</p>
            </div>
            <div className="rounded-lg border border-[#e94560]/20 bg-[#e94560]/5 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <XCircle className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[#e94560]">Aging</span>
              </div>
              <p className="text-xs text-slate-500">Updated more than 7 days ago</p>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            All data sourced from Sleeper API. Automated updates coming with API integration.
            Until then, data is refreshed manually with each site build. Last site build: March 2026.
          </p>
        </footer>

      </div>
    </>
  );
}
