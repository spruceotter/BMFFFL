import Head from 'next/head';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChampionEntry {
  year: number;
  champion: string;
  subtitle: string;
  finalScore?: string;
  opponent?: string;
  note?: string;
}

interface AllTimeRecord {
  category: string;
  holder: string;
  value: string;
  context: string;
}

interface SeasonSummary {
  year: number;
  champion: string;
  story: string;
  highlights: string[];
}

interface Manager {
  name: string;
  joined: number;
  note?: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const LEAGUE_STATS = [
  { label: 'Founded', value: '2020' },
  { label: 'Managers', value: '12' },
  { label: 'Seasons', value: '6' },
  { label: 'Unique Champions', value: '4' },
  { label: 'Commissioner', value: 'Grandes' },
  { label: 'Platform', value: 'Sleeper' },
];

const CHAMPIONS: ChampionEntry[] = [
  {
    year: 2020,
    champion: 'cogdeill11',
    subtitle: 'The Tightest Final',
    finalScore: '162.4–148.8',
    opponent: 'eldridsm',
    note: 'Closest championship game in BMFFFL history.',
  },
  {
    year: 2021,
    champion: 'mlschools12',
    subtitle: 'The First Ring',
    finalScore: '193.10–111.34',
    opponent: 'sexmachineandy',
    note: 'MLSchools12 dominates with an 11-3 record and the all-time season scoring record (2,327.06 pts).',
  },
  {
    year: 2022,
    champion: 'grandes',
    subtitle: "Commissioner's Crown",
    finalScore: '137.82–115.08',
    opponent: 'rbr',
    note: 'The commissioner won his own league. No protests filed. Rules clearly permitted it.',
  },
  {
    year: 2023,
    champion: 'juicybussy',
    subtitle: 'The Cinderella',
    finalScore: undefined,
    opponent: 'eldridm20',
    note: 'Lowest seed (6th) ever to win the BMFFFL — three consecutive road upsets to claim the title.',
  },
  {
    year: 2024,
    champion: 'mlschools12',
    subtitle: 'The Comeback',
    finalScore: '168.40–146.86',
    opponent: 'sexmachineandy',
    note: 'Fourth all-time championship for mlschools12 — second Sleeper-era ring. Built on depth, not luck.',
  },
  {
    year: 2025,
    champion: 'tdtd19844',
    subtitle: 'The Dark Horse',
    finalScore: '152.92–135.08',
    opponent: 'tubes94',
    note: 'The ultimate upset — 8-6, 4th seed tdtd19844 takes down the 13-1 juggernaut and claims the crown.',
  },
];

const ALL_TIME_RECORDS: AllTimeRecord[] = [
  {
    category: 'Highest Single Week',
    holder: 'juicybussy',
    value: '245.80 pts',
    context: '2021 season',
  },
  {
    category: 'Lowest Single Week',
    holder: 'escuelas',
    value: '78.1 pts',
    context: 'Regular season',
  },
  {
    category: 'Most Regular Season Wins (Single Year)',
    holder: 'mlschools12',
    value: '13-1',
    context: '2023 and 2025 seasons (twice)',
  },
  {
    category: 'Most Career Wins',
    holder: 'mlschools12',
    value: 'All-time leader',
    context: 'Across all seasons',
  },
  {
    category: 'Most Championship Appearances',
    holder: 'mlschools12',
    value: '4 all-time',
    context: '2016, 2019, 2021, 2024 (Sleeper era: 2021, 2024)',
  },
  {
    category: 'Longest Playoff Streak',
    holder: 'mlschools12',
    value: '3 consecutive',
    context: '2023–2025',
  },
  {
    category: 'Biggest Upset',
    holder: 'escuelas over tubes94',
    value: '+67 pts underdog',
    context: 'Week 4, 2022',
  },
  {
    category: 'Most Trades in a Season',
    holder: 'juicybussy',
    value: '4 trades',
    context: '2021 season',
  },
];

const SEASON_SUMMARIES: SeasonSummary[] = [
  {
    year: 2020,
    champion: 'cogdeill11',
    story: 'The Inaugural Season. Twelve managers entered, nobody knew what they were doing. cogdeill11 edged eldridsm in the final by 13.6 points — the closest finish the league has ever seen.',
    highlights: ['Closest final ever: 162.4–148.8', 'First BMFFFL champion crowned', 'Auction draft format established'],
  },
  {
    year: 2021,
    champion: 'mlschools12',
    story: 'The First Ring. MLSchools12 posted an 11-3 regular season and the all-time season scoring record (2,327.06 pts), then won the championship over SexMachineAndyD 193.10–111.34. JuicyBussy set the all-time single-week record (245.80) in a consolation game.',
    highlights: ['Record season: 2,327.06 pts', 'JuicyBussy consolation record: 245.80 pts', 'Taxi squad added by vote (10-2)'],
  },
  {
    year: 2022,
    champion: 'grandes',
    story: "The Commissioner's Crown. Grandes won his own league. The rules clearly allowed it. Nobody complained publicly. Keeper limit expanded to 3 by vote.",
    highlights: ['Commissioner wins the championship', 'Keeper limit: 2 → 3 (vote: 8-4)', 'Escuelas joins as replacement manager'],
  },
  {
    year: 2023,
    champion: 'juicybussy',
    story: 'The Cinderella. JuicyBussy entered as the 6th seed and won three straight road games to claim the title — the lowest seed to ever win the BMFFFL. The 13-1 MLSchools12 watched from home after losing in the semis.',
    highlights: ['6th-seed champion — lowest in league history', 'MLSchools12 goes 13-1 and loses in semis', 'FAAB implemented (vote: 11-1)'],
  },
  {
    year: 2024,
    champion: 'mlschools12',
    story: "The Comeback. mlschools12 reclaimed the championship — fourth all-time, second Sleeper-era ring. Def. SexMachineAndyD 168.40–146.86. Playoff expansion to 6 teams failed in a vote (5-7). The 4-team format held.",
    highlights: ['4th all-time title for mlschools12 (2016, 2019, 2021, 2024)', 'Playoff expansion fails (vote: 5-7)', 'Six active seasons of clean governance'],
  },
  {
    year: 2025,
    champion: 'mlschools12',
    story: "The Dark Horse. tdtd19844 went 8-6, entered as the 4th seed, and outlasted the field. MLSchools12 had the best regular season record in league history (13-1) but fell short. Tubes94 made the finals from the 2nd seed.",
    highlights: ['Champion: tdtd19844 def. Tubes94 152.92–135.08', 'MLSchools12 goes 13-1 and is knocked out before finals', 'tdtd19844 — the ultimate dark horse'],
  },
];

const MANAGERS: Manager[] = [
  { name: 'grandes', joined: 2020, note: 'Commissioner & 2022 champion' },
  { name: 'cogdeill11', joined: 2020, note: '2020 champion' },
  { name: 'juicybussy', joined: 2020, note: '2023 champion' },
  { name: 'tdtd19844', joined: 2020, note: '2025 champion' },
  { name: 'mlschools12', joined: 2020, note: '4x champion (2016, 2019, 2021, 2024)' },
  { name: 'tubes94', joined: 2020 },
  { name: 'eldridsm', joined: 2020 },
  { name: 'rbr', joined: 2020 },
  { name: 'SexMachineAndy', joined: 2020 },
  { name: 'cogdeill11', joined: 2020 },
  { name: 'escuelas', joined: 2022, note: 'Joined as replacement manager' },
  { name: 'flinthead', joined: 2020 },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EncyclopediaPage() {
  return (
    <>
      <Head>
        <title>League Encyclopedia — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL League Encyclopedia — the definitive reference covering all six seasons, every champion, every record, and the founding members of the league."
        />
      </Head>

      <main className="min-h-screen bg-[#0d0d1a] text-slate-200">

        {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'History', href: '/history' },
            { label: 'League Encyclopedia' },
          ]} />
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <span className="text-6xl mb-6" role="img" aria-label="Books">📚</span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-widest text-center"
            style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.4)' }}
          >
            LEAGUE ENCYCLOPEDIA
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base tracking-widest uppercase text-center">
            The Definitive BMFFFL Record Book
          </p>
          <p className="mt-4 text-slate-500 text-sm text-center max-w-lg">
            Six seasons. Twelve managers. Every champion, every record, every moment worth remembering.
          </p>
        </section>

        <div className="max-w-5xl mx-auto px-4 pb-20 space-y-14">

          {/* ── League at a Glance ─────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="📊" title="League at a Glance" subtitle="Core facts about the BMFFFL dynasty fantasy football league" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              {LEAGUE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-4 text-center"
                >
                  <p
                    className="text-lg font-black tracking-wide"
                    style={{ color: '#ffd700' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Champions Roll ─────────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="👑" title="Champions Roll" subtitle="Every BMFFFL champion, season by season" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {CHAMPIONS.map((c) => (
                <div
                  key={c.year}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{c.year}</span>
                    <span className="text-lg" role="img" aria-label="Champion">👑</span>
                  </div>
                  <div>
                    <p className="text-base font-black text-amber-300">{c.champion}</p>
                    <p className="text-xs text-slate-500 italic mt-0.5">{c.subtitle}</p>
                  </div>
                  {c.finalScore && (
                    <p className="text-xs text-slate-400 font-mono">
                      Final: <span className="text-slate-300">{c.finalScore}</span>
                      {c.opponent && <span className="text-slate-600"> vs {c.opponent}</span>}
                    </p>
                  )}
                  {c.note && (
                    <p className="text-xs text-slate-500 leading-relaxed border-t border-[#2d4a66] pt-3">
                      {c.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── All-Time Records ───────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="🏅" title="All-Time Records" subtitle="Top marks across every statistical category in BMFFFL history" />
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {ALL_TIME_RECORDS.map((record) => (
                <div
                  key={record.category}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-5 flex items-start gap-4"
                >
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{record.category}</p>
                    <p className="text-sm font-bold text-amber-300">{record.holder}</p>
                    <p
                      className="text-lg font-black mt-1"
                      style={{ color: '#ffd700' }}
                    >
                      {record.value}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 font-mono">{record.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Every Season Summary ──────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="📅" title="Every Season Summary" subtitle="The defining story and key stats for each BMFFFL season" />
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {SEASON_SUMMARIES.map((season) => (
                <div
                  key={season.year}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-6 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{season.year}</span>
                      <p className="text-base font-black text-amber-300 mt-0.5">{season.champion}</p>
                    </div>
                    <span className="text-xl flex-shrink-0" role="img" aria-label="Trophy">🏆</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed border-t border-[#2d4a66] pt-3">
                    {season.story}
                  </p>
                  <ul className="space-y-1.5">
                    {season.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="text-[#ffd700] flex-shrink-0 mt-0.5">&#8250;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Founding Members ──────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="🧑‍🤝‍🧑" title="Founding Members" subtitle="The twelve managers who make up the BMFFFL" />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {MANAGERS.map((m, i) => (
                <div
                  key={`${m.name}-${i}`}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-4"
                >
                  <p className="text-sm font-bold text-slate-200">{m.name}</p>
                  <p className="text-xs text-slate-600 font-mono mt-1">Since {m.joined}</p>
                  {m.note && (
                    <p className="text-xs text-amber-600/70 mt-1 leading-snug">{m.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Navigation links ──────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
            >
              &larr; League History
            </Link>
            <Link
              href="/history/awards"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
            >
              Annual Awards &rarr;
            </Link>
            <Link
              href="/records"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
            >
              All Records &rarr;
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#2d4a66] pb-4">
      <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-label={title}>{icon}</span>
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-wide">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
