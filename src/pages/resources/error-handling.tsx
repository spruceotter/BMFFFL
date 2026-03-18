import Head from 'next/head';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  FileText,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FallbackRow {
  pageType: string;
  staticFallback: boolean;
  liveDataShown: boolean;
  offlineBehavior: string;
}

interface ChecklistItem {
  step: string;
  detail: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const FALLBACK_TABLE: FallbackRow[] = [
  {
    pageType: 'Analytics Hub (index)',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'Full page loads — all data is hardcoded',
  },
  {
    pageType: 'Dynasty Roster Values',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'Static roster snapshots displayed; no API call',
  },
  {
    pageType: 'Owner Performance Dashboard',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'Historical stats load from bundled data',
  },
  {
    pageType: 'Head-to-Head Records',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'All-time records from static JSON source',
  },
  {
    pageType: 'Trade Ledger',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'Hardcoded trade history, no live feed needed',
  },
  {
    pageType: 'Dynasty Rankings',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'March 2026 snapshot served from build',
  },
  {
    pageType: 'Mock Draft Simulator',
    staticFallback: true,
    liveDataShown: false,
    offlineBehavior: 'Fully client-side simulation, no network calls',
  },
  {
    pageType: 'Live Sleeper Data (Phase G)',
    staticFallback: false,
    liveDataShown: true,
    offlineBehavior: 'Graceful error state; last cached snapshot shown',
  },
  {
    pageType: 'Live Scoring (Phase G)',
    staticFallback: false,
    liveDataShown: true,
    offlineBehavior: 'Loading skeleton → timeout error message',
  },
  {
    pageType: 'Waiver Tracker (Phase G)',
    staticFallback: false,
    liveDataShown: true,
    offlineBehavior: 'Cached waiver data shown with stale warning badge',
  },
];

const TESTING_CHECKLIST: ChecklistItem[] = [
  {
    step: 'Disable network in DevTools',
    detail: 'Open Chrome DevTools → Network tab → set throttle to "Offline". Reload the page.',
  },
  {
    step: 'Verify static pages render',
    detail: 'All Phase E analytics pages should load fully — no fetch calls in the critical path.',
  },
  {
    step: 'Check 404 behavior',
    detail: 'Navigate to /does-not-exist. Confirm the custom 404.tsx page loads with BMFFFL branding.',
  },
  {
    step: 'Test ErrorBoundary catch',
    detail: 'Temporarily throw inside a component. Confirm ErrorBoundary renders the fallback UI instead of crashing.',
  },
  {
    step: 'Simulate API timeout (Phase G prep)',
    detail: 'Use a mock delay > 30s in Sleeper API calls. Confirm the timeout handler fires and shows cached data or error state.',
  },
  {
    step: 'Verify stale data badge',
    detail: 'Set a lastUpdated date older than 7 days. Confirm DataFreshnessIndicator shows the "Aging" status.',
  },
  {
    step: 'SSR/hydration check',
    detail: 'Run `next build && next start` and inspect console. Zero hydration mismatch warnings expected.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-semibold">
      <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
      No
    </span>
  );
}

function SectionHeading({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon: React.FC<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
      </div>
      <h2 id={id} className="text-lg font-bold text-white">
        {children}
      </h2>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ErrorHandlingPage() {
  return (
    <>
      <Head>
        <title>Error Handling & Offline Behavior — BMFFFL Resources</title>
        <meta
          name="description"
          content="BMFFFL site error handling design spec — graceful degradation, 404 page, API timeout strategy, and offline testing checklist."
        />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Resources
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3">
            Error Handling &amp; Offline Behavior
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            How the BMFFFL site handles API unavailability, network failures, and edge cases.
            A design spec for current static behavior and planned Phase G live-data resilience.
          </p>
        </header>

        {/* ── Section 1: Graceful Degradation Table ──────────────────────── */}
        <section aria-labelledby="degradation-heading" className="mb-12">
          <SectionHeading id="degradation-heading" icon={WifiOff}>
            Graceful Degradation by Page Type
          </SectionHeading>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="min-w-full text-sm"
                aria-label="Graceful degradation by page type"
              >
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      Page Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      Static Fallback
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      Live Data Shown
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
                    >
                      Offline Behavior
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {FALLBACK_TABLE.map((row, idx) => (
                    <tr
                      key={row.pageType}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      <td className="px-5 py-3 text-slate-200 font-medium whitespace-nowrap">
                        {row.pageType}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <BoolCell value={row.staticFallback} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <BoolCell value={row.liveDataShown} />
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">
                        {row.offlineBehavior}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Section 2: 404 Page Note ───────────────────────────────────── */}
        <section aria-labelledby="not-found-heading" className="mb-12">
          <SectionHeading id="not-found-heading" icon={FileText}>
            Custom 404 Page
          </SectionHeading>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Custom 404.tsx Exists</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A custom <code className="px-1.5 py-0.5 rounded bg-[#0f2744] text-[#ffd700] font-mono text-xs">404.tsx</code> page
                  is deployed at <code className="px-1.5 py-0.5 rounded bg-[#0f2744] text-slate-300 font-mono text-xs">/src/pages/404.tsx</code>.
                  It renders with full BMFFFL branding — dark navy background, gold accents, and a
                  link back to the home page — ensuring visitors are never dropped into a generic
                  Next.js or hosting-provider error screen.
                </p>
                <p className="text-sm text-slate-500">
                  No API calls are made on the 404 page. It is a fully static route with no
                  runtime dependencies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: API Timeout Strategy ───────────────────────────── */}
        <section aria-labelledby="timeout-heading" className="mb-12">
          <SectionHeading id="timeout-heading" icon={Clock}>
            API Timeout Strategy (Phase G Design Spec)
          </SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
            {/* Timeout threshold */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                Timeout Threshold
              </p>
              <p className="text-3xl font-black text-[#ffd700]">30s</p>
              <p className="text-xs text-slate-500 mt-1">
                All Sleeper API calls will abort after 30 seconds if no response is received.
              </p>
            </div>

            {/* Cache fallback */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                Cached Data Fallback
              </p>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-emerald-400">Enabled</span>
              </div>
              <p className="text-xs text-slate-500">
                On timeout or API error, the last successful response is served from a local
                cache with a visible stale-data warning badge.
              </p>
            </div>

            {/* Error visibility */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                User-Visible Error State
              </p>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-yellow-400">Non-blocking</span>
              </div>
              <p className="text-xs text-slate-500">
                Errors are surfaced inline via a dismissible banner — never as full-page crashes.
                Core navigation remains functional.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Timeout Flow (Planned)</h3>
            <ol className="space-y-2.5">
              {[
                'Request sent to Sleeper API with AbortController signal (30s limit)',
                'On success → render live data, update local cache entry with timestamp',
                'On timeout → abort request, check local cache for previous response',
                'If cache hit → render cached data + show "Data may be outdated" warning badge',
                'If no cache → render skeleton loader placeholder + inline error message',
                'Retry button offered to the user — no automatic re-fetch loop',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#0f2744] border border-[#2d4a66] text-[#ffd700] text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Section 4: Static vs Live ──────────────────────────────────── */}
        <section aria-labelledby="static-vs-live-heading" className="mb-12">
          <SectionHeading id="static-vs-live-heading" icon={Wifi}>
            Static vs. Live Data Pages
          </SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Static */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <h3 className="text-base font-bold text-emerald-400">All Current Pages — Static</h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Every page currently deployed (Phase A–F) is fully static. No runtime network
                calls are made. Data is bundled at build time or hardcoded.
              </p>
              <ul className="space-y-1.5">
                {[
                  'Dynasty Roster Values',
                  'Owner Performance Dashboard',
                  'Head-to-Head Records',
                  'Trade Ledger & Analyzer',
                  'Dynasty Rankings',
                  'Mock Draft Simulator',
                  'All resources / constitution / about pages',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Live (Phase G) */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-slate-500" aria-hidden="true" />
                <h3 className="text-base font-bold text-slate-400">Phase G — Needs Live Data</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                The following planned features require live Sleeper API responses and will not
                have static fallbacks for all content.
              </p>
              <ul className="space-y-1.5">
                {[
                  'Live Sleeper roster sync',
                  'Real-time scoring during NFL season',
                  'Waiver wire transaction feed',
                  'Automated trade history import',
                  'FAAB bid results and alerts',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d4a66] shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Section 5: Testing Checklist ───────────────────────────────── */}
        <section aria-labelledby="testing-heading" className="mb-10">
          <SectionHeading id="testing-heading" icon={ClipboardList}>
            Offline Behavior Testing Checklist
          </SectionHeading>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <ul
              aria-label="Offline testing steps"
              className="divide-y divide-[#1e3347]"
            >
              {TESTING_CHECKLIST.map((item, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'flex items-start gap-4 px-5 py-4 transition-colors duration-100 hover:bg-[#1f3550]',
                    idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#0f2744] border border-[#2d4a66] text-[#ffd700] text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.step}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer note */}
        <footer className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            This page is a static design document. No runtime fetches are performed. For
            questions about the error handling implementation plan, see the project roadmap or
            open a discussion in the BMFFFL GitHub repository.
          </p>
        </footer>

      </div>
    </>
  );
}
