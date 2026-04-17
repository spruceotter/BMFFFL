import Head from 'next/head';
import Link from 'next/link';
import {
  Bell,
  MessageSquare,
  Calendar,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Circle,
  Repeat,
  Users,
  ScrollText,
  Clock,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickRefRow {
  notificationType: string;
  where: string;
  timing: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_REF: QuickRefRow[] = [
  {
    notificationType: 'Trade offer received',
    where: 'Sleeper app + push',
    timing: 'Immediate',
  },
  {
    notificationType: 'Trade processed',
    where: 'League chat (auto)',
    timing: 'Immediate',
  },
  {
    notificationType: 'FAAB bid results',
    where: 'League chat + push',
    timing: 'Monday / Tuesday morning',
  },
  {
    notificationType: 'Waiver order updated',
    where: 'League chat (auto)',
    timing: 'After waiver run',
  },
  {
    notificationType: 'Free agent add / drop',
    where: 'League chat (auto)',
    timing: 'Immediate',
  },
  {
    notificationType: 'Lineup reminder',
    where: 'Push notification',
    timing: '1 hr before lock',
  },
  {
    notificationType: 'Injury alert',
    where: 'Push notification',
    timing: 'Real-time',
  },
  {
    notificationType: 'Commissioner post',
    where: 'League chat (pinned)',
    timing: 'As issued',
  },
  {
    notificationType: 'Rule change notice',
    where: 'Commissioner post',
    timing: 'Before 24-hr window',
  },
  {
    notificationType: 'Owners meeting reminder',
    where: 'League chat + push',
    timing: '1 week prior',
  },
  {
    notificationType: 'Draft countdown',
    where: 'Push notification',
    timing: '48 hrs, 24 hrs, day-of',
  },
  {
    notificationType: 'Playoff bracket set',
    where: 'League chat (auto)',
    timing: 'End of regular season',
  },
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
    <div
      className={cn(
        'rounded-2xl p-6 bg-[#16213e] border border-[#2d4a66]',
        className
      )}
    >
      {children}
    </div>
  );
}

function NotifItem({
  label,
  on,
  note,
}: {
  label: string;
  on: boolean;
  note?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#2d4a66]/60 last:border-0">
      <div className="shrink-0 mt-0.5">
        {on ? (
          <CheckCircle className="w-4 h-4 text-[#ffd700]" aria-label="Recommended on" />
        ) : (
          <Circle className="w-4 h-4 text-slate-600" aria-label="Optional" />
        )}
      </div>
      <div className="min-w-0">
        <p className={cn('text-sm font-semibold leading-snug', on ? 'text-white' : 'text-slate-400')}>
          {label}
        </p>
        {note && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{note}</p>
        )}
      </div>
      <span
        className={cn(
          'ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
          on
            ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30'
            : 'bg-slate-800 text-slate-500 border border-slate-700'
        )}
      >
        {on ? 'On' : 'Optional'}
      </span>
    </div>
  );
}

function ChannelItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#2d4a66]/60 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white leading-snug">{title}</p>
        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TransactionItem({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#2d4a66]/60 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white leading-snug">{title}</p>
        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

function CalendarItem({
  date,
  event,
  note,
}: {
  date: string;
  event: string;
  note?: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#2d4a66]/60 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center mt-0.5">
        <Calendar className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] mb-0.5">
          {date}
        </p>
        <p className="text-sm font-bold text-white leading-snug">{event}</p>
        {note && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{note}</p>
        )}
      </div>
    </div>
  );
}

function ProtocolItem({ rule }: { rule: string }) {
  return (
    <li className="flex items-start gap-3 py-2.5 border-b border-[#ffd700]/10 last:border-0">
      <ScrollText
        className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-200 leading-relaxed italic">{rule}</p>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SleeperGuidePage() {
  return (
    <>
      <Head>
        <title>League Communication &amp; Sleeper Guide — BMFFFL</title>
        <meta
          name="description"
          content="The authoritative BMFFFL reference for Sleeper app notifications, official communication channels, transaction announcements, and Bimfle's communication protocols."
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
            <span className="text-slate-300">Sleeper Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Official Reference
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            League Communication<br className="hidden sm:block" /> &amp; Sleeper Guide
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            The authoritative BMFFFL reference for how the league uses Sleeper — notification
            settings, official communication channels, transaction announcements, and the
            Commissioner&apos;s protocols for league business.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Row 1: Channels + Notification Settings ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Official Communication Channels */}
          <section aria-labelledby="channels-heading">
            <Card>
              <SectionHeader
                icon={MessageSquare}
                id="channels-heading"
                label="Communication"
                title="Official Communication Channels"
              />
              <div>
                <ChannelItem
                  icon={MessageSquare}
                  title="League Chat"
                  description="The primary forum for all league business — general discussion, trash talk, announcements, and reactions to transactions. All official posts appear here."
                />
                <ChannelItem
                  icon={ScrollText}
                  title="Commissioner Posts"
                  description="Formal announcements from the Commissioner covering rule changes, meeting notices, and binding league decisions. These are pinned and require acknowledgment."
                />
                <ChannelItem
                  icon={Repeat}
                  title="Trade Announcements"
                  description="All completed trades are posted to league chat automatically by Sleeper, accompanied by a Commissioner note when applicable."
                />
                <ChannelItem
                  icon={Bell}
                  title="Waivers & FAAB Results"
                  description="Waiver processing results and FAAB bid outcomes are delivered as automated Sleeper notifications and posted to league chat."
                />
              </div>
            </Card>
          </section>

          {/* Notification Settings Guide */}
          <section aria-labelledby="notifications-heading">
            <Card>
              <SectionHeader
                icon={Bell}
                id="notifications-heading"
                label="Setup"
                title="Notification Settings Guide"
              />

              <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold">
                Recommended for Active Managers
              </p>
              <div className="mb-4">
                <NotifItem
                  label="Trade offers received"
                  on={true}
                  note="Never miss an offer sitting in your queue unread"
                />
                <NotifItem
                  label="Waiver / FAAB results"
                  on={true}
                  note="Know immediately when bids are processed"
                />
                <NotifItem
                  label="Lineup reminders"
                  on={true}
                  note="1-hour alert before weekly lock — prevents forfeit by neglect"
                />
                <NotifItem
                  label="Injury alerts"
                  on={true}
                  note="Real-time updates on your starters and trade targets"
                />
                <NotifItem
                  label="Weekly recaps"
                  on={false}
                  note="Useful but not essential"
                />
                <NotifItem
                  label="Opponent activity"
                  on={false}
                  note="Optional competitive intelligence"
                />
              </div>

              {/* How-to */}
              <div className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">
                    How to Configure
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open Sleeper &rarr; tap your avatar (top-left) &rarr; <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Notifications</strong>. Toggle each category independently. Push notifications must be enabled at the device OS level for alerts to fire outside the app.
                </p>
              </div>
            </Card>
          </section>
        </div>

        {/* ── Row 2: Transactions + Calendar ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Transaction Announcements */}
          <section aria-labelledby="transactions-heading">
            <Card>
              <SectionHeader
                icon={Repeat}
                id="transactions-heading"
                label="Transactions"
                title="Transaction Announcements"
              />
              <div>
                <TransactionItem
                  icon={Repeat}
                  title="Trade Completed"
                  detail="Sleeper auto-posts the trade summary to league chat the moment it clears. The Commissioner may append a note for context or commissioner review outcomes."
                />
                <TransactionItem
                  icon={Clock}
                  title="FAAB Bid Results"
                  detail="Results are processed and posted Monday or Tuesday morning, depending on the weekly schedule. Each owner receives a push notification confirming their awards."
                />
                <TransactionItem
                  icon={ArrowRight}
                  title="Waiver Order Changes"
                  detail="After each waiver run the updated waiver priority order is reflected in the app. Changes are announced in league chat automatically."
                />
                <TransactionItem
                  icon={Users}
                  title="Free Agent Adds & Drops"
                  detail="Every add and drop outside of FAAB is posted to league chat in real time, including the player name, acquiring team, and dropped player."
                />
              </div>
            </Card>
          </section>

          {/* League Calendar Reminders */}
          <section aria-labelledby="calendar-heading">
            <Card>
              <SectionHeader
                icon={Calendar}
                id="calendar-heading"
                label="Calendar"
                title="League Calendar Reminders"
              />
              <div>
                <CalendarItem
                  date="April / May"
                  event="Rookie Draft Countdown"
                  note="Sleeper push notifications fire 48 hrs and 24 hrs before draft start, plus a day-of reminder at the scheduled hour."
                />
                <CalendarItem
                  date="April 23–25, 2026"
                  event="NFL Draft"
                  note="Monitor Sleeper for player news and rapid free-agent activity as rookies land on depth charts."
                />
                <CalendarItem
                  date="May / June 2026"
                  event="Annual Owners Meeting"
                  note="Agenda posted to league chat one week prior. Attendance confirmation requested via league chat reply."
                />
                <CalendarItem
                  date="First Friday of June"
                  event="BMFFFL Rookie Draft"
                  note="4 rounds, linear order. Draft lobby opens in Sleeper; countdown notifications begin 48 hrs out."
                />
                <CalendarItem
                  date="September 2026"
                  event="Regular Season Kickoff"
                  note="Sleeper activates weekly lineup reminders and scoring notifications for Week 1."
                />
                <CalendarItem
                  date="End of Regular Season"
                  event="Playoff Bracket Announced"
                  note="Bracket auto-generated and posted to league chat by Sleeper upon final week completion."
                />
              </div>

              <div className="mt-4">
                <Link
                  href="/calendar"
                  className={cn(
                    'inline-flex items-center gap-2 text-xs font-semibold',
                    'text-slate-400 hover:text-[#ffd700]',
                    'transition-colors duration-150'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  View full league calendar
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          </section>
        </div>

        {/* ── Bimfle's Official Communication Protocols ─────────────────── */}
        <section aria-labelledby="protocols-heading">
          <div
            className={cn(
              'rounded-2xl border-2 border-[#ffd700]/40 bg-[#16213e]',
              'overflow-hidden'
            )}
          >
            {/* Header band */}
            <div className="px-6 py-4 bg-[#ffd700]/8 border-b-2 border-[#ffd700]/30 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 shrink-0">
                <AlertCircle className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/70 mb-0.5">
                  Decreed by Bimfle, AI Commissioner Assistant
                </p>
                <h2
                  id="protocols-heading"
                  className="text-lg font-black text-white leading-tight"
                >
                  Bimfle&apos;s Official Communication Protocols
                </h2>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Quote block */}
              <div className="lg:col-span-2">
                <blockquote
                  className={cn(
                    'rounded-xl border border-[#ffd700]/25 bg-[#0d1b2a] px-6 py-5',
                    'text-slate-300 text-sm leading-relaxed italic'
                  )}
                >
                  <p>
                    &ldquo;It is my most solemn and considered opinion — informed by the
                    accumulated weight of league history, constitutional precedent, and the
                    Commissioner&apos;s own expressed wishes — that all matters of league
                    governance must be conducted through the appropriate and sanctioned
                    channels of the Sleeper platform. One must never conduct league
                    business via direct message alone. Transparency is the foundation
                    upon which a great league endures.&rdquo;
                  </p>
                  <footer className="mt-4 text-[#ffd700] font-semibold not-italic text-xs">
                    — Bimfle, AI Commissioner Assistant, BMFFFL
                  </footer>
                </blockquote>
              </div>

              {/* Rules: left */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Governance Rules
                </p>
                <ul className="space-y-0" aria-label="Governance communication protocols">
                  <ProtocolItem rule="All rule changes must be announced via a formal Commissioner post in league chat, followed by a 24-hour acknowledgment window during which owners may raise questions or objections." />
                  <ProtocolItem rule="Trade disputes must be raised within 48 hours of the transaction appearing in league chat. Disputes submitted after this window shall not be considered." />
                  <ProtocolItem rule="The Owners Meeting agenda shall be posted to league chat no fewer than seven days in advance of the meeting date." />
                  <ProtocolItem rule="One must never conduct league business via direct message alone. All binding communications must appear in the official league chat." />
                </ul>
              </div>

              {/* Rules: right */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Decorum & Conduct
                </p>
                <ul className="space-y-0" aria-label="Decorum protocols">
                  <ProtocolItem rule="Commissioner posts shall be treated with the gravity appropriate to official league correspondence. Owners are expected to read and acknowledge them in a timely manner." />
                  <ProtocolItem rule="Trash talk, while celebrated as a proud tradition of the BMFFFL, shall never be permitted to obscure or bury an active Commissioner post. Commissioners may re-pin as necessary." />
                  <ProtocolItem rule="Any owner failing to set a legal lineup without prior notification to the Commissioner shall be considered to have forfeited the right to appeal that week's result." />
                  <ProtocolItem rule="Draft room etiquette requires that all owners be present at the announced start time. Late arrivals are managed via Sleeper's auto-draft function without recourse." />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Reference Card ──────────────────────────────────────── */}
        <section aria-labelledby="quickref-heading">
          <Card>
            <SectionHeader
              icon={ScrollText}
              id="quickref-heading"
              label="At a Glance"
              title="Quick Reference Card"
            />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-[#2d4a66]">
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-1/3">
                      Notification Type
                    </th>
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-1/3">
                      Where
                    </th>
                    <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-1/3">
                      Timing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {QUICK_REF.map((row, i) => (
                    <tr
                      key={row.notificationType}
                      className={cn(
                        'border-b border-[#2d4a66]/50 last:border-0 transition-colors duration-100',
                        i % 2 === 0 ? 'bg-transparent' : 'bg-[#0d1b2a]/40'
                      )}
                    >
                      <td className="py-2.5 px-3 text-white font-medium text-xs leading-snug">
                        {row.notificationType}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-xs leading-snug">
                        {row.where}
                      </td>
                      <td className="py-2.5 px-3 text-[#ffd700] text-xs font-semibold leading-snug">
                        {row.timing}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/rules"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              League Rules
            </Link>
            <Link
              href="/constitution"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Constitution
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
            Last updated by Bimfle &middot; BMFFFL Official Reference
          </p>
        </div>

      </div>
    </>
  );
}
