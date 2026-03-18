import Head from 'next/head';
import Link from 'next/link';
import {
  MessageSquare,
  Smartphone,
  Globe,
  Trophy,
  ArrowRight,
  Star,
  Bell,
  Zap,
  Users,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isCommissioner?: boolean;
}

interface Announcement {
  id: number;
  title: string;
  body: string;
  date: string;
  pinned?: boolean;
}

interface QuickReaction {
  label: string;
  emoji: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    user: 'tubes94',
    avatar: 'T',
    text: 'Bro I just traded away Ja\'Marr Chase for a 2nd round pick last year. I am BUILT DIFFERENT.',
    time: '9:14 AM',
  },
  {
    id: 2,
    user: 'mlschools12',
    avatar: 'M',
    text: 'That trade aged like milk lmaooo. How\'s your team doing now tubes?',
    time: '9:16 AM',
    isCommissioner: true,
  },
  {
    id: 3,
    user: 'cogdeill11',
    avatar: 'C',
    text: 'I would like to formally announce that I am available to accept any and all mid-tier WRs. DMs open. No lowball offers.',
    time: '9:22 AM',
  },
  {
    id: 4,
    user: 'juicybussy',
    avatar: 'J',
    text: 'Cogdeill you\'ve sent me 6 trade offers this week. SIX. My answer is still no.',
    time: '9:25 AM',
  },
  {
    id: 5,
    user: 'cogdeill11',
    avatar: 'C',
    text: 'The 7th one is the good one I promise. Just look at it. JUST LOOK.',
    time: '9:26 AM',
  },
  {
    id: 6,
    user: 'tubes94',
    avatar: 'T',
    text: 'Tubes\'s team is fine, tubes\'s team is GREAT actually. 6-7 is a rebuilding year.',
    time: '9:30 AM',
  },
  {
    id: 7,
    user: 'mlschools12',
    avatar: 'M',
    text: 'You have three RBs on IR and your WR2 is a guy I\'ve literally never heard of.',
    time: '9:31 AM',
    isCommissioner: true,
  },
  {
    id: 8,
    user: 'juicybussy',
    avatar: 'J',
    text: 'I will accept that cogdeill offer on one condition: you also give me your first born draft pick AND a handshake agreement to not talk in chat for one week.',
    time: '9:35 AM',
  },
  {
    id: 9,
    user: 'cogdeill11',
    avatar: 'C',
    text: 'DEAL. Wait no. No deal. Counter-offer: I keep talking but I only talk about how great my team is.',
    time: '9:36 AM',
  },
  {
    id: 10,
    user: 'tubes94',
    avatar: 'T',
    text: 'This league is the most unhinged group of people I have ever met and I would not change a single thing.',
    time: '9:42 AM',
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Season 7 Kickoff — September 2026',
    body: 'The 2026 season officially begins Week 1 of the NFL regular season. All rosters must be finalized by the first game of the week. Lineup locks are per-game this season — no excuses for starting an injured player.',
    date: 'March 10, 2026',
    pinned: true,
  },
  {
    id: 2,
    title: '2026 Rookie Draft — Save the Date',
    body: 'The BMFFFL Rookie Draft is scheduled for the first Friday of June 2026. 4 rounds, linear order. The draft lobby will open in Sleeper 48 hours prior. Pick trading window is now open.',
    date: 'February 28, 2026',
    pinned: true,
  },
  {
    id: 3,
    title: 'FAAB Rule Clarification — Emergency Adds',
    body: 'Per the Constitution Section 4.2: emergency free agent adds during bye week injuries must still go through FAAB. There are no exceptions for "I forgot my RB was on bye." The answer is always no, and Bimfle has been informed.',
    date: 'February 14, 2026',
  },
];

const QUICK_REACTIONS: QuickReaction[] = [
  { label: 'Trophy', emoji: '🏆' },
  { label: 'Fire', emoji: '🔥' },
  { label: 'Clown', emoji: '🤡' },
  { label: 'Eyes', emoji: '👀' },
  { label: 'Crying Laugh', emoji: '😂' },
  { label: 'GG', emoji: '🤝' },
  { label: 'Skull', emoji: '💀' },
  { label: 'Football', emoji: '🏈' },
  { label: 'Money', emoji: '💰' },
  { label: 'Crown', emoji: '👑' },
  { label: 'Point Down', emoji: '👇' },
  { label: 'Dagger', emoji: '🗡️' },
];

const TRASH_TALK_PHRASES = [
  'GG EZ',
  'You mad bro?',
  'Scoreboard.',
  'That trade didn\'t age well',
  'I accept this trade',
  'Checked your waiver wire lately?',
  'Bold strategy, Cotton',
  'See you in the playoffs',
];

const SLEEPER_FEATURES = [
  {
    icon: Bell,
    title: 'Instant Push Notifications',
    description: 'Trade offers, injury alerts, waiver results, and lineup reminders delivered in real time. No more checking in manually — Sleeper brings the league to you.',
  },
  {
    icon: MessageSquare,
    title: 'League Chat Built In',
    description: 'Every transaction auto-posts to the league chat. No third-party apps, no Discord setup required — the banter lives where the league lives.',
  },
  {
    icon: Zap,
    title: 'Live Scoring',
    description: 'Watch your team\'s score update play by play during NFL games. Sleeper\'s live scoring is fast, accurate, and keeps the Sunday experience intense.',
  },
  {
    icon: Users,
    title: 'Trade Hub',
    description: 'Send, counter, and negotiate trades directly in the app. Sleeper\'s trade calculator gives you a sanity check before you send that regrettable offer.',
  },
  {
    icon: Shield,
    title: 'Commissioner Tools',
    description: 'Penalty management, veto votes, roster overrides, and formal commissioner posts — everything the Commish needs to run a tight ship.',
  },
  {
    icon: Star,
    title: 'Dynasty Support',
    description: 'Full support for taxi squads, devy rosters, keeper rules, and rookie drafts. Sleeper was built for dynasty leagues, not bolted on as an afterthought.',
  },
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
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
      {children}
    </p>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#2d4a66]/50 last:border-0">
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black',
          message.isCommissioner
            ? 'bg-[#ffd700]/20 border border-[#ffd700]/50 text-[#ffd700]'
            : 'bg-[#2d4a66] border border-[#2d4a66] text-slate-300'
        )}
        aria-hidden="true"
      >
        {message.avatar}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              'text-xs font-bold leading-none',
              message.isCommissioner ? 'text-[#ffd700]' : 'text-white'
            )}
          >
            {message.user}
          </span>
          {message.isCommissioner && (
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30">
              Commish
            </span>
          )}
          <span className="text-[10px] text-slate-600 ml-auto shrink-0">{message.time}</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}

function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 border transition-colors duration-150',
        item.pinned
          ? 'bg-[#ffd700]/5 border-[#ffd700]/30'
          : 'bg-[#0d1b2a] border-[#2d4a66]'
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        {item.pinned && (
          <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30 shrink-0 mt-0.5">
            Pinned
          </span>
        )}
        <h3 className="text-sm font-black text-white leading-snug">{item.title}</h3>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-2">{item.body}</p>
      <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">{item.date}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveChatPage() {
  return (
    <>
      <Head>
        <title>League Chat — BMFFFL</title>
        <meta
          name="description"
          content="Access the BMFFFL League Chat via the Sleeper app or web. View mock chat, commissioner announcements, and learn why Sleeper is the best dynasty fantasy platform."
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
            <span className="text-slate-300">League Chat</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Powered by Sleeper
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            BMFFFL<br className="hidden sm:block" /> League Chat
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            The official BMFFFL chat lives inside the Sleeper app. This is where trades get made,
            smack talk gets thrown, and the Commissioner posts binding league announcements.
            Get in there.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Row 1: Access Options ─────────────────────────────────────── */}
        <section aria-labelledby="access-heading">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                <MessageSquare className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Access</SectionLabel>
                <h2 id="access-heading" className="text-lg font-black text-white leading-tight">
                  Open the League Chat
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Option A: App deep link */}
              <a
                href="sleeper://leagues/910140889474326528"
                className={cn(
                  'group flex flex-col gap-3 rounded-xl p-5',
                  'bg-[#ffd700]/8 border-2 border-[#ffd700]/40',
                  'hover:bg-[#ffd700]/15 hover:border-[#ffd700]/70',
                  'transition-all duration-200'
                )}
                aria-label="Open Sleeper app to BMFFFL league chat"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/70 mb-0.5">
                      Option A — Recommended
                    </p>
                    <p className="text-sm font-black text-white">Open Sleeper App</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deep-links directly into the BMFFFL league chat inside the Sleeper app. Best experience — full push notifications, live scoring, and trade alerts.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffd700] group-hover:gap-2.5 transition-all duration-200">
                  Launch Sleeper App
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </a>

              {/* Option B: Web link */}
              <a
                href="https://sleeper.com/leagues/910140889474326528"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group flex flex-col gap-3 rounded-xl p-5',
                  'bg-[#0d1b2a] border-2 border-[#2d4a66]',
                  'hover:bg-[#16213e] hover:border-[#ffd700]/30',
                  'transition-all duration-200'
                )}
                aria-label="Open BMFFFL league chat on Sleeper web (opens in new tab)"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2d4a66] border border-[#2d4a66] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-slate-300" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                      Option B — Browser
                    </p>
                    <p className="text-sm font-black text-white">Sleeper Web Chat</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Opens the league in your browser via sleeper.com. No app required — works on desktop or mobile web. Some features are limited vs. the native app.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-white group-hover:gap-2.5 transition-all duration-200">
                  sleeper.com/leagues/910140889474326528
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </a>
            </div>
          </Card>
        </section>

        {/* ── Row 2: Chat Preview + Announcements ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Chat Preview Mockup */}
          <section aria-labelledby="chat-preview-heading">
            <Card className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                </div>
                <div>
                  <SectionLabel>Preview</SectionLabel>
                  <h2 id="chat-preview-heading" className="text-lg font-black text-white leading-tight">
                    Chat Mockup
                  </h2>
                </div>
                {/* Live dot decoration */}
                <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Active
                  </span>
                </div>
              </div>

              {/* League label bar */}
              <div className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-3 py-2 flex items-center gap-2 mb-4">
                <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <span className="text-xs font-bold text-white">BMFFFL — Season 7</span>
                <span className="ml-auto text-[10px] text-slate-500">12 managers</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto max-h-[420px] -mx-1 px-1" aria-label="Mock league chat messages">
                {MOCK_MESSAGES.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
              </div>

              {/* Mock input bar */}
              <div
                className="mt-4 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-3 py-2.5 flex items-center gap-2"
                aria-label="Chat input (decorative)"
                aria-hidden="true"
              >
                <span className="flex-1 text-xs text-slate-600 italic">Message the league…</span>
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </Card>
          </section>

          {/* League Announcements */}
          <section aria-labelledby="announcements-heading">
            <Card className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                  <Bell className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                </div>
                <div>
                  <SectionLabel>Commissioner</SectionLabel>
                  <h2 id="announcements-heading" className="text-lg font-black text-white leading-tight">
                    Recent Announcements
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {ANNOUNCEMENTS.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#2d4a66]">
                <Link
                  href="/resources/sleeper-guide"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
                >
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  Sleeper communication guide
                </Link>
              </div>
            </Card>
          </section>
        </div>

        {/* ── Quick Reactions ───────────────────────────────────────────── */}
        <section aria-labelledby="reactions-heading">
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
                <Star className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Reactions</SectionLabel>
                <h2 id="reactions-heading" className="text-lg font-black text-white leading-tight">
                  Quick Reactions &amp; Trash Talk
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              The BMFFFL-approved palette of reactions for when words just aren&apos;t enough.
              Use these in the Sleeper chat to communicate the full range of dynasty-related emotion.
            </p>

            {/* Emoji reactions */}
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">
                Emoji Reactions
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Quick emoji reactions">
                {QUICK_REACTIONS.map((r) => (
                  <div
                    key={r.label}
                    role="listitem"
                    title={r.label}
                    className={cn(
                      'inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl',
                      'bg-[#0d1b2a] border border-[#2d4a66]',
                      'cursor-default select-none',
                      'hover:bg-[#ffd700]/10 hover:border-[#ffd700]/40 hover:scale-110',
                      'transition-all duration-150'
                    )}
                    aria-label={r.label}
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Trash talk phrases */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">
                Classic Phrases
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Classic trash talk phrases">
                {TRASH_TALK_PHRASES.map((phrase) => (
                  <div
                    key={phrase}
                    role="listitem"
                    className={cn(
                      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold',
                      'bg-[#0d1b2a] border border-[#2d4a66] text-slate-400',
                      'cursor-default select-none',
                      'hover:bg-[#ffd700]/10 hover:border-[#ffd700]/30 hover:text-[#ffd700]',
                      'transition-all duration-150'
                    )}
                  >
                    {phrase}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* ── Why Sleeper ───────────────────────────────────────────────── */}
        <section aria-labelledby="why-sleeper-heading">
          <div className="rounded-2xl border-2 border-[#ffd700]/40 bg-[#16213e] overflow-hidden">

            {/* Header band */}
            <div className="px-6 py-4 bg-[#ffd700]/8 border-b-2 border-[#ffd700]/30 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 shrink-0">
                <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <SectionLabel>Platform</SectionLabel>
                <h2 id="why-sleeper-heading" className="text-lg font-black text-white leading-tight">
                  Why Sleeper?
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-2xl">
                BMFFFL has run on Sleeper since Season 1. It&apos;s not just where the league lives — it&apos;s genuinely the best dynasty fantasy football platform on the market. Here&apos;s why.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SLEEPER_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4 hover:border-[#ffd700]/30 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-black text-white mb-1.5 leading-snug">
                        {feature.title}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://sleeper.com/leagues/910140889474326528"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold',
                    'bg-[#ffd700] text-[#0d1b2a]',
                    'hover:bg-[#ffd700]/90',
                    'transition-colors duration-150'
                  )}
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  Open on Sleeper Web
                </a>
                <Link
                  href="/resources/sleeper-guide"
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold',
                    'bg-[#16213e] border border-[#2d4a66] text-slate-300',
                    'hover:text-white hover:border-[#ffd700]/40',
                    'transition-colors duration-150'
                  )}
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  Sleeper Setup Guide
                </Link>
              </div>
            </div>
          </div>
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
            League ID: 910140889474326528 &middot; BMFFFL Season 7
          </p>
        </div>

      </div>
    </>
  );
}
