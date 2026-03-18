/**
 * Manager Compare — task-917
 * Demonstrates StatTooltip on all 12 managers.
 * Hover any manager card to see their quick-stat popover.
 */

import Head from 'next/head';
import { cn } from '@/lib/cn';
import StatTooltip from '@/components/ui/StatTooltip';
import { getManagerColor, MANAGER_COLORS } from '@/data/manager-colors';

// ─── Manager roster ───────────────────────────────────────────────────────────

const MANAGERS = Object.keys(MANAGER_COLORS) as (keyof typeof MANAGER_COLORS)[];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagerComparePage() {
  return (
    <>
      <Head>
        <title>Manager Compare — BMFFFL</title>
        <meta name="description" content="Hover any manager to see their career stats at a glance." />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-12">
        {/* ── Header ── */}
        <div className="max-w-5xl mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Manager Compare
          </h1>
          <p className="text-slate-400 text-sm">
            Hover any manager card to see their quick-stat summary.
          </p>
        </div>

        {/* ── Manager grid ── */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {MANAGERS.map((slug, idx) => {
            const colors = getManagerColor(slug);
            // Alternate above/below so cards near the bottom of each row
            // don't overflow off screen.
            const tooltipPos = idx < 8 ? 'above' : 'below';

            return (
              <StatTooltip
                key={slug}
                managerSlug={slug}
                position={tooltipPos as 'above' | 'below'}
              >
                {/* Card — styled with manager's primary + accent */}
                <span
                  className={cn(
                    'w-full flex flex-col items-center gap-2 px-4 py-5',
                    'rounded-xl border cursor-pointer select-none',
                    'transition-transform duration-150 hover:scale-105',
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, #0d1b2a 100%)`,
                    borderColor: colors.accent + '55',  // 33% opacity border
                  }}
                >
                  {/* Coloured dot */}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                    aria-hidden="true"
                  />
                  {/* Slug label */}
                  <span
                    className="text-xs font-semibold text-center leading-tight break-all"
                    style={{ color: colors.accent }}
                  >
                    {slug}
                  </span>
                  {/* Color theme name */}
                  <span className="text-[10px] text-slate-500 text-center">
                    {MANAGER_COLORS[slug].name}
                  </span>
                </span>
              </StatTooltip>
            );
          })}
        </div>

        {/* ── Legend / instructions ── */}
        <div className="max-w-5xl mx-auto mt-12 rounded-xl border border-[#2d4a66] bg-[#1a2d42] p-5">
          <h2 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">
            About this page
          </h2>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Each card represents one of the 12 BMFFFL managers.</li>
            <li>Hover (or focus) a card to reveal the StatTooltip popover.</li>
            <li>Tooltips show win–loss record, career points, championships, and 2025 final rank.</li>
            <li>No JavaScript state is used — visibility is purely driven by CSS <code className="text-slate-300">group-hover</code>.</li>
            <li>Card colors pull from <code className="text-slate-300">MANAGER_COLORS</code> in <code className="text-slate-300">src/data/manager-colors.ts</code>.</li>
          </ul>
        </div>
      </main>
    </>
  );
}
