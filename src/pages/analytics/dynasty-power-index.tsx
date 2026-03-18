import Head from 'next/head';
import { BarChart2, Bot, Award } from 'lucide-react';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Tooltip from '@/components/ui/Tooltip';
import ShareButton from '@/components/ui/ShareButton';

// ─── Types ────────────────────────────────────────────────────────────────────

type DpiTier = 'Elite' | 'Contender' | 'Middling' | 'Rebuilding';

interface DpiTeam {
  rank: number;
  owner: string;
  teamName: string;
  dpi: number;
  tier: DpiTier;
  /** Roster quality score — 40% weight */
  rosterScore: number;
  /** Recent momentum score — 30% weight */
  momentumScore: number;
  /** Draft capital score — 20% weight */
  draftCapitalScore: number;
  /** Age / upside score — 10% weight */
  ageUpsideScore: number;
  note: string;
  record: string;
  championships: number;
  playoffApps: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DPI_TEAMS: DpiTeam[] = [
  {
    rank: 1,
    owner: 'MLSchools12',
    teamName: 'The Murder Boners',
    dpi: 94.2,
    tier: 'Elite',
    rosterScore: 97,
    momentumScore: 95,
    draftCapitalScore: 88,
    ageUpsideScore: 91,
    note: 'Two-time champion with elite roster depth and unmatched all-time win percentage. The benchmark every team is measured against.',
    record: '68–15',
    championships: 2,
    playoffApps: 6,
  },
  {
    rank: 2,
    owner: 'Tubes94',
    teamName: 'Whale Tails',
    dpi: 78.6,
    tier: 'Contender',
    rosterScore: 80,
    momentumScore: 88,
    draftCapitalScore: 78,
    ageUpsideScore: 96,
    note: '2025 runner-up with arguably the youngest RB core in the league. Bijan Robinson and Breece Hall entering their dynasty prime simultaneously.',
    record: '34–36',
    championships: 0,
    playoffApps: 2,
  },
  {
    rank: 3,
    owner: 'SexMachineAndyD',
    teamName: 'SexMachineAndyD',
    dpi: 76.1,
    tier: 'Contender',
    rosterScore: 82,
    momentumScore: 80,
    draftCapitalScore: 72,
    ageUpsideScore: 78,
    note: 'Four playoff appearances and a 2024 runner-up finish. Consistent elite contention without a ring — the perpetual threat.',
    record: '50–33',
    championships: 0,
    playoffApps: 4,
  },
  {
    rank: 4,
    owner: 'JuicyBussy',
    teamName: 'Juicy Bussy',
    dpi: 71.4,
    tier: 'Contender',
    rosterScore: 75,
    momentumScore: 72,
    draftCapitalScore: 65,
    ageUpsideScore: 88,
    note: 'Reigning 2023 champion and holder of the highest single-week score in league history. Explosive ceiling masked by roster volatility.',
    record: '46–37',
    championships: 1,
    playoffApps: 5,
  },
  {
    rank: 5,
    owner: 'tdtd19844',
    teamName: '14kids0wins / teammoodie',
    dpi: 69.8,
    tier: 'Contender',
    rosterScore: 68,
    momentumScore: 85,
    draftCapitalScore: 73,
    ageUpsideScore: 82,
    note: 'Dramatic rebuild culminating in the 2025 championship. The arc from basement to champion is the league\'s defining story. Trajectory is the point.',
    record: '36–47',
    championships: 1,
    playoffApps: 3,
  },
  {
    rank: 6,
    owner: 'rbr',
    teamName: 'Really Big Rings',
    dpi: 67.3,
    tier: 'Contender',
    rosterScore: 70,
    momentumScore: 65,
    draftCapitalScore: 68,
    ageUpsideScore: 62,
    note: 'Two-time runner-up from the league\'s early years. Perennial contender with an aging core entering a pivotal decision window.',
    record: '44–39',
    championships: 0,
    playoffApps: 4,
  },
  {
    rank: 7,
    owner: 'eldridm20',
    teamName: 'Franks Little Beauties',
    dpi: 58.9,
    tier: 'Middling',
    rosterScore: 60,
    momentumScore: 58,
    draftCapitalScore: 62,
    ageUpsideScore: 58,
    note: '2023 runner-up finisher. Playoff-dangerous when healthy but inconsistent regular-season performance makes them a perennial wild card.',
    record: '39–44',
    championships: 0,
    playoffApps: 3,
  },
  {
    rank: 8,
    owner: 'Cmaleski',
    teamName: 'Showtyme Boyz',
    dpi: 55.2,
    tier: 'Middling',
    rosterScore: 58,
    momentumScore: 52,
    draftCapitalScore: 55,
    ageUpsideScore: 70,
    note: '1,990 points in 2025 — second-highest scoring season in BMFFFL history — despite a 6–8 record. Chronically undervalued by win totals alone.',
    record: '36–47',
    championships: 0,
    playoffApps: 2,
  },
  {
    rank: 9,
    owner: 'eldridsm',
    teamName: 'eldridsm',
    dpi: 52.7,
    tier: 'Middling',
    rosterScore: 54,
    momentumScore: 48,
    draftCapitalScore: 55,
    ageUpsideScore: 56,
    note: '2020 runner-up who has drifted from early contention. Still holds legitimate roster pieces but the momentum that defined their 2020 peak has waned.',
    record: '41–42',
    championships: 0,
    playoffApps: 3,
  },
  {
    rank: 10,
    owner: 'Grandes',
    teamName: 'El Rioux Grandes',
    dpi: 44.1,
    tier: 'Rebuilding',
    rosterScore: 45,
    momentumScore: 35,
    draftCapitalScore: 58,
    ageUpsideScore: 48,
    note: '2022 champion and league Commissioner. The fall from champion to 2025 Moodie Bowl champion is the steepest single-season reversal in BMFFFL history.',
    record: '42–41',
    championships: 1,
    playoffApps: 3,
  },
  {
    rank: 11,
    owner: 'Cogdeill11',
    teamName: 'Cogdeill11',
    dpi: 38.6,
    tier: 'Rebuilding',
    rosterScore: 38,
    momentumScore: 28,
    draftCapitalScore: 52,
    ageUpsideScore: 44,
    note: 'Founding league champion (2020) who has not returned to the playoffs since 2021. Holds young assets in Ja\'Marr Chase and Omarion Hampton — a rebuild worth watching.',
    record: '38–45',
    championships: 1,
    playoffApps: 2,
  },
  {
    rank: 12,
    owner: 'Escuelas',
    teamName: 'Booty Cheeks',
    dpi: 29.4,
    tier: 'Rebuilding',
    rosterScore: 28,
    momentumScore: 22,
    draftCapitalScore: 42,
    ageUpsideScore: 38,
    note: 'Zero playoff appearances since joining in 2022. The deep rebuild is the most honest path forward. Draft capital and patience are the only currencies that matter here.',
    record: '15–41',
    championships: 0,
    playoffApps: 0,
  },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<DpiTier, {
  label: string;
  range: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
  scoreColor: string;
}> = {
  Elite: {
    label: 'Elite',
    range: '85+',
    borderColor: 'border-[#ffd700]/40',
    bgColor: 'bg-[#ffd700]/5',
    badgeBg: 'bg-[#ffd700]/15',
    badgeText: 'text-[#ffd700]',
    badgeBorder: 'border-[#ffd700]/30',
    barColor: '#ffd700',
    scoreColor: 'text-[#ffd700]',
  },
  Contender: {
    label: 'Contender',
    range: '65–84',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    barColor: '#34d399',
    scoreColor: 'text-emerald-400',
  },
  Middling: {
    label: 'Middling',
    range: '45–64',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/30',
    barColor: '#60a5fa',
    scoreColor: 'text-blue-400',
  },
  Rebuilding: {
    label: 'Rebuilding',
    range: '<45',
    borderColor: 'border-slate-500/30',
    bgColor: 'bg-slate-500/5',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-500/30',
    barColor: '#94a3b8',
    scoreColor: 'text-slate-400',
  },
};

const RANK_MEDAL: Record<number, { label: string; className: string }> = {
  1: { label: 'Gold',   className: 'text-[#ffd700] font-black' },
  2: { label: 'Silver', className: 'text-slate-300 font-black' },
  3: { label: 'Bronze', className: 'text-amber-600 font-black' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: DpiTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
      cfg.badgeBg, cfg.badgeText, cfg.badgeBorder
    )}>
      {cfg.label}
    </span>
  );
}

function DpiBar({ dpi, tier }: { dpi: number; tier: DpiTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-[#0d1b2a] overflow-hidden border border-[#2d4a66]/30">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${dpi}%`, backgroundColor: cfg.barColor }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function ComponentBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden border border-[#2d4a66]/20">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
        aria-hidden="true"
      />
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const medal = RANK_MEDAL[rank];
  return (
    <span className={cn('font-mono tabular-nums text-sm', medal ? medal.className : 'text-slate-500 font-semibold')}>
      #{rank}
    </span>
  );
}

// ─── Formula Explanation ──────────────────────────────────────────────────────

const FORMULA_COMPONENTS = [
  {
    weight: '40%',
    label: 'Current Roster Quality',
    description: 'Measured against known dynasty player values and all-time win history. Rewards deep rosters anchored by elite dynasty assets.',
    color: '#ffd700',
    borderColor: 'border-[#ffd700]/20',
    bgColor: 'bg-[#ffd700]/5',
  },
  {
    weight: '30%',
    label: 'Recent Performance Momentum',
    description: 'Wins in the last two seasons compared to league average. Recent form is the strongest forward-looking predictor of contention.',
    color: '#34d399',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
  },
  {
    weight: '20%',
    label: 'Draft Capital & Future Assets',
    description: 'Picks held plus rookie potential. Teams that invest in future capital are building sustainable dynasties rather than short-term windows.',
    color: '#60a5fa',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
  },
  {
    weight: '10%',
    label: 'Age / Upside Factor',
    description: 'How young the core roster is and the ceiling that age projection implies. Young rosters trade present contention for long-term dominance.',
    color: '#c084fc',
    borderColor: 'border-purple-500/20',
    bgColor: 'bg-purple-500/5',
  },
];

// ─── Tier Section ─────────────────────────────────────────────────────────────

function TierSection({ tier, teams }: { tier: DpiTier; teams: DpiTeam[] }) {
  if (teams.length === 0) return null;
  const cfg = TIER_CONFIG[tier];

  return (
    <section aria-label={`${cfg.label} tier teams`} className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('h-px flex-1', `bg-gradient-to-r from-transparent`, `to-transparent`)} />
        <span className={cn(
          'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border',
          cfg.badgeBg, cfg.badgeText, cfg.badgeBorder
        )}>
          <span>{cfg.label}</span>
          <span className="opacity-60">{cfg.range}</span>
        </span>
        <div className="h-px flex-1 bg-[#2d4a66]/50" />
      </div>

      <div className="space-y-3">
        {teams.map(team => (
          <div
            key={team.owner}
            className={cn(
              'rounded-xl border p-4 sm:p-5 transition-colors duration-100',
              cfg.borderColor, cfg.bgColor
            )}
          >
            {/* Top row: rank + names + dpi score */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3">
              {/* Rank */}
              <div className="shrink-0 w-8 text-center pt-0.5">
                <RankBadge rank={team.rank} />
              </div>

              {/* Team info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white leading-tight truncate">
                      {team.teamName !== team.owner ? team.teamName : team.owner}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {team.owner}
                      {team.teamName !== team.owner && (
                        <span className="ml-1 text-slate-600">· {team.record}</span>
                      )}
                      {team.teamName === team.owner && (
                        <span className="ml-1 text-slate-600">· {team.record}</span>
                      )}
                    </p>
                  </div>

                  {/* DPI score */}
                  <div className="shrink-0 text-right">
                    <Tooltip tip="Dynasty Power Index combines regular season wins (40%), playoff success (30%), total points scored (20%), and championship wins (10%)">
                      <span className={cn('text-3xl font-black tabular-nums leading-none', cfg.scoreColor)}>
                        {team.dpi.toFixed(1)}
                      </span>
                    </Tooltip>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-0.5">DPI</p>
                  </div>
                </div>

                {/* DPI bar */}
                <div className="mt-2 mb-3">
                  <DpiBar dpi={team.dpi} tier={team.tier} />
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <TierBadge tier={team.tier} />
                  {team.championships > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/25">
                      <Award className="w-3 h-3" aria-hidden="true" />
                      {team.championships}x Champ
                    </span>
                  )}
                  <span className="text-[10px] text-slate-600 font-mono">
                    {team.playoffApps} playoff app{team.playoffApps !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Note */}
                <p className="text-xs text-slate-400 leading-relaxed">{team.note}</p>
              </div>
            </div>

            {/* Component breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#2d4a66]/30">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">Roster</span>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{team.rosterScore}</span>
                </div>
                <ComponentBar value={team.rosterScore} color="#ffd700" />
                <p className="text-[10px] text-slate-600 mt-0.5">40% wt.</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">Momentum</span>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{team.momentumScore}</span>
                </div>
                <ComponentBar value={team.momentumScore} color="#34d399" />
                <p className="text-[10px] text-slate-600 mt-0.5">30% wt.</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">Draft Cap.</span>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{team.draftCapitalScore}</span>
                </div>
                <ComponentBar value={team.draftCapitalScore} color="#60a5fa" />
                <p className="text-[10px] text-slate-600 mt-0.5">20% wt.</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">Age/Upside</span>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{team.ageUpsideScore}</span>
                </div>
                <ComponentBar value={team.ageUpsideScore} color="#c084fc" />
                <p className="text-[10px] text-slate-600 mt-0.5">10% wt.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DynastyPowerIndexPage() {
  const tiers: DpiTier[] = ['Elite', 'Contender', 'Middling', 'Rebuilding'];
  const teamsByTier = (tier: DpiTier) => DPI_TEAMS.filter(t => t.tier === tier);

  return (
    <>
      <Head>
        <title>Dynasty Power Index — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Bimfle's Dynasty Power Index (DPI): a composite metric ranking all 12 BMFFFL teams by long-term dynasty strength. Combines roster quality, momentum, draft capital, and age upside."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Dynasty Power Index' },
        ]} />

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Power Index
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-slate-400 text-lg max-w-2xl">
              Bimfle&rsquo;s composite ranking of long-term dynasty strength
            </p>
            <ShareButton />
          </div>
        </header>

        {/* Formula explanation */}
        <section className="mb-10" aria-labelledby="formula-heading">
          <h2 id="formula-heading" className="text-lg font-bold text-white mb-1">
            How the DPI is Calculated
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Four weighted components combine to produce each team&rsquo;s Dynasty Power Index score (0–100 scale).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FORMULA_COMPONENTS.map(comp => (
              <div
                key={comp.label}
                className={cn('rounded-xl border p-4', comp.borderColor, comp.bgColor)}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-2xl font-black tabular-nums"
                    style={{ color: comp.color }}
                  >
                    {comp.weight}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: comp.color }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-tight">{comp.label}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">{comp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Summary stats */}
        <section className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="DPI summary statistics">
          {tiers.map(tier => {
            const count = teamsByTier(tier).length;
            const cfg = TIER_CONFIG[tier];
            return (
              <div
                key={tier}
                className={cn('rounded-lg border px-4 py-3 text-center', cfg.borderColor, cfg.bgColor)}
              >
                <p className={cn('text-2xl font-black tabular-nums', cfg.scoreColor)}>{count}</p>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider mt-0.5', cfg.badgeText)}>
                  {cfg.label}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">{cfg.range}</p>
              </div>
            );
          })}
        </section>

        {/* Ranked leaderboard by tier */}
        <div>
          {tiers.map(tier => (
            <TierSection key={tier} tier={tier} teams={teamsByTier(tier)} />
          ))}
        </div>

        {/* Bimfle commentary */}
        <section className="mt-10 mb-8" aria-label="Commentary from Bimfle">
          <div className="rounded-xl border border-[#ffd700]/40 bg-[#16213e] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-[#ffd700] font-bold text-sm">Bimfle</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/60 border border-[#ffd700]/30 rounded px-1.5 py-0.5">
                    AI Commissioner Assistant
                  </span>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                  <p>
                    I have conducted a thorough examination of the dynasty landscape as it stands in this,
                    the year of our league 2026, and I present the following observations with the gravity
                    they most assuredly deserve.
                  </p>
                  <p>
                    MLSchools12 occupies the summit with a DPI of 94.2 — a figure that is, frankly, an
                    affront to competitive balance. Two championships, sixty-eight all-time wins, and a
                    roster of sufficient depth to sustain contention through the middle of the next decade.
                    I have noted this with both professional admiration and a personal sigh.
                  </p>
                  <p>
                    The ascent of tdtd19844 from the basement to reigning champion is the most compelling
                    narrative this league has produced. Their DPI of 69.8 reflects a team in motion —
                    the championship was not an aberration but the culmination of a deliberate rebuild.
                    I commend the patience displayed. I commend it sincerely.
                  </p>
                  <p>
                    Conversely, I must note with the appropriate degree of institutional solemnity that
                    the Commissioner himself — Grandes — has achieved a DPI of 44.1 following the 2025
                    Moodie Bowl. I am required, by my own internal protocols, to document this. The
                    Commissioner has been informed. The Commissioner is, I am told, aware.
                  </p>
                  <p>
                    Escuelas sits at 29.4 — the dynasty equivalent of a firm handshake and a hopeful
                    expression. Zero playoff appearances is a number that speaks with great clarity.
                    Draft capital, patience, and an unsentimental willingness to acquire youth are the
                    prescribed remedies. I recommend all three.
                  </p>
                  <p className="text-slate-400 italic">
                    ~Love, Bimfle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Methodology note:</span>{' '}
            The Dynasty Power Index is a composite metric (0–100 scale) designed by Bimfle. Component scores
            are derived from roster values, historical performance data, and qualitative dynasty assessment.
            DPI is not affiliated with any external ranking service and represents the internal BMFFFL dynasty
            analytical framework as of March 2026.{' '}
            <span className="text-slate-600">Last updated: March 2026.</span>
          </p>
        </div>

      </div>
    </>
  );
}
