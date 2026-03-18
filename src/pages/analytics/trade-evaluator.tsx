import { useState } from 'react';
import Head from 'next/head';
import { X, Plus, RotateCcw, Scale } from 'lucide-react';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'PICK';

interface TradeAsset {
  id: string;
  name: string;
  pos: Position;
  value: number;
}

interface HistoricalComp {
  id: number;
  title: string;
  sideA: { owner: string; assets: string; total: number };
  sideB: { owner: string; assets: string; total: number };
  verdict: string;
  verdictClass: string;
  note: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface AssetOption {
  name: string;
  pos: Position;
  value: number;
}

const ASSET_OPTIONS: AssetOption[] = [
  // QBs
  { name: 'Lamar Jackson',       pos: 'QB',   value: 9200 },
  { name: 'Josh Allen',          pos: 'QB',   value: 9100 },
  { name: 'Jalen Hurts',         pos: 'QB',   value: 8800 },
  { name: 'C.J. Stroud',         pos: 'QB',   value: 8700 },
  { name: 'Anthony Richardson',  pos: 'QB',   value: 8400 },
  { name: 'Jayden Daniels',      pos: 'QB',   value: 8200 },
  { name: 'Caleb Williams',      pos: 'QB',   value: 7800 },
  { name: 'Jordan Love',         pos: 'QB',   value: 7600 },
  { name: 'Sam Darnold',         pos: 'QB',   value: 6800 },
  { name: 'Kyler Murray',        pos: 'QB',   value: 6500 },
  // RBs
  { name: 'Bijan Robinson',      pos: 'RB',   value: 9400 },
  { name: 'Breece Hall',         pos: 'RB',   value: 9000 },
  { name: 'Jahmyr Gibbs',        pos: 'RB',   value: 8900 },
  { name: "De'Von Achane",       pos: 'RB',   value: 8600 },
  { name: 'Jonathon Brooks',     pos: 'RB',   value: 7800 },
  { name: 'James Cook',          pos: 'RB',   value: 7600 },
  { name: 'Kyren Williams',      pos: 'RB',   value: 7200 },
  { name: 'Rashad White',        pos: 'RB',   value: 6800 },
  { name: 'Javonte Williams',    pos: 'RB',   value: 5900 },
  { name: 'Tony Pollard',        pos: 'RB',   value: 5400 },
  // WRs
  { name: "Ja'Marr Chase",       pos: 'WR',   value: 9800 },
  { name: 'Justin Jefferson',    pos: 'WR',   value: 9600 },
  { name: 'CeeDee Lamb',         pos: 'WR',   value: 9500 },
  { name: 'Puka Nacua',          pos: 'WR',   value: 8800 },
  { name: 'Amon-Ra St. Brown',   pos: 'WR',   value: 8700 },
  { name: 'Malik Nabers',        pos: 'WR',   value: 8400 },
  { name: 'Marvin Harrison Jr.', pos: 'WR',   value: 8300 },
  { name: 'Drake London',        pos: 'WR',   value: 8100 },
  { name: 'Brian Thomas Jr.',    pos: 'WR',   value: 8000 },
  { name: 'Rashee Rice',         pos: 'WR',   value: 7800 },
  { name: 'Tyreek Hill',         pos: 'WR',   value: 5800 },
  { name: 'Davante Adams',       pos: 'WR',   value: 5200 },
  // TEs
  { name: 'Brock Bowers',        pos: 'TE',   value: 9200 },
  { name: 'Sam LaPorta',         pos: 'TE',   value: 8200 },
  { name: 'Trey McBride',        pos: 'TE',   value: 8000 },
  { name: 'Tucker Kraft',        pos: 'TE',   value: 7200 },
  { name: 'Jake Ferguson',       pos: 'TE',   value: 7000 },
  { name: 'Dalton Kincaid',      pos: 'TE',   value: 6500 },
  // Picks
  { name: '2026 1.01',           pos: 'PICK', value: 8500 },
  { name: '2026 1.02',           pos: 'PICK', value: 8000 },
  { name: '2026 1.03',           pos: 'PICK', value: 7600 },
  { name: '2026 1.04',           pos: 'PICK', value: 7200 },
  { name: '2026 1.05',           pos: 'PICK', value: 6800 },
  { name: '2026 1.06',           pos: 'PICK', value: 6400 },
  { name: '2026 1.07',           pos: 'PICK', value: 6000 },
  { name: '2026 1.08',           pos: 'PICK', value: 5600 },
  { name: '2026 1.09',           pos: 'PICK', value: 5200 },
  { name: '2026 1.10',           pos: 'PICK', value: 4800 },
  { name: '2026 1.11',           pos: 'PICK', value: 4400 },
  { name: '2026 1.12',           pos: 'PICK', value: 4000 },
  { name: '2026 2.01',           pos: 'PICK', value: 3200 },
  { name: '2026 2.06',           pos: 'PICK', value: 2400 },
  { name: '2026 2.12',           pos: 'PICK', value: 1800 },
  { name: '2027 1st (early)',    pos: 'PICK', value: 4500 },
  { name: '2027 1st (mid)',      pos: 'PICK', value: 3500 },
  { name: '2027 1st (late)',     pos: 'PICK', value: 2800 },
];

const HISTORICAL_COMPS: HistoricalComp[] = [
  {
    id: 1,
    title: 'The Championship Gamble',
    sideA: {
      owner: 'JuicyBussy',
      assets: 'Bijan Robinson',
      total: 9400,
    },
    sideB: {
      owner: 'Counter party',
      assets: '2026 1.03 + Travis Kelce',
      total: 12500,
    },
    verdict: 'SLIGHT OVERPAY',
    verdictClass: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    note:
      'JuicyBussy overpaid on raw value but landed a championship-winning RB1. Context matters — the win-now push justified the cost.',
  },
  {
    id: 2,
    title: 'The Lamar Ransom',
    sideA: {
      owner: 'rbr',
      assets: '2022 1.02 + 2022 1.06',
      total: 14400,
    },
    sideB: {
      owner: 'Counter party',
      assets: 'Lamar Jackson',
      total: 9200,
    },
    verdict: 'ROBBERY',
    verdictClass: 'text-red-400 border-red-400/30 bg-red-400/10',
    note:
      "rbr surrendered two premium 2022 picks (~14,400 combined) for Lamar Jackson (~9,200). A 5,200-point deficit — one of BMFFFL's all-time overpays.",
  },
  {
    id: 3,
    title: 'The Jefferson Firesale',
    sideA: {
      owner: 'tdtd19844',
      assets: 'Justin Jefferson + Davante Adams',
      total: 14800,
    },
    sideB: {
      owner: 'Counter party',
      assets: '2026 1.01 + 2026 1.04 + 2027 1st (early)',
      total: 20200,
    },
    verdict: 'BIG WIN (receiving)',
    verdictClass: 'text-green-400 border-green-400/30 bg-green-400/10',
    note:
      "tdtd19844 gave up Jefferson + Adams (~14,800) and received a haul worth ~20,200. The counter party got fleeced — tdtd came away with a massive surplus.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POS_STYLES: Record<Position, { bg: string; text: string }> = {
  QB:   { bg: 'bg-blue-600/20',   text: 'text-blue-400' },
  RB:   { bg: 'bg-green-600/20',  text: 'text-green-400' },
  WR:   { bg: 'bg-orange-600/20', text: 'text-orange-400' },
  TE:   { bg: 'bg-purple-600/20', text: 'text-purple-400' },
  PICK: { bg: 'bg-slate-600/20',  text: 'text-slate-300' },
};

function sumValue(assets: TradeAsset[]): number {
  return assets.reduce((acc, a) => acc + a.value, 0);
}

type Verdict = 'BIG WIN' | 'WIN' | 'FAIR' | 'SLIGHT LOSS' | 'BAD DEAL' | 'ROBBERY';

interface VerdictResult {
  label: Verdict;
  colorClass: string;
  bgClass: string;
  bimfleQuote: string;
}

function getVerdict(sideATotal: number, sideBTotal: number): VerdictResult | null {
  if (sideATotal === 0 && sideBTotal === 0) return null;
  if (sideATotal === 0) {
    return {
      label: 'ROBBERY',
      colorClass: 'text-red-400',
      bgClass: 'bg-red-400/10 border-red-400/30',
      bimfleQuote: "You're giving away something for nothing. Bimfle is appalled.",
    };
  }
  if (sideBTotal === 0) {
    return {
      label: 'BIG WIN',
      colorClass: 'text-[#ffd700]',
      bgClass: 'bg-[#ffd700]/10 border-[#ffd700]/30',
      bimfleQuote: "You receive assets, give nothing. Bimfle approves — suspiciously.",
    };
  }

  // Differential from YOUR perspective: you receive (sideB) vs you give (sideA)
  const diff = sideBTotal - sideATotal;
  const pct = diff / sideATotal;

  if (pct > 0.15) {
    return {
      label: 'BIG WIN',
      colorClass: 'text-[#ffd700]',
      bgClass: 'bg-[#ffd700]/10 border-[#ffd700]/30',
      bimfleQuote: "Now THAT is a heist. Bimfle raises a glass to your negotiating savagery.",
    };
  }
  if (pct > 0.05) {
    return {
      label: 'WIN',
      colorClass: 'text-green-400',
      bgClass: 'bg-green-400/10 border-green-400/30',
      bimfleQuote: "Solid work. You come out ahead and the league won't even notice. Yet.",
    };
  }
  if (pct >= -0.05) {
    return {
      label: 'FAIR',
      colorClass: 'text-[#ffd700]',
      bgClass: 'bg-[#ffd700]/10 border-[#ffd700]/30',
      bimfleQuote: "A balanced exchange. Rare and beautiful. Bimfle is almost moved to tears.",
    };
  }
  if (pct >= -0.15) {
    return {
      label: 'SLIGHT LOSS',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-400/10 border-amber-400/30',
      bimfleQuote: "You're overpaying a little. Maybe there's context. There better be context.",
    };
  }
  if (pct >= -0.30) {
    return {
      label: 'BAD DEAL',
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-400/10 border-orange-400/30',
      bimfleQuote: "This is not ideal. Bimfle is frowning at a spreadsheet right now. That spreadsheet is you.",
    };
  }
  return {
    label: 'ROBBERY',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-400/10 border-red-400/30',
    bimfleQuote: "STOP. Step away from the keyboard. You are being robbed in broad daylight.",
  };
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `asset-${idCounter}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TradeSideProps {
  label: string;
  labelColor: string;
  assets: TradeAsset[];
  total: number;
  selectedOption: string;
  onSelectChange: (val: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

function TradeSide({
  label,
  labelColor,
  assets,
  total,
  selectedOption,
  onSelectChange,
  onAdd,
  onRemove,
}: TradeSideProps) {
  return (
    <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={cn('text-lg font-black tracking-tight', labelColor)}>{label}</h2>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {assets.length} asset{assets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Dropdown + Add */}
      <div className="flex gap-2">
        <select
          value={selectedOption}
          onChange={(e) => onSelectChange(e.target.value)}
          className="flex-1 min-w-0 bg-[#0d1b2a] border border-[#2d4a66] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50 appearance-none"
        >
          <option value="">— select a player or pick —</option>
          {(['QB', 'RB', 'WR', 'TE', 'PICK'] as Position[]).map((pos) => (
            <optgroup key={pos} label={pos === 'PICK' ? 'PICKS' : pos}>
              {ASSET_OPTIONS.filter((a) => a.pos === pos).map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} ({a.value.toLocaleString()})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          type="button"
          onClick={onAdd}
          disabled={!selectedOption}
          className={cn(
            'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150',
            selectedOption
              ? 'bg-[#ffd700] text-[#0d1b2a] hover:bg-[#ffd700]/90'
              : 'bg-[#2d4a66]/40 text-slate-600 cursor-not-allowed'
          )}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Asset list */}
      <ul className="flex flex-col gap-2 min-h-[80px]">
        {assets.length === 0 ? (
          <li className="flex items-center justify-center h-16 text-slate-600 text-sm italic rounded-lg border border-dashed border-[#2d4a66]">
            No assets added yet
          </li>
        ) : (
          assets.map((asset) => {
            const pos = POS_STYLES[asset.pos];
            return (
              <li
                key={asset.id}
                className="flex items-center gap-2 bg-[#0d1b2a]/60 rounded-lg px-3 py-2 border border-[#2d4a66]/50"
              >
                <span
                  className={cn(
                    'text-xs font-bold px-1.5 py-0.5 rounded shrink-0',
                    pos.bg, pos.text
                  )}
                >
                  {asset.pos}
                </span>
                <span className="flex-1 text-sm text-white font-medium truncate">{asset.name}</span>
                <span className="text-sm font-mono tabular-nums text-slate-400 shrink-0">
                  {asset.value.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(asset.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors duration-100 shrink-0"
                  aria-label={`Remove ${asset.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            );
          })
        )}
      </ul>

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2d4a66]">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Value</span>
        <span className="text-2xl font-black tabular-nums text-white">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TradeEvaluator() {
  const [sideAAssets, setSideAAssets] = useState<TradeAsset[]>([]);
  const [sideBAssets, setSideBAssets] = useState<TradeAsset[]>([]);
  const [sideASelect, setSideASelect] = useState('');
  const [sideBSelect, setSideBSelect] = useState('');

  const sideATotal = sumValue(sideAAssets);
  const sideBTotal = sumValue(sideBAssets);
  const diff = sideBTotal - sideATotal; // positive = you receive more
  const verdict = getVerdict(sideATotal, sideBTotal);

  function addToSide(side: 'A' | 'B', name: string) {
    const option = ASSET_OPTIONS.find((a) => a.name === name);
    if (!option) return;
    const asset: TradeAsset = { id: nextId(), name: option.name, pos: option.pos, value: option.value };
    if (side === 'A') {
      setSideAAssets((prev) => [...prev, asset]);
      setSideASelect('');
    } else {
      setSideBAssets((prev) => [...prev, asset]);
      setSideBSelect('');
    }
  }

  function removeFromSide(side: 'A' | 'B', id: string) {
    if (side === 'A') setSideAAssets((prev) => prev.filter((a) => a.id !== id));
    else setSideBAssets((prev) => prev.filter((a) => a.id !== id));
  }

  function resetAll() {
    setSideAAssets([]);
    setSideBAssets([]);
    setSideASelect('');
    setSideBSelect('');
  }

  const hasTrade = sideAAssets.length > 0 || sideBAssets.length > 0;

  return (
    <>
      <Head>
        <title>Trade Evaluator | BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL Trade Evaluator — enter a proposed dynasty trade and Bimfle will render a verdict, complete with historical BMFFFL trade comps."
        />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Analytics', href: '/analytics' },
            { label: 'Trade Evaluator' },
          ]} />

          {/* ── Header ── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-7 h-7 text-[#ffd700]" aria-hidden="true" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Trade Evaluator
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Enter a proposed trade — Bimfle will render a verdict
            </p>
          </div>

          {/* ── Trade Builder ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TradeSide
              label="You Give"
              labelColor="text-red-400"
              assets={sideAAssets}
              total={sideATotal}
              selectedOption={sideASelect}
              onSelectChange={setSideASelect}
              onAdd={() => addToSide('A', sideASelect)}
              onRemove={(id) => removeFromSide('A', id)}
            />
            <TradeSide
              label="You Receive"
              labelColor="text-green-400"
              assets={sideBAssets}
              total={sideBTotal}
              selectedOption={sideBSelect}
              onSelectChange={setSideBSelect}
              onAdd={() => addToSide('B', sideBSelect)}
              onRemove={(id) => removeFromSide('B', id)}
            />
          </div>

          {/* ── Differential + Verdict ── */}
          {hasTrade && (
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-6 mb-6">
              {/* Differential bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Trade Differential
                  </p>
                  <p
                    className={cn(
                      'text-3xl font-black tabular-nums',
                      diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-[#ffd700]'
                    )}
                  >
                    {diff > 0 ? `+${diff.toLocaleString()}` : diff === 0 ? 'EVEN' : diff.toLocaleString()}
                    {diff !== 0 && (
                      <span className="text-base font-semibold text-slate-400 ml-2">
                        {diff > 0 ? 'in your favor' : 'against you'}
                      </span>
                    )}
                  </p>
                </div>

                {/* Visual balance */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-0.5">You Give</p>
                    <p className="font-mono font-bold text-red-400">{sideATotal.toLocaleString()}</p>
                  </div>
                  <div className="text-slate-600 font-bold text-lg">vs</div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">You Receive</p>
                    <p className="font-mono font-bold text-green-400">{sideBTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Value bar visualization */}
              {sideATotal > 0 && sideBTotal > 0 && (
                <div className="mb-5">
                  <div className="h-3 rounded-full bg-[#0d1b2a] overflow-hidden flex">
                    {(() => {
                      const combined = sideATotal + sideBTotal;
                      const aPct = (sideATotal / combined) * 100;
                      return (
                        <>
                          <div
                            className="h-full bg-red-400/70 transition-all duration-300"
                            style={{ width: `${aPct}%` }}
                          />
                          <div className="h-full bg-green-400/70 flex-1" />
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>Give</span>
                    <span>Receive</span>
                  </div>
                </div>
              )}

              {/* Verdict badge */}
              {verdict && (
                <div className={cn('rounded-lg border px-5 py-4', verdict.bgClass)}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span
                      className={cn(
                        'text-xl font-black tracking-widest uppercase shrink-0',
                        verdict.colorClass
                      )}
                    >
                      {verdict.label}
                    </span>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      &ldquo;{verdict.bimfleQuote}&rdquo;
                      <span className="not-italic font-semibold text-slate-400"> — Bimfle</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Reset ── */}
          {hasTrade && (
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16213e] border border-[#2d4a66] text-sm text-slate-400 hover:text-white hover:border-[#4a6a8a] transition-colors duration-150"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Trade
              </button>
            </div>
          )}

          {/* ── Historical Comps ── */}
          <div className="mb-4">
            <h2 className="text-xl font-black tracking-tight text-white mb-1">
              Historical BMFFFL Trade Comps
            </h2>
            <p className="text-sm text-slate-400">
              Real trades from the archive — context for calibrating your deal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {HISTORICAL_COMPS.map((comp) => (
              <div
                key={comp.id}
                className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{comp.title}</h3>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shrink-0',
                      comp.verdictClass
                    )}
                  >
                    {comp.verdict}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Side A */}
                  <div className="bg-[#0d1b2a]/60 rounded-lg p-3 border border-[#2d4a66]/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Gave</p>
                    <p className="text-sm font-bold text-white mb-0.5">{comp.sideA.owner}</p>
                    <p className="text-xs text-slate-400 mb-2">{comp.sideA.assets}</p>
                    <p className="text-lg font-black tabular-nums text-red-400">
                      {comp.sideA.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Side B */}
                  <div className="bg-[#0d1b2a]/60 rounded-lg p-3 border border-[#2d4a66]/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Received</p>
                    <p className="text-sm font-bold text-white mb-0.5">{comp.sideB.owner}</p>
                    <p className="text-xs text-slate-400 mb-2">{comp.sideB.assets}</p>
                    <p className="text-lg font-black tabular-nums text-green-400">
                      {comp.sideB.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 italic leading-relaxed border-t border-[#2d4a66] pt-3">
                  {comp.note}
                </p>
              </div>
            ))}
          </div>

          {/* ── Footer disclaimer ── */}
          <div className="mt-8 bg-[#16213e] border border-[#2d4a66] rounded-xl px-5 py-4">
            <p className="text-sm text-slate-400 italic leading-relaxed">
              Verdicts are based on raw value differentials using Bimfle&apos;s March 2026 trade chart.
              Real-world factors — positional need, win window, and emotional desperation — are
              not accounted for.{' '}
              <span className="not-italic text-slate-300 font-semibold">~Love, Bimfle.</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
