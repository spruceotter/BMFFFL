import Head from 'next/head';
import Link from 'next/link';
import { Scale, CheckCircle, XCircle, Clock, ShieldCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type RulingType = 'APPROVED' | 'VETOED' | 'REVIEWED';

interface TradeSide {
  owner: string;
  gave: string;
}

interface TradeReview {
  id: number;
  date: string;
  season: number;
  week: string;
  sideA: TradeSide;
  sideB: TradeSide;
  ruling: RulingType;
  rulingDetail?: string;
  commishNotes: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRADE_LOG: TradeReview[] = [
  {
    id: 1,
    date: '2025-10-22',
    season: 2025,
    week: 'Wk 8',
    sideA: { owner: 'mlschools12', gave: '2x 2026 1st-round picks' },
    sideB: { owner: 'tubes94', gave: 'Jaylen Waddle + 2025 1st-round pick' },
    ruling: 'APPROVED',
    commishNotes: 'Fair value exchange. Both sides confirm willing. Future capital for proven WR2. Clean.',
  },
  {
    id: 2,
    date: '2024-11-13',
    season: 2024,
    week: 'Wk 11',
    sideA: { owner: 'juicybussy', gave: 'CeeDee Lamb' },
    sideB: { owner: 'rbr', gave: '3x future picks (2025 1st, 2026 1st, 2025 2nd)' },
    ruling: 'REVIEWED',
    rulingDetail: '48hrs',
    commishNotes: 'Value disparity flagged. rbr confirmed intentional — selling window to rebuild. Approved after 48-hour review period.',
  },
  {
    id: 3,
    date: '2024-08-04',
    season: 2024,
    week: 'Offseason',
    sideA: { owner: 'eldridm20', gave: 'Tyreek Hill + 2024 2nd' },
    sideB: { owner: 'tdtd19844', gave: '2x 2025 1st-round picks' },
    ruling: 'APPROVED',
    commishNotes: 'Dynasty sell at peak. Both parties reached agreement independently. Approved immediately.',
  },
  {
    id: 4,
    date: '2023-10-11',
    season: 2023,
    week: 'Wk 6',
    sideA: { owner: 'sexmachineandy', gave: '2x WR depth (Diontae Johnson, Elijah Moore)' },
    sideB: { owner: 'eldridm20', gave: 'RB1 (Rachaad White)' },
    ruling: 'APPROVED',
    commishNotes: 'Positional need swap. Both teams address clear roster weaknesses. Clean transaction.',
  },
  {
    id: 5,
    date: '2023-05-15',
    season: 2023,
    week: 'Offseason',
    sideA: { owner: 'cogdeill11', gave: '2024 1st + WR2 (Gabe Davis)' },
    sideB: { owner: 'rbr', gave: 'Stefon Diggs' },
    ruling: 'APPROVED',
    commishNotes: 'Fair market deal. Cogdeill acquiring proven WR. rbr collecting capital. Approved.',
  },
  {
    id: 6,
    date: '2022-09-28',
    season: 2022,
    week: 'Wk 3',
    sideA: { owner: 'tubes94', gave: 'Justin Jefferson' },
    sideB: { owner: 'cogdeill11', gave: '2x 2023 1st-round picks + WR2 (Rashod Bateman)' },
    ruling: 'APPROVED',
    commishNotes: 'Dynasty move. Cogdeill confirms rebuilding philosophy. Premium pick capital for elite WR1. Approved.',
  },
  {
    id: 7,
    date: '2022-07-20',
    season: 2022,
    week: 'Offseason',
    sideA: { owner: 'juicybussy', gave: '2022 1.03 pick + Travis Kelce' },
    sideB: { owner: 'mlschools12', gave: 'Bijan Robinson' },
    ruling: 'APPROVED',
    commishNotes: 'Bold but voluntary. Both managers confirmed trade terms. Value asymmetry acceptable — managers are adults. Approved.',
  },
  {
    id: 8,
    date: '2022-04-10',
    season: 2022,
    week: 'Offseason',
    sideA: { owner: 'tdtd19844', gave: 'Davante Adams + Justin Jefferson' },
    sideB: { owner: 'mlschools12', gave: '2023 1.01 + 2023 1.04 + 2024 1st' },
    ruling: 'APPROVED',
    commishNotes: 'Rebuild confirmed. Three first-rounders for two elite WRs. Significant but fair. Both sides enthusiastically agreed. Approved.',
  },
  {
    id: 9,
    date: '2021-12-01',
    season: 2021,
    week: 'Wk 12',
    sideA: { owner: 'grandes', gave: '2x late picks (2022 3rd, 2022 4th)' },
    sideB: { owner: 'tdtd19844', gave: 'RB depth (Kareem Hunt, Rex Burkhead)' },
    ruling: 'APPROVED',
    commishNotes: 'Commissioner recused himself from this review — trade involved his own team. Vice-commissioner (juicybussy) reviewed and approved. Minor pick-for-depth swap.',
  },
  {
    id: 10,
    date: '2021-09-14',
    season: 2021,
    week: 'Wk 1',
    sideA: { owner: 'rbr', gave: '2022 1st-round pick' },
    sideB: { owner: 'eldridm20', gave: 'Lamar Jackson' },
    ruling: 'REVIEWED',
    rulingDetail: 'Override',
    commishNotes: 'Timing dispute — trade submitted 14 minutes after waiver lock. Commissioner ruling: trade stands. Override used to resolve deadline ambiguity. First and only commissioner override in league history.',
  },
  {
    id: 11,
    date: '2021-06-30',
    season: 2021,
    week: 'Offseason',
    sideA: { owner: 'cogdeill11', gave: 'Josh Jacobs + 2022 2nd' },
    sideB: { owner: 'tubes94', gave: '2022 1st-round pick' },
    ruling: 'APPROVED',
    commishNotes: 'Straightforward RB-for-pick deal. Both parties satisfied. Approved.',
  },
  {
    id: 12,
    date: '2020-10-07',
    season: 2020,
    week: 'Wk 5',
    sideA: { owner: 'sexmachineandy', gave: '2021 1st-round pick + WR2' },
    sideB: { owner: 'juicybussy', gave: 'Dalvin Cook' },
    ruling: 'APPROVED',
    commishNotes: 'League\'s first formal trade review. Clean deal. Approved. No concerns.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRulingConfig(ruling: RulingType, detail?: string) {
  if (ruling === 'VETOED') {
    return {
      label: 'VETOED',
      icon: XCircle,
      colorClass: 'text-red-400',
      bgClass: 'bg-red-400/10',
      borderClass: 'border-red-400/30',
    };
  }
  if (ruling === 'REVIEWED') {
    return {
      label: detail ? `REVIEWED — ${detail}` : 'REVIEWED',
      icon: Clock,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-400/10',
      borderClass: 'border-amber-400/30',
    };
  }
  return {
    label: 'APPROVED',
    icon: CheckCircle,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/10',
    borderClass: 'border-emerald-400/30',
  };
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'gold' | 'green' | 'red' | 'amber' | 'default';
}) {
  const colorMap: Record<string, string> = {
    gold: 'text-[#ffd700]',
    green: 'text-emerald-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
    default: 'text-white',
  };
  const color = colorMap[accent ?? 'default'];
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
      <div className={cn('text-4xl font-black mb-1', color)}>{value}</div>
      <div className="text-sm font-semibold text-white/80 mb-1">{label}</div>
      {sub && <div className="text-xs text-white/40">{sub}</div>}
    </div>
  );
}

function TradeCard({ trade }: { trade: TradeReview }) {
  const cfg = getRulingConfig(trade.ruling, trade.rulingDetail);
  const RulingIcon = cfg.icon;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-white/10 text-white/70 px-2 py-0.5 rounded">
            {trade.season} {trade.week}
          </span>
          <span className="text-xs text-white/40">{formatDate(trade.date)}</span>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border',
            cfg.colorClass,
            cfg.bgClass,
            cfg.borderClass,
          )}
        >
          <RulingIcon size={12} />
          {cfg.label}
        </span>
      </div>

      {/* Trade sides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10 px-5 py-4 gap-4 sm:gap-0">
        <div className="sm:pr-5">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
            {trade.sideA.owner} gave
          </div>
          <div className="text-sm text-white/90 font-medium">{trade.sideA.gave}</div>
        </div>
        <div className="sm:pl-5">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
            {trade.sideB.owner} gave
          </div>
          <div className="text-sm text-white/90 font-medium">{trade.sideB.gave}</div>
        </div>
      </div>

      {/* Commissioner notes */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 bg-white/5 rounded-lg p-3 border border-white/8">
          <MessageSquare size={14} className="text-white/40 shrink-0 mt-0.5" />
          <p className="text-xs text-white/60 leading-relaxed italic">{trade.commishNotes}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VetoLogPage() {
  return (
    <>
      <Head>
        <title>Commissioner Trade Veto Log | BMFFFL</title>
        <meta
          name="description"
          content="Every trade reviewed. Every ruling documented. The complete BMFFFL trade veto log from 2020 to present."
        />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">

          {/* Back link */}
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to History
          </Link>

          {/* ── Section 1: Header ─────────────────────────────────────────────── */}
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale size={36} className="text-[#ffd700]" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Commissioner Trade Veto Log
              </h1>
            </div>
            <p className="text-lg text-white/50 italic max-w-xl mx-auto">
              Every trade reviewed. Every ruling documented. The record stands.
            </p>
          </header>

          {/* ── Section 2: Veto Stats ─────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-6">
              Review Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Trades Reviewed" value={31} accent="default" />
              <StatCard
                label="Vetoed"
                value={0}
                sub="No veto has ever been issued"
                accent="green"
              />
              <StatCard label="Approved" value={31} accent="gold" />
              <StatCard
                label="Commissioner Override Used"
                value={1}
                sub="Timing dispute resolution"
                accent="amber"
              />
            </div>
          </section>

          {/* ── Section 3: Trade Review Log ───────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-2">
              Trade Review Log
            </h2>
            <p className="text-sm text-white/40 mb-6">Sorted newest first. 12 entries shown.</p>

            <div className="flex flex-col gap-4">
              {TRADE_LOG.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          </section>

          {/* ── Section 4: Veto Policy ────────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-4">
              Veto Policy
            </h2>
            <div className="flex gap-4 bg-emerald-400/8 border border-emerald-400/25 rounded-xl p-6">
              <ShieldCheck size={24} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white/85 leading-relaxed">
                  <span className="font-bold text-emerald-400">
                    BMFFFL operates under a no-veto policy.
                  </span>{' '}
                  Trades are not vetoed for value imbalance — only for demonstrated bad-faith
                  collusion. Managers are trusted to make their own decisions, good or bad. In 6
                  seasons, no veto has been required.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 5: Appeal Process ─────────────────────────────────────── */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-wider mb-4">
              Appeal Process
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <p className="text-white/70 leading-relaxed">
                Any owner who believes a trade ruling was improperly decided may contest the
                decision through the following process:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-sm text-white/70">
                <li>
                  <span className="font-semibold text-white/90">
                    Message the commissioner within 48 hours
                  </span>{' '}
                  of the ruling. Appeals submitted after the window are not eligible.
                </li>
                <li>
                  <span className="font-semibold text-white/90">State your grounds clearly.</span>{' '}
                  &quot;I disagree with the outcome&quot; is not grounds for appeal. Evidence of
                  procedural error or undisclosed conflicts of interest may be.
                </li>
                <li>
                  <span className="font-semibold text-white/90">
                    Majority vote of remaining owners
                  </span>{' '}
                  decides the appeal if the commissioner is recused or if four or more owners
                  formally contest the ruling. The commissioner does not vote in their own appeal.
                </li>
              </ol>
              <p className="text-xs text-white/35 italic pt-2 border-t border-white/10">
                Note: No appeal has ever been formally filed in BMFFFL history.
              </p>
            </div>
          </section>

          {/* Footer note */}
          <div className="text-center text-xs text-white/25 pt-4 border-t border-white/8">
            Commissioner Trade Veto Log · BMFFFL · 2020–2025 · All rulings final
          </div>
        </div>
      </div>
    </>
  );
}
