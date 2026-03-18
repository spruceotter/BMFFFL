import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Bell,
  ArrowRight,
  Repeat,
  Scissors,
  Megaphone,
  Trophy,
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Server,
  Smartphone,
  Globe,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotifType {
  emoji: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface TechStep {
  step: number;
  title: string;
  description: string;
}

interface RequirementItem {
  label: string;
  detail: string;
  icon: React.ElementType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NOTIFICATION_TYPES: NotifType[] = [
  {
    emoji: '🔄',
    title: 'Trade Alert',
    description: 'When a trade is submitted or processed',
    icon: Repeat,
  },
  {
    emoji: '✂️',
    title: 'Waiver Move',
    description: 'When a player is dropped or claimed',
    icon: Scissors,
  },
  {
    emoji: '📣',
    title: 'Commish Speaks',
    description: 'New article from Commissioner Grandes',
    icon: Megaphone,
  },
  {
    emoji: '🏆',
    title: 'Playoff Clinch',
    description: 'When a team clinches or is eliminated',
    icon: Trophy,
  },
  {
    emoji: '⚠️',
    title: 'Lineup Alert',
    description: '48hrs before kickoff with inactive players starting',
    icon: AlertTriangle,
  },
  {
    emoji: '📊',
    title: 'Weekly Recap',
    description: "Monday morning: your week's results",
    icon: BarChart2,
  },
];

const TECH_STEPS: TechStep[] = [
  {
    step: 1,
    title: 'Browser asks permission',
    description:
      'On first visit (or when you click "Enable Notifications"), the browser displays a native permission dialog. You can allow or deny — no permission, no push.',
  },
  {
    step: 2,
    title: 'Service worker registers',
    description:
      'A small background script (service worker) is installed in your browser. It stays resident even when the site tab is closed, ready to receive push messages.',
  },
  {
    step: 3,
    title: 'Sleeper webhook fires',
    description:
      'When a trade is processed, a player is dropped, or another key event happens in the league, Sleeper POSTs a signed payload to our server endpoint.',
  },
  {
    step: 4,
    title: 'Our server sends push',
    description:
      'The server verifies the webhook signature, determines which owners should be notified, and fans out Web Push messages to each subscribed browser.',
  },
];

const REQUIREMENTS: RequirementItem[] = [
  {
    label: 'Server component',
    detail: "Can't do this with static export alone — requires a live server endpoint to receive Sleeper webhook POSTs.",
    icon: Server,
  },
  {
    label: 'Vercel serverless / edge function',
    detail: 'A single `/api/webhook` route deployed as a Vercel Function handles both Sleeper events and Web Push dispatch.',
    icon: Zap,
  },
  {
    label: 'Web Push API + VAPID keys',
    detail: 'VAPID (Voluntary Application Server Identification) key pair signs push messages so browsers can verify our identity.',
    icon: Globe,
  },
  {
    label: 'Sleeper webhook integration',
    detail: 'Commissioner registers our webhook URL in Sleeper settings. Sleeper signs each payload with a shared secret.',
    icon: Repeat,
  },
  {
    label: 'Subscription storage',
    detail: 'Each browser push subscription endpoint must be persisted (e.g., Vercel KV or a small database) so the server knows where to send messages.',
    icon: Smartphone,
  },
];

const BROWSER_SUPPORT = [
  { name: 'Chrome (Android & Desktop)', supported: true },
  { name: 'Firefox', supported: true },
  { name: 'Edge', supported: true },
  { name: 'Safari — iOS 16.4+ & macOS Ventura+', supported: true },
  { name: 'Safari — iOS 16.3 and below', supported: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl p-6 bg-[#16213e] border border-[#2d4a66]', className)}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
      {children}
    </p>
  );
}

function NotifCard({ notif }: { notif: NotifType }) {
  return (
    <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4 flex items-start gap-3">
      <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
        {notif.emoji}
      </span>
      <div>
        <p className="text-sm font-bold text-white leading-snug">{notif.title}</p>
        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{notif.description}</p>
      </div>
    </div>
  );
}

function StepItem({ step }: { step: TechStep }) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center">
        <span className="text-xs font-black text-[#ffd700]">{step.step}</span>
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-bold text-white leading-snug">{step.title}</p>
        <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

// ─── Subscribe Preview ────────────────────────────────────────────────────────

function SubscribePreview() {
  const [showModal, setShowModal] = useState(false);
  const [granted, setGranted] = useState(false);

  function handleAllow() {
    setGranted(true);
    setShowModal(false);
  }

  function handleBlock() {
    setShowModal(false);
  }

  return (
    <div>
      {/* Trigger button */}
      <div className="flex flex-col items-center gap-4">
        {granted ? (
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30">
            <CheckCircle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-sm font-bold text-[#ffd700]">Notifications Enabled</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={cn(
              'inline-flex items-center gap-2.5 px-6 py-3 rounded-xl',
              'bg-[#ffd700] text-[#0d1b2a] font-black text-sm',
              'hover:bg-[#ffe840] transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/50'
            )}
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            Enable Notifications
          </button>
        )}
        <p className="text-[11px] text-slate-500 text-center max-w-xs">
          Design preview only — not actually functional yet. This shows what the permission flow
          would look like.
        </p>
      </div>

      {/* Modal backdrop */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="permission-modal-title"
        >
          {/* Mock browser permission dialog */}
          <div className="w-80 rounded-2xl bg-[#1e2a3a] border border-[#2d4a66] shadow-2xl overflow-hidden">
            {/* Chrome-style header */}
            <div className="bg-[#0d1b2a] border-b border-[#2d4a66] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-4 bg-[#1a2a3a] rounded-md px-3 py-1">
                <p className="text-[10px] text-slate-400 font-mono truncate">bmfffl.com</p>
              </div>
            </div>

            {/* Permission prompt */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                </div>
                <div>
                  <p
                    id="permission-modal-title"
                    className="text-sm font-bold text-white leading-snug"
                  >
                    BMFFFL wants to send notifications
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">bmfffl.com</p>
                </div>
              </div>

              <p className="text-[12px] text-slate-400 leading-relaxed mb-5">
                Get alerted for trades, waiver moves, lineup reminders, and Commissioner
                announcements — even when the tab is closed.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBlock}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-slate-400 bg-[#0d1b2a] border border-[#2d4a66] hover:border-slate-500 hover:text-white transition-colors duration-150"
                >
                  Block
                </button>
                <button
                  type="button"
                  onClick={handleAllow}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-[#0d1b2a] bg-[#ffd700] hover:bg-[#ffe840] transition-colors duration-150"
                >
                  Allow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  return (
    <>
      <Head>
        <title>Push Notifications — Coming in Season 7 — BMFFFL</title>
        <meta
          name="description"
          content="Design preview for BMFFFL browser push notifications — trade alerts, waiver moves, lineup reminders, and more. Coming in Season 7."
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
            <span className="text-slate-300">Push Notifications</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Feature Design · Task 812
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Push Notifications
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            A design preview and technical overview for browser push notifications — the future
            system that will alert BMFFFL managers to key league events in real time.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Section 1: What's Coming ─────────────────────────────────── */}
        <section aria-labelledby="whats-coming-heading">
          <div className="rounded-2xl border-2 border-[#ffd700]/40 bg-[#16213e] overflow-hidden">
            <div className="px-6 py-5 bg-[#ffd700]/8 border-b-2 border-[#ffd700]/30 flex items-center gap-4">
              <span className="text-4xl" aria-hidden="true">🔔</span>
              <div>
                <SectionLabel>What&apos;s Coming</SectionLabel>
                <h2 id="whats-coming-heading" className="text-2xl font-black text-white leading-tight">
                  Push Notifications — Coming in Season 7
                </h2>
              </div>
            </div>
            <div className="px-6 py-6">
              <p className="text-slate-300 leading-relaxed max-w-3xl">
                BMFFFL is planning native browser push notifications for key league events.
                This means you&apos;ll get pinged — even with the tab closed — when a trade
                drops, a waiver claim clears, the Commissioner posts, or your lineup has a
                problem. No more refreshing Sleeper every five minutes on trade deadline day.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
                <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" aria-hidden="true" />
                <span className="text-xs font-bold text-[#ffd700] uppercase tracking-widest">
                  Planned — Not Yet Built
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Notification Types ───────────────────────────── */}
        <section aria-labelledby="notif-types-heading">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                <Bell className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Section 2</SectionLabel>
                <h2 id="notif-types-heading" className="text-lg font-black text-white leading-tight">
                  Notification Types
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {NOTIFICATION_TYPES.map((notif) => (
                <NotifCard key={notif.title} notif={notif} />
              ))}
            </div>
          </Card>
        </section>

        {/* ── Section 3: How It Would Work ─────────────────────────────── */}
        <section aria-labelledby="how-it-works-heading">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Section 3</SectionLabel>
                <h2 id="how-it-works-heading" className="text-lg font-black text-white leading-tight">
                  How It Would Work
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              {TECH_STEPS.map((step) => (
                <StepItem key={step.step} step={step} />
              ))}
            </div>

            {/* Browser support */}
            <div className="mt-6 rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#ffd700] mb-3">
                Browser Support
              </p>
              <ul className="space-y-1.5">
                {BROWSER_SUPPORT.map((b) => (
                  <li key={b.name} className="flex items-center gap-2 text-xs">
                    {b.supported ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-label="Supported" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" aria-label="Not supported" />
                    )}
                    <span className={b.supported ? 'text-slate-300' : 'text-slate-600'}>
                      {b.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* ── Section 4: Subscribe Preview ─────────────────────────────── */}
        <section aria-labelledby="subscribe-preview-heading">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                <Smartphone className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Section 4</SectionLabel>
                <h2 id="subscribe-preview-heading" className="text-lg font-black text-white leading-tight">
                  Subscribe Preview
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xl">
              Click the button below to see a mockup of the browser permission dialog. This
              is a pure CSS/JS design preview — no actual notifications will be sent.
            </p>

            <SubscribePreview />
          </Card>
        </section>

        {/* ── Section 5: Implementation Requirements ───────────────────── */}
        <section aria-labelledby="impl-requirements-heading">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                <Server className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Section 5</SectionLabel>
                <h2 id="impl-requirements-heading" className="text-lg font-black text-white leading-tight">
                  Implementation Requirements
                </h2>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {REQUIREMENTS.map((req) => (
                <div
                  key={req.label}
                  className="flex items-start gap-4 py-3 border-b border-[#2d4a66]/60 last:border-0"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center mt-0.5">
                    <req.icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-snug">{req.label}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{req.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Effort estimate */}
            <div className="rounded-xl bg-[#ffd700]/8 border border-[#ffd700]/30 p-4 flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">⏱️</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ffd700] mb-0.5">
                  Estimated Effort
                </p>
                <p className="text-sm text-white font-semibold">
                  1–2 sprints{' '}
                  <span className="text-slate-400 font-normal">
                    — assuming Vercel deployment, existing Sleeper integration, and a simple KV store
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/resources/webhooks"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Webhook Design Doc
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
          <p className="text-[11px] text-slate-600">Task 812 &middot; BMFFFL Feature Design</p>
        </div>

      </div>
    </>
  );
}
