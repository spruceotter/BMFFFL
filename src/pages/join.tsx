import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  Trophy, Users, Star, Zap, Shield, ChevronDown, ChevronUp,
  TrendingUp, Crown, ArrowRight, CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const CONVEX_SITE_URL = 'https://graceful-grasshopper-238.convex.site';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
// Source: BMFFFL owner-invite brochure questions. Updated April 2026.

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What is dynasty fantasy football?',
    a: "Dynasty is fantasy football that doesn't reset. You keep your players from year to year — rookies enter via annual drafts, veterans age and retire. Your roster decisions compound over time. The best dynasty managers think 3 seasons ahead. If you've only played redraft, dynasty will ruin redraft for you forever.",
  },
  {
    q: 'How many seasons has BMFFFL been running?',
    a: 'Ten seasons (2016–2025). The league formed in 2016 after founding members decided to build something more competitive than what they had. Six different managers have won championships across that span. The league has 12 teams, 257 all-time trades, and a sitting 4-time champion.',
  },
  {
    q: 'What platform does the league use?',
    a: "The league runs on Sleeper (since 2020) — the best dynasty platform available. It's free, modern, and the community around it is deep. Pre-2020 seasons were on ESPN. If you're not on Sleeper yet, you'll need to create an account. Download is free on iOS and Android.",
  },
  {
    q: 'What is the format — roster size, scoring, IR spots?',
    a: '12-team dynasty league. PPR scoring (1pt per reception). Starting lineup: 1 QB, 2 RB, 3 WR, 1 TE, 1 FLEX, 1 K, 1 DEF. Extended rosters with IR designations. Waivers run weekly. Full ruleset is in the league constitution — linked in the site footer.',
  },
  {
    q: 'Is there a buy-in? What are the stakes?',
    a: "Yes. The league has a buy-in with a prize pool distributed to champion, runner-up, and regular-season champion. Specific amounts are set by the Commissioner annually. The money is real but the bragging rights are realer — ask any of the six managers who haven't won yet.",
  },
  {
    q: 'How does the rookie draft work?',
    a: "Annual rookie drafts happen each June — 5 rounds, linear order (same order every round), based on reverse final standings from the prior season. Trade rookie picks like you would draft capital. The draft order announcement and pick trading are genuinely one of the best parts of dynasty — it's offseason fantasy football.",
  },
  {
    q: "What happens to my roster if I can't continue?",
    a: "Life happens. If a manager needs to step away, BMFFFL has a process to transition the roster to a new owner through the waitlist. Rosters don't just disappear. The Commissioner handles transitions on a case-by-case basis to keep the league balanced and competitive.",
  },
  {
    q: 'How active does a manager need to be?',
    a: "Highly active during the season (September–January) — set your lineup weekly, work the waiver wire, engage on trades. The league has a no-ghosting ethic: managers are expected to respond to trade offers and be reachable. In the offseason, activity is lighter but you still need to show up for the rookie draft.",
  },
  {
    q: 'How are trades handled?',
    a: "All trades require mutual acceptance on Sleeper and pass through a short trade review window (48 hours). The Commissioner can veto collusive trades, but this is rare — BMFFFL has 257 all-time trades and the community self-polices well. Dynasty trades often involve future pick swaps which makes them more complex and more interesting.",
  },
  {
    q: 'How do I get on the waitlist?',
    a: "Contact the Commissioner directly. Prospective owners should be genuine football fans who understand dynasty, are willing to be active, and can make the buy-in. Priority goes to people the existing league knows, but exceptional candidates from the broader waitlist are considered when spots open.",
  },
];

// ─── League Feature Data ──────────────────────────────────────────────────────

interface Feature {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Trophy className="w-5 h-5" />,
    title: '10 Seasons of History',
    body: 'Founded 2016. Six unique champions. A dynasty-format league with real stakes, real trades, and real history that compounds year over year.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: '12 Serious Managers',
    body: "Every spot in BMFFFL is occupied by someone who actually watches football. No autopilot teams, no ghosts — the competition is real every week.",
  },
  {
    icon: <Crown className="w-5 h-5" />,
    title: 'Active Commissioner',
    body: 'The Commissioner runs a tight ship: weekly engagement, annual rule reviews, trade oversight, and a growing digital archive of the league\'s history.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Dynasty Format',
    body: "Keep your players. Build your roster over years. A 2023 rookie you drafted can still be starting for you in 2028. Dynasty is the purest form of the game.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Sleeper Platform',
    body: 'The best dynasty platform available. Live scoring, deep trade tools, rookie rankings, and a mobile-first experience that makes managing your roster enjoyable.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Real Prize Pool',
    body: 'Cash buy-in, cash payout. Champion, runner-up, and regular-season title all pay out. The money is secondary to the competition — but it is very much real.',
  },
];

// ─── Championship Roll ────────────────────────────────────────────────────────

interface ChampionEntry {
  year: number;
  champion: string;
  team: string;
  note?: string;
}

const CHAMPIONS: ChampionEntry[] = [
  { year: 2025, champion: 'tdtd19844',     team: 'THE Shameful Saggy Sack', note: 'The dark horse — 4-seed run' },
  { year: 2024, champion: "MLSchools12",     team: "The Murder Boners",      note: "4th championship, def. SexMachineAndyD" },
  { year: 2023, champion: 'JuicyBussy',    team: 'Juicy Bussy',           note: 'Def. eldridm20' },
  { year: 2022, champion: 'Grandes',       team: 'El Rioux Grandes',      note: 'Def. rbr' },
  { year: 2021, champion: 'MLSchools12',   team: 'The Murder Boners',     note: '3rd championship' },
  { year: 2020, champion: 'Cogdeill11',    team: 'Earn it',               note: 'First Sleeper-era title' },
  { year: 2019, champion: 'MLSchools12',   team: 'The Murder Boners',     note: 'ESPN era' },
  { year: 2018, champion: 'SexMachineAndyD', team: 'Stand Against Trade Rape', note: 'ESPN era' },
  { year: 2017, champion: 'Cogdeill11',    team: 'Earn it',               note: 'ESPN era' },
  { year: 2016, champion: 'MLSchools12',   team: 'The Murder Boners',     note: 'Founding season' },
];

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={cn(
              'rounded-xl border transition-colors',
              isOpen
                ? 'bg-[#1a2d42] border-[#f0a500]/40'
                : 'bg-[#16213e] border-[#2d4a66] hover:border-[#3d6a8a]'
            )}
          >
            <button
              className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-white font-medium text-sm leading-relaxed">{item.q}</span>
              <span className="flex-shrink-0 mt-0.5 text-[#f0a500]">
                {isOpen
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />
                }
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4">
                <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, body }: Feature) {
  return (
    <div className="rounded-xl p-5 bg-[#16213e] border border-[#2d4a66] flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#f0a500]/10 border border-[#f0a500]/30 text-[#f0a500]">
          {icon}
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

// ─── Apply Form ───────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function ApplyForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');
  const [referral, setReferral] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/submitOwnerInterest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, experience, message, referral }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  }

  const inputClass = cn(
    'w-full rounded-xl px-4 py-3 text-sm bg-[#0d1b2a] border text-white placeholder-slate-500',
    'focus:outline-none focus:ring-2 focus:ring-[#f0a500]/40 focus:border-[#f0a500]/60',
    'border-[#2d4a66] transition-colors'
  );

  if (status === 'success') {
    return (
      <section className="rounded-2xl p-10 bg-gradient-to-br from-[#1a2d42] to-[#0d1b2a] border border-emerald-500/30 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Application received</h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          The Commissioner will review your application and be in touch. Thanks for your interest in BMFFFL.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Apply for the Waitlist</h2>
        <p className="text-slate-400 text-sm mt-1">
          Spots are rare. The Commissioner reviews every application personally.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 bg-gradient-to-br from-[#1a2d42] to-[#0d1b2a] border border-[#2d4a66] space-y-5"
      >
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Name <span className="text-[#f0a500]">*</span>
            </label>
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Email <span className="text-[#f0a500]">*</span>
            </label>
            <input
              type="email"
              required
              className={inputClass}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Fantasy football experience <span className="text-[#f0a500]">*</span>
          </label>
          <select
            required
            className={cn(inputClass, 'appearance-none cursor-pointer')}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="" disabled>Select your experience level</option>
            <option value="redraft-only">Redraft only — new to dynasty</option>
            <option value="dynasty-beginner">Dynasty beginner (1–2 seasons)</option>
            <option value="dynasty-veteran">Dynasty veteran (3+ seasons)</option>
          </select>
        </div>

        {/* Why join */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Why do you want to join BMFFFL?
          </label>
          <textarea
            rows={3}
            className={cn(inputClass, 'resize-none')}
            placeholder="Tell us about yourself and why you'd be a good fit..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Referral */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            How did you hear about us?
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="From a friend, social media, etc."
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
          />
        </div>

        {/* Error */}
        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-sm',
            'bg-[#f0a500] text-[#0d1b2a] transition-all',
            status === 'submitting'
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-[#f7c948] active:scale-[0.99]'
          )}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          We don't share your information. Applications are reviewed by the Commissioner only.
        </p>
      </form>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JoinPage() {
  return (
    <>
      <Head>
        <title>Join BMFFFL — Owner Opportunity — Best Motherfucking Fantasy Football League</title>
        <meta
          name="description"
          content="BMFFFL is a 10-season dynasty fantasy football league looking for serious owners. 12 teams, real stakes, active community. Apply for the waitlist."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-14">

          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="text-center space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#f0a500]/10 border border-[#f0a500]/30 text-[#f0a500] text-xs font-bold uppercase tracking-widest">
              <Star className="w-3 h-3" />
              Owner Opportunity — 2026
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              Join the{' '}
              <span className="text-[#f0a500]">BMFFFL</span>
            </h1>

            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              The Best Motherfucking Fantasy Football League is a 10-season dynasty league built by
              serious football fans for serious football fans. We're looking for one thing: owners
              who show up.
            </p>

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {[
                { label: 'Founded', value: '2016' },
                { label: 'Teams',   value: '12' },
                { label: 'Seasons', value: '10' },
                { label: 'Champions', value: '6' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl py-4 bg-[#16213e] border border-[#2d4a66] text-center"
                >
                  <div className="text-2xl font-extrabold text-[#f0a500]">{value}</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Why BMFFFL ───────────────────────────────────────────────── */}
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">Why BMFFFL?</h2>
              <p className="text-slate-400 text-sm mt-1">What makes this league worth your time</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          {/* ── Championship Roll ─────────────────────────────────────────── */}
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">Championship Roll</h2>
              <p className="text-slate-400 text-sm mt-1">
                Six different champions across ten seasons — nobody stays on top forever
              </p>
            </div>
            <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a2d42] border-b border-[#2d4a66]">
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-xs">Year</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-xs">Champion</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-xs hidden md:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAMPIONS.map((c, i) => (
                    <tr
                      key={c.year}
                      className={cn(
                        'border-b border-[#2d4a66] last:border-0 transition-colors hover:bg-[#1a2d42]/50',
                        i === 0 ? 'bg-[#f0a500]/5' : ''
                      )}
                    >
                      <td className="px-4 py-3 font-bold text-[#f0a500]">{c.year}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{c.champion}</div>
                        <div className="text-slate-400 text-xs">{c.team}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-500 text-xs text-center">
              Full bracket history, season recaps, and manager stats at{' '}
              <Link href="/history" className="text-[#f0a500]/70 hover:text-[#f0a500] underline underline-offset-2">
                bmfffl.vercel.app/history
              </Link>
            </p>
          </section>

          {/* ── What We're Looking For ────────────────────────────────────── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What We're Looking For</h2>
            <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] divide-y divide-[#2d4a66]">
              {[
                { check: true,  label: 'Watches NFL games regularly — not just your fantasy players' },
                { check: true,  label: 'Can make the annual buy-in without hesitation' },
                { check: true,  label: 'Sets their lineup every week — no excuses, no ghosting' },
                { check: true,  label: 'Engages with trade offers in 48 hours or less' },
                { check: true,  label: 'Understands (or is willing to learn) dynasty roster strategy' },
                { check: true,  label: 'Shows up for the June rookie draft — live, on time' },
                { check: false, label: "Expects to win their first season — this isn't redraft" },
                { check: false, label: 'Ghosts during bye weeks or big NFL schedule windows' },
              ].map(({ check, label }) => (
                <div key={label} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={cn(
                    'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                    check
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  )}>
                    {check ? '✓' : '✕'}
                  </span>
                  <span className={cn('text-sm', check ? 'text-slate-200' : 'text-slate-400')}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── How It Works ──────────────────────────────────────────────── */}
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">How It Works</h2>
              <p className="text-slate-400 text-sm mt-1">The owner journey, start to ring</p>
            </div>
            <div className="flex flex-col gap-0">
              {[
                {
                  step: '01',
                  title: 'Get on the waitlist',
                  desc: 'Reach out to the Commissioner. If your application is strong, you go on the list.',
                },
                {
                  step: '02',
                  title: 'Spot opens',
                  desc: 'When an owner steps away, the Commissioner evaluates the waitlist and offers the roster.',
                },
                {
                  step: '03',
                  title: 'Inherit or rebuild',
                  desc: "You receive the departing owner's roster — full of picks, players, and history. Build from there.",
                },
                {
                  step: '04',
                  title: 'June Rookie Draft',
                  desc: 'The first test. Build your future through the annual rookie draft. Every pick matters.',
                },
                {
                  step: '05',
                  title: 'Compete',
                  desc: 'September through January — the season is real, the scoring is live, and the competition is serious.',
                },
                {
                  step: '06',
                  title: 'Win the ring',
                  desc: "Six managers have done it. The seventh is out there. You in?",
                },
              ].map(({ step, title, desc }, i, arr) => (
                <div key={step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0',
                      'bg-[#0d1b2a] border-[#f0a500] text-[#f0a500]'
                    )}>
                      {step}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 bg-[#2d4a66] my-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="font-bold text-white text-sm">{title}</div>
                    <div className="text-slate-400 text-sm mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────────────────── */}
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-slate-400 text-sm mt-1">Everything prospective owners ask</p>
            </div>
            <FaqAccordion items={FAQ_ITEMS} />
          </section>

          {/* ── Apply Form ────────────────────────────────────────────────── */}
          <ApplyForm />

          {/* ── League Links ──────────────────────────────────────────────── */}
          <section className="border-t border-[#2d4a66] pt-6">
            <p className="text-xs text-slate-500 text-center mb-3 uppercase tracking-wide">Explore the league</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: '/managers',         label: 'Managers' },
                { href: '/history',          label: 'History' },
                { href: '/records',          label: 'Records' },
                { href: '/history/playoff-brackets', label: 'Playoff Brackets' },
                { href: '/constitution',     label: 'Constitution' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-slate-400 hover:text-[#f0a500] transition-colors underline underline-offset-2"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
