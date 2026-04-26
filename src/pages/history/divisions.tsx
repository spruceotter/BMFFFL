import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Users, ArrowLeft, Shield, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { GetStaticProps } from 'next';
import divisionHistoryRaw from '../../../content/data/division-history.json';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonDivisionData {
  platform: string;
  league_id: string;
  num_divisions: number;
  division_names: Record<string, string>;
  divisions: Record<string, (string | null)[]>;
}

interface DivisionHistoryData {
  generated_at: string;
  note: string;
  seasons: Record<string, SeasonDivisionData>;
}

interface Props {
  seasons: Array<{
    year: number;
    platform: string;
    divs: Array<{
      id: string;
      name: string;
      members: string[];
      nameChanged: boolean;
      rosterChanged: boolean;
    }>;
  }>;
}

// ─── Naming eras ─────────────────────────────────────────────────────────────

const NAMING_ERAS = [
  { years: [2016],          label: 'Inaugural ESPN Era',        color: '#713f12', accent: '#fbbf24' },
  { years: [2017, 2018],    label: 'ESPN Era II',               color: '#1a1a2e', accent: '#94a3b8' },
  { years: [2019, 2020],    label: 'Sleeper Launch Era',        color: '#134e4a', accent: '#2dd4bf' },
  { years: [2021],          label: 'Geographic Names Era',      color: '#1e3a5f', accent: '#60a5fa' },
  { years: [2022, 2023],    label: 'Classic Names Era',         color: '#4a1942', accent: '#c084fc' },
  { years: [2024, 2025, 2026], label: 'Current Era',            color: '#1a472a', accent: '#00ff88' },
];

function getEra(year: number) {
  return NAMING_ERAS.find(e => e.years.includes(year)) ?? NAMING_ERAS[NAMING_ERAS.length - 1];
}

// ─── Owner display names ──────────────────────────────────────────────────────

const OWNER_DISPLAY: Record<string, string> = {
  Grandes:        'Grandes',
  SexMachineAndyD:'SexMachineAndyD',
  Cmaleski:       'Cmaleski',
  Escuelas:       'Escuelas',
  tdtd19844:      'tdtd19844',
  mmoodie12:      'mmoodie12',
  rbr:            'rbr',
  eldridsm:       'eldridsm',
  MLSchools12:    'MLSchools12',
  JuicyBussy:     'JuicyBussy',
  eldridm20:      'eldridm20',
  Cogdeill11:     'Cogdeill11',
  Tubes94:        'Tubes94',
  Bimfle:         'Bimfle',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function DivisionHistoryPage({ seasons }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const displayed = selectedYear
    ? seasons.filter(s => s.year === selectedYear)
    : seasons;

  return (
    <>
      <Head>
        <title>Division History | BMFFFL</title>
        <meta name="description" content="Complete BMFFFL division history — names, members, and naming rights across all 11 seasons." />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#0f0f0f]">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Link href="/history" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              League History
            </Link>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Division History</h1>
                <p className="text-white/40 text-sm mt-0.5">2016–2026 · 11 seasons · 3 divisions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

          {/* Year filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedYear(null)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors border',
                selectedYear === null
                  ? 'bg-amber-400 text-black border-amber-400'
                  : 'text-white/50 border-white/10 hover:border-white/30'
              )}
            >
              All years
            </button>
            {seasons.map(s => (
              <button
                key={s.year}
                onClick={() => setSelectedYear(s.year === selectedYear ? null : s.year)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors border',
                  selectedYear === s.year
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'text-white/50 border-white/10 hover:border-white/30'
                )}
              >
                {s.year}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {displayed.map((season, i) => {
            const era = getEra(season.year);
            const prevSeason = seasons.find(s => s.year === season.year - 1);
            const isEraStart = !prevSeason || getEra(prevSeason.year).label !== era.label;

            return (
              <div key={season.year}>
                {/* Era label */}
                {(isEraStart || selectedYear !== null) && (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${era.color}80`, color: era.accent, border: `1px solid ${era.accent}40` }}
                  >
                    <Calendar className="w-3 h-3" />
                    {era.label} · {season.platform}
                  </div>
                )}

                {/* Season row */}
                <div className="rounded-xl border border-white/8 bg-[#111] overflow-hidden">
                  {/* Season header */}
                  <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">{season.year}</span>
                    <span className="text-white/30 text-xs uppercase tracking-widest">{season.platform}</span>
                  </div>

                  {/* Divisions grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/8">
                    {season.divs.map(div => (
                      <div key={div.id} className="p-4 space-y-3">
                        {/* Division name */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cn(
                            'font-semibold text-sm leading-tight',
                            div.nameChanged ? 'text-amber-300' : 'text-white/80'
                          )}>
                            {div.name}
                          </h3>
                          {div.nameChanged && (
                            <span className="text-[10px] bg-amber-400/15 text-amber-300 border border-amber-400/20 rounded px-1.5 py-0.5 shrink-0">
                              renamed
                            </span>
                          )}
                          {div.rosterChanged && !div.nameChanged && (
                            <span className="text-[10px] bg-blue-400/15 text-blue-300 border border-blue-400/20 rounded px-1.5 py-0.5 shrink-0">
                              reshuffled
                            </span>
                          )}
                        </div>

                        {/* Members */}
                        <ul className="space-y-1">
                          {div.members.map(m => (
                            <li key={m} className="flex items-center gap-2 text-sm text-white/60">
                              <Users className="w-3 h-3 text-white/20 shrink-0" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Naming rights footnote */}
          <div className="border border-amber-400/20 rounded-xl bg-amber-400/5 p-5 space-y-2">
            <h3 className="text-amber-300 font-semibold text-sm">Division Naming Rights</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Each offseason, the division with the highest total points scored (PF) earns the right to rename
              the division with the lowest total PF. The two highest-scoring divisions may also rename their own
              division. Any rename requires a 3-of-4 member vote within the affected division.
            </p>
            <Link href="/rules#division-naming-rights" className="text-amber-400 hover:text-amber-300 text-xs transition-colors">
              Full naming rights rules →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Static Props ─────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = divisionHistoryRaw as DivisionHistoryData;

  const yearsSorted = Object.keys(data.seasons).map(Number).sort((a, b) => b - a);

  const seasons = yearsSorted.map(year => {
    const season = data.seasons[String(year)];
    const prevYear = year - 1;
    const prevSeason = data.seasons[String(prevYear)];

    const divIds = Object.keys(season.division_names).sort();

    const divs = divIds.map(id => {
      const name = season.division_names[id];
      const members = (season.divisions[id] ?? []).filter(Boolean) as string[];

      // Detect changes vs. prior year
      let nameChanged = false;
      let rosterChanged = false;

      if (prevSeason) {
        // Find the matching division by members overlap
        const prevDivIds = Object.keys(prevSeason.division_names);
        const bestMatch = prevDivIds.reduce((best, pid) => {
          const prevMembers = (prevSeason.divisions[pid] ?? []).filter(Boolean) as string[];
          const overlap = members.filter(m => prevMembers.includes(m)).length;
          return overlap > (best.overlap ?? -1) ? { pid, overlap } : best;
        }, {} as { pid?: string; overlap?: number });

        if (bestMatch.pid !== undefined) {
          const prevName = prevSeason.division_names[bestMatch.pid];
          nameChanged = prevName !== name;
          const prevMembers = (prevSeason.divisions[bestMatch.pid] ?? []).filter(Boolean) as string[];
          rosterChanged = members.some(m => !prevMembers.includes(m)) || prevMembers.some(m => !members.includes(m));
        } else {
          nameChanged = true;
          rosterChanged = true;
        }
      }

      return { id, name, members, nameChanged, rosterChanged };
    });

    return {
      year,
      platform: season.platform,
      divs,
    };
  });

  return { props: { seasons } };
};
