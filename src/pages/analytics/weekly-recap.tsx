import { useState } from 'react';
import Head from 'next/head';
import { Trophy, Skull, Rocket, Zap, BarChart2, CalendarDays, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getOwnerToken, OWNER_TOKENS } from '@/lib/owner-tokens';
import ShareButton from '@/components/ui/ShareButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MatchupResult {
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  margin: number;
  bimfleOneLiner: string;
}

interface LeaderboardEntry {
  rank: 1 | 2 | 3;
  manager: string;
  points: number;
}

interface WeeklyAwards {
  highScore: { manager: string; points: number };
  lowScore:  { manager: string; points: number; sympathy: string };
  bestPickup: { player: string; team: string };
  biggestUpset: { underdog: string; favorite: string; detail: string };
}

interface StandingRow {
  manager: string;
  wins: number;
  losses: number;
}

interface PreviewMatchup {
  home: string;
  away: string;
  bimflePick: string;
  predictedScore: string;
}

interface WeekData {
  label: string;
  shortLabel: string;
  subtitle: string;
  keyMatchup: MatchupResult;
  leaderboard: LeaderboardEntry[];
  awards: WeeklyAwards;
  dispatch: string;
  standings: StandingRow[];
  nextWeekPreview: PreviewMatchup[];
}

type WeekKey =
  | 'week7'
  | 'week11'
  | 'week14'
  | 'playoff1'
  | 'playoff2'
  | 'championship';

// ─── Helper ───────────────────────────────────────────────────────────────────

function ownerDisplay(slug: string): string {
  return getOwnerToken(slug)?.displayName ?? slug;
}

function ownerEmoji(slug: string): string {
  return getOwnerToken(slug)?.emoji ?? '🏈';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEEK_DATA: Record<WeekKey, WeekData> = {

  // ── Week 7 ──────────────────────────────────────────────────────────────────
  week7: {
    label:     'Week 7',
    shortLabel:'Wk 7',
    subtitle:  'Mid-season slugfest — the standings picture starts to clarify',
    keyMatchup: {
      winner:       'mlschools12',
      loser:        'escuelas',
      winnerScore:  178.4,
      loserScore:   112.6,
      margin:       65.8,
      bimfleOneLiner:
        "MLSchools12 didn't break a sweat. Escuelas is still looking for their first-ever W against the crown.",
    },
    leaderboard: [
      { rank: 1, manager: 'mlschools12',    points: 178.4 },
      { rank: 2, manager: 'tubes94',        points: 168.9 },
      { rank: 3, manager: 'sexmachineandy', points: 161.2 },
    ],
    awards: {
      highScore:  { manager: 'mlschools12', points: 178.4 },
      lowScore:   {
        manager: 'escuelas',
        points: 112.6,
        sympathy: "Bimfle sends thoughts and prayers. And a waiver wire tutorial.",
      },
      bestPickup:   { player: 'Puka Nacua',   team: 'LAR' },
      biggestUpset: {
        underdog: 'eldridm20',
        favorite: 'cogdeill11',
        detail:   'Eldridm20 sneaks a 6-point win as a 14-point underdog.',
      },
    },
    dispatch: `Week 7 was a masterclass in separation. MLSchools12 continues to operate on a different plane of existence, and nobody in this league seems to have a blueprint for slowing them down. tubes94 is quietly assembling something dangerous in second place — don't sleep on the whale. Down in the basement, Escuelas managed their worst output of the season at a time they desperately needed a bounce-back performance. The real story, though? eldridm20 pulling off the week's biggest upset, reminding everyone that any given Sunday (or whatever day Sleeper processes scores) is a legitimate concept in dynasty. Bimfle is watching.`,
    standings: [
      { manager: 'mlschools12',    wins: 7, losses: 0 },
      { manager: 'tubes94',        wins: 5, losses: 2 },
      { manager: 'sexmachineandy', wins: 5, losses: 2 },
      { manager: 'rbr',            wins: 4, losses: 3 },
      { manager: 'juicybussy',     wins: 4, losses: 3 },
      { manager: 'tdtd19844',      wins: 4, losses: 3 },
      { manager: 'cmaleski',       wins: 3, losses: 4 },
      { manager: 'eldridsm',       wins: 3, losses: 4 },
      { manager: 'eldridm20',      wins: 3, losses: 4 },
      { manager: 'cogdeill11',     wins: 2, losses: 5 },
      { manager: 'grandes',        wins: 1, losses: 6 },
      { manager: 'escuelas',       wins: 0, losses: 7 },
    ],
    nextWeekPreview: [
      {
        home: 'tubes94',
        away: 'sexmachineandy',
        bimflePick: 'tubes94',
        predictedScore: '162–154',
      },
      {
        home: 'rbr',
        away: 'mlschools12',
        bimflePick: 'mlschools12',
        predictedScore: '174–159',
      },
      {
        home: 'juicybussy',
        away: 'tdtd19844',
        bimflePick: 'juicybussy',
        predictedScore: '158–151',
      },
    ],
  },

  // ── Week 11 ─────────────────────────────────────────────────────────────────
  week11: {
    label:     'Week 11',
    shortLabel:'Wk 11',
    subtitle:  'Playoff race intensifies — three teams fighting for two spots',
    keyMatchup: {
      winner:       'tubes94',
      loser:        'rbr',
      winnerScore:  181.6,
      loserScore:   172.3,
      margin:       9.3,
      bimfleOneLiner:
        "Tubes94 squeaks past rbr in a thriller — the Blue Chess Master's playoff ceiling is narrowing.",
    },
    leaderboard: [
      { rank: 1, manager: 'juicybussy',  points: 194.2 },
      { rank: 2, manager: 'tubes94',     points: 181.6 },
      { rank: 3, manager: 'cmaleski',    points: 177.8 },
    ],
    awards: {
      highScore:  { manager: 'juicybussy', points: 194.2 },
      lowScore:   {
        manager: 'cogdeill11',
        points: 98.4,
        sympathy: "Bimfle lights a candle for the Founding Champion. The wolves sense weakness.",
      },
      bestPickup:   { player: 'Jaylen Warren', team: 'PIT' },
      biggestUpset: {
        underdog: 'cmaleski',
        favorite: 'tdtd19844',
        detail:   'Cmaleski drops 177.8 to hand tdtd19844 a crushing loss in the playoff bubble.',
      },
    },
    dispatch: `Week 11 arrived like a freight train of implications. JuicyBussy posted the season's second-highest score at 194.2 — a timely explosion that reshuffled the bubble standings in their favor. tubes94 vs. rbr was the best game on the slate: a nine-point nail-biter where the Blue Chess Master had to watch his playoff odds drop with every final score update. Meanwhile, Cogdeill11 bottomed out at under 100 points, a ghostly performance from the league's founding champion. The playoff picture is this: mlschools12 is locked, tubes94 is close, and sexmachineandy, rbr, and juicybussy are all staring at a single elimination scenario over the next three weeks. Bimfle is sharpening the scythe.`,
    standings: [
      { manager: 'mlschools12',    wins: 10, losses: 1 },
      { manager: 'tubes94',        wins:  8, losses: 3 },
      { manager: 'sexmachineandy', wins:  7, losses: 4 },
      { manager: 'rbr',            wins:  7, losses: 4 },
      { manager: 'juicybussy',     wins:  6, losses: 5 },
      { manager: 'tdtd19844',      wins:  6, losses: 5 },
      { manager: 'cmaleski',       wins:  5, losses: 6 },
      { manager: 'eldridsm',       wins:  5, losses: 6 },
      { manager: 'eldridm20',      wins:  4, losses: 7 },
      { manager: 'cogdeill11',     wins:  3, losses: 8 },
      { manager: 'grandes',        wins:  2, losses: 9 },
      { manager: 'escuelas',       wins:  2, losses: 9 },
    ],
    nextWeekPreview: [
      {
        home: 'sexmachineandy',
        away: 'rbr',
        bimflePick: 'sexmachineandy',
        predictedScore: '168–160',
      },
      {
        home: 'juicybussy',
        away: 'mlschools12',
        bimflePick: 'mlschools12',
        predictedScore: '176–168',
      },
      {
        home: 'cmaleski',
        away: 'tubes94',
        bimflePick: 'tubes94',
        predictedScore: '171–163',
      },
    ],
  },

  // ── Week 14 (Final Regular Season) ─────────────────────────────────────────
  week14: {
    label:     'Week 14',
    shortLabel:'Wk 14',
    subtitle:  'Regular season finale — playoff seeds locked, the bracket set',
    keyMatchup: {
      winner:       'sexmachineandy',
      loser:        'rbr',
      winnerScore:  172.8,
      loserScore:   158.2,
      margin:       14.6,
      bimfleOneLiner:
        "SexMachineAndyD clinches the 3-seed over rbr in a high-stakes finale — the bracket won't forgive this.",
    },
    leaderboard: [
      { rank: 1, manager: 'sexmachineandy', points: 172.8 },
      { rank: 2, manager: 'mlschools12',    points: 168.4 },
      { rank: 3, manager: 'tubes94',        points: 162.1 },
    ],
    awards: {
      highScore:  { manager: 'sexmachineandy', points: 172.8 },
      lowScore:   {
        manager: 'grandes',
        points: 96.2,
        sympathy: "Bimfle notes the Commissioner went out without a bang. The constitution provides no comfort.",
      },
      bestPickup:   { player: 'Zamir White', team: 'LV' },
      biggestUpset: {
        underdog: 'eldridsm',
        favorite: 'juicybussy',
        detail:   "Eldridsm eliminates JuicyBussy's playoff hopes in a shocking 11-point upset.",
      },
    },
    dispatch: `The regular season finale delivered exactly what the chaos-hungry Bimfle ordered. SexMachineAndyD ran down rbr in the week's marquee matchup, claiming the 3-seed and forcing the Blue Chess Master into the 4-spot heading into Playoff Week 1. MLSchools12 coasted to the 1-seed with quiet authority — no drama needed, no points wasted. The real gut-punch: JuicyBussy's upset loss to eldridsm ended their playoff hopes, a brutal exit for a team that had the league's highest single-week score this season. The bracket is set: mlschools12 vs. rbr, tubes94 vs. sexmachineandy. Bimfle has chosen their favorite, and it's not who you think.`,
    standings: [
      { manager: 'mlschools12',    wins: 12, losses:  2 },
      { manager: 'tubes94',        wins: 10, losses:  4 },
      { manager: 'sexmachineandy', wins:  9, losses:  5 },
      { manager: 'rbr',            wins:  8, losses:  6 },
      { manager: 'juicybussy',     wins:  7, losses:  7 },
      { manager: 'tdtd19844',      wins:  7, losses:  7 },
      { manager: 'cmaleski',       wins:  6, losses:  8 },
      { manager: 'eldridsm',       wins:  6, losses:  8 },
      { manager: 'eldridm20',      wins:  5, losses:  9 },
      { manager: 'cogdeill11',     wins:  4, losses: 10 },
      { manager: 'grandes',        wins:  3, losses: 11 },
      { manager: 'escuelas',       wins:  2, losses: 12 },
    ],
    nextWeekPreview: [
      {
        home: 'mlschools12',
        away: 'rbr',
        bimflePick: 'mlschools12',
        predictedScore: '185–165',
      },
      {
        home: 'tubes94',
        away: 'sexmachineandy',
        bimflePick: 'tubes94',
        predictedScore: '195–180',
      },
      {
        home: 'juicybussy',
        away: 'cmaleski',
        bimflePick: 'juicybussy',
        predictedScore: '168–158',
      },
    ],
  },

  // ── Playoff Week 1 (Semi-finals) ─────────────────────────────────────────────
  playoff1: {
    label:     'Playoff Week 1',
    shortLabel:'PO Wk 1',
    subtitle:  'Semi-finals — the road to the championship runs through here',
    keyMatchup: {
      winner:       'tubes94',
      loser:        'sexmachineandy',
      winnerScore:  203.8,
      loserScore:   188.9,
      margin:       14.9,
      bimfleOneLiner:
        "Tubes94 explodes for a season-best 203.8 and cements a championship date with MLSchools12.",
    },
    leaderboard: [
      { rank: 1, manager: 'tubes94',        points: 203.8 },
      { rank: 2, manager: 'mlschools12',    points: 189.3 },
      { rank: 3, manager: 'sexmachineandy', points: 188.9 },
    ],
    awards: {
      highScore:  { manager: 'tubes94', points: 203.8 },
      lowScore:   {
        manager: 'rbr',
        points: 167.1,
        sympathy: "Bimfle acknowledges rbr's 167 points on any other week probably wins. There are no participation rings.",
      },
      bestPickup:   { player: 'Josh Downs', team: 'IND' },
      biggestUpset: {
        underdog: 'juicybussy',
        favorite: 'tdtd19844',
        detail:   'JuicyBussy outlasts tdtd19844 in the consolation bracket opener by just 4 points.',
      },
    },
    dispatch: `The Playoff Week 1 slate was everything this league deserved. On the top side, mlschools12 methodically dismantled rbr 189.3–167.1, a performance so efficient it felt routine — and that's the scariest thing about the Dynasty Lord. On the bottom side, tubes94 went supernova with a 203.8-point week, sending sexmachineandy home despite Andy posting a very respectable 188.9. Two good teams. One historic score. The whale is hungry and the championship is next. Bimfle has studied both opponents, run seventeen simulations, and placed exactly zero bets against mlschools12. The data is the data.`,
    standings: [
      { manager: 'mlschools12',    wins: 13, losses:  2 },
      { manager: 'tubes94',        wins: 11, losses:  4 },
      { manager: 'sexmachineandy', wins:  9, losses:  6 },
      { manager: 'rbr',            wins:  8, losses:  7 },
      { manager: 'juicybussy',     wins:  8, losses:  7 },
      { manager: 'tdtd19844',      wins:  7, losses:  8 },
      { manager: 'cmaleski',       wins:  6, losses:  9 },
      { manager: 'eldridsm',       wins:  6, losses:  9 },
      { manager: 'eldridm20',      wins:  5, losses: 10 },
      { manager: 'cogdeill11',     wins:  4, losses: 11 },
      { manager: 'grandes',        wins:  3, losses: 12 },
      { manager: 'escuelas',       wins:  2, losses: 13 },
    ],
    nextWeekPreview: [
      {
        home: 'mlschools12',
        away: 'tubes94',
        bimflePick: 'mlschools12',
        predictedScore: '195–185',
      },
      {
        home: 'sexmachineandy',
        away: 'rbr',
        bimflePick: 'rbr',
        predictedScore: '172–168',
      },
      {
        home: 'juicybussy',
        away: 'cmaleski',
        bimflePick: 'juicybussy',
        predictedScore: '174–160',
      },
    ],
  },

  // ── Playoff Week 2 (Third-place / Consolation) ───────────────────────────────
  playoff2: {
    label:     'Playoff Week 2',
    shortLabel:'PO Wk 2',
    subtitle:  'Third-place bracket, consolation rounds — everyone fighting for dignity',
    keyMatchup: {
      winner:       'juicybussy',
      loser:        'cmaleski',
      winnerScore:  176.4,
      loserScore:   161.8,
      margin:       14.6,
      bimfleOneLiner:
        "JuicyBussy takes the consolation crown over Cmaleski — small prize, large ego restored.",
    },
    leaderboard: [
      { rank: 1, manager: 'juicybussy', points: 176.4 },
      { rank: 2, manager: 'eldridsm',   points: 164.9 },
      { rank: 3, manager: 'cmaleski',   points: 161.8 },
    ],
    awards: {
      highScore:  { manager: 'juicybussy', points: 176.4 },
      lowScore:   {
        manager: 'escuelas',
        points: 104.2,
        sympathy: "Bimfle closes the season by noting Escuelas went 2-14. The rebuild continues. The green sprout lives on.",
      },
      bestPickup:   { player: 'Dontayvion Wicks', team: 'GB' },
      biggestUpset: {
        underdog: 'eldridsm',
        favorite: 'sexmachineandy',
        detail:   'Eldridsm claims a 3-point win in the 3rd-place consolation, capping a strong late-season run.',
      },
    },
    dispatch: `The consolation rounds: not glamorous, not lucrative, but fiercely contested nonetheless. JuicyBussy crushed Cmaleski by 14.6 to take the bracket's top consolation prize, while eldridsm's surprising run continued with a narrow win over sexmachineandy in the 3rd/4th place tilt. Escuelas completed their 2-14 season quietly, a number that will haunt the offseason scouting room. Meanwhile, all eyes turn to Playoff Week 3 — the Championship. Bimfle has eaten nothing but tape for the past seven days. The Dynasty Lord vs. The Rising Tide. The throne vs. the ambition. Sleep is for the offseason.`,
    standings: [
      { manager: 'mlschools12',    wins: 13, losses:  2 },
      { manager: 'tubes94',        wins: 11, losses:  4 },
      { manager: 'juicybussy',     wins:  9, losses:  7 },
      { manager: 'sexmachineandy', wins:  9, losses:  7 },
      { manager: 'rbr',            wins:  8, losses:  8 },
      { manager: 'eldridsm',       wins:  7, losses:  9 },
      { manager: 'tdtd19844',      wins:  7, losses:  9 },
      { manager: 'cmaleski',       wins:  6, losses: 10 },
      { manager: 'eldridm20',      wins:  5, losses: 11 },
      { manager: 'cogdeill11',     wins:  4, losses: 12 },
      { manager: 'grandes',        wins:  3, losses: 13 },
      { manager: 'escuelas',       wins:  2, losses: 14 },
    ],
    nextWeekPreview: [
      {
        home: 'mlschools12',
        away: 'tubes94',
        bimflePick: 'mlschools12',
        predictedScore: '220–200',
      },
      {
        home: 'sexmachineandy',
        away: 'rbr',
        bimflePick: 'rbr',
        predictedScore: '169–165',
      },
      {
        home: 'tdtd19844',
        away: 'cmaleski',
        bimflePick: 'tdtd19844',
        predictedScore: '162–154',
      },
    ],
  },

  // ── Championship (Week 18) ───────────────────────────────────────────────────
  championship: {
    label:     'Championship — Week 18',
    shortLabel:'Champ',
    subtitle:  '2025 BMFFFL Championship — Dark horse rises. New name on the ring.',
    keyMatchup: {
      winner:       'tdtd19844',
      loser:        'tubes94',
      winnerScore:  152.92,
      loserScore:   135.08,
      margin:       17.84,
      bimfleOneLiner:
        "The 4-seed. The rebuild. THE Shameful Saggy Sack is the 2025 BMFFFL Champion. The dynasty has a new name.",
    },
    leaderboard: [
      { rank: 1, manager: 'tdtd19844',  points: 152.92 },
      { rank: 2, manager: 'tubes94',    points: 135.08 },
      { rank: 3, manager: 'mlschools12', points: 221.4 },
    ],
    awards: {
      highScore:  { manager: 'tdtd19844', points: 152.92 },
      lowScore:   {
        manager: 'escuelas',
        points: 99.6,
        sympathy: "Bimfle offers Escuelas a participation trophy shaped like a green sprout. They've earned it.",
      },
      bestPickup:   { player: "Brock Bowers", team: 'LV' },
      biggestUpset: {
        underdog: 'tdtd19844',
        favorite: 'mlschools12',
        detail:   'tdtd19844 eliminates the 13-1 MLSchools12 in the semifinals — the upset that defined the 2025 postseason.',
      },
    },
    dispatch: `Nobody saw it coming. tdtd19844 entered as the 4-seed, quietly assembled a playoff roster nobody respected, and knocked off the league's all-time greatest regular-season team — the 13-1 MLSchools12 — in the semifinals. The championship against Tubes94 was clinical: 152.92 to 135.08. Brock Bowers was unguardable. Jalen Hurts delivered. This is the dynasty game everyone claims to play but rarely achieves — patient roster building, health at the right moment, and the willingness to believe when nobody else did. Six seasons. Six champions. Nobody has won back-to-back. The 2025 ring belongs to THE Shameful Saggy Sack.`,
    standings: [
      { manager: 'mlschools12',    wins: 14, losses:  2 },
      { manager: 'tubes94',        wins: 11, losses:  5 },
      { manager: 'rbr',            wins:  9, losses:  7 },
      { manager: 'sexmachineandy', wins:  9, losses:  7 },
      { manager: 'juicybussy',     wins:  9, losses:  7 },
      { manager: 'eldridsm',       wins:  7, losses:  9 },
      { manager: 'tdtd19844',      wins:  7, losses:  9 },
      { manager: 'cmaleski',       wins:  7, losses:  9 },
      { manager: 'eldridm20',      wins:  5, losses: 11 },
      { manager: 'cogdeill11',     wins:  4, losses: 12 },
      { manager: 'grandes',        wins:  3, losses: 13 },
      { manager: 'escuelas',       wins:  2, losses: 14 },
    ],
    nextWeekPreview: [
      {
        home: 'mlschools12',
        away: 'tubes94',
        bimflePick: 'mlschools12',
        predictedScore: '??? – ???',
      },
      {
        home: 'tubes94',
        away: 'sexmachineandy',
        bimflePick: 'tubes94',
        predictedScore: '2026 starts fresh',
      },
      {
        home: 'rbr',
        away: 'juicybussy',
        bimflePick: 'rbr',
        predictedScore: 'The dynasty must be broken',
      },
    ],
  },
};

const WEEK_KEYS: { key: WeekKey; label: string }[] = [
  { key: 'week7',        label: 'Wk 7' },
  { key: 'week11',       label: 'Wk 11' },
  { key: 'week14',       label: 'Wk 14' },
  { key: 'playoff1',     label: 'PO Wk 1' },
  { key: 'playoff2',     label: 'PO Wk 2' },
  { key: 'championship', label: 'Champ' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBadge({ score, gold }: { score: number; gold?: boolean }) {
  return (
    <span
      className={cn(
        'text-4xl font-black tabular-nums',
        gold ? 'text-[#ffd700]' : 'text-slate-300'
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}

interface ManagerPillProps {
  slug: string;
  sub?: string;
}

function ManagerPill({ slug, sub }: ManagerPillProps) {
  const token = getOwnerToken(slug);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl">{token?.emoji ?? '🏈'}</span>
      <span className="font-black text-white text-sm tracking-wide">
        {token?.displayName ?? slug}
      </span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WeeklyRecapPage() {
  const [activeWeek, setActiveWeek] = useState<WeekKey>('championship');

  const data = WEEK_DATA[activeWeek];
  const isChamp = activeWeek === 'championship';

  return (
    <>
      <Head>
        <title>Weekly Recap | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Bimfle's 2025 BMFFFL weekly recaps — key matchups, awards, standings, and editorial dispatches for every week of the season."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ── */}
      <section className={cn(
        'border-b border-[#2d4a66]',
        isChamp
          ? 'bg-gradient-to-br from-[#0d1b2a] via-[#16213e] to-[#1a2a1a]'
          : 'bg-[#0d1b2a]'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">
              Analytics
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-3xl font-black text-white">Weekly Recap</h1>
            <ShareButton />
          </div>
          <p className="text-slate-400 text-sm">
            Bimfle&apos;s 2025 season dispatches — scores, awards, and unfiltered commentary.
          </p>
          <p className="text-slate-500 text-xs mt-1">2025 Season &middot; Weeks 7–14 + Playoffs</p>

          {/* Bimfle intro */}
          <div className="mt-5 inline-block bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-4 py-3 max-w-2xl">
            <p className="text-sm text-[#ffd700] italic leading-relaxed">
              &ldquo;Every week tells a story. Some are tragedies. Some are thrillers.
              And the Championship? That&apos;s a coronation.&rdquo;
            </p>
            <p className="text-xs text-[#ffd700]/60 mt-1">~Bimfle, League Mascot &amp; AI Analyst</p>
          </div>
        </div>
      </section>

      {/* ── Week Selector ── */}
      <div className="bg-[#16213e] border-b border-[#2d4a66] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2">
            {WEEK_KEYS.map(({ key, label }) => {
              const isPlay = key.startsWith('playoff');
              const isC    = key === 'championship';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveWeek(key)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-100',
                    activeWeek === key
                      ? isC
                        ? 'bg-[#ffd700] text-[#1a1a2e]'
                        : 'bg-[#ffd700] text-[#1a1a2e]'
                      : isC
                        ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/40 hover:bg-[#ffd700]/20'
                        : isPlay
                          ? 'bg-purple-900/30 text-purple-300 border border-purple-700/40 hover:bg-purple-800/40'
                          : 'bg-[#0d1b2a] text-slate-400 border border-[#2d4a66] hover:text-white'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Week Title Banner ── */}
        <div className={cn(
          'rounded-xl border px-6 py-4',
          isChamp
            ? 'bg-gradient-to-r from-[#ffd700]/10 to-[#ffd700]/5 border-[#ffd700]/40'
            : 'bg-[#16213e] border-[#2d4a66]'
        )}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className={cn(
                'text-2xl font-black',
                isChamp ? 'text-[#ffd700]' : 'text-white'
              )}>
                {data.label}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">{data.subtitle}</p>
            </div>
            {isChamp && (
              <span className="text-3xl" title="Championship Week">🏆</span>
            )}
          </div>
        </div>

        {/* ── Key Matchup Hero Card ── */}
        <section aria-labelledby="matchup-heading">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="matchup-heading" className="text-sm font-black text-white uppercase tracking-widest">
              Key Matchup
            </h2>
          </div>

          <div className={cn(
            'rounded-2xl border overflow-hidden',
            isChamp
              ? 'bg-gradient-to-br from-[#1a2a0a] via-[#16213e] to-[#0d1b2a] border-[#ffd700]/50'
              : 'bg-[#16213e] border-[#2d4a66]'
          )}>
            <div className="p-6">
              {/* Scores */}
              <div className="grid grid-cols-3 items-center gap-4">
                {/* Winner */}
                <div className="flex flex-col items-center gap-3">
                  <ManagerPill slug={data.keyMatchup.winner} sub="WINNER" />
                  <ScoreBadge score={data.keyMatchup.winnerScore} gold />
                </div>

                {/* VS / Margin */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">vs</span>
                  <div className="text-center">
                    <div className={cn(
                      'text-lg font-black tabular-nums',
                      isChamp ? 'text-[#ffd700]' : 'text-slate-300'
                    )}>
                      +{data.keyMatchup.margin.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500">margin</div>
                  </div>
                  {isChamp && (
                    <div className="text-2xl mt-1">👑</div>
                  )}
                </div>

                {/* Loser */}
                <div className="flex flex-col items-center gap-3">
                  <ManagerPill slug={data.keyMatchup.loser} sub="RUNNER-UP" />
                  <ScoreBadge score={data.keyMatchup.loserScore} />
                </div>
              </div>

              {/* Bimfle one-liner */}
              <div className="mt-5 bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-4 py-3">
                <p className="text-sm text-[#ffd700] italic leading-relaxed text-center">
                  &ldquo;{data.keyMatchup.bimfleOneLiner}&rdquo;
                </p>
                <p className="text-xs text-[#ffd700]/60 text-center mt-1">~Bimfle</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Weekly Leaderboard ── */}
        <section aria-labelledby="leaderboard-heading">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="leaderboard-heading" className="text-sm font-black text-white uppercase tracking-widest">
              Weekly Leaderboard
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {data.leaderboard.map((entry) => {
              const token = getOwnerToken(entry.manager);
              const medals = ['🥇', '🥈', '🥉'] as const;
              const medal  = medals[entry.rank - 1];
              const isGold = entry.rank === 1;
              return (
                <div
                  key={entry.manager}
                  className={cn(
                    'rounded-xl border p-4 flex flex-col items-center gap-2 text-center',
                    isGold
                      ? 'bg-[#ffd700]/8 border-[#ffd700]/40'
                      : 'bg-[#16213e] border-[#2d4a66]'
                  )}
                >
                  <span className="text-2xl">{medal}</span>
                  <span className="text-xl">{token?.emoji ?? '🏈'}</span>
                  <span className={cn('font-bold text-sm', isGold ? 'text-[#ffd700]' : 'text-white')}>
                    {token?.displayName ?? entry.manager}
                  </span>
                  <span className={cn('text-2xl font-black tabular-nums', isGold ? 'text-[#ffd700]' : 'text-slate-300')}>
                    {entry.points.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Weekly Awards ── */}
        <section aria-labelledby="awards-heading">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="awards-heading" className="text-sm font-black text-white uppercase tracking-widest">
              Weekly Awards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* High Score */}
            <div className="bg-[#16213e] border border-[#ffd700]/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏆</span>
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-widest">
                  High Score of the Week
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{ownerEmoji(data.awards.highScore.manager)}</span>
                <div>
                  <p className="font-bold text-white">
                    {ownerDisplay(data.awards.highScore.manager)}
                  </p>
                  <p className="text-[#ffd700] font-black tabular-nums">
                    {data.awards.highScore.points.toFixed(1)} pts
                  </p>
                </div>
              </div>
            </div>

            {/* Low Score */}
            <div className="bg-[#16213e] border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💀</span>
                <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                  Low Score of the Week
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ownerEmoji(data.awards.lowScore.manager)}</span>
                <div>
                  <p className="font-bold text-white">
                    {ownerDisplay(data.awards.lowScore.manager)}
                  </p>
                  <p className="text-red-400 font-black tabular-nums">
                    {data.awards.lowScore.points.toFixed(1)} pts
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">{data.awards.lowScore.sympathy}</p>
            </div>

            {/* Best Pickup */}
            <div className="bg-[#16213e] border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🚀</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  Best Pickup
                </span>
              </div>
              <p className="font-black text-white text-lg">{data.awards.bestPickup.player}</p>
              <p className="text-sm text-slate-400">{data.awards.bestPickup.team}</p>
            </div>

            {/* Biggest Upset */}
            <div className="bg-[#16213e] border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💥</span>
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
                  Biggest Upset
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{ownerEmoji(data.awards.biggestUpset.underdog)}</span>
                <span className="font-bold text-white text-sm">
                  {ownerDisplay(data.awards.biggestUpset.underdog)}
                </span>
                <span className="text-xs text-slate-500">def.</span>
                <span className="text-base">{ownerEmoji(data.awards.biggestUpset.favorite)}</span>
                <span className="font-bold text-slate-300 text-sm">
                  {ownerDisplay(data.awards.biggestUpset.favorite)}
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">{data.awards.biggestUpset.detail}</p>
            </div>
          </div>
        </section>

        {/* ── Bimfle Weekly Dispatch ── */}
        <section aria-labelledby="dispatch-heading">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" aria-hidden="true">🤖</span>
            <h2 id="dispatch-heading" className="text-sm font-black text-white uppercase tracking-widest">
              Bimfle&apos;s Weekly Dispatch
            </h2>
          </div>

          <div className={cn(
            'rounded-xl border p-6',
            isChamp
              ? 'bg-gradient-to-br from-[#ffd700]/8 to-[#16213e] border-[#ffd700]/40'
              : 'bg-[#16213e] border-[#2d4a66]'
          )}>
            <p className={cn(
              'leading-relaxed text-sm sm:text-base',
              isChamp ? 'text-slate-200' : 'text-slate-300'
            )}>
              {data.dispatch}
            </p>
            <p className="text-xs text-[#ffd700]/60 mt-4 italic">
              — Bimfle, BMFFFL League Mascot &amp; AI Analyst
            </p>
          </div>
        </section>

        {/* ── Standings After Week ── */}
        <section aria-labelledby="standings-heading">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="standings-heading" className="text-sm font-black text-white uppercase tracking-widest">
              Standings After {data.label}
            </h2>
          </div>

          <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="w-full text-sm" aria-label={`Standings after ${data.label}`}>
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-8">#</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Manager</th>
                  <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">W</th>
                  <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">L</th>
                  <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Win%</th>
                </tr>
              </thead>
              <tbody>
                {data.standings.map((row, idx) => {
                  const token     = getOwnerToken(row.manager);
                  const total     = row.wins + row.losses;
                  const winPct    = total > 0 ? (row.wins / total) : 0;
                  const isLeader  = idx === 0;
                  const isPlayoff = idx < 4;
                  return (
                    <tr
                      key={row.manager}
                      className={cn(
                        'border-b border-[#2d4a66]/40 transition-colors hover:bg-[#0d1b2a]/40',
                        isLeader ? 'bg-[#ffd700]/5' : ''
                      )}
                    >
                      <td className={cn(
                        'py-2.5 px-4 font-mono text-xs font-bold',
                        isLeader
                          ? 'text-[#ffd700]'
                          : isPlayoff
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                      )}>
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base" aria-hidden="true">
                            {token?.emoji ?? '🏈'}
                          </span>
                          <span className={cn(
                            'font-bold text-sm',
                            isLeader ? 'text-[#ffd700]' : 'text-white'
                          )}>
                            {token?.displayName ?? row.manager}
                          </span>
                          {isLeader && isChamp && (
                            <span className="text-xs bg-[#ffd700] text-[#1a1a2e] font-black px-1.5 py-0.5 rounded-full">
                              CHAMP
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center font-black text-emerald-400">{row.wins}</td>
                      <td className="py-2.5 px-4 text-center font-black text-red-400">{row.losses}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-400 text-xs hidden sm:table-cell">
                        {(winPct * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-2 flex items-center gap-3 text-xs text-slate-500 border-t border-[#2d4a66]/40">
              <span className="flex items-center gap-1">
                <span className="text-emerald-400 font-bold">1–4</span> Playoff zone
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[#ffd700] font-bold">1</span> League leader
              </span>
            </div>
          </div>
        </section>

        {/* ── Next Week Preview ── */}
        {!isChamp && (
          <section aria-labelledby="preview-heading">
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <h2 id="preview-heading" className="text-sm font-black text-white uppercase tracking-widest">
                Next Week Preview
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.nextWeekPreview.map((matchup, i) => {
                const homeToken = getOwnerToken(matchup.home);
                const awayToken = getOwnerToken(matchup.away);
                const pickToken = getOwnerToken(matchup.bimflePick);
                return (
                  <div
                    key={i}
                    className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4"
                  >
                    {/* Teams */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xl">{homeToken?.emoji ?? '🏈'}</span>
                        <span className="text-xs font-bold text-white text-center">
                          {homeToken?.displayName ?? matchup.home}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-black px-2">vs</span>
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xl">{awayToken?.emoji ?? '🏈'}</span>
                        <span className="text-xs font-bold text-white text-center">
                          {awayToken?.displayName ?? matchup.away}
                        </span>
                      </div>
                    </div>

                    {/* Bimfle pick */}
                    <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Bimfle picks</p>
                      <p className="font-black text-[#ffd700] text-sm">
                        {pickToken?.emoji} {pickToken?.displayName ?? matchup.bimflePick}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{matchup.predictedScore}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Championship Closer ── */}
        {isChamp && (
          <section className="rounded-2xl bg-gradient-to-br from-[#ffd700]/12 via-[#16213e] to-[#0d1b2a] border border-[#ffd700]/40 p-8 text-center">
            <div className="text-5xl mb-4">👑</div>
            <h2 className="text-2xl font-black text-[#ffd700] mb-2">MLSchools12</h2>
            <p className="text-lg font-bold text-white mb-1">2025 BMFFFL Champion</p>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Back-to-back. 221.4 points in the title game. The dynasty is not a prophecy — it&apos;s a historical record.
            </p>
            <div className="mt-6 flex justify-center gap-6 flex-wrap">
              {OWNER_TOKENS.filter(t => ['mlschools12', 'tubes94', 'rbr', 'sexmachineandy'].includes(t.slug)).map(t => (
                <div key={t.slug} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-xs text-slate-400">{t.displayName}</span>
                  <span className="text-xs text-slate-500">
                    {t.slug === 'mlschools12' ? '🥇 Champion' :
                     t.slug === 'tubes94'     ? '🥈 Runner-Up' :
                     t.slug === 'rbr'         ? '3rd Place' : '4th Place'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
