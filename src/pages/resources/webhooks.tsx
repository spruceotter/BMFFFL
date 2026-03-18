import Head from 'next/head';
import Link from 'next/link';
import {
  Webhook,
  ArrowRight,
  AlertCircle,
  Server,
  Code2,
  GitBranch,
  Repeat,
  Users,
  Activity,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebhookEvent {
  event: string;
  trigger: string;
  useCase: string;
  icon: React.ElementType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    event: 'traded_picks',
    trigger: 'Trade submitted',
    useCase: 'Update trade ledger, send trade alert notifications',
    icon: Repeat,
  },
  {
    event: 'roster',
    trigger: 'Roster change (add, drop, claim)',
    useCase: 'Update rosters page, trigger waiver move alerts',
    icon: Users,
  },
  {
    event: 'matchup_score',
    trigger: 'Score update during game week',
    useCase: 'Power live scoring page with real-time data',
    icon: Activity,
  },
  {
    event: 'league',
    trigger: 'League settings changed',
    useCase: 'Refresh rules page, notify owners of changes',
    icon: Settings,
  },
];

const PSEUDO_CODE = `// /api/webhook.ts — Vercel Serverless Function

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Verify Sleeper signature (HMAC-SHA256)
  const signature = req.headers['x-sleeper-signature'] as string;
  const secret    = process.env.SLEEPER_WEBHOOK_SECRET!;
  const body      = JSON.stringify(req.body);
  const expected  = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expected) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 3. Route on event type
  const { type, data } = req.body as { type: string; data: unknown };

  switch (type) {
    case 'traded_picks':
      await processTrade(data);
      await sendPushToSubscribers({ title: '🔄 Trade Alert', body: 'A trade was just processed!' });
      break;

    case 'roster':
      await updateRosters(data);
      await sendPushToSubscribers({ title: '✂️ Waiver Move', body: 'A player was added or dropped.' });
      break;

    case 'matchup_score':
      await updateLiveScores(data);
      break;

    case 'league':
      await refreshLeagueSettings(data);
      break;

    default:
      console.warn('Unknown event type:', type);
  }

  return res.status(200).json({ ok: true });
}

// --- Stubs (to be implemented) ---

async function processTrade(_data: unknown)          { /* update KV / DB */ }
async function updateRosters(_data: unknown)         { /* update KV / DB */ }
async function updateLiveScores(_data: unknown)      { /* push to SSE or KV */ }
async function refreshLeagueSettings(_data: unknown) { /* update KV / DB */ }

async function sendPushToSubscribers(_payload: { title: string; body: string }) {
  // Fetch all subscriptions from KV store
  // Loop and send via web-push library with VAPID keys
  // Handle expired subscriptions (410 Gone → delete from store)
}
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl p-6 bg-[#16213e] border border-[#2d4a66]', className)}>
      {children}
    </div>
  );
}

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

// ─── Architecture Diagram ─────────────────────────────────────────────────────

function ArchDiagram() {
  const boxes = [
    { label: 'Sleeper', sub: 'Event fires', color: 'border-[#2d4a66] bg-[#0d1b2a]' },
    { label: 'POST /api/webhook', sub: 'Vercel Function', color: 'border-[#ffd700]/40 bg-[#ffd700]/5' },
    { label: 'Verify Signature', sub: 'HMAC-SHA256', color: 'border-[#2d4a66] bg-[#0d1b2a]' },
    { label: 'Process Event', sub: 'Route on type', color: 'border-[#2d4a66] bg-[#0d1b2a]' },
    { label: 'Update Data', sub: 'KV / Database', color: 'border-[#2d4a66] bg-[#0d1b2a]' },
    { label: 'Send Push', sub: 'Web Push API', color: 'border-[#2d4a66] bg-[#0d1b2a]' },
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-2 min-w-max">
        {boxes.map((box, i) => (
          <div key={box.label} className="flex items-center gap-2">
            <div
              className={cn(
                'rounded-xl border px-4 py-3 text-center min-w-[120px]',
                box.color
              )}
            >
              <p className="text-xs font-bold text-white leading-snug">{box.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{box.sub}</p>
            </div>
            {i < boxes.length - 1 && (
              <ArrowRight className="w-4 h-4 text-[#ffd700]/50 shrink-0" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
      {/* Split arrow for last two steps */}
      <div className="mt-3 pl-4 text-[11px] text-slate-500 italic">
        ↳ &quot;Process Event&quot; fans out to both &quot;Update Data&quot; and &quot;Send Push&quot; in parallel
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebhooksPage() {
  return (
    <>
      <Head>
        <title>Sleeper Webhook Design — BMFFFL</title>
        <meta
          name="description"
          content="Technical design document for the BMFFFL Sleeper webhook integration — real-time site updates for trades, roster moves, and scoring."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-slate-500 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-[#ffd700] transition-colors duration-150">
              Resources
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Webhook Design</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Webhook className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Technical Design · Task 802
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Sleeper Webhook<br className="hidden sm:block" /> Design Doc
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            A technical design document for integrating Sleeper webhooks — the future system
            that would enable real-time site updates when trades, roster moves, and scoring
            events happen in the league.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Section 1: What Are Sleeper Webhooks ─────────────────────── */}
        <section aria-labelledby="what-are-webhooks-heading">
          <Card>
            <SectionHeader
              icon={Webhook}
              id="what-are-webhooks-heading"
              label="Section 1"
              title="What Are Sleeper Webhooks?"
            />
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
              <p>
                A <strong className="text-white">webhook</strong> is an HTTP callback — instead of
                your app polling Sleeper&apos;s API repeatedly (&ldquo;did anything change yet?&rdquo;),
                Sleeper <em>proactively POSTs</em> a JSON payload to a URL you control the instant
                something happens in your league.
              </p>
              <p>
                This is far more efficient than polling, and it&apos;s what enables genuinely
                real-time features: live scoring, instant trade alerts, and push notifications
                that fire the moment a transaction clears — not minutes later.
              </p>
              <p>
                Each payload is signed with an <strong className="text-white">HMAC-SHA256</strong> signature
                so your server can verify it actually came from Sleeper and hasn&apos;t been tampered with.
              </p>
            </div>
          </Card>
        </section>

        {/* ── Section 2: Events We'd Subscribe To ─────────────────────── */}
        <section aria-labelledby="events-heading">
          <Card>
            <SectionHeader
              icon={GitBranch}
              id="events-heading"
              label="Section 2"
              title="Events We&apos;d Subscribe To"
            />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-[#2d4a66]">
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-[22%]">
                      Event
                    </th>
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-[32%]">
                      Trigger
                    </th>
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Use Case
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WEBHOOK_EVENTS.map((ev, i) => (
                    <tr
                      key={ev.event}
                      className={cn(
                        'border-b border-[#2d4a66]/50 last:border-0 transition-colors duration-100',
                        i % 2 === 0 ? 'bg-transparent' : 'bg-[#0d1b2a]/40'
                      )}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <ev.icon className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
                          <code className="text-xs font-mono text-[#ffd700] font-bold">
                            {ev.event}
                          </code>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-xs leading-snug">
                        {ev.trigger}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-xs leading-snug">
                        {ev.useCase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* ── Section 3: Implementation Architecture ───────────────────── */}
        <section aria-labelledby="architecture-heading">
          <Card>
            <SectionHeader
              icon={Server}
              id="architecture-heading"
              label="Section 3"
              title="Implementation Architecture"
            />
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-2xl">
              The data flow from a Sleeper event to a delivered push notification:
            </p>
            <ArchDiagram />
          </Card>
        </section>

        {/* ── Section 4: Static Site Limitation ───────────────────────── */}
        <section aria-labelledby="limitation-heading">
          <div className="rounded-2xl border-2 border-[#e94560]/40 bg-[#16213e] overflow-hidden">
            <div className="px-6 py-4 bg-[#e94560]/8 border-b-2 border-[#e94560]/30 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#e94560]/15 border border-[#e94560]/40 shrink-0">
                <AlertCircle className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#e94560]/70 mb-0.5">
                  Section 4 · Architecture Constraint
                </p>
                <h2 id="limitation-heading" className="text-lg font-black text-white leading-tight">
                  Static Site Limitation
                </h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed">
                This site is built with Next.js{' '}
                <code className="text-xs font-mono bg-[#0d1b2a] border border-[#2d4a66] rounded px-1.5 py-0.5 text-[#ffd700]">
                  output: &apos;export&apos;
                </code>{' '}
                — meaning the build output is a folder of static HTML, CSS, and JS files with
                no server runtime.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">API routes don&apos;t exist in a static export.</strong>{' '}
                There is no Next.js server to receive a{' '}
                <code className="text-xs font-mono bg-[#0d1b2a] border border-[#2d4a66] rounded px-1.5 py-0.5 text-slate-300">
                  POST /api/webhook
                </code>{' '}
                from Sleeper.
              </p>
              <div className="rounded-xl bg-[#0d1b2a] border border-[#e94560]/30 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#e94560] mb-2">
                  Required: Vercel Serverless Function
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To implement webhooks, the project needs to either:{' '}
                  <strong className="text-white">remove <code className="font-mono">output: &apos;export&apos;</code></strong>{' '}
                  and deploy as a Vercel Node.js app, or add a separate{' '}
                  <strong className="text-white">Vercel Serverless / Edge Function</strong>{' '}
                  alongside the static site that handles only the webhook endpoint. The static
                  pages themselves can stay exactly as they are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Code Sketch ───────────────────────────────────── */}
        <section aria-labelledby="code-sketch-heading">
          <Card>
            <SectionHeader
              icon={Code2}
              id="code-sketch-heading"
              label="Section 5"
              title="Code Sketch"
            />
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-2xl">
              Pseudocode for a Vercel serverless function that handles Sleeper webhook events.
              Not actually implemented — this is the design target.
            </p>

            <div className="rounded-xl bg-[#0a1628] border border-[#2d4a66] overflow-hidden">
              {/* Code block header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2d4a66] bg-[#0d1b2a]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  <span className="text-[11px] font-mono text-slate-400">
                    api/webhook.ts — pseudocode
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Design Only
                </span>
              </div>
              {/* Code content */}
              <pre className="overflow-x-auto p-4 text-[11px] leading-relaxed text-slate-300 font-mono">
                <code>{PSEUDO_CODE}</code>
              </pre>
            </div>
          </Card>
        </section>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/resources/notifications"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Push Notifications Design
            </Link>
            <Link
              href="/resources/sleeper-guide"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Sleeper Guide
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              All Resources
            </Link>
          </div>
          <p className="text-[11px] text-slate-600">Task 802 &middot; BMFFFL Technical Design</p>
        </div>

      </div>
    </>
  );
}
