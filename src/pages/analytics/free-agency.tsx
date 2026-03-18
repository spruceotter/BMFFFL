import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Newspaper, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

type DynastyImpact = 'positive' | 'negative' | 'neutral';
type BMFFFLRelevance = 'high' | 'medium' | 'low';
type FaPosition = 'RB' | 'WR' | 'TE' | 'QB';

interface FAMove {
  player: string;
  pos: FaPosition;
  age: number;
  fromTeam: string;
  toTeam: string;
  contractYears: number;
  contractValue: string;
  dynastyImpact: DynastyImpact;
  impactNote: string;
  bmffflRelevance: BMFFFLRelevance;
  bmffflOwner?: string;
}

const FA_MOVES: FAMove[] = [
  { player: 'Derrick Henry',       pos: 'RB', age: 32, fromTeam: 'BAL', toTeam: 'NE',  contractYears: 2, contractValue: '$16M',          dynastyImpact: 'negative', impactNote: 'Declining RB, age 32 — dynasty sell', bmffflRelevance: 'low' },
  { player: 'Jonathan Taylor',     pos: 'RB', age: 27, fromTeam: 'IND', toTeam: 'IND', contractYears: 1, contractValue: 'tagged',        dynastyImpact: 'neutral',  impactNote: 'Franchise tagged — dynasty sell-high off MVP year', bmffflRelevance: 'high', bmffflOwner: 'SexMachineAndyD' },
  { player: 'Tony Pollard',        pos: 'RB', age: 28, fromTeam: 'TEN', toTeam: 'SF',  contractYears: 2, contractValue: '$14M',           dynastyImpact: 'positive', impactNote: 'SF landing spot elevates floor — buy the dip', bmffflRelevance: 'low' },
  { player: 'Javonte Williams',    pos: 'RB', age: 25, fromTeam: 'DAL', toTeam: 'DAL', contractYears: 2, contractValue: '$18M',           dynastyImpact: 'positive', impactNote: 'Re-signed — DAL RB1, career year in 2025 (1,201 yds / 11 TDs)', bmffflRelevance: 'low' },
  { player: 'Davante Adams',       pos: 'WR', age: 33, fromTeam: 'LAR', toTeam: 'NE',  contractYears: 1, contractValue: '$12M',           dynastyImpact: 'negative', impactNote: 'Age decline, bad landing — dynasty cut/sell', bmffflRelevance: 'medium', bmffflOwner: 'SexMachineAndyD' },
  { player: 'DeAndre Hopkins',     pos: 'WR', age: 33, fromTeam: 'TEN', toTeam: 'FA',  contractYears: 0, contractValue: 'UFA',            dynastyImpact: 'negative', impactNote: 'Unrestricted FA — aging WR, dynasty cut', bmffflRelevance: 'low' },
  { player: 'Keenan Allen',        pos: 'WR', age: 32, fromTeam: 'CHI', toTeam: 'CIN', contractYears: 1, contractValue: '$8M',            dynastyImpact: 'neutral',  impactNote: 'Veteran depth — no dynasty value', bmffflRelevance: 'low' },
  { player: 'Breece Hall',         pos: 'RB', age: 24, fromTeam: 'NYJ', toTeam: 'NYJ', contractYears: 3, contractValue: '$43M',           dynastyImpact: 'positive', impactNote: 'Re-signed on big deal — dynasty hold, NYJ RB1', bmffflRelevance: 'high', bmffflOwner: 'Tubes94' },
  { player: 'Rhamondre Stevenson', pos: 'RB', age: 26, fromTeam: 'NE',  toTeam: 'LAR', contractYears: 2, contractValue: '$16M',           dynastyImpact: 'positive', impactNote: 'LAR landing = feature back upgrade', bmffflRelevance: 'medium', bmffflOwner: 'Grandes' },
  { player: 'George Kittle',       pos: 'TE', age: 31, fromTeam: 'SF',  toTeam: 'SF',  contractYears: 2, contractValue: '$28M',           dynastyImpact: 'neutral',  impactNote: 'Re-signed — hold dynasty TE1', bmffflRelevance: 'medium', bmffflOwner: 'MLSchools12' },
  { player: 'Kyle Pitts',          pos: 'TE', age: 24, fromTeam: 'ATL', toTeam: 'ATL', contractYears: 1, contractValue: 'tagged ~$16.3M', dynastyImpact: 'neutral',  impactNote: 'TE franchise tag — dynasty hold, prove it year', bmffflRelevance: 'low' },
  { player: 'Stefon Diggs',        pos: 'WR', age: 32, fromTeam: 'NE',  toTeam: 'KC',  contractYears: 2, contractValue: '$18M',           dynastyImpact: 'neutral',  impactNote: 'KC landing OK but age limits upside', bmffflRelevance: 'medium', bmffflOwner: 'rbr' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterMode = 'all' | 'positive' | 'negative' | 'bmfffl';

const IMPACT_STYLES: Record<DynastyImpact, { badge: string; border: string; label: string }> = {
  positive: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500/20',
    label: 'Positive',
  },
  negative: {
    badge: 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
    border: 'border-[#e94560]/20',
    label: 'Negative',
  },
  neutral: {
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    border: 'border-[#2d4a66]',
    label: 'Neutral',
  },
};

const POS_STYLES: Record<FaPosition, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const RELEVANCE_LABELS: Record<BMFFFLRelevance, string> = {
  high:   'High',
  medium: 'Medium',
  low:    'Low',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: FaPosition }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 justify-center', POS_STYLES[pos])}>
      {pos}
    </span>
  );
}

function ImpactBadge({ impact }: { impact: DynastyImpact }) {
  const s = IMPACT_STYLES[impact];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', s.badge)}>
      {s.label}
    </span>
  );
}

function TeamArrow({ from, to }: { from: string; to: string }) {
  const isSame = from === to;
  return (
    <div className="flex items-center gap-1 text-xs font-mono font-semibold">
      <span className="text-slate-400">{from}</span>
      {!isSame ? (
        <>
          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="text-slate-200">{to}</span>
        </>
      ) : (
        <span className="ml-1 text-[10px] text-slate-600 font-normal normal-case">(re-signed)</span>
      )}
    </div>
  );
}

// ─── Move Card ────────────────────────────────────────────────────────────────

function MoveCard({ move }: { move: FAMove }) {
  const isBmfffl = move.bmffflRelevance !== 'low';
  const isHighRelevance = move.bmffflRelevance === 'high';
  const impactStyle = IMPACT_STYLES[move.dynastyImpact];

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] p-5 flex flex-col gap-3 transition-all duration-200',
        isHighRelevance
          ? 'border-[#ffd700]/40 bg-[#1a2d42] shadow-[0_0_0_1px_rgba(255,215,0,0.08)]'
          : isBmfffl
          ? 'border-[#2d4a66] hover:border-[#2d4a66]/80'
          : impactStyle.border
      )}
      aria-label={`${move.player} free agency move`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-white">{move.player}</h3>
          <PosBadge pos={move.pos} />
          {isHighRelevance && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30">
              BMFFFL
            </span>
          )}
        </div>
        <ImpactBadge impact={move.dynastyImpact} />
      </div>

      {/* Team move + contract */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <TeamArrow from={move.fromTeam} to={move.toTeam} />
        <div className="text-right">
          <span className="text-xs font-mono font-semibold text-slate-300">{move.contractValue}</span>
          {move.contractYears > 0 && (
            <span className="ml-1 text-[11px] text-slate-600">
              / {move.contractYears}yr
            </span>
          )}
        </div>
      </div>

      {/* Impact note */}
      <p className={cn(
        'text-xs leading-relaxed',
        move.dynastyImpact === 'positive' ? 'text-emerald-400/90' :
        move.dynastyImpact === 'negative' ? 'text-[#e94560]/90' :
        'text-slate-400'
      )}>
        {move.impactNote}
      </p>

      {/* BMFFFL owner */}
      {move.bmffflOwner && (
        <div className="flex items-center gap-2 pt-1 border-t border-[#2d4a66]">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">BMFFFL Owner</span>
          <span className="text-xs font-semibold text-slate-200">{move.bmffflOwner}</span>
          <span className={cn(
            'ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider border',
            move.bmffflRelevance === 'high'
              ? 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30'
              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
          )}>
            {RELEVANCE_LABELS[move.bmffflRelevance]} relevance
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ moves }: { moves: FAMove[] }) {
  const positive = moves.filter(m => m.dynastyImpact === 'positive').length;
  const negative = moves.filter(m => m.dynastyImpact === 'negative').length;
  const bmffflRelevant = moves.filter(m => m.bmffflRelevance !== 'low').length;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center">
        <p className="text-2xl font-black text-emerald-400 tabular-nums">{positive}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Positive Impact</p>
      </div>
      <div className="rounded-lg border border-[#e94560]/20 bg-[#e94560]/5 px-4 py-3 text-center">
        <p className="text-2xl font-black text-[#e94560] tabular-nums">{negative}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Negative Impact</p>
      </div>
      <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/5 px-4 py-3 text-center">
        <p className="text-2xl font-black text-[#ffd700] tabular-nums">{bmffflRelevant}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">BMFFFL Relevant</p>
      </div>
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: 'all',      label: 'All Moves' },
  { value: 'positive', label: 'Positive Impact' },
  { value: 'negative', label: 'Negative Impact' },
  { value: 'bmfffl',   label: 'BMFFFL Relevant' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FreeAgencyPage() {
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'positive': return FA_MOVES.filter(m => m.dynastyImpact === 'positive');
      case 'negative': return FA_MOVES.filter(m => m.dynastyImpact === 'negative');
      case 'bmfffl':   return FA_MOVES.filter(m => m.bmffflRelevance !== 'low');
      default:         return FA_MOVES;
    }
  }, [filter]);

  return (
    <>
      <Head>
        <title>2026 Free Agency Tracker — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 NFL free agency dynasty impact tracker. See how key signings and franchise tags affect BMFFFL dynasty rosters."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Newspaper className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            2026 Free Agency
          </h1>
          <p className="text-slate-400 text-lg">
            Dynasty Impact Tracker &mdash; Key moves and what they mean for your roster
          </p>
        </header>

        {/* Summary */}
        <section className="mb-8" aria-label="Free agency summary statistics">
          <SummaryBar moves={FA_MOVES} />
        </section>

        {/* BMFFFL callout */}
        <div className="mb-8 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-[#ffd700]">BMFFFL-relevant moves</span> are highlighted with a gold border.
            These are signings or tags that directly affect players on BMFFFL rosters.
            High-relevance moves warrant immediate dynasty action consideration.
          </p>
        </div>

        {/* Filters */}
        <section className="mb-6" aria-label="Filter free agency moves">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by impact type">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border',
                  filter === opt.value
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
                aria-pressed={filter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results count */}
        <p className="mb-4 text-xs text-slate-500">
          Showing {filtered.length} move{filtered.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` · ${FILTER_OPTIONS.find(o => o.value === filter)?.label}`}
        </p>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-12 text-center">
            <p className="text-slate-500 text-sm">No moves match the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BMFFFL-relevant first when showing all */}
            {(filter === 'all' ? [
              ...filtered.filter(m => m.bmffflRelevance === 'high'),
              ...filtered.filter(m => m.bmffflRelevance === 'medium'),
              ...filtered.filter(m => m.bmffflRelevance === 'low'),
            ] : filtered).map(move => (
              <MoveCard key={`${move.player}-${move.toTeam}`} move={move} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 rounded-lg border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Note:</span> Based on moves completed or reported as of March 2026.
            Additional signings, cuts, and restructures will occur before and during the NFL Draft.
            Dynasty impact assessments are editorial opinions — not financial or lineup advice.
          </p>
        </div>

      </div>
    </>
  );
}
