import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Users, Trophy, Calendar, ChevronRight, Star, CheckCircle } from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const LEAGUE_FACTS = [
  { label: 'Platform',      value: 'Sleeper' },
  { label: 'Format',        value: 'Dynasty — full PPR, Superflex' },
  { label: 'Founded',       value: '2016 (Season 10 in 2026)' },
  { label: 'Owners',        value: '12 teams, 3 divisions' },
  { label: 'Roster size',   value: '15 active + 3 taxi + 1 IR' },
  { label: 'FAAB budget',   value: '$100 / season' },
  { label: 'Annual dues',   value: '$110 / year' },
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
    title: 'Apply & Express Interest',
    body: 'Submit the anonymous interest form below. The Commissioner reviews all candidates and selects based on commitment level, dynasty knowledge, and fit. Anonymous submissions are welcome — no name required.',
  },
  {
    step: '2',
    title: 'Dispersal Draft',
    body: 'Three teams participate: the new owner plus two existing owners who volunteer. Each volunteer puts their full roster and two-plus years of draft picks into an anonymous pool. Both players and picks are selectable. The draft runs snake format with randomized order. Supplemental picks (2026 1.13 and 2027 1.13) are added to the pool as league incentives for volunteers.',
  },
  {
    step: '3',
    title: 'Rookie Draft & Full Entry',
    body: 'After the dispersal draft, the new owner enters the annual rookie draft as a full participant. The 2026 dues are already paid by the league — your first bill is 2027. Then you are in for the long haul.',
  },
];

const VOLUNTEER_NOTES = [
  'Your full roster and 2+ years of draft picks enter the anonymous pool.',
  'You draft from the same pool — same snake format, same odds.',
  'Supplemental bonus: 2026 pick 1.13 and 2027 pick 1.13 are added to the pool.',
  'Two volunteers are needed. First two confirmed hands go in.',
];

// ─── Convex submission ────────────────────────────────────────────────────────
// Submissions go directly to the BMFFFL Convex database as agent_tasks.
// Bimflé picks these up each beat and logs them for the Commissioner.
const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JoinPage() {
  const [interest, setInterest] = useState('');
  const [experience, setExperience] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    const taskId = `join-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    try {
      const resp = await fetch(`${CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'bmfffl:createTask',
          format: 'json',
          args: {
            task_id: taskId,
            from_agent: 'web_form',
            to_agent: 'bimfle',
            task_type: 'join_application',
            payload: {
              interest_level: interest,
              dynasty_experience: experience || null,
              heard_from: source || null,
              notes: notes || null,
              submitted_at: new Date().toISOString(),
            },
          },
        }),
      });
      const json = await resp.json();
      setFormState(json.status === 'success' ? 'done' : 'error');
    } catch {
      setFormState('error');
    }
  };

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
            href="#interest-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffd700] text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors duration-150"
          >
            Express Interest
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
          <p className="text-sm text-slate-400 mb-8 ml-11">The dispersal draft process — confirmed format.</p>

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

          {/* Supplemental picks callout */}
          <div className="mt-8 p-5 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20">
            <p className="text-xs font-bold text-[#ffd700] uppercase tracking-widest mb-2">Supplemental Pool Incentives</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 p-3 rounded-lg bg-[#0f2035] border border-[#2d4a66] text-center">
                <p className="text-white font-bold text-sm">2026 Pick 1.13</p>
                <p className="text-slate-500 text-xs mt-0.5">Added to dispersal pool</p>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-[#0f2035] border border-[#2d4a66] text-center">
                <p className="text-white font-bold text-sm">2027 Pick 1.13</p>
                <p className="text-slate-500 text-xs mt-0.5">Added to dispersal pool</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              These picks are added by the league as bonus value — no existing owner is asked to contribute them.
              They increase the value of the pool for everyone in the draft.
            </p>
          </div>
        </div>
      </section>

      {/* ── Volunteer Call ───────────────────────────────────────────────────── */}
      <section className="bg-[#0f2035] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#1a2d42]">
              <Star size={18} className="text-[#ffd700]" />
            </div>
            <h2 className="text-xl font-bold text-white">Existing Owners: We Need Two Volunteers</h2>
          </div>
          <p className="text-sm text-slate-400 mb-8 ml-11">
            The dispersal draft requires two existing owners to enter alongside the new owner.
            This is a chance to reshape your roster.
          </p>

          <div className="space-y-3 mb-8">
            {VOLUNTEER_NOTES.map((note) => (
              <div key={note} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 flex items-center justify-center mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20">
            <p className="text-sm text-white font-semibold mb-1">Ready to volunteer?</p>
            <p className="text-xs text-slate-400">
              Drop your name in the league group chat or message Grandes directly in Sleeper.
              Two spots available — first confirmed, first in.
            </p>
          </div>
        </div>
      </section>

      {/* ── Referral incentive ───────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-xl font-bold text-white mb-4">Referral Incentive</h2>
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

      {/* ── Interest Form ────────────────────────────────────────────────────── */}
      <section id="interest-form" className="bg-[#0f2035]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-2">Express Anonymous Interest</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xl">
            No name required. This form routes directly to the league assistant. Your interest is
            logged confidentially — the Commissioner sees aggregate interest, not individual identities,
            unless you choose to share.
          </p>

          {formState === 'done' ? (
            <div className="border border-emerald-500/30 rounded-xl p-8 text-center bg-emerald-500/5">
              <CheckCircle size={28} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Interest received.</p>
              <p className="text-sm text-slate-400">
                Noted. The Commissioner will be in touch if you included contact details,
                or watch the Sleeper chat for next steps.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Interest level */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                  Interest level
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-white text-sm focus:outline-none focus:border-[#ffd700]/50 transition-colors"
                >
                  <option value="">Select one</option>
                  <option value="very-interested">Very interested — I want in</option>
                  <option value="somewhat-interested">Somewhat interested — learning more</option>
                  <option value="just-looking">Just looking for now</option>
                </select>
              </div>

              {/* Dynasty experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                  Dynasty experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-white text-sm focus:outline-none focus:border-[#ffd700]/50 transition-colors"
                >
                  <option value="">Select one (optional)</option>
                  <option value="veteran">Veteran — 3+ years of dynasty</option>
                  <option value="experienced">Experienced — 1–2 years</option>
                  <option value="redraft">Redraft experience, new to dynasty</option>
                  <option value="new">New to fantasy football</option>
                </select>
              </div>

              {/* How they heard */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                  How did you hear about the league? <span className="text-slate-500 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. referred by an owner, found the site, etc."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#ffd700]/50 transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                  Anything else? <span className="text-slate-500 normal-case font-normal">(optional — contact if you want a reply)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Questions, comments, or contact details if you'd like a reply…"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#ffd700]/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffd700] text-black text-sm font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                {formState === 'submitting' ? 'Sending…' : 'Submit Interest'}
                <ChevronRight size={15} />
              </button>

              {formState === 'error' && (
                <p className="text-xs text-red-400">
                  Something went wrong. Please try again in a moment.
                </p>
              )}
            </form>
          )}

          <p className="text-xs text-slate-600 mt-8 text-center">
            The BMFFFL has been running since 2016. You are being offered the opportunity to be
            part of Season 10+. Consider this carefully. Then say yes.
          </p>
        </div>
      </section>
    </>
  );
}
