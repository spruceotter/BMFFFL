import Head from 'next/head';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Ruling = 'UPHELD' | 'DENIED' | 'DISMISSED' | 'RESOLVED';

interface DisputeEntry {
  year: number;
  parties: string;
  issue: string;
  ruling: Ruling;
  rationale: string;
}

interface VoteEntry {
  year: number;
  proposal: string;
  result: 'PASSED' | 'FAILED';
  tally: string;
}

interface CommishNote {
  date: string;
  note: string;
}

const DISPUTES: DisputeEntry[] = [
  {
    year: 2023,
    parties: 'JuicyBussy vs rbr',
    issue: 'Alleged collusion trade',
    ruling: 'DISMISSED',
    rationale: 'Insufficient evidence of coordination. Both parties provided independent rationale.',
  },
  {
    year: 2024,
    parties: 'MLSchools12',
    issue: 'Invalid starting lineup claim',
    ruling: 'DENIED',
    rationale: 'Rules were clear and publicly available. Protest filed 48 hours after deadline.',
  },
  {
    year: 2022,
    parties: 'Tubes94',
    issue: 'Trades window timing dispute',
    ruling: 'UPHELD',
    rationale: '2-day processing delay confirmed by platform logs. Trade voided retroactively.',
  },
  {
    year: 2021,
    parties: 'SexMachineAndy',
    issue: 'FAAB tie-breaker dispute',
    ruling: 'RESOLVED',
    rationale: 'Tie-breaker procedure was ambiguous in Year 2 rules. Resolved by coin flip, rules updated.',
  },
  {
    year: 2025,
    parties: 'Cogdeill11',
    issue: 'Injured player replacement claim',
    ruling: 'DENIED',
    rationale: 'IR slot was available and unused. Owner had 72 hours to act. No platform failure detected.',
  },
  {
    year: 2020,
    parties: 'Escuelas',
    issue: 'Auction draft nomination dispute',
    ruling: 'DISMISSED',
    rationale: 'First-year ruling — no precedent established. Nomination order correctly randomized.',
  },
];

const VOTES: VoteEntry[] = [
  {
    year: 2021,
    proposal: 'Add taxi squad (5 spots)',
    result: 'PASSED',
    tally: '10-2',
  },
  {
    year: 2022,
    proposal: 'Increase keeper limit from 2 to 3',
    result: 'PASSED',
    tally: '8-4',
  },
  {
    year: 2023,
    proposal: 'Implement FAAB instead of waiver wire priority',
    result: 'PASSED',
    tally: '11-1',
  },
  {
    year: 2024,
    proposal: 'Expand playoffs from 4 to 6 teams',
    result: 'FAILED',
    tally: '5-7',
  },
];

const COMMISH_NOTES: CommishNote[] = [
  {
    date: 'November 2022',
    note: 'For the record: I did warn everyone about the playoff expansion idea back in 2020. Some of you didn\'t listen. The vault remembers.',
  },
  {
    date: 'March 2023',
    note: 'FAAB was the right call. Anyone still mourning waiver priority order can take it up with the grievance process. Which I also run.',
  },
  {
    date: 'January 2025',
    note: 'Five seasons in. League is healthy. Competitive. Occasionally unhinged. Exactly as intended. — Grandes',
  },
];

// ─── Ruling style helpers ─────────────────────────────────────────────────────

const RULING_STYLES: Record<Ruling, string> = {
  UPHELD:    'bg-green-900/50 text-green-300 border border-green-700/60',
  DENIED:    'bg-red-900/50 text-red-300 border border-red-700/60',
  DISMISSED: 'bg-slate-800/70 text-slate-300 border border-slate-600/60',
  RESOLVED:  'bg-amber-900/50 text-amber-300 border border-amber-700/60',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VaultPage() {
  return (
    <>
      <Head>
        <title>Commissioner's Vault — BMFFFL</title>
        <meta
          name="description"
          content="Commissioner's Vault — restricted records of trade disputes, rule change votes, and league governance. BMFFFL."
        />
      </Head>

      <main className="min-h-screen bg-[#0d0d1a] text-slate-200">

        {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Admin', href: '/admin' },
            { label: "Commissioner's Vault" },
          ]} />
        </div>

        {/* ── Vault Door Hero ──────────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
          {/* Background radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          {/* Vault door CSS art */}
          <div className="relative mb-10" aria-hidden="true">
            {/* Outer rim */}
            <div
              className="w-52 h-52 rounded-full flex items-center justify-center"
              style={{
                background: 'conic-gradient(from 0deg, #7a5c00, #ffd700, #b8860b, #ffd700, #7a5c00, #ffd700, #b8860b, #7a5c00)',
                boxShadow: '0 0 60px rgba(255,215,0,0.35), 0 0 120px rgba(255,215,0,0.12), inset 0 0 20px rgba(0,0,0,0.6)',
              }}
            >
              {/* Middle ring */}
              <div
                className="w-44 h-44 rounded-full flex items-center justify-center"
                style={{
                  background: '#1a1a0a',
                  border: '3px solid #b8860b',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
                }}
              >
                {/* Spoke cross */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* Horizontal spoke */}
                  <div
                    className="absolute"
                    style={{ width: '100%', height: '6px', background: 'linear-gradient(to right, #7a5c00, #ffd700, #7a5c00)', borderRadius: '3px' }}
                  />
                  {/* Vertical spoke */}
                  <div
                    className="absolute"
                    style={{ height: '100%', width: '6px', background: 'linear-gradient(to bottom, #7a5c00, #ffd700, #7a5c00)', borderRadius: '3px' }}
                  />
                  {/* Diagonal spokes */}
                  <div
                    className="absolute"
                    style={{ width: '100%', height: '6px', background: 'linear-gradient(to right, #7a5c00, #ffd700, #7a5c00)', borderRadius: '3px', transform: 'rotate(45deg)' }}
                  />
                  <div
                    className="absolute"
                    style={{ width: '100%', height: '6px', background: 'linear-gradient(to right, #7a5c00, #ffd700, #7a5c00)', borderRadius: '3px', transform: 'rotate(-45deg)' }}
                  />
                  {/* Center hub */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #ffd700 0%, #b8860b 60%, #7a5c00 100%)',
                      boxShadow: '0 0 12px rgba(255,215,0,0.6)',
                    }}
                  >
                    <span className="text-[#1a1a0a] font-black text-xs">B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bolts around rim */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #ffd700, #b8860b)',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-98px)`,
                  boxShadow: '0 0 4px rgba(255,215,0,0.5)',
                }}
              />
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-widest text-center" style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.4)' }}>
            COMMISSIONER'S VAULT
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base tracking-widest uppercase text-center">
            Restricted Access — Grandes &amp; Bimfle Eyes Only
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4 pb-20 space-y-10">

          {/* ── Access Level Banner ─────────────────────────────────────────── */}
          <section
            className="rounded-xl border p-6"
            style={{ background: 'rgba(255,215,0,0.04)', borderColor: 'rgba(255,215,0,0.25)' }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0" role="img" aria-label="Lock">🔒</span>
              <div>
                <h2 className="text-lg font-bold text-amber-300 mb-1">Future Feature: Password Protection</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This section is designed for future password-gating. You are currently viewing it as a <span className="text-amber-300 font-semibold">design preview</span> — all content is openly visible while the site is in static/preview mode.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  In production: only the commissioner (Grandes) would have authenticated access. Everyone else would see an access-denied screen.
                </p>
              </div>
            </div>
          </section>

          {/* ── Trade Dispute History ───────────────────────────────────────── */}
          <section>
            <SectionHeader icon="⚖️" title="Trade Dispute History" subtitle="Official rulings on protests, collusion claims, and timing disputes" />
            <div className="space-y-4 mt-5">
              {DISPUTES.map((d) => (
                <div
                  key={`${d.year}-${d.parties}`}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{d.year}</span>
                      <h3 className="text-base font-semibold text-slate-200 mt-0.5">{d.parties}</h3>
                      <p className="text-sm text-slate-400 italic mt-0.5">"{d.issue}"</p>
                    </div>
                    <span className={cn('text-xs font-bold px-3 py-1 rounded-full tracking-widest flex-shrink-0', RULING_STYLES[d.ruling])}>
                      {d.ruling}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed border-t border-[#1e2d3d] pt-3 mt-2">
                    {d.rationale}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Rule Change Votes ───────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="🗳️" title="Rule Change Votes" subtitle="Historical record of league-wide governance decisions" />
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {VOTES.map((v) => (
                <div
                  key={`${v.year}-${v.proposal}`}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{v.year}</span>
                    <span
                      className={cn(
                        'text-xs font-bold px-3 py-1 rounded-full tracking-widest',
                        v.result === 'PASSED'
                          ? 'bg-green-900/50 text-green-300 border border-green-700/60'
                          : 'bg-red-900/50 text-red-300 border border-red-700/60'
                      )}
                    >
                      {v.result}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium leading-snug">{v.proposal}</p>
                  <p className="text-xs text-slate-500 font-mono">Vote: <span className="text-slate-300">{v.tally}</span></p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Commissioner Notes ──────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="📝" title="Commissioner Notes" subtitle="Editorial commentary from the desk of Grandes" />
            <div className="space-y-4 mt-5">
              {COMMISH_NOTES.map((n) => (
                <blockquote
                  key={n.date}
                  className="rounded-xl border-l-4 border-[#ffd700] bg-[#111827] border border-[#2d4a66] p-5"
                  style={{ borderLeftColor: '#ffd700' }}
                >
                  <p className="text-sm text-slate-300 italic leading-relaxed">"{n.note}"</p>
                  <footer className="mt-3 text-xs text-slate-500 font-mono">{n.date} — Grandes, Commissioner</footer>
                </blockquote>
              ))}
            </div>
          </section>

          {/* ── Access Control Design Mockup ────────────────────────────────── */}
          <section>
            <SectionHeader icon="🛡️" title="Access Control Design" subtitle="Visual mockup — how password protection would work in production" />
            <div
              className="mt-5 rounded-xl border p-8 max-w-sm mx-auto text-center"
              style={{ background: 'rgba(255,215,0,0.03)', borderColor: 'rgba(255,215,0,0.2)' }}
            >
              <div className="mb-6">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                  style={{ background: 'rgba(255,215,0,0.08)', border: '2px solid rgba(255,215,0,0.3)' }}
                >
                  <span className="text-2xl" role="img" aria-label="Lock">🔒</span>
                </div>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Commissioner Access Required</p>
              </div>

              {/* Fake input */}
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Commissioner Password"
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#1a1a2e] border border-[#2d4a66] text-slate-500 placeholder-slate-600 cursor-not-allowed"
                  aria-label="Commissioner password (non-functional mockup)"
                />
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-lg text-sm font-bold tracking-wider cursor-not-allowed opacity-70"
                  style={{ background: 'linear-gradient(135deg, #b8860b, #ffd700)', color: '#1a1a0a' }}
                >
                  Enter Vault
                </button>
              </div>

              <p className="mt-5 text-xs text-slate-600 leading-relaxed">
                Implementation requires: server-side auth OR Vercel edge middleware
              </p>
              <p className="mt-1 text-xs text-amber-700 italic">
                (This form is non-functional — design preview only)
              </p>
            </div>
          </section>

          {/* ── Commissioner Profile ────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="👑" title="Commissioner Profile" subtitle="The final word on all league matters" />
            <div
              className="mt-5 rounded-xl border p-6 max-w-sm"
              style={{ background: 'rgba(255,215,0,0.04)', borderColor: 'rgba(255,215,0,0.25)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7a5c00, #ffd700)', boxShadow: '0 0 16px rgba(255,215,0,0.3)' }}
                >
                  ⚖️
                </div>
                <div>
                  <p className="text-lg font-black text-amber-300 tracking-wide">Grandes</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Commissioner since 2020</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 italic leading-relaxed border-t border-[#2d4a66] pt-4">
                "Founded the league. Set the rules. Has the final word."
              </p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#2d4a66] pb-4">
      <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-label={title}>{icon}</span>
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-wide">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
