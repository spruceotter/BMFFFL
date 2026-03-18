import Head from 'next/head';
import { BarChart2, CheckCircle2, Code2, Globe, Eye, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  id: number;
  title: string;
  code?: string;
  lang?: string;
  note?: string;
}

interface PagePrediction {
  path: string;
  label: string;
  rank: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATION_STEPS: Step[] = [
  {
    id: 1,
    title: 'Install the package',
    code: 'npm install @vercel/analytics',
    lang: 'bash',
  },
  {
    id: 2,
    title: 'Import Analytics in _app.tsx',
    code: `import { Analytics } from '@vercel/analytics/react';`,
    lang: 'typescript',
  },
  {
    id: 3,
    title: 'Add <Analytics /> to the component tree',
    code: `export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}`,
    lang: 'typescript',
    note: 'Place it inside the root component alongside your Layout wrapper.',
  },
  {
    id: 4,
    title: 'Deploy to Vercel',
    note: 'Once deployed, the Analytics dashboard appears automatically in the Vercel project settings. No additional configuration required.',
  },
];

const WHAT_CAPTURES = [
  {
    icon: Eye,
    label: 'Page Views',
    desc: 'Every page navigation is tracked, including client-side route changes via the Next.js router.',
  },
  {
    icon: Globe,
    label: 'Unique Visitors',
    desc: 'Distinct visitor counts per page and per session — without cookies or fingerprinting.',
  },
  {
    icon: BarChart2,
    label: 'Top Pages',
    desc: 'Ranked list of the most-visited pages, filterable by time window (24h, 7d, 30d).',
  },
  {
    icon: ExternalLink,
    label: 'Referrers',
    desc: 'Where visitors come from — direct, search engines, social media, or external links.',
  },
  {
    icon: Clock,
    label: 'Peak Usage Times',
    desc: 'Hour-by-hour and day-of-week traffic patterns to understand when the league is most active.',
  },
];

const PAGE_PREDICTIONS: PagePrediction[] = [
  { rank: 1, path: '/analytics',                    label: 'Analytics Hub' },
  { rank: 2, path: '/owners/mlschools12',            label: 'MLSchools12 Owner Page' },
  { rank: 3, path: '/history/standings',             label: 'Historical Standings' },
  { rank: 4, path: '/analytics/dynasty-rankings',   label: 'Dynasty Rankings' },
  { rank: 5, path: '/analytics/power-rankings',     label: 'Power Rankings' },
  { rank: 6, path: '/analytics/trade-analyzer',     label: 'Trade Analyzer' },
  { rank: 7, path: '/analytics/weekly-recap',       label: 'Weekly Recap' },
  { rank: 8, path: '/analytics/sleeper-live',       label: 'Sleeper Live Scores' },
];

const ALTERNATIVES = [
  {
    name: 'Plausible Analytics',
    url: 'https://plausible.io',
    desc: 'Open-source, self-hostable, EU-based. No cookies, GDPR-compliant out of the box. Paid SaaS or self-hosted.',
  },
  {
    name: 'Fathom Analytics',
    url: 'https://usefathom.com',
    desc: 'Privacy-first, simple dashboard. Cookieless. Paid SaaS with a clean API and embed options.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] overflow-x-auto">
      {lang && (
        <div className="px-4 py-2 border-b border-[#1e3a52] flex items-center gap-2">
          <Code2 className="w-3 h-3 text-slate-600" aria-hidden="true" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600">
            {lang}
          </span>
        </div>
      )}
      <pre className="px-4 py-3 text-sm font-mono text-slate-200 overflow-x-auto whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsIntegrationPage() {
  return (
    <>
      <Head>
        <title>Analytics Integration — BMFFFL</title>
        <meta
          name="description"
          content="Documentation for adding Vercel Analytics to the BMFFFL dynasty fantasy football website. Privacy-first, cookieless page view tracking."
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <header>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Site Infrastructure
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Analytics Integration
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            How to add privacy-first page view tracking to the BMFFFL site using Vercel Analytics.
            No cookies, no consent banners.
          </p>
        </header>

        {/* ── Current Status Banner ──────────────────────────────────────── */}
        <div className="flex items-start gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-0.5">Current Status</p>
            <p className="text-sm text-slate-400">
              Not yet integrated. Pending Vercel deployment. Once the site is deployed to Vercel,
              follow the steps below — it takes under 5 minutes.
            </p>
          </div>
        </div>

        {/* ── What Analytics Captures ────────────────────────────────────── */}
        <section aria-labelledby="what-captures-heading">
          <h2 id="what-captures-heading" className="text-xl font-bold text-white mb-1">
            What Analytics Captures
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Vercel Analytics is privacy-first — no cookies, no personal data, no GDPR consent required.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_CAPTURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4"
              >
                <div className="shrink-0 p-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] mt-0.5">
                  <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Integration Steps ──────────────────────────────────────────── */}
        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="text-xl font-bold text-white mb-5">
            Integration Steps
          </h2>

          <div className="space-y-5">
            {INTEGRATION_STEPS.map((step) => (
              <div key={step.id} className="flex gap-4">
                {/* Step number */}
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-black text-[#ffd700]">{step.id}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-2">{step.title}</p>
                  {step.code && <CodeBlock code={step.code} lang={step.lang} />}
                  {step.note && (
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{step.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── What We'd Track ────────────────────────────────────────────── */}
        <section aria-labelledby="predictions-heading">
          <h2 id="predictions-heading" className="text-xl font-bold text-white mb-1">
            What We&rsquo;d Track
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Predicted top pages based on content depth and likely owner interest.
          </p>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#2d4a66] grid grid-cols-[2rem_1fr_auto] gap-3 items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">#</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Page</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Path</span>
            </div>
            <div className="divide-y divide-[#1e3a52]">
              {PAGE_PREDICTIONS.map((p) => (
                <div
                  key={p.rank}
                  className="px-5 py-3 grid grid-cols-[2rem_1fr_auto] gap-3 items-center hover:bg-[#1a2d42]/50 transition-colors duration-100"
                >
                  <span className={cn(
                    'text-sm font-black tabular-nums',
                    p.rank === 1 ? 'text-[#ffd700]' : p.rank <= 3 ? 'text-slate-300' : 'text-slate-600'
                  )}>
                    {p.rank}
                  </span>
                  <span className="text-sm text-white font-medium">{p.label}</span>
                  <span className="text-xs font-mono text-slate-500 hidden sm:block">{p.path}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Top Referrer Prediction', value: 'Direct / Sleeper app' },
              { label: 'Peak Usage Window', value: 'Sun–Mon during NFL season' },
              { label: 'Avg Session Prediction', value: '3–5 pages per visit' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Alternative: Self-Hosted ───────────────────────────────────── */}
        <section aria-labelledby="alternatives-heading">
          <h2 id="alternatives-heading" className="text-xl font-bold text-white mb-1">
            Alternative: Self-Hosted Options
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            If Vercel Analytics doesn&rsquo;t fit, these privacy-friendly alternatives are worth considering.
          </p>

          <div className="space-y-3">
            {ALTERNATIVES.map((alt) => (
              <div
                key={alt.name}
                className="flex items-start gap-4 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">
                    {alt.name}
                    <span className="ml-2 text-xs font-mono text-slate-500">{alt.url}</span>
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{alt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
