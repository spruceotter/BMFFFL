import { useState, useMemo } from 'react';
import Head from 'next/head';
import { cn } from '@/lib/cn';
import { OWNER_TOKENS } from '@/lib/owner-tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type Verdict = 'PROMOTE' | 'HOLD' | 'CUT';
type VerdictFilter = 'ALL' | Verdict;
type TeamFilter = 'ALL' | string;

interface TaxiPlayer {
  name: string;
  pos: Position;
  nflTeam: string;
  year: 'R' | 'Y2';
  verdict: Verdict;
  reason: string;
}

interface TeamTaxi {
  ownerSlug: string;
  players: TaxiPlayer[];
}

type GradTier = 1 | 2 | 3;

interface GradPlayer {
  name: string;
  pos: Position;
  tier: GradTier;
  note: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TAXI_SQUADS: TeamTaxi[] = [
  {
    ownerSlug: 'mlschools12',
    players: [
      {
        name: 'Quinshon Judkins',
        pos: 'RB',
        nflTeam: 'CLE',
        year: 'R',
        verdict: 'PROMOTE',
        reason: 'Early RB1 starter role in Cleveland. Promote and start immediately.',
      },
      {
        name: 'Evan Stewart',
        pos: 'WR',
        nflTeam: 'JAC',
        year: 'Y2',
        verdict: 'HOLD',
        reason: 'Flashed in limited snaps Y1. Still developing — hold through 2026 before deciding.',
      },
    ],
  },
  {
    ownerSlug: 'tubes94',
    players: [
      {
        name: 'Emeka Egbuka',
        pos: 'WR',
        nflTeam: 'TB',
        year: 'R',
        verdict: 'PROMOTE',
        reason: 'Slot WR1 in Tampa with instant target share. Too good to leave on taxi.',
      },
      {
        name: 'Ollie Gordon',
        pos: 'RB',
        nflTeam: 'TEN',
        year: 'R',
        verdict: 'HOLD',
        reason: 'Tennessee backfield is crowded. Hold to see if a clear role emerges.',
      },
    ],
  },
  {
    ownerSlug: 'rbr',
    players: [
      {
        name: 'Tetairoa McMillan',
        pos: 'WR',
        nflTeam: 'CAR',
        year: 'R',
        verdict: 'PROMOTE',
        reason: 'Top WR in the class. Instant WR1 in Carolina. Promote day one.',
      },
      {
        name: 'Isaiah Davis',
        pos: 'RB',
        nflTeam: 'NYJ',
        year: 'Y2',
        verdict: 'HOLD',
        reason: 'Breece Hall keeps him stuck, but Davis is too talented to cut before 2026.',
      },
    ],
  },
  {
    ownerSlug: 'juicybussy',
    players: [
      {
        name: 'Omarion Hampton',
        pos: 'RB',
        nflTeam: 'LAC',
        year: 'R',
        verdict: 'PROMOTE',
        reason: 'Lead back in LA immediately. Top-10 dynasty RB after landing spot confirmed.',
      },
    ],
  },
  {
    ownerSlug: 'cmaleski',
    players: [
      {
        name: 'Luther Burden',
        pos: 'WR',
        nflTeam: 'CHI',
        year: 'R',
        verdict: 'HOLD',
        reason: 'Bears WR room is deep. Hold through training camp — role may clarify mid-season.',
      },
      {
        name: 'Tahj Washington',
        pos: 'WR',
        nflTeam: 'HOU',
        year: 'Y2',
        verdict: 'CUT',
        reason: 'Tank Dell back healthy and Stefon Diggs signed. Washington has no path to targets.',
      },
    ],
  },
  {
    ownerSlug: 'eldridsm',
    players: [
      {
        name: 'Kalif Raymond',
        pos: 'WR',
        nflTeam: 'DET',
        year: 'Y2',
        verdict: 'CUT',
        reason: 'Pure return specialist with no dynasty value. Free the taxi spot for a 2026 rookie.',
      },
      {
        name: 'Jaylen Wright',
        pos: 'RB',
        nflTeam: 'MIA',
        year: 'R',
        verdict: 'HOLD',
        reason: 'Miami RB situation is chaotic but Wright is the youngest and most athletic. Patience.',
      },
    ],
  },
  {
    ownerSlug: 'sexmachineandy',
    players: [
      {
        name: 'Jonathon Brooks',
        pos: 'RB',
        nflTeam: 'CAR',
        year: 'R',
        verdict: 'HOLD',
        reason: 'ACL recovery clouded Y1. If healthy, he is RB1 quality. Hold and monitor camp reports.',
      },
      {
        name: 'Kimani Vidal',
        pos: 'RB',
        nflTeam: 'LAC',
        year: 'Y2',
        verdict: 'CUT',
        reason: 'Hampton arrival makes Vidal a non-factor. Cut and reclaim the taxi spot.',
      },
    ],
  },
  {
    ownerSlug: 'cogdeill11',
    players: [
      {
        name: 'Bo Nix',
        pos: 'QB',
        nflTeam: 'DEN',
        year: 'Y2',
        verdict: 'HOLD',
        reason: 'Denver gave him the keys. Mobile QB with dual-threat value — worth a hold.',
      },
    ],
  },
  {
    ownerSlug: 'grandes',
    players: [
      {
        name: 'Malik Washington',
        pos: 'WR',
        nflTeam: 'SF',
        year: 'Y2',
        verdict: 'CUT',
        reason: '49ers WR depth chart is too crowded. No realistic path to targets.',
      },
      {
        name: 'Roman Wilson',
        pos: 'WR',
        nflTeam: 'PIT',
        year: 'Y2',
        verdict: 'HOLD',
        reason: 'Pittsburgh WR situation is volatile. Wilson has upside if Pickens misses time.',
      },
    ],
  },
  {
    ownerSlug: 'tdtd19844',
    players: [
      {
        name: 'MarShawn Lloyd',
        pos: 'RB',
        nflTeam: 'GB',
        year: 'R',
        verdict: 'HOLD',
        reason: 'AJ Dillon gone, Lloyd in the mix. Wait for preseason clarity before promoting.',
      },
    ],
  },
  {
    ownerSlug: 'eldridm20',
    players: [
      {
        name: 'Trey Benson',
        pos: 'RB',
        nflTeam: 'ARI',
        year: 'Y2',
        verdict: 'PROMOTE',
        reason: 'Arizona handed him the starting role. Promote and cash in on the volume.',
      },
      {
        name: 'Devontez Walker',
        pos: 'WR',
        nflTeam: 'BAL',
        year: 'Y2',
        verdict: 'HOLD',
        reason: 'Baltimore WR depth is thin above him. Worth holding for a potential breakout.',
      },
    ],
  },
  {
    ownerSlug: 'escuelas',
    players: [
      {
        name: 'Braelon Allen',
        pos: 'RB',
        nflTeam: 'NYJ',
        year: 'Y2',
        verdict: 'PROMOTE',
        reason: 'Breece Hall traded — Allen is the lead back now. This is a must-promote.',
      },
    ],
  },
];

const GRAD_PLAYERS: GradPlayer[] = [
  // Tier 1 — Promote Now
  { name: 'Tetairoa McMillan', pos: 'WR', tier: 1, note: 'Top WR in class, immediate WR1 role' },
  { name: 'Emeka Egbuka',      pos: 'WR', tier: 1, note: 'Slot star, instant PPR value in Tampa' },
  { name: 'Quinshon Judkins',  pos: 'RB', tier: 1, note: 'Starting RB with three-down potential' },
  { name: 'Omarion Hampton',   pos: 'RB', tier: 1, note: 'Lead back, cleared for full workload' },
  // Tier 2 — Hold
  { name: 'Luther Burden',     pos: 'WR', tier: 2, note: 'High ceiling, needs role clarification' },
  { name: 'Ollie Gordon',      pos: 'RB', tier: 2, note: 'Athletic but crowded TEN backfield' },
  { name: 'Isaiah Davis',      pos: 'RB', tier: 2, note: 'Blocked in NYJ, monitor Hall situation' },
  { name: 'Jaylen Wright',     pos: 'RB', tier: 2, note: 'Chaotic MIA backfield, patience required' },
  { name: 'Evan Stewart',      pos: 'WR', tier: 2, note: 'Y2 breakout candidate, low-risk hold' },
  // Tier 3 — Cut / Replace
  { name: 'Tahj Washington',   pos: 'WR', tier: 3, note: 'Target path blocked — free the spot' },
  { name: 'Kalif Raymond',     pos: 'WR', tier: 3, note: 'Return specialist only, no fantasy value' },
  { name: 'Kimani Vidal',      pos: 'RB', tier: 3, note: 'Hampton arrival ends his relevance' },
  { name: 'Malik Washington',  pos: 'WR', tier: 3, note: 'SF depth too thick to overcome' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VERDICT_COLORS: Record<Verdict, { bg: string; border: string; badge: string; text: string }> = {
  PROMOTE: {
    bg:     'bg-emerald-900/30',
    border: 'border-emerald-500/40',
    badge:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50',
    text:   'text-emerald-400',
  },
  HOLD: {
    bg:     'bg-amber-900/30',
    border: 'border-amber-500/40',
    badge:  'bg-amber-500/20 text-amber-300 border border-amber-500/50',
    text:   'text-amber-400',
  },
  CUT: {
    bg:     'bg-red-900/30',
    border: 'border-red-500/40',
    badge:  'bg-red-500/20 text-red-300 border border-red-500/50',
    text:   'text-red-400',
  },
};

const POS_COLORS: Record<Position, string> = {
  QB: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  RB: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
  WR: 'bg-sky-500/20    text-sky-300    border-sky-500/40',
  TE: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
};

const TIER_CONFIG: Record<GradTier, { label: string; color: string; dot: string }> = {
  1: { label: 'Tier 1 — Promote Now',   color: 'text-emerald-300', dot: 'bg-emerald-400' },
  2: { label: 'Tier 2 — Hold',          color: 'text-amber-300',   dot: 'bg-amber-400' },
  3: { label: 'Tier 3 — Cut / Replace', color: 'text-red-300',     dot: 'bg-red-400' },
};

const YEAR_BADGE: Record<TaxiPlayer['year'], string> = {
  R:  'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40',
  Y2: 'bg-slate-700/60 text-slate-300 border border-slate-600/60',
};

function getOwner(slug: string) {
  return OWNER_TOKENS.find((t) => t.slug === slug);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaxiPlayerRow({ player }: { player: TaxiPlayer }) {
  const v = VERDICT_COLORS[player.verdict];
  const p = POS_COLORS[player.pos];
  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg border', v.bg, v.border)}>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-bold text-white text-sm">{player.name}</span>
          <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded border', p)}>
            {player.pos}
          </span>
          <span className="text-xs text-slate-400">{player.nflTeam}</span>
          <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded', YEAR_BADGE[player.year])}>
            {player.year}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{player.reason}</p>
      </div>
      <span className={cn('text-xs font-black px-2.5 py-1 rounded border shrink-0', v.badge)}>
        {player.verdict}
      </span>
    </div>
  );
}

function TeamCard({ team, visible }: { team: TeamTaxi; visible: boolean }) {
  const owner = getOwner(team.ownerSlug);
  if (!owner || !visible) return null;

  return (
    <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{owner.emoji}</span>
        <div>
          <h3 className="font-black text-white text-base leading-tight">{owner.displayName}</h3>
          <p className="text-xs text-slate-500">{owner.personality}</p>
        </div>
        <span className="ml-auto text-xs text-slate-500">
          {team.players.length} / 5 taxi spots
        </span>
      </div>

      {team.players.length === 0 ? (
        <p className="text-sm text-slate-600 italic text-center py-4">No taxi squad players</p>
      ) : (
        <div className="flex flex-col gap-2">
          {team.players.map((player) => (
            <TaxiPlayerRow key={player.name} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const VERDICT_FILTERS: VerdictFilter[] = ['ALL', 'PROMOTE', 'HOLD', 'CUT'];

export default function TaxiOptimizerPage() {
  const [verdictFilter, setVerdictFilter] = useState<VerdictFilter>('ALL');
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('ALL');

  const allTeamSlugs = useMemo(
    () => TAXI_SQUADS.map((t) => t.ownerSlug),
    []
  );

  const filteredSquads = useMemo(() => {
    return TAXI_SQUADS.map((team) => {
      const filteredPlayers =
        verdictFilter === 'ALL'
          ? team.players
          : team.players.filter((p) => p.verdict === verdictFilter);
      return { ...team, players: filteredPlayers };
    });
  }, [verdictFilter]);

  const visibleTeams = useMemo(() => {
    if (teamFilter === 'ALL') return filteredSquads;
    return filteredSquads.filter((t) => t.ownerSlug === teamFilter);
  }, [filteredSquads, teamFilter]);

  const verdictCounts = useMemo(() => {
    const all = TAXI_SQUADS.flatMap((t) => t.players);
    return {
      ALL:     all.length,
      PROMOTE: all.filter((p) => p.verdict === 'PROMOTE').length,
      HOLD:    all.filter((p) => p.verdict === 'HOLD').length,
      CUT:     all.filter((p) => p.verdict === 'CUT').length,
    } as Record<VerdictFilter, number>;
  }, []);

  return (
    <>
      <Head>
        <title>Taxi Squad Optimizer | BMFFFL Dynasty Analytics</title>
        <meta
          name="description"
          content="2026 offseason taxi squad decisions for all 12 BMFFFL teams. Promote, hold, or cut — Bimfle's verdicts on every rookie and second-year taxi player."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] text-white pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ── Page header ── */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#ffd700] text-3xl">&#128661;</span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Taxi Squad Optimizer
              </h1>
            </div>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
              2026 offseason verdicts &mdash; which taxi players to promote, hold, or cut.
            </p>
          </div>

          {/* ── Section 1: What Is the Taxi Squad? ── */}
          <section className="mb-10 bg-[#16213e] border border-[#2d4a66] rounded-xl p-6">
            <h2 className="text-xl font-black text-white mb-4">What Is the Taxi Squad?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#ffd700] font-black text-lg leading-none mt-0.5">5</span>
                  <div>
                    <p className="text-sm font-semibold text-white">5 dedicated spots</p>
                    <p className="text-xs text-slate-400">Reserve exclusively for rookies and second-year players.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#ffd700] font-black text-lg leading-none mt-0.5">R/Y2</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Eligibility: Rookies &amp; 2nd-year players only</p>
                    <p className="text-xs text-slate-400">Once a player enters their 3rd NFL season, they must be on the main roster or cut.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#ffd700] font-black text-lg leading-none mt-0.5">&#128274;</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Locked during the season</p>
                    <p className="text-xs text-slate-400">Taxi players cannot be activated once the regular season begins.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#ffd700] font-black text-lg leading-none mt-0.5">&#8593;</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Promote anytime in the offseason</p>
                    <p className="text-xs text-slate-400">Free to move players to the main roster between the end of one season and the start of the next.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 2: Current Taxi Squads ── */}
          <section className="mb-10">
            <div className="mb-5">
              <h2 className="text-xl font-black text-white mb-1">Current Taxi Squads — 2026 Offseason</h2>
              <p className="text-slate-500 text-sm mb-4">
                Bimfle&rsquo;s verdict on every taxi player across all 12 teams.
              </p>

              {/* Filter row */}
              <div className="flex flex-wrap gap-3 mb-4">
                {/* Verdict filters */}
                <div className="flex flex-wrap gap-2">
                  {VERDICT_FILTERS.map((vf) => (
                    <button
                      key={vf}
                      onClick={() => setVerdictFilter(vf)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors duration-150',
                        verdictFilter === vf
                          ? vf === 'ALL'
                            ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/50'
                            : VERDICT_COLORS[vf as Verdict].badge
                          : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:text-white hover:border-slate-500'
                      )}
                    >
                      {vf}
                      <span className="ml-1 opacity-60">({verdictCounts[vf]})</span>
                    </button>
                  ))}
                </div>

                {/* Team filter */}
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40"
                >
                  <option value="ALL">All Teams</option>
                  {allTeamSlugs.map((slug) => {
                    const o = getOwner(slug);
                    return (
                      <option key={slug} value={slug}>
                        {o ? `${o.emoji} ${o.displayName}` : slug}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {visibleTeams.map((team) => (
                <TeamCard
                  key={team.ownerSlug}
                  team={team}
                  visible={true}
                />
              ))}
              {visibleTeams.length === 0 && (
                <div className="sm:col-span-2 text-center py-12 text-slate-600 italic">
                  No players match the selected filters.
                </div>
              )}
            </div>
          </section>

          {/* ── Section 3: Taxi Graduation Analysis ── */}
          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-1">Taxi Graduation Analysis</h2>
            <p className="text-slate-500 text-sm mb-5">
              2026 rookie class and second-year players ranked by dynasty promotion priority.
            </p>

            <div className="space-y-4">
              {([1, 2, 3] as GradTier[]).map((tier) => {
                const cfg = TIER_CONFIG[tier];
                const players = GRAD_PLAYERS.filter((p) => p.tier === tier);
                return (
                  <div key={tier} className="bg-[#16213e] border border-[#2d4a66] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2d4a66] bg-[#0d1b2a]/40">
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', cfg.dot)} />
                      <span className={cn('text-sm font-black uppercase tracking-wide', cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="divide-y divide-[#1e2d45]">
                      {players.map((gp) => (
                        <div key={gp.name} className="flex items-center gap-3 px-5 py-3">
                          <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded border', POS_COLORS[gp.pos])}>
                            {gp.pos}
                          </span>
                          <span className="text-sm font-semibold text-white">{gp.name}</span>
                          <span className="text-xs text-slate-500 ml-auto text-right hidden sm:block">{gp.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Section 4: Keeper Rules Reference ── */}
          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-4">Keeper Rules Reference</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: '3',
                  title: '3 keepers max per team',
                  body: 'Each manager may designate up to 3 players to keep for the upcoming season.',
                },
                {
                  icon: '&#8593;',
                  title: 'Cost: 1 round earlier than drafted',
                  body: 'A player drafted in Round 4 costs a Round 3 pick to keep. The pick used equals the round above where they were drafted.',
                },
                {
                  icon: '&#8856;',
                  title: 'Waiver additions cannot be kept',
                  body: 'You may only keep players you drafted. Players picked up off waivers or the free-agent pool are not keeper-eligible.',
                },
                {
                  icon: '0',
                  title: 'Minimum: 0 keepers',
                  body: 'Keeping is always optional. You may choose to keep nobody and enter the draft with a full slate of picks.',
                },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 flex items-start gap-4"
                >
                  <span
                    className="text-[#ffd700] font-black text-xl leading-none shrink-0 w-8 text-center"
                    dangerouslySetInnerHTML={{ __html: icon }}
                  />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 5: Bimfle's Taxi Strategy Guide ── */}
          <section className="mb-6">
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#ffd700] text-xl">&#9733;</span>
                <h2 className="text-xl font-black text-white">Bimfle&rsquo;s Taxi Strategy Guide</h2>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    title: 'Promote when the landing spot is locked',
                    body: "If a rookie has secured a clear starting role by OTAs, promote immediately. Don't gamble on a roster-spot claim during the season.",
                  },
                  {
                    title: 'Hold through at least half a season before cutting',
                    body: 'Second-year players often need 8 weeks of live NFL action before their role crystalizes. Cutting in May based on depth charts alone is premature.',
                  },
                  {
                    title: 'The cost of cutting is an open taxi spot, not a loss',
                    body: "Cutting a taxi player doesn't cost a pick — it frees a spot for the next rookie class. Think of it as reclaiming a future asset, not discarding a current one.",
                  },
                  {
                    title: 'Taxi spots are currency in rookie drafts',
                    body: 'The best teams entering the 2026 draft have open taxi slots and high picks. A full, stale taxi squad heading into the draft is a liability.',
                  },
                  {
                    title: 'Never taxi a player past their eligibility window',
                    body: 'A player hitting Year 3 who has not proven fantasy value is a roster clog. Promote only if you intend to start them. Cut otherwise — the taxi is not a storage unit.',
                  },
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-[#ffd700] font-black text-sm leading-none shrink-0 w-5 text-center mt-0.5">
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">{tip.title}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{tip.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-[#2d4a66]">
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  &ldquo;The taxi squad is the dynasty manager&rsquo;s junior varsity. Promote the stars,
                  hold the maybes, and cut the depth chart fodder before it costs you a roster spot
                  that a real prospect deserves.&rdquo;
                </p>
                <p className="text-[#ffd700] text-xs font-bold mt-2">~ Love, Bimfle</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
