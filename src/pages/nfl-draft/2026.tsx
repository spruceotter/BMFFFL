import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface DraftPick {
  pick: number;
  round: number;
  player: string;
  pos: string;
  college: string;
  nflTeam: string;
  dynastyTier: 0 | 1 | 2 | 3 | 4; // 0 = non-fantasy (OL/DL/LB/DB/EDGE)
  dynastyNote: string;
}

// 2026 NFL Draft — actual results (April 24–26, 2026, Pittsburgh PA)
// R1: Complete (32 picks). R2-R3: Fantasy-relevant picks. R4: In progress.
const DRAFT_PICKS_2026: DraftPick[] = [
  // ── ROUND 1 ────────────────────────────────────────────────────────────────
  { pick:  1, round: 1, player: 'Fernando Mendoza',   pos: 'QB',   college: 'Indiana',        nflTeam: 'LV',  dynastyTier: 1, dynastyNote: '#1 overall — dual-threat floor, LV rebuilding around him. SF dynasty QB1.' },
  { pick:  2, round: 1, player: 'David Bailey',        pos: 'EDGE', college: 'Texas Tech',     nflTeam: 'NYJ', dynastyTier: 0, dynastyNote: '' },
  { pick:  3, round: 1, player: 'Jeremiyah Love',      pos: 'RB',   college: 'Notre Dame',     nflTeam: 'ARI', dynastyTier: 1, dynastyNote: 'Unanimous 1.01 dynasty — Doak Walker winner, 4.36 40-time, 6.9 YPC, 18 TDs. BMFFFL: Grandes holds 1.01 pick.' },
  { pick:  4, round: 1, player: 'Carnell Tate',        pos: 'WR',   college: 'Ohio State',     nflTeam: 'TEN', dynastyTier: 1, dynastyNote: 'Elite route runner, 6\'3" with contested-catch ability. TEN\'s WR1 from day one.' },
  { pick:  5, round: 1, player: 'Arvell Reese',        pos: 'LB',   college: 'Ohio State',     nflTeam: 'NYG', dynastyTier: 0, dynastyNote: '' },
  { pick:  6, round: 1, player: 'Mansoor Delane',      pos: 'CB',   college: 'LSU',            nflTeam: 'KC',  dynastyTier: 0, dynastyNote: '' },
  { pick:  7, round: 1, player: 'Sonny Styles',        pos: 'LB',   college: 'Ohio State',     nflTeam: 'WAS', dynastyTier: 0, dynastyNote: '' },
  { pick:  8, round: 1, player: 'Jordyn Tyson',        pos: 'WR',   college: 'Arizona State',  nflTeam: 'NO',  dynastyTier: 1, dynastyNote: 'WR1 in New Orleans — Drake Maye connection gone, but NO invested heavily here. Elite athleticism.' },
  { pick:  9, round: 1, player: 'Spencer Fano',        pos: 'OT',   college: 'Utah',           nflTeam: 'CLE', dynastyTier: 0, dynastyNote: '' },
  { pick: 10, round: 1, player: 'Francis Mauigoa',     pos: 'OT',   college: 'Miami',          nflTeam: 'NYG', dynastyTier: 0, dynastyNote: '' },
  { pick: 11, round: 1, player: 'Caleb Downs',         pos: 'S',    college: 'Ohio State',     nflTeam: 'DAL', dynastyTier: 0, dynastyNote: '' },
  { pick: 12, round: 1, player: 'Kadyn Proctor',       pos: 'OT',   college: 'Alabama',        nflTeam: 'MIA', dynastyTier: 0, dynastyNote: '' },
  { pick: 13, round: 1, player: 'Ty Simpson',          pos: 'QB',   college: 'Alabama',        nflTeam: 'LAR', dynastyTier: 2, dynastyNote: 'LAR invested a 1st — natural heir to Matthew Stafford. SF QB in an elite system, but 2-3 year runway.' },
  { pick: 14, round: 1, player: 'Olaivavega Ioane',    pos: 'OG',   college: 'Penn State',     nflTeam: 'BAL', dynastyTier: 0, dynastyNote: '' },
  { pick: 15, round: 1, player: 'Rueben Bain Jr.',     pos: 'EDGE', college: 'Miami',          nflTeam: 'TB',  dynastyTier: 0, dynastyNote: '' },
  { pick: 16, round: 1, player: 'Kenyon Sadiq',        pos: 'TE',   college: 'Oregon',         nflTeam: 'NYJ', dynastyTier: 1, dynastyNote: 'TE1 of class — elite athleticism, 6\'5" receiving TE. NYJ needed this badly. High upside in that offense.' },
  { pick: 17, round: 1, player: 'Blake Miller',        pos: 'OT',   college: 'Clemson',        nflTeam: 'DET', dynastyTier: 0, dynastyNote: '' },
  { pick: 18, round: 1, player: 'Caleb Banks',         pos: 'DL',   college: 'Florida',        nflTeam: 'MIN', dynastyTier: 0, dynastyNote: '' },
  { pick: 19, round: 1, player: 'Monroe Freeling',     pos: 'OT',   college: 'Georgia',        nflTeam: 'CAR', dynastyTier: 0, dynastyNote: '' },
  { pick: 20, round: 1, player: 'Makai Lemon',         pos: 'WR',   college: 'USC',            nflTeam: 'PHI', dynastyTier: 1, dynastyNote: 'Biletnikoff Award winner. PHI traded up for him. Slots into a run-first offense but sky-high ceiling with Hurts.' },
  { pick: 21, round: 1, player: 'Max Iheanachor',      pos: 'OT',   college: 'Arizona State',  nflTeam: 'PIT', dynastyTier: 0, dynastyNote: '' },
  { pick: 22, round: 1, player: 'Akheem Mesidor',      pos: 'EDGE', college: 'Miami',          nflTeam: 'LAC', dynastyTier: 0, dynastyNote: '' },
  { pick: 23, round: 1, player: 'Malachi Lawrence',    pos: 'EDGE', college: 'UCF',            nflTeam: 'DAL', dynastyTier: 0, dynastyNote: '' },
  { pick: 24, round: 1, player: 'K.C. Concepcion',     pos: 'WR',   college: 'Texas A&M',      nflTeam: 'CLE', dynastyTier: 1, dynastyNote: 'CLE now has two first-round WRs (Concepcion + Boston R2). Immediate starter — YAC specialist with elite speed.' },
  { pick: 25, round: 1, player: 'Dillon Thieneman',    pos: 'S',    college: 'Oregon',         nflTeam: 'CHI', dynastyTier: 0, dynastyNote: '' },
  { pick: 26, round: 1, player: 'Keylan Rutledge',     pos: 'OG',   college: 'Georgia Tech',   nflTeam: 'HOU', dynastyTier: 0, dynastyNote: '' },
  { pick: 27, round: 1, player: 'Chris Johnson',       pos: 'CB',   college: 'San Diego State', nflTeam: 'MIA', dynastyTier: 0, dynastyNote: '' },
  { pick: 28, round: 1, player: 'Caleb Lomu',          pos: 'OT',   college: 'Utah',           nflTeam: 'NE',  dynastyTier: 0, dynastyNote: '' },
  { pick: 29, round: 1, player: 'Peter Woods',         pos: 'DT',   college: 'Clemson',        nflTeam: 'KC',  dynastyTier: 0, dynastyNote: '' },
  { pick: 30, round: 1, player: 'Omar Cooper Jr.',     pos: 'WR',   college: 'Indiana',        nflTeam: 'NYJ', dynastyTier: 2, dynastyNote: 'NYJ took two WRs in R1 (Cooper + Sadiq). Slot specialist with elite YAC, will compete for targets immediately.' },
  { pick: 31, round: 1, player: 'Keldric Faulk',       pos: 'EDGE', college: 'Auburn',         nflTeam: 'TEN', dynastyTier: 0, dynastyNote: '' },
  { pick: 32, round: 1, player: 'Jadarian Price',      pos: 'RB',   college: 'Notre Dame',     nflTeam: 'SEA', dynastyTier: 1, dynastyNote: 'RB2 of class — SEA needed a backfield anchor. Three-down back with 4.40 speed. Immediate competition for touches.' },

  // ── ROUND 2 (Fantasy-relevant picks) ──────────────────────────────────────
  { pick: 33, round: 2, player: 'De\'Zhaun Stribling',  pos: 'WR',  college: 'West Virginia',   nflTeam: 'SF',  dynastyTier: 2, dynastyNote: 'Best R2 WR landing spot. SF\'s offense turns WRs into dynasty assets. Buy-low window is open.' },
  { pick: 39, round: 2, player: 'Denzel Boston',        pos: 'WR',  college: 'Colorado State',  nflTeam: 'CLE', dynastyTier: 2, dynastyNote: 'CLE took Concepcion (#24) AND Boston (#39) — two WRs in 7 picks. Paired with R1 mate, both have space to develop.' },
  { pick: 47, round: 2, player: 'Germie Bernard',       pos: 'WR',  college: 'Michigan State',  nflTeam: 'PIT', dynastyTier: 2, dynastyNote: 'PIT traded up to get him. WR ceiling limited by QB (Wilson aging, Allar incoming) — but upside in 2027 if Allar wins the job.' },
  { pick: 54, round: 2, player: 'Eli Stowers',          pos: 'TE',  college: 'Vanderbilt',      nflTeam: 'PHI', dynastyTier: 2, dynastyNote: 'Best TE landing spot in the R2 TE flood. PHI uses TEs. 45.5" vertical, combine standout. High floor with Hurts.' },
  { pick: 56, round: 2, player: 'Cole Boerkircher',     pos: 'TE',  college: 'Iowa',            nflTeam: 'JAX', dynastyTier: 3, dynastyNote: 'R2 TE — JAX offense is rebuilding. Raw, upside play. 2-3 year development timeline.' },
  { pick: 59, round: 2, player: 'Jordan Klein',         pos: 'TE',  college: 'Ohio',            nflTeam: 'HOU', dynastyTier: 3, dynastyNote: 'HOU TE — solid landing spot, but CJ Stroud\'s first read is typically WRs. Role player ceiling unless a breakout game changes perception.' },
  { pick: 61, round: 2, player: 'Tommy Klare',          pos: 'TE',  college: 'Ohio State',      nflTeam: 'LAR', dynastyTier: 3, dynastyNote: 'McVay offense uses TEs well, but Klare enters a crowded depth chart. Best-case: breakout in 2027.' },

  // ── ROUND 3 (Fantasy-relevant picks) ──────────────────────────────────────
  { pick: 65, round: 3, player: 'Carson Beck',          pos: 'QB',  college: 'Georgia',         nflTeam: 'ARI', dynastyTier: 3, dynastyNote: 'ARI took Love at #3 AND Beck at #65 — developing their QB of the future behind Love\'s rookie season attention. Long stash play.' },
  { pick: 71, round: 3, player: 'Antonio Williams',     pos: 'WR',  college: 'Alabama',         nflTeam: 'WAS', dynastyTier: 3, dynastyNote: 'WAS offense projected to be relevant in 2026. Williams has the size/speed profile but needs route refinement.' },
  { pick: 74, round: 3, player: 'Malachi Fields',       pos: 'WR',  college: 'Illinois',        nflTeam: 'NYG', dynastyTier: 3, dynastyNote: 'NYG WR room is wide open. Fields can carve out a role as a big slot option with upside if Giants rebuild accelerates.' },
  { pick: 75, round: 3, player: 'Caleb Douglas',        pos: 'WR',  college: 'LSU',             nflTeam: 'MIA', dynastyTier: 2, dynastyNote: 'MIA needed WRs badly after Waddle era. Douglas has route-running chops — best R3 WR situation in the class.' },
  { pick: 76, round: 3, player: 'Drew Allar',           pos: 'QB',  college: 'Penn State',      nflTeam: 'PIT', dynastyTier: 2, dynastyNote: 'The stash pick of the class. 4 years Penn State pro-style system, Russ Wilson is 37. PIT QB job opens in 1-2 years — Allar is the heir.' },
  { pick: 79, round: 3, player: 'Zachariah Branch',     pos: 'WR',  college: 'USC',             nflTeam: 'ATL', dynastyTier: 3, dynastyNote: 'Elite punt returner, slot WR. Atlanta offense is improving and Branch gets opportunities — but WR3 ceiling is realistic.' },
  { pick: 80, round: 3, player: 'Ja\'Kobi Lane',        pos: 'WR',  college: 'Tennessee',       nflTeam: 'BAL', dynastyTier: 3, dynastyNote: 'BAL WR room has turnover — Lane lands in a good situation. Long-term upside if he wins a starting role.' },
  { pick: 90, round: 3, player: 'Kaelon Black',         pos: 'RB',  college: 'Texas',           nflTeam: 'SF',  dynastyTier: 3, dynastyNote: 'Kyle Shanahan turns late-round RBs into useful dynasty pieces. SF system = floor. Black is worth a late dynasty flier.' },
];

// ─── BMFFFL Implications ──────────────────────────────────────────────────────

const BMFFFL_TAKEAWAYS = [
  {
    icon: '🔴',
    headline: 'Grandes: 1.01 = Jeremiyah Love (ARI)',
    detail: 'Love is still the consensus call at #1 in the 2026 dynasty rookie draft. No competition — ARI drafted him #3 overall. The only debate is how quickly he sees a full workload.',
    tier: 'tier1',
  },
  {
    icon: '🟡',
    headline: 'WR depth is the story of this class',
    detail: 'Picks 1.04–1.08 in your dynasty rookie draft land in Tate/Lemon/Tyson/Concepcion range. If you hold picks 1.04–1.08, you\'re getting premium WR value. Mid-round picks get Boston, Stribling, Bernard, Douglas.',
    tier: 'tier2',
  },
  {
    icon: '🔵',
    headline: 'Best QB stash: Drew Allar (PIT, R3 #76)',
    detail: 'Russell Wilson is 37. Allar spent 4 years in Penn State\'s pro-style system. PIT QB job will turn over — stash Allar now while he\'s cheap. Carson Beck (ARI) is the backup stash for ARI dynasty managers.',
    tier: 'tier2',
  },
  {
    icon: '⚠️',
    headline: 'TE class: depth, not franchise options',
    detail: '4 TEs went in R2 (Stowers PHI, Boerkircher JAX, Klein HOU, Klare LAR). Stowers is the best bet — PHI landing spot is premium. But R2 TEs rarely return on early dynasty capital. Don\'t reach.',
    tier: 'caution',
  },
  {
    icon: '💡',
    headline: 'Late flier: Kaelon Black (SF, R3 #90)',
    detail: 'Kyle Shanahan has turned late-round RBs into dynasty assets repeatedly. Black lands in the best possible system. Worth the late pick if it\'s available.',
    tier: 'tier3',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FANTASY_POS = new Set(['QB', 'RB', 'WR', 'TE']);
type PosFilter  = 'All' | 'QB' | 'RB' | 'WR' | 'TE';
type RoundFilter = 'All' | '1' | '2' | '3';

const POS_FILTERS: PosFilter[]   = ['All', 'QB', 'RB', 'WR', 'TE'];
const ROUND_FILTERS: RoundFilter[] = ['All', '1', '2', '3'];

function posBadgeClass(pos: string): string {
  if (pos === 'QB')                return 'bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/30';
  if (pos === 'RB')                return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  if (pos === 'WR')                return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
  if (pos === 'TE')                return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
  return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
}

function tierBadgeClass(tier: number): string {
  if (tier === 1) return 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40';
  if (tier === 2) return 'bg-slate-400/20 text-slate-300 border border-slate-400/40';
  if (tier === 3) return 'bg-amber-700/20 text-amber-600 border border-amber-700/30';
  if (tier === 4) return 'bg-slate-700/20 text-slate-500 border border-slate-600/30';
  return           'bg-slate-800/40 text-slate-600 border border-slate-700/20';
}

function tierLabel(tier: number): string {
  if (tier === 1) return 'Tier 1';
  if (tier === 2) return 'Tier 2';
  if (tier === 3) return 'Tier 3';
  if (tier === 4) return 'Tier 4';
  return 'Non-Fantasy';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NflDraft2026Page() {
  const [posFilter,   setPosFilter]   = useState<PosFilter>('All');
  const [roundFilter, setRoundFilter] = useState<RoundFilter>('All');
  const [showNonFantasy, setShowNonFantasy] = useState(false);

  const filteredPicks = DRAFT_PICKS_2026.filter((p) => {
    const isFantasy = FANTASY_POS.has(p.pos);
    if (!showNonFantasy && !isFantasy) return false;
    if (posFilter !== 'All' && p.pos !== posFilter) return false;
    if (roundFilter !== 'All' && p.round !== parseInt(roundFilter)) return false;
    return true;
  });

  const fantasyCount = DRAFT_PICKS_2026.filter((p) => FANTASY_POS.has(p.pos)).length;
  const tier1Count   = DRAFT_PICKS_2026.filter((p) => p.dynastyTier === 1).length;

  return (
    <>
      <Head>
        <title>2026 NFL Draft — Class Report | BMFFFL</title>
        <meta
          name="description"
          content="2026 NFL Draft results and dynasty impact analysis for BMFFFL. Real pick data through R3."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" aria-hidden="true" />
              2026 Draft — R4 In Progress
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
              2026 NFL Draft
            </h1>
            <p className="text-slate-400 text-sm mb-1">
              April 24–26, 2026 &bull; Acrisure Stadium, Pittsburgh, PA
            </p>
            <p className="text-slate-500 text-xs">
              Real draft results through Round 3. R4 in progress. Dynasty analysis by Bimflé.
            </p>
          </div>

          {/* ── Draft Game CTA ────────────────────────────────────────────── */}
          <div className="my-6">
            <Link
              href="/nfl-draft-game"
              className="inline-flex items-center justify-between w-full sm:w-auto sm:min-w-72 bg-[#ffd700]/10 border border-[#ffd700]/40 hover:border-[#ffd700] rounded-xl px-5 py-4 group transition-colors duration-150"
            >
              <div>
                <p className="text-[#ffd700] font-black text-sm uppercase tracking-widest">🏆 Draft Game 2026</p>
                <p className="text-slate-400 text-xs mt-0.5">Picks, leaderboard &amp; results</p>
              </div>
              <span className="text-[#ffd700] text-lg group-hover:translate-x-1 transition-transform duration-150 ml-6">→</span>
            </Link>
          </div>

          {/* ── Quick Stats Bar ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
            {[
              { stat: '32',           label: 'Round 1 picks',         color: 'text-[#ffd700]' },
              { stat: String(tier1Count),  label: 'Dynasty Tier 1 rookies', color: 'text-[#e94560]' },
              { stat: String(fantasyCount), label: 'Fantasy-relevant picks tracked', color: 'text-emerald-400' },
              { stat: 'R4',           label: 'Ongoing — data updates weekly', color: 'text-slate-300' },
            ].map(({ stat, label, color }) => (
              <div
                key={label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl px-4 py-3"
              >
                <p className={cn('text-2xl font-black mb-0.5', color)}>{stat}</p>
                <p className="text-slate-400 text-xs leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1: Draft Results
          ════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="results-heading" className="mb-14">
            <div className="mb-5">
              <h2 id="results-heading" className="text-2xl font-black text-white mb-1">
                2026 Draft Results
              </h2>
              <p className="text-slate-400 text-xs">
                R1–R3 complete. Fantasy positions shown by default — toggle to include non-fantasy.
              </p>
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {/* Round filter */}
              <div className="flex gap-1.5">
                {ROUND_FILTERS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoundFilter(r)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-150',
                      roundFilter === r
                        ? 'bg-[#e94560] text-white'
                        : 'bg-[#16213e] text-slate-300 border border-[#2d4a66] hover:border-slate-400'
                    )}
                  >
                    {r === 'All' ? 'All Rounds' : `R${r}`}
                  </button>
                ))}
              </div>

              <span className="text-slate-600 text-sm hidden sm:block">|</span>

              {/* Position filter */}
              <div className="flex gap-1.5">
                {POS_FILTERS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosFilter(pos)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-150',
                      posFilter === pos
                        ? pos === 'All'
                          ? 'bg-slate-500 text-white'
                          : cn(posBadgeClass(pos), 'opacity-100')
                        : 'bg-[#16213e] text-slate-300 border border-[#2d4a66] hover:border-slate-400'
                    )}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              {/* Non-fantasy toggle */}
              <button
                onClick={() => setShowNonFantasy((v) => !v)}
                className={cn(
                  'ml-auto px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 border',
                  showNonFantasy
                    ? 'bg-slate-600 text-slate-200 border-slate-500'
                    : 'bg-[#16213e] text-slate-500 border-[#2d4a66] hover:border-slate-400'
                )}
              >
                {showNonFantasy ? 'Hide non-fantasy' : 'Show all positions'}
              </button>
            </div>

            {/* Picks table */}
            <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-16">Pick</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Player</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-14">Pos</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 hidden sm:table-cell">College</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-14">Team</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-20 hidden md:table-cell">Tier</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Dynasty Note</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPicks.map((p, idx) => {
                    const isFantasy = FANTASY_POS.has(p.pos);
                    return (
                      <tr
                        key={`${p.round}-${p.pick}`}
                        className={cn(
                          'border-b border-[#2d4a66] last:border-0 transition-colors duration-100',
                          idx % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#16213e]/60',
                          'hover:bg-[#1e2f50]',
                          !isFantasy && 'opacity-50'
                        )}
                      >
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs whitespace-nowrap">
                          <span className="text-slate-600 text-xs mr-1">R{p.round}</span>#{p.pick}
                        </td>
                        <td className="px-4 py-3 text-white font-bold">
                          {p.dynastyTier === 1 && (
                            <span className="mr-1.5 text-[#ffd700]" aria-label="Tier 1 pick">★</span>
                          )}
                          {p.player}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-bold', posBadgeClass(p.pos))}>
                            {p.pos}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">{p.college}</td>
                        <td className="px-4 py-3">
                          <span className="text-slate-200 font-mono text-xs font-semibold">{p.nflTeam}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {isFantasy ? (
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs', tierBadgeClass(p.dynastyTier))}>
                              {tierLabel(p.dynastyTier)}
                            </span>
                          ) : (
                            <span className="text-slate-700 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell max-w-sm">
                          {p.dynastyNote}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPicks.length === 0 && (
              <p className="text-center text-slate-500 py-10 text-sm">
                No picks match the selected filters.
              </p>
            )}

            {/* R4 notice */}
            <p className="text-slate-600 text-xs mt-3 text-center">
              Round 4 in progress — fantasy-relevant picks will be added as the draft concludes.
            </p>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2: BMFFFL Implications
          ════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="bmfffl-heading" className="mb-14">
            <div className="mb-5">
              <h2 id="bmfffl-heading" className="text-2xl font-black text-white mb-1">
                BMFFFL Dynasty Implications
              </h2>
              <p className="text-slate-400 text-xs">
                What this draft class means for your dynasty roster. Analysis by Bimflé.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {BMFFFL_TAKEAWAYS.map(({ icon, headline, detail, tier }) => (
                <div
                  key={headline}
                  className={cn(
                    'rounded-xl border px-5 py-4 flex gap-4',
                    tier === 'tier1'   && 'bg-[#ffd700]/5 border-[#ffd700]/30',
                    tier === 'tier2'   && 'bg-[#16213e] border-[#2d4a66]',
                    tier === 'tier3'   && 'bg-[#16213e] border-[#2d4a66]',
                    tier === 'caution' && 'bg-[#e94560]/5 border-[#e94560]/20'
                  )}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <p className={cn(
                      'font-bold text-sm mb-1',
                      tier === 'tier1'   && 'text-[#ffd700]',
                      tier === 'tier2'   && 'text-white',
                      tier === 'tier3'   && 'text-slate-300',
                      tier === 'caution' && 'text-[#e94560]'
                    )}>
                      {headline}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3: Dynasty Tier Guide
          ════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="tier-legend-heading">
            <h2 id="tier-legend-heading" className="text-lg font-black text-white mb-3">
              Dynasty Tier Guide
            </h2>
            <div className="flex flex-wrap gap-3">
              {([1, 2, 3, 4] as const).map((tier) => (
                <div
                  key={tier}
                  className="flex items-center gap-2 bg-[#16213e] border border-[#2d4a66] rounded-lg px-3 py-2"
                >
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs', tierBadgeClass(tier))}>
                    {tierLabel(tier)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {tier === 1 && 'Must-own — dynasty cornerstone (top 12 dynasty ADP)'}
                    {tier === 2 && 'Strong value — proven floor with upside (12-24 range)'}
                    {tier === 3 && 'Upside stash — landing spot dependent, 3-year window'}
                    {tier === 4 && 'Late flier — minimal cost, speculative upside'}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
