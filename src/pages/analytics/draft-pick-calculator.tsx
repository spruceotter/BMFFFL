import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Calculator, TrendingUp, TrendingDown, Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Pick Value Data ───────────────────────────────────────────────────────────

interface PickEntry {
  label: string;
  value: number;
  year: number;
  round: number;
  slot: number | null; // null = unspecified future pick
  group: string; // display grouping
}

const PICK_CATALOG: PickEntry[] = [
  // 2026 1st round
  { label: '2026 1.01', value: 3200, year: 2026, round: 1, slot: 1,  group: '2026 1st Round' },
  { label: '2026 1.02', value: 2950, year: 2026, round: 1, slot: 2,  group: '2026 1st Round' },
  { label: '2026 1.03', value: 2700, year: 2026, round: 1, slot: 3,  group: '2026 1st Round' },
  { label: '2026 1.04', value: 2400, year: 2026, round: 1, slot: 4,  group: '2026 1st Round' },
  { label: '2026 1.05', value: 2200, year: 2026, round: 1, slot: 5,  group: '2026 1st Round' },
  { label: '2026 1.06', value: 1950, year: 2026, round: 1, slot: 6,  group: '2026 1st Round' },
  { label: '2026 1.07', value: 1750, year: 2026, round: 1, slot: 7,  group: '2026 1st Round' },
  { label: '2026 1.08', value: 1600, year: 2026, round: 1, slot: 8,  group: '2026 1st Round' },
  { label: '2026 1.09', value: 1450, year: 2026, round: 1, slot: 9,  group: '2026 1st Round' },
  { label: '2026 1.10', value: 1300, year: 2026, round: 1, slot: 10, group: '2026 1st Round' },
  { label: '2026 1.11', value: 1150, year: 2026, round: 1, slot: 11, group: '2026 1st Round' },
  { label: '2026 1.12', value: 1000, year: 2026, round: 1, slot: 12, group: '2026 1st Round' },
  // 2026 2nd round
  { label: '2026 2.01', value: 600, year: 2026, round: 2, slot: 1,  group: '2026 2nd Round' },
  { label: '2026 2.02', value: 550, year: 2026, round: 2, slot: 2,  group: '2026 2nd Round' },
  { label: '2026 2.03', value: 500, year: 2026, round: 2, slot: 3,  group: '2026 2nd Round' },
  { label: '2026 2.04', value: 470, year: 2026, round: 2, slot: 4,  group: '2026 2nd Round' },
  { label: '2026 2.05', value: 440, year: 2026, round: 2, slot: 5,  group: '2026 2nd Round' },
  { label: '2026 2.06', value: 410, year: 2026, round: 2, slot: 6,  group: '2026 2nd Round' },
  { label: '2026 2.07', value: 380, year: 2026, round: 2, slot: 7,  group: '2026 2nd Round' },
  { label: '2026 2.08', value: 350, year: 2026, round: 2, slot: 8,  group: '2026 2nd Round' },
  { label: '2026 2.09', value: 320, year: 2026, round: 2, slot: 9,  group: '2026 2nd Round' },
  { label: '2026 2.10', value: 290, year: 2026, round: 2, slot: 10, group: '2026 2nd Round' },
  { label: '2026 2.11', value: 260, year: 2026, round: 2, slot: 11, group: '2026 2nd Round' },
  { label: '2026 2.12', value: 230, year: 2026, round: 2, slot: 12, group: '2026 2nd Round' },
  // 2026 3rd round
  { label: '2026 3.01', value: 150, year: 2026, round: 3, slot: 1,  group: '2026 3rd Round' },
  { label: '2026 3.02', value: 140, year: 2026, round: 3, slot: 2,  group: '2026 3rd Round' },
  { label: '2026 3.03', value: 130, year: 2026, round: 3, slot: 3,  group: '2026 3rd Round' },
  { label: '2026 3.04', value: 125, year: 2026, round: 3, slot: 4,  group: '2026 3rd Round' },
  { label: '2026 3.05', value: 120, year: 2026, round: 3, slot: 5,  group: '2026 3rd Round' },
  { label: '2026 3.06', value: 115, year: 2026, round: 3, slot: 6,  group: '2026 3rd Round' },
  { label: '2026 3.07', value: 110, year: 2026, round: 3, slot: 7,  group: '2026 3rd Round' },
  { label: '2026 3.08', value: 105, year: 2026, round: 3, slot: 8,  group: '2026 3rd Round' },
  { label: '2026 3.09', value: 100, year: 2026, round: 3, slot: 9,  group: '2026 3rd Round' },
  { label: '2026 3.10', value: 95,  year: 2026, round: 3, slot: 10, group: '2026 3rd Round' },
  { label: '2026 3.11', value: 88,  year: 2026, round: 3, slot: 11, group: '2026 3rd Round' },
  { label: '2026 3.12', value: 80,  year: 2026, round: 3, slot: 12, group: '2026 3rd Round' },
  // 2027 future picks (unspecified slot)
  { label: '2027 1st',  value: 1800, year: 2027, round: 1, slot: null, group: '2027 Future' },
  { label: '2027 2nd',  value: 450,  year: 2027, round: 2, slot: null, group: '2027 Future' },
  { label: '2027 3rd',  value: 120,  year: 2027, round: 3, slot: null, group: '2027 Future' },
  // 2028 future picks (unspecified slot)
  { label: '2028 1st',  value: 1400, year: 2028, round: 1, slot: null, group: '2028 Future' },
  { label: '2028 2nd',  value: 350,  year: 2028, round: 2, slot: null, group: '2028 Future' },
  { label: '2028 3rd',  value: 100,  year: 2028, round: 3, slot: null, group: '2028 Future' },
];

const PICK_BY_LABEL: Record<string, PickEntry> = Object.fromEntries(
  PICK_CATALOG.map(p => [p.label, p])
);

// Groups for the dropdown
const PICK_GROUPS = ['2026 1st Round', '2026 2nd Round', '2026 3rd Round', '2027 Future', '2028 Future'] as const;

// ─── Team Inventory ────────────────────────────────────────────────────────────

interface TeamInventory {
  team: string;
  picks: string[];
}

const TEAM_INVENTORY: TeamInventory[] = [
  {
    team: 'Tubes94',
    picks: ['2026 1.01', '2026 2.03', '2027 1st'],
  },
  {
    team: 'MLSchools12',
    picks: ['2026 1.04', '2026 1.07', '2026 2.01', '2027 1st', '2028 1st'],
  },
  {
    team: 'JuicyBussy',
    picks: ['2026 1.02', '2026 2.05', '2027 1st'],
  },
  {
    team: 'Grandes',
    picks: ['2026 1.06', '2026 3.02', '2027 1st'],
  },
  {
    team: 'Cogdeill11',
    picks: ['2026 1.12', '2027 1st'],
  },
  {
    team: 'SexMachineAndyD',
    picks: ['2026 1.03', '2026 2.02', '2027 1st'],
  },
];

// ─── Round badge styles ────────────────────────────────────────────────────────

function roundBadgeStyle(round: number, future: boolean): string {
  if (future) return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  if (round === 1) return 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30';
  if (round === 2) return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
}

function roundLabel(round: number, future: boolean): string {
  if (future) return 'FUT';
  if (round === 1) return '1ST';
  if (round === 2) return '2ND';
  return '3RD';
}

// ─── Fairness meter / verdict ──────────────────────────────────────────────────

interface Verdict {
  label: string;
  pctDiff: number; // absolute percentage advantage of winning side
  winner: 'A' | 'B' | null;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  barA: number; // 0–100 width percentage for Side A
  barB: number; // 0–100 width percentage for Side B
}

function getVerdict(totalA: number, totalB: number): Verdict {
  const sum = totalA + totalB;
  const pctDiff = sum === 0 ? 0 : Math.round((Math.abs(totalA - totalB) / sum) * 100);
  const winner: 'A' | 'B' | null =
    totalA > totalB ? 'A' : totalB > totalA ? 'B' : null;

  let label: string;
  let colorClass: string;
  let borderClass: string;
  let bgClass: string;

  if (pctDiff === 0) {
    label = 'EVEN TRADE';
    colorClass = 'text-slate-300';
    borderClass = 'border-slate-500/30';
    bgClass = 'bg-slate-500/10';
  } else if (pctDiff <= 5) {
    label = `SLIGHT EDGE — Side ${winner}`;
    colorClass = 'text-blue-300';
    borderClass = 'border-blue-500/30';
    bgClass = 'bg-blue-500/10';
  } else if (pctDiff <= 15) {
    label = `CLEAR ADVANTAGE — Side ${winner}`;
    colorClass = 'text-amber-400';
    borderClass = 'border-amber-500/30';
    bgClass = 'bg-amber-500/10';
  } else {
    label = `LOPSIDED — Side ${winner} wins big`;
    colorClass = 'text-[#e94560]';
    borderClass = 'border-[#e94560]/30';
    bgClass = 'bg-[#e94560]/10';
  }

  const totalForBar = totalA + totalB;
  const barA = totalForBar === 0 ? 50 : Math.round((totalA / totalForBar) * 100);
  const barB = 100 - barA;

  return { label, pctDiff, winner, colorClass, borderClass, bgClass, barA, barB };
}

// ─── Side panel ───────────────────────────────────────────────────────────────

interface SideState {
  picks: string[]; // labels
}

interface SidePanelProps {
  label: 'A' | 'B';
  side: SideState;
  onAdd: (label: string) => void;
  onRemove: (label: string) => void;
  total: number;
  isWinner: boolean | null; // true=winning, false=losing, null=tied/empty
}

function SidePanel({ label, side, onAdd, onRemove, total, isWinner }: SidePanelProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>(PICK_GROUPS[0]);

  const availableInGroup = useMemo(
    () =>
      PICK_CATALOG.filter(
        p => p.group === selectedGroup && !side.picks.includes(p.label)
      ),
    [selectedGroup, side.picks]
  );

  const headerValueColor =
    isWinner === true
      ? 'text-emerald-400'
      : isWinner === false
      ? 'text-[#e94560]'
      : 'text-[#ffd700]';

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isWinner === true && (
            <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          )}
          {isWinner === false && (
            <TrendingDown className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
          )}
          <h2 className="text-lg font-black text-white">Side {label}</h2>
        </div>
        <div className="text-right">
          <p className={cn('text-3xl font-black tabular-nums leading-tight', headerValueColor)}>
            {total.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            total value
          </p>
        </div>
      </div>

      {/* Pick selector */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
          Add a Pick
        </p>
        {/* Group tabs */}
        <div className="flex flex-wrap gap-1 mb-2">
          {PICK_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={cn(
                'px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors',
                selectedGroup === g
                  ? 'bg-[#ffd700]/15 border-[#ffd700]/40 text-[#ffd700]'
                  : 'bg-[#0d1b2a] border-[#2d4a66] text-slate-500 hover:text-slate-300 hover:border-[#3d5a76]'
              )}
            >
              {g}
            </button>
          ))}
        </div>
        {/* Pick buttons */}
        <div className="flex flex-wrap gap-1.5">
          {availableInGroup.length === 0 ? (
            <p className="text-xs text-slate-600 italic py-1">All picks in this group added</p>
          ) : (
            availableInGroup.map(p => (
              <button
                key={p.label}
                onClick={() => onAdd(p.label)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#2d4a66] bg-[#0d1b2a] text-xs font-mono font-semibold text-slate-300 hover:border-[#ffd700]/40 hover:text-[#ffd700] transition-colors"
              >
                <Plus className="w-3 h-3" aria-hidden="true" />
                {p.label}
                <span className="text-slate-600 font-normal ml-0.5">({p.value.toLocaleString()})</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected picks */}
      <div className="flex-1 min-h-[100px]">
        {side.picks.length === 0 ? (
          <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-[#2d4a66] py-8">
            <p className="text-xs text-slate-600">No picks added yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {side.picks.map(pickLabel => {
              const entry = PICK_BY_LABEL[pickLabel];
              if (!entry) return null;
              const isFuture = entry.slot === null;
              return (
                <div
                  key={pickLabel}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#2d4a66] bg-[#0d1b2a]"
                >
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0',
                      roundBadgeStyle(entry.round, isFuture)
                    )}
                  >
                    {roundLabel(entry.round, isFuture)}
                  </span>
                  <span className="flex-1 text-sm text-white font-mono font-bold">{pickLabel}</span>
                  <span className="text-xs font-mono font-black text-[#ffd700] tabular-nums shrink-0">
                    {entry.value.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onRemove(pickLabel)}
                    className="text-slate-600 hover:text-[#e94560] transition-colors shrink-0"
                    aria-label={`Remove ${pickLabel}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear side */}
      {side.picks.length > 0 && (
        <button
          onClick={() => side.picks.forEach(p => onRemove(p))}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e94560]/30 bg-[#e94560]/5 text-xs font-semibold text-[#e94560] hover:bg-[#e94560]/10 transition-colors self-start"
        >
          <Minus className="w-3 h-3" aria-hidden="true" />
          Clear Side {label}
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraftPickCalculatorPage() {
  const [sideA, setSideA] = useState<SideState>({ picks: [] });
  const [sideB, setSideB] = useState<SideState>({ picks: [] });

  const totalA = useMemo(
    () => sideA.picks.reduce((s, lbl) => s + (PICK_BY_LABEL[lbl]?.value ?? 0), 0),
    [sideA.picks]
  );
  const totalB = useMemo(
    () => sideB.picks.reduce((s, lbl) => s + (PICK_BY_LABEL[lbl]?.value ?? 0), 0),
    [sideB.picks]
  );

  const hasContent = sideA.picks.length + sideB.picks.length > 0;
  const hasBothSides = sideA.picks.length > 0 && sideB.picks.length > 0;

  const verdict = useMemo(() => (hasBothSides ? getVerdict(totalA, totalB) : null), [totalA, totalB, hasBothSides]);

  const isWinnerA = hasBothSides ? totalA > totalB ? true : totalB > totalA ? false : null : null;
  const isWinnerB = hasBothSides ? totalB > totalA ? true : totalA > totalB ? false : null : null;

  const addToA = useCallback((lbl: string) => setSideA(p => ({ picks: [...p.picks, lbl] })), []);
  const removeFromA = useCallback((lbl: string) => setSideA(p => ({ picks: p.picks.filter(x => x !== lbl) })), []);
  const addToB = useCallback((lbl: string) => setSideB(p => ({ picks: [...p.picks, lbl] })), []);
  const removeFromB = useCallback((lbl: string) => setSideB(p => ({ picks: p.picks.filter(x => x !== lbl) })), []);

  const handleReset = useCallback(() => {
    setSideA({ picks: [] });
    setSideB({ picks: [] });
  }, []);

  return (
    <>
      <Head>
        <title>Draft Pick Calculator — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Dynasty draft pick trade calculator for BMFFFL. Compare pick values across 2026–2028 and evaluate trade fairness."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Draft Pick Calculator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Estimate the relative value of draft picks for dynasty trade purposes.
            Add picks to each side to see who comes out ahead.
          </p>
        </header>

        {/* ── Trade evaluator ── */}
        <section className="mb-10" aria-labelledby="evaluator-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="evaluator-heading" className="text-base font-bold text-white">
              Trade Evaluator
            </h2>
            {hasContent && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e94560]/30 bg-[#e94560]/5 text-xs font-semibold text-[#e94560] hover:bg-[#e94560]/10 transition-colors"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <SidePanel
              label="A"
              side={sideA}
              onAdd={addToA}
              onRemove={removeFromA}
              total={totalA}
              isWinner={isWinnerA}
            />

            {/* VS divider — visible on mobile between panels */}
            <div className="flex items-center justify-center lg:hidden">
              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-[#2d4a66]" />
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">vs</span>
                <div className="h-px w-16 bg-[#2d4a66]" />
              </div>
            </div>

            <SidePanel
              label="B"
              side={sideB}
              onAdd={addToB}
              onRemove={removeFromB}
              total={totalB}
              isWinner={isWinnerB}
            />
          </div>

          {/* ── Verdict / fairness meter ── */}
          {hasBothSides && verdict && (
            <div
              className={cn(
                'rounded-xl border p-6 mb-2',
                verdict.bgClass,
                verdict.borderClass
              )}
              role="status"
              aria-live="polite"
            >
              {/* Score row */}
              <div className="flex items-center justify-center gap-8 mb-5">
                <div className="text-center min-w-[80px]">
                  <p
                    className={cn(
                      'text-4xl font-black tabular-nums',
                      isWinnerA === true
                        ? 'text-emerald-400'
                        : isWinnerA === false
                        ? 'text-[#e94560]'
                        : 'text-white'
                    )}
                  >
                    {totalA.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
                    Side A
                  </p>
                </div>

                <div className="text-center">
                  <span className="text-sm font-black text-slate-600 uppercase tracking-widest">vs</span>
                </div>

                <div className="text-center min-w-[80px]">
                  <p
                    className={cn(
                      'text-4xl font-black tabular-nums',
                      isWinnerB === true
                        ? 'text-emerald-400'
                        : isWinnerB === false
                        ? 'text-[#e94560]'
                        : 'text-white'
                    )}
                  >
                    {totalB.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
                    Side B
                  </p>
                </div>
              </div>

              {/* Fairness bar */}
              <div className="mb-4">
                <div className="flex rounded-full overflow-hidden h-3 bg-[#0d1b2a]">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      isWinnerA === true ? 'bg-emerald-500' : isWinnerA === false ? 'bg-[#e94560]' : 'bg-slate-500'
                    )}
                    style={{ width: `${verdict.barA}%` }}
                  />
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      isWinnerB === true ? 'bg-emerald-500' : isWinnerB === false ? 'bg-[#e94560]' : 'bg-slate-500'
                    )}
                    style={{ width: `${verdict.barB}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600 font-semibold">Side A</span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {verdict.pctDiff === 0
                      ? 'Exactly even'
                      : `Side ${verdict.winner} +${verdict.pctDiff}%`}
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold">Side B</span>
                </div>
              </div>

              {/* Verdict label */}
              <p
                className={cn(
                  'text-center text-lg font-black uppercase tracking-widest',
                  verdict.colorClass
                )}
              >
                {verdict.label}
              </p>
              <p className="text-center text-xs text-slate-500 mt-1.5">
                Raw difference:{' '}
                <span className="font-semibold text-slate-400">
                  {Math.abs(totalA - totalB).toLocaleString()} points
                </span>
              </p>
            </div>
          )}

          {!hasContent && (
            <div className="rounded-xl border border-dashed border-[#2d4a66] p-8 text-center">
              <Calculator className="w-8 h-8 text-slate-700 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-slate-600">
                Add picks to both sides to see the trade verdict and fairness meter.
              </p>
            </div>
          )}
        </section>

        {/* ── 2026 1st round reference table ── */}
        <section className="mb-10" aria-labelledby="pick-values-heading">
          <h2 id="pick-values-heading" className="text-base font-bold text-white mb-4">
            Pick Value Reference
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* 2026 1st round — full slot table */}
            <div className="lg:col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                2026 First Round (by slot)
              </p>
              <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                <table className="min-w-full text-xs" aria-label="2026 first round pick values">
                  <thead>
                    <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                      <th scope="col" className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider">Pick</th>
                      <th scope="col" className="px-3 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-3 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">vs. Next</th>
                      <th scope="col" className="px-3 py-2.5 text-right text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3347]">
                    {PICK_CATALOG.filter(p => p.year === 2026 && p.round === 1).map((p, idx, arr) => {
                      const drop = idx < arr.length - 1 ? p.value - arr[idx + 1].value : null;
                      const tier =
                        p.slot !== null && p.slot <= 3
                          ? { label: 'Elite', cls: 'text-[#ffd700]' }
                          : p.slot !== null && p.slot <= 6
                          ? { label: 'Premium', cls: 'text-emerald-400' }
                          : p.slot !== null && p.slot <= 9
                          ? { label: 'Mid', cls: 'text-blue-400' }
                          : { label: 'Late', cls: 'text-slate-400' };
                      return (
                        <tr
                          key={p.label}
                          className={cn(
                            'transition-colors hover:bg-[#1f3550]',
                            idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          <td className="px-3 py-2 font-mono font-bold text-white">{p.label}</td>
                          <td className="px-3 py-2 text-right font-mono font-black text-[#ffd700] tabular-nums">
                            {p.value.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-slate-500 hidden sm:table-cell">
                            {drop !== null ? `−${drop}` : '—'}
                          </td>
                          <td className={cn('px-3 py-2 text-right font-semibold hidden sm:table-cell', tier.cls)}>
                            {tier.label}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary: 2nd/3rd round ranges + future picks */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  2026 Later Rounds (range)
                </p>
                <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                  <table className="min-w-full text-xs" aria-label="2026 second and third round pick value ranges">
                    <thead>
                      <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                        <th scope="col" className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">Round</th>
                        <th scope="col" className="px-3 py-2 text-right text-slate-400 font-semibold uppercase tracking-wider">Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3347]">
                      {[2, 3].map((round, idx) => {
                        const slots = PICK_CATALOG.filter(p => p.year === 2026 && p.round === round);
                        const max = Math.max(...slots.map(p => p.value));
                        const min = Math.min(...slots.map(p => p.value));
                        return (
                          <tr key={round} className={idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'}>
                            <td className="px-3 py-2 font-semibold text-white">2026 {round === 2 ? '2nd' : '3rd'}</td>
                            <td className="px-3 py-2 text-right font-mono text-[#ffd700] tabular-nums">
                              {min}–{max}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Future Picks (unspecified slot)
                </p>
                <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                  <table className="min-w-full text-xs" aria-label="Future pick values">
                    <thead>
                      <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                        <th scope="col" className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">Pick</th>
                        <th scope="col" className="px-3 py-2 text-right text-slate-400 font-semibold uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3347]">
                      {PICK_CATALOG.filter(p => p.slot === null).map((p, idx) => (
                        <tr
                          key={p.label}
                          className={cn(
                            'transition-colors hover:bg-[#1f3550]',
                            idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          <td className="px-3 py-2 font-mono font-bold text-white">{p.label}</td>
                          <td className="px-3 py-2 text-right font-mono font-black text-[#ffd700] tabular-nums">
                            {p.value.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Team pick inventory ── */}
        <section aria-labelledby="inventory-heading">
          <h2 id="inventory-heading" className="text-base font-bold text-white mb-4">
            Notable Pick Inventory
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Current draft capital held by BMFFFL managers with known notable picks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM_INVENTORY.map(team => {
              const teamTotal = team.picks.reduce(
                (s, lbl) => s + (PICK_BY_LABEL[lbl]?.value ?? 0),
                0
              );
              return (
                <div
                  key={team.team}
                  className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-black text-white">{team.team}</h3>
                    <span className="text-xs font-mono font-black text-[#ffd700] tabular-nums">
                      {teamTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {team.picks.map(lbl => {
                      const entry = PICK_BY_LABEL[lbl];
                      if (!entry) return null;
                      const isFuture = entry.slot === null;
                      return (
                        <div
                          key={lbl}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#1e3347] bg-[#0d1b2a]"
                        >
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0',
                              roundBadgeStyle(entry.round, isFuture)
                            )}
                          >
                            {roundLabel(entry.round, isFuture)}
                          </span>
                          <span className="flex-1 text-xs font-mono font-semibold text-slate-300">
                            {lbl}
                          </span>
                          <span className="text-[10px] font-mono font-black text-[#ffd700] tabular-nums shrink-0">
                            {entry.value.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-10 text-xs text-center text-slate-600">
          Pick values are dynasty consensus estimates (March 2026) and do not represent any specific service.
          Future pick values assume average slot and adjust downward for draft year uncertainty.
          For entertainment and trade discussion purposes only.
        </p>

      </div>
    </>
  );
}
