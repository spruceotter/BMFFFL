import { useState } from 'react';
import Head from 'next/head';
import { Layers, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Pick value table ──────────────────────────────────────────────────────────
// Values derived from dynasty consensus (March 2026)

const PICK_VALUES_2026: Record<string, number> = {
  '1.01': 8500, '1.02': 7800, '1.03': 7000, '1.04': 6200,
  '1.05': 5500, '1.06': 4800, '1.07': 4200, '1.08': 3700,
  '1.09': 3300, '1.10': 2900, '1.11': 2400, '1.12': 2000,
  '2.01': 1400, '2.02': 1300, '2.03': 1200, '2.04': 1100,
  '2.05': 1000, '2.06':  920, '2.07':  840, '2.08':  780,
  '2.09':  720, '2.10':  660, '2.11':  610, '2.12':  560,
  '3.01':  480, '3.02':  450, '3.03':  420, '3.04':  400,
  '3.05':  380, '3.06':  360, '3.07':  340, '3.08':  320,
  '3.09':  300, '3.10':  280, '3.11':  260, '3.12':  240,
};

const PICK_VALUES_2027: Record<string, number> = {
  '1st': 3200,
  '2nd':  900,
  '3rd':  300,
};

// ─── Pick data ─────────────────────────────────────────────────────────────────

interface Pick2026 {
  slot: string;       // e.g. "1.01"
  round: number;
  position: number;   // 1–12
  originalOwner: string;
  currentHolder: string;
  traded: boolean;
}

interface Pick2027 {
  round: string;      // '1st' | '2nd' | '3rd'
  originalOwner: string;
  currentHolder: string;
  traded: boolean;
  note?: string;
}

const PICKS_2026: Pick2026[] = [
  // Round 1
  { slot: '1.01', round: 1, position: 1,  originalOwner: 'Escuelas',       currentHolder: 'Escuelas',       traded: false },
  { slot: '1.02', round: 1, position: 2,  originalOwner: 'Cogdeill11',     currentHolder: 'Cogdeill11',     traded: false },
  { slot: '1.03', round: 1, position: 3,  originalOwner: 'Grandes',        currentHolder: 'Grandes',        traded: false },
  { slot: '1.04', round: 1, position: 4,  originalOwner: 'eldridsm',       currentHolder: 'JuicyBussy',     traded: true  },
  { slot: '1.05', round: 1, position: 5,  originalOwner: 'eldridm20',      currentHolder: 'eldridm20',      traded: false },
  { slot: '1.06', round: 1, position: 6,  originalOwner: 'rbr',            currentHolder: 'rbr',            traded: false },
  { slot: '1.07', round: 1, position: 7,  originalOwner: 'Cmaleski',       currentHolder: 'Cmaleski',       traded: false },
  { slot: '1.08', round: 1, position: 8,  originalOwner: 'SexMachineAndyD',currentHolder: 'MLSchools12',    traded: true  },
  { slot: '1.09', round: 1, position: 9,  originalOwner: 'JuicyBussy',     currentHolder: 'JuicyBussy',     traded: false },
  { slot: '1.10', round: 1, position: 10, originalOwner: 'MLSchools12',    currentHolder: 'MLSchools12',    traded: false },
  { slot: '1.11', round: 1, position: 11, originalOwner: 'Tubes94',        currentHolder: 'Tubes94',        traded: false },
  { slot: '1.12', round: 1, position: 12, originalOwner: 'tdtd19844',      currentHolder: 'tdtd19844',      traded: false },
  // Round 2
  { slot: '2.01', round: 2, position: 1,  originalOwner: 'Escuelas',       currentHolder: 'Tubes94',        traded: true  },
  { slot: '2.02', round: 2, position: 2,  originalOwner: 'Cogdeill11',     currentHolder: 'Cogdeill11',     traded: false },
  { slot: '2.03', round: 2, position: 3,  originalOwner: 'Grandes',        currentHolder: 'Grandes',        traded: false },
  { slot: '2.04', round: 2, position: 4,  originalOwner: 'eldridsm',       currentHolder: 'eldridsm',       traded: false },
  { slot: '2.05', round: 2, position: 5,  originalOwner: 'eldridm20',      currentHolder: 'eldridm20',      traded: false },
  { slot: '2.06', round: 2, position: 6,  originalOwner: 'rbr',            currentHolder: 'rbr',            traded: false },
  { slot: '2.07', round: 2, position: 7,  originalOwner: 'Cmaleski',       currentHolder: 'Cmaleski',       traded: false },
  { slot: '2.08', round: 2, position: 8,  originalOwner: 'SexMachineAndyD',currentHolder: 'SexMachineAndyD',traded: false },
  { slot: '2.09', round: 2, position: 9,  originalOwner: 'JuicyBussy',     currentHolder: 'JuicyBussy',     traded: false },
  { slot: '2.10', round: 2, position: 10, originalOwner: 'MLSchools12',    currentHolder: 'MLSchools12',    traded: false },
  { slot: '2.11', round: 2, position: 11, originalOwner: 'Tubes94',        currentHolder: 'Tubes94',        traded: false },
  { slot: '2.12', round: 2, position: 12, originalOwner: 'tdtd19844',      currentHolder: 'tdtd19844',      traded: false },
  // Round 3
  { slot: '3.01', round: 3, position: 1,  originalOwner: 'Escuelas',       currentHolder: 'Escuelas',       traded: false },
  { slot: '3.02', round: 3, position: 2,  originalOwner: 'Cogdeill11',     currentHolder: 'SexMachineAndyD',traded: true  },
  { slot: '3.03', round: 3, position: 3,  originalOwner: 'Grandes',        currentHolder: 'Grandes',        traded: false },
  { slot: '3.04', round: 3, position: 4,  originalOwner: 'eldridsm',       currentHolder: 'eldridsm',       traded: false },
  { slot: '3.05', round: 3, position: 5,  originalOwner: 'eldridm20',      currentHolder: 'eldridm20',      traded: false },
  { slot: '3.06', round: 3, position: 6,  originalOwner: 'rbr',            currentHolder: 'rbr',            traded: false },
  { slot: '3.07', round: 3, position: 7,  originalOwner: 'Cmaleski',       currentHolder: 'Cmaleski',       traded: false },
  { slot: '3.08', round: 3, position: 8,  originalOwner: 'SexMachineAndyD',currentHolder: 'SexMachineAndyD',traded: false },
  { slot: '3.09', round: 3, position: 9,  originalOwner: 'JuicyBussy',     currentHolder: 'JuicyBussy',     traded: false },
  { slot: '3.10', round: 3, position: 10, originalOwner: 'MLSchools12',    currentHolder: 'MLSchools12',    traded: false },
  { slot: '3.11', round: 3, position: 11, originalOwner: 'Tubes94',        currentHolder: 'Tubes94',        traded: false },
  { slot: '3.12', round: 3, position: 12, originalOwner: 'tdtd19844',      currentHolder: 'tdtd19844',      traded: false },
];

const PICKS_2027: Pick2027[] = [
  // 1sts — every team owns their own; MLSchools12 and JuicyBussy hold extras
  { round: '1st', originalOwner: 'Escuelas',        currentHolder: 'Escuelas',        traded: false },
  { round: '1st', originalOwner: 'Cogdeill11',      currentHolder: 'Cogdeill11',      traded: false },
  { round: '1st', originalOwner: 'Grandes',         currentHolder: 'Grandes',         traded: false },
  { round: '1st', originalOwner: 'eldridsm',        currentHolder: 'JuicyBussy',      traded: true,  note: 'eldridsm deal' },
  { round: '1st', originalOwner: 'eldridm20',       currentHolder: 'eldridm20',       traded: false },
  { round: '1st', originalOwner: 'rbr',             currentHolder: 'rbr',             traded: false },
  { round: '1st', originalOwner: 'Cmaleski',        currentHolder: 'Cmaleski',        traded: false },
  { round: '1st', originalOwner: 'SexMachineAndyD', currentHolder: 'MLSchools12',     traded: true,  note: 'SexMachineAndyD trade' },
  { round: '1st', originalOwner: 'JuicyBussy',      currentHolder: 'JuicyBussy',      traded: false },
  { round: '1st', originalOwner: 'MLSchools12',     currentHolder: 'MLSchools12',     traded: false },
  { round: '1st', originalOwner: 'Tubes94',         currentHolder: 'Tubes94',         traded: false },
  { round: '1st', originalOwner: 'tdtd19844',       currentHolder: 'tdtd19844',       traded: false },
  // 2nds — Tubes94 holds extra from Escuelas deal
  { round: '2nd', originalOwner: 'Escuelas',        currentHolder: 'Tubes94',         traded: true,  note: 'Escuelas deal' },
  { round: '2nd', originalOwner: 'Cogdeill11',      currentHolder: 'Cogdeill11',      traded: false },
  { round: '2nd', originalOwner: 'Grandes',         currentHolder: 'Grandes',         traded: false },
  { round: '2nd', originalOwner: 'eldridsm',        currentHolder: 'eldridsm',        traded: false },
  { round: '2nd', originalOwner: 'eldridm20',       currentHolder: 'eldridm20',       traded: false },
  { round: '2nd', originalOwner: 'rbr',             currentHolder: 'rbr',             traded: false },
  { round: '2nd', originalOwner: 'Cmaleski',        currentHolder: 'Cmaleski',        traded: false },
  { round: '2nd', originalOwner: 'SexMachineAndyD', currentHolder: 'SexMachineAndyD', traded: false },
  { round: '2nd', originalOwner: 'JuicyBussy',      currentHolder: 'JuicyBussy',      traded: false },
  { round: '2nd', originalOwner: 'MLSchools12',     currentHolder: 'MLSchools12',     traded: false },
  { round: '2nd', originalOwner: 'Tubes94',         currentHolder: 'Tubes94',         traded: false },
  { round: '2nd', originalOwner: 'tdtd19844',       currentHolder: 'tdtd19844',       traded: false },
  // 3rds — all own
  { round: '3rd', originalOwner: 'Escuelas',        currentHolder: 'Escuelas',        traded: false },
  { round: '3rd', originalOwner: 'Cogdeill11',      currentHolder: 'Cogdeill11',      traded: false },
  { round: '3rd', originalOwner: 'Grandes',         currentHolder: 'Grandes',         traded: false },
  { round: '3rd', originalOwner: 'eldridsm',        currentHolder: 'eldridsm',        traded: false },
  { round: '3rd', originalOwner: 'eldridm20',       currentHolder: 'eldridm20',       traded: false },
  { round: '3rd', originalOwner: 'rbr',             currentHolder: 'rbr',             traded: false },
  { round: '3rd', originalOwner: 'Cmaleski',        currentHolder: 'Cmaleski',        traded: false },
  { round: '3rd', originalOwner: 'SexMachineAndyD', currentHolder: 'SexMachineAndyD', traded: false },
  { round: '3rd', originalOwner: 'JuicyBussy',      currentHolder: 'JuicyBussy',      traded: false },
  { round: '3rd', originalOwner: 'MLSchools12',     currentHolder: 'MLSchools12',     traded: false },
  { round: '3rd', originalOwner: 'Tubes94',         currentHolder: 'Tubes94',         traded: false },
  { round: '3rd', originalOwner: 'tdtd19844',       currentHolder: 'tdtd19844',       traded: false },
];

const ALL_MANAGERS = [
  'Escuelas', 'Cogdeill11', 'Grandes', 'eldridsm', 'eldridm20', 'rbr',
  'Cmaleski', 'SexMachineAndyD', 'JuicyBussy', 'MLSchools12', 'Tubes94', 'tdtd19844',
];

// ─── Computed summaries ────────────────────────────────────────────────────────

interface ManagerSummary {
  manager: string;
  picks2026: Pick2026[];
  picks2027: Pick2027[];
  totalPicks: number;
  extraPicks: number;   // picks above the "1 per round" baseline = picks traded away from others
  deficitPicks: number; // picks lost (traded away)
  totalValue2026: number;
  totalValue2027: number;
  totalValue: number;
  capitalStatus: 'rich' | 'neutral' | 'deficit';
}

function buildManagerSummaries(): ManagerSummary[] {
  return ALL_MANAGERS.map(manager => {
    const picks2026 = PICKS_2026.filter(p => p.currentHolder === manager);
    const picks2027 = PICKS_2027.filter(p => p.currentHolder === manager);

    // Picks given away (traded out) — picks where this manager is originalOwner but not currentHolder
    const tradedAway2026 = PICKS_2026.filter(p => p.originalOwner === manager && p.currentHolder !== manager);
    const tradedAway2027 = PICKS_2027.filter(p => p.originalOwner === manager && p.currentHolder !== manager);
    const deficitPicks = tradedAway2026.length + tradedAway2027.length;

    // Extra picks = picks held where this manager is NOT the original owner
    const extraPicks2026 = picks2026.filter(p => p.originalOwner !== manager).length;
    const extraPicks2027 = picks2027.filter(p => p.originalOwner !== manager).length;
    const extraPicks = extraPicks2026 + extraPicks2027;

    const totalValue2026 = picks2026.reduce((s, p) => s + (PICK_VALUES_2026[p.slot] ?? 0), 0);
    const totalValue2027 = picks2027.reduce((s, p) => s + (PICK_VALUES_2027[p.round] ?? 0), 0);
    const totalValue = totalValue2026 + totalValue2027;

    const capitalStatus: 'rich' | 'neutral' | 'deficit' =
      extraPicks > 0 ? 'rich' : deficitPicks > 0 ? 'deficit' : 'neutral';

    return {
      manager,
      picks2026,
      picks2027,
      totalPicks: picks2026.length + picks2027.length,
      extraPicks,
      deficitPicks,
      totalValue2026,
      totalValue2027,
      totalValue,
      capitalStatus,
    };
  });
}

const MANAGER_SUMMARIES = buildManagerSummaries().sort((a, b) => b.totalValue - a.totalValue);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function roundBadge(round: number | string): string {
  if (round === 1 || round === '1st') return 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40';
  if (round === 2 || round === '2nd') return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
}

function roundLabel(round: number | string): string {
  if (round === 1 || round === '1st') return '1ST';
  if (round === 2 || round === '2nd') return '2ND';
  return '3RD';
}

function valueBar(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((value / max) * 100);
}

// ─── Pick table row ─────────────────────────────────────────────────────────────

interface PickRowProps {
  slot: string;
  round: number;
  originalOwner: string;
  currentHolder: string;
  traded: boolean;
  value: number;
  idx: number;
}

function PickRow({ slot, round, originalOwner, currentHolder, traded, value, idx }: PickRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-[#1f3550]',
        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
        traded && 'outline outline-1 outline-[#ffd700]/20'
      )}
    >
      <td className="px-3 py-2.5">
        <span
          className={cn(
            'inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border',
            roundBadge(round)
          )}
        >
          {roundLabel(round)}
        </span>
      </td>
      <td className="px-3 py-2.5 font-mono font-bold text-white text-sm">{slot}</td>
      <td className="px-3 py-2.5 text-slate-400 text-xs">{originalOwner}</td>
      <td className="px-3 py-2.5 text-xs">
        {traded ? (
          <span className="inline-flex items-center gap-1 font-bold text-[#ffd700]">
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
            {currentHolder}
          </span>
        ) : (
          <span className="text-slate-300">{currentHolder}</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-right font-mono font-black text-[#ffd700] text-xs tabular-nums">
        {value.toLocaleString()}
      </td>
      <td className="px-3 py-2.5 text-center">
        {traded && (
          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30">
            Traded
          </span>
        )}
      </td>
    </tr>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type YearTab = '2026' | '2027';

export default function DraftCapitalPage() {
  const [yearTab, setYearTab] = useState<YearTab>('2026');

  const maxValue = MANAGER_SUMMARIES[0]?.totalValue ?? 1;

  const rounds2026 = [1, 2, 3];

  return (
    <>
      <Head>
        <title>Draft Capital Tracker — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL dynasty draft capital tracker. See who holds which 2026 and 2027 rookie draft picks, traded pick ownership, and capital value leaderboard."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Draft Capital Tracker
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            2026 &amp; 2027 rookie draft pick ownership &mdash; March 2026
          </p>
        </header>

        {/* ── Capital Value Leaderboard ── */}
        <section className="mb-12" aria-labelledby="leaderboard-heading">
          <h2 id="leaderboard-heading" className="text-base font-bold text-white mb-1">
            Capital Value Leaderboard
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ranked by estimated total draft pick value held across 2026 and 2027. Includes all picks currently held, regardless of original ownership.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="min-w-full text-xs" aria-label="Draft capital value leaderboard">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider w-8">#</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Manager</th>
                  <th scope="col" className="px-3 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-3 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">2026 Value</th>
                  <th scope="col" className="px-3 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">2027 Value</th>
                  <th scope="col" className="px-3 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell w-40">Value Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {MANAGER_SUMMARIES.map((ms, idx) => {
                  const bar = valueBar(ms.totalValue, maxValue);
                  return (
                    <tr
                      key={ms.manager}
                      className={cn(
                        'transition-colors hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      <td className="px-3 py-3 font-black text-slate-500 tabular-nums">{idx + 1}</td>
                      <td className="px-3 py-3 font-black text-white">{ms.manager}</td>
                      <td className="px-3 py-3 text-center">
                        {ms.capitalStatus === 'rich' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
                            Capital Rich
                          </span>
                        )}
                        {ms.capitalStatus === 'deficit' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30">
                            <TrendingDown className="w-2.5 h-2.5" aria-hidden="true" />
                            Capital Deficit
                          </span>
                        )}
                        {ms.capitalStatus === 'neutral' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-500/15 text-slate-400 border border-slate-500/30">
                            <Minus className="w-2.5 h-2.5" aria-hidden="true" />
                            Neutral
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-400 hidden sm:table-cell">
                        {ms.totalValue2026.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-400 hidden sm:table-cell">
                        {ms.totalValue2027.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-black text-[#ffd700] tabular-nums">
                        {ms.totalValue.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                idx === 0 ? 'bg-[#ffd700]' : idx < 3 ? 'bg-emerald-400' : 'bg-blue-400'
                              )}
                              style={{ width: `${bar}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-600 tabular-nums w-8 text-right">
                            {bar}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Per-Manager Capital Summaries ── */}
        <section className="mb-12" aria-labelledby="manager-summary-heading">
          <h2 id="manager-summary-heading" className="text-base font-bold text-white mb-1">
            Per-Manager Capital Summary
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Picks held, extra picks acquired, and picks sent away. Extra picks = picks obtained from other teams. Deficit = own picks traded away.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MANAGER_SUMMARIES.map(ms => (
              <div
                key={ms.manager}
                className={cn(
                  'rounded-xl border bg-[#16213e] p-4',
                  ms.capitalStatus === 'rich'
                    ? 'border-emerald-500/30'
                    : ms.capitalStatus === 'deficit'
                    ? 'border-[#e94560]/30'
                    : 'border-[#2d4a66]'
                )}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-sm font-black text-white leading-tight">{ms.manager}</h3>
                  {ms.capitalStatus === 'rich' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                      <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
                      Rich
                    </span>
                  )}
                  {ms.capitalStatus === 'deficit' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30 shrink-0">
                      <TrendingDown className="w-2.5 h-2.5" aria-hidden="true" />
                      Deficit
                    </span>
                  )}
                </div>

                <div className="flex justify-between mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#ffd700] tabular-nums">{ms.totalValue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white tabular-nums">{ms.totalPicks}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Picks</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {ms.extraPicks > 0 && (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span className="text-emerald-300 font-semibold">+{ms.extraPicks} extra {ms.extraPicks === 1 ? 'pick' : 'picks'} acquired</span>
                    </div>
                  )}
                  {ms.deficitPicks > 0 && (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#e94560]/10 border border-[#e94560]/20">
                      <TrendingDown className="w-3 h-3 text-[#e94560] shrink-0" aria-hidden="true" />
                      <span className="text-[#e94560] font-semibold">{ms.deficitPicks} own {ms.deficitPicks === 1 ? 'pick' : 'picks'} traded away</span>
                    </div>
                  )}
                </div>

                {/* 2026 picks held */}
                {ms.picks2026.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">2026 Picks</p>
                    <div className="flex flex-wrap gap-1">
                      {ms.picks2026.map(p => (
                        <span
                          key={p.slot}
                          className={cn(
                            'inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border',
                            p.traded
                              ? 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40'
                              : 'bg-[#0d1b2a] text-slate-300 border-[#2d4a66]'
                          )}
                          title={p.traded ? `Acquired from ${p.originalOwner}` : 'Own pick'}
                        >
                          {p.slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2027 picks held */}
                {ms.picks2027.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">2027 Picks</p>
                    <div className="flex flex-wrap gap-1">
                      {ms.picks2027.map((p, i) => (
                        <span
                          key={`${p.round}-${i}`}
                          className={cn(
                            'inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border',
                            p.traded
                              ? 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40'
                              : 'bg-[#0d1b2a] text-slate-300 border-[#2d4a66]'
                          )}
                          title={p.traded ? `Acquired from ${p.originalOwner}` : 'Own pick'}
                        >
                          &apos;27 {p.round}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Full Pick Ownership Table ── */}
        <section className="mb-12" aria-labelledby="ownership-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 id="ownership-heading" className="text-base font-bold text-white mb-1">
                Full Pick Ownership Table
              </h2>
              <p className="text-xs text-slate-500">
                Gold border/arrow = pick moved to different team via trade.
              </p>
            </div>

            {/* Year tab toggle */}
            <div className="flex rounded-lg border border-[#2d4a66] overflow-hidden self-start sm:self-auto">
              {(['2026', '2027'] as YearTab[]).map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setYearTab(yr)}
                  className={cn(
                    'px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors',
                    yearTab === yr
                      ? 'bg-[#ffd700]/15 text-[#ffd700] border-r border-[#ffd700]/30'
                      : 'bg-[#0d1b2a] text-slate-400 hover:text-white hover:bg-[#1a2d42] border-r border-[#2d4a66]'
                  )}
                >
                  {yr} Draft
                </button>
              ))}
            </div>
          </div>

          {yearTab === '2026' && (
            <div className="space-y-6">
              {rounds2026.map(round => {
                const roundPicks = PICKS_2026.filter(p => p.round === round);
                const roundLabel2 = round === 1 ? '1st' : round === 2 ? '2nd' : '3rd';
                return (
                  <div key={round}>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                          roundBadge(round)
                        )}
                      >
                        {roundLabel(round)}
                      </span>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Round {roundLabel2} — 12 Picks
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                      <table
                        className="min-w-full text-xs"
                        aria-label={`2026 Round ${roundLabel2} pick ownership`}
                      >
                        <thead>
                          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Rd</th>
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Slot</th>
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Original Owner</th>
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Current Holder</th>
                            <th scope="col" className="px-3 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider">Value</th>
                            <th scope="col" className="px-3 py-2.5 text-center text-slate-400 font-semibold uppercase tracking-wider">Trade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e3347]">
                          {roundPicks.map((p, idx) => (
                            <PickRow
                              key={p.slot}
                              slot={p.slot}
                              round={p.round}
                              originalOwner={p.originalOwner}
                              currentHolder={p.currentHolder}
                              traded={p.traded}
                              value={PICK_VALUES_2026[p.slot] ?? 0}
                              idx={idx}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {yearTab === '2027' && (
            <div className="space-y-6">
              {(['1st', '2nd', '3rd'] as const).map(rd => {
                const rdPicks = PICKS_2027.filter(p => p.round === rd);
                const rdNum = rd === '1st' ? 1 : rd === '2nd' ? 2 : 3;
                return (
                  <div key={rd}>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                          roundBadge(rdNum)
                        )}
                      >
                        {roundLabel(rdNum)}
                      </span>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Round {rd} — Future Picks
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                      <table
                        className="min-w-full text-xs"
                        aria-label={`2027 Round ${rd} pick ownership`}
                      >
                        <thead>
                          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Rd</th>
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Original Owner</th>
                            <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Current Holder</th>
                            <th scope="col" className="px-3 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider">Est. Value</th>
                            <th scope="col" className="px-3 py-2.5 text-center text-slate-400 font-semibold uppercase tracking-wider">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e3347]">
                          {rdPicks.map((p, idx) => (
                            <tr
                              key={`${p.round}-${p.originalOwner}`}
                              className={cn(
                                'transition-colors hover:bg-[#1f3550]',
                                idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                                p.traded && 'outline outline-1 outline-[#ffd700]/20'
                              )}
                            >
                              <td className="px-3 py-2.5">
                                <span
                                  className={cn(
                                    'inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border',
                                    roundBadge(rdNum)
                                  )}
                                >
                                  {roundLabel(rdNum)}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-slate-400">{p.originalOwner}</td>
                              <td className="px-3 py-2.5">
                                {p.traded ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-[#ffd700]">
                                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                    {p.currentHolder}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">{p.currentHolder}</span>
                                )}
                              </td>
                              <td className="px-3 py-2.5 text-right font-mono font-black text-[#ffd700] tabular-nums">
                                {(PICK_VALUES_2027[p.round] ?? 0).toLocaleString()}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {p.note ? (
                                  <span className="text-[10px] text-slate-500 italic">{p.note}</span>
                                ) : p.traded ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30">
                                    Traded
                                  </span>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Legend ── */}
        <section className="mb-10" aria-labelledby="legend-heading">
          <h2 id="legend-heading" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Legend
          </h2>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded border border-[#ffd700]/40 bg-[#ffd700]/15" />
              <span className="text-slate-400">Gold highlight = pick traded to different team</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
              <span className="text-slate-400">Arrow = new holder (not original owner)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
                Rich
              </span>
              <span className="text-slate-400">= holds extra picks from trades</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30">
                <TrendingDown className="w-2.5 h-2.5" aria-hidden="true" />
                Deficit
              </span>
              <span className="text-slate-400">= traded own picks away</span>
            </div>
          </div>
        </section>

        {/* ── Bimfle Note ── */}
        <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6 text-center">
          <p className="text-sm text-slate-300 leading-relaxed italic max-w-2xl mx-auto">
            &ldquo;Draft capital is the dynasty&rsquo;s life blood. The manager who accumulates excess picks today shapes the league&rsquo;s power structure for years to come.&rdquo;
          </p>
          <p className="text-xs text-[#ffd700] font-bold mt-2 uppercase tracking-widest">
            &mdash; Love, Bimfle
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-center text-slate-600">
          Pick values are dynasty consensus estimates (March 2026). 2027 pick values assume average slot. Data reflects known trades as of March 2026. For entertainment and trade discussion purposes only.
        </p>

      </div>
    </>
  );
}
