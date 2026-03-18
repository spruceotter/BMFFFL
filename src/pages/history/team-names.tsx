import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, ArrowLeft, Award, Star, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface YearEntry {
  year: number;
  name: string | null;
}

interface OwnerHistory {
  slug: string;
  displayName: string;
  joinedYear: number;
  names: Record<number, string>;
}

interface NotableName {
  name: string;
  owner: string;
  years: string;
  commentary: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEASONS = [2020, 2021, 2022, 2023, 2024, 2025];

const OWNERS: OwnerHistory[] = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    joinedYear: 2020,
    names: {
      2020: 'The Murder Boners',
      2021: 'The Murder Boners',
      2022: 'The Murder Boners',
      2023: 'The Murder Boners',
      2024: 'Schoolcraft Football Team',
      2025: 'Schoolcraft Football Team',
    },
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    joinedYear: 2020,
    names: {
      2020: "Herbert's Heros",
      2021: 'SexMachineAndyD',
      2022: 'SexMachineAndyD',
      2023: 'SexMachineAndyD',
      2024: 'SexMachineAndyD',
      2025: 'SexMachineAndyD',
    },
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    joinedYear: 2020,
    names: {
      2020: 'Juicy Bussy',
      2021: 'Juicy Bussy',
      2022: 'Juicy Bussy',
      2023: 'Juicy Bussy',
      2024: 'Juicy Bussy',
      2025: 'Juicy Bussy',
    },
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    joinedYear: 2020,
    names: {
      2020: 'El Rioux Grandes',
      2021: 'El Rioux Grandes',
      2022: 'El Rioux Grandes',
      2023: 'El Rioux Grandes',
      2024: 'El Rioux Grandes',
      2025: 'El Rioux Grandes',
    },
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    joinedYear: 2020,
    names: {
      2020: 'Really Big Rings',
      2021: 'Really Big Rings',
      2022: 'Really Big Rings',
      2023: 'Really Big Rings',
      2024: 'Really Big Rings',
      2025: 'Really Big Rings',
    },
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    joinedYear: 2020,
    names: {
      2020: '14kids0wins / teammoodie',
      2021: '14kids0wins / teammoodie',
      2022: '14kids0wins / teammoodie',
      2023: '14kids0wins / teammoodie',
      2024: '14kids0wins / teammoodie',
      2025: '14kids0wins / teammoodie',
    },
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    joinedYear: 2020,
    names: {
      2020: 'eldridsm',
      2021: 'eldridsm',
      2022: 'eldridsm',
      2023: 'eldridsm',
      2024: 'eldridsm',
      2025: 'eldridsm',
    },
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    joinedYear: 2020,
    names: {
      2020: 'Franks Little Beauties',
      2021: 'Franks Little Beauties',
      2022: 'Franks Little Beauties',
      2023: 'Franks Little Beauties',
      2024: 'Franks Little Beauties',
      2025: 'Franks Little Beauties',
    },
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    joinedYear: 2020,
    names: {
      2020: 'Cogdeill11',
      2021: 'Cogdeill11',
      2022: 'Cogdeill11',
      2023: 'Cogdeill11',
      2024: 'Cogdeill11',
      2025: 'Cogdeill11',
    },
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    joinedYear: 2020,
    names: {
      2020: 'Showtyme Boyz',
      2021: 'Showtyme Boyz',
      2022: 'Showtyme Boyz',
      2023: 'Showtyme Boyz',
      2024: 'Showtyme Boyz',
      2025: 'Showtyme Boyz',
    },
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    joinedYear: 2021,
    names: {
      2021: "Swamp Donkey's",
      2022: 'Burn it all',
      2023: 'Burn it all',
      2024: 'Nacua Matata',
      2025: 'Whale Tails',
    },
  },
  {
    slug: 'escuelas',
    displayName: 'Escuelas',
    joinedYear: 2022,
    names: {
      2022: "Grindin Gere's",
      2023: 'Loud and Stroud!',
      2024: 'The Young Guns + backups',
      2025: 'Booty Cheeks',
    },
  },
];

const NOTABLE_NAMES: NotableName[] = [
  {
    name: 'The Murder Boners',
    owner: 'MLSchools12',
    years: '2020–2023',
    commentary:
      'Widely regarded as the most memorable name in league history. I documented it faithfully.',
  },
  {
    name: "Swamp Donkey's",
    owner: 'Tubes94',
    years: '2021',
    commentary: "Tubes94's debut name. The apostrophe was... noted.",
  },
  {
    name: 'Nacua Matata',
    owner: 'Tubes94',
    years: '2024',
    commentary:
      'A play on the well-known Lion King phrase. I appreciated the wordplay.',
  },
  {
    name: 'Loud and Stroud!',
    owner: 'Escuelas',
    years: '2023',
    commentary: "A timely tribute to C.J. Stroud's 2023 breakout season.",
  },
  {
    name: "Herbert's Heros",
    owner: 'SexMachineAndyD',
    years: '2020',
    commentary:
      "In honor of Justin Herbert's 2020 debut. The spelling of 'Heros' remains a point of historical interest.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUniqueName(names: Record<number, string>): string[] {
  const seen: string[] = [];
  for (const n of Object.values(names)) {
    if (!seen.includes(n)) seen.push(n);
  }
  return seen;
}

function isNameChange(owner: OwnerHistory, year: number): boolean {
  const prevYear = year - 1;
  if (!owner.names[prevYear] || !owner.names[year]) return false;
  return owner.names[prevYear] !== owner.names[year];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      {children}
    </h2>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#2d4a66] bg-[#16213e] p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamNamesPage() {
  const [highlightChanges, setHighlightChanges] = useState(true);

  return (
    <>
      <Head>
        <title>Team Name Hall of Fame | BMFFFL</title>
        <meta
          name="description"
          content="A comprehensive archive of every team name used in BMFFFL since 2020."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to History
            </Link>
          </div>

          {/* ── Page Header ─────────────────────────────────────────────────── */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 mb-4">
              <Trophy className="w-8 h-8 text-[#ffd700]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Team Name Hall of Fame
            </h1>
            <p className="text-lg text-[#ffd700] font-semibold mb-4 tracking-wide">
              BMFFFL &middot; A Complete Record of Every Team Name Since 2020
            </p>
            <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed text-sm sm:text-base italic border border-[#2d4a66] bg-[#16213e] rounded-xl px-6 py-4">
              I have diligently maintained a comprehensive archive of all team identities since the
              league moved to Sleeper. Some managers choose consistency. Others prefer reinvention.
              The records are unambiguous. ~Love, Bimfle.
            </p>
          </div>

          {/* ── Most Renamed Award ──────────────────────────────────────────── */}
          <section className="mb-14">
            <SectionHeading>
              <RefreshCw className="w-6 h-6 text-[#e94560]" />
              Most Renamed Award
            </SectionHeading>
            <div className="grid gap-5 sm:grid-cols-3">

              {/* Tubes94 */}
              <Card className="border-[#ffd700]/40">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
                      Most Reinventions
                    </p>
                    <p className="text-xl font-bold text-white">Tubes94</p>
                  </div>
                  <Award className="w-7 h-7 text-[#ffd700] shrink-0" />
                </div>
                <p className="text-sm text-slate-400 mb-4">4 different names in 5 seasons</p>
                <ol className="space-y-1.5">
                  {["Swamp Donkey's", 'Burn it all', 'Nacua Matata', 'Whale Tails'].map((n, i) => (
                    <li key={n} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-300">{n}</span>
                    </li>
                  ))}
                </ol>
              </Card>

              {/* Escuelas */}
              <Card className="border-[#ffd700]/40">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
                      Most Reinventions (Tied)
                    </p>
                    <p className="text-xl font-bold text-white">Escuelas</p>
                  </div>
                  <Award className="w-7 h-7 text-[#ffd700] shrink-0" />
                </div>
                <p className="text-sm text-slate-400 mb-4">4 different names in 4 seasons</p>
                <ol className="space-y-1.5">
                  {["Grindin Gere's", 'Loud and Stroud!', 'The Young Guns + backups', 'Booty Cheeks'].map(
                    (n, i) => (
                      <li key={n} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs flex items-center justify-center font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-slate-300">{n}</span>
                      </li>
                    )
                  )}
                </ol>
              </Card>

              {/* MLSchools12 */}
              <Card className="border-[#e94560]/40">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1">
                      Most Iconic Retirement
                    </p>
                    <p className="text-xl font-bold text-white">MLSchools12</p>
                  </div>
                  <Star className="w-7 h-7 text-[#e94560] shrink-0" />
                </div>
                <p className="text-sm text-slate-400 mb-4">2 names — retired the league's most iconic</p>
                <ol className="space-y-1.5">
                  {['The Murder Boners', 'Schoolcraft Football Team'].map((n, i) => (
                    <li key={n} className="flex items-center gap-2 text-sm">
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold shrink-0',
                          i === 0
                            ? 'bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560]'
                            : 'bg-white/5 border border-[#2d4a66] text-slate-400'
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className={cn('text-slate-300', i === 0 && 'font-semibold text-white')}>
                        {n}
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>

            </div>
          </section>

          {/* ── Name Consistency Hall of Honor ──────────────────────────────── */}
          <section className="mb-14">
            <SectionHeading>
              <Shield className="w-6 h-6 text-[#ffd700]" />
              Name Consistency Hall of Honor
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[
                { owner: 'JuicyBussy',  name: 'Juicy Bussy',          note: 'Unwavering since day one.' },
                { owner: 'rbr',         name: 'Really Big Rings',     note: 'A statement. Unaltered.' },
                { owner: 'eldridm20',   name: 'Franks Little Beauties', note: 'Six seasons of beauty.' },
                { owner: 'Grandes',     name: 'El Rioux Grandes',     note: 'Grande. Always.' },
                { owner: 'Cogdeill11',  name: 'Cogdeill11',           note: 'Why overcomplicate it.' },
                { owner: 'eldridsm',    name: 'eldridsm',             note: 'The username IS the brand.' },
                { owner: 'Cmaleski',    name: 'Showtyme Boyz',        note: 'Consistent. Reliable.' },
              ].map(({ owner, name, note }) => (
                <Card key={owner} className="border-[#ffd700]/20 hover:border-[#ffd700]/50 transition-colors duration-200">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]/70 mb-1">
                    {owner}
                  </p>
                  <p className="text-base font-bold text-white mb-2 leading-snug">{name}</p>
                  <p className="text-xs text-slate-500 italic">{note}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">2020–2025</span>
                    <span className="w-1 h-1 rounded-full bg-[#ffd700]/40" />
                    <span className="text-xs text-[#ffd700]/60 font-medium">6 seasons</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Complete Timeline Table ──────────────────────────────────────── */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <SectionHeading>
                <Trophy className="w-6 h-6 text-slate-400" />
                Complete Name Timeline
              </SectionHeading>
              <button
                type="button"
                onClick={() => setHighlightChanges((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-150',
                  highlightChanges
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-white/5 border-[#2d4a66] text-slate-400 hover:text-white hover:bg-white/10'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    highlightChanges ? 'bg-amber-400' : 'bg-slate-600'
                  )}
                />
                {highlightChanges ? 'Highlighting name changes' : 'Highlight name changes'}
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2d4a66] bg-[#1a1a2e]">
                    <th className="px-4 py-3 text-left font-semibold text-slate-400 w-32 sticky left-0 bg-[#1a1a2e] z-10">
                      Owner
                    </th>
                    {SEASONS.map((year) => (
                      <th
                        key={year}
                        className="px-4 py-3 text-center font-semibold text-slate-400 min-w-[140px]"
                      >
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OWNERS.map((owner, ownerIdx) => {
                    const uniqueNames = getUniqueName(owner.names);
                    const isConsistent = uniqueNames.length === 1;

                    return (
                      <tr
                        key={owner.slug}
                        className={cn(
                          'border-b border-[#2d4a66]/50 transition-colors duration-100',
                          ownerIdx % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#16213e]/60',
                          'hover:bg-[#1a1a2e]'
                        )}
                      >
                        {/* Owner cell */}
                        <td className={cn(
                          'px-4 py-3 font-semibold sticky left-0 z-10',
                          ownerIdx % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#16213e]/60',
                          isConsistent ? 'text-[#ffd700]' : 'text-white'
                        )}>
                          <div className="flex items-center gap-1.5">
                            {isConsistent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shrink-0" title="Consistent name" />
                            )}
                            {owner.displayName}
                          </div>
                        </td>

                        {/* Year cells */}
                        {SEASONS.map((year) => {
                          const name = owner.names[year] ?? null;
                          const changed = highlightChanges && isNameChange(owner, year);

                          if (name === null) {
                            return (
                              <td key={year} className="px-4 py-3 text-center">
                                <span className="text-slate-600 text-xs italic">N/A</span>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={year}
                              className={cn(
                                'px-4 py-3 text-center',
                                changed && 'bg-amber-500/5'
                              )}
                            >
                              <span
                                className={cn(
                                  'inline-block px-2.5 py-1 rounded-md text-xs leading-snug',
                                  changed
                                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium'
                                    : isConsistent
                                    ? 'bg-[#ffd700]/5 border border-[#ffd700]/10 text-slate-300'
                                    : 'bg-white/3 border border-[#2d4a66]/50 text-slate-300'
                                )}
                              >
                                {name}
                                {changed && (
                                  <span
                                    className="ml-1 text-amber-400 text-[10px]"
                                    title="Name changed from previous season"
                                  >
                                    ↑
                                  </span>
                                )}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                <span>Consistent name (all seasons)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium text-[10px]">
                  Name ↑
                </span>
                <span>Changed from previous season</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 italic">N/A</span>
                <span>Did not participate that season</span>
              </div>
            </div>
          </section>

          {/* ── Notable Names ────────────────────────────────────────────────── */}
          <section className="mb-14">
            <SectionHeading>
              <Star className="w-6 h-6 text-[#ffd700]" />
              Notable Names — Documented by Bimfle
            </SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {NOTABLE_NAMES.map((entry) => (
                <Card
                  key={entry.name}
                  className="hover:border-[#ffd700]/40 transition-colors duration-200"
                >
                  <p className="text-lg font-black text-white mb-1 leading-snug">&ldquo;{entry.name}&rdquo;</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-[#ffd700]">{entry.owner}</span>
                    <span className="text-slate-600 text-xs">&bull;</span>
                    <span className="text-xs text-slate-500">{entry.years}</span>
                  </div>
                  <p className="text-sm text-slate-400 italic leading-relaxed">{entry.commentary}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Footer note ──────────────────────────────────────────────────── */}
          <div className="text-center text-xs text-slate-600 border-t border-[#2d4a66] pt-8">
            <p>All records verified against the Sleeper platform. Accuracy is non-negotiable. ~Bimfle</p>
          </div>

        </div>
      </main>
    </>
  );
}
