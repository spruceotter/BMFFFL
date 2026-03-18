import Head from 'next/head';
import Link from 'next/link';
import {
  Database,
  Globe,
  Code,
  Zap,
  Clock,
  ArrowRight,
  Server,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EndpointRow {
  method: string;
  path: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ENDPOINTS: EndpointRow[] = [
  {
    method: 'GET',
    path: '/league/{league_id}',
    description: 'League settings — scoring, roster limits, playoff format',
  },
  {
    method: 'GET',
    path: '/league/{league_id}/rosters',
    description: 'All roster data — players, picks, taxi, IR for every team',
  },
  {
    method: 'GET',
    path: '/league/{league_id}/matchups/{week}',
    description: 'Matchup scores for a given week — points, starters, bench',
  },
  {
    method: 'GET',
    path: '/league/{league_id}/transactions/{round}',
    description: 'Trade and waiver history by transaction round',
  },
  {
    method: 'GET',
    path: '/players/nfl',
    description: 'Full NFL player database — large response, cache aggressively',
  },
];

const FUTURE_STEPS = [
  'Replace static JSON exports with server-side Sleeper API calls at build time or via ISR',
  'Add a Next.js API route (or edge function) to proxy Sleeper requests and avoid CORS',
  'Cache /players/nfl locally — it is ~2 MB and changes infrequently',
  'Use NEXT_PUBLIC_SLEEPER_LEAGUE_ID (already in .env) to scope all requests',
  'Schedule nightly rebuilds or use on-demand revalidation for score updates',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  id,
  label,
  title,
}: {
  icon: React.ElementType;
  id: string;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
          {label}
        </p>
        <h2 id={id} className="text-lg font-black text-white leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl p-6 bg-[#16213e] border border-[#2d4a66]', className)}>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#2d4a66]/60 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium leading-snug">{value}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <>
      <Head>
        <title>Data Pipeline &amp; API Docs — BMFFFL</title>
        <meta
          name="description"
          content="How the BMFFFL site gets its data. Sleeper API endpoints, static data architecture, rate limits, and future integration roadmap."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-[#ffd700] transition-colors duration-150">Resources</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">API Docs</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Developer Reference
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            BMFFFL Data Pipeline<br className="hidden sm:block" /> Documentation
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            How this site gets its data. Written for developers and curious managers who want to
            understand the architecture behind the stats, standings, and history pages.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Row 1: Data Sources + Current Implementation ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Data Sources */}
          <section aria-labelledby="sources-heading">
            <Card>
              <SectionHeader
                icon={Database}
                id="sources-heading"
                label="Architecture"
                title="Data Sources"
              />
              <div className="space-y-0">
                <InfoRow
                  icon={Globe}
                  label="Sleeper API"
                  value="Public REST API — no authentication required. Base URL: https://api.sleeper.app/v1"
                />
                <InfoRow
                  icon={Database}
                  label="Hardcoded Historical Data"
                  value="Pre-2020 seasons, all-time records, team names, and award history are stored as static TypeScript data files."
                />
                <InfoRow
                  icon={Server}
                  label="Static Export"
                  value="Next.js output: 'export' — all pages are pre-rendered HTML. No server runtime."
                />
              </div>
              <div className="mt-5 rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] mb-2">
                  League ID
                </p>
                <code className="block text-sm font-mono text-slate-200 break-all">
                  NEXT_PUBLIC_SLEEPER_LEAGUE_ID<br />
                  = 910140889474326528
                </code>
              </div>
            </Card>
          </section>

          {/* Current Implementation */}
          <section aria-labelledby="current-heading">
            <Card>
              <SectionHeader
                icon={Server}
                id="current-heading"
                label="Status"
                title="Current Implementation"
              />

              <div className="rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 p-4 mb-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-slate-200 leading-relaxed">
                    The site is fully static. All data is hardcoded. The Sleeper API is
                    available for future dynamic features.
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { ok: true, label: 'Static JSON/TS data files', note: 'Season history, records, rosters' },
                  { ok: true, label: 'No API keys required', note: 'Sleeper API is public' },
                  { ok: true, label: 'Zero server costs', note: 'Deployable to GitHub Pages or Vercel' },
                  { ok: false, label: 'Live score updates', note: 'Not yet implemented' },
                  { ok: false, label: 'Real-time roster sync', note: 'Requires dynamic fetch or ISR' },
                  { ok: false, label: 'Automated transaction feed', note: 'Future integration' },
                ].map(({ ok, label, note }) => (
                  <li key={label} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {ok
                        ? <CheckCircle className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                        : <div className="w-4 h-4 rounded-full border-2 border-slate-600" aria-hidden="true" />
                      }
                    </div>
                    <div>
                      <p className={cn('text-sm font-semibold leading-snug', ok ? 'text-white' : 'text-slate-500')}>
                        {label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        </div>

        {/* ── Key Endpoints ─────────────────────────────────────────────── */}
        <section aria-labelledby="endpoints-heading">
          <Card>
            <SectionHeader
              icon={Zap}
              id="endpoints-heading"
              label="Sleeper REST API"
              title="Key Endpoints Used"
            />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-[#2d4a66]">
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-16">
                      Method
                    </th>
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-2/5">
                      Path
                    </th>
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((row, i) => (
                    <tr
                      key={row.path}
                      className={cn(
                        'border-b border-[#2d4a66]/50 last:border-0 transition-colors duration-100',
                        i % 2 === 0 ? 'bg-transparent' : 'bg-[#0d1b2a]/40'
                      )}
                    >
                      <td className="py-2.5 px-3">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30 tracking-wider">
                          {row.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <code className="text-xs font-mono text-slate-200 break-all leading-snug">
                          {row.path}
                        </code>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-xs leading-snug">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 mt-4">
              Base URL: <code className="font-mono text-slate-400">https://api.sleeper.app/v1</code>
              &nbsp;&mdash; All responses are JSON. No authentication header required.
            </p>
          </Card>
        </section>

        {/* ── Row 2: Rate Limits + Future Integration ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Rate Limits */}
          <section aria-labelledby="ratelimits-heading">
            <Card>
              <SectionHeader
                icon={Clock}
                id="ratelimits-heading"
                label="Sleeper API"
                title="Rate Limits"
              />
              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4 mb-4">
                <p className="text-sm text-slate-200 leading-relaxed">
                  Sleeper does not publish an official rate limit. In practice, keep requests
                  under <strong className="text-white">5 per second</strong>. Burst above that
                  and you may receive transient 429s.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'No auth token needed', detail: 'All league endpoints are public-read' },
                  { label: 'Cache /players/nfl', detail: 'Large payload (~2 MB) — update weekly at most' },
                  { label: 'Batch by week', detail: 'Fetch matchups week-by-week, not all at once' },
                  { label: 'Be a good citizen', detail: 'Sleeper is free — do not hammer their API' },
                ].map(({ label, detail }) => (
                  <li key={label} className="flex items-start gap-3 py-2.5 border-b border-[#2d4a66]/60 last:border-0">
                    <CheckCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-white leading-snug">{label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Future Integration */}
          <section aria-labelledby="future-heading">
            <Card>
              <SectionHeader
                icon={Zap}
                id="future-heading"
                label="Roadmap"
                title="Future Integration"
              />
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                What would be needed to make this site data-live — pulling from Sleeper in
                real time rather than relying on hardcoded exports.
              </p>
              <ol className="space-y-3">
                {FUTURE_STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 py-2.5 border-b border-[#2d4a66]/60 last:border-0">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[10px] font-black text-[#ffd700] mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-snug">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </div>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/resources/contribute"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Contribute
            </Link>
            <Link
              href="/resources/webhooks"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Webhook Design
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              All Resources
            </Link>
          </div>
          <p className="text-[11px] text-slate-600">
            BMFFFL Developer Reference &middot; Static Build
          </p>
        </div>

      </div>
    </>
  );
}
