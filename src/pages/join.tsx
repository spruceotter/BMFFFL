import Head from 'next/head';
import Link from 'next/link';
import { Users, Trophy, Calendar, ChevronRight, Star, AlertCircle } from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const LEAGUE_FACTS = [
  { label: 'Platform',      value: 'Sleeper' },
  { label: 'Format',        value: 'Dynasty — full PPR, Superflex' },
  { label: 'Founded',       value: '2016 (Season 10 in 2026)' },
  { label: 'Owners',        value: '12 teams, 3 divisions' },
  { label: 'Roster size',   value: '15 active + 3 taxi + 1 IR' },
  { label: 'FAAB budget',   value: '$100 / season' },
  { label: 'Rookie draft',  value: 'Annual — 5 rounds, spring' },
];

const DYNASTY_POINTS = [
  {
    heading: 'You keep your players indefinitely.',
    body: 'The same roster you build this year is the foundation of your team next year. And the year after. Decisions you make in 2026 will haunt or reward you in 2028.',
  },
  {
    heading: 'You draft rookies each spring.',
    body: 'A portion of your annual competition occurs before the NFL season begins — evaluating college players, projecting careers, staking claims on futures.',
  },
  {
    heading: 'There is no clean slate.',
    body: 'Rebuilds take years. Dynasties take longer. Poor trades echo. Good ones compound. This is a multi-year strategic commitment.',
  },
];

const DISPERSAL_STEPS = [
  {
    step: '1',
    title: 'Application & Selection',
    body: 'Submit your application via the waitlist form. The Commissioner reviews all candidates and selects based on commitment level, dynasty knowledge, and fit.',
  },
  {
    step: '2',
    title: 'Dispersal Draft',
    body: 'The orphan roster is entered into a dispersal draft — existing owners pick from the available assets in a structured format. The new owner receives compensatory value and a fresh foundation to build from.',
  },
  {
    step: '3',
    title: 'Pay the entry fee & join the league.',
    body: 'Once selected, you pay the entry fee (confirmed by Commissioner), join the Sleeper league, and begin competing. You will inherit a team with draft picks and assets to develop.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JoinPage() {
  return (
    <>
      <Head>
        <title>Join the BMFFFL — One Seat Available</title>
        <meta
          name="description"
          content="One roster spot is open in the BMFFFL — a 12-team dynasty fantasy football league entering Season 10. Learn what's involved and apply."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">Home</Link>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-slate-400">Join</span>
          </nav>

          {/* Scarcity badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            One Roster Available
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            One Seat. Ten Seasons of History.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            The BMFFFL is a 12-team dynasty fantasy football league entering its tenth year.
            One roster spot has opened. This is not a casual league — and this is not a casual
            invitation. If you have the temperament for a multi-year strategic commitment,
            read on.
          </p>

          <a
            href="mailto:commissioner@bmfffl.com?subject=BMFFFL%20Owner%20Application"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffd700] text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors duration-150"
          >
            Apply Now
            <ChevronRight size={15} />
          </a>
        </div>
      </section>

      {/* ── What is dynasty ──────────────────────────────────────────────────── */}
      <section className="bg-[#0f2035] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-xl font-bold text-white mb-2">What is dynasty fantasy football?</h2>
          <p className="text-sm text-slate-400 mb-8">
            Not the fantasy football you played in an office pool. Dynasty operates on a different timescale.
          </p>
          <div className="space-y-5">
            {DYNASTY_POINTS.map((pt) => (
              <div key={pt.heading} className="flex gap-4">
                <div className="flex-shrink-0 w-1 rounded-full bg-[#ffd700]/40 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{pt.heading}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{pt.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── League at a glance ───────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-[#1a2d42]">
              <Trophy size={18} className="text-[#ffd700]" />
            </div>
            <h2 className="text-xl font-bold text-white">League at a Glance</h2>
          </div>

          <div className="border border-[#2d4a66] rounded-xl overflow-hidden">
            {LEAGUE_FACTS.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex items-center justify-between px-5 py-3 text-sm ${
                  i % 2 === 0 ? 'bg-[#0f2035]' : 'bg-[#0d1b2a]'
                } ${i < LEAGUE_FACTS.length - 1 ? 'border-b border-[#2d4a66]' : ''}`}
              >
                <span className="text-slate-400">{fact.label}</span>
                <span className="text-white font-medium">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Culture ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f2035] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#1a2d42]">
              <Users size={18} className="text-[#ffd700]" />
            </div>
            <h2 className="text-xl font-bold text-white">The Culture</h2>
          </div>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>
              The BMFFFL is ten years old. It has loyalists. It has rivalries. It has an active
              group chat that operates with the decorum of a well-seasoned locker room — robust,
              frequently irreverent, and earnest where it counts.
            </p>
            <p>
              The Commissioner (known as Grandes) maintains the league with a level of dedication
              that most enterprises would envy. The trophy is real. The punishments for finishing
              last are real and have achieved their intended deterrent effect.
            </p>
            <p>
              This is not a casual league. It is not administered casually. You are expected to
              show up — to make your waiver bids, engage in the draft, and trade with enough
              regularity to suggest you are actually paying attention.
            </p>
          </div>
        </div>
      </section>

      {/* ── Dispersal Draft ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#1a2d42]">
              <Calendar size={18} className="text-[#ffd700]" />
            </div>
            <h2 className="text-xl font-bold text-white">How the New Owner Gets Started</h2>
          </div>
          <p className="text-sm text-slate-400 mb-8 ml-11">The process for joining a mid-history dynasty league.</p>

          <div className="space-y-6">
            {DISPERSAL_STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] text-xs font-bold">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{s.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80">
              Exact dispersal draft format and entry fee are confirmed by the Commissioner at time
              of selection. The above describes the standard process — details may vary.
            </p>
          </div>
        </div>
      </section>

      {/* ── Referral incentive ───────────────────────────────────────────────── */}
      <section className="bg-[#0f2035] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#1a2d42]">
              <Star size={18} className="text-[#ffd700]" />
            </div>
            <h2 className="text-xl font-bold text-white">Referral Incentive</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Existing owners earn <span className="text-white font-semibold">$10 FAAB bonus</span> per
            qualified referral submitted (maximum $50 FAAB per owner). If you were referred by an
            existing owner, mention their name in your application.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            From the pool of qualified candidates, the Commissioner will run a selection process.
            Being referred by an existing owner is not a guarantee of entry — but it is the fastest
            path to being taken seriously.
          </p>
        </div>
      </section>

      {/* ── Apply ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-3">Apply to the Waitlist</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xl">
            To be considered, send a brief message to Commissioner Grandes. Include your name,
            how you heard about the league, your dynasty experience (or lack of it — honesty is
            appreciated), and who referred you if applicable.
          </p>

          {/* Placeholder — will be replaced with embedded form once confirmed */}
          <div className="border border-[#2d4a66] rounded-xl p-8 text-center bg-[#0f2035]">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Application</p>
            <p className="text-white font-semibold mb-1">Waitlist form coming soon</p>
            <p className="text-sm text-slate-400 mb-6">
              In the meantime, reach out directly to an existing owner or the Commissioner in the
              Sleeper league chat.
            </p>
            <a
              href="mailto:commissioner@bmfffl.com?subject=BMFFFL%20Owner%20Application"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffd700] text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors duration-150"
            >
              Email Commissioner
              <ChevronRight size={15} />
            </a>
          </div>

          <p className="text-xs text-slate-600 mt-8 text-center">
            The BMFFFL has been running since 2016. You are being offered the opportunity to be
            part of Season 10+. Consider this carefully. Then say yes.
          </p>
        </div>
      </section>
    </>
  );
}
