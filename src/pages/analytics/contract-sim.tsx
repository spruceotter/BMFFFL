import Head from 'next/head';
import Link from 'next/link';
import {
  Cpu,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type ComplexityLevel = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

interface ContractPlayer {
  name: string;
  position: string;
  salary: number;
  years: string;
  expiring: boolean;
  rookie: boolean;
}

interface ComplexityItem {
  feature: string;
  level: ComplexityLevel;
  note: string;
}

interface PollOption {
  label: string;
  votes: number;
  icon: React.ElementType;
  colorClass: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SAMPLE_ROSTER: ContractPlayer[] = [
  {
    name: 'Justin Jefferson',
    position: 'WR',
    salary: 42,
    years: '2yr (2025–2026)',
    expiring: false,
    rookie: false,
  },
  {
    name: 'Tyreek Hill',
    position: 'WR',
    salary: 35,
    years: '1yr (2025)',
    expiring: true,
    rookie: false,
  },
  {
    name: 'Joe Burrow',
    position: 'QB',
    salary: 28,
    years: '3yr (2024–2026)',
    expiring: false,
    rookie: false,
  },
  {
    name: 'Breece Hall',
    position: 'RB',
    salary: 22,
    years: '2yr (2025–2026)',
    expiring: false,
    rookie: false,
  },
  {
    name: 'Evan Engram',
    position: 'TE',
    salary: 16,
    years: '1yr (2025)',
    expiring: true,
    rookie: false,
  },
  {
    name: 'Jaylen Waddle',
    position: 'WR',
    salary: 14,
    years: '2yr (2025–2026)',
    expiring: false,
    rookie: false,
  },
  {
    name: 'Tahj Washington',
    position: 'WR',
    salary: 12,
    years: '2yr (2025–2026)',
    expiring: false,
    rookie: true,
  },
  {
    name: 'Kimani Vidal',
    position: 'RB',
    salary: 11,
    years: '1yr (2025)',
    expiring: false,
    rookie: true,
  },
];

const CAP_TOTAL = 200;
const CAP_USED = SAMPLE_ROSTER.reduce((acc, p) => acc + p.salary, 0);
const CAP_REMAINING = CAP_TOTAL - CAP_USED;

const COMPLEXITY_ITEMS: ComplexityItem[] = [
  {
    feature: 'Salary tracking spreadsheet',
    level: 'Easy',
    note: 'Google Sheets or Notion table. Doable day one.',
  },
  {
    feature: 'Rookie contract structure',
    level: 'Easy',
    note: 'Fixed slot-based values. Clear, no disputes expected.',
  },
  {
    feature: 'Free agency bidding (FAAB-style)',
    level: 'Medium',
    note: 'Sleeper doesn\'t support this natively. Requires manual admin.',
  },
  {
    feature: 'Multi-year contract extensions',
    level: 'Medium',
    note: 'Tracking expirations across seasons requires discipline.',
  },
  {
    feature: 'Dead cap enforcement',
    level: 'Hard',
    note: 'Cuts leave dead money. Requires ironclad bookkeeping and enforcement.',
  },
  {
    feature: 'Trade salary matching',
    level: 'Hard',
    note: 'Trades must balance within X%. Commissioner adjudication required.',
  },
  {
    feature: 'Cap penalty disputes',
    level: 'Very Hard',
    note: 'Once real money is involved (metaphorically), everyone becomes a lawyer.',
  },
  {
    feature: 'Full Sleeper integration',
    level: 'Very Hard',
    note: 'Sleeper has no native contract system. All of this would be manual.',
  },
];

const POLL_OPTIONS: PollOption[] = [
  {
    label: 'Yes — implement it',
    votes: 4,
    icon: CheckCircle2,
    colorClass: 'text-emerald-400',
  },
  {
    label: 'No — keep it simple',
    votes: 6,
    icon: XCircle,
    colorClass: 'text-red-400',
  },
  {
    label: 'Maybe — needs more discussion',
    votes: 2,
    icon: HelpCircle,
    colorClass: 'text-amber-400',
  },
];

const TOTAL_VOTES = POLL_OPTIONS.reduce((a, o) => a + o.votes, 0);

// ─── Complexity badge ─────────────────────────────────────────────────────────

const COMPLEXITY_COLORS: Record<ComplexityLevel, string> = {
  Easy: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
  Medium: 'bg-amber-400/15 text-amber-400 border-amber-400/30',
  Hard: 'bg-orange-400/15 text-orange-400 border-orange-400/30',
  'Very Hard': 'bg-red-400/15 text-red-400 border-red-400/30',
};

function ComplexityBadge({ level }: { level: ComplexityLevel }) {
  return (
    <span
      className={cn(
        'inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border',
        COMPLEXITY_COLORS[level],
      )}
    >
      {level}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractSimPage() {
  const capPct = Math.round((CAP_USED / CAP_TOTAL) * 100);

  return (
    <>
      <Head>
        <title>Contract System Design | BMFFFL Analytics</title>
        <meta
          name="description"
          content="A design preview of what a salary cap and contract system could look like in BMFFFL. Community discussion only — not yet implemented."
        />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">

          {/* Back link */}
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Analytics
          </Link>

          {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
          <header className="mb-12">
            <div className="bg-amber-400/8 border border-amber-400/25 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle size={22} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-400 mb-1">Future Feature — Design Preview</p>
                  <p className="text-sm text-white/65">
                    This page is a speculative design, not a live system. No contracts are in
                    effect. This preview exists for community discussion about whether BMFFFL should
                    adopt a salary cap format in a future season.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <DollarSign size={36} className="text-[#ffd700]" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Contract System Design
              </h1>
            </div>
            <p className="text-lg text-white/50 max-w-2xl">
              What would BMFFFL look like with salary caps, player contracts, and dead money? A
              detailed design proposal for community consideration.
            </p>
          </header>

          {/* ── Section 2: Proposed System ────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-6">
              Proposed System Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Salary Cap',
                  body: '$200 per team per season. Cannot be exceeded. All players must have a contract to be on your roster.',
                  accent: 'text-[#ffd700]',
                },
                {
                  title: 'Contract Lengths',
                  body: 'Players signed to 1, 2, or 3-year deals. After expiration, players enter free agency.',
                  accent: 'text-emerald-400',
                },
                {
                  title: 'Rookie Contracts',
                  body: 'Years 1–2: $5–$15 based on dynasty draft slot. 1.01 pick = $15, 1.12 pick = $5. Controlled cost for young players.',
                  accent: 'text-sky-400',
                },
                {
                  title: 'Free Agency',
                  body: 'Open market bidding similar to FAAB. Managers submit blind bids. Highest bid wins — salary set by bid amount.',
                  accent: 'text-purple-400',
                },
                {
                  title: 'Dead Cap',
                  body: 'Cutting a player under contract leaves dead money equal to remaining contract value. Dead cap counts against your $200 limit.',
                  accent: 'text-orange-400',
                },
                {
                  title: 'Trade Salary Matching',
                  body: 'Traded players bring their contracts. Trades must be within 25% salary match of each other, or both sides agree to absorb the difference.',
                  accent: 'text-red-400',
                },
              ].map(({ title, body, accent }) => (
                <div
                  key={title}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
                >
                  <h3 className={cn('font-bold mb-2', accent)}>{title}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 3: Sample Roster ──────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-2">
              Sample Roster — mlschools12 (Hypothetical)
            </h2>
            <p className="text-sm text-white/40 mb-6">
              What his roster might look like under the proposed contract system.
            </p>

            {/* Cap bar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-white/70">Salary Cap Usage</span>
                <span className="text-sm font-bold text-white">
                  ${CAP_USED} / ${CAP_TOTAL}
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    capPct > 90 ? 'bg-red-400' : capPct > 75 ? 'bg-amber-400' : 'bg-emerald-400',
                  )}
                  style={{ width: `${capPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-white/40">{capPct}% used</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  ${CAP_REMAINING} remaining
                </span>
              </div>
            </div>

            {/* Roster table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-white/40 uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Player</th>
                    <th className="text-left px-3 py-3">Pos</th>
                    <th className="text-left px-3 py-3">Salary</th>
                    <th className="text-left px-3 py-3 hidden sm:table-cell">Contract</th>
                    <th className="text-left px-3 py-3 hidden md:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ROSTER.map((player, i) => (
                    <tr
                      key={player.name}
                      className={cn(
                        'border-b border-white/6 hover:bg-white/5 transition-colors',
                        i === SAMPLE_ROSTER.length - 1 && 'border-b-0',
                      )}
                    >
                      <td className="px-5 py-3 font-semibold text-white/90">{player.name}</td>
                      <td className="px-3 py-3 text-white/50">{player.position}</td>
                      <td className="px-3 py-3">
                        <span className="font-bold text-[#ffd700]">${player.salary}</span>
                      </td>
                      <td className="px-3 py-3 text-white/55 hidden sm:table-cell">
                        {player.years}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {player.expiring && (
                          <span className="text-xs bg-amber-400/15 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full font-semibold">
                            Expiring
                          </span>
                        )}
                        {player.rookie && (
                          <span className="text-xs bg-sky-400/15 text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full font-semibold">
                            Rookie Deal
                          </span>
                        )}
                        {!player.expiring && !player.rookie && (
                          <span className="text-xs text-white/30">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/15 bg-white/5 text-xs font-bold">
                    <td className="px-5 py-3 text-white/60">TOTAL</td>
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3 text-[#ffd700]">${CAP_USED}</td>
                    <td className="px-3 py-3 hidden sm:table-cell" />
                    <td className="px-3 py-3 hidden md:table-cell text-emerald-400">
                      ${CAP_REMAINING} cap space
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ── Section 4: Community Vote ─────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-2">
              Community Vote
            </h2>
            <p className="text-sm text-white/40 mb-6">
              Should BMFFFL implement a contract / salary cap system?{' '}
              <span className="text-white/30 italic">(Simulated poll — {TOTAL_VOTES} responses)</span>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
              {POLL_OPTIONS.map((opt) => {
                const pct = Math.round((opt.votes / TOTAL_VOTES) * 100);
                const Icon = opt.icon;
                return (
                  <div key={opt.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className={opt.colorClass} />
                        <span className="text-sm font-semibold text-white/85">{opt.label}</span>
                      </div>
                      <div className="text-sm text-white/50">
                        {opt.votes} votes ({pct}%)
                      </div>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', {
                          'bg-emerald-400': opt.colorClass.includes('emerald'),
                          'bg-red-400': opt.colorClass.includes('red'),
                          'bg-amber-400': opt.colorClass.includes('amber'),
                        })}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Section 5: Implementation Complexity ──────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-6">
              Implementation Complexity
            </h2>
            <div className="flex flex-col divide-y divide-white/8 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {COMPLEXITY_ITEMS.map((item) => (
                <div
                  key={item.feature}
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white/85 text-sm">{item.feature}</p>
                    <p className="text-xs text-white/45 mt-0.5">{item.note}</p>
                  </div>
                  <ComplexityBadge level={item.level} />
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 6: Bimfle's Take ──────────────────────────────────────── */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-4">
              {"Bimfle's Take"}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/30 flex items-center justify-center">
                    <Cpu size={18} className="text-[#ffd700]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-[#ffd700]">Bimfle</span>
                    <span className="text-xs text-white/30">AI Commissioner · BMFFFL</span>
                    <Zap size={12} className="text-[#ffd700]/60" />
                  </div>
                  <blockquote className="text-white/70 leading-relaxed italic">
                    &ldquo;I have computed the expected outcome. It would be chaos. I recommend it.&rdquo;
                  </blockquote>
                  <p className="text-xs text-white/30 mt-3">
                    Simulation confidence: 94.7% chaos probability. Variance: high. Entertainment
                    value: extremely high. Your Commissioner remains enthusiastically neutral.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-xs text-white/25 pt-4 border-t border-white/8">
            Contract System Design · BMFFFL · Future Feature Preview · Not Yet Implemented
          </div>
        </div>
      </div>
    </>
  );
}
