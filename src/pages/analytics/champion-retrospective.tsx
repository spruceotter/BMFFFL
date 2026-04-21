import { useState } from 'react';
import Head from 'next/head';
import { Trophy, Crown, Star, Zap, Shield, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RosterPlayer {
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'SF';
  note: string;
  isElite?: boolean;
}

interface ChampionSeason {
  year: number;
  owner: string;
  teamName: string;
  seed: number;
  record: string;
  keyWeapon: string;
  qbSituation: string;
  howTheyWon: string;
  roster: RosterPlayer[];
  narrative: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  badge?: string;
}

// ─── Champion Data ────────────────────────────────────────────────────────────

const CHAMPIONS: ChampionSeason[] = [
  {
    year: 2020,
    owner: 'Cogdeill11',
    teamName: "Cogdeill's Squad",
    seed: 2,
    record: '11-3',
    keyWeapon: 'CMC — elite RB1 engine',
    qbSituation: 'Josh Allen (pre-superstar breakout)',
    howTheyWon: 'Wire-to-wire regular season dominance; CMC carried early, Allen delivered in playoffs',
    roster: [
      { name: 'Christian McCaffrey', position: 'RB', note: 'CMC in his prime — top-2 fantasy asset in the game', isElite: true },
      { name: 'Stefon Diggs', position: 'WR', note: 'First full Bills season, massive chemistry with Allen' },
      { name: 'DK Metcalf', position: 'WR', note: 'Explosive second-year breakout, big-play machine' },
      { name: 'Jonathan Taylor', position: 'RB', note: 'Rookie upside — held as stash, paid off immediately' },
      { name: 'Josh Allen', position: 'QB', note: 'Rushed for 9 TDs — dual-threat emerging superstar' },
      { name: 'Kyle Rudolph', position: 'TE', note: 'Reliable TE1 bridge piece' },
    ],
    narrative:
      "The inaugural BMFFFL champion built the blueprint every dynasty manager studies. Cogdeill11 won the startup draft by securing CMC as the cornerstone — a transcendent dual-threat RB who made every lineup decision easier. The masterstroke was holding Jonathan Taylor as a rookie stash despite pressure to sell; Taylor rewarded patience by contributing meaningfully down the stretch. Josh Allen's rushing upside was the X-factor that carried the squad through a competitive playoff bracket. This team set the gold standard for what a dynasty roster should look like: an elite RB1, two bonafide WR weapons, and a QB with scoring upside. The 2020 title is the foundation of what became the most decorated franchise in BMFFFL history — before the long, painful fall that followed.",
    accentColor: 'text-[#ffd700]',
    accentBg: 'bg-[#ffd700]/10',
    accentBorder: 'border-[#ffd700]/40',
  },
  {
    year: 2021,
    owner: 'MLSchools12',
    teamName: 'Schoolcraft Football Team',
    seed: 3,
    record: '11-3',
    keyWeapon: 'Cooper Kupp — historically dominant WR season',
    qbSituation: 'Justin Herbert (SF2 / streamer) — leveraged the superflex',
    howTheyWon: "Kupp's historically absurd year carried the team; Jonathan Taylor's RB1 breakout added a second gear",
    roster: [
      { name: 'Cooper Kupp', position: 'WR', note: 'Triple Crown receiver — 145 rec, 1,947 yds, 16 TDs. Historic.', isElite: true },
      { name: 'Davante Adams', position: 'WR', note: 'Pre-Raiders era, elite WR1 complementing Kupp' },
      { name: 'Jonathan Taylor', position: 'RB', note: 'Erupted for 1,811 rushing yards and 18 TDs — RB1 breakout', isElite: true },
      { name: 'Austin Ekeler', position: 'RB', note: 'PPR darling — pass-catching back locked in as RB2' },
      { name: 'Travis Kelce', position: 'TE', note: 'The usual — positional advantage over every TE in the league' },
      { name: 'Justin Herbert', position: 'SF', note: 'SF2 usage — Herbert emerging as a starter-grade fantasy option' },
    ],
    narrative:
      "The 2021 Schoolcraft Football Team had arguably the most dominant collection of talent in BMFFFL history at the time. Cooper Kupp entered one of the greatest individual seasons ever recorded in dynasty fantasy — a full Triple Crown performance that produced elite weekly scoring floors regardless of matchup. But this wasn't a one-man show. Jonathan Taylor broke out in historic fashion as a complementary RB1, Davante Adams provided WR2 production that would be WR1 elsewhere, and Travis Kelce gave MLSchools12 the positional advantage at TE every week. This was the first Sleeper-era ring for MLSchools12 — the second all-time, following an ESPN-era title in 2019. But looking at this roster, it almost feels like they should have won more. The blueprint: collect elite talent at WR, surround with a top RB, and ride the wave of a generational season.",
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-400/10',
    accentBorder: 'border-emerald-400/40',
    badge: 'First Sleeper-Era Ring',
  },
  {
    year: 2022,
    owner: 'Grandes',
    teamName: 'Grandes',
    seed: 4,
    record: '9-5',
    keyWeapon: 'Ja\'Marr Chase — elite WR1 as the offensive engine',
    qbSituation: 'Jalen Hurts SF1 — dual-threat rushing QB in superflex',
    howTheyWon: 'Playoff run overcame a below-average seed; Hurts rushing production was the tiebreaker in close games',
    roster: [
      { name: "Ja'Marr Chase", position: 'WR', note: 'WR1 coming off a Bengals Super Bowl run — elite ceiling weekly', isElite: true },
      { name: 'A.J. Brown', position: 'WR', note: 'Post-Eagles trade breakout — 1,496 yards and 11 TDs in Year 1 in Philly' },
      { name: 'Derrick Henry', position: 'RB', note: 'Bounce-back season after foot injury — over 1,500 rushing yards' },
      { name: 'Jalen Hurts', position: 'SF', note: 'SF1 cornerstone — 13 rushing TDs added to arm stats, monster value', isElite: true },
      { name: 'Mark Andrews', position: 'TE', note: 'Elite TE1 — 453 receiving yards and 5 TDs in a commanding campaign' },
    ],
    narrative:
      "Grandes entered 2022 playoffs as a 4-seed and nobody saw it coming. The roster was built on the principle of positional scarcity — Jalen Hurts as a SF1 gave a floor that most rosters couldn't match at the superflex slot, while Ja'Marr Chase and A.J. Brown formed one of the most feared WR duos in the field. Mark Andrews provided the weekly TE advantage. Derrick Henry's bounce-back season was the low-key X-factor nobody valued enough on the waiver wire. This championship is a testament to playoff sequencing and health — a roster that peaked at exactly the right moment. The 2022 title established Grandes as a legitimate dynasty contender, one of six different managers to claim a BMFFFL ring.",
    accentColor: 'text-purple-400',
    accentBg: 'bg-purple-400/10',
    accentBorder: 'border-purple-400/40',
  },
  {
    year: 2023,
    owner: 'JuicyBussy',
    teamName: 'Juicy Bussy',
    seed: 6,
    record: '7-7',
    keyWeapon: 'CMC + Justin Jefferson — two top-6 dynasty assets on one team',
    qbSituation: 'Patrick Mahomes — premium SF1 locked in year-round',
    howTheyWon: 'Lowest-seed Cinderella run — defeated #2, #3, and #4 seeds before the championship; CMC was unstoppable',
    roster: [
      { name: 'Christian McCaffrey', position: 'RB', note: 'CMC reborn in San Francisco — 21 total TDs, elite every week', isElite: true },
      { name: 'Justin Jefferson', position: 'WR', note: 'The best WR in fantasy football; elite floor and ceiling', isElite: true },
      { name: 'Tyreek Hill', position: 'WR', note: '1,799 yards with Tua — best WR on a per-game basis' },
      { name: 'Breece Hall', position: 'RB', note: 'Post-ACL return — recaptured his 2022 pre-injury form' },
      { name: 'Patrick Mahomes', position: 'SF', note: 'SF1 — three-time Super Bowl winner, automatic QB1 production' },
      { name: 'Sam LaPorta', position: 'TE', note: 'Rookie TE — most receiving yards by a rookie TE in NFL history' },
    ],
    narrative:
      "The 2023 JuicyBussy season is the single greatest Cinderella story in BMFFFL history. A 7-7 record secured the last playoff spot at the #6 seed — and then everything changed. CMC went supernova in the San Francisco offense, Justin Jefferson was a weekly locked-in WR1, and Tyreek Hill added a second WR weapon that no defensive roster could fully neutralize. Patrick Mahomes as SF1 meant JuicyBussy never had a bad QB week. Sam LaPorta, a rookie TE, shattered records and provided weekly production no one expected from that slot. The playoff run dismantled the #2, #3, and #4 seeds consecutively before the championship. This team didn't just win — it proved that dynasty is about having the right pieces at peak performance, not about finishing first in the regular season. The most celebrated championship in BMFFFL lore.",
    accentColor: 'text-[#e94560]',
    accentBg: 'bg-[#e94560]/10',
    accentBorder: 'border-[#e94560]/40',
    badge: '#6 Seed Cinderella',
  },
  {
    year: 2024,
    owner: 'MLSchools12',
    teamName: 'Schoolcraft Football Team',
    seed: 3,
    record: '10-4',
    keyWeapon: 'CeeDee Lamb — WR1 locked in for a historic 135-catch season',
    qbSituation: 'Lamar Jackson — unanimous MVP, SF1 destroyer of matchups',
    howTheyWon: 'Won as 3-seed through a deep playoff run; CeeDee Lamb and Lamar Jackson elevated every matchup',
    roster: [
      { name: 'CeeDee Lamb', position: 'WR', note: '135 rec, 1,749 yds — best WR season since Kupp 2021', isElite: true },
      { name: "Ja'Marr Chase", position: 'WR', note: 'Continued elite WR1 production; dual-WR1 pairing', isElite: true },
      { name: 'Bijan Robinson', position: 'RB', note: 'Sophomore explosion — near-workhorse role in Atlanta' },
      { name: 'Lamar Jackson', position: 'SF', note: 'Unanimous MVP — 2,600 rush yards and 4,400 passing; historic SF1', isElite: true },
      { name: 'Sam LaPorta', position: 'TE', note: 'Year 2 TE — continued growth as a weekly starter' },
      { name: 'Kyren Williams', position: 'RB', note: 'LA Rams bellcow — 12 rushing TDs backed up the RB corps' },
    ],
    narrative:
      "The 2024 Schoolcraft Football Team assembled a complete dynasty roster and ran through the playoff bracket as a 3-seed. CeeDee Lamb operated as a locked-in WR1 with one of the finest WR seasons in dynasty history, and Ja'Marr Chase gave the team an unreal WR1-WR1 tandem. Lamar Jackson's unanimous MVP campaign meant the superflex position was a weekly 30-35 point floor. Bijan Robinson emerged as a true RB1, Kyren Williams added TD upside, and Sam LaPorta's year two development held the TE slot. This was the third all-time championship for MLSchools12 — cementing their legacy as the most decorated franchise in BMFFFL history, with rings spanning the ESPN era (2019) and the Sleeper era (2021, 2024).",
    accentColor: 'text-[#ffd700]',
    accentBg: 'bg-[#ffd700]/10',
    accentBorder: 'border-[#ffd700]/40',
    badge: '3rd All-Time Championship',
  },
  {
    year: 2025,
    owner: 'tdtd19844',
    teamName: 'THE Shameful Saggy Sack',
    seed: 4,
    record: '8-6',
    keyWeapon: 'Brock Bowers — TE1 redefining the position at only Year 2',
    qbSituation: 'Jalen Hurts — dual-threat floor with SF1 rushing upside',
    howTheyWon: 'Health and peaking at the right time; Puka and Collins gave weekly WR reliability; Bowers was unguardable at TE',
    roster: [
      { name: 'Puka Nacua', position: 'WR', note: 'Second-year Rams WR — elite PPR target share locked in' },
      { name: 'Nico Collins', position: 'WR', note: 'Texans WR1 breakout — topped 1,000 yards in a legit step forward' },
      { name: 'Josh Jacobs', position: 'RB', note: 'Green Bay bellcow — PPR value maximized with pass-catching role' },
      { name: 'Jalen Hurts', position: 'SF', note: 'Dual-threat SF1 — rushing floor elevated every matchup' },
      { name: 'Brock Bowers', position: 'TE', note: 'Historically dominant TE — rewriting rookie records, elite ceiling', isElite: true },
      { name: 'Travis Etienne', position: 'RB', note: 'Jacksonville workhorse — provided volume-based RB production' },
    ],
    narrative:
      "The 2025 title brought a new name to the championship register. tdtd19844 entered as a 4-seed — the second consecutive year a non-top-3 seed won the title — and rode exceptional health and timely production to the ring. Brock Bowers was the dynasty asset of the year: a Year-2 tight end who was essentially unguardable and put up weekly TE1-plus numbers that no other roster could match at the position. Jalen Hurts provided the dual-threat SF1 floor that won games in tight matchups. Puka Nacua and Nico Collins formed a reliable mid-tier WR pairing that outperformed expectations in the playoffs, while Josh Jacobs and Travis Etienne gave the team bellcow RB production. This championship validated the patient rebuild arc — tdtd19844 had been a non-factor in early seasons before assembling this title-winning core through smart drafting and waiver work.",
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-400/10',
    accentBorder: 'border-cyan-400/40',
  },
];

// ─── Position Badge ────────────────────────────────────────────────────────────

const POSITION_STYLES: Record<RosterPlayer['position'], string> = {
  QB: 'bg-red-500/20 border-red-500/40 text-red-400',
  RB: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  WR: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  TE: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  SF: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
};

function PositionBadge({ position }: { position: RosterPlayer['position'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-black border shrink-0',
        POSITION_STYLES[position]
      )}
      aria-label={position === 'SF' ? 'Superflex' : position}
    >
      {position}
    </span>
  );
}

// ─── Timeline Bar ─────────────────────────────────────────────────────────────

interface TimelineBarProps {
  activeYear: number | null;
  onSelectYear: (year: number | null) => void;
}

function TimelineBar({ activeYear, onSelectYear }: TimelineBarProps) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-4">
        Championship Timeline &mdash; Click to jump
      </p>
      <div className="relative">
        {/* Connector line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-[#2d4a66]" aria-hidden="true" />

        <div className="relative flex items-start justify-between gap-2">
          {CHAMPIONS.map((champ, idx) => {
            const isActive = activeYear === champ.year;
            const isFirst = idx === 0;
            const isLast = idx === CHAMPIONS.length - 1;

            return (
              <button
                key={champ.year}
                onClick={() => {
                  onSelectYear(isActive ? null : champ.year);
                  if (!isActive) {
                    const el = document.getElementById(`champion-${champ.year}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={cn(
                  'flex flex-col items-center gap-2 group relative transition-all duration-200',
                  isFirst ? 'items-start' : isLast ? 'items-end' : 'items-center'
                )}
                aria-pressed={isActive}
                aria-label={`${champ.year} champion: ${champ.owner}`}
              >
                {/* Badge dot */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                    isActive
                      ? cn('border-current scale-110 shadow-lg', champ.accentColor, champ.accentBg, champ.accentBorder)
                      : 'border-[#2d4a66] bg-[#0d1b2a] text-slate-600 group-hover:border-slate-400 group-hover:text-slate-300'
                  )}
                >
                  <Crown
                    className={cn('w-4 h-4', isActive ? champ.accentColor : 'text-current')}
                    aria-hidden="true"
                  />
                </div>

                {/* Year label */}
                <span
                  className={cn(
                    'text-xs font-black tabular-nums transition-colors duration-200',
                    isActive ? champ.accentColor : 'text-slate-500 group-hover:text-slate-300'
                  )}
                >
                  {champ.year}
                </span>

                {/* Owner label */}
                <span
                  className={cn(
                    'text-[10px] font-semibold leading-tight text-center max-w-[64px] transition-colors duration-200',
                    isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'
                  )}
                >
                  {champ.owner}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

interface ChampionStatsRowProps {
  champ: ChampionSeason;
}

function ChampionStatsRow({ champ }: ChampionStatsRowProps) {
  const stats = [
    {
      label: 'Key Weapon',
      value: champ.keyWeapon,
      icon: Zap,
      color: 'text-[#ffd700]',
    },
    {
      label: 'QB Situation',
      value: champ.qbSituation,
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      label: 'How They Won',
      value: champ.howTheyWon,
      icon: Trophy,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-4 py-3"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className={cn('w-3.5 h-3.5 shrink-0', stat.color)} aria-hidden="true" />
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {stat.label}
              </p>
            </div>
            <p className="text-xs text-slate-200 leading-snug font-medium">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Champion Card ─────────────────────────────────────────────────────────────

interface ChampionCardProps {
  champ: ChampionSeason;
  isHighlighted: boolean;
}

function ChampionCard({ champ, isHighlighted }: ChampionCardProps) {
  const [narrativeOpen, setNarrativeOpen] = useState(false);

  const isLowSeed = champ.seed >= 4;
  const isMultiChamp = champ.owner === 'MLSchools12';

  return (
    <article
      id={`champion-${champ.year}`}
      className={cn(
        'rounded-xl border overflow-hidden transition-all duration-300',
        isHighlighted
          ? cn('border-2', champ.accentBorder, 'shadow-lg')
          : 'border-[#2d4a66]'
      )}
      aria-label={`${champ.year} champion: ${champ.owner}`}
    >
      {/* Card header */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-5 border-b border-[#2d4a66]',
          champ.accentBg
        )}
      >
        {/* Year badge + trophy */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex items-center justify-center w-16 h-16 rounded-xl border-2 shrink-0',
              champ.accentBorder,
              champ.accentBg
            )}
          >
            <Trophy className={cn('w-7 h-7', champ.accentColor)} aria-hidden="true" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={cn(
                  'text-4xl font-black tabular-nums leading-none',
                  champ.accentColor
                )}
              >
                {champ.year}
              </span>

              {/* Special badges */}
              {champ.badge && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
                    champ.accentBorder,
                    champ.accentBg,
                    champ.accentColor
                  )}
                >
                  {isLowSeed && <Star className="w-3 h-3" aria-hidden="true" />}
                  {isMultiChamp && <Crown className="w-3 h-3" aria-hidden="true" />}
                  {champ.badge}
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-white leading-tight">{champ.owner}</h2>
            <p className="text-sm text-slate-400 font-medium">{champ.teamName}</p>
          </div>
        </div>

        {/* Seed + record */}
        <div className="sm:ml-auto flex gap-4 sm:gap-6 text-center">
          <div>
            <p
              className={cn(
                'text-2xl font-black tabular-nums leading-none',
                isLowSeed ? 'text-[#e94560]' : 'text-white'
              )}
            >
              #{champ.seed}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
              Playoff Seed
            </p>
          </div>
          <div className="w-px bg-[#2d4a66]" aria-hidden="true" />
          <div>
            <p className="text-2xl font-black tabular-nums leading-none text-white font-mono">
              {champ.record}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
              Reg. Season
            </p>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-[#16213e] divide-y divide-[#1e3347]">

        {/* Stats row */}
        <div className="px-5 py-4">
          <ChampionStatsRow champ={champ} />
        </div>

        {/* Roster list */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Championship Roster Highlights
            </p>
          </div>
          <ul className="space-y-2" aria-label={`${champ.year} championship roster`}>
            {champ.roster.map((player) => (
              <li
                key={player.name}
                className={cn(
                  'flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors duration-100',
                  player.isElite
                    ? cn('border border-current/20', champ.accentBg, champ.accentBorder)
                    : 'border-[#2d4a66] bg-[#0d1b2a]'
                )}
              >
                <PositionBadge position={player.position} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        'text-sm font-bold leading-tight',
                        player.isElite ? 'text-white' : 'text-slate-200'
                      )}
                    >
                      {player.name}
                    </span>
                    {player.isElite && (
                      <Star
                        className={cn('w-3 h-3 shrink-0', champ.accentColor)}
                        aria-label="Elite player"
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{player.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Narrative (collapsible) */}
        <div className="px-5 py-4">
          <button
            onClick={() => setNarrativeOpen((v) => !v)}
            className="flex items-center justify-between w-full group"
            aria-expanded={narrativeOpen}
            aria-controls={`narrative-${champ.year}`}
          >
            <div className="flex items-center gap-2">
              <Award className={cn('w-3.5 h-3.5', champ.accentColor)} aria-hidden="true" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold group-hover:text-slate-300 transition-colors">
                Championship Story
              </span>
            </div>
            {narrativeOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" aria-hidden="true" />
            )}
          </button>

          {narrativeOpen && (
            <div id={`narrative-${champ.year}`} className="mt-3">
              <p className="text-sm text-slate-300 leading-relaxed">{champ.narrative}</p>
            </div>
          )}
        </div>

      </div>
    </article>
  );
}

// ─── League Summary Banner ─────────────────────────────────────────────────────

function LeagueSummary() {
  const summaryStats = [
    { label: 'Seasons', value: '6', sub: '2020 – 2025', color: 'text-[#ffd700]' },
    { label: 'Unique Champions', value: '5', sub: '5 different owners', color: 'text-emerald-400' },
    { label: 'Cinderella Win', value: '#6', sub: 'JuicyBussy 2023', color: 'text-[#e94560]' },
    { label: 'Repeat Champ', value: '2×', sub: 'MLSchools12 only', color: 'text-[#ffd700]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {summaryStats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center"
        >
          <p className={cn('text-3xl font-black tabular-nums leading-none', s.color)}>{s.value}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{s.sub}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type FilterOption = 'All' | 'Cinderella' | 'Wire-to-Wire' | 'MLSchools12';

const FILTER_OPTIONS: FilterOption[] = ['All', 'Cinderella', 'Wire-to-Wire', 'MLSchools12'];

function passesFilter(champ: ChampionSeason, filter: FilterOption): boolean {
  if (filter === 'All') return true;
  if (filter === 'Cinderella') return champ.seed >= 4;
  if (filter === 'Wire-to-Wire') return champ.seed <= 2;
  if (filter === 'MLSchools12') return champ.owner === 'MLSchools12';
  return true;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChampionRetrospectivePage() {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const visibleChampions = CHAMPIONS.filter((c) => passesFilter(c, activeFilter));

  return (
    <>
      <Head>
        <title>Champion Retrospective — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL champion retrospective — every championship roster, key weapons, winning narratives, and dynasty analysis across all 6 seasons (2020–2025)."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Crown className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Champion Retrospective
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Every BMFFFL title — the rosters that won, the players who delivered,
            and the dynasty decisions that made it happen. Six Sleeper seasons. Five distinct champions. No back-to-back winners — yet.
          </p>
        </header>

        {/* ── League Summary ───────────────────────────────────────────────── */}
        <section className="mb-8" aria-label="League championship summary">
          <LeagueSummary />
        </section>

        {/* ── Timeline Bar ────────────────────────────────────────────────── */}
        <section className="mb-8" aria-label="Championship timeline">
          <TimelineBar activeYear={activeYear} onSelectYear={setActiveYear} />
        </section>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <section className="mb-8" aria-label="Filter championships">
          <div className="flex flex-wrap gap-2 items-center">
            <p className="w-full text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Filter by championship type
            </p>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border',
                  activeFilter === opt
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
                aria-pressed={activeFilter === opt}
              >
                {opt}
                {opt === 'Cinderella' && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#e94560]/20 text-[#e94560] text-[9px] font-black border border-[#e94560]/30">
                    {CHAMPIONS.filter((c) => c.seed >= 4).length}
                  </span>
                )}
                {opt === 'MLSchools12' && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#ffd700]/20 text-[#ffd700] text-[9px] font-black border border-[#ffd700]/30">
                    2
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── Champion Cards ───────────────────────────────────────────────── */}
        <section aria-label="Championship season cards">
          {visibleChampions.length === 0 ? (
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-12 text-center">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-400 font-semibold">No seasons match this filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleChampions.map((champ) => (
                <ChampionCard
                  key={champ.year}
                  champ={champ}
                  isHighlighted={activeYear === champ.year}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── MLSchools12 Legacy Callout ───────────────────────────────────── */}
        {(activeFilter === 'All' || activeFilter === 'MLSchools12') && (
          <section
            className="mt-10 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-5 py-6"
            aria-label="MLSchools12 dynasty legacy"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/10 shrink-0">
                <Crown className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#ffd700] mb-1">
                  The Dynasty: MLSchools12
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  MLSchools12 is the most decorated franchise in BMFFFL history — three all-time championships
                  spanning the ESPN era (2019) and Sleeper era (2021, 2024). Across the Sleeper era the Schoolcraft
                  Football Team has never posted a losing regular-season record, holds the all-time best career win
                  percentage at{' '}
                  <span className="text-white font-bold">.819 (68-15)</span>, and made the playoffs every single
                  year. The 2025 regular season record of{' '}
                  <span className="text-white font-bold">13-1</span> — the best single-season record in league
                  history — set up a playoff run that fell just short of a fourth ring.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── JuicyBussy Cinderella Callout ────────────────────────────────── */}
        {(activeFilter === 'All' || activeFilter === 'Cinderella') && (
          <section
            className="mt-6 rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 px-5 py-6"
            aria-label="JuicyBussy 2023 Cinderella story"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl border border-[#e94560]/30 bg-[#e94560]/10 shrink-0">
                <Star className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#e94560] mb-1">
                  Greatest Cinderella Run: JuicyBussy 2023
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  No championship in BMFFFL history is more celebrated than JuicyBussy's 2023 run as
                  the <span className="text-white font-bold">#6 seed</span>. A 7-7 regular season
                  record barely squeaked into the field — and then CMC, Justin Jefferson, Tyreek Hill, and
                  Patrick Mahomes went on a tear. The #2, #3, and #4 seeds all fell in sequence. It remains
                  the only time a 6-seed has won a championship in league history, and it probably won't
                  happen again.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Footer Note ─────────────────────────────────────────────────── */}
        <div className="mt-10 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Data note:</span>{' '}
            Roster data reflects verified dynasty holdings at time of championship. Player notes reflect
            that season's production. Star icons denote tier-1 dynasty assets. All records through the 2025 season.
            Full Sleeper API integration (Phase G) will surface live dynasty values alongside historical data.
          </p>
        </div>

      </div>
    </>
  );
}
