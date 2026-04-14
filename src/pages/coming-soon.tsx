import Head from 'next/head';
import Link from 'next/link';
import { Clock, Wrench } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getPagesByStatus } from '@/data/page-status';

// ─── Coming Soon Page ─────────────────────────────────────────────────────────
// Derives its list from page-status.ts — the single source of truth for
// page validation status. Adding a page to PAGE_STATUS as 'coming-soon'
// automatically surfaces it here. No manual list maintenance required.

const ALL_COMING_SOON = getPagesByStatus('coming-soon').map(p => ({
  label: p.label,
  href:  p.path,
  category: p.category ?? 'Other',
  note: p.notes ?? '',
}));

// Stable category order for display
const CATEGORY_ORDER = ['Season', 'Analytics', 'Resources', 'Other'];
const categories = CATEGORY_ORDER.filter(cat =>
  ALL_COMING_SOON.some(f => f.category === cat)
);

export default function ComingSoonPage() {
  const total = ALL_COMING_SOON.length;

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
              {total} feature{total !== 1 ? 's' : ''} in development or awaiting live data wiring.
            </p>
          </div>
        </div>

        {categories.map(category => {
          const items = ALL_COMING_SOON.filter(f => f.category === category);
          if (items.length === 0) return null;
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
