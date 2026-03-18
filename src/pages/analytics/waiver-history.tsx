import { useState, useMemo } from 'react';
import Head from 'next/head';
import { DollarSign, Star, AlertTriangle, Trophy, Info, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'K';
type ImpactTier = 'Championship Impact' | 'Playoff Impact' | 'Solid Contributor' | 'Depth Piece' | 'Bust';

interface WaiverMove {
  id: number;
  season: number;
  week: number;
  owner: string;
  player: string;
  pos: Position;
  faabSpent: number;
  droppedPlayer?: string;
  impactTier: ImpactTier;
  contributed: boolean;   // did this move help the team?
  notes: string;
  approximate: true;
}

// ─── Historical Waiver Data ───────────────────────────────────────────────────
// Representative approximations — marked as approximate. Real data via Sleeper
// API in Phase G. Owner names match the verified BMFFFL roster.

const WAIVER_HISTORY: WaiverMove[] = [
  // ── 2020 ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    season: 2020, week: 4,
    owner: 'Cogdeill11',
    player: 'Dalvin Cook',
    pos: 'RB', faabSpent: 3200,
    droppedPlayer: 'Adrian Peterson',
    impactTier: 'Championship Impact',
    contributed: true,
    notes: 'Cook emerged as the bellcow in Minnesota after an injury to Alexander Mattison — Cogdeill11\'s timely bid locked down a top-3 RB for the rest of the season, anchoring the 2020 championship run.',
    approximate: true,
  },
  {
    id: 2,
    season: 2020, week: 7,
    owner: 'eldridsm',
    player: 'James Robinson',
    pos: 'RB', faabSpent: 2700,
    impactTier: 'Playoff Impact',
    contributed: true,
    notes: 'Undrafted free agent Robinson broke out mid-season as Jacksonville\'s clear starter. eldridsm\'s bid won a valuable RB2 that helped push the team to its only playoff appearance.',
    approximate: true,
  },
  {
    id: 3,
    season: 2020, week: 10,
    owner: 'SexMachineAndyD',
    player: 'Antonio Gibson',
    pos: 'RB', faabSpent: 2100,
    droppedPlayer: 'J.D. McKissic',
    impactTier: 'Solid Contributor',
    contributed: true,
    notes: 'Gibson\'s expanded role in Washington came into focus after week 9. Solid mid-range FAAB that paid off as RB flex depth.',
    approximate: true,
  },
  // ── 2021 ──────────────────────────────────────────────────────────────────
  {
    id: 4,
    season: 2021, week: 2,
    owner: 'MLSchools12',
    player: 'Josh Jacobs',
    pos: 'RB', faabSpent: 3400,
    droppedPlayer: 'Sony Michel',
    impactTier: 'Championship Impact',
    contributed: true,
    notes: 'Jacobs reclaimed the Las Vegas starting role after being in the doghouse early. MLSchools12\'s aggressive bid won the waiver wire battle — Jacobs delivered 300+ points and anchored the 2021 championship victory.',
    approximate: true,
  },
  {
    id: 5,
    season: 2021, week: 5,
    owner: 'rbr',
    player: 'Hunter Renfrow',
    pos: 'WR', faabSpent: 1800,
    impactTier: 'Playoff Impact',
    contributed: true,
    notes: 'Renfrow exploded as Derek Carr\'s security blanket, posting 7+ targets per game from week 6 onward. Valuable WR3/flex piece in rbr\'s run to the 2021 championship game.',
    approximate: true,
  },
  {
    id: 6,
    season: 2021, week: 8,
    owner: 'Cmaleski',
    player: 'Damien Harris',
    pos: 'RB', faabSpent: 3100,
    droppedPlayer: 'Rhamondre Stevenson',
    impactTier: 'Bust',
    contributed: false,
    notes: 'Harris suffered a hamstring injury in week 3 of his new-team tenure. Stevenson — the player dropped to get him — took over the role entirely. Expensive lesson in waiver-wire timing.',
    approximate: true,
  },
  {
    id: 7,
    season: 2021, week: 12,
    owner: 'JuicyBussy',
    player: 'Elijah Mitchell',
    pos: 'RB', faabSpent: 2900,
    droppedPlayer: 'JaMycal Hasty',
    impactTier: 'Solid Contributor',
    contributed: true,
    notes: 'Mitchell stepped into the San Francisco starting role mid-season and never looked back. JuicyBussy\'s second-half addition provided crucial RB depth in the playoff push.',
    approximate: true,
  },
  // ── 2022 ──────────────────────────────────────────────────────────────────
  {
    id: 8,
    season: 2022, week: 3,
    owner: 'Grandes',
    player: 'David Montgomery',
    pos: 'RB', faabSpent: 2800,
    impactTier: 'Championship Impact',
    contributed: true,
    notes: 'Montgomery\'s move to Detroit alongside Jahmyr Gibbs gave him an immediate starring role in the run game. Grandes\' well-timed bid on a changing-of-the-guard situation powered the 2022 championship.',
    approximate: true,
  },
  {
    id: 9,
    season: 2022, week: 6,
    owner: 'eldridsm',
    player: 'Miles Sanders',
    pos: 'RB', faabSpent: 3500,
    droppedPlayer: 'James Conner',
    impactTier: 'Bust',
    contributed: false,
    notes: 'Sanders lost the starting job to Kenneth Gainwell almost immediately after the bid cleared. The $3,500 spent yielded fewer than 70 fantasy points — the most-discussed bust in BMFFFL waiver history.',
    approximate: true,
  },
  {
    id: 10,
    season: 2022, week: 8,
    owner: 'tdtd19844',
    player: 'Jeff Wilson Jr.',
    pos: 'RB', faabSpent: 2000,
    impactTier: 'Playoff Impact',
    contributed: true,
    notes: 'Wilson went to Miami and immediately became the featured back. A well-priced mid-season bid that delivered solid production during the playoff run.',
    approximate: true,
  },
  {
    id: 11,
    season: 2022, week: 11,
    owner: 'Cogdeill11',
    player: 'Taysom Hill',
    pos: 'QB', faabSpent: 750,
    impactTier: 'Depth Piece',
    contributed: true,
    notes: 'Low-cost QB streaming play during a bye-week crunch. Hill scored twice in back-to-back starts. Efficient use of modest FAAB.',
    approximate: true,
  },
  // ── 2023 ──────────────────────────────────────────────────────────────────
  {
    id: 12,
    season: 2023, week: 3,
    owner: 'JuicyBussy',
    player: "De'Von Achane",
    pos: 'RB', faabSpent: 3800,
    droppedPlayer: 'Raheem Mostert',
    impactTier: 'Championship Impact',
    contributed: true,
    notes: "Achane's 200+ yard explosion put him on every manager's radar but JuicyBussy moved fastest and biggest. The RB proved to be a season-defining acquisition in the 2023 championship run.",
    approximate: true,
  },
  {
    id: 13,
    season: 2023, week: 6,
    owner: 'MLSchools12',
    player: 'Tank Dell',
    pos: 'WR', faabSpent: 2100,
    impactTier: 'Solid Contributor',
    contributed: true,
    notes: "Dell emerged as C.J. Stroud's second target in Houston's breakout offense. Added WR depth to an already dominant MLSchools12 roster.",
    approximate: true,
  },
  {
    id: 14,
    season: 2023, week: 10,
    owner: 'Grandes',
    player: 'Joshua Dobbs',
    pos: 'QB', faabSpent: 1100,
    impactTier: 'Bust',
    contributed: false,
    notes: "Dobbs's debut in Minnesota was electric, drawing a heavy bid — but defenses quickly adjusted. Two weak performances later, Grandes moved on from the pricey streaming experiment.",
    approximate: true,
  },
  {
    id: 15,
    season: 2023, week: 7,
    owner: 'SexMachineAndyD',
    player: 'Zach Ertz',
    pos: 'TE', faabSpent: 1400,
    impactTier: 'Solid Contributor',
    contributed: true,
    notes: 'Ertz in Arizona quietly posted 5-7 targets a week for much of the season. Reliable TE streamer that paid modest dividends.',
    approximate: true,
  },
  // ── 2024 ──────────────────────────────────────────────────────────────────
  {
    id: 16,
    season: 2024, week: 2,
    owner: 'SexMachineAndyD',
    player: 'Bucky Irving',
    pos: 'RB', faabSpent: 3300,
    droppedPlayer: 'Gus Edwards',
    impactTier: 'Championship Impact',
    contributed: true,
    notes: "Irving ascended to Tampa Bay's lead back in the first weeks of the season. SexMachineAndyD's biggest single FAAB commitment in league history — it paid off handsomely.",
    approximate: true,
  },
  {
    id: 17,
    season: 2024, week: 4,
    owner: 'Escuelas',
    player: 'Kareem Hunt',
    pos: 'RB', faabSpent: 2000,
    impactTier: 'Bust',
    contributed: false,
    notes: 'Hunt was expected to be the full starter but the role was split from day one. Escuelas overspent for a committee back that never delivered on the promise.',
    approximate: true,
  },
  {
    id: 18,
    season: 2024, week: 6,
    owner: 'MLSchools12',
    player: 'Kimani Vidal',
    pos: 'RB', faabSpent: 900,
    impactTier: 'Depth Piece',
    contributed: true,
    notes: 'Speculative stash on a Chargers backfield that was evolving. Vidal saw enough touches to justify the modest investment.',
    approximate: true,
  },
  // ── 2025 ──────────────────────────────────────────────────────────────────
  {
    id: 19,
    season: 2025, week: 5,
    owner: 'tdtd19844',
    player: 'Kyren Williams',
    pos: 'RB', faabSpent: 2800,
    impactTier: 'Championship Impact',
    contributed: true,
    notes: 'Williams returned from injury and re-established himself as the LA Rams lead back. Critical mid-season addition that directly powered the 2025 championship run.',
    approximate: true,
  },
  {
    id: 20,
    season: 2025, week: 7,
    owner: 'Tubes94',
    player: 'Jaleel McLaughlin',
    pos: 'RB', faabSpent: 1200,
    impactTier: 'Solid Contributor',
    contributed: true,
    notes: "McLaughlin got expanded work in Denver's committee as injuries hit. Helped Tubes94 stay healthy at RB while navigating the playoff push.",
    approximate: true,
  },
];

// ─── Best FAAB Spends (top 5) ─────────────────────────────────────────────────

const TOP_FAAB_SPENDS = [
  {
    rank: 1,
    owner: 'JuicyBussy',
    player: "De'Von Achane",
    season: 2023,
    faabSpent: 3800,
    pos: 'RB' as Position,
    summary: 'Achane erupted for back-to-back 200+ yard games after the bid cleared. The RB was the centerpiece of the 2023 Cinderella championship run — the single best FAAB-to-championship ROI in league history.',
  },
  {
    rank: 2,
    owner: 'MLSchools12',
    player: 'Josh Jacobs',
    season: 2021,
    faabSpent: 3400,
    pos: 'RB' as Position,
    summary: 'Jacobs became the undisputed Las Vegas RB1 after the bid. He delivered 300+ season points and anchored the 2021 championship. One of the earliest examples of aggressive FAAB deciding a title.',
  },
  {
    rank: 3,
    owner: 'SexMachineAndyD',
    player: 'Bucky Irving',
    season: 2024,
    faabSpent: 3300,
    pos: 'RB' as Position,
    summary: 'Irving immediately became Tampa Bay\'s full-time starter. SexMachineAndyD\'s biggest single bid turned into the best-value RB on the waiver wire all season — an elite read on a changing backfield.',
  },
  {
    rank: 4,
    owner: 'Grandes',
    player: 'David Montgomery',
    season: 2022,
    faabSpent: 2800,
    pos: 'RB' as Position,
    summary: 'Montgomery\'s breakout role in Detroit was perfectly timed — Grandes identified the situation before most and paid appropriately. A core piece of the 2022 championship team.',
  },
  {
    rank: 5,
    owner: 'Cogdeill11',
    player: 'Dalvin Cook',
    season: 2020,
    faabSpent: 3200,
    pos: 'RB' as Position,
    summary: 'Cook\'s reclamation of the Minnesota starting role was swift and decisive. Cogdeill11\'s timely acquisition provided a top-tier RB2/1B that helped clinch the inaugural BMFFFL championship.',
  },
];

// ─── Biggest Busts ────────────────────────────────────────────────────────────

const BUSTS = [
  {
    rank: 1,
    owner: 'eldridsm',
    player: 'Miles Sanders',
    season: 2022,
    week: 6,
    faabSpent: 3500,
    pos: 'RB' as Position,
    dropped: 'James Conner',
    summary: 'Sanders immediately ceded the starting role to Kenneth Gainwell. $3,500 for a committee back who never started — and worse, Conner (dropped) continued to produce. The single worst FAAB decision in league history.',
  },
  {
    rank: 2,
    owner: 'Cmaleski',
    player: 'Damien Harris',
    season: 2021,
    week: 8,
    faabSpent: 3100,
    pos: 'RB' as Position,
    dropped: 'Rhamondre Stevenson',
    summary: 'Harris picked up an injury within weeks of the bid. Rhamondre Stevenson — dropped to make room — took over the backfield entirely. Arguably the most painful drop-to-get-a-bust in BMFFFL history.',
  },
  {
    rank: 3,
    owner: 'Grandes',
    player: 'Joshua Dobbs',
    season: 2023,
    week: 10,
    faabSpent: 1100,
    pos: 'QB' as Position,
    dropped: undefined,
    summary: "Dobbs's electric debut in Minnesota generated a hefty bid — defenses immediately game-planned him and he posted two forgettable games before being cut. A cautionary tale about reactive bidding on debut performances.",
  },
  {
    rank: 4,
    owner: 'Escuelas',
    player: 'Kareem Hunt',
    season: 2024,
    week: 4,
    faabSpent: 2000,
    pos: 'RB' as Position,
    dropped: undefined,
    summary: 'Hunt never secured a true lead-back role, sharing touches throughout. The expected single-starter scenario never materialized — Escuelas paid starting-RB prices for a committee back.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const IMPACT_STYLES: Record<ImpactTier, string> = {
  'Championship Impact': 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30',
  'Playoff Impact':      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Solid Contributor':   'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'Depth Piece':         'bg-slate-500/15 text-slate-400 border-slate-500/25',
  'Bust':                'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
};

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  K:  'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

function dollarFormat(n: number): string {
  return `$${n.toLocaleString()}`;
}

function ImpactBadge({ tier }: { tier: ImpactTier }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide whitespace-nowrap',
      IMPACT_STYLES[tier]
    )}>
      {tier}
    </span>
  );
}

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded border text-[10px] font-bold w-9',
      POS_STYLES[pos]
    )}>
      {pos}
    </span>
  );
}

type SortField = 'faab' | 'season';
type SortDir   = 'asc' | 'desc';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WaiverHistoryPage() {
  const [ownerFilter, setOwnerFilter]   = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<number | 'all'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'contributed' | 'bust'>('all');
  const [sortField, setSortField]       = useState<SortField>('faab');
  const [sortDir, setSortDir]           = useState<SortDir>('desc');

  const owners  = Array.from(new Set(WAIVER_HISTORY.map(m => m.owner))).sort();
  const seasons = [2020, 2021, 2022, 2023, 2024, 2025];

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    return WAIVER_HISTORY
      .filter(m => {
        if (ownerFilter !== 'all' && m.owner !== ownerFilter) return false;
        if (seasonFilter !== 'all' && m.season !== seasonFilter) return false;
        if (resultFilter === 'contributed' && !m.contributed) return false;
        if (resultFilter === 'bust' && m.impactTier !== 'Bust') return false;
        return true;
      })
      .sort((a, b) => {
        const mult = sortDir === 'desc' ? -1 : 1;
        if (sortField === 'faab')   return mult * (a.faabSpent - b.faabSpent);
        if (sortField === 'season') return mult * (a.season - b.season || a.week - b.week);
        return 0;
      });
  }, [ownerFilter, seasonFilter, resultFilter, sortField, sortDir]);

  // Per-season summary stats
  const seasonSummary = useMemo(() => {
    return seasons.map(s => {
      const moves = WAIVER_HISTORY.filter(m => m.season === s);
      const totalSpent = moves.reduce((acc, m) => acc + m.faabSpent, 0);
      const biggestBid = Math.max(...moves.map(m => m.faabSpent));
      const paidOff = moves.filter(m => m.contributed).length;
      return { season: s, count: moves.length, totalSpent, biggestBid, paidOff };
    });
  }, []);

  return (
    <>
      <Head>
        <title>Waiver Wire History — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL waiver wire and FAAB history — notable acquisitions, best bids, biggest busts, and season-by-season analysis across league history."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            Waiver Wire History
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Six seasons of FAAB bidding — the acquisitions that shaped championship runs and the busts that hurt.
          </p>
        </header>

        {/* FAAB system explainer */}
        <section className="mb-8 rounded-xl border border-blue-500/25 bg-blue-500/5 px-5 py-5" aria-label="FAAB system overview">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-blue-300 mb-2">How BMFFFL FAAB Works</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-0.5">Budget</p>
                  <p className="text-xs text-slate-400">Each team receives <span className="text-[#ffd700] font-bold">$10,000</span> at the start of every season. Unused FAAB does <span className="font-semibold text-slate-300">not</span> carry over — budgets reset annually.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-0.5">Blind Bidding</p>
                  <p className="text-xs text-slate-400">All FAAB bids are submitted blind. Highest bid wins the player and the amount is deducted from that team's budget for the rest of the season.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-0.5">Processing</p>
                  <p className="text-xs text-slate-400">Waivers process on a set schedule during the week. Priority for tie-bids goes to the team with the lowest waiver priority standing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Season-by-season summary */}
        <section className="mb-10" aria-labelledby="season-summary-heading">
          <h2 id="season-summary-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" aria-hidden="true" />
            Season-by-Season Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {seasonSummary.map(s => (
              <div key={s.season} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
                <p className="text-[#ffd700] font-black text-lg leading-none mb-2">{s.season}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Moves</span>
                    <span className="text-slate-300 font-semibold tabular-nums">{s.count}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Top Bid</span>
                    <span className="text-[#ffd700] font-bold tabular-nums">{dollarFormat(s.biggestBid)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Paid Off</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">{s.paidOff}/{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best FAAB Spends */}
        <section className="mb-10" aria-labelledby="best-spends-heading">
          <h2 id="best-spends-heading" className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            Best FAAB Spends in BMFFFL History
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            The five acquisitions that delivered the most meaningful return on FAAB investment — all five either directly contributed to a championship or powered a deep playoff run.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_FAAB_SPENDS.map(spend => (
              <div
                key={spend.rank}
                className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                    <span className="text-[10px] text-[#ffd700] font-bold uppercase tracking-widest">
                      #{spend.rank} All-Time
                    </span>
                  </div>
                  <PosBadge pos={spend.pos} />
                </div>
                <p className="text-base font-black text-white leading-tight">{spend.player}</p>
                <p className="text-xs text-slate-400 mt-0.5">{spend.owner} &bull; {spend.season}</p>
                <p className="text-2xl font-black text-[#ffd700] tabular-nums mt-2 mb-2">
                  {dollarFormat(spend.faabSpent)}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{spend.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Biggest Busts */}
        <section className="mb-10" aria-labelledby="busts-heading">
          <h2 id="busts-heading" className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
            Biggest FAAB Busts
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            The bids that hurt most — large commitments that yielded little or nothing in return.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUSTS.map(bust => (
              <div
                key={bust.rank}
                className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#e94560] shrink-0" aria-hidden="true" />
                    <span className="text-[10px] text-[#e94560] font-bold uppercase tracking-widest">
                      Bust #{bust.rank}
                    </span>
                  </div>
                  <PosBadge pos={bust.pos} />
                </div>
                <p className="text-base font-black text-white leading-tight">{bust.player}</p>
                <p className="text-xs text-slate-400 mt-0.5">{bust.owner} &bull; {bust.season} Week {bust.week}</p>
                <p className="text-2xl font-black text-[#e94560] tabular-nums mt-2 mb-1">
                  {dollarFormat(bust.faabSpent)}
                </p>
                {bust.dropped && (
                  <p className="text-[11px] text-amber-500 mb-2">Dropped to acquire: {bust.dropped}</p>
                )}
                <p className="text-xs text-slate-400 leading-relaxed">{bust.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Historical moves table */}
        <section aria-labelledby="history-table-heading">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <h2 id="history-table-heading" className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" aria-hidden="true" />
              All Notable Acquisitions
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">{filtered.length} of {WAIVER_HISTORY.length} moves</span>
          </div>

          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="wh-owner-filter" className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                Owner
              </label>
              <select
                id="wh-owner-filter"
                value={ownerFilter}
                onChange={e => setOwnerFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All Owners</option>
                {owners.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="wh-season-filter" className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                Season
              </label>
              <select
                id="wh-season-filter"
                value={String(seasonFilter)}
                onChange={e => setSeasonFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All Seasons</option>
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="wh-result-filter" className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                Result
              </label>
              <select
                id="wh-result-filter"
                value={resultFilter}
                onChange={e => setResultFilter(e.target.value as 'all' | 'contributed' | 'bust')}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40"
              >
                <option value="all">All Results</option>
                <option value="contributed">Contributed (Paid Off)</option>
                <option value="bust">Busts Only</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-3">
            {(['Championship Impact', 'Playoff Impact', 'Solid Contributor', 'Depth Piece', 'Bust'] as ImpactTier[]).map(tier => (
              <ImpactBadge key={tier} tier={tier} />
            ))}
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Waiver wire historical moves">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-14">
                      Pos
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">
                      Owner
                    </th>
                    <th
                      scope="col"
                      onClick={() => toggleSort('season')}
                      className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell cursor-pointer hover:text-white transition-colors w-24"
                      aria-sort={sortField === 'season' ? (sortDir === 'desc' ? 'descending' : 'ascending') : 'none'}
                    >
                      <span className="inline-flex items-center gap-1">
                        Season
                        {sortField === 'season' && (
                          <span className="text-[#ffd700] text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      scope="col"
                      onClick={() => toggleSort('faab')}
                      className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider cursor-pointer hover:text-white transition-colors w-28"
                      aria-sort={sortField === 'faab' ? (sortDir === 'desc' ? 'descending' : 'ascending') : 'none'}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        FAAB Bid
                        {sortField === 'faab' && (
                          <span className="text-[#ffd700] text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>
                        )}
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Impact
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-sm">
                        No moves match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((move, idx) => {
                      const isChamp = move.impactTier === 'Championship Impact';
                      const isBust  = move.impactTier === 'Bust';
                      return (
                        <tr
                          key={move.id}
                          className={cn(
                            'transition-colors duration-100 hover:bg-[#1f3550]',
                            isChamp ? 'bg-[#ffd700]/3' :
                            isBust  ? 'bg-[#e94560]/3' :
                            idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isChamp && <Star className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />}
                              {isBust  && <AlertTriangle className="w-3 h-3 text-[#e94560] shrink-0" aria-hidden="true" />}
                              <span className="font-semibold text-white text-sm">{move.player}</span>
                            </div>
                            {move.droppedPlayer && (
                              <p className="text-[11px] text-slate-500 mt-0.5">Dropped: {move.droppedPlayer}</p>
                            )}
                            {/* mobile sub-line */}
                            <p className="text-[11px] text-slate-500 mt-0.5 sm:hidden">
                              {move.owner} &bull; {move.season} Wk{move.week}
                            </p>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <PosBadge pos={move.pos} />
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs text-slate-300 font-medium">{move.owner}</span>
                            <p className="text-[11px] text-slate-500 mt-0.5 md:hidden">{move.season} Wk{move.week}</p>
                          </td>
                          <td className="px-3 py-3 text-center hidden md:table-cell">
                            <span className="text-xs font-mono text-slate-400 tabular-nums">{move.season}</span>
                            <p className="text-[10px] text-slate-600 mt-0.5">Wk {move.week}</p>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span className={cn(
                              'text-sm font-black font-mono tabular-nums',
                              isChamp ? 'text-[#ffd700]' :
                              isBust  ? 'text-[#e94560]' :
                              'text-slate-300'
                            )}>
                              {dollarFormat(move.faabSpent)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <ImpactBadge tier={move.impactTier} />
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <p className="text-xs text-slate-400 leading-snug line-clamp-2 max-w-xs">
                              {move.notes}
                            </p>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Notable patterns / insights */}
        <section className="mt-10 mb-6" aria-labelledby="insights-heading">
          <h2 id="insights-heading" className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" aria-hidden="true" />
            Waiver Wire Patterns Across League History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'RBs Dominate the Market',
                body: 'Running backs represent the majority of high-value FAAB bids in BMFFFL history. Every championship-winning acquisition in this dataset is an RB — reflecting the position\'s scarcity and volatility in dynasty formats.',
              },
              {
                title: 'Early-Season Bids Pay Off Most',
                body: 'The best FAAB acquisitions tend to happen in weeks 2–6, when role changes are fresh and ownership is low. Waiting too long cuts into the games available for the player to contribute.',
              },
              {
                title: 'The Drop Is as Important as the Add',
                body: 'Two of the league\'s biggest busts involved dropping productive players (Conner, Stevenson) to acquire duds. Evaluating what you\'re giving up is as critical as evaluating what you\'re getting.',
              },
            ].map(insight => (
              <div key={insight.title} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
                <p className="text-sm font-bold text-white mb-2">{insight.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Historical FAAB data is approximate.</span>{' '}
            The acquisitions shown represent representative illustrative data reconstructed from league narratives and publicly known player-role changes.
            Exact bid amounts, week numbers, and dropped players may vary from actual transactions.
            Live transaction data — including exact FAAB amounts, timestamps, and full bid history — will be available via Sleeper API in Phase G integration.
          </p>
        </div>

        <p className="mt-6 text-[11px] text-center text-slate-700">
          * All data approximate. BMFFFL FAAB: $10,000/season, blind bidding, resets annually. Phase G delivers exact live data.
        </p>

      </div>
    </>
  );
}
