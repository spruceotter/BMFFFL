import { useState, useMemo } from 'react';
import Head from 'next/head';
import { GraduationCap, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type PosFilter = 'ALL' | Position;
type DraftClass = '2027' | '2028';
type Ceiling = 'WR1' | 'WR2' | 'RB1' | 'RB2' | 'QB1' | 'QB2' | 'TE1' | 'TE2' | 'ELITE';

interface DevyProspect {
  rank: number;
  name: string;
  pos: Position;
  school: string;
  draftClass: DraftClass;
  ceiling: Ceiling;
  note: string;
  hype: number; // 1-10
}

// ─── 2027 Prospect Data ───────────────────────────────────────────────────────

const PROSPECTS_2027: DevyProspect[] = [
  {
    rank: 1,
    name: 'Travis Hunter',
    pos: 'WR',
    school: 'Colorado',
    draftClass: '2027',
    ceiling: 'ELITE',
    hype: 10,
    note: '2026 Heisman winner. WR dynasty ceiling: WR1. Generational talent. No downside.',
  },
  {
    rank: 2,
    name: 'Jeremiah Smith',
    pos: 'WR',
    school: 'Ohio State',
    draftClass: '2027',
    ceiling: 'WR1',
    hype: 9,
    note: 'Fastest WR to 1,000 yards in OSU history as a freshman. Elite size-speed profile.',
  },
  {
    rank: 3,
    name: 'Arch Manning',
    pos: 'QB',
    school: 'Texas',
    draftClass: '2027',
    ceiling: 'QB1',
    hype: 9,
    note: 'Name. Pedigree. Potential. If the offense fits, franchise QB ceiling.',
  },
  {
    rank: 4,
    name: 'Nico Iamaleava',
    pos: 'QB',
    school: 'Tennessee',
    draftClass: '2027',
    ceiling: 'QB1',
    hype: 8,
    note: '2027 QB1 contender. Arm talent elite. Needs consistent surrounding cast.',
  },
  {
    rank: 5,
    name: 'Tre Harris',
    pos: 'WR',
    school: 'Ole Miss',
    draftClass: '2027',
    ceiling: 'WR1',
    hype: 8,
    note: 'Elite separator. NFL-ready route runner right now. Could leave early.',
  },
  {
    rank: 6,
    name: 'Harold Fannin Jr.',
    pos: 'TE',
    school: 'Bowling Green',
    draftClass: '2027',
    ceiling: 'TE1',
    hype: 8,
    note: 'Most productive TE in FBS 2024. Small school but elite production and athleticism.',
  },
  {
    rank: 7,
    name: 'Stacy Gage',
    pos: 'RB',
    school: 'Texas A&M',
    draftClass: '2027',
    ceiling: 'RB1',
    hype: 7,
    note: 'Physical freak. 4.38 speed with power-back build. SEC-tested.',
  },
  {
    rank: 8,
    name: 'Boo Carter',
    pos: 'RB',
    school: 'Alabama',
    draftClass: '2027',
    ceiling: 'RB1',
    hype: 7,
    note: 'Alabama product. Reliable projection. Carries the Tide pedigree into NFL evaluations.',
  },
  {
    rank: 9,
    name: 'Dylan Raiola',
    pos: 'QB',
    school: 'Nebraska',
    draftClass: '2027',
    ceiling: 'QB2',
    hype: 6,
    note: 'Top-rated recruit. Building NFL arm strength. Nebraska offensive renaissance.',
  },
  {
    rank: 10,
    name: 'Ryan Wingo',
    pos: 'WR',
    school: 'Texas',
    draftClass: '2027',
    ceiling: 'WR2',
    hype: 6,
    note: 'Speed threat with improving route tree. Longhorn pedigree helps.',
  },
  {
    rank: 11,
    name: 'Jaden Rashada',
    pos: 'QB',
    school: 'Florida',
    draftClass: '2027',
    ceiling: 'QB2',
    hype: 5,
    note: 'Big arm, high upside if Florida scheme fits his mobility.',
  },
  {
    rank: 12,
    name: 'Jordan Anderson',
    pos: 'WR',
    school: 'Georgia',
    draftClass: '2027',
    ceiling: 'WR2',
    hype: 5,
    note: 'Georgia WR factory. Physical profile projects well. Needs target share.',
  },
  {
    rank: 13,
    name: 'Treyaun Webb',
    pos: 'RB',
    school: 'Georgia',
    draftClass: '2027',
    ceiling: 'RB2',
    hype: 5,
    note: 'Versatile back. Pass-catching ability is the separator for dynasty value.',
  },
  {
    rank: 14,
    name: 'Caden Prieskorn',
    pos: 'TE',
    school: 'Ole Miss',
    draftClass: '2027',
    ceiling: 'TE2',
    hype: 4,
    note: 'Big-bodied receiving TE. Fits modern NFL scheme. Ole Miss system is TE-friendly.',
  },
  {
    rank: 15,
    name: 'Kam Pringle',
    pos: 'WR',
    school: 'Florida State',
    draftClass: '2027',
    ceiling: 'WR2',
    hype: 4,
    note: 'Big, physical WR. Red zone monster. Dynasty value tied to NFL landing spot.',
  },
];

// ─── 2028 Early Prospects ─────────────────────────────────────────────────────

const PROSPECTS_2028: DevyProspect[] = [
  {
    rank: 1,
    name: 'Jadyn Davis',
    pos: 'QB',
    school: 'Michigan',
    draftClass: '2028',
    ceiling: 'QB1',
    hype: 8,
    note: 'Future franchise QB pedigree. Michigan culture builds NFL-ready passers.',
  },
  {
    rank: 2,
    name: 'Bryce Underwood',
    pos: 'QB',
    school: 'Michigan',
    draftClass: '2028',
    ceiling: 'QB1',
    hype: 8,
    note: 'No. 1 overall recruit in 2025 class. Rare arm + mobility combo. Generational ceiling.',
  },
  {
    rank: 3,
    name: 'Dakorien Moore',
    pos: 'WR',
    school: 'Oregon',
    draftClass: '2028',
    ceiling: 'WR1',
    hype: 7,
    note: 'Elite speed (4.28 hand-timed). Oregon WR pipeline has produced NFL starters consistently.',
  },
  {
    rank: 4,
    name: 'Caleb Downs',
    pos: 'RB',
    school: 'Ohio State',
    draftClass: '2028',
    ceiling: 'RB1',
    hype: 6,
    note: 'Transitioned from safety. Pure athlete. OSU RB history bodes well for dynasty value.',
  },
  {
    rank: 5,
    name: 'Solomon Thomas',
    pos: 'TE',
    school: 'Alabama',
    draftClass: '2028',
    ceiling: 'TE2',
    hype: 5,
    note: 'Big TE prospect with receiving upside. Alabama rarely misses on TE projections.',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const POS_CONFIG: Record<Position, string> = {
  QB: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  WR: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  TE: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

const CEILING_CONFIG: Record<Ceiling, { label: string; style: string }> = {
  ELITE: { label: 'ELITE', style: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40' },
  QB1:   { label: 'QB1',   style: 'bg-blue-500/15 text-blue-400 border-blue-500/40' },
  QB2:   { label: 'QB2',   style: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  WR1:   { label: 'WR1',   style: 'bg-orange-500/15 text-orange-400 border-orange-500/40' },
  WR2:   { label: 'WR2',   style: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
  RB1:   { label: 'RB1',   style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' },
  RB2:   { label: 'RB2',   style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  TE1:   { label: 'TE1',   style: 'bg-purple-500/15 text-purple-400 border-purple-500/40' },
  TE2:   { label: 'TE2',   style: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
};

const POS_FILTER_OPTIONS: PosFilter[] = ['ALL', 'QB', 'RB', 'WR', 'TE'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
        POS_CONFIG[pos]
      )}
    >
      {pos}
    </span>
  );
}

function CeilingBadge({ ceiling }: { ceiling: Ceiling }) {
  const cfg = CEILING_CONFIG[ceiling];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
        cfg.style
      )}
    >
      {cfg.label}
    </span>
  );
}

function HypeBar({ hype }: { hype: number }) {
  const pct = (hype / 10) * 100;
  const color = hype >= 9 ? '#ffd700' : hype >= 7 ? '#60a5fa' : hype >= 5 ? '#34d399' : '#94a3b8';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#1a2d42] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-mono font-bold tabular-nums text-slate-200 w-6 text-right">
        {hype}
      </span>
    </div>
  );
}

// ─── Prospect Table ────────────────────────────────────────────────────────────

interface ProspectTableProps {
  prospects: DevyProspect[];
  label: string;
}

function ProspectTable({ prospects, label }: ProspectTableProps) {
  if (prospects.length === 0) {
    return (
      <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-10 text-center">
        <p className="text-slate-500 text-sm">No prospects match the current filter.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label={label}>
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Prospect
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">
                Pos
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">
                School
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">
                Ceiling
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-28">
                Devy Hype
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {prospects.map((p, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={`${p.draftClass}-${p.rank}`}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
                      #{p.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-white text-sm block">{p.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 sm:hidden">{p.school}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug max-w-xs">{p.note}</p>
                  </td>
                  <td className="px-4 py-3">
                    <PosBadge pos={p.pos} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-slate-300 font-medium">{p.school}</span>
                  </td>
                  <td className="px-4 py-3">
                    <CeilingBadge ceiling={p.ceiling} />
                  </td>
                  <td className="px-4 py-3">
                    <HypeBar hype={p.hype} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevyTrackerPage() {
  const [posFilter, setPosFilter] = useState<PosFilter>('ALL');

  const filtered2027 = useMemo(() => {
    if (posFilter === 'ALL') return PROSPECTS_2027;
    return PROSPECTS_2027.filter((p) => p.pos === posFilter);
  }, [posFilter]);

  const filtered2028 = useMemo(() => {
    if (posFilter === 'ALL') return PROSPECTS_2028;
    return PROSPECTS_2028.filter((p) => p.pos === posFilter);
  }, [posFilter]);

  return (
    <>
      <Head>
        <title>Dynasty Devy Tracker — 2027+ College Prospects — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Dynasty devy tracker: top college football prospects for the 2027 and 2028 NFL Draft classes. Track developmental players before they enter the league."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Hero */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            Dynasty Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Dynasty Devy Tracker<br className="hidden sm:block" />
            <span className="text-[#ffd700]"> 2027+ Prospects</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            These players are not yet eligible for your roster. But dynasty managers plan 3 years ahead.
          </p>
        </header>

        {/* What is Devy? */}
        <section
          className="mb-10 rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-5"
          aria-label="What is Devy?"
        >
          <h2 className="text-base font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            What is &ldquo;Devy&rdquo;?
          </h2>
          <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Devy</strong> (short for &ldquo;developmental&rdquo;) refers to college
              football players you monitor for dynasty value <em>before</em> they declare for the NFL Draft.
              Some dynasty leagues allow a separate devy roster where managers can stash these players now
              and promote them to the main roster once drafted by an NFL team.
            </p>
            <p>
              Tracking devy prospects gives dynasty managers a significant edge: securing elite talent before
              it hits the rookie draft market at premium cost. The earlier you identify the right players,
              the cheaper the acquisition.
            </p>
          </div>
        </section>

        {/* Summary stats */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Prospect summary">
          {(
            [
              { label: '2027 Prospects', value: PROSPECTS_2027.length, color: '#ffd700' },
              { label: '2028 Prospects', value: PROSPECTS_2028.length, color: '#60a5fa' },
              { label: 'QBs Tracked', value: [...PROSPECTS_2027, ...PROSPECTS_2028].filter((p) => p.pos === 'QB').length, color: '#818cf8' },
              { label: 'Skill Players', value: [...PROSPECTS_2027, ...PROSPECTS_2028].filter((p) => p.pos !== 'QB').length, color: '#34d399' },
            ] as const
          ).map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center"
            >
              <p className="text-2xl font-black tabular-nums" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Position filter */}
        <section className="mb-6" aria-label="Filter by position">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Filter by position
          </p>
          <div role="group" aria-label="Position filter" className="flex flex-wrap gap-1.5">
            {POS_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPosFilter(opt)}
                aria-pressed={posFilter === opt}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border',
                  posFilter === opt
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 2027 Draft Class */}
        <section className="mb-10" aria-label="2027 Draft Class prospects">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black text-white">
              2027 Draft Class &mdash; Top Prospects
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40">
              {filtered2027.length} shown
            </span>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <ProspectTable prospects={filtered2027} label="2027 draft class devy prospects" />
        </section>

        {/* 2028 Early Prospects */}
        <section className="mb-10" aria-label="2028 Early Prospects">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black text-white">
              2028 Early Prospects &mdash; Names to Watch
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-blue-500/15 text-blue-400 border-blue-500/40">
              Very Early
            </span>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-500 mb-4 italic">
            These prospects are 2+ years from NFL Draft eligibility. Track only — do not over-invest devy capital yet.
          </p>
          <ProspectTable prospects={filtered2028} label="2028 draft class early devy prospects" />
        </section>

        {/* BMFFFL Devy Rules */}
        <section
          className="mb-10 rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-5"
          aria-label="BMFFFL Devy Rules"
        >
          <h2 className="text-base font-black text-white uppercase tracking-wider mb-3">
            BMFFFL Devy Rules
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              <span className="font-bold text-white">Current status:</span> BMFFFL does{' '}
              <strong className="text-[#e94560]">not</strong> currently have a devy roster. All college
              players are tracked for informational purposes only — you cannot roster them yet.
            </p>
            <p className="text-slate-400">
              <span className="font-semibold text-white">If a devy roster is added, here&apos;s how it would work:</span>
            </p>
            <ul className="space-y-1.5 pl-4 border-l-2 border-[#2d4a66] text-slate-400">
              <li>
                <span className="text-white font-semibold">3-spot devy roster</span> — Managers can hold
                up to 3 college players at any time.
              </li>
              <li>
                <span className="text-white font-semibold">College players only</span> — Players must be
                currently enrolled in college and not yet NFL Draft eligible.
              </li>
              <li>
                <span className="text-white font-semibold">Auto-promotion</span> — Once a player declares
                for and is selected in the NFL Draft, they move to your main roster (or taxi squad).
              </li>
              <li>
                <span className="text-white font-semibold">Devy waiver wire</span> — Free agent devy
                players would be available via a separate FAAB pool or waiver order.
              </li>
            </ul>
            <p className="text-xs text-slate-600 mt-2">
              Rule addition requires a majority vote at the Owners Meeting. Bring it up at the 2026 annual meeting.
            </p>
          </div>
        </section>

        {/* Bimfle Advisory */}
        <aside
          className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's Devy Advisory"
        >
          <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
            Bimfle&apos;s Devy Advisory
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            &ldquo;These players are not yet eligible for your roster. But dynasty managers plan 3 years ahead.
            Arch Manning has a name. He has pedigree. He has potential. Whether he has the&hellip;
            <em>efficiency metrics</em>&hellip; remains to be determined. Travis Hunter, however. Travis Hunter
            I will not be talking you out of.&rdquo;
          </p>
          <p className="text-[#ffd700] text-xs font-semibold mt-2">~Love, Bimfle.</p>
        </aside>

        {/* Footer disclaimer */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Devy prospect rankings are speculative and based on college performance, recruiting pedigree,
            and early dynasty community consensus as of March 2026. Draft classes and eligibility are
            subject to change. These are not official rankings and should not be used as the sole basis
            for dynasty roster decisions.
          </p>
        </div>

      </div>
    </>
  );
}
