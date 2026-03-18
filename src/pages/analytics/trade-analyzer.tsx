import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { ArrowLeftRight, X, Plus, Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface PlayerEntry {
  value: number;
  pos: Position;
  age: number;
  owner: string;
}

const PLAYER_VALUES: Record<string, PlayerEntry> = {
  'Josh Allen':         { value: 99, pos: 'QB', age: 29, owner: 'eldridm20' },
  'Lamar Jackson':      { value: 97, pos: 'QB', age: 28, owner: 'MLSchools12' },
  "Ja'Marr Chase":      { value: 96, pos: 'WR', age: 25, owner: 'Cogdeill11' },
  'Patrick Mahomes':    { value: 94, pos: 'QB', age: 30, owner: 'rbr' },
  'CeeDee Lamb':        { value: 94, pos: 'WR', age: 26, owner: 'MLSchools12' },
  'Bijan Robinson':     { value: 95, pos: 'RB', age: 23, owner: 'Tubes94' },
  'Breece Hall':        { value: 93, pos: 'RB', age: 24, owner: 'Tubes94' },
  'Colston Loveland':   { value: 90, pos: 'TE', age: 23, owner: 'Cogdeill11' },
  'Ashton Jeanty':      { value: 91, pos: 'RB', age: 22, owner: 'Grandes' },
  'Omarion Hampton':    { value: 90, pos: 'RB', age: 22, owner: 'Cogdeill11' },
  'Joe Burrow':         { value: 92, pos: 'QB', age: 29, owner: 'JuicyBussy' },
  'Harold Fannin Jr.':  { value: 88, pos: 'TE', age: 23, owner: 'JuicyBussy' },
  'Malik Nabers':       { value: 88, pos: 'WR', age: 22, owner: 'JuicyBussy' },
  'Trevor Lawrence':    { value: 88, pos: 'QB', age: 26, owner: 'Tubes94' },
  'Tetairoa McMillan':  { value: 89, pos: 'WR', age: 22, owner: 'tdtd19844' },
  'Jordan Love':        { value: 85, pos: 'QB', age: 26, owner: 'Bimfle' },
  'Kyler Murray':       { value: 82, pos: 'QB', age: 27, owner: 'MLSchools12' },
  'Bucky Irving':       { value: 84, pos: 'RB', age: 23, owner: 'MLSchools12' },
  'Quinshon Judkins':   { value: 83, pos: 'RB', age: 22, owner: 'rbr' },
  "De'Von Achane":      { value: 81, pos: 'RB', age: 23, owner: 'JuicyBussy' },
  'Luther Burden III':  { value: 86, pos: 'WR', age: 22, owner: 'eldridm20' },
  'Elic Ayomanor':      { value: 82, pos: 'WR', age: 23, owner: 'rbr' },
  'Matthew Golden':     { value: 81, pos: 'WR', age: 22, owner: 'JuicyBussy' },
  'Puka Nacua':         { value: 80, pos: 'WR', age: 24, owner: 'Tubes94' },
  'Tyler Warren':       { value: 85, pos: 'TE', age: 23, owner: 'SexMachineAndyD' },
  'Sam LaPorta':        { value: 78, pos: 'TE', age: 24, owner: 'tdtd19844' },
  'Jonathan Taylor':    { value: 72, pos: 'RB', age: 27, owner: 'SexMachineAndyD' },
  'Josh Jacobs':        { value: 73, pos: 'RB', age: 27, owner: 'MLSchools12' },
  'Tee Higgins':        { value: 70, pos: 'WR', age: 26, owner: 'tdtd19844' },
  'Drake London':       { value: 74, pos: 'WR', age: 24, owner: 'Tubes94' },
};

const ALL_PLAYERS = Object.entries(PLAYER_VALUES)
  .map(([name, data]) => ({ name, ...data }))
  .sort((a, b) => b.value - a.value);

const PICK_VALUES: Record<string, number> = {
  '1.01': 85, '1.02': 78, '1.03': 72, '1.04': 66, '1.05': 60, '1.06': 55,
  '1.07': 50, '1.08': 46, '1.09': 42, '1.10': 38, '1.11': 35, '1.12': 32,
  '2.01': 28, '2.02': 26, '2.03': 24, '2.04': 22, '2.05': 20,
  '3.01': 15, '3.02': 13, '3.03': 11,
};

const ALL_PICKS = Object.entries(PICK_VALUES)
  .map(([pick, value]) => ({ pick, value }))
  .sort((a, b) => b.value - a.value);

// ─── Preset Trades ────────────────────────────────────────────────────────────

interface PresetTrade {
  id: string;
  label: string;
  description: string;
  sideA: { players: string[]; picks: string[] };
  sideB: { players: string[]; picks: string[] };
}

const PRESET_TRADES: PresetTrade[] = [
  {
    id: 'tubes-ml',
    label: 'Trade t007: Tubes94 — MLSchools12',
    description: '2023 pickup — Bijan Robinson for CeeDee Lamb + 2.01',
    sideA: { players: ['Bijan Robinson'], picks: [] },
    sideB: { players: ['CeeDee Lamb'], picks: ['2.01'] },
  },
  {
    id: 'cogdeill-juicy',
    label: 'Trade t012: Cogdeill11 — JuicyBussy',
    description: "Ja'Marr Chase for Joe Burrow + Malik Nabers",
    sideA: { players: ["Ja'Marr Chase"], picks: [] },
    sideB: { players: ['Joe Burrow', 'Malik Nabers'], picks: [] },
  },
  {
    id: 'eldrid-rbr',
    label: 'Trade t019: eldridm20 — rbr',
    description: 'Josh Allen for Patrick Mahomes + 1.04 + 2.03',
    sideA: { players: ['Josh Allen'], picks: [] },
    sideB: { players: ['Patrick Mahomes'], picks: ['1.04', '2.03'] },
  },
];

// ─── Verdict Logic ────────────────────────────────────────────────────────────

interface VerdictResult {
  label: string;
  winner: string | null;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

function getVerdict(totalA: number, totalB: number): VerdictResult {
  const diff = Math.abs(totalA - totalB);
  const winner = totalA > totalB ? 'Side A' : totalB > totalA ? 'Side B' : null;

  if (diff <= 5) {
    return {
      label: 'FAIR TRADE',
      winner: null,
      colorClass: 'text-slate-300',
      borderClass: 'border-slate-500/30',
      bgClass: 'bg-slate-500/10',
    };
  }
  if (diff <= 15) {
    return {
      label: `SLIGHT ADVANTAGE — ${winner}`,
      winner,
      colorClass: 'text-blue-400',
      borderClass: 'border-blue-500/30',
      bgClass: 'bg-blue-500/10',
    };
  }
  if (diff <= 30) {
    return {
      label: `CLEAR ADVANTAGE — ${winner}`,
      winner,
      colorClass: 'text-amber-400',
      borderClass: 'border-amber-500/30',
      bgClass: 'bg-amber-500/10',
    };
  }
  return {
    label: `LOPSIDED — ${winner} wins significantly`,
    winner,
    colorClass: 'text-[#e94560]',
    borderClass: 'border-[#e94560]/30',
    bgClass: 'bg-[#e94560]/10',
  };
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

// ─── Trade Side ───────────────────────────────────────────────────────────────

interface TradeSideState {
  players: string[];
  picks: string[];
}

interface TradeSideProps {
  label: string;
  side: TradeSideState;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (name: string) => void;
  onAddPick: (pick: string) => void;
  onRemovePick: (pick: string) => void;
  totalValue: number;
  ageBonus: boolean;
}

function TradeSide({
  label,
  side,
  onAddPlayer,
  onRemovePlayer,
  onAddPick,
  onRemovePick,
  totalValue,
  ageBonus,
}: TradeSideProps) {
  const [playerSearch, setPlayerSearch] = useState('');

  const filteredPlayers = useMemo(() => {
    if (!playerSearch.trim()) return [];
    const q = playerSearch.toLowerCase();
    return ALL_PLAYERS
      .filter(p => p.name.toLowerCase().includes(q) && !side.players.includes(p.name))
      .slice(0, 6);
  }, [playerSearch, side.players]);

  const availablePicks = ALL_PICKS.filter(p => !side.picks.includes(p.pick));

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">{label}</h2>
        <div className="text-right">
          <p className="text-2xl font-black text-[#ffd700] tabular-nums leading-tight">
            {totalValue}
          </p>
          {ageBonus && (
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              +5 Youth Bonus
            </p>
          )}
        </div>
      </div>

      {/* Player search */}
      <div className="relative">
        <label htmlFor={`player-search-${label}`} className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
          Add Player
        </label>
        <input
          id={`player-search-${label}`}
          type="text"
          value={playerSearch}
          onChange={e => setPlayerSearch(e.target.value)}
          placeholder="Search player name..."
          className="w-full px-3 py-2 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20"
          autoComplete="off"
        />
        {filteredPlayers.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 rounded-lg border border-[#2d4a66] bg-[#16213e] shadow-xl overflow-hidden">
            {filteredPlayers.map(p => (
              <button
                key={p.name}
                onClick={() => { onAddPlayer(p.name); setPlayerSearch(''); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#1f3550] transition-colors text-left"
              >
                <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0', POS_STYLES[p.pos])}>
                  {p.pos}
                </span>
                <span className="flex-1 text-sm text-white font-medium">{p.name}</span>
                <span className="text-xs font-mono font-bold text-[#ffd700] tabular-nums">{p.value}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pick selector */}
      <div>
        <label htmlFor={`pick-select-${label}`} className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
          Add Draft Pick
        </label>
        <div className="flex gap-2">
          <select
            id={`pick-select-${label}`}
            defaultValue=""
            onChange={e => {
              if (e.target.value) {
                onAddPick(e.target.value);
                e.target.value = '';
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] text-sm text-white focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20"
            aria-label={`Add draft pick to ${label}`}
          >
            <option value="" disabled>Select a pick...</option>
            {availablePicks.map(p => (
              <option key={p.pick} value={p.pick}>
                {p.pick} (value: {p.value})
              </option>
            ))}
          </select>
          <Plus className="w-5 h-5 text-slate-600 self-center shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* Selected items */}
      <div className="flex-1 min-h-[120px]">
        {side.players.length === 0 && side.picks.length === 0 ? (
          <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-[#2d4a66] py-8">
            <p className="text-xs text-slate-600">Add players or picks above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {side.players.map(name => {
              const data = PLAYER_VALUES[name];
              if (!data) return null;
              return (
                <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#2d4a66] bg-[#0d1b2a]">
                  <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0', POS_STYLES[data.pos])}>
                    {data.pos}
                  </span>
                  <span className="flex-1 text-sm text-white font-medium leading-tight">
                    {name}
                    <span className="ml-2 text-[10px] text-slate-500">Age {data.age} &bull; {data.owner}</span>
                  </span>
                  <span className="text-xs font-mono font-black text-[#ffd700] tabular-nums shrink-0">
                    {data.value}
                  </span>
                  <button
                    onClick={() => onRemovePlayer(name)}
                    className="text-slate-600 hover:text-[#e94560] transition-colors shrink-0"
                    aria-label={`Remove ${name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {side.picks.map(pick => {
              const val = PICK_VALUES[pick] ?? 0;
              return (
                <div key={pick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#2d4a66] bg-[#0d1b2a]">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border bg-slate-500/15 text-slate-300 border-slate-500/30 shrink-0">
                    PICK
                  </span>
                  <span className="flex-1 text-sm text-white font-mono font-bold">{pick}</span>
                  <span className="text-xs font-mono font-black text-[#ffd700] tabular-nums shrink-0">
                    {val}
                  </span>
                  <button
                    onClick={() => onRemovePick(pick)}
                    className="text-slate-600 hover:text-[#e94560] transition-colors shrink-0"
                    aria-label={`Remove ${pick}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const EMPTY_SIDE: TradeSideState = { players: [], picks: [] };

export default function TradeAnalyzerPage() {
  const [sideA, setSideA] = useState<TradeSideState>(EMPTY_SIDE);
  const [sideB, setSideB] = useState<TradeSideState>(EMPTY_SIDE);

  // Value calculation
  const calcTotal = useCallback((side: TradeSideState) => {
    const playerTotal = side.players.reduce((sum, name) => sum + (PLAYER_VALUES[name]?.value ?? 0), 0);
    const pickTotal = side.picks.reduce((sum, pick) => sum + (PICK_VALUES[pick] ?? 0), 0);
    return playerTotal + pickTotal;
  }, []);

  const calcAgeBonus = useCallback((side: TradeSideState): boolean => {
    if (side.players.length === 0) return false;
    const avgAge = side.players.reduce((sum, name) => sum + (PLAYER_VALUES[name]?.age ?? 30), 0) / side.players.length;
    return avgAge <= 23;
  }, []);

  const rawA = useMemo(() => calcTotal(sideA), [sideA, calcTotal]);
  const rawB = useMemo(() => calcTotal(sideB), [sideB, calcTotal]);
  const ageA = useMemo(() => calcAgeBonus(sideA), [sideA, calcAgeBonus]);
  const ageB = useMemo(() => calcAgeBonus(sideB), [sideB, calcAgeBonus]);
  const totalA = rawA + (ageA ? 5 : 0);
  const totalB = rawB + (ageB ? 5 : 0);

  const verdict = useMemo(() => getVerdict(totalA, totalB), [totalA, totalB]);

  const hasContent = sideA.players.length + sideA.picks.length + sideB.players.length + sideB.picks.length > 0;

  const handleReset = useCallback(() => {
    setSideA(EMPTY_SIDE);
    setSideB(EMPTY_SIDE);
  }, []);

  const handlePreset = useCallback((preset: PresetTrade) => {
    setSideA({ players: preset.sideA.players, picks: preset.sideA.picks });
    setSideB({ players: preset.sideB.players, picks: preset.sideB.picks });
  }, []);

  // Side A handlers
  const addPlayerA = useCallback((name: string) => setSideA(p => ({ ...p, players: [...p.players, name] })), []);
  const removePlayerA = useCallback((name: string) => setSideA(p => ({ ...p, players: p.players.filter(n => n !== name) })), []);
  const addPickA = useCallback((pick: string) => setSideA(p => ({ ...p, picks: [...p.picks, pick] })), []);
  const removePickA = useCallback((pick: string) => setSideA(p => ({ ...p, picks: p.picks.filter(k => k !== pick) })), []);

  // Side B handlers
  const addPlayerB = useCallback((name: string) => setSideB(p => ({ ...p, players: [...p.players, name] })), []);
  const removePlayerB = useCallback((name: string) => setSideB(p => ({ ...p, players: p.players.filter(n => n !== name) })), []);
  const addPickB = useCallback((pick: string) => setSideB(p => ({ ...p, picks: [...p.picks, pick] })), []);
  const removePickB = useCallback((pick: string) => setSideB(p => ({ ...p, picks: p.picks.filter(k => k !== pick) })), []);

  return (
    <>
      <Head>
        <title>Trade Analyzer — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Dynasty trade analyzer for BMFFFL managers. Evaluate trade proposals using dynasty value scores, pick values, and age bonuses."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Trade Analyzer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Evaluate dynasty trade proposals using value scores. Add players and picks to each side to see the verdict.
          </p>
        </header>

        {/* Preset trade buttons */}
        <section className="mb-8" aria-labelledby="presets-heading">
          <p id="presets-heading" className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
            Load Trade Example
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TRADES.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-xs font-semibold text-slate-300 hover:border-[#ffd700]/40 hover:text-[#ffd700] transition-colors"
                title={preset.description}
              >
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                {preset.label}
              </button>
            ))}
            {hasContent && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e94560]/30 bg-[#e94560]/5 text-xs font-semibold text-[#e94560] hover:bg-[#e94560]/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Clear All
              </button>
            )}
          </div>
        </section>

        {/* Two-panel trade builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <TradeSide
            label="Side A"
            side={sideA}
            onAddPlayer={addPlayerA}
            onRemovePlayer={removePlayerA}
            onAddPick={addPickA}
            onRemovePick={removePickA}
            totalValue={totalA}
            ageBonus={ageA}
          />

          {/* VS divider on mobile */}
          <div className="flex items-center justify-center lg:hidden">
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-[#2d4a66]" />
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">vs</span>
              <div className="h-px w-16 bg-[#2d4a66]" />
            </div>
          </div>

          <TradeSide
            label="Side B"
            side={sideB}
            onAddPlayer={addPlayerB}
            onRemovePlayer={removePlayerB}
            onAddPick={addPickB}
            onRemovePick={removePickB}
            totalValue={totalB}
            ageBonus={ageB}
          />
        </div>

        {/* Verdict panel */}
        {hasContent && (
          <div
            className={cn(
              'rounded-xl border p-6 text-center mb-8',
              verdict.bgClass,
              verdict.borderClass
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-center gap-6 mb-4">
              {/* Side A score */}
              <div className="text-center">
                <p className="text-3xl font-black tabular-nums text-white">{totalA}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Side A</p>
                {ageA && <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Youth +5</p>}
              </div>

              {/* Divider */}
              <ArrowLeftRight className="w-6 h-6 text-slate-600 shrink-0" aria-hidden="true" />

              {/* Side B score */}
              <div className="text-center">
                <p className="text-3xl font-black tabular-nums text-white">{totalB}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Side B</p>
                {ageB && <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Youth +5</p>}
              </div>
            </div>

            {/* Verdict label */}
            <p className={cn('text-lg font-black uppercase tracking-widest', verdict.colorClass)}>
              {verdict.label}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Point differential: {Math.abs(totalA - totalB)} pts
              {Math.abs(totalA - totalB) <= 5 && ' — Both sides within the fair trade window.'}
            </p>
          </div>
        )}

        {/* Age bonus explainer */}
        <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-5 py-4 mb-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Dynasty Age Bonus
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            If the average age of players on a side is{' '}
            <span className="font-semibold text-emerald-400">23 or younger</span>, that side receives a{' '}
            <span className="font-semibold text-emerald-400">+5 youth premium</span> added to its total value.
            This reflects the dynasty principle that young assets have compounding upside not fully captured by
            raw value scores.
          </p>
        </div>

        {/* Value reference table */}
        <section aria-labelledby="value-ref-heading">
          <h2 id="value-ref-heading" className="text-base font-bold text-white mb-4">
            Dynasty Value Reference
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Top 15 players */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Top Players by Value</p>
              <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                <table className="min-w-full text-xs" aria-label="Top dynasty player values">
                  <thead>
                    <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                      <th scope="col" className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                      <th scope="col" className="px-3 py-2 text-center text-slate-400 font-semibold uppercase tracking-wider">Pos</th>
                      <th scope="col" className="px-3 py-2 text-right text-slate-400 font-semibold uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3347]">
                    {ALL_PLAYERS.slice(0, 15).map((p, idx) => (
                      <tr key={p.name} className={cn(
                        'transition-colors hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}>
                        <td className="px-3 py-2 font-medium text-white">{p.name}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border', POS_STYLES[p.pos])}>
                            {p.pos}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-black text-[#ffd700] tabular-nums">
                          {p.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pick values */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Draft Pick Values</p>
              <div className="rounded-lg border border-[#2d4a66] overflow-hidden">
                <table className="min-w-full text-xs" aria-label="Draft pick values">
                  <thead>
                    <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                      <th scope="col" className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider">Pick</th>
                      <th scope="col" className="px-3 py-2 text-right text-slate-400 font-semibold uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3347]">
                    {ALL_PICKS.map((p, idx) => (
                      <tr key={p.pick} className={cn(
                        'transition-colors hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}>
                        <td className="px-3 py-2 font-mono font-bold text-white">{p.pick}</td>
                        <td className="px-3 py-2 text-right font-mono font-black text-[#ffd700] tabular-nums">
                          {p.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-8 text-xs text-center text-slate-600">
          Dynasty values are relative estimates (0&ndash;100 scale) based on March 2026 consensus rankings.
          Values do not represent official KTC, FantasyCalc, or other dynasty services.
          This tool is for entertainment and discussion purposes only.
        </p>

      </div>
    </>
  );
}
