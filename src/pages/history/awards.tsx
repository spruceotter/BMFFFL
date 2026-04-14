import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  TrendingUp,
  HeartCrack,
  TrendingDown,
  Star,
  ArrowUp,
  Flame,
  Crown,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonAward {
  id: string;
  name: string;
  winner: string;
  context: string;
  icon: 'trophy' | 'medal' | 'trending-up' | 'heart-crack' | 'trending-down' | 'star';
  accentColor: 'gold' | 'silver' | 'blue' | 'red' | 'red-dim' | 'purple';
}

interface SeasonData {
  year: number;
  awards: SeasonAward[];
}

interface AllTimeAward {
  id: string;
  title: string;
  winner: string;
  description: string;
  icon: 'crown' | 'zap' | 'heart-crack' | 'flame' | 'trophy' | 'star';
}

// ─── Season Award Data ────────────────────────────────────────────────────────

const SEASONS: SeasonData[] = [
  {
    year: 2025,
    awards: [
      {
        id: 'champion',
        name: 'Champion',
        winner: 'tdtd19844',
        context: '8-6 regular season, 4th seed — the ultimate dark horse, def. Tubes94 152.92–135.08',
        icon: 'trophy',
        accentColor: 'gold',
      },
      {
        id: 'runner-up',
        name: 'Runner-Up',
        winner: 'Tubes94',
        context: '10-4 regular season, 2nd seed — finals appearance after a 2-12 debut in 2021',
        icon: 'medal',
        accentColor: 'silver',
      },
      {
        id: 'best-regular-season',
        name: 'Best Regular Season',
        winner: 'MLSchools12',
        context: '13-1 — the best single-season record in BMFFFL history, knocked out before the finals',
        icon: 'trending-up',
        accentColor: 'blue',
      },
      {
        id: 'playoff-heartbreak',
        name: 'Playoff Heartbreak',
        winner: 'MLSchools12',
        context: '13-1, #1 seed — the most dominant regular season in league history ends without a championship',
        icon: 'heart-crack',
        accentColor: 'red',
      },
      {
        id: 'moodie-bowl',
        name: 'Moodie Bowl / Bottom Dweller',
        winner: 'Grandes',
        context: '4-10 regular season — the Commissioner himself finishes last',
        icon: 'trending-down',
        accentColor: 'red-dim',
      },
      {
        id: 'story-of-year',
        name: 'Story of the Year',
        winner: 'tdtd19844',
        context: '"Went 8-6. Nobody believed. Took down the 13-1 juggernaut. The Shameful Saggy Sack is champion."',
        icon: 'star',
        accentColor: 'purple',
      },
    ],
  },
  {
    year: 2024,
    awards: [
      {
        id: 'champion',
        name: 'Champion',
        winner: 'MLSchools12',
        context: '10-4, 3rd seed — fourth all-time championship, playing best when it matters most',
        icon: 'trophy',
        accentColor: 'gold',
      },
      {
        id: 'runner-up',
        name: 'Runner-Up',
        winner: 'SexMachineAndyD',
        context: '11-3 regular season — best record in the league, fell one game short',
        icon: 'medal',
        accentColor: 'silver',
      },
      {
        id: 'best-regular-season',
        name: 'Best Regular Season',
        winner: 'SexMachineAndyD / Tubes94',
        context: 'Split award — both finished 11-3, joint best regular-season record in 2024',
        icon: 'trending-up',
        accentColor: 'blue',
      },
      {
        id: 'playoff-heartbreak',
        name: 'Playoff Heartbreak',
        winner: 'Tubes94',
        context: '11-3 regular season — lost in the semis despite a top-2 finish in the standings',
        icon: 'heart-crack',
        accentColor: 'red',
      },
      {
        id: 'moodie-bowl',
        name: 'Moodie Bowl / Bottom Dweller',
        winner: 'Escuelas',
        context: '3-11 in their 3rd season — back-to-back sub-4-win campaigns',
        icon: 'trending-down',
        accentColor: 'red-dim',
      },
      {
        id: 'story-of-year',
        name: 'Story of the Year',
        winner: 'MLSchools12',
        context: '"Wins their second ring from the 3rd seed — the squad playing best when it matters most."',
        icon: 'star',
        accentColor: 'purple',
      },
    ],
  },
  {
    year: 2023,
    awards: [
      {
        id: 'champion',
        name: 'Champion',
        winner: 'JuicyBussy',
        context: '8-6, 6th seed — the lowest seed to win a championship in BMFFFL history',
        icon: 'trophy',
        accentColor: 'gold',
      },
      {
        id: 'runner-up',
        name: 'Runner-Up',
        winner: 'eldridm20',
        context: 'Made the finals by beating the 13-1 top seed in the semis',
        icon: 'medal',
        accentColor: 'silver',
      },
      {
        id: 'best-regular-season',
        name: 'Best Regular Season',
        winner: 'MLSchools12',
        context: '13-1 — the first 13-1 season in BMFFFL history',
        icon: 'trending-up',
        accentColor: 'blue',
      },
      {
        id: 'playoff-heartbreak',
        name: 'Playoff Heartbreak',
        winner: 'MLSchools12',
        context: '13-1, #1 seed — lost the semis to eldridm20 by 154.30 pts',
        icon: 'heart-crack',
        accentColor: 'red',
      },
      {
        id: 'moodie-bowl',
        name: 'Moodie Bowl / Bottom Dweller',
        winner: 'Escuelas',
        context: '2-12 in just their 2nd season — matched the all-time worst record',
        icon: 'trending-down',
        accentColor: 'red-dim',
      },
      {
        id: 'story-of-year',
        name: 'Story of the Year',
        winner: 'JuicyBussy',
        context: '"The Great Cinderella: wins three road games as the 6th seed. The 13-1 MLSchools12 watches from home."',
        icon: 'star',
        accentColor: 'purple',
      },
    ],
  },
  {
    year: 2022,
    awards: [
      {
        id: 'champion',
        name: 'Champion',
        winner: 'Grandes',
        context: '8-6, 4th seed — won a three-way tiebreaker season nobody saw coming',
        icon: 'trophy',
        accentColor: 'gold',
      },
      {
        id: 'runner-up',
        name: 'Runner-Up',
        winner: 'rbr',
        context: 'Second runner-up finish in BMFFFL history — two finals appearances, no rings',
        icon: 'medal',
        accentColor: 'silver',
      },
      {
        id: 'best-regular-season',
        name: 'Best Regular Season',
        winner: 'MLSchools12 / JuicyBussy / rbr',
        context: 'Three-way tie at 10-4 — first time in league history',
        icon: 'trending-up',
        accentColor: 'blue',
      },
      {
        id: 'playoff-heartbreak',
        name: 'Playoff Heartbreak',
        winner: 'MLSchools12',
        context: '#1 seed — lost to Grandes in the semis by just 2.80 points',
        icon: 'heart-crack',
        accentColor: 'red',
      },
      {
        id: 'moodie-bowl',
        name: 'Moodie Bowl / Bottom Dweller',
        winner: 'tdtd19844',
        context: '3-11 regular season — the bottom of the barrel before the greatest rebuild arc begins',
        icon: 'trending-down',
        accentColor: 'red-dim',
      },
      {
        id: 'story-of-year',
        name: 'Story of the Year',
        winner: 'Grandes',
        context: '"Wins as the 4th seed in a three-way tiebreaker season — 8-6 is good enough when seeding goes your way."',
        icon: 'star',
        accentColor: 'purple',
      },
    ],
  },
  {
    year: 2021,
    awards: [
      {
        id: 'champion',
        name: 'Champion',
        winner: 'MLSchools12',
        context: '11-3 regular season — league-best 2,327.06 points scored, first ring claimed',
        icon: 'trophy',
        accentColor: 'gold',
      },
      {
        id: 'runner-up',
        name: 'Runner-Up',
        winner: 'SexMachineAndyD',
        context: 'Lost the championship 193.10–111.34 — first of two runner-up finishes in their career',
        icon: 'medal',
        accentColor: 'silver',
      },
      {
        id: 'best-regular-season',
        name: 'Best Regular Season',
        winner: 'MLSchools12',
        context: '11-3, 2,327.06 points — best single-season scoring total in BMFFFL history',
        icon: 'trending-up',
        accentColor: 'blue',
      },
      {
        id: 'playoff-heartbreak',
        name: 'Playoff Heartbreak',
        winner: 'rbr',
        context: 'Strong regular season — lost in the semis, would return to the finals in 2022',
        icon: 'heart-crack',
        accentColor: 'red',
      },
      {
        id: 'moodie-bowl',
        name: 'Moodie Bowl / Bottom Dweller',
        winner: 'MCSchools',
        context: '0-14 — the only 0-14 season in BMFFFL history, then retired',
        icon: 'trending-down',
        accentColor: 'red-dim',
      },
      {
        id: 'story-of-year',
        name: 'Story of the Year',
        winner: 'JuicyBussy',
        context: '"Scores 245.80 points in Week 16 consolation — the all-time BMFFFL record, set in a game that didn\'t matter."',
        icon: 'star',
        accentColor: 'purple',
      },
    ],
  },
  {
    year: 2020,
    awards: [
      {
        id: 'champion',
        name: 'Champion',
        winner: 'Cogdeill11',
        context: 'Inaugural BMFFFL champion — won the closest championship in league history',
        icon: 'trophy',
        accentColor: 'gold',
      },
      {
        id: 'runner-up',
        name: 'Runner-Up',
        winner: 'eldridsm',
        context: 'Lost by just 4.76 points — the tightest championship margin in BMFFFL history',
        icon: 'medal',
        accentColor: 'silver',
      },
      {
        id: 'best-regular-season',
        name: 'Best Regular Season',
        winner: 'MLSchools12',
        context: '11-2 — best regular-season record in the inaugural year',
        icon: 'trending-up',
        accentColor: 'blue',
      },
      {
        id: 'playoff-heartbreak',
        name: 'Playoff Heartbreak',
        winner: 'MLSchools12',
        context: '#1 seed, 11-2 — lost the semis to eldridsm despite scoring 181 points',
        icon: 'heart-crack',
        accentColor: 'red',
      },
      {
        id: 'moodie-bowl',
        name: 'Moodie Bowl / Bottom Dweller',
        winner: 'Grandes',
        context: '4-9 regular season — tied for the worst record in the inaugural season',
        icon: 'trending-down',
        accentColor: 'red-dim',
      },
      {
        id: 'story-of-year',
        name: 'Story of the Year',
        winner: 'Alvin Kamara',
        context: '"6 TDs on Christmas Day — the most chaotic fantasy day in league history, the week that shook the inaugural playoffs."',
        icon: 'star',
        accentColor: 'purple',
      },
    ],
  },
];

// ─── All-Time Awards Data ─────────────────────────────────────────────────────

const ALL_TIME_AWARDS: AllTimeAward[] = [
  {
    id: 'dynasty',
    title: 'The Dynasty',
    winner: 'MLSchools12',
    description:
      '2 rings, 6 playoff appearances, .820 all-time win% — the most dominant owner in BMFFFL history by every statistical measure.',
    icon: 'crown',
  },
  {
    id: 'cinderella',
    title: 'The Cinderella',
    winner: 'JuicyBussy',
    description:
      'Won the 2023 championship as the 6th seed — the lowest seed to ever win in BMFFFL. Three road playoff wins when nobody believed.',
    icon: 'zap',
  },
  {
    id: 'heartbreak-king',
    title: 'The Heartbreak King',
    winner: 'tdtd19844',
    description:
      'Semi-final exits in back-to-back seasons despite playoff runs — the hardest luck story in a league full of them.',
    icon: 'heart-crack',
  },
  {
    id: 'rebuild-arc',
    title: 'The Rebuild Arc',
    winner: 'tdtd19844',
    description:
      '3-11 in 2022 → CHAMPION in 2023. Three years from the basement to the top of the mountain — the greatest redemption story in BMFFFL history.',
    icon: 'flame',
  },
  {
    id: 'ironman',
    title: 'The Ironman',
    winner: 'rbr',
    description:
      '4 playoff appearances, 2 runner-up finishes — no off years, no basement seasons. Consistently the most reliable threat in the league.',
    icon: 'trophy',
  },
  {
    id: 'wild-card',
    title: 'The Wild Card',
    winner: 'Grandes',
    description:
      '2022 champion → 2025 Moodie Bowl. The most extreme swing in BMFFFL history — from title to toilet bowl in three seasons.',
    icon: 'star',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEASONS_LIST = SEASONS.map((s) => s.year);

function getAccentClasses(color: SeasonAward['accentColor']): {
  border: string;
  bg: string;
  icon: string;
  label: string;
} {
  switch (color) {
    case 'gold':
      return {
        border: 'border-[#ffd700]/40 hover:border-[#ffd700]/70',
        bg: 'bg-[#ffd700]/5',
        icon: 'text-[#ffd700]',
        label: 'text-[#ffd700]',
      };
    case 'silver':
      return {
        border: 'border-slate-400/30 hover:border-slate-400/60',
        bg: 'bg-slate-400/5',
        icon: 'text-slate-300',
        label: 'text-slate-300',
      };
    case 'blue':
      return {
        border: 'border-cyan-400/30 hover:border-cyan-400/60',
        bg: 'bg-cyan-400/5',
        icon: 'text-cyan-400',
        label: 'text-cyan-400',
      };
    case 'red':
      return {
        border: 'border-[#e94560]/40 hover:border-[#e94560]/70',
        bg: 'bg-[#e94560]/5',
        icon: 'text-[#e94560]',
        label: 'text-[#e94560]',
      };
    case 'red-dim':
      return {
        border: 'border-[#e94560]/20 hover:border-[#e94560]/40',
        bg: 'bg-[#e94560]/3',
        icon: 'text-[#e94560]/70',
        label: 'text-[#e94560]/70',
      };
    case 'purple':
      return {
        border: 'border-purple-400/30 hover:border-purple-400/60',
        bg: 'bg-purple-400/5',
        icon: 'text-purple-400',
        label: 'text-purple-400',
      };
  }
}

function AwardIcon({
  type,
  className,
}: {
  type: SeasonAward['icon'];
  className?: string;
}) {
  const cls = cn('w-5 h-5 shrink-0', className);
  switch (type) {
    case 'trophy':      return <Trophy       className={cls} aria-hidden="true" />;
    case 'medal':       return <Medal        className={cls} aria-hidden="true" />;
    case 'trending-up': return <TrendingUp   className={cls} aria-hidden="true" />;
    case 'heart-crack': return <HeartCrack   className={cls} aria-hidden="true" />;
    case 'trending-down': return <TrendingDown className={cls} aria-hidden="true" />;
    case 'star':        return <Star         className={cls} aria-hidden="true" />;
  }
}

function AllTimeIcon({
  type,
  className,
}: {
  type: AllTimeAward['icon'];
  className?: string;
}) {
  const cls = cn('w-6 h-6 shrink-0', className);
  switch (type) {
    case 'crown':       return <Crown        className={cls} aria-hidden="true" />;
    case 'zap':         return <Zap          className={cls} aria-hidden="true" />;
    case 'heart-crack': return <HeartCrack   className={cls} aria-hidden="true" />;
    case 'flame':       return <Flame        className={cls} aria-hidden="true" />;
    case 'trophy':      return <Trophy       className={cls} aria-hidden="true" />;
    case 'star':        return <Star         className={cls} aria-hidden="true" />;
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AwardsPage() {
  const [activeYear, setActiveYear] = useState<number>(2025);

  const activeSeason = SEASONS.find((s) => s.year === activeYear)!;

  return (
    <>
      <Head>
        <title>Annual Awards — BMFFFL</title>
        <meta
          name="description"
          content="The BMFFFL official awards archive — champions, best regular seasons, heartbreak, and story of the year for every season from 2020 to present."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-150"
          >
            <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" aria-hidden="true" />
            League History
          </Link>
        </nav>

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <header className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            Awards Archive
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-3">
            Annual Awards
          </h1>
          <p className="text-slate-400 text-lg">
            BMFFFL &bull; 2020 &ndash; 2025
          </p>
        </header>

        {/* ── Season Tabs ───────────────────────────────────────────────── */}
        <div className="mb-10">
          <div
            role="tablist"
            aria-label="Select season"
            className="flex flex-wrap gap-2"
          >
            {SEASONS_LIST.map((year) => {
              const isActive = year === activeYear;
              return (
                <button
                  key={year}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`season-panel-${year}`}
                  id={`season-tab-${year}`}
                  onClick={() => setActiveYear(year)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 select-none',
                    'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/50',
                    isActive
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700] shadow-lg shadow-[#ffd700]/20'
                      : 'bg-[#16213e] text-slate-300 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-[#ffd700]'
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Season Awards Panel ───────────────────────────────────────── */}
        <section
          id={`season-panel-${activeYear}`}
          role="tabpanel"
          aria-labelledby={`season-tab-${activeYear}`}
          className="mb-20"
          aria-label={`${activeYear} season awards`}
        >
          {/* Season heading */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-5xl sm:text-7xl font-black text-[#ffd700] tabular-nums leading-none">
              {activeYear}
            </span>
            <div className="h-12 w-px bg-[#2d4a66]" aria-hidden="true" />
            <div>
              <p className="text-white font-black text-lg leading-tight">Season Awards</p>
              <p className="text-slate-400 text-sm">
                6 awards &bull; BMFFFL official archive
              </p>
            </div>
          </div>

          {/* Award cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeSeason.awards.map((award) => {
              const accent = getAccentClasses(award.accentColor);
              return (
                <article
                  key={award.id}
                  className={cn(
                    'rounded-xl border p-6 flex flex-col gap-4 transition-colors duration-200',
                    'bg-[#16213e]',
                    accent.border
                  )}
                >
                  {/* Icon + award name */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        accent.bg,
                        'border',
                        award.accentColor === 'gold'     ? 'border-[#ffd700]/20' :
                        award.accentColor === 'silver'   ? 'border-slate-400/20' :
                        award.accentColor === 'blue'     ? 'border-cyan-400/20'  :
                        award.accentColor === 'red'      ? 'border-[#e94560]/25' :
                        award.accentColor === 'red-dim'  ? 'border-[#e94560]/15' :
                                                           'border-purple-400/20'
                      )}
                    >
                      <AwardIcon type={award.icon} className={accent.icon} />
                    </div>
                    <span
                      className={cn(
                        'text-xs font-black uppercase tracking-widest',
                        accent.label
                      )}
                    >
                      {award.name}
                    </span>
                  </div>

                  {/* Winner */}
                  <div>
                    <p className="text-white font-black text-xl leading-tight">
                      {award.winner}
                    </p>
                  </div>

                  {/* Context */}
                  <p className="text-xs text-slate-400 leading-relaxed flex-1">
                    {award.context}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── All-Time Awards ───────────────────────────────────────────── */}
        <section aria-labelledby="all-time-awards-heading" className="mb-16">

          {/* Section header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
              <Crown className="w-3.5 h-3.5" aria-hidden="true" />
              All-Time
            </div>
            <h2
              id="all-time-awards-heading"
              className="text-3xl sm:text-4xl font-black text-white leading-tight"
            >
              Legacy Awards
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Spanning 2020–2025 &bull; One award per defining story
            </p>
          </div>

          {/* Decorative divider */}
          <div className="w-full h-px bg-gradient-to-r from-[#ffd700]/40 via-[#ffd700]/10 to-transparent mb-8" aria-hidden="true" />

          {/* All-time award cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_TIME_AWARDS.map((award, idx) => {
              // Alternate accent colors for visual variety
              const isGold   = idx === 0;
              const isRed    = idx === 2 || idx === 3;
              const isPurple = idx === 5;
              const isCyan   = idx === 4;

              const borderClass = isGold
                ? 'border-[#ffd700]/50 hover:border-[#ffd700]/80'
                : isRed
                ? 'border-[#e94560]/40 hover:border-[#e94560]/70'
                : isPurple
                ? 'border-purple-400/40 hover:border-purple-400/70'
                : isCyan
                ? 'border-cyan-400/30 hover:border-cyan-400/60'
                : 'border-[#ffd700]/25 hover:border-[#ffd700]/50';

              const iconColorClass = isGold
                ? 'text-[#ffd700]'
                : isRed
                ? 'text-[#e94560]'
                : isPurple
                ? 'text-purple-400'
                : isCyan
                ? 'text-cyan-400'
                : 'text-[#ffd700]/80';

              const iconBgClass = isGold
                ? 'bg-[#ffd700]/10 border-[#ffd700]/20'
                : isRed
                ? 'bg-[#e94560]/10 border-[#e94560]/20'
                : isPurple
                ? 'bg-purple-400/10 border-purple-400/20'
                : isCyan
                ? 'bg-cyan-400/10 border-cyan-400/20'
                : 'bg-[#ffd700]/8 border-[#ffd700]/15';

              return (
                <article
                  key={award.id}
                  className={cn(
                    'relative rounded-xl border bg-[#16213e] p-6 flex flex-col gap-4',
                    'transition-colors duration-200',
                    borderClass
                  )}
                >
                  {/* Number badge */}
                  <span
                    className="absolute top-4 right-4 text-xs font-black tabular-nums text-slate-700"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Icon + title */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg border flex items-center justify-center shrink-0',
                        iconBgClass
                      )}
                    >
                      <AllTimeIcon type={award.icon} className={iconColorClass} />
                    </div>
                    <h3
                      className={cn(
                        'text-xs font-black uppercase tracking-widest leading-tight',
                        iconColorClass
                      )}
                    >
                      {award.title}
                    </h3>
                  </div>

                  {/* Winner */}
                  <p className="text-white font-black text-xl leading-tight">
                    {award.winner}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed flex-1">
                    {award.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Back to History ───────────────────────────────────────────── */}
        <div className="border-t border-[#2d4a66] pt-8">
          <Link
            href="/history"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-5 py-3',
              'bg-[#16213e] border-[#2d4a66] text-slate-300 text-sm font-semibold',
              'hover:border-[#ffd700]/50 hover:text-[#ffd700] hover:bg-[#1a2d42]',
              'transition-all duration-150'
            )}
          >
            <ArrowUp className="w-4 h-4 rotate-[-90deg]" aria-hidden="true" />
            Back to League History
          </Link>
        </div>

      </div>
    </>
  );
}
