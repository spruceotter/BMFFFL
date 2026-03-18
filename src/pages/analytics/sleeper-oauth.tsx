import Head from 'next/head';
import { Lock, User, CheckCircle, AlertTriangle, Zap, Eye, Bell, Star, ChevronRight, Bot } from 'lucide-react';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getOwnerToken } from '@/lib/owner-tokens';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface OAuthStep {
  step: number;
  icon: React.ReactNode;
  title: string;
  detail: string;
}

const OAUTH_STEPS: OAuthStep[] = [
  {
    step: 1,
    icon: <User className="w-5 h-5" />,
    title: 'Manager clicks "Connect Sleeper"',
    detail: 'A button on the BMFFFL site initiates the OAuth 2.0 authorization flow toward Sleeper\'s identity provider.',
  },
  {
    step: 2,
    icon: <Lock className="w-5 h-5" />,
    title: 'OAuth redirect to Sleeper',
    detail: 'The browser redirects to Sleeper\'s authorization page. The manager reviews permissions and approves. Only read-only access is requested.',
  },
  {
    step: 3,
    icon: <ChevronRight className="w-5 h-5" />,
    title: 'Returns with authorization token',
    detail: 'Sleeper redirects back with an access token. A server-side handler (not available in static export) would exchange and store this token.',
  },
  {
    step: 4,
    icon: <Star className="w-5 h-5" />,
    title: 'Personalized experience loads',
    detail: 'BMFFFL identifies who you are and highlights YOUR roster, YOUR matchup, and YOUR notifications across every page.',
  },
];

interface MockRosterSlot {
  position: string;
  player: string;
  pts?: number;
  highlight?: boolean;
}

const MOCK_ROSTER: MockRosterSlot[] = [
  { position: 'QB',   player: 'Lamar Jackson',       pts: 38.4,  highlight: true  },
  { position: 'RB1',  player: 'Breece Hall',          pts: 22.1,  highlight: true  },
  { position: 'RB2',  player: 'Bijan Robinson',       pts: 18.8,  highlight: true  },
  { position: 'WR1',  player: 'Justin Jefferson',     pts: 31.2,  highlight: true  },
  { position: 'WR2',  player: 'Puka Nacua',           pts: 14.6              },
  { position: 'TE',   player: 'Sam LaPorta',          pts: 9.4               },
  { position: 'FLEX', player: 'David Njoku',          pts: 11.2              },
  { position: 'DEF',  player: 'SF Defense',           pts: 8.0               },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({ s }: { s: OAuthStep }) {
  return (
    <div className="flex gap-4">
      {/* Number + connector */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] flex items-center justify-center shrink-0 font-black text-sm">
          {s.step}
        </div>
        {s.step < 4 && (
          <div className="w-px flex-1 bg-[#2d4a66]/40 my-1 min-h-[24px]" aria-hidden="true" />
        )}
      </div>
      {/* Content */}
      <div className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#ffd700]" aria-hidden="true">{s.icon}</span>
          <h3 className="text-sm font-bold text-white">{s.title}</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{s.detail}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SleeperOAuthPage() {
  const mockUser = getOwnerToken('mlschools12');

  return (
    <>
      <Head>
        <title>Sleeper OAuth — Manager Authentication Design | BMFFFL</title>
        <meta
          name="description"
          content="Design preview for BMFFFL manager authentication via Sleeper OAuth. See what personalized league access would look like — future feature, not yet implemented."
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <Breadcrumb items={[
          { label: 'Home',      href: '/' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Sleeper OAuth' },
        ]} />

        {/* ── Hero Banner ────────────────────────────────────────────────────── */}
        <section
          className={cn(
            'rounded-2xl border border-[#ffd700]/20 bg-gradient-to-br from-[#1a2a3a] via-[#16213e] to-[#0d1b2a]',
            'px-6 py-10 mb-8 text-center'
          )}
          aria-labelledby="hero-heading"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            Future Feature
          </div>
          <h1 id="hero-heading" className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Manager Authentication
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            A design preview of what Sleeper OAuth integration would look like for BMFFFL.
            Not yet implemented — see the <strong className="text-slate-300">Implementation Status</strong> section below.
          </p>
        </section>

        {/* ── What It Would Enable ─────────────────────────────────────────────── */}
        <section className="mb-8" aria-labelledby="enables-heading">
          <h2 id="enables-heading" className="text-lg font-bold text-white mb-1">
            What It Would Enable
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Connecting your Sleeper account would unlock a personalized layer across the entire BMFFFL site.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Star className="w-5 h-5 text-[#ffd700]" />,
                title: 'Your Roster Highlighted',
                desc: 'Every table, ranking, and stat page would visually highlight your team row — no more hunting for your name.',
              },
              {
                icon: <Zap className="w-5 h-5 text-emerald-400" />,
                title: 'Your Upcoming Matchup Featured',
                desc: 'The dashboard would lead with YOUR upcoming opponent, projected scores, and Bimfle\'s pick — personalized.',
              },
              {
                icon: <Bell className="w-5 h-5 text-blue-400" />,
                title: 'Custom Notifications',
                desc: 'Trade offers, waiver results, and lineup alerts surfaced for your account specifically — not the whole league.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#2d4a66]/60 bg-[#1a2a3a]/40 p-5"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works (4-step flow) ──────────────────────────────────────── */}
        <section className="mb-8" aria-labelledby="flow-heading">
          <h2 id="flow-heading" className="text-lg font-bold text-white mb-1">
            How Sleeper OAuth Works
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            A standard OAuth 2.0 flow links your Sleeper identity to your BMFFFL session.
          </p>
          <div
            className="rounded-xl border border-[#2d4a66]/60 bg-[#1a2a3a]/30 p-5"
          >
            {OAUTH_STEPS.map((s) => (
              <StepCard key={s.step} s={s} />
            ))}
          </div>
        </section>

        {/* ── Mock "Connected" State ──────────────────────────────────────────── */}
        <section className="mb-8" aria-labelledby="mock-heading">
          <h2 id="mock-heading" className="text-lg font-bold text-white mb-1">
            Mock Connected State
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Design preview only — showing what the UI would look like if authenticated as{' '}
            <strong className="text-[#ffd700]">mlschools12</strong>.
          </p>

          <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/3 overflow-hidden">

            {/* Connected header bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#ffd700]/15 bg-[#ffd700]/5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-white">
                  {mockUser?.emoji} {mockUser?.displayName}
                </span>
                <span className="ml-2 text-xs text-emerald-400">Connected via Sleeper</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
                read-only · no write access
              </span>
            </div>

            {/* Mock "Your Next Matchup" card */}
            <div className="px-4 py-4 border-b border-[#2d4a66]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">
                Your Current Roster (Mockup)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOCK_ROSTER.map((slot) => (
                  <div
                    key={slot.position}
                    className={cn(
                      'rounded-lg border px-2.5 py-2',
                      slot.highlight
                        ? 'border-[#ffd700]/30 bg-[#ffd700]/5'
                        : 'border-[#2d4a66]/40 bg-[#1a2a3a]/30'
                    )}
                  >
                    <span className="text-[10px] font-bold text-slate-600 block">{slot.position}</span>
                    <span className={cn(
                      'text-xs font-semibold leading-tight',
                      slot.highlight ? 'text-[#ffd700]' : 'text-slate-300'
                    )}>
                      {slot.player}
                    </span>
                    {slot.pts !== undefined && (
                      <span className="block text-[11px] text-slate-500 tabular-nums mt-0.5">
                        {slot.pts.toFixed(1)} pts
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock upcoming matchup preview */}
            <div className="px-4 py-3 flex items-center gap-3">
              <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <p className="text-xs text-slate-400">
                <strong className="text-white">Next matchup:</strong> Season 7 Week 1 — opponent TBD.
                Bimfle's projected winner: <span className="text-[#ffd700]">mlschools12</span> (naturally).
              </p>
            </div>
          </div>
        </section>

        {/* ── Privacy Note ────────────────────────────────────────────────────── */}
        <section className="mb-8" aria-labelledby="privacy-heading">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 flex gap-3">
            <Eye className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 id="privacy-heading" className="text-sm font-bold text-emerald-400 mb-1">
                Privacy Note
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Read-only access only.</strong> No posting, no trades, no modifications — ever.
                The OAuth scope would request only the minimum data needed to identify your Sleeper user and read
                your roster. Your credentials are never stored on this site.
              </p>
            </div>
          </div>
        </section>

        {/* ── Implementation Status ──────────────────────────────────────────── */}
        <section aria-labelledby="status-heading">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex gap-3">
            <Bot className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 id="status-heading" className="text-sm font-bold text-amber-400 mb-1">
                Implementation Status
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                <strong className="text-slate-300">Currently blocked by static export.</strong>{' '}
                BMFFFL is a Next.js static site (<code className="text-amber-300/80 text-[11px]">output: 'export'</code>).
                OAuth token exchange requires a server-side callback route to securely store and refresh tokens —
                something that isn't available in a fully static build.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-400">To implement:</strong> A backend (Next.js API routes, serverless functions,
                or an edge runtime) would need to handle the token exchange and session management.
                Until then, this page remains a design specification and UX prototype.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
