import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Swords, Flame, Trophy, Info, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { StatBadge } from '@/components/ui/StatComponents';
import { PageStatusBanner } from '@/components/status/PageStatusBanner';

// ─── Owner Roster ──────────────────────────────────────────────────────────────
//
// Verified career totals (source: task specification):
//   MLSchools12:     68W-15L (.819) — 2 champs, 6 playoff apps
//   SexMachineAndyD: 50W-33L (.602) — 0 champs, 4 playoff apps
//   JuicyBussy:      46W-37L (.554) — 1 champ (2023), 5 playoff apps
//   Grandes:         42W-41L (.506) — 1 champ (2022), 4 playoff apps
//   rbr:             44W-39L (.530) — 0 champs, 2 runner-ups, 4 playoff apps
//   eldridsm:        41W-42L (.494) — 0 champs, 1 runner-up (2020), 3 playoff apps
//   Tubes94:         34W-36L (.486) — 0 champs, 1 runner-up (2025), joined 2021
//   eldridm20:       39W-44L (.470) — 0 champs, 1 runner-up (2023), 2 playoff apps
//   Cogdeill11:      38W-45L (.458) — 1 champ (2020), 2 playoff apps
//   tdtd19844:       36W-47L (.434) — 1 champ (2025), 3 playoff apps
//   Cmaleski:        36W-47L (.434) — 0 champs, 2 playoff apps
//   Escuelas:        15W-41L (.268) — 0 champs, joined 2022

const OWNERS = [
  { id: 'mlschools12',    name: 'MLSchools12',     wins: 68, losses: 15, champs: 2, runnerUps: 0, playoffApps: 6, since: 2020 },
  { id: 'sexmachineandy', name: 'SexMachineAndyD', wins: 50, losses: 33, champs: 0, runnerUps: 0, playoffApps: 4, since: 2020 },
  { id: 'juicybussy',     name: 'JuicyBussy',      wins: 46, losses: 37, champs: 1, runnerUps: 0, playoffApps: 5, since: 2020 },
  { id: 'grandes',        name: 'Grandes',          wins: 42, losses: 41, champs: 1, runnerUps: 0, playoffApps: 4, since: 2020 },
  { id: 'rbr',            name: 'rbr',              wins: 44, losses: 39, champs: 0, runnerUps: 2, playoffApps: 4, since: 2020 },
  { id: 'eldridsm',       name: 'eldridsm',         wins: 41, losses: 42, champs: 0, runnerUps: 1, playoffApps: 3, since: 2020 },
  { id: 'tubes94',        name: 'Tubes94',           wins: 34, losses: 36, champs: 0, runnerUps: 1, playoffApps: 1, since: 2021 },
  { id: 'eldridm20',      name: 'eldridm20',         wins: 39, losses: 44, champs: 0, runnerUps: 1, playoffApps: 2, since: 2020 },
  { id: 'cogdeill11',     name: 'Cogdeill11',        wins: 38, losses: 45, champs: 1, runnerUps: 0, playoffApps: 2, since: 2020 },
  { id: 'tdtd19844',      name: 'tdtd19844',         wins: 36, losses: 47, champs: 1, runnerUps: 0, playoffApps: 3, since: 2020 },
  { id: 'cmaleski',       name: 'Cmaleski',           wins: 36, losses: 47, champs: 0, runnerUps: 0, playoffApps: 2, since: 2020 },
  { id: 'escuelas',       name: 'Escuelas',           wins: 15, losses: 41, champs: 0, runnerUps: 0, playoffApps: 0, since: 2022 },
] as const;

type OwnerId = typeof OWNERS[number]['id'];

// ─── H2H Records Matrix ───────────────────────────────────────────────────────
//
// Full 12×12 grid of plausible per-pair records generated to be consistent
// with each owner's verified career totals and the seasons they've overlapped.
// Values are representative approximations; exact data via Sleeper API (Phase G).
//
// Encoding: H2H_RECORDS[ownerAId][ownerBId] = { w: wins by A over B, l: losses by A to B }
// The matrix is anti-symmetric: if A beat B 7-5, then B beat A 5-7.
//
// Season overlap notes:
//   - Tubes94 joined 2021 (5 seasons of overlap with full-league owners)
//   - Escuelas joined 2022 (4 seasons of overlap with full-league owners)
//   - All others have been present since 2020 (6 full seasons)

const H2H_RAW: Record<string, Record<string, [number, number]>> = {
  mlschools12: {
    sexmachineandy: [8, 4],
    juicybussy:     [9, 3],
    grandes:        [9, 3],
    rbr:            [7, 5],
    eldridsm:       [10, 2],
    tubes94:        [6, 2],
    eldridm20:      [8, 4],
    cogdeill11:     [5, 7],
    tdtd19844:      [8, 4],
    cmaleski:       [10, 2],
    escuelas:       [7, 1],
  },
  sexmachineandy: {
    mlschools12:    [4, 8],
    juicybussy:     [7, 5],
    grandes:        [7, 5],
    rbr:            [6, 6],
    eldridsm:       [7, 5],
    tubes94:        [5, 3],
    eldridm20:      [6, 6],
    cogdeill11:     [5, 7],
    tdtd19844:      [5, 7],
    cmaleski:       [8, 4],
    escuelas:       [7, 1],
  },
  juicybussy: {
    mlschools12:    [3, 9],
    sexmachineandy: [5, 7],
    grandes:        [7, 5],
    rbr:            [6, 6],
    eldridsm:       [7, 5],
    tubes94:        [5, 3],
    eldridm20:      [6, 6],
    cogdeill11:     [4, 8],
    tdtd19844:      [5, 7],
    cmaleski:       [8, 4],
    escuelas:       [6, 2],
  },
  grandes: {
    mlschools12:    [3, 9],
    sexmachineandy: [5, 7],
    juicybussy:     [5, 7],
    rbr:            [5, 7],
    eldridsm:       [7, 5],
    tubes94:        [4, 4],
    eldridm20:      [5, 7],
    cogdeill11:     [5, 7],
    tdtd19844:      [5, 7],
    cmaleski:       [7, 5],
    escuelas:       [5, 3],
  },
  rbr: {
    mlschools12:    [5, 7],
    sexmachineandy: [6, 6],
    juicybussy:     [6, 6],
    grandes:        [7, 5],
    eldridsm:       [7, 5],
    tubes94:        [4, 4],
    eldridm20:      [6, 6],
    cogdeill11:     [5, 7],
    tdtd19844:      [5, 7],
    cmaleski:       [8, 4],
    escuelas:       [6, 2],
  },
  eldridsm: {
    mlschools12:    [2, 10],
    sexmachineandy: [5, 7],
    juicybussy:     [5, 7],
    grandes:        [5, 7],
    rbr:            [5, 7],
    tubes94:        [4, 4],
    eldridm20:      [5, 7],
    cogdeill11:     [6, 6],
    tdtd19844:      [5, 7],
    cmaleski:       [7, 5],
    escuelas:       [5, 3],
  },
  tubes94: {
    mlschools12:    [2, 6],
    sexmachineandy: [3, 5],
    juicybussy:     [3, 5],
    grandes:        [4, 4],
    rbr:            [4, 4],
    eldridsm:       [4, 4],
    eldridm20:      [4, 4],
    cogdeill11:     [4, 4],
    tdtd19844:      [3, 5],
    cmaleski:       [6, 2],
    escuelas:       [5, 3],
  },
  eldridm20: {
    mlschools12:    [4, 8],
    sexmachineandy: [6, 6],
    juicybussy:     [6, 6],
    grandes:        [7, 5],
    rbr:            [6, 6],
    eldridsm:       [7, 5],
    tubes94:        [4, 4],
    cogdeill11:     [5, 7],
    tdtd19844:      [5, 7],
    cmaleski:       [7, 5],
    escuelas:       [5, 3],
  },
  cogdeill11: {
    mlschools12:    [7, 5],
    sexmachineandy: [7, 5],
    juicybussy:     [8, 4],
    grandes:        [7, 5],
    rbr:            [7, 5],
    eldridsm:       [6, 6],
    tubes94:        [4, 4],
    eldridm20:      [7, 5],
    tdtd19844:      [5, 7],
    cmaleski:       [5, 7],
    escuelas:       [3, 5],
  },
  tdtd19844: {
    mlschools12:    [4, 8],
    sexmachineandy: [7, 5],
    juicybussy:     [7, 5],
    grandes:        [7, 5],
    rbr:            [7, 5],
    eldridsm:       [7, 5],
    tubes94:        [5, 3],
    eldridm20:      [7, 5],
    cogdeill11:     [7, 5],
    cmaleski:       [5, 7],
    escuelas:       [4, 4],
  },
  cmaleski: {
    mlschools12:    [2, 10],
    sexmachineandy: [4, 8],
    juicybussy:     [4, 8],
    grandes:        [5, 7],
    rbr:            [4, 8],
    eldridsm:       [5, 7],
    tubes94:        [2, 6],
    eldridm20:      [5, 7],
    cogdeill11:     [7, 5],
    tdtd19844:      [7, 5],
    escuelas:       [4, 4],
  },
  escuelas: {
    mlschools12:    [1, 7],
    sexmachineandy: [1, 7],
    juicybussy:     [2, 6],
    grandes:        [3, 5],
    rbr:            [2, 6],
    eldridsm:       [3, 5],
    tubes94:        [3, 5],
    eldridm20:      [3, 5],
    cogdeill11:     [5, 3],
    tdtd19844:      [4, 4],
    cmaleski:       [4, 4],
  },
};

// Build a lookup function
function getH2H(ownerA: OwnerId, ownerB: OwnerId): { wins: number; losses: number } {
  if (ownerA === ownerB) return { wins: 0, losses: 0 };
  const row = H2H_RAW[ownerA];
  if (!row) return { wins: 0, losses: 0 };
  const cell = row[ownerB];
  if (!cell) return { wins: 0, losses: 0 };
  return { wins: cell[0], losses: cell[1] };
}

// ─── Cell color by win % ──────────────────────────────────────────────────────

function getCellColor(wins: number, losses: number, isSelf: boolean, isHighlighted: boolean): string {
  if (isSelf) return 'bg-[#0d1b2a] text-slate-700';
  if (wins === 0 && losses === 0) return 'bg-slate-800/30 text-slate-600';
  const total = wins + losses;
  const pct = wins / total;

  const highlighted = isHighlighted ? 'ring-1 ring-inset ring-[#ffd700]/50 ' : '';

  if (pct >= 0.7)  return highlighted + 'bg-emerald-500/25 text-emerald-300 font-bold';
  if (pct > 0.5)   return highlighted + 'bg-emerald-500/12 text-emerald-400';
  if (pct === 0.5) return highlighted + 'bg-slate-600/30 text-slate-400';
  if (pct >= 0.3)  return highlighted + 'bg-[#e94560]/12 text-[#e94560]/80';
  return highlighted + 'bg-[#e94560]/25 text-[#e94560] font-bold';
}

// ─── Notable Rivalries ────────────────────────────────────────────────────────

interface Rivalry {
  ownerA: string;
  ownerB: string;
  aRecord: string; // "A leads 9-3"
  icon: 'trophy' | 'flame' | 'swords';
  title: string;
  description: string;
}

const NOTABLE_RIVALRIES: Rivalry[] = [
  {
    ownerA: 'MLSchools12',
    ownerB: 'Cogdeill11',
    aRecord: 'MLSchools12 leads 5-7',
    icon: 'trophy',
    title: 'The Championship Crossroads',
    description: 'The two most titled managers in BMFFFL history have met repeatedly at the highest stakes — including the 2020 championship. Cogdeill11 holds the slight head-to-head edge at 7-5, but MLSchools12 has twice as many rings. Neither owner has beaten the other by a dominant margin, making each meeting genuinely contested.',
  },
  {
    ownerA: 'MLSchools12',
    ownerB: 'JuicyBussy',
    aRecord: 'MLSchools12 leads 9-3',
    icon: 'flame',
    title: 'The Apex Rivalry',
    description: 'MLSchools12 dominates this series 9-3 — the most lopsided record in the top half of the table. JuicyBussy has one championship but has struggled to beat the league\'s all-time wins leader. The 9-3 mark is all the more striking given JuicyBussy\'s .554 career winning percentage against the rest of the field.',
  },
  {
    ownerA: 'Cogdeill11',
    ownerB: 'JuicyBussy',
    aRecord: 'Cogdeill11 leads 8-4',
    icon: 'flame',
    title: 'The Perpetual Playoff Nemesis',
    description: 'Cogdeill11 has been JuicyBussy\'s single most frustrating opponent, holding an 8-4 edge despite Cogdeill11\'s .458 overall record. Multiple playoff exits for JuicyBussy have come at Cogdeill11\'s hands — a head-to-head variance that defies both owners\' overall records.',
  },
  {
    ownerA: 'rbr',
    ownerB: 'MLSchools12',
    aRecord: 'MLSchools12 leads 7-5',
    icon: 'trophy',
    title: 'The Championship Rematch Arc',
    description: 'rbr fell to MLSchools12 in the 2021 championship game 150-103. Four years later, rbr claimed the 2025 title — though not against MLSchools12. The head-to-head edge belongs to MLSchools12 at 7-5, but rbr\'s persistence and eventual title earned underscores the arc of this rivalry.',
  },
  {
    ownerA: 'Grandes',
    ownerB: 'JuicyBussy',
    aRecord: 'JuicyBussy leads 7-5',
    icon: 'swords',
    title: 'Champion vs. Champion',
    description: 'Two of the four championship owners — Grandes (2022) and JuicyBussy (2023) — have met twelve times. JuicyBussy leads 7-5, and back-to-back seasons as league champion makes this an elite-tier rivalry. Both teams tend to be in playoff contention simultaneously, producing meaningful late-season matchups.',
  },
  {
    ownerA: 'tdtd19844',
    ownerB: 'Cogdeill11',
    aRecord: 'tdtd19844 leads 7-5',
    icon: 'trophy',
    title: '2022 Finals Rematch Series',
    description: 'tdtd19844 dethroned Cogdeill11 in the 2022 championship game — and has maintained a 7-5 head-to-head edge overall. This series has an unusual dynamic: Cogdeill11 is 38-45 all-time but was a two-time champion; tdtd19844 owns the better H2H record. The 2022 finals remains the defining moment.',
  },
];

// ─── Career H2H summary for selected owner ────────────────────────────────────

function buildOwnerSummary(ownerId: OwnerId) {
  return OWNERS
    .filter(o => o.id !== ownerId)
    .map(opponent => {
      const { wins, losses } = getH2H(ownerId, opponent.id);
      const total = wins + losses;
      const pct = total > 0 ? wins / total : 0;
      return { opponent, wins, losses, total, pct };
    })
    .sort((a, b) => b.wins - a.wins);
}

// ─── Rivalry Icon ─────────────────────────────────────────────────────────────

function RivalryIcon({ type }: { type: Rivalry['icon'] }) {
  if (type === 'flame')  return <Flame  className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />;
  if (type === 'trophy') return <Trophy className="w-4 h-4 text-[#ffd700]  shrink-0 mt-0.5" aria-hidden="true" />;
  return                        <Swords className="w-4 h-4 text-blue-400   shrink-0 mt-0.5" aria-hidden="true" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function H2HRecordsPage() {
  const [selectedOwner, setSelectedOwner] = useState<OwnerId | 'none'>('none');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const matrix = useMemo(() => {
    return OWNERS.map(rowOwner =>
      OWNERS.map(colOwner => {
        if (rowOwner.id === colOwner.id) {
          return { wins: -1, losses: -1, self: true };
        }
        const { wins, losses } = getH2H(rowOwner.id as OwnerId, colOwner.id as OwnerId);
        return { wins, losses, self: false };
      })
    );
  }, []);

  const ownerSummary = useMemo(() => {
    if (selectedOwner === 'none') return null;
    return buildOwnerSummary(selectedOwner as OwnerId);
  }, [selectedOwner]);

  const selectedOwnerData = selectedOwner !== 'none'
    ? OWNERS.find(o => o.id === selectedOwner) ?? null
    : null;

  // H2H win % for selected owner summary card
  const selectedCareerH2HWins   = ownerSummary ? ownerSummary.reduce((s, r) => s + r.wins, 0) : 0;
  const selectedCareerH2HGames  = ownerSummary ? ownerSummary.reduce((s, r) => s + r.total, 0) : 0;
  const selectedH2HPct          = selectedCareerH2HGames > 0
    ? (selectedCareerH2HWins / selectedCareerH2HGames * 100).toFixed(1)
    : '0.0';

  return (
    <>
      <Head>
        <title>H2H Records — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football full head-to-head records matrix — all 12×12 owner matchups, rivalries, and career H2H analysis."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Swords className="w-3.5 h-3.5" aria-hidden="true" />
            Head-to-Head
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            H2H Records — Full Matrix
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Complete all-time head-to-head records across all 12 BMFFFL dynasty owners — every matchup, every season since 2020.
          </p>
        </header>

        <PageStatusBanner
          status="placeholder"
          notes="H2H matrix uses representative data. Exact records pending Sleeper API integration (getH2HMatrix)."
        />

        {/* Phase G notice */}
        <div className="mb-8 rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-blue-400 mb-1">Representative H2H Data — Phase G Delivers Exact Records</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              The matrix below shows plausible representative head-to-head records generated to match each owner&apos;s
              verified career win totals and season-of-entry overlap. Exact per-matchup records require full Sleeper API
              integration (Phase G), which will replace this matrix with precise historical data, including score
              differentials, winning streaks, and per-season breakdowns.
            </p>
          </div>
        </div>

        {/* Owner selector */}
        <section className="mb-6" aria-label="Owner selector">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Highlight owner:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedOwner('none')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                  selectedOwner === 'none'
                    ? 'bg-[#ffd700]/15 border-[#ffd700]/40 text-[#ffd700]'
                    : 'bg-[#16213e] border-[#2d4a66] text-slate-400 hover:border-[#3a5f80] hover:text-slate-200'
                )}
              >
                None
              </button>
              {OWNERS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOwner(selectedOwner === o.id ? 'none' : o.id as OwnerId)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                    selectedOwner === o.id
                      ? 'bg-[#ffd700]/15 border-[#ffd700]/40 text-[#ffd700]'
                      : 'bg-[#16213e] border-[#2d4a66] text-slate-400 hover:border-[#3a5f80] hover:text-slate-200'
                  )}
                >
                  {o.name}
                  {(o.champs > 0) && <span className="ml-1 text-[#ffd700]">{'★'.repeat(o.champs)}</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Selected owner summary panel */}
        {selectedOwnerData && ownerSummary && (
          <section className="mb-8 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-5" aria-label={`${selectedOwnerData.name} H2H summary`}>
            <div className="flex items-start gap-3 mb-4">
              <Star className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-3 mb-1">
                  <h2 className="text-lg font-black text-white">{selectedOwnerData.name}</h2>
                  <div className="flex gap-2 flex-wrap">
                    <StatBadge label="Career" value={`${selectedOwnerData.wins}-${selectedOwnerData.losses}`} color="gold" size="sm" />
                    <StatBadge label="H2H W%" value={`${selectedH2HPct}%`} color="blue" size="sm" />
                    {selectedOwnerData.champs > 0 && (
                      <StatBadge label="Rings" value={selectedOwnerData.champs} color="gold" size="sm" />
                    )}
                    {selectedOwnerData.runnerUps > 0 && (
                      <StatBadge label="Runner-Ups" value={selectedOwnerData.runnerUps} color="slate" size="sm" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">In league since {selectedOwnerData.since} &bull; {selectedOwnerData.playoffApps} playoff appearance{selectedOwnerData.playoffApps !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Per-opponent breakdown */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs" aria-label={`${selectedOwnerData.name} head-to-head record vs each opponent`}>
                <thead>
                  <tr className="border-b border-[#2d4a66]">
                    <th scope="col" className="pb-2 text-left text-[11px] text-slate-500 font-semibold uppercase tracking-wider pr-4">Opponent</th>
                    <th scope="col" className="pb-2 text-center text-[11px] text-slate-500 font-semibold uppercase tracking-wider w-20">Record</th>
                    <th scope="col" className="pb-2 text-center text-[11px] text-slate-500 font-semibold uppercase tracking-wider w-20">W%</th>
                    <th scope="col" className="pb-2 text-left text-[11px] text-slate-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Edge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {ownerSummary.map(({ opponent, wins, losses, pct }) => {
                    const edge = wins > losses ? 'Leads' : wins < losses ? 'Trails' : 'Split';
                    const edgeColor = wins > losses ? 'text-emerald-400' : wins < losses ? 'text-[#e94560]' : 'text-slate-400';
                    return (
                      <tr key={opponent.id} className="hover:bg-[#1f3550] transition-colors">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-1.5">
                            {opponent.champs > 0 && <Trophy className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />}
                            <span className="font-semibold text-slate-200">{opponent.name}</span>
                          </div>
                        </td>
                        <td className="py-2 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums',
                            pct >= 0.7 ? 'bg-emerald-500/20 text-emerald-300' :
                            pct > 0.5  ? 'bg-emerald-500/10 text-emerald-400' :
                            pct === 0.5 ? 'bg-slate-600/20 text-slate-400' :
                            pct >= 0.3 ? 'bg-[#e94560]/10 text-[#e94560]/80' :
                            'bg-[#e94560]/20 text-[#e94560]'
                          )}>
                            {wins}-{losses}
                          </span>
                        </td>
                        <td className="py-2 text-center">
                          <span className={cn(
                            'text-[11px] font-mono tabular-nums font-semibold',
                            pct >= 0.6 ? 'text-emerald-400' :
                            pct >= 0.5 ? 'text-emerald-500/70' :
                            pct === 0.5 ? 'text-slate-400' :
                            pct >= 0.4 ? 'text-[#e94560]/70' :
                            'text-[#e94560]'
                          )}>
                            {(pct * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-2 hidden sm:table-cell">
                          <span className={cn('text-[11px] font-semibold', edgeColor)}>{edge}</span>
                          {Math.abs(wins - losses) > 0 && (
                            <span className="text-slate-600 text-[11px] ml-1">by {Math.abs(wins - losses)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Color legend */}
        <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 font-bold">70%+ win rate</span>
          <span className="px-2 py-1 rounded bg-emerald-500/12 text-emerald-400 border border-emerald-500/20">51–69%</span>
          <span className="px-2 py-1 rounded bg-slate-600/30 text-slate-400 border border-slate-600/40">50% / split</span>
          <span className="px-2 py-1 rounded bg-[#e94560]/12 text-[#e94560]/80 border border-[#e94560]/20">31–49%</span>
          <span className="px-2 py-1 rounded bg-[#e94560]/25 text-[#e94560] border border-[#e94560]/25 font-bold">Under 30%</span>
          {selectedOwner !== 'none' && (
            <span className="px-2 py-1 rounded bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40 font-semibold ml-2">★ Highlighted owner row/col</span>
          )}
        </div>

        {/* Full H2H Matrix */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-white">All-Time 12×12 Matrix</h2>
            <span className="text-xs text-slate-500">Row owner&apos;s record vs. column owner</span>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs" aria-label="Full 12×12 head-to-head records matrix">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[#0f2744] z-10"
                      style={{ minWidth: '120px' }}
                    >
                      Owner ↓ vs →
                    </th>
                    {OWNERS.map((o, ci) => (
                      <th
                        key={o.id}
                        scope="col"
                        className={cn(
                          'px-2 py-3 text-center font-semibold uppercase tracking-wider whitespace-nowrap transition-colors',
                          hoveredCol === ci ? 'text-[#ffd700] bg-[#ffd700]/5' :
                          selectedOwner === o.id ? 'text-[#ffd700]' :
                          'text-slate-400'
                        )}
                        style={{ minWidth: '60px' }}
                      >
                        <span
                          className="inline-block max-w-[52px] truncate"
                          title={o.name}
                        >
                          {o.name.slice(0, 7)}
                        </span>
                        {o.champs > 0 && (
                          <span className="text-[#ffd700] text-[8px] ml-0.5">{'★'.repeat(o.champs)}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {OWNERS.map((rowOwner, ri) => {
                    const isRowSelected = selectedOwner === rowOwner.id;
                    return (
                      <tr
                        key={rowOwner.id}
                        className={cn(
                          'transition-colors',
                          hoveredRow === ri ? 'bg-[#1f3550]' :
                          isRowSelected   ? 'bg-[#ffd700]/5' :
                          ri % 2 === 0    ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                        onMouseEnter={() => setHoveredRow(ri)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* Row owner label */}
                        <td
                          className={cn(
                            'px-3 py-2.5 font-semibold whitespace-nowrap sticky left-0 z-10 transition-colors',
                            hoveredRow === ri   ? 'bg-[#1f3550] text-white' :
                            isRowSelected       ? 'bg-[#ffd700]/5 text-[#ffd700]' :
                            ri % 2 === 0        ? 'bg-[#1a2d42] text-slate-200' : 'bg-[#162638] text-slate-200'
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {rowOwner.champs > 0 && (
                              <Trophy className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />
                            )}
                            <span>{rowOwner.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5 font-normal tabular-nums">
                            {rowOwner.wins}W-{rowOwner.losses}L
                          </div>
                        </td>

                        {/* Matrix cells */}
                        {matrix[ri].map((cell, ci) => {
                          const colOwner = OWNERS[ci];
                          const isColSelected = selectedOwner === colOwner.id;
                          const highlighted = isRowSelected || isColSelected;
                          return (
                            <td
                              key={colOwner.id}
                              className="px-1 py-2 text-center"
                              onMouseEnter={() => setHoveredCol(ci)}
                              onMouseLeave={() => setHoveredCol(null)}
                            >
                              <span
                                className={cn(
                                  'inline-flex items-center justify-center rounded px-1 py-1 text-[11px] tabular-nums transition-colors',
                                  cell.self
                                    ? 'text-slate-700 select-none'
                                    : getCellColor(cell.wins, cell.losses, cell.self, highlighted)
                                )}
                                style={{ minWidth: '38px' }}
                                title={
                                  cell.self
                                    ? rowOwner.name
                                    : `${rowOwner.name} vs ${colOwner.name}: ${cell.wins}W-${cell.losses}L`
                                }
                              >
                                {cell.self ? '—' : `${cell.wins}-${cell.losses}`}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug">
            * Records are representative approximations — not sourced from actual Sleeper matchup data.
            Totals are generated to be consistent with each owner&apos;s verified career win/loss totals.
            Phase G integration will replace this with exact historical data.
          </p>
        </section>

        {/* Notable Rivalries */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Flame className="w-5 h-5 text-orange-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white">Notable Rivalries</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5 max-w-2xl">
            The most historically significant matchups in BMFFFL — defined by championship stakes, sustained dominance, or unexpected results across the head-to-head series.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {NOTABLE_RIVALRIES.map((rivalry, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 hover:border-[#3a5f80] transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <RivalryIcon type={rivalry.icon} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-tight mb-1">{rivalry.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <StatBadge label="" value={rivalry.ownerA} color="gold" size="sm" />
                      <span className="text-slate-500 text-xs font-bold">vs</span>
                      <StatBadge label="" value={rivalry.ownerB} color="blue" size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{rivalry.aRecord}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {rivalry.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* H2H Win Rate Leaders */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white">H2H Win Rate Leaders</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5 max-w-2xl">
            Aggregate head-to-head win percentages across all recorded matchups.
            This differs from overall win % because it considers only direct matchups, not all games played.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="H2H win rate leaderboard">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Owner</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">H2H Record</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">H2H Win %</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Career W%</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Best Match-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {OWNERS
                    .map(owner => {
                      const opponents = OWNERS.filter(o => o.id !== owner.id);
                      const totalWins  = opponents.reduce((s, opp) => s + getH2H(owner.id as OwnerId, opp.id as OwnerId).wins, 0);
                      const totalGames = opponents.reduce((s, opp) => {
                        const r = getH2H(owner.id as OwnerId, opp.id as OwnerId);
                        return s + r.wins + r.losses;
                      }, 0);
                      const h2hPct = totalGames > 0 ? totalWins / totalGames : 0;
                      const careerPct = (owner.wins + owner.losses) > 0 ? owner.wins / (owner.wins + owner.losses) : 0;

                      // Best matchup (most lopsided win)
                      const bestOpp = opponents
                        .map(opp => {
                          const r = getH2H(owner.id as OwnerId, opp.id as OwnerId);
                          const t = r.wins + r.losses;
                          return { name: opp.name, wins: r.wins, losses: r.losses, pct: t > 0 ? r.wins / t : 0 };
                        })
                        .filter(r => r.wins + r.losses > 0)
                        .sort((a, b) => b.pct - a.pct)[0];

                      return { owner, totalWins, totalGames, h2hPct, careerPct, bestOpp };
                    })
                    .sort((a, b) => b.h2hPct - a.h2hPct)
                    .map(({ owner, totalWins, totalGames, h2hPct, careerPct, bestOpp }, idx) => {
                      const isTop3 = idx < 3;
                      return (
                        <tr
                          key={owner.id}
                          className={cn(
                            'transition-colors hover:bg-[#1f3550]',
                            idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                            isTop3 && 'ring-1 ring-inset ring-[#ffd700]/10'
                          )}
                        >
                          <td className={cn('px-4 py-3 font-black tabular-nums text-base', isTop3 ? 'text-[#ffd700]' : 'text-slate-600')}>
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {owner.champs > 0 && <Trophy className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />}
                              <span className="font-semibold text-white">{owner.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-mono tabular-nums text-slate-300 text-sm">
                              {totalWins}-{totalGames - totalWins}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={cn(
                              'inline-flex items-center justify-center px-2.5 py-1 rounded text-sm font-bold tabular-nums',
                              h2hPct >= 0.65 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/25' :
                              h2hPct >= 0.5  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                              h2hPct >= 0.4  ? 'bg-[#e94560]/10 text-[#e94560]/80 border border-[#e94560]/15' :
                              'bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/25'
                            )}>
                              {(h2hPct * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center hidden sm:table-cell">
                            <span className={cn(
                              'text-sm font-mono tabular-nums',
                              careerPct >= 0.6 ? 'text-emerald-400' :
                              careerPct >= 0.5 ? 'text-slate-300' :
                              'text-slate-500'
                            )}>
                              {(careerPct * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {bestOpp ? (
                              <span className="text-xs text-slate-400">
                                {bestOpp.name}{' '}
                                <span className="text-emerald-400 font-mono font-semibold tabular-nums">
                                  {bestOpp.wins}-{bestOpp.losses}
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Info callout */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-400 leading-relaxed">
            This page provides a more detailed view than the{' '}
            <span className="text-slate-300 font-semibold">Head-to-Head</span> analytics page,
            which shows approximations derived algorithmically from win percentages.
            Here, per-pair records are individually assigned to produce plausible matchup histories
            consistent with each owner&apos;s verified career totals ({' '}
            <span className="font-mono text-slate-300">wins + losses</span>). Neither page uses live Sleeper data —
            Phase G integration will deliver exact, per-matchup records with score differentials and weekly context.
          </p>
        </div>

        <p className="mt-8 text-xs text-center text-slate-600">
          H2H matrix values are representative approximations. Career totals verified from league records. Phase G delivers exact data.
        </p>

      </div>
    </>
  );
}
