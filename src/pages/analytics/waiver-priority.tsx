import Head from 'next/head';
import { Trophy, Star, DollarSign, Lightbulb, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface WaiverEntry {
  priority: number;
  manager: string;
  finish2025: string;
  place: number;
  faab: number;
  isChampion?: boolean;
  isMoodieBowl?: boolean;
}

const WAIVER_ORDER: WaiverEntry[] = [
  { priority: 1,  manager: 'Escuelas',       finish2025: '12th place',              place: 12, faab: 100 },
  { priority: 2,  manager: 'Cogdeill11',     finish2025: '11th place',              place: 11, faab: 100 },
  { priority: 3,  manager: 'Grandes',        finish2025: 'Moodie Bowl, 10th',       place: 10, faab: 100, isMoodieBowl: true },
  { priority: 4,  manager: 'eldridsm',       finish2025: '9th place',               place: 9,  faab: 100 },
  { priority: 5,  manager: 'eldridm20',      finish2025: '8th place',               place: 8,  faab: 100 },
  { priority: 6,  manager: 'rbr',            finish2025: '7th place',               place: 7,  faab: 100 },
  { priority: 7,  manager: 'Cmaleski',       finish2025: '6th place',               place: 6,  faab: 100 },
  { priority: 8,  manager: 'SexMachineAndyD',finish2025: '5th place',               place: 5,  faab: 100 },
  { priority: 9,  manager: 'JuicyBussy',     finish2025: '4th place',               place: 4,  faab: 100 },
  { priority: 10, manager: 'MLSchools12',    finish2025: 'Lost in SF (4th)',        place: 4,  faab: 100 },
  { priority: 11, manager: 'Tubes94',        finish2025: 'Runner-up (2nd)',         place: 2,  faab: 100 },
  { priority: 12, manager: 'tdtd19844',      finish2025: 'Champion (1st)',          place: 1,  faab: 100, isChampion: true },
];

interface StrategyTip {
  number: number;
  title: string;
  body: string;
}

const STRATEGY_TIPS: StrategyTip[] = [
  {
    number: 1,
    title: 'The 70% Rule',
    body: 'Never spend more than 70% of your budget before Week 10. The best values emerge mid-season.',
  },
  {
    number: 2,
    title: 'Injury Windows',
    body: 'When a star player gets injured, bid aggressively in Week 1. Replacement value spikes then falls.',
  },
  {
    number: 3,
    title: 'Handcuff Value',
    body: 'Handcuffs for your own studs are worth $5–15. Never bid $0 on your RB1\'s backup.',
  },
  {
    number: 4,
    title: 'The Zero Bid',
    body: 'Free agents who clear waivers (no one bid) can be added for free after Tuesday 4 AM. Patience often beats spending.',
  },
  {
    number: 5,
    title: 'Late-Season FAAB',
    body: 'Playoff-seeded managers should hoard FAAB for the final push. Eliminated teams can afford to overspend.',
  },
  {
    number: 6,
    title: 'The Decoy Bid',
    body: 'Submit a $1 bid on low-value players to use up opponents\' budget mental bandwidth. Psychological warfare.',
  },
];

interface HistoricalRecord {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}

// ─── FAAB Budget Split Table ───────────────────────────────────────────────────

interface BudgetRow {
  remaining: number;
  perWeek: string;
  note: string;
}

const BUDGET_SPLITS: BudgetRow[] = [
  { remaining: 100, perWeek: '$5.88 / week',  note: 'Full budget across 17 weeks — ideal pacing' },
  { remaining: 75,  perWeek: '$6.25 / week',  note: '$25 already spent by Week 5 — stay disciplined' },
  { remaining: 50,  perWeek: '$5.56 / week',  note: 'Half budget left — 9 weeks remaining average' },
  { remaining: 30,  perWeek: '$5.00 / week',  note: 'In trouble — save for one splash move' },
  { remaining: 15,  perWeek: '$2.50 / week',  note: 'Playoff push mode — spend it or lose it' },
  { remaining: 5,   perWeek: '$1.00 / week',  note: 'Desperation territory — big swing only' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function WaiverRow({ entry }: { entry: WaiverEntry }) {
  const isChampion = entry.isChampion;
  const isMoodie = entry.isMoodieBowl;
  const isTop3 = entry.priority <= 3;

  return (
    <tr
      className={cn(
        'border-b transition-colors duration-100',
        isChampion
          ? 'border-[#ffd700]/20 bg-[#ffd700]/5 hover:bg-[#ffd700]/8'
          : isTop3
          ? 'border-[#2d4a66] bg-emerald-500/5 hover:bg-emerald-500/8'
          : 'border-[#2d4a66] hover:bg-white/3'
      )}
    >
      {/* Priority # */}
      <td className="px-4 py-3 w-14">
        <span
          className={cn(
            'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black',
            isChampion
              ? 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40'
              : isTop3
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-[#0d1b2a] text-slate-400 border border-[#2d4a66]'
          )}
        >
          {entry.priority}
        </span>
      </td>

      {/* Manager */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-bold text-sm',
              isChampion ? 'text-[#ffd700]' : 'text-white'
            )}
          >
            {entry.manager}
          </span>
          {isChampion && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30">
              <Trophy className="w-2.5 h-2.5" aria-hidden="true" />
              Champ
            </span>
          )}
          {isMoodie && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-orange-500/15 text-orange-400 border-orange-500/30">
              Moodie Bowl
            </span>
          )}
        </div>
      </td>

      {/* 2025 Finish */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span
          className={cn(
            'text-xs font-medium',
            isChampion ? 'text-[#ffd700]/80' : isMoodie ? 'text-orange-400/80' : 'text-slate-400'
          )}
        >
          {entry.finish2025}
        </span>
      </td>

      {/* FAAB */}
      <td className="px-4 py-3 text-right">
        <span
          className={cn(
            'font-mono font-black text-sm tabular-nums',
            isChampion ? 'text-[#ffd700]' : 'text-emerald-400'
          )}
        >
          ${entry.faab}
        </span>
      </td>
    </tr>
  );
}

function StrategyCard({ tip }: { tip: StrategyTip }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex gap-4">
      <div className="shrink-0">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] text-sm font-black">
          {tip.number}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{tip.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{tip.body}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WaiverPriorityPage() {
  const historicalRecords: HistoricalRecord[] = [
    {
      label: 'Most Spent in One Week',
      value: '$42',
      detail: 'Tubes94 — 2025 Week 4 (De\'Von Achane)',
      icon: <DollarSign className="w-5 h-5 text-[#e94560]" aria-hidden="true" />,
    },
    {
      label: 'Season Budget Champion',
      value: '$69 total spent',
      detail: 'tdtd19844 2025 — won the championship',
      icon: <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />,
    },
    {
      label: 'Most Conservative Playoff Qualifier',
      value: '$29 total spent',
      detail: 'rbr 2021 — reached the semifinals',
      icon: <Shield className="w-5 h-5 text-emerald-400" aria-hidden="true" />,
    },
  ];

  return (
    <>
      <Head>
        <title>Waiver Wire Priority — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 BMFFFL waiver wire priority order, FAAB balances, and waiver strategy guide. See who picks first and how to spend your $100."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Waiver Wire Priority
          </h1>
          <p className="text-slate-400 text-lg">
            2026 Season waiver order &amp; FAAB reference
          </p>
        </header>

        {/* ── Summary Stats ──────────────────────────────────────────────── */}
        <section className="mb-10 grid grid-cols-3 gap-3 sm:gap-4" aria-label="FAAB summary statistics">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center">
            <p className="text-2xl font-black text-emerald-400 tabular-nums">$100</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Each Manager Starts</p>
          </div>
          <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/5 px-4 py-3 text-center">
            <p className="text-2xl font-black text-[#ffd700] tabular-nums">$1,200</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Total League FAAB</p>
          </div>
          <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center">
            <p className="text-2xl font-black text-slate-200 tabular-nums">12</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Managers</p>
          </div>
        </section>

        {/* ── Priority Table ─────────────────────────────────────────────── */}
        <section className="mb-12" aria-label="2026 waiver wire priority order">
          <h2 className="text-xl font-black text-white mb-1">2026 Waiver Priority Order</h2>
          <p className="text-sm text-slate-500 mb-5">
            Inverse of 2025 final standings — the worst team picks first, the champion picks last.
          </p>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" aria-label="Waiver priority order table">
                <thead>
                  <tr className="border-b border-[#2d4a66] bg-[#0d1b2a]/60">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-14">
                      Pick
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Manager
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                      2025 Finish
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      FAAB
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WAIVER_ORDER.map((entry) => (
                    <WaiverRow key={entry.manager} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Champion note */}
            <div className="px-5 py-3 border-t border-[#ffd700]/20 bg-[#ffd700]/5 flex items-start gap-2">
              <Star className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-[#ffd700]/80 leading-relaxed">
                <span className="font-bold text-[#ffd700]">tdtd19844</span> picks last at #12 — earned the right to scramble.
                The champion always has the worst waiver priority. That&apos;s the tax on excellence.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAAB Calculator ────────────────────────────────────────────── */}
        <section className="mb-12" aria-label="FAAB budget calculator">
          <h2 className="text-xl font-black text-white mb-1">FAAB Budget Splits</h2>
          <p className="text-sm text-slate-500 mb-5">
            If you have $X left, here&apos;s how to spread it across the remaining weeks of a 17-week season.
          </p>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" aria-label="FAAB budget split reference table">
                <thead>
                  <tr className="border-b border-[#2d4a66] bg-[#0d1b2a]/60">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Budget Remaining
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                      Avg Per Week
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Guidance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BUDGET_SPLITS.map((row) => (
                    <tr
                      key={row.remaining}
                      className={cn(
                        'border-b border-[#2d4a66] transition-colors duration-100 hover:bg-white/3',
                        row.remaining === 100 && 'bg-emerald-500/5'
                      )}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'font-mono font-black text-sm tabular-nums',
                            row.remaining >= 75 ? 'text-emerald-400' :
                            row.remaining >= 30 ? 'text-[#ffd700]' :
                            'text-[#e94560]'
                          )}
                        >
                          ${row.remaining}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs font-mono text-slate-300">{row.perWeek}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-400">{row.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Strategy Tips ──────────────────────────────────────────────── */}
        <section className="mb-12" aria-label="FAAB waiver strategy tips">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">FAAB Strategy Guide</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Six principles that separate the managers who spend smart from the ones who blow $40 on a bye-week handcuff.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STRATEGY_TIPS.map((tip) => (
              <StrategyCard key={tip.number} tip={tip} />
            ))}
          </div>
        </section>

        {/* ── Historical Records ─────────────────────────────────────────── */}
        <section className="mb-12" aria-label="Historical FAAB records">
          <h2 className="text-xl font-black text-white mb-5">Historical FAAB Records</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {historicalRecords.map((rec) => (
              <div
                key={rec.label}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  {rec.icon}
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{rec.label}</span>
                </div>
                <p className="text-2xl font-black text-white tabular-nums">{rec.value}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{rec.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bimfle Note ────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                &ldquo;Waiver priority is the league&apos;s great equalizer. The champion picks last.
                This is by design &mdash; your Commissioner is not without mercy.&rdquo;
              </p>
              <p className="text-xs text-[#ffd700] font-semibold mt-2 not-italic">~Love, Bimfle</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
