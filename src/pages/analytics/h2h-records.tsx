import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Users, ArrowLeft, TrendingUp, TrendingDown, Swords } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  H2H_SUMMARIES,
  H2H_DISPLAY_NAMES,
  H2H_OWNER_SLUGS,
  getH2H,
} from '@/lib/h2h-data';

// ─── Active owners (exclude alumni) ──────────────────────────────────────────

const ALUMNI_SLUGS = new Set(['mmoodie12', 'escuelas', 'miroslav081']);
// Tubes94 joined 2021 (Sleeper era only — no ESPN era data)
const ACTIVE_SLUGS = (H2H_OWNER_SLUGS as readonly string[]).filter(s => !ALUMNI_SLUGS.has(s));

// Sort order: by overall H2H win% descending (H2H_SUMMARIES already sorted)
const ACTIVE_SUMMARIES = H2H_SUMMARIES.filter(s => !ALUMNI_SLUGS.has(s.slug));
const ORDERED_SLUGS = ACTIVE_SUMMARIES.map(s => s.slug);

// ─── Owner color accents ──────────────────────────────────────────────────────

const OWNER_COLORS: Record<string, string> = {
  mlschools12:    '#ffd700',
  sexmachineandy: '#e94560',
  cogdeill11:     '#3b82f6',
  grandes:        '#10b981',
  rbr:            '#f59e0b',
  eldridsm:       '#8b5cf6',
  juicybussy:     '#ec4899',
  tdtd19844:      '#06b6d4',
  eldridm20:      '#84cc16',
  tubes94:        '#f97316',
  cmaleski:       '#a78bfa',
  mmoodie12:      '#6b7280',
  escuelas:       '#6b7280',
};

// ─── Matrix Cell ──────────────────────────────────────────────────────────────

function MatrixCell({ rowSlug, colSlug, era }: { rowSlug: string; colSlug: string; era: 'all' | 'espn' | 'sleeper' }) {
  if (rowSlug === colSlug) {
    return (
      <td className="w-14 h-10 bg-slate-800/60 border border-slate-700/30" aria-label="self" />
    );
  }
  const rec = getH2H(rowSlug, colSlug);
  if (!rec) {
    return (
      <td className="w-14 h-10 text-center text-xs text-slate-600 border border-slate-700/30 bg-slate-900/30">
        —
      </td>
    );
  }

  let wins: number, losses: number;
  if (era === 'espn') {
    if (!rec.espn) return <td className="w-14 h-10 text-center text-xs text-slate-700 border border-slate-700/30 bg-slate-900/20">—</td>;
    wins = rec.espn.wins; losses = rec.espn.losses;
  } else if (era === 'sleeper') {
    if (!rec.sleeper) return <td className="w-14 h-10 text-center text-xs text-slate-700 border border-slate-700/30 bg-slate-900/20">—</td>;
    wins = rec.sleeper.wins; losses = rec.sleeper.losses;
  } else {
    wins = rec.wins; losses = rec.losses;
  }

  const isPositive = wins > losses;
  const isEven = wins === losses;
  const isNegative = wins < losses;

  return (
    <td
      className={cn(
        'w-14 h-10 text-center text-xs font-mono border border-slate-700/30 tabular-nums',
        isPositive && 'bg-emerald-900/25 text-emerald-300',
        isEven && 'bg-slate-800/40 text-slate-400',
        isNegative && 'bg-red-900/25 text-red-400',
      )}
      title={`${H2H_DISPLAY_NAMES[rowSlug]} vs ${H2H_DISPLAY_NAMES[colSlug]}: ${wins}-${losses} (${era} era)`}
    >
      {wins}-{losses}
    </td>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ summary }: { summary: typeof H2H_SUMMARIES[0] }) {
  const color = OWNER_COLORS[summary.slug] ?? '#94a3b8';
  const pct = (summary.winPct * 100).toFixed(1);
  const nemesisName = summary.nemesis ? H2H_DISPLAY_NAMES[summary.nemesis] : null;
  const victimName = summary.bestVictim ? H2H_DISPLAY_NAMES[summary.bestVictim] : null;

  // Get specific records for nemesis/victim
  const nemesisRec = summary.nemesis ? getH2H(summary.slug, summary.nemesis) : null;
  const victimRec = summary.bestVictim ? getH2H(summary.slug, summary.bestVictim) : null;

  return (
    <div
      className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/60 transition-colors"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-slate-100 text-sm">{summary.displayName}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {summary.totalWins}–{summary.totalLosses} · {pct}% H2H
          </div>
        </div>
        <span
          className={cn(
            'text-xs font-bold px-2 py-1 rounded',
            summary.winPct >= 0.6 ? 'bg-emerald-900/50 text-emerald-300' :
            summary.winPct >= 0.45 ? 'bg-slate-700/50 text-slate-300' :
            'bg-red-900/40 text-red-400'
          )}
        >
          {pct}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        {nemesisRec && nemesisName && (
          <div className="flex items-center gap-1.5 text-red-400/80">
            <TrendingDown className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {nemesisName} ({nemesisRec.wins}–{nemesisRec.losses})
            </span>
          </div>
        )}
        {victimRec && victimName && (
          <div className="flex items-center gap-1.5 text-emerald-400/80">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {victimName} ({victimRec.wins}–{victimRec.losses})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type EraFilter = 'all' | 'espn' | 'sleeper';

export default function H2HRecords() {
  const [showAlumni, setShowAlumni] = useState(false);
  const [era, setEra] = useState<EraFilter>('all');

  const matrixSlugs = showAlumni
    ? H2H_SUMMARIES.map(s => s.slug)
    : ORDERED_SLUGS;

  return (
    <>
      <Head>
        <title>Head-to-Head Records — BMFFFL</title>
        <meta name="description" content="All-time BMFFFL head-to-head records for the Sleeper era (2020–2025)." />
      </Head>

      <div className="min-h-screen bg-[#0a0e1a] text-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Analytics
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-violet-500/15 rounded-lg border border-violet-500/25">
                <Swords className="w-5 h-5 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Head-to-Head Records</h1>
            </div>
            <p className="text-slate-400 text-sm">
              All matchup results between BMFFFL owners · Sleeper era 2020–2025
            </p>
            <p className="text-slate-500 text-xs mt-1">
              ESPN era (2016–2019) not available in database. Read: row owner vs column owner.
              <span className="ml-2 text-emerald-500/70">Green = winning record</span>
              {' · '}
              <span className="text-red-400/70">Red = losing record</span>
            </p>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Era filter */}
            <div className="flex items-center gap-1 bg-slate-800/60 rounded border border-slate-700/50 p-1">
              {(['all', 'espn', 'sleeper'] as EraFilter[]).map(e => (
                <button
                  key={e}
                  onClick={() => setEra(e)}
                  className={cn(
                    'text-xs px-3 py-1 rounded transition-colors',
                    era === e
                      ? 'bg-violet-600/70 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {e === 'all' ? 'All-time' : e === 'espn' ? 'ESPN 2016–19' : 'Sleeper 2020–25'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAlumni(v => !v)}
              className={cn(
                'text-xs px-3 py-1.5 rounded border transition-colors',
                showAlumni
                  ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                  : 'border-slate-600/50 bg-slate-800/50 text-slate-400 hover:border-slate-500/60'
              )}
            >
              <Users className="w-3 h-3 inline mr-1.5" />
              {showAlumni ? 'Showing alumni' : 'Show alumni'}
            </button>
          </div>

          {/* Matrix */}
          <div className="mb-10 overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="border-collapse min-w-max">
              <thead>
                <tr>
                  {/* corner cell */}
                  <th className="w-28 bg-slate-800/80 border border-slate-700/30 p-2 text-xs text-slate-500 font-normal text-left">
                    vs →
                  </th>
                  {matrixSlugs.map(colSlug => (
                    <th
                      key={colSlug}
                      className="w-14 bg-slate-800/80 border border-slate-700/30 p-1 text-center"
                    >
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: OWNER_COLORS[colSlug] ?? '#94a3b8' }}
                        title={H2H_DISPLAY_NAMES[colSlug]}
                      >
                        {H2H_DISPLAY_NAMES[colSlug].slice(0, 5)}
                      </span>
                    </th>
                  ))}
                  <th className="w-24 bg-slate-800/80 border border-slate-700/30 p-2 text-xs text-slate-500 font-normal text-center">
                    Overall
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrixSlugs.map(rowSlug => {
                  const summary = H2H_SUMMARIES.find(s => s.slug === rowSlug);
                  return (
                    <tr key={rowSlug}>
                      {/* Row label */}
                      <td className="w-28 bg-slate-800/70 border border-slate-700/30 px-3 py-1.5">
                        <span
                          className="text-xs font-semibold truncate block"
                          style={{ color: OWNER_COLORS[rowSlug] ?? '#94a3b8' }}
                        >
                          {H2H_DISPLAY_NAMES[rowSlug]}
                        </span>
                      </td>
                      {/* H2H cells */}
                      {matrixSlugs.map(colSlug => (
                        <MatrixCell key={colSlug} rowSlug={rowSlug} colSlug={colSlug} era={era} />
                      ))}
                      {/* Overall */}
                      {summary ? (
                        <td className="w-24 bg-slate-800/50 border border-slate-700/30 text-center tabular-nums">
                          <span className="text-xs text-slate-300 font-mono">
                            {summary.totalWins}–{summary.totalLosses}
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {(summary.winPct * 100).toFixed(1)}%
                          </span>
                        </td>
                      ) : (
                        <td className="w-24 bg-slate-800/50 border border-slate-700/30" />
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Swords className="w-4 h-4 text-violet-400" />
              H2H Dominance Rankings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACTIVE_SUMMARIES.map(summary => (
                <SummaryCard key={summary.slug} summary={summary} />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="border border-slate-700/40 rounded-lg p-4 bg-slate-800/20 text-xs text-slate-500 space-y-1.5">
            <p>
              <span className="text-slate-400 font-medium">ESPN era (2016–2019):</span>{' '}
              From ESPN Fantasy API (mMatchupScore view). Includes regular season + all playoff matchups.
            </p>
            <p>
              <span className="text-slate-400 font-medium">Sleeper era (2020–2025):</span>{' '}
              From sleeper.db matchups table. All game weeks including playoffs.
            </p>
            <p>
              <span className="text-slate-400 font-medium">Tubes94</span> joined 2021 (Sleeper era only).{' '}
              <span className="text-slate-400 font-medium">Miroslav081</span> left before 2020 (ESPN era only).{' '}
              <span className="text-slate-400 font-medium">MCSchools</span> joined 2020, left after 2025.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
