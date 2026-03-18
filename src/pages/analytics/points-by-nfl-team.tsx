import Head from 'next/head';
import { BarChart2, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type OffenseRating = 'ELITE' | 'GREAT' | 'SOLID' | 'AVERAGE' | 'BELOW' | 'AVOID';

interface NflTeamRow {
  rank: number;
  team: string;
  city: string;
  conf: string;
  estPoints: number;
  playerCount: number;
  offenseRating: OffenseRating;
  topPlayer: string;
  note: string;
}

interface ManagerExposure {
  manager: string;
  topTeams: { team: string; count: number }[];
  stackRisk: boolean;
  riskNote?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// 32 NFL teams — estimated total fantasy points from players on BMFFFL rosters
const NFL_TEAMS: NflTeamRow[] = [
  {
    rank: 1, team: 'KC', city: 'Kansas City', conf: 'AFC',
    estPoints: 1842, playerCount: 8, offenseRating: 'ELITE',
    topPlayer: 'Rashee Rice', note: 'Mahomes system elevates every skill player',
  },
  {
    rank: 2, team: 'MIA', city: 'Miami', conf: 'AFC',
    estPoints: 1724, playerCount: 7, offenseRating: 'ELITE',
    topPlayer: 'Jaylen Waddle', note: 'High-velocity passing game, max YAC scheme',
  },
  {
    rank: 3, team: 'CIN', city: 'Cincinnati', conf: 'AFC',
    estPoints: 1668, playerCount: 6, offenseRating: 'ELITE',
    topPlayer: 'Tee Higgins', note: 'Burrow spreads targets across elite route runners',
  },
  {
    rank: 4, team: 'LAR', city: 'Los Angeles', conf: 'NFC',
    estPoints: 1611, playerCount: 7, offenseRating: 'GREAT',
    topPlayer: 'Puka Nacua', note: 'McVay scheme creates volume for WRs',
  },
  {
    rank: 5, team: 'BUF', city: 'Buffalo', conf: 'AFC',
    estPoints: 1588, playerCount: 6, offenseRating: 'GREAT',
    topPlayer: 'James Cook', note: 'Allen extends plays; Cook benefits from positive script',
  },
  {
    rank: 6, team: 'PHI', city: 'Philadelphia', conf: 'NFC',
    estPoints: 1502, playerCount: 5, offenseRating: 'GREAT',
    topPlayer: 'A.J. Brown', note: 'Run-balanced offense with elite TE upside',
  },
  {
    rank: 7, team: 'SF', city: 'San Francisco', conf: 'NFC',
    estPoints: 1488, playerCount: 5, offenseRating: 'GREAT',
    topPlayer: 'Deebo Samuel', note: 'Shanahan system produces every year regardless of QB',
  },
  {
    rank: 8, team: 'DET', city: 'Detroit', conf: 'NFC',
    estPoints: 1456, playerCount: 6, offenseRating: 'GREAT',
    topPlayer: 'Sam LaPorta', note: 'Goff deploys LaPorta and St. Brown heavily',
  },
  {
    rank: 9, team: 'HOU', city: 'Houston', conf: 'AFC',
    estPoints: 1394, playerCount: 5, offenseRating: 'SOLID',
    topPlayer: 'Tank Dell', note: 'Stroud targets improving — offensive line concern',
  },
  {
    rank: 10, team: 'DAL', city: 'Dallas', conf: 'NFC',
    estPoints: 1342, playerCount: 5, offenseRating: 'SOLID',
    topPlayer: 'CeeDee Lamb', note: 'Lamb ceiling alone justifies solid rating',
  },
  {
    rank: 11, team: 'JAX', city: 'Jacksonville', conf: 'AFC',
    estPoints: 1318, playerCount: 4, offenseRating: 'SOLID',
    topPlayer: 'Brian Thomas Jr.', note: 'Year 2 breakout candidate carries this ranking',
  },
  {
    rank: 12, team: 'MIN', city: 'Minnesota', conf: 'NFC',
    estPoints: 1304, playerCount: 4, offenseRating: 'SOLID',
    topPlayer: 'Justin Jefferson', note: 'JJ is top-2 WR. Offense beyond him is inconsistent.',
  },
  {
    rank: 13, team: 'SEA', city: 'Seattle', conf: 'NFC',
    estPoints: 1268, playerCount: 4, offenseRating: 'SOLID',
    topPlayer: 'Tyler Lockett', note: 'Geno/new QB transition adds variance',
  },
  {
    rank: 14, team: 'ATL', city: 'Atlanta', conf: 'NFC',
    estPoints: 1254, playerCount: 5, offenseRating: 'SOLID',
    topPlayer: 'Drake London', note: 'Bijan + London + Pitts — dangerous depth chart',
  },
  {
    rank: 15, team: 'GB', city: 'Green Bay', conf: 'NFC',
    estPoints: 1238, playerCount: 4, offenseRating: 'SOLID',
    topPlayer: 'Tucker Kraft', note: 'Jordan Love Year 3 — steady upward curve',
  },
  {
    rank: 16, team: 'DEN', city: 'Denver', conf: 'AFC',
    estPoints: 1196, playerCount: 4, offenseRating: 'AVERAGE',
    topPlayer: 'Bo Nix', note: 'Year 2 QB upside; Courtland Sutton the floor',
  },
  {
    rank: 17, team: 'IND', city: 'Indianapolis', conf: 'AFC',
    estPoints: 1182, playerCount: 4, offenseRating: 'AVERAGE',
    topPlayer: 'Adonai Mitchell', note: 'Richardson health the only question',
  },
  {
    rank: 18, team: 'TB', city: 'Tampa Bay', conf: 'NFC',
    estPoints: 1174, playerCount: 4, offenseRating: 'AVERAGE',
    topPlayer: 'Bucky Irving', note: 'Baker steady, not spectacular',
  },
  {
    rank: 19, team: 'WAS', city: 'Washington', conf: 'NFC',
    estPoints: 1158, playerCount: 3, offenseRating: 'AVERAGE',
    topPlayer: 'Terry McLaurin', note: 'Daniels Year 2 could push this higher',
  },
  {
    rank: 20, team: 'BAL', city: 'Baltimore', conf: 'AFC',
    estPoints: 1144, playerCount: 3, offenseRating: 'AVERAGE',
    topPlayer: 'Zay Flowers', note: 'Run-first limits fantasy ceiling for pass catchers',
  },
  {
    rank: 21, team: 'LAC', city: 'Los Angeles', conf: 'AFC',
    estPoints: 1122, playerCount: 3, offenseRating: 'AVERAGE',
    topPlayer: 'Joshua Palmer', note: 'Herbert upside if OL improves',
  },
  {
    rank: 22, team: 'NYJ', city: 'New York', conf: 'AFC',
    estPoints: 1086, playerCount: 3, offenseRating: 'AVERAGE',
    topPlayer: 'Garrett Wilson', note: 'Wilson always finds targets regardless of QB play',
  },
  {
    rank: 23, team: 'PIT', city: 'Pittsburgh', conf: 'AFC',
    estPoints: 1048, playerCount: 3, offenseRating: 'BELOW',
    topPlayer: 'George Pickens', note: 'Franchise QB situation unresolved',
  },
  {
    rank: 24, team: 'ARI', city: 'Arizona', conf: 'NFC',
    estPoints: 1034, playerCount: 3, offenseRating: 'BELOW',
    topPlayer: 'Marvin Harrison Jr.', note: 'MHJ talent offsets weak surrounding cast',
  },
  {
    rank: 25, team: 'CHI', city: 'Chicago', conf: 'NFC',
    estPoints: 1018, playerCount: 3, offenseRating: 'BELOW',
    topPlayer: 'Rome Odunze', note: 'Caleb Williams Year 2 — improvement expected',
  },
  {
    rank: 26, team: 'NO', city: 'New Orleans', conf: 'NFC',
    estPoints: 982, playerCount: 2, offenseRating: 'BELOW',
    topPlayer: 'Chris Olave', note: 'Post-brees wasteland continues',
  },
  {
    rank: 27, team: 'CLE', city: 'Cleveland', conf: 'AFC',
    estPoints: 948, playerCount: 2, offenseRating: 'BELOW',
    topPlayer: 'Amari Cooper', note: 'Deshaun Watson\' status looms large',
  },
  {
    rank: 28, team: 'TEN', city: 'Tennessee', conf: 'AFC',
    estPoints: 886, playerCount: 2, offenseRating: 'AVOID',
    topPlayer: 'DeAndre Hopkins', note: 'Rebuilding with no clear offensive identity',
  },
  {
    rank: 29, team: 'NE', city: 'New England', conf: 'AFC',
    estPoints: 842, playerCount: 2, offenseRating: 'AVOID',
    topPlayer: 'Rhamondre Stevenson', note: 'Post-Belichick transition still messy',
  },
  {
    rank: 30, team: 'NYG', city: 'New York', conf: 'NFC',
    estPoints: 824, playerCount: 3, offenseRating: 'AVOID',
    topPlayer: 'Malik Nabers', note: 'Nabers the lone bright spot on a broken offense',
  },
  {
    rank: 31, team: 'CAR', city: 'Carolina', conf: 'NFC',
    estPoints: 798, playerCount: 2, offenseRating: 'AVOID',
    topPlayer: 'Jonathon Brooks', note: 'Full rebuild — fantasy value only from high-upside youth',
  },
  {
    rank: 32, team: 'LV', city: 'Las Vegas', conf: 'AFC',
    estPoints: 754, playerCount: 3, offenseRating: 'AVOID',
    topPlayer: 'Brock Bowers', note: 'Bowers is TE1 despite awful offense around him',
  },
];

const MANAGER_EXPOSURE: ManagerExposure[] = [
  {
    manager:   'mlschools12',
    topTeams:  [{ team: 'KC', count: 3 }, { team: 'BUF', count: 2 }, { team: 'CIN', count: 1 }],
    stackRisk: true,
    riskNote:  '3 KC players — a Mahomes down year hits this roster hard.',
  },
  {
    manager:   'tubes94',
    topTeams:  [{ team: 'LAR', count: 2 }, { team: 'MIA', count: 2 }, { team: 'ATL', count: 1 }],
    stackRisk: false,
  },
  {
    manager:   'JuicyBussy',
    topTeams:  [{ team: 'MIA', count: 3 }, { team: 'ARI', count: 1 }, { team: 'BUF', count: 1 }],
    stackRisk: true,
    riskNote:  'JuicyBussy has 3 players from MIA. A Dolphins bad season = disaster.',
  },
  {
    manager:   'tdtd19844',
    topTeams:  [{ team: 'DET', count: 2 }, { team: 'GB', count: 2 }, { team: 'IND', count: 1 }],
    stackRisk: false,
  },
  {
    manager:   'rbr',
    topTeams:  [{ team: 'SF', count: 2 }, { team: 'HOU', count: 2 }, { team: 'CIN', count: 1 }],
    stackRisk: false,
  },
  {
    manager:   'SexMachineAndyD',
    topTeams:  [{ team: 'CAR', count: 2 }, { team: 'PHI', count: 2 }, { team: 'TB', count: 1 }],
    stackRisk: true,
    riskNote:  'CAR stack is a bet on Jonathon Brooks — high variance.',
  },
  {
    manager:   'Cmaleski',
    topTeams:  [{ team: 'ATL', count: 2 }, { team: 'MIN', count: 2 }, { team: 'JAX', count: 1 }],
    stackRisk: false,
  },
  {
    manager:   'grandes',
    topTeams:  [{ team: 'DAL', count: 2 }, { team: 'SEA', count: 1 }, { team: 'NO', count: 1 }],
    stackRisk: true,
    riskNote:  'DAL dependency — CeeDee Lamb injury would devastate this roster.',
  },
  {
    manager:   'cogdeill11',
    topTeams:  [{ team: 'BUF', count: 2 }, { team: 'LAC', count: 1 }, { team: 'NYJ', count: 1 }],
    stackRisk: false,
  },
  {
    manager:   'escuelas',
    topTeams:  [{ team: 'CIN', count: 2 }, { team: 'WAS', count: 2 }, { team: 'PIT', count: 1 }],
    stackRisk: false,
  },
  {
    manager:   'eldridm20',
    topTeams:  [{ team: 'LV', count: 2 }, { team: 'KC', count: 1 }, { team: 'NYG', count: 1 }],
    stackRisk: true,
    riskNote:  'LV reliance is Bowers-dependent. Any drop-off in Las Vegas = problem.',
  },
  {
    manager:   'eldridsm',
    topTeams:  [{ team: 'DEN', count: 2 }, { team: 'DET', count: 1 }, { team: 'GB', count: 1 }],
    stackRisk: false,
  },
];

// ─── Rating config ────────────────────────────────────────────────────────────

const RATING_CONFIG: Record<OffenseRating, { color: string; bg: string; border: string }> = {
  ELITE:   { color: '#ffd700', bg: 'bg-yellow-500/10',  border: 'border-yellow-500/40' },
  GREAT:   { color: '#4ade80', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' },
  SOLID:   { color: '#60a5fa', bg: 'bg-blue-500/10',    border: 'border-blue-500/40' },
  AVERAGE: { color: '#94a3b8', bg: 'bg-slate-500/10',   border: 'border-slate-500/40' },
  BELOW:   { color: '#fb923c', bg: 'bg-orange-500/10',  border: 'border-orange-500/40' },
  AVOID:   { color: '#e94560', bg: 'bg-red-500/10',     border: 'border-red-500/40' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatingBadge({ rating }: { rating: OffenseRating }) {
  const cfg = RATING_CONFIG[rating];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shrink-0',
        cfg.bg,
        cfg.border
      )}
      style={{ color: cfg.color }}
    >
      {rating}
    </span>
  );
}

function PointsBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 85 ? '#ffd700' :
    pct >= 70 ? '#4ade80' :
    pct >= 55 ? '#60a5fa' :
    pct >= 40 ? '#94a3b8' :
    pct >= 25 ? '#fb923c' : '#e94560';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums text-slate-400 w-14 text-right shrink-0">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PointsByNflTeamPage() {
  const maxPoints = NFL_TEAMS[0].estPoints;
  const top5      = NFL_TEAMS.slice(0, 5);
  const bottom5   = NFL_TEAMS.slice(-5).reverse();
  const riskManagers = MANAGER_EXPOSURE.filter((m) => m.stackRisk);

  const ratingGroups = (Object.keys(RATING_CONFIG) as OffenseRating[]).map((rating) => ({
    rating,
    teams: NFL_TEAMS.filter((t) => t.offenseRating === rating),
  }));

  return (
    <>
      <Head>
        <title>Fantasy Points by NFL Team | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Which NFL franchises power the most BMFFFL dynasty production? Rankings, roster exposure, stack risk, and offense quality ratings for all 32 teams."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
            Fantasy Points by NFL Team
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            Which NFL franchises power the most BMFFFL production? Roster exposure, stack risk,
            and offense quality ratings across all 32 teams.
          </p>
        </div>
      </section>

      {/* ── League stat strip ────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'NFL Teams Represented', value: '32', accent: '#60a5fa' },
              { label: 'Top Franchise', value: 'Kansas City', sub: '#1 by est. pts', accent: '#ffd700' },
              { label: 'Managers with Stack Risk', value: `${riskManagers.length}/12`, accent: '#e94560' },
              { label: 'ELITE Offenses', value: String(NFL_TEAMS.filter((t) => t.offenseRating === 'ELITE').length), sub: 'On BMFFFL rosters', accent: '#4ade80' },
            ].map(({ label, value, sub, accent }) => (
              <div
                key={label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 text-center"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                <div className="text-xl font-black" style={{ color: accent }}>{value}</div>
                {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top 5 / Bottom 5 ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-6">Top &amp; Bottom Franchises</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#4ade80]" aria-hidden="true" />
                <h3 className="font-black text-white text-sm uppercase tracking-wide">Top 5 — Most Fantasy Points</h3>
              </div>
              <div className="flex flex-col gap-2">
                {top5.map((t) => (
                  <div
                    key={t.team}
                    className="bg-[#16213e] border border-[#2d4a66] rounded-lg px-4 py-3"
                    style={{ borderLeft: `3px solid ${RATING_CONFIG[t.offenseRating].color}` }}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-mono text-slate-600 w-4 shrink-0">#{t.rank}</span>
                      <span className="font-black text-white text-sm">{t.city} {t.team}</span>
                      <RatingBadge rating={t.offenseRating} />
                      <span className="text-xs text-slate-500 ml-auto shrink-0">{t.playerCount} players</span>
                    </div>
                    <PointsBar value={t.estPoints} max={maxPoints} />
                    <p className="text-[11px] text-slate-500 mt-1.5 pl-7 italic">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 5 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
                <h3 className="font-black text-white text-sm uppercase tracking-wide">Bottom 5 — Fewest Fantasy Points</h3>
              </div>
              <div className="flex flex-col gap-2">
                {bottom5.map((t) => (
                  <div
                    key={t.team}
                    className="bg-[#16213e] border border-[#2d4a66] rounded-lg px-4 py-3"
                    style={{ borderLeft: `3px solid ${RATING_CONFIG[t.offenseRating].color}` }}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-mono text-slate-600 w-4 shrink-0">#{t.rank}</span>
                      <span className="font-black text-white text-sm">{t.city} {t.team}</span>
                      <RatingBadge rating={t.offenseRating} />
                      <span className="text-xs text-slate-500 ml-auto shrink-0">{t.playerCount} players</span>
                    </div>
                    <PointsBar value={t.estPoints} max={maxPoints} />
                    <p className="text-[11px] text-slate-500 mt-1.5 pl-7 italic">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full 32-team rankings table ──────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">All 32 NFL Teams — Fantasy Contribution Rankings</h2>
          <p className="text-slate-400 text-sm mb-6">
            Estimated total dynasty fantasy points contributed by players from each NFL team on BMFFFL rosters.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  {['Rank', 'Team', 'Conference', 'Est. Pts', 'Players', 'Quality', 'Top Player'].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NFL_TEAMS.map((t) => (
                  <tr
                    key={t.team}
                    className="border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100"
                  >
                    <td className="py-2.5 pr-4">
                      <span className={cn(
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black tabular-nums',
                        t.rank <= 5  ? 'bg-[#ffd700] text-[#0d1b2a]' :
                        t.rank <= 10 ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40' :
                        t.rank >= 28 ? 'bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/40' :
                        'bg-[#16213e] text-slate-500 border border-[#2d4a66]'
                      )}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white">{t.team}</span>
                        <span className="text-xs text-slate-500 hidden sm:block">{t.city}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs">{t.conf}</td>
                    <td className="py-2.5 pr-4 font-bold text-slate-300 tabular-nums">{t.estPoints.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-slate-400 tabular-nums">{t.playerCount}</td>
                    <td className="py-2.5 pr-4"><RatingBadge rating={t.offenseRating} /></td>
                    <td className="py-2.5 pr-4 text-slate-400 text-xs">{t.topPlayer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Manager exposure section ─────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">BMFFFL Roster Exposure</h2>
          <p className="text-slate-400 text-sm mb-6">
            Top 3 NFL teams each BMFFFL manager's players come from. High concentration in one team creates stack risk.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANAGER_EXPOSURE.map((m) => (
              <div
                key={m.manager}
                className={cn(
                  'bg-[#16213e] border rounded-xl p-4 transition-colors duration-150',
                  m.stackRisk
                    ? 'border-[#e94560]/30 hover:border-[#e94560]/50'
                    : 'border-[#2d4a66] hover:border-[#3a5a7a]'
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-black text-white text-sm">{m.manager}</span>
                  {m.stackRisk && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-red-500/10 border border-red-500/40 text-[#e94560]">
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      Stack Risk
                    </span>
                  )}
                </div>

                {/* Team pills */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {m.topTeams.map(({ team, count }) => {
                    const nflRow = NFL_TEAMS.find((t) => t.team === team);
                    const rating = nflRow?.offenseRating ?? 'AVERAGE';
                    const color  = RATING_CONFIG[rating].color;
                    return (
                      <div
                        key={team}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]"
                      >
                        <span className="font-black text-sm" style={{ color }}>{team}</span>
                        <span className="text-[11px] text-slate-500">{count} players</span>
                      </div>
                    );
                  })}
                </div>

                {/* Risk note */}
                {m.riskNote && (
                  <p className="text-xs text-[#e94560]/70 leading-relaxed italic mt-2">
                    {m.riskNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack risk callout ───────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Correlation Risk Analysis</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Managers with high exposure to the same NFL team face "stack risk." If that NFL team
            underperforms, multiple BMFFFL players take the hit simultaneously.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {riskManagers.map((m) => (
              <div
                key={m.manager}
                className="bg-[#16213e] border border-[#e94560]/30 rounded-xl p-4"
                style={{ borderLeft: '3px solid #e94560' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#e94560] shrink-0" aria-hidden="true" />
                  <span className="font-black text-white text-sm">{m.manager}</span>
                </div>
                <p className="text-xs text-[#e94560]/80 leading-relaxed italic">{m.riskNote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offense quality ratings ──────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#60a5fa]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Offense Quality Ratings — All 32 Teams</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Dynasty fantasy value rating for each NFL franchise. ELITE offenses produce sustained
            multi-year value; AVOID offenses are actively harmful to hold.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratingGroups.map(({ rating, teams }) => {
              const cfg = RATING_CONFIG[rating];
              return (
                <div
                  key={rating}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4"
                  style={{ borderTop: `3px solid ${cfg.color}` }}
                >
                  <div className="mb-3">
                    <RatingBadge rating={rating} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {teams.map((t) => (
                      <span
                        key={t.team}
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: `${cfg.color}15`,
                          color:            cfg.color,
                          border:           `1px solid ${cfg.color}30`,
                        }}
                      >
                        {t.team}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bimfle note ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#16213e] border border-[#ffd700]/30 rounded-xl p-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#ffd700] text-lg">~</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Commissioner's Note</span>
            </div>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                The Kansas City Chiefs have been, and continue to be, the most important NFL franchise
                in dynasty fantasy football. Patrick Mahomes transforms ordinary skill players into
                production. This is both a blessing and a dependency risk.
              </p>
              <p>
                JuicyBussy's three-player Miami stack is the league's most volatile roster construction.
                If the Dolphins offense declines — and their offensive line suggests it may — that
                entire roster experiences simultaneous turbulence. This is not a criticism. It is a
                structural observation.
              </p>
            </div>
            <div className="mt-3 text-right text-xs text-[#ffd700] font-black tracking-wide">~Love, Bimfle.</div>
          </div>
        </div>
      </section>
    </>
  );
}
