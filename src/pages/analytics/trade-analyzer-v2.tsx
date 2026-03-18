import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { ArrowLeftRight, X, RefreshCw, CheckCircle, AlertCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type SystemKey = 'bimfle' | 'superflex' | 'underdog' | 'ktc';

interface PlayerValues {
  pos: Position;
  age: number;
  bimfle: number;
  superflex: number;
  underdog: number;
  ktc: number;
}

// ─── Value Systems ─────────────────────────────────────────────────────────────

const SYSTEMS: { key: SystemKey; label: string; description: string; color: string; border: string; bg: string }[] = [
  {
    key: 'bimfle',
    label: 'Bimfle Index',
    description: 'BMFFFL custom weights — accounts for age curve, league scoring, and historical BMFFFL tendencies',
    color: 'text-[#ffd700]',
    border: 'border-[#ffd700]/30',
    bg: 'bg-[#ffd700]/10',
  },
  {
    key: 'superflex',
    label: 'Dynasty Superflex',
    description: 'Superflex-adjusted dynasty values. QBs elevated; positional scarcity weighted heavily',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'underdog',
    label: 'Underdog ADP',
    description: 'Best-ball ADP-derived values. Reflects market consensus from Underdog dynasty leagues',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
  },
  {
    key: 'ktc',
    label: 'KeepTradeCut',
    description: 'Community-voted dynasty values. Snapshot of what the dynasty community thinks players are worth',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
];

// ─── Player Data (40 dynasty players) ─────────────────────────────────────────

const PLAYERS: Record<string, PlayerValues> = {
  // QB
  'Josh Allen':          { pos: 'QB', age: 29, bimfle: 99,  superflex: 100, underdog: 98,  ktc: 9850 },
  'Lamar Jackson':       { pos: 'QB', age: 28, bimfle: 97,  superflex: 99,  underdog: 97,  ktc: 9720 },
  'Patrick Mahomes':     { pos: 'QB', age: 30, bimfle: 94,  superflex: 96,  underdog: 93,  ktc: 9400 },
  'Joe Burrow':          { pos: 'QB', age: 29, bimfle: 92,  superflex: 94,  underdog: 90,  ktc: 9150 },
  'Trevor Lawrence':     { pos: 'QB', age: 26, bimfle: 88,  superflex: 92,  underdog: 86,  ktc: 8700 },
  'Jordan Love':         { pos: 'QB', age: 26, bimfle: 85,  superflex: 89,  underdog: 82,  ktc: 8300 },
  'Kyler Murray':        { pos: 'QB', age: 27, bimfle: 82,  superflex: 84,  underdog: 78,  ktc: 7900 },
  'Jalen Hurts':         { pos: 'QB', age: 27, bimfle: 86,  superflex: 90,  underdog: 85,  ktc: 8500 },
  // RB
  'Bijan Robinson':      { pos: 'RB', age: 23, bimfle: 95,  superflex: 88,  underdog: 94,  ktc: 9200 },
  'Ashton Jeanty':       { pos: 'RB', age: 22, bimfle: 91,  superflex: 84,  underdog: 93,  ktc: 9100 },
  'Breece Hall':         { pos: 'RB', age: 24, bimfle: 93,  superflex: 85,  underdog: 91,  ktc: 8950 },
  'Omarion Hampton':     { pos: 'RB', age: 22, bimfle: 90,  superflex: 82,  underdog: 91,  ktc: 8800 },
  'Quinshon Judkins':    { pos: 'RB', age: 22, bimfle: 83,  superflex: 75,  underdog: 85,  ktc: 8200 },
  "De'Von Achane":       { pos: 'RB', age: 23, bimfle: 81,  superflex: 74,  underdog: 82,  ktc: 7900 },
  'Bucky Irving':        { pos: 'RB', age: 23, bimfle: 84,  superflex: 76,  underdog: 84,  ktc: 8100 },
  'Jonathan Taylor':     { pos: 'RB', age: 27, bimfle: 72,  superflex: 65,  underdog: 68,  ktc: 6800 },
  'Josh Jacobs':         { pos: 'RB', age: 27, bimfle: 73,  superflex: 66,  underdog: 69,  ktc: 6900 },
  'Jahmyr Gibbs':        { pos: 'RB', age: 23, bimfle: 88,  superflex: 80,  underdog: 89,  ktc: 8700 },
  // WR
  "Ja'Marr Chase":       { pos: 'WR', age: 25, bimfle: 96,  superflex: 90,  underdog: 95,  ktc: 9500 },
  'CeeDee Lamb':         { pos: 'WR', age: 26, bimfle: 94,  superflex: 88,  underdog: 93,  ktc: 9300 },
  'Malik Nabers':        { pos: 'WR', age: 22, bimfle: 88,  superflex: 82,  underdog: 90,  ktc: 8900 },
  'Tetairoa McMillan':   { pos: 'WR', age: 22, bimfle: 89,  superflex: 83,  underdog: 91,  ktc: 8950 },
  'Luther Burden III':   { pos: 'WR', age: 22, bimfle: 86,  superflex: 79,  underdog: 87,  ktc: 8600 },
  'Elic Ayomanor':       { pos: 'WR', age: 23, bimfle: 82,  superflex: 75,  underdog: 83,  ktc: 8000 },
  'Matthew Golden':      { pos: 'WR', age: 22, bimfle: 81,  superflex: 74,  underdog: 82,  ktc: 7800 },
  'Puka Nacua':          { pos: 'WR', age: 24, bimfle: 80,  superflex: 73,  underdog: 79,  ktc: 7700 },
  'Tee Higgins':         { pos: 'WR', age: 26, bimfle: 70,  superflex: 64,  underdog: 68,  ktc: 6600 },
  'Drake London':        { pos: 'WR', age: 24, bimfle: 74,  superflex: 68,  underdog: 73,  ktc: 7100 },
  'Marvin Harrison Jr.': { pos: 'WR', age: 23, bimfle: 85,  superflex: 78,  underdog: 86,  ktc: 8400 },
  'Brian Thomas Jr.':    { pos: 'WR', age: 23, bimfle: 83,  superflex: 76,  underdog: 84,  ktc: 8200 },
  // TE
  'Colston Loveland':    { pos: 'TE', age: 23, bimfle: 90,  superflex: 85,  underdog: 88,  ktc: 8700 },
  'Harold Fannin Jr.':   { pos: 'TE', age: 23, bimfle: 88,  superflex: 83,  underdog: 87,  ktc: 8500 },
  'Tyler Warren':        { pos: 'TE', age: 23, bimfle: 85,  superflex: 80,  underdog: 84,  ktc: 8200 },
  'Sam LaPorta':         { pos: 'TE', age: 24, bimfle: 78,  superflex: 73,  underdog: 76,  ktc: 7400 },
  'Brock Bowers':        { pos: 'TE', age: 23, bimfle: 92,  superflex: 87,  underdog: 91,  ktc: 9100 },
  'Trey McBride':        { pos: 'TE', age: 26, bimfle: 80,  superflex: 75,  underdog: 78,  ktc: 7700 },
  'Jake Ferguson':       { pos: 'TE', age: 25, bimfle: 68,  superflex: 63,  underdog: 65,  ktc: 6200 },
  'Evan Engram':         { pos: 'TE', age: 30, bimfle: 60,  superflex: 55,  underdog: 57,  ktc: 5500 },
  'Tucker Kraft':        { pos: 'TE', age: 24, bimfle: 72,  superflex: 67,  underdog: 70,  ktc: 6900 },
  'Jonnu Smith':         { pos: 'TE', age: 29, bimfle: 62,  superflex: 57,  underdog: 59,  ktc: 5800 },
};

const ALL_PLAYERS = Object.entries(PLAYERS)
  .map(([name, data]) => ({ name, ...data }))
  .sort((a, b) => b.bimfle - a.bimfle);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

function normalizeKtc(raw: number): number {
  // KTC scale is ~0-10000; normalize to 0-100
  return Math.round(raw / 100);
}

function getSystemValue(player: PlayerValues, key: SystemKey): number {
  if (key === 'ktc') return normalizeKtc(player.ktc);
  return player[key];
}

function calcSideTotal(players: string[], systemKey: SystemKey): number {
  return players.reduce((sum, name) => {
    const p = PLAYERS[name];
    if (!p) return sum;
    return sum + getSystemValue(p, systemKey);
  }, 0);
}

// ─── Multi-System Verdict ─────────────────────────────────────────────────────

type WinSide = 'A' | 'B' | 'EVEN';

interface SystemResult {
  key: SystemKey;
  totalA: number;
  totalB: number;
  winner: WinSide;
}

interface VerdictResult {
  label: string;
  sub: string;
  winner: WinSide | null;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  icon: 'check' | 'alert' | 'minus';
}

function getSystemResults(playersA: string[], playersB: string[]): SystemResult[] {
  return SYSTEMS.map(s => {
    const totalA = calcSideTotal(playersA, s.key);
    const totalB = calcSideTotal(playersB, s.key);
    const diff = Math.abs(totalA - totalB);
    let winner: WinSide = 'EVEN';
    if (diff > 3) winner = totalA > totalB ? 'A' : 'B';
    return { key: s.key, totalA, totalB, winner };
  });
}

function getVerdict(results: SystemResult[]): VerdictResult {
  const aWins = results.filter(r => r.winner === 'A').length;
  const bWins = results.filter(r => r.winner === 'B').length;
  const evens = results.filter(r => r.winner === 'EVEN').length;

  if (evens === 4) {
    return {
      label: 'FAIR TRADE',
      sub: 'All 4 systems agree this trade is balanced.',
      winner: null,
      colorClass: 'text-slate-300',
      borderClass: 'border-slate-500/30',
      bgClass: 'bg-slate-500/10',
      icon: 'minus',
    };
  }

  if (aWins === 4 || (aWins === 4 && evens === 0)) {
    return {
      label: 'CLEAR WIN — Side A',
      sub: 'All 4 systems favor Side A in this trade.',
      winner: 'A',
      colorClass: 'text-[#ffd700]',
      borderClass: 'border-[#ffd700]/30',
      bgClass: 'bg-[#ffd700]/10',
      icon: 'check',
    };
  }
  if (bWins === 4 || (bWins === 4 && evens === 0)) {
    return {
      label: 'CLEAR WIN — Side B',
      sub: 'All 4 systems favor Side B in this trade.',
      winner: 'B',
      colorClass: 'text-[#ffd700]',
      borderClass: 'border-[#ffd700]/30',
      bgClass: 'bg-[#ffd700]/10',
      icon: 'check',
    };
  }

  // 3+ for A
  if (aWins >= 3) {
    return {
      label: 'LIKELY WIN — Side A',
      sub: `${aWins} of 4 systems favor Side A. ${bWins > 0 ? `${bWins} system${bWins > 1 ? 's' : ''} disagree.` : ''}`,
      winner: 'A',
      colorClass: 'text-blue-400',
      borderClass: 'border-blue-500/30',
      bgClass: 'bg-blue-500/10',
      icon: 'check',
    };
  }

  // 3+ for B
  if (bWins >= 3) {
    return {
      label: 'LIKELY WIN — Side B',
      sub: `${bWins} of 4 systems favor Side B. ${aWins > 0 ? `${aWins} system${aWins > 1 ? 's' : ''} disagree.` : ''}`,
      winner: 'B',
      colorClass: 'text-blue-400',
      borderClass: 'border-blue-500/30',
      bgClass: 'bg-blue-500/10',
      icon: 'check',
    };
  }

  // 2/2 or other even split
  return {
    label: 'TOSS-UP',
    sub: "2/2 split — depends on your valuation system. Both sides have merit.",
    winner: null,
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10',
    icon: 'alert',
  };
}

// ─── Player Card ──────────────────────────────────────────────────────────────

interface PlayerRowProps {
  name: string;
  activeSystem: SystemKey;
  onRemove: (name: string) => void;
}

function PlayerRow({ name, activeSystem, onRemove }: PlayerRowProps) {
  const p = PLAYERS[name];
  if (!p) return null;
  const val = getSystemValue(p, activeSystem);
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[#2d4a66] bg-[#0d1b2a]">
      <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0', POS_STYLES[p.pos])}>
        {p.pos}
      </span>
      <span className="flex-1 text-sm text-white font-medium leading-tight">
        {name}
        <span className="ml-2 text-[10px] text-slate-500">Age {p.age}</span>
      </span>
      <span className="text-xs font-mono font-black text-[#ffd700] tabular-nums shrink-0">{val}</span>
      <button
        onClick={() => onRemove(name)}
        className="text-slate-600 hover:text-[#e94560] transition-colors shrink-0"
        aria-label={`Remove ${name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Trade Side ───────────────────────────────────────────────────────────────

interface TradeSideProps {
  label: string;
  players: string[];
  activeSystem: SystemKey;
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

function TradeSide({ label, players, activeSystem, onAdd, onRemove }: TradeSideProps) {
  const [search, setSearch] = useState('');

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_PLAYERS
      .filter(p => p.name.toLowerCase().includes(q) && !players.includes(p.name))
      .slice(0, 7);
  }, [search, players]);

  const totals = useMemo(() =>
    SYSTEMS.map(s => ({
      key: s.key,
      label: s.label,
      color: s.color,
      total: calcSideTotal(players, s.key),
    })),
    [players]
  );

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-black text-white">{label}</h2>
        <div className="text-right space-y-0.5">
          {totals.map(t => (
            <div key={t.key} className="flex items-center gap-2 justify-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{t.label.split(' ')[0]}:</span>
              <span className={cn('text-sm font-black tabular-nums', t.color)}>{t.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Player search */}
      <div className="relative">
        <label htmlFor={`search-${label}`} className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
          Add Player (max 5)
        </label>
        <input
          id={`search-${label}`}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search player name..."
          disabled={players.length >= 5}
          className="w-full px-3 py-2 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 rounded-lg border border-[#2d4a66] bg-[#16213e] shadow-xl overflow-hidden">
            {suggestions.map(p => (
              <button
                key={p.name}
                onClick={() => { onAdd(p.name); setSearch(''); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#1f3550] transition-colors text-left"
              >
                <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0', POS_STYLES[p.pos])}>
                  {p.pos}
                </span>
                <span className="flex-1 text-sm text-white font-medium">{p.name}</span>
                <span className="text-[10px] text-slate-500">Age {p.age}</span>
                <span className="text-xs font-mono font-bold text-[#ffd700] tabular-nums">{getSystemValue(p, activeSystem)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected players */}
      <div className="flex-1 min-h-[100px]">
        {players.length === 0 ? (
          <div className="flex items-center justify-center h-full rounded-lg border border-dashed border-[#2d4a66] py-8">
            <p className="text-xs text-slate-600">Add players above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {players.map(name => (
              <PlayerRow key={name} name={name} activeSystem={activeSystem} onRemove={onRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TradeAnalyzerV2Page() {
  const [playersA, setPlayersA] = useState<string[]>([]);
  const [playersB, setPlayersB] = useState<string[]>([]);
  const [activeSystem, setActiveSystem] = useState<SystemKey>('bimfle');

  const addA = useCallback((name: string) => setPlayersA(p => p.length < 5 ? [...p, name] : p), []);
  const removeA = useCallback((name: string) => setPlayersA(p => p.filter(n => n !== name)), []);
  const addB = useCallback((name: string) => setPlayersB(p => p.length < 5 ? [...p, name] : p), []);
  const removeB = useCallback((name: string) => setPlayersB(p => p.filter(n => n !== name)), []);

  const handleReset = useCallback(() => { setPlayersA([]); setPlayersB([]); }, []);

  const hasContent = playersA.length + playersB.length > 0;

  const systemResults = useMemo(() => getSystemResults(playersA, playersB), [playersA, playersB]);
  const verdict = useMemo(() => getVerdict(systemResults), [systemResults]);

  return (
    <>
      <Head>
        <title>Dynasty Trade Analyzer v2 — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Multi-system dynasty trade evaluator for BMFFFL. Compare trade value using Bimfle Index, Dynasty Superflex, Underdog ADP, and KeepTradeCut simultaneously."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Hero */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics — Trade Analyzer v2
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Trade Analyzer{' '}
            <span className="text-[#ffd700]">v2</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-2">
            Multi-system valuation. Add players to each side and see what 4 different dynasty value systems say.
          </p>
          <div className="inline-flex items-start gap-2 px-4 py-3 rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/5 max-w-xl">
            <span className="text-[#ffd700] font-black text-xs uppercase tracking-wider shrink-0 mt-0.5">Bimfle:</span>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              "One value system is a guess. Four value systems is a verdict. If they all agree, you have your answer.
              If they split, the trade is genuinely close and you should lean on context — age, roster fit, and who needs to win now."
            </p>
          </div>
        </header>

        {/* System Selector */}
        <section className="mb-8" aria-labelledby="systems-heading">
          <p id="systems-heading" className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
            Reference System (shown in trade builder)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SYSTEMS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSystem(s.key)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-all duration-150',
                  activeSystem === s.key ? cn(s.border, s.bg) : 'border-[#2d4a66] bg-[#16213e] hover:border-[#3d5a76]'
                )}
              >
                <p className={cn('text-sm font-black mb-1', activeSystem === s.key ? s.color : 'text-white')}>
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Trade Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <TradeSide
            label="Team A"
            players={playersA}
            activeSystem={activeSystem}
            onAdd={addA}
            onRemove={removeA}
          />

          <div className="flex items-center justify-center lg:hidden">
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-[#2d4a66]" />
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">vs</span>
              <div className="h-px w-16 bg-[#2d4a66]" />
            </div>
          </div>

          <TradeSide
            label="Team B"
            players={playersB}
            activeSystem={activeSystem}
            onAdd={addB}
            onRemove={removeB}
          />
        </div>

        {/* Reset button */}
        {hasContent && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e94560]/30 bg-[#e94560]/5 text-xs font-semibold text-[#e94560] hover:bg-[#e94560]/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Clear Trade
            </button>
          </div>
        )}

        {/* Multi-System Results */}
        {hasContent && (
          <section className="mb-8 space-y-4" aria-labelledby="verdict-heading" aria-live="polite">
            <h2 id="verdict-heading" className="text-base font-bold text-white">
              Multi-System Results
            </h2>

            {/* Per-system breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SYSTEMS.map((s, i) => {
                const result = systemResults[i];
                const diff = result.totalA - result.totalB;
                const winnerLabel = result.winner === 'EVEN' ? 'Even' : `Team ${result.winner} +${Math.abs(diff)}`;
                return (
                  <div key={s.key} className={cn('rounded-xl border p-4', s.border, s.bg)}>
                    <p className={cn('text-xs font-black uppercase tracking-wider mb-2', s.color)}>{s.label}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-center flex-1">
                        <p className="text-xl font-black text-white tabular-nums">{result.totalA}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Team A</p>
                      </div>
                      <ArrowLeftRight className="w-4 h-4 text-slate-600 shrink-0 mx-2" aria-hidden="true" />
                      <div className="text-center flex-1">
                        <p className="text-xl font-black text-white tabular-nums">{result.totalB}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Team B</p>
                      </div>
                    </div>
                    <p className={cn('text-xs font-black text-center', s.color)}>{winnerLabel}</p>
                  </div>
                );
              })}
            </div>

            {/* Consensus verdict */}
            <div
              className={cn(
                'rounded-xl border p-6 text-center',
                verdict.bgClass,
                verdict.borderClass
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {verdict.icon === 'check' && <CheckCircle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />}
                {verdict.icon === 'alert' && <AlertCircle className="w-5 h-5 text-amber-400" aria-hidden="true" />}
                {verdict.icon === 'minus' && <Minus className="w-5 h-5 text-slate-400" aria-hidden="true" />}
                <p className={cn('text-xl font-black uppercase tracking-widest', verdict.colorClass)}>
                  {verdict.label}
                </p>
              </div>
              <p className="text-sm text-slate-400">{verdict.sub}</p>

              {/* Win tally */}
              <div className="flex items-center justify-center gap-6 mt-4">
                {['A', 'B', 'EVEN'].map(side => {
                  const count = systemResults.filter(r => r.winner === side).length;
                  if (count === 0) return null;
                  return (
                    <div key={side} className="text-center">
                      <p className="text-2xl font-black text-white tabular-nums">{count}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {side === 'EVEN' ? 'Even' : `Team ${side} wins`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Player Value Reference Table */}
        <section aria-labelledby="ref-table-heading">
          <h2 id="ref-table-heading" className="text-base font-bold text-white mb-4">
            Player Value Reference — All 4 Systems
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            KTC values normalized to 0–100 scale for comparability. All other values are native 0–100.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden overflow-x-auto">
            <table className="min-w-full text-xs" aria-label="Dynasty player values across 4 systems">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10">Player</th>
                  <th scope="col" className="px-3 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Pos</th>
                  <th scope="col" className="px-3 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Age</th>
                  {SYSTEMS.map(s => (
                    <th key={s.key} scope="col" className={cn('px-3 py-3 text-right font-semibold uppercase tracking-wider', s.color)}>
                      {s.label.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {ALL_PLAYERS.map((p, idx) => (
                  <tr
                    key={p.name}
                    className={cn(
                      'transition-colors hover:bg-[#1f3550]',
                      idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}
                  >
                    <td className={cn(
                      'px-3 py-2.5 font-medium text-white sticky left-0 z-10',
                      idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}>
                      {p.name}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border', POS_STYLES[p.pos])}>
                        {p.pos}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-400">{p.age}</td>
                    {SYSTEMS.map(s => {
                      const val = getSystemValue(p, s.key);
                      return (
                        <td key={s.key} className={cn('px-3 py-2.5 text-right font-mono font-black tabular-nums', s.color)}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-8 text-xs text-center text-slate-600">
          Values are static estimates (March 2026). Bimfle Index is a BMFFFL-custom weighting. Dynasty Superflex, Underdog ADP, and KTC values
          are approximations based on publicly available rankings and do not represent live data from those platforms.
        </p>

      </div>
    </>
  );
}
