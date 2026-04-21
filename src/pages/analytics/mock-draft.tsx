import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { ClipboardList, RotateCcw, Zap, X, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { StatBadge } from '@/components/ui/StatComponents';

// ─── Draft Order ──────────────────────────────────────────────────────────────

interface DraftSlot {
  overall: number;
  round: number;
  pick: number;    // pick within round
  ownerName: string;
  ownerSlug: string;
}

const ROUNDS = 4;
const TEAMS = 12;

// Round 1 order: reverse 2025 standings (last place picks first, champion picks last)
const ROUND1_ORDER: { ownerName: string; ownerSlug: string }[] = [
  { ownerName: 'Escuelas',        ownerSlug: 'escuelas'       }, // 1.01 — worst record 2025
  { ownerName: 'Cogdeill11',      ownerSlug: 'cogdeill11'     }, // 1.02 — 2nd worst 2025
  { ownerName: 'Grandes',         ownerSlug: 'grandes'        }, // 1.03 — 3rd worst 2025
  { ownerName: 'eldridsm',        ownerSlug: 'eldridsm'       }, // 1.04 — 4th worst 2025
  { ownerName: 'eldridm20',       ownerSlug: 'eldridm20'      }, // 1.05 — missed playoffs
  { ownerName: 'rbr',             ownerSlug: 'rbr'            }, // 1.06 — missed playoffs
  { ownerName: 'Cmaleski',        ownerSlug: 'cmaleski'       }, // 1.07 — playoff exit R1
  { ownerName: 'SexMachineAndyD', ownerSlug: 'sexmachineandy' }, // 1.08 — playoff exit QF
  { ownerName: 'JuicyBussy',      ownerSlug: 'juicybussy'     }, // 1.09 — 3rd place 2025
  { ownerName: 'MLSchools12',     ownerSlug: 'mlschools12'    }, // 1.10 — semifinal exit 2025
  { ownerName: 'Tubes94',         ownerSlug: 'tubes94'        }, // 1.11 — runner-up 2025
  { ownerName: 'tdtd19844',       ownerSlug: 'tdtd19844'      }, // 1.12 — 2025 champion
];

// Build all 48 draft slots (snake draft: odd rounds go 1→12, even rounds go 12→1)
function buildDraftSlots(): DraftSlot[] {
  const slots: DraftSlot[] = [];
  for (let round = 1; round <= ROUNDS; round++) {
    const order = round % 2 === 1
      ? ROUND1_ORDER                          // 1→12
      : [...ROUND1_ORDER].reverse();          // 12→1 (snake)
    order.forEach((team, i) => {
      slots.push({
        overall: (round - 1) * TEAMS + i + 1,
        round,
        pick: i + 1,
        ownerName: team.ownerName,
        ownerSlug: team.ownerSlug,
      });
    });
  }
  return slots;
}

const DRAFT_SLOTS = buildDraftSlots();

// ─── Prospect Pool ────────────────────────────────────────────────────────────

interface Prospect {
  id: string;
  name: string;
  pos: 'QB' | 'RB' | 'WR' | 'TE';
  adp: number;
  note: string;
}

const PROSPECT_POOL: Prospect[] = [
  { id: 'love',      name: 'Jeremiyah Love',    pos: 'RB', adp: 1,  note: '1.01 consensus — elite RB' },
  { id: 'rwilliams', name: 'Ryan Williams',      pos: 'WR', adp: 2,  note: 'Alabama WR, elite athlete' },
  { id: 'lemon',     name: 'Makai Lemon',        pos: 'WR', adp: 3,  note: 'Biletnikoff winner, elite hands' },
  { id: 'henderson', name: 'TreVeyon Henderson', pos: 'RB', adp: 4,  note: 'Ohio State RB, three-down back' },
  { id: 'sadiq',     name: 'Kenyon Sadiq',       pos: 'TE', adp: 5,  note: 'TE1 of class, post-combine riser' },
  { id: 'stowers',   name: 'Eli Stowers',        pos: 'TE', adp: 6,  note: 'TE2 — 45.5" vertical, combine standout' },
  { id: 'higgins',   name: 'Jayden Higgins',     pos: 'WR', adp: 7,  note: 'Iowa State 6\'4" WR' },
  { id: 'bech',      name: 'Jack Bech',          pos: 'WR', adp: 8,  note: 'TCU reliable WR' },
  { id: 'howard',    name: 'Will Howard',        pos: 'QB', adp: 9,  note: 'Ohio State QB1, national champion' },
  { id: 'porter',    name: 'Darien Porter',      pos: 'WR', adp: 10, note: 'Iowa State WR, rangy' },
  { id: 'kwilliams', name: 'Kyle Williams',      pos: 'WR', adp: 11, note: 'Wash State contested-catch WR' },
  { id: 'martinez',  name: 'Damien Martinez',    pos: 'RB', adp: 12, note: 'Oregon RB3, power runner' },
  { id: 'haynes',    name: 'Justice Haynes',     pos: 'RB', adp: 13, note: 'Alabama RB, pass-catcher' },
  { id: 'lockett',   name: 'Kaliq Lockett',      pos: 'WR', adp: 14, note: 'WVU speed WR' },
  { id: 'harvey',    name: 'RJ Harvey',          pos: 'RB', adp: 17, note: 'UCF explosive RB' },
  { id: 'gabriel',   name: 'Dillon Gabriel',     pos: 'QB', adp: 18, note: 'Oregon QB, accurate' },
  { id: 'gordon',    name: 'Ollie Gordon II',    pos: 'RB', adp: 19, note: 'Oklahoma State RB' },
];

// ─── Position Colors ──────────────────────────────────────────────────────────

const POS_COLOR: Record<Prospect['pos'], string> = {
  QB: 'bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
};

const POS_DOT: Record<Prospect['pos'], string> = {
  QB: 'bg-[#e94560]',
  RB: 'bg-emerald-500',
  WR: 'bg-blue-500',
  TE: 'bg-orange-500',
};

// ─── Pick State ───────────────────────────────────────────────────────────────

// picks: maps overall slot number (1–48) to prospect ID (or null)
type PicksState = Record<number, string | null>;

// ─── Prospect Selector Modal ──────────────────────────────────────────────────

interface ProspectSelectorProps {
  slot: DraftSlot;
  available: Prospect[];
  onSelect: (prospectId: string) => void;
  onClose: () => void;
}

function ProspectSelector({ slot, available, onSelect, onClose }: ProspectSelectorProps) {
  const [filter, setFilter] = useState<Prospect['pos'] | 'ALL'>('ALL');

  const filtered = filter === 'ALL'
    ? available
    : available.filter(p => p.pos === filter);

  const positions: Array<Prospect['pos'] | 'ALL'> = ['ALL', 'QB', 'RB', 'WR', 'TE'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Select prospect for pick ${slot.round}.${String(slot.pick).padStart(2, '0')}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-[#2d4a66] bg-[#16213e] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0f2744] border-b border-[#2d4a66] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Selecting for</p>
            <h3 className="text-base font-bold text-white mt-0.5">
              Pick {slot.round}.{String(slot.pick).padStart(2, '0')} — {slot.ownerName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f3550] transition-colors"
            aria-label="Close selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Position filter */}
        <div className="px-5 py-3 bg-[#0f2744]/50 border-b border-[#1e3347] flex gap-1.5 flex-wrap">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-semibold transition-colors',
                filter === pos
                  ? 'bg-[#ffd700] text-[#0d1b2a]'
                  : 'bg-[#16213e] border border-[#2d4a66] text-slate-400 hover:text-white'
              )}
            >
              {pos}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-600 self-center">
            {filtered.length} available
          </span>
        </div>

        {/* Prospect list */}
        <div className="overflow-y-auto max-h-80 divide-y divide-[#1e3347]">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-slate-500 text-sm">
              No {filter} prospects available
            </div>
          ) : (
            filtered.map(prospect => (
              <button
                key={prospect.id}
                onClick={() => { onSelect(prospect.id); onClose(); }}
                className="w-full px-5 py-3 text-left hover:bg-[#1f3550] transition-colors flex items-center gap-3"
              >
                {/* ADP badge */}
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center text-xs font-black text-slate-400 tabular-nums">
                  {prospect.adp}
                </span>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-white">{prospect.name}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold uppercase', POS_COLOR[prospect.pos])}>
                      {prospect.pos}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug truncate">{prospect.note}</p>
                </div>
                {/* ADP label */}
                <span className="shrink-0 text-[10px] text-slate-600 tabular-nums whitespace-nowrap">
                  ADP {prospect.adp}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Draft Board Cell ─────────────────────────────────────────────────────────

interface DraftCellProps {
  slot: DraftSlot;
  prospect: Prospect | null;
  onClick: () => void;
}

function DraftCell({ slot, prospect, onClick }: DraftCellProps) {
  const pickLabel = `${slot.round}.${String(slot.pick).padStart(2, '0')}`;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg border transition-all duration-150 overflow-hidden group',
        prospect
          ? 'border-[#2d4a66] bg-[#16213e] hover:border-[#3a5f80]'
          : 'border-[#2d4a66]/50 bg-[#0d1b2a]/60 hover:border-[#ffd700]/40 hover:bg-[#16213e]'
      )}
      aria-label={`Pick ${pickLabel} — ${slot.ownerName}${prospect ? `: ${prospect.name}` : ' (empty)'}`}
    >
      {/* Pick header */}
      <div className={cn(
        'px-2.5 py-1.5 flex items-center justify-between gap-1 border-b',
        prospect ? 'border-[#1e3347] bg-[#0f2744]' : 'border-[#1e3347]/30 bg-[#0d1b2a]/40'
      )}>
        <span className={cn('text-[10px] font-black tabular-nums', prospect ? 'text-[#ffd700]' : 'text-slate-600')}>
          {pickLabel}
        </span>
        <span className="text-[9px] text-slate-600 truncate max-w-[60px]" title={slot.ownerName}>
          {slot.ownerName.slice(0, 8)}
        </span>
      </div>

      {/* Pick body */}
      <div className="px-2.5 py-2 min-h-[52px] flex flex-col justify-center">
        {prospect ? (
          <>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', POS_DOT[prospect.pos])} aria-hidden="true" />
              <span className="text-xs font-bold text-white leading-tight truncate">{prospect.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[9px] font-bold uppercase px-1 py-0.5 rounded', POS_COLOR[prospect.pos])}>
                {prospect.pos}
              </span>
              <span className="text-[9px] text-slate-600 tabular-nums">ADP {prospect.adp}</span>
            </div>
          </>
        ) : (
          <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors text-center w-full">
            + Pick
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Owner Summary Row ────────────────────────────────────────────────────────

function OwnerSummary({ ownerName, ownerSlug, picks, allPicks }: {
  ownerName: string;
  ownerSlug: string;
  picks: Prospect[];
  allPicks: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const remaining = allPicks - picks.length;

  const posCounts = picks.reduce<Record<string, number>>((acc, p) => {
    acc[p.pos] = (acc[p.pos] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1f3550] transition-colors text-left"
        aria-expanded={expanded}
      >
        <span className="font-semibold text-sm text-white flex-1">{ownerName}</span>
        <div className="flex gap-1 flex-wrap">
          {Object.entries(posCounts).map(([pos, count]) => (
            <span
              key={pos}
              className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', POS_COLOR[pos as Prospect['pos']])}
            >
              {count}{pos}
            </span>
          ))}
          {picks.length === 0 && (
            <span className="text-xs text-slate-600">No picks yet</span>
          )}
        </div>
        <span className={cn('text-xs font-medium tabular-nums shrink-0', remaining > 0 ? 'text-slate-500' : 'text-emerald-400')}>
          {remaining > 0 ? `${remaining} left` : 'Done'}
        </span>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
          : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
        }
      </button>

      {expanded && picks.length > 0 && (
        <div className="border-t border-[#1e3347] divide-y divide-[#1e3347]">
          {picks.map(p => (
            <div key={p.id} className="px-4 py-2 flex items-center gap-3">
              <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0', POS_COLOR[p.pos])}>
                {p.pos}
              </span>
              <span className="text-sm text-slate-300 flex-1">{p.name}</span>
              <span className="text-[10px] text-slate-600 tabular-nums">ADP {p.adp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MockDraftPage() {
  const [picks, setPicks] = useState<PicksState>({});
  const [activeSlot, setActiveSlot] = useState<DraftSlot | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'summary'>('board');

  // Prospect lookup map
  const prospectMap = useMemo(
    () => Object.fromEntries(PROSPECT_POOL.map(p => [p.id, p])),
    []
  );

  // Available prospects (not yet picked)
  const pickedIds = useMemo(() => new Set(Object.values(picks).filter(Boolean)), [picks]);
  const availableProspects = useMemo(
    () => PROSPECT_POOL.filter(p => !pickedIds.has(p.id)).sort((a, b) => a.adp - b.adp),
    [pickedIds]
  );

  // Filled pick count
  const filledCount = Object.values(picks).filter(Boolean).length;
  const totalSlots = DRAFT_SLOTS.length;

  const handleSelectProspect = useCallback((prospectId: string) => {
    if (!activeSlot) return;
    setPicks(prev => ({ ...prev, [activeSlot.overall]: prospectId }));
    setActiveSlot(null);
  }, [activeSlot]);

  const handleOpenSlot = useCallback((slot: DraftSlot) => {
    setActiveSlot(slot);
  }, []);

  const handleReset = useCallback(() => {
    setPicks({});
    setActiveSlot(null);
  }, []);

  const handleAutoFill = useCallback(() => {
    const newPicks = { ...picks };
    let remaining = availableProspects.slice(); // sorted by ADP

    DRAFT_SLOTS.forEach(slot => {
      if (!newPicks[slot.overall] && remaining.length > 0) {
        newPicks[slot.overall] = remaining[0].id;
        remaining = remaining.slice(1);
      }
    });
    setPicks(newPicks);
  }, [picks, availableProspects]);

  // Per-owner pick summary
  const ownerPicks = useMemo(() => {
    const map: Record<string, Prospect[]> = {};
    ROUND1_ORDER.forEach(team => { map[team.ownerName] = []; });

    DRAFT_SLOTS.forEach(slot => {
      const pid = picks[slot.overall];
      if (pid && prospectMap[pid]) {
        map[slot.ownerName] = [...(map[slot.ownerName] ?? []), prospectMap[pid]];
      }
    });
    return map;
  }, [picks, prospectMap]);

  // Picks per owner total
  const picksPerOwner = ROUNDS; // 4 picks per owner in a linear snake draft

  return (
    <>
      <Head>
        <title>2026 Mock Draft Simulator — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL 2026 rookie draft mock simulator — draft the top prospects for each team in a 4-round snake draft with the official pick order."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
            Mock Draft Simulator
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            2026 BMFFFL Rookie Draft
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Simulate the 2026 rookie draft. 4 rounds, 12 teams, 48 picks. Snake format — fill the board
            by clicking any pick slot.
          </p>
        </header>

        {/* Controls bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#16213e] border border-[#2d4a66]">
            <button
              onClick={() => setViewMode('board')}
              aria-pressed={viewMode === 'board'}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors',
                viewMode === 'board' ? 'bg-[#ffd700] text-[#0d1b2a]' : 'text-slate-400 hover:text-white'
              )}
            >
              Draft Board
            </button>
            <button
              onClick={() => setViewMode('summary')}
              aria-pressed={viewMode === 'summary'}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors',
                viewMode === 'summary' ? 'bg-[#ffd700] text-[#0d1b2a]' : 'text-slate-400 hover:text-white'
              )}
            >
              Team Summary
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAutoFill}
              disabled={availableProspects.length === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                availableProspects.length === 0
                  ? 'border-[#2d4a66] text-slate-600 cursor-not-allowed bg-[#16213e]'
                  : 'border-[#ffd700]/40 text-[#ffd700] bg-[#ffd700]/5 hover:bg-[#ffd700]/10'
              )}
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Auto-Fill
            </button>
            <button
              onClick={handleReset}
              disabled={filledCount === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                filledCount === 0
                  ? 'border-[#2d4a66] text-slate-600 cursor-not-allowed bg-[#16213e]'
                  : 'border-[#e94560]/30 text-[#e94560] bg-[#e94560]/5 hover:bg-[#e94560]/10'
              )}
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reset
            </button>
          </div>

          {/* Progress */}
          <div className="sm:ml-auto flex items-center gap-3">
            <StatBadge label="Picked" value={`${filledCount}/${totalSlots}`} color={filledCount === totalSlots ? 'green' : 'slate'} />
            <StatBadge label="Available" value={availableProspects.length} color="blue" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 w-full h-1.5 rounded-full bg-[#2d4a66] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#ffd700] transition-all duration-500"
            style={{ width: `${totalSlots > 0 ? (filledCount / totalSlots) * 100 : 0}%` }}
            role="progressbar"
            aria-valuenow={filledCount}
            aria-valuemin={0}
            aria-valuemax={totalSlots}
            aria-label="Draft progress"
          />
        </div>

        {/* Main content */}
        {viewMode === 'board' ? (
          <div className="space-y-8">
            {Array.from({ length: ROUNDS }, (_, ri) => {
              const round = ri + 1;
              const roundSlots = DRAFT_SLOTS.filter(s => s.round === round);
              const isSnakeBack = round % 2 === 0;

              return (
                <section key={round}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-base font-bold text-white">Round {round}</h2>
                    <span className="text-xs text-slate-500">
                      {isSnakeBack ? 'Snake — picks 12→1' : 'Picks 1→12'}
                    </span>
                    <span className="ml-auto text-xs text-slate-600 tabular-nums">
                      {roundSlots.filter(s => picks[s.overall]).length}/{roundSlots.length} filled
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-2">
                    {roundSlots.map(slot => {
                      const pid = picks[slot.overall];
                      const prospect = pid ? (prospectMap[pid] ?? null) : null;
                      return (
                        <DraftCell
                          key={slot.overall}
                          slot={slot}
                          prospect={prospect}
                          onClick={() => handleOpenSlot(slot)}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROUND1_ORDER.map(team => (
              <OwnerSummary
                key={team.ownerSlug}
                ownerName={team.ownerName}
                ownerSlug={team.ownerSlug}
                picks={ownerPicks[team.ownerName] ?? []}
                allPicks={picksPerOwner}
              />
            ))}
          </div>
        )}

        {/* Available prospects sidebar reference */}
        {viewMode === 'board' && availableProspects.length > 0 && (
          <section className="mt-10">
            <h2 className="text-base font-bold text-white mb-4">
              Available Prospects
              <span className="ml-2 text-sm text-slate-500 font-normal">({availableProspects.length} remaining)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableProspects.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#2d4a66] bg-[#16213e]"
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center text-xs font-black text-slate-400 tabular-nums">
                    {p.adp}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white truncate">{p.name}</span>
                      <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0', POS_COLOR[p.pos])}>
                        {p.pos}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug truncate">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {filledCount === totalSlots && (
          <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <p className="text-sm text-emerald-400 font-semibold">
              Mock draft complete! All {totalSlots} picks have been made. Switch to Team Summary to review each team's class.
            </p>
          </div>
        )}

        {/* Draft order reference */}
        <section className="mt-12">
          <h2 className="text-base font-bold text-white mb-4">2026 Draft Order Reference</h2>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="2026 draft order">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Pick</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Owner</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {ROUND1_ORDER.map((team, i) => {
                    const pickNum = i + 1;
                    const reasons = [
                      '12th place 2025', '11th place 2025', '10th place 2025',
                      '9th place 2025', '8th place, non-playoff', '7th place, non-playoff',
                      '5th place 2025', '6th place 2025', '4th place 2025',
                      'Runner-up 2025', '3rd place 2025', '2025 Champion — picks last',
                    ];
                    const isChamp = pickNum === 12;
                    return (
                      <tr
                        key={team.ownerSlug}
                        className={cn(
                          'transition-colors hover:bg-[#1f3550]',
                          i % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                          isChamp && 'ring-1 ring-inset ring-[#ffd700]/10'
                        )}
                      >
                        <td className={cn(
                          'px-4 py-2.5 font-black tabular-nums font-mono',
                          pickNum <= 3 ? 'text-[#ffd700]' : isChamp ? 'text-[#ffd700]' : 'text-slate-400'
                        )}>
                          1.{String(pickNum).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-white">
                          {team.ownerName}
                          {isChamp && (
                            <Trophy className="inline-block ml-1.5 w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 hidden sm:table-cell">
                          {reasons[i]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Rounds 2–4 follow snake order (even rounds reverse). Final order subject to commissioner confirmation.
          </p>
        </section>

        <p className="mt-8 text-xs text-center text-slate-600">
          Prospect ADP values are pre-draft estimates as of March 2026. Rankings will shift through the NFL draft (April 23–25, 2026).
          This simulator is for entertainment — it does not represent official BMFFFL picks.
        </p>

      </div>

      {/* Prospect selector modal */}
      {activeSlot && (
        <ProspectSelector
          slot={activeSlot}
          available={availableProspects}
          onSelect={handleSelectProspect}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </>
  );
}
