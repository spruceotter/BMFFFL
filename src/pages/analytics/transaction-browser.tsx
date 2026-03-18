import { useState, useMemo } from 'react';
import Head from 'next/head';
import { ArrowLeftRight, Zap, Trash2, Trophy, Search, Filter, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Season = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;
type TxType = 'TRADE' | 'WAIVER' | 'DROP';
type ImpactRating = 1 | 2 | 3;

interface Transaction {
  id: string;
  type: TxType;
  season: Season;
  date: string;
  manager: string;
  otherManager?: string;
  description: string;
  assets: string[];
  impact: ImpactRating;
  verdict: string;
  hallOfFame?: boolean;
}

// ─── Transaction Data ─────────────────────────────────────────────────────────

const TRANSACTIONS: Transaction[] = [
  // ── TRADES ──────────────────────────────────────────────────────────────────
  {
    id: 'tx001',
    type: 'TRADE',
    season: 2023,
    date: 'Off-season 2023',
    manager: 'JuicyBussy',
    otherManager: 'MLSchools12',
    description: 'JuicyBussy acquires Bijan Robinson from MLSchools12.',
    assets: ['JuicyBussy receives: Bijan Robinson', 'MLSchools12 receives: 2023 1.03 + Travis Kelce'],
    impact: 3,
    verdict: 'Bijan became a top-3 dynasty RB; Kelce was aging and the pick became an afterthought.',
    hallOfFame: true,
  },
  {
    id: 'tx002',
    type: 'TRADE',
    season: 2022,
    date: 'Off-season 2022',
    manager: 'rbr',
    otherManager: 'eldridsm',
    description: 'rbr acquires Lamar Jackson from eldridsm.',
    assets: ['rbr receives: Lamar Jackson', 'eldridsm receives: 2022 1.01 + 2022 2.01'],
    impact: 3,
    verdict: 'eldridsm traded away a dual-threat franchise QB for picks that never materialized into stars.',
    hallOfFame: true,
  },
  {
    id: 'tx003',
    type: 'TRADE',
    season: 2022,
    date: 'Off-season 2022–23',
    manager: 'tdtd19844',
    otherManager: 'MLSchools12',
    description: 'tdtd19844 ships Justin Jefferson and Davante Adams to MLSchools12 for a massive pick haul.',
    assets: [
      'MLSchools12 receives: Justin Jefferson + Davante Adams',
      'tdtd19844 receives: 2023 1.01 + 2023 1.04 + 2024 1st',
    ],
    impact: 3,
    verdict: 'One of the league\'s great gambles — tdtd19844 bet on picks over proven studs.',
    hallOfFame: true,
  },
  {
    id: 'tx004',
    type: 'TRADE',
    season: 2021,
    date: 'Off-season 2021',
    manager: 'Tubes94',
    otherManager: 'rbr',
    description: 'Tubes94 acquires Breece Hall from rbr.',
    assets: ['Tubes94 receives: Breece Hall', 'rbr receives: 2022 1.02 + 2022 1.06'],
    impact: 2,
    verdict: 'Tubes94 added a young RB who became a dynasty cornerstone; rbr got good value but sold low on ceiling.',
  },
  {
    id: 'tx005',
    type: 'TRADE',
    season: 2024,
    date: 'Off-season 2024',
    manager: 'Cmaleski',
    otherManager: 'SexMachineAndyD',
    description: 'Cmaleski deals AJ Brown and a pick for Cooper Kupp, Jaylen Waddle, and a future first.',
    assets: [
      'SexMachineAndyD receives: AJ Brown + 2024 1.04',
      'Cmaleski receives: Cooper Kupp + Jaylen Waddle + 2025 1st',
    ],
    impact: 2,
    verdict: 'Cmaleski spread WR risk across volume and upside; AJ Brown remained elite — SexMachineAndyD won the moment.',
  },
  {
    id: 'tx006',
    type: 'TRADE',
    season: 2021,
    date: '2021 Season',
    manager: 'Grandes',
    otherManager: 'eldridm20',
    description: 'Grandes ships Josh Allen and a pick for Derrick Henry and a second-rounder.',
    assets: ['eldridm20 receives: Josh Allen + 2022 1.03', 'Grandes receives: Derrick Henry + 2022 2nd'],
    impact: 2,
    verdict: 'Grandes sold an elite QB for a declining RB — a move widely regarded as a strategic misstep.',
  },
  {
    id: 'tx007',
    type: 'TRADE',
    season: 2020,
    date: 'Start-up 2020',
    manager: 'MLSchools12',
    otherManager: 'Various',
    description: 'MLSchools12 acquires Lamar Jackson during start-up draft and establishes dynasty foundation.',
    assets: ['MLSchools12 secures Lamar Jackson as a centerpiece franchise QB'],
    impact: 2,
    verdict: 'The cornerstone acquisition that powered MLSchools12\'s dynasty contention window.',
  },
  {
    id: 'tx008',
    type: 'TRADE',
    season: 2024,
    date: '2024 Season',
    manager: 'tdtd19844',
    otherManager: 'Various',
    description: 'tdtd19844 trades multiple picks and veterans to rebuild roster around young core.',
    assets: ['tdtd19844 moves aging veterans for young talent and future capital'],
    impact: 2,
    verdict: 'A full commitment to a youth-first rebuild — the results will play out in 2026 and beyond.',
  },
  {
    id: 'tx009',
    type: 'TRADE',
    season: 2023,
    date: '2023 Season',
    manager: 'rbr',
    otherManager: 'Various',
    description: 'rbr trades aging veterans for draft picks in a rebuild attempt.',
    assets: ['rbr moves veteran pieces for pick capital and future flexibility'],
    impact: 1,
    verdict: 'A mid-cycle pivot that acknowledged the aging roster — picks became the currency of a new era.',
  },
  {
    id: 'tx010',
    type: 'TRADE',
    season: 2022,
    date: '2022 Season',
    manager: 'eldridsm',
    otherManager: 'rbr',
    description: 'eldridsm trades Lamar Jackson — later cited publicly as a significant regret.',
    assets: ['eldridsm receives: 2022 1.01 + 2022 2.01', 'rbr receives: Lamar Jackson'],
    impact: 3,
    verdict: 'The trade eldridsm still talks about. Lamar\'s trajectory post-trade made this a defining league moment.',
    hallOfFame: false,
  },
  {
    id: 'tx011',
    type: 'TRADE',
    season: 2023,
    date: 'Mar 2023',
    manager: 'JuicyBussy',
    otherManager: 'Tubes94',
    description: 'JuicyBussy acquires De\'Von Achane\'s draft rights ahead of the 2023 NFL Draft.',
    assets: [
      'JuicyBussy receives: De\'Von Achane (2023 pick)',
      'Tubes94 receives: 2024 1st + 2023 3rd',
    ],
    impact: 3,
    verdict: 'JuicyBussy stole Achane\'s rights at a discount — he became an instant dynasty RB1.',
  },
  {
    id: 'tx012',
    type: 'TRADE',
    season: 2022,
    date: 'Feb 2022',
    manager: 'rbr',
    otherManager: 'SexMachineAndyD',
    description: 'rbr ships Patrick Mahomes for Lamar Jackson and two first-round picks.',
    assets: [
      'rbr receives: Lamar Jackson + 2021 1.06 + 2022 1st',
      'SexMachineAndyD receives: Patrick Mahomes + 2021 2nd',
    ],
    impact: 2,
    verdict: 'rbr swapped one elite QB for another plus significant capital — both QBs remained elite.',
  },
  {
    id: 'tx013',
    type: 'TRADE',
    season: 2023,
    date: 'Oct 2023',
    manager: 'Cogdeill11',
    otherManager: 'MLSchools12',
    description: 'Cogdeill11 flips Ja\'Marr Chase for CeeDee Lamb and a rookie receiver plus capital.',
    assets: [
      'MLSchools12 receives: Ja\'Marr Chase + 2024 3rd',
      'Cogdeill11 receives: CeeDee Lamb + Puka Nacua (rookie) + 2024 2nd',
    ],
    impact: 2,
    verdict: 'The most-talked-about trade of the 2023 season — a lateral move with serious ripple effects.',
  },
  {
    id: 'tx014',
    type: 'TRADE',
    season: 2025,
    date: 'Mar 2025',
    manager: 'rbr',
    otherManager: 'tdtd19844',
    description: 'rbr adds Tetairoa McMillan\'s draft rights ahead of the 2025 season.',
    assets: [
      'rbr receives: Tetairoa McMillan (2025 pick) + 2026 2nd + 2026 3rd',
      'tdtd19844 receives: Elic Ayomanor (2025 pick) + 2026 1st',
    ],
    impact: 2,
    verdict: 'McMillan anchored rbr\'s championship run — the draft pick acquisition of the 2025 off-season.',
  },
  {
    id: 'tx015',
    type: 'TRADE',
    season: 2025,
    date: 'Dec 2025',
    manager: 'rbr',
    otherManager: 'SexMachineAndyD',
    description: 'rbr adds Jonathan Taylor and Harold Fannin Jr. for picks at the trade deadline.',
    assets: [
      'rbr receives: Jonathan Taylor + Harold Fannin Jr.',
      'SexMachineAndyD receives: 2026 1st (late) + 2026 2nd',
    ],
    impact: 3,
    verdict: 'The championship-window move that put rbr over the top — Taylor\'s playoff surge was decisive.',
    hallOfFame: false,
  },

  // ── WAIVER ADDS ─────────────────────────────────────────────────────────────
  {
    id: 'tx016',
    type: 'WAIVER',
    season: 2025,
    date: '2025 Week 4',
    manager: 'Tubes94',
    description: 'Tubes94 adds De\'Von Achane off waivers with $42 FAAB.',
    assets: ['De\'Von Achane added — $42 FAAB spent'],
    impact: 3,
    verdict: 'Instant dynasty asset at a premium price — Tubes94 identified the value before the market did.',
    hallOfFame: true,
  },
  {
    id: 'tx017',
    type: 'WAIVER',
    season: 2025,
    date: '2025 Week 3',
    manager: 'MLSchools12',
    description: 'MLSchools12 adds Kyren Williams off waivers with $38 FAAB.',
    assets: ['Kyren Williams added — $38 FAAB spent'],
    impact: 2,
    verdict: 'A startable RB all season — MLSchools12 acted decisively when the window opened.',
  },
  {
    id: 'tx018',
    type: 'WAIVER',
    season: 2023,
    date: '2023 Week 6',
    manager: 'JuicyBussy',
    description: 'JuicyBussy adds a backup RB mid-season to fill bye week holes.',
    assets: ['Backup RB added — moderate FAAB spend'],
    impact: 1,
    verdict: 'Shrewd roster management during a crunch stretch — the move helped JuicyBussy survive the bye weeks.',
  },
  {
    id: 'tx019',
    type: 'WAIVER',
    season: 2025,
    date: '2025 Week 9',
    manager: 'tdtd19844',
    description: 'tdtd19844 adds Rico Dowdle off waivers with $31 FAAB.',
    assets: ['Rico Dowdle added — $31 FAAB spent'],
    impact: 3,
    verdict: 'Key to tdtd19844\'s championship run — Dowdle became a locked-in starter from Week 9 onward.',
    hallOfFame: true,
  },
  {
    id: 'tx020',
    type: 'WAIVER',
    season: 2021,
    date: '2021 Off-season',
    manager: 'Various',
    description: 'Multiple managers miss the CMC off-season waiver window due to injury uncertainty.',
    assets: ['Christian McCaffrey available — no manager bids aggressively'],
    impact: 2,
    verdict: 'A collective blind spot — CMC\'s return became a dynasty windfall for whoever finally moved.',
  },
  {
    id: 'tx021',
    type: 'WAIVER',
    season: 2024,
    date: '2024 Season',
    manager: 'Various',
    description: 'Competitive waiver bidding war erupts for top adds during 2024 injury chaos.',
    assets: ['Multiple managers spend significant FAAB in a compressed injury window'],
    impact: 2,
    verdict: 'The 2024 waiver period separated the prepared from the reactive — FAAB management was decisive.',
  },
  {
    id: 'tx022',
    type: 'WAIVER',
    season: 2022,
    date: '2022 Season',
    manager: 'Grandes',
    description: 'Grandes adds a breakout WR off waivers before the rest of the league reacts.',
    assets: ['Breakout WR added on minimal FAAB'],
    impact: 1,
    verdict: 'Good film study rewarded — Grandes identified emerging usage patterns before the consensus caught up.',
  },
  {
    id: 'tx023',
    type: 'WAIVER',
    season: 2023,
    date: '2023 Week 11',
    manager: 'Cogdeill11',
    description: 'Cogdeill11 adds a streaming TE during a playoff push.',
    assets: ['Streaming TE added — minimal FAAB'],
    impact: 1,
    verdict: 'A desperate but smart playoff-stretch add — position scarcity made even a mediocre TE valuable.',
  },

  // ── NOTABLE DROPS ────────────────────────────────────────────────────────────
  {
    id: 'tx024',
    type: 'DROP',
    season: 2021,
    date: '2021 Season',
    manager: 'Escuelas',
    description: 'Escuelas drops Antonio Gibson — significant value missed.',
    assets: ['Antonio Gibson released to waivers'],
    impact: 2,
    verdict: 'Gibson had a strong run after the drop — a roster decision that haunted Escuelas\'s 2021 stretch.',
  },
  {
    id: 'tx025',
    type: 'DROP',
    season: 2023,
    date: '2023 Season',
    manager: 'eldridsm',
    description: 'Davante Adams dropped before a brief value spike.',
    assets: ['Davante Adams released to waivers'],
    impact: 2,
    verdict: 'Adams caught fire shortly after the drop — a reminder that dynasty patience is often rewarded.',
  },
  {
    id: 'tx026',
    type: 'DROP',
    season: 2025,
    date: '2025 Weeks 12–14',
    manager: 'Various',
    description: 'Multiple managers cut depth pieces as rosters tighten for playoff push.',
    assets: ['Various WR/RB depth pieces released across the league'],
    impact: 1,
    verdict: 'Playoff roster crunch forces hard cuts — some waived depth pieces ended up on championship rosters.',
  },
  {
    id: 'tx027',
    type: 'DROP',
    season: 2022,
    date: '2022 Week 7',
    manager: 'SexMachineAndyD',
    description: 'SexMachineAndyD drops a handcuff RB who starts three games after the move.',
    assets: ['Handcuff RB dropped — claimed by Tubes94 within 24 hours'],
    impact: 1,
    verdict: 'Tubes94 won this exchange — an opportunistic claim at the right moment of the calendar.',
  },
  {
    id: 'tx028',
    type: 'DROP',
    season: 2020,
    date: '2020 Season',
    manager: 'rbr',
    description: 'rbr drops a WR with remaining schedule upside.',
    assets: ['WR with favorable ROS schedule released'],
    impact: 1,
    verdict: 'The WR posted back-to-back solid weeks post-drop — an early-dynasty roster miscalculation.',
  },
  {
    id: 'tx029',
    type: 'DROP',
    season: 2024,
    date: '2024 Week 3',
    manager: 'tdtd19844',
    description: 'tdtd19844 releases a veteran RB during a down stretch, freeing a roster spot.',
    assets: ['Veteran RB released — depth spot opened for waiver add'],
    impact: 1,
    verdict: 'The freed spot was used well — sometimes the drop matters less than what fills the vacancy.',
  },
  {
    id: 'tx030',
    type: 'DROP',
    season: 2021,
    date: '2021 Week 9',
    manager: 'Cmaleski',
    description: 'Cmaleski drops a RB who becomes a startable contributor the following week.',
    assets: ['RB dropped — startable the following week after usage spike'],
    impact: 2,
    verdict: 'Cmaleski cut a day too early — a painful roster move in a tight playoff race.',
  },

  // ── ADDITIONAL TRADES ────────────────────────────────────────────────────────
  {
    id: 'tx031',
    type: 'TRADE',
    season: 2021,
    date: 'Nov 2021',
    manager: 'eldridsm',
    otherManager: 'Escuelas',
    description: 'eldridsm sells Cooper Kupp at peak value for young receivers and picks.',
    assets: [
      'eldridsm receives: Amon-Ra St. Brown + Garrett Wilson (rookie pick) + 2022 1st + 2023 1st',
      'Escuelas receives: Cooper Kupp + 2022 2nd',
    ],
    impact: 2,
    verdict: 'Selling the 2021 PPR king at peak — a bold move that demonstrated sell-high discipline.',
  },
  {
    id: 'tx032',
    type: 'TRADE',
    season: 2022,
    date: 'Jul 2022',
    manager: 'MLSchools12',
    otherManager: 'eldridm20',
    description: 'MLSchools12 swaps Josh Jacobs for young picks including a top-3 first.',
    assets: [
      'MLSchools12 receives: Bucky Irving (2024 pick) + 2023 1st (top 3) + 2024 2nd',
      'eldridm20 receives: Josh Jacobs + 2023 2nd',
    ],
    impact: 2,
    verdict: 'A proven RB for a high-ceiling pick package — MLSchools12 played the long game.',
  },
  {
    id: 'tx033',
    type: 'TRADE',
    season: 2023,
    date: 'Nov 2023',
    manager: 'SexMachineAndyD',
    otherManager: 'eldridsm',
    description: 'SexMachineAndyD sells Travis Kelce for two young TEs and a first-round pick.',
    assets: [
      'SexMachineAndyD receives: Sam LaPorta (2023 pick) + Tyler Warren (2024 pick) + 2024 1st',
      'eldridsm receives: Travis Kelce + 2024 2nd',
    ],
    impact: 2,
    verdict: 'Brilliant foresight — selling aging Kelce for two elite young TEs before the market adjusted.',
  },
  {
    id: 'tx034',
    type: 'TRADE',
    season: 2024,
    date: 'Apr 2024',
    manager: 'JuicyBussy',
    otherManager: 'Grandes',
    description: 'JuicyBussy ships Breece Hall for Malik Nabers\' draft rights and a first-round pick.',
    assets: [
      'JuicyBussy receives: Malik Nabers (2024 pick) + 2025 1st',
      'Grandes receives: Breece Hall + 2025 2nd',
    ],
    impact: 3,
    verdict: 'Nabers won Offensive ROY — JuicyBussy dealt a proven RB and hit on the next generation WR1.',
    hallOfFame: false,
  },
  {
    id: 'tx035',
    type: 'WAIVER',
    season: 2024,
    date: '2024 Week 5',
    manager: 'Grandes',
    description: 'Grandes adds a breakout slot WR amid a target-share windfall.',
    assets: ['Slot WR added — $22 FAAB spent in a competitive claim'],
    impact: 1,
    verdict: 'Smart targeting of a scheme change — Grandes identified the role before it became obvious.',
  },
  {
    id: 'tx036',
    type: 'TRADE',
    season: 2025,
    date: 'Sep 2025',
    manager: 'MLSchools12',
    otherManager: 'Tubes94',
    description: 'MLSchools12 adds Bijan Robinson in a deadline move to fuel a 13-1 regular season.',
    assets: [
      'MLSchools12 receives: Bijan Robinson + 2026 1st (mid)',
      'Tubes94 receives: Bucky Irving + 2026 2nd',
    ],
    impact: 3,
    verdict: 'The acquisition that powered a record-setting regular season — Bijan was the missing piece.',
  },
  {
    id: 'tx037',
    type: 'WAIVER',
    season: 2020,
    date: '2020 Week 6',
    manager: 'Cogdeill11',
    description: 'Cogdeill11 adds a streaming WR before a four-game target explosion.',
    assets: ['Streaming WR added on $8 FAAB — starts four consecutive games'],
    impact: 1,
    verdict: 'An early-dynasty waiver win — small-ball FAAB management that stretched a tight roster.',
  },
  {
    id: 'tx038',
    type: 'DROP',
    season: 2022,
    date: '2022 Week 13',
    manager: 'Grandes',
    description: 'Grandes drops a TE to make room for a playoff-push RB add.',
    assets: ['TE cut — RB added for playoff stretch'],
    impact: 1,
    verdict: 'A pragmatic positional pivot — RB scarcity made the TE expendable at the right moment.',
  },
  {
    id: 'tx039',
    type: 'TRADE',
    season: 2020,
    date: 'Dec 2020',
    manager: 'Tubes94',
    otherManager: 'eldridsm',
    description: 'Tubes94 acquires Jonathan Taylor\'s rookie rights from eldridsm ahead of the 2021 season.',
    assets: [
      'Tubes94 receives: Jonathan Taylor (rookie) + 2021 1.03 + 2022 1st',
      'eldridsm receives: Dalvin Cook + Keenan Allen',
    ],
    impact: 3,
    verdict: 'Jonathan Taylor became the 2021 RB1 — Tubes94 mortgaged veterans wisely for the next dynasty anchor.',
    hallOfFame: false,
  },
  {
    id: 'tx040',
    type: 'WAIVER',
    season: 2021,
    date: '2021 Week 2',
    manager: 'rbr',
    description: 'rbr adds a breakout second-year WR before his role crystallizes in the offense.',
    assets: ['Emerging WR2 added — minimal FAAB in a low-competition claim'],
    impact: 2,
    verdict: 'Ahead-of-the-curve film work paid off — the WR delivered a top-24 fantasy finish.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const SEASONS: Season[] = [2025, 2024, 2023, 2022, 2021, 2020];

const MANAGERS = [
  'MLSchools12', 'Tubes94', 'SexMachineAndyD', 'JuicyBussy', 'Grandes',
  'rbr', 'eldridsm', 'eldridm20', 'Cogdeill11', 'tdtd19844', 'Cmaleski',
  'Escuelas',
] as const;

const TYPE_CONFIG: Record<TxType, { label: string; color: string; icon: React.ReactNode }> = {
  TRADE:  { label: 'Trade',   color: 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/30', icon: <ArrowLeftRight className="w-3 h-3" aria-hidden="true" /> },
  WAIVER: { label: 'Waiver',  color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',    icon: <Zap className="w-3 h-3" aria-hidden="true" /> },
  DROP:   { label: 'Drop',    color: 'text-red-400 bg-red-400/10 border-red-400/30',       icon: <Trash2 className="w-3 h-3" aria-hidden="true" /> },
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function TransactionBrowserPage() {
  const [typeFilter, setTypeFilter]     = useState<TxType | 'ALL'>('ALL');
  const [seasonFilter, setSeasonFilter] = useState<Season | 'ALL'>('ALL');
  const [managerFilter, setManagerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery]   = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TRANSACTIONS.filter(tx => {
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
      if (seasonFilter !== 'ALL' && tx.season !== seasonFilter) return false;
      if (managerFilter !== 'ALL' && tx.manager !== managerFilter && tx.otherManager !== managerFilter) return false;
      if (q) {
        const haystack = [
          tx.description, tx.manager, tx.otherManager ?? '',
          tx.verdict, ...tx.assets,
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [typeFilter, seasonFilter, managerFilter, searchQuery]);

  const hofTransactions = TRANSACTIONS.filter(tx => tx.hallOfFame);

  // Summary stats
  const totalTrades  = TRANSACTIONS.filter(t => t.type === 'TRADE').length;
  const totalWaivers = TRANSACTIONS.filter(t => t.type === 'WAIVER').length;
  const totalDrops   = TRANSACTIONS.filter(t => t.type === 'DROP').length;

  const managerCounts = MANAGERS.map(m => ({
    manager: m,
    count: TRANSACTIONS.filter(t => t.manager === m || t.otherManager === m).length,
  }));
  const mostActive = managerCounts.reduce((a, b) => a.count > b.count ? a : b);

  const hasFilters = typeFilter !== 'ALL' || seasonFilter !== 'ALL' || managerFilter !== 'ALL' || searchQuery !== '';

  return (
    <>
      <Head>
        <title>Transaction Browser — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Browse all major BMFFFL transactions — trades, waivers, and drops across 6 seasons of dynasty history. Filter by type, season, and manager."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Transaction Browser
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-6">
            All major BMFFFL trades and transactions — 2020 to 2025
          </p>

          {/* Summary stats */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5">
              <ArrowLeftRight className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span className="text-sm font-black text-[#ffd700]">{totalTrades}</span>
              <span className="text-sm text-[#ffd700]/70 font-medium">trades recorded</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-400/30 bg-blue-400/5">
              <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span className="text-sm font-black text-blue-400">{totalWaivers}</span>
              <span className="text-sm text-blue-400/70 font-medium">significant waivers</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-400/30 bg-red-400/5">
              <Trash2 className="w-4 h-4 text-red-400" aria-hidden="true" />
              <span className="text-sm font-black text-red-400">{totalDrops}</span>
              <span className="text-sm text-red-400/70 font-medium">notable drops</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2d4a66] bg-[#16213e]">
              <Trophy className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span className="text-sm text-slate-300 font-medium">
                Most active: <span className="text-white font-bold">{mostActive.manager}</span>
              </span>
            </div>
          </div>
        </header>

        {/* ── Hall of Fame ──────────────────────────────────────────────────── */}
        <section aria-labelledby="hof-heading" className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 id="hof-heading" className="text-sm font-semibold text-[#ffd700] uppercase tracking-wider">
              Hall of Fame Transactions
            </h2>
          </div>
          <p className="text-slate-500 text-xs mb-4">The top 3 most impactful transactions in BMFFFL history.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {hofTransactions.slice(0, 3).map((tx, i) => (
              <div
                key={tx.id}
                className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#ffd700] text-[#0d1b2a] text-[10px] font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <TypeBadge type={tx.type} />
                  <span className="ml-auto text-[10px] text-slate-500 font-mono">{tx.season}</span>
                </div>
                <p className="text-sm font-bold text-white mb-1 leading-snug">{tx.description}</p>
                <p className="text-xs text-[#ffd700]/70 italic leading-relaxed">{tx.verdict}</p>
                <ImpactStars rating={tx.impact} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <section aria-labelledby="filters-heading" className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <h2 id="filters-heading" className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Filters
            </h2>
            {hasFilters && (
              <button
                onClick={() => {
                  setTypeFilter('ALL');
                  setSeasonFilter('ALL');
                  setManagerFilter('ALL');
                  setSearchQuery('');
                }}
                className="ml-auto text-xs text-[#e94560] hover:text-[#e94560]/80 font-semibold transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mb-3">
            <label htmlFor="tx-search" className="sr-only">Search transactions</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="tx-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by player, manager, or description…"
                className="w-full sm:w-96 pl-9 pr-4 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Type filter — pill buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['ALL', 'TRADES', 'WAIVERS', 'DROPS'] as const).map(label => {
                const value: TxType | 'ALL' = label === 'ALL' ? 'ALL' : label === 'TRADES' ? 'TRADE' : label === 'WAIVERS' ? 'WAIVER' : 'DROP';
                const active = typeFilter === value;
                return (
                  <button
                    key={label}
                    onClick={() => setTypeFilter(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors duration-150',
                      active
                        ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                        : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:text-white hover:border-[#4a6a86]'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Season select */}
            <div className="relative inline-flex items-center">
              <select
                value={String(seasonFilter)}
                onChange={e => {
                  const v = e.target.value;
                  setSeasonFilter(v === 'ALL' ? 'ALL' : Number(v) as Season);
                }}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-sm text-white font-semibold focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20 cursor-pointer"
                aria-label="Filter by season"
              >
                <option value="ALL">All Seasons</option>
                {SEASONS.map(s => (
                  <option key={s} value={String(s)}>{s}</option>
                ))}
              </select>
              <ArrowLeftRight className="absolute right-2 w-3 h-3 text-slate-500 pointer-events-none" aria-hidden="true" />
            </div>

            {/* Manager select */}
            <div className="relative inline-flex items-center">
              <select
                value={managerFilter}
                onChange={e => setManagerFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-sm text-white font-semibold focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20 cursor-pointer"
                aria-label="Filter by manager"
              >
                <option value="ALL">All Managers</option>
                {MANAGERS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ArrowLeftRight className="absolute right-2 w-3 h-3 text-slate-500 pointer-events-none" aria-hidden="true" />
            </div>

            {/* Result count */}
            <span className="ml-auto text-sm text-slate-500 font-medium">
              Showing <span className="text-white font-bold">{filtered.length}</span> of {TRANSACTIONS.length}
            </span>
          </div>
        </section>

        {/* ── Transaction Cards ─────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#2d4a66] py-16 text-center">
            <p className="text-slate-500 font-medium">No transactions match the current filters.</p>
            <button
              onClick={() => {
                setTypeFilter('ALL');
                setSeasonFilter('ALL');
                setManagerFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-[#ffd700] hover:text-[#ffd700]/80 font-semibold transition-colors"
            >
              Clear filters &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label="Transaction records">
            {filtered.map(tx => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        )}

        {/* ── Bimfle Note ───────────────────────────────────────────────────── */}
        <div className="mt-12 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-6 py-5">
          <p className="text-sm text-[#ffd700]/80 italic leading-relaxed text-center max-w-3xl mx-auto">
            &ldquo;The transaction ledger is the league&rsquo;s autobiography &mdash; every acquisition and
            divestiture a chapter in an ongoing story of ambition, miscalculation, and occasional genius.&rdquo;
          </p>
          <p className="text-xs text-[#ffd700]/50 text-center mt-2 font-semibold tracking-wider">
            ~Love, Bimfle.
          </p>
        </div>

      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: TxType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border',
      cfg.color
    )}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function ImpactStars({ rating }: { rating: ImpactRating }) {
  const labels: Record<ImpactRating, string> = {
    3: 'Championship-altering',
    2: 'Significant',
    1: 'Notable',
  };
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map(n => (
          <Star
            key={n}
            className={cn(
              'w-3 h-3',
              n <= rating ? 'text-[#ffd700] fill-[#ffd700]' : 'text-slate-700'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-[10px] text-slate-500 font-medium">{labels[rating]}</span>
    </div>
  );
}

function TransactionCard({ tx }: { tx: Transaction }) {
  return (
    <div
      role="listitem"
      className={cn(
        'rounded-xl border p-4 sm:p-5 transition-colors duration-150',
        tx.hallOfFame
          ? 'border-[#ffd700]/20 bg-[#ffd700]/[0.03] hover:border-[#ffd700]/40'
          : 'border-[#2d4a66] bg-[#16213e] hover:border-[#2d4a66]/80'
      )}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TypeBadge type={tx.type} />
        {tx.hallOfFame && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-[#ffd700]/50 bg-[#ffd700]/10 text-[#ffd700]">
            <Trophy className="w-3 h-3" aria-hidden="true" />
            Hall of Fame
          </span>
        )}
        <span className="text-[10px] font-mono text-slate-600">{tx.id}</span>
        <span className="ml-auto text-xs text-slate-500">{tx.date}</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[#2d4a66] bg-[#0d1b2a] text-slate-500">
          {tx.season}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base font-bold text-white mb-3 leading-snug">{tx.description}</p>

      {/* Manager chips */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-xs font-semibold text-slate-300">
          {tx.manager}
        </span>
        {tx.otherManager && (
          <>
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-xs font-semibold text-slate-300">
              {tx.otherManager}
            </span>
          </>
        )}
      </div>

      {/* Assets */}
      <ul className="space-y-1 mb-3">
        {tx.assets.map((asset, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400 leading-snug">
            <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-slate-600" aria-hidden="true" />
            {asset}
          </li>
        ))}
      </ul>

      {/* Verdict + impact */}
      <div className="pt-3 border-t border-[#1e3347] flex flex-wrap items-end justify-between gap-3">
        <p className="text-xs text-slate-500 italic leading-relaxed flex-1 min-w-0">
          <span className="text-slate-600 not-italic font-semibold mr-1">Verdict:</span>
          {tx.verdict}
        </p>
        <ImpactStars rating={tx.impact} />
      </div>
    </div>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
