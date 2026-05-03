import { useState, useMemo } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PickData {
  slot: number;
  original_owner: string;
  current_owner: string;
  traded: boolean;
}

interface RoundData {
  round: number;
  picks: PickData[];
}

interface DraftData {
  year: number;
  rounds: RoundData[];
  pick_counts: Record<string, number>;
}

interface DraftPicksPageData {
  generated_at: string;
  years: number[];
  drafts: DraftData[];
}

// ─── Owner colors (consistent per owner) ─────────────────────────────────────

const OWNER_COLORS: Record<string, string> = {
  Grandes:        'bg-blue-900/80 text-blue-200 border-blue-700/50',
  SexMachineAndyD:'bg-purple-900/80 text-purple-200 border-purple-700/50',
  rbr:            'bg-emerald-900/80 text-emerald-200 border-emerald-700/50',
  Cogdeill11:     'bg-teal-900/80 text-teal-200 border-teal-700/50',
  MLSchools12:    'bg-rose-900/80 text-rose-200 border-rose-700/50',
  Cmaleski:       'bg-orange-900/80 text-orange-200 border-orange-700/50',
  eldridm20:      'bg-yellow-900/80 text-yellow-200 border-yellow-700/50',
  JuicyBussy:     'bg-pink-900/80 text-pink-200 border-pink-700/50',
  Escuelas:       'bg-cyan-900/80 text-cyan-200 border-cyan-700/50',
  eldridsm:       'bg-indigo-900/80 text-indigo-200 border-indigo-700/50',
  tdtd19844:      'bg-red-900/80 text-red-200 border-red-700/50',
  Tubes94:        'bg-violet-900/80 text-violet-200 border-violet-700/50',
};

function ownerColor(name: string): string {
  return OWNER_COLORS[name] ?? 'bg-slate-800/80 text-slate-300 border-slate-600/50';
}

// ─── Helper: Sort owners by pick count ───────────────────────────────────────

function sortedOwners(pickCounts: Record<string, number>): [string, number][] {
  return Object.entries(pickCounts).sort((a, b) => b[1] - a[1]);
}

// ─── PickCell ─────────────────────────────────────────────────────────────────

function PickCell({ pick, showSlotLabel }: { pick: PickData; showSlotLabel?: boolean }) {
  const isTraded = pick.traded;
  return (
    <div className={cn(
      'rounded border text-center text-[10px] font-semibold px-1 py-1 leading-tight min-h-[32px] flex flex-col items-center justify-center',
      isTraded
        ? ownerColor(pick.current_owner)
        : 'bg-[#1a2d42] text-slate-500 border-[#2d4a66]'
    )}>
      {isTraded ? (
        <>
          <span className="truncate max-w-full">{pick.current_owner}</span>
          {showSlotLabel && (
            <span className="opacity-50 text-[8px] mt-0.5">from {pick.original_owner}</span>
          )}
        </>
      ) : (
        <span className="opacity-40">—</span>
      )}
    </div>
  );
}

// ─── Year Grid ────────────────────────────────────────────────────────────────

function YearGrid({ draft }: { draft: DraftData }) {
  const allOwners = Object.keys(OWNER_COLORS);
  const orderedSlots = draft.rounds[0]?.picks.map(p => p.original_owner) ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left text-slate-500 font-medium px-2 py-1.5 w-24">Original Team</th>
            {draft.rounds.map(r => (
              <th key={r.round} className="text-center text-slate-400 font-bold px-1 py-1.5 w-24">
                Round {r.round}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedSlots.map((originalOwner, slotIdx) => (
            <tr key={originalOwner} className={slotIdx % 2 === 0 ? 'bg-[#0d1520]/40' : ''}>
              <td className="px-2 py-1 text-slate-400 font-medium whitespace-nowrap text-[11px]">
                {originalOwner}
              </td>
              {draft.rounds.map(r => {
                const pick = r.picks.find(p => p.original_owner === originalOwner);
                return (
                  <td key={r.round} className="px-1 py-1">
                    {pick && <PickCell pick={pick} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Arsenal (per-owner pick list) ───────────────────────────────────────────

function OwnerArsenal({
  owner,
  drafts,
}: {
  owner: string;
  drafts: DraftData[];
}) {
  const picks = drafts.flatMap(d =>
    d.rounds.flatMap(r =>
      r.picks
        .filter(p => p.current_owner === owner)
        .map(p => ({
          year: d.year,
          round: r.round,
          original_owner: p.original_owner,
          traded: p.traded,
        }))
    )
  );

  if (picks.length === 0) return null;

  // Group by year
  const byYear = new Map<number, typeof picks>();
  for (const p of picks) {
    if (!byYear.has(p.year)) byYear.set(p.year, []);
    byYear.get(p.year)!.push(p);
  }

  return (
    <div className={cn(
      'rounded-xl border p-4 text-sm',
      ownerColor(owner).replace('border-', 'border-'),
      'bg-[#16213e] border-[#2d4a66]'
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-white">{owner}</span>
        <span className={cn(
          'text-xs font-bold px-2 py-0.5 rounded',
          picks.length >= 8 ? 'bg-[#ffd700]/20 text-[#ffd700]' :
          picks.length >= 5 ? 'bg-emerald-900/60 text-emerald-300' :
          'bg-slate-800 text-slate-400'
        )}>
          {picks.length} picks
        </span>
      </div>
      <div className="space-y-2">
        {[...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, yPicks]) => (
          <div key={year}>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{year}</div>
            <div className="flex flex-wrap gap-1">
              {yPicks.sort((a, b) => a.round - b.round).map((p, i) => (
                <span
                  key={i}
                  className={cn(
                    'text-[10px] font-semibold px-1.5 py-0.5 rounded border',
                    p.traded
                      ? ownerColor(owner)
                      : 'bg-[#1a2d42] text-slate-400 border-[#2d4a66]'
                  )}
                  title={p.traded ? `${p.original_owner}'s pick` : 'Own pick'}
                >
                  {year} R{p.round}
                  {p.traded && <span className="opacity-60 ml-0.5">({p.original_owner.slice(0, 4)})</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraftPicksPage({ data }: { data: DraftPicksPageData }) {
  const [activeYear, setActiveYear] = useState(data.years[0] ?? 2026);
  const [showGrid, setShowGrid] = useState(false);

  const activeDraft = useMemo(
    () => data.drafts.find(d => d.year === activeYear),
    [data.drafts, activeYear]
  );

  // Sort owners by 2026 pick count
  const draft2026 = data.drafts.find(d => d.year === 2026);
  const ownersSortedByPicks = useMemo(() => {
    if (!draft2026) return Object.keys(OWNER_COLORS);
    return sortedOwners(draft2026.pick_counts)
      .filter(([, n]) => n > 0)
      .map(([name]) => name);
  }, [draft2026]);

  const totalTraded2026 = draft2026
    ? draft2026.rounds.flatMap(r => r.picks).filter(p => p.traded).length
    : 0;

  return (
    <>
      <Head>
        <title>Draft Pick Tracker — BMFFFL</title>
        <meta
          name="description"
          content="Who owns which dynasty draft picks in BMFFFL — 2026, 2027, 2028 pick holdings."
        />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5" />
            Draft Picks
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            Pick Tracker
          </h1>
          <p className="text-slate-400 text-lg">
            Dynasty draft pick holdings — 2026 through 2028
          </p>
        </header>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: '2026 Picks Traded',
              value: `${totalTraded2026} / ${(data.drafts[0]?.rounds.length ?? 4) * 12}`
            },
            {
              label: 'Biggest Arsenal',
              value: ownersSortedByPicks[0] ?? '—',
            },
            {
              label: 'Their 2026 Total',
              value: `${draft2026?.pick_counts[ownersSortedByPicks[0] ?? ''] ?? 0} picks`,
            },
            {
              label: 'Years Tracked',
              value: data.years.join(', '),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-[#16213e] border border-[#2d4a66] px-4 py-3"
            >
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xl font-black text-white tabular-nums truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Pick Arsenal by owner */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">2026 Pick Arsenal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ownersSortedByPicks.map(owner => (
              <OwnerArsenal key={owner} owner={owner} drafts={data.drafts} />
            ))}
          </div>
        </section>

        {/* Year grid */}
        <section>
          <button
            type="button"
            onClick={() => setShowGrid(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-4"
          >
            {showGrid ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Full Pick Grid
          </button>

          {showGrid && (
            <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] overflow-hidden">
              {/* Year tabs */}
              <div className="flex border-b border-[#2d4a66] px-4">
                {data.years.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setActiveYear(year)}
                    className={cn(
                      'px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors',
                      activeYear === year
                        ? 'text-[#ffd700] border-[#ffd700]'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeDraft && <YearGrid draft={activeDraft} />}
                <p className="text-[10px] text-slate-600 mt-3">
                  Colored cells = pick changed hands. Row = original team. Column = draft round.
                </p>
              </div>
            </div>
          )}
        </section>

        <p className="mt-8 text-[10px] text-slate-700">
          Data from Sleeper · Generated {new Date(data.generated_at).toLocaleDateString()}
        </p>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ data: DraftPicksPageData }> = async () => {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'draft-picks.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data: DraftPicksPageData = JSON.parse(raw);

  return {
    props: { data },
  };
};
