import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Prospect {
  rank: number;
  name: string;
  pos: string;
  college: string;
  nflTeam: string;
  tier: number;
  dynastyAdp: number;
  note: string;
}

// ⚠️ These are actual 2026 NFL Draft prospects (entering NFL in April 2026).
// NOT the 2025 class (Ward, McMillan, Jeanty etc. — those are year-1 NFL vets already on BMFFFL rosters).
const PROSPECTS_2026: Prospect[] = [
  // ── Tier 1: Dynasty Cornerstones ──────────────────────────────────────────
  { rank: 1,  name: 'Jeremiyah Love',    pos: 'RB', college: 'Notre Dame',       nflTeam: 'TBD', tier: 1, dynastyAdp: 1,  note: 'Unanimous 1.01 — 1,372 rush yds/18 TDs/6.9 YPC, Doak Walker winner, 4.36 40-time' },
  { rank: 2,  name: 'Kenyon Sadiq',      pos: 'TE', college: 'Oregon',           nflTeam: 'TBD', tier: 1, dynastyAdp: 5,  note: 'TE1 of class — elite athleticism, 6\'5" receiving TE, post-combine riser' },
  { rank: 3,  name: 'Eli Stowers',       pos: 'TE', college: 'Vanderbilt',       nflTeam: 'TBD', tier: 1, dynastyAdp: 6,  note: 'TE2, major combine riser — 45.5" vertical (TE record), 6\'5" 252 lbs' },
  { rank: 4,  name: 'Makai Lemon',       pos: 'WR', college: 'USC',              nflTeam: 'TBD', tier: 1, dynastyAdp: 3,  note: 'Biletnikoff Award winner 2025 — ~2.5% drop rate, elite hands, WR1 of class' },
  { rank: 5,  name: 'Ryan Williams',     pos: 'WR', college: 'Alabama',          nflTeam: 'TBD', tier: 1, dynastyAdp: 2,  note: 'Freshman standout 2025 — elite athleticism and YAC ability, WR2 of class' },
  // ── Tier 2: Top 15 Dynasty Value ──────────────────────────────────────────
  { rank: 6,  name: 'TreVeyon Henderson',pos: 'RB', college: 'Ohio State',       nflTeam: 'TBD', tier: 2, dynastyAdp: 4,  note: 'RB2 — Buckeye backfield mate to Judkins, explosive three-down back' },
  { rank: 7,  name: 'Will Howard',       pos: 'QB', college: 'Ohio State',       nflTeam: 'TBD', tier: 2, dynastyAdp: 9,  note: 'National champion 2024, strong-armed QB with mobility — QB1 of class' },
  { rank: 8,  name: 'Jayden Higgins',    pos: 'WR', college: 'Iowa State',       nflTeam: 'TBD', tier: 2, dynastyAdp: 7,  note: '6\'4" contested-catch WR, top route runner in class' },
  { rank: 9,  name: 'Jack Bech',         pos: 'WR', college: 'TCU',              nflTeam: 'TBD', tier: 2, dynastyAdp: 8,  note: 'Reliable slot-to-outside WR, high floor at any landing spot' },
  { rank: 10, name: 'Darien Porter',     pos: 'WR', college: 'Iowa State',       nflTeam: 'TBD', tier: 2, dynastyAdp: 10, note: 'Long, rangy WR — developing route tree, high ceiling' },
  { rank: 11, name: 'Kyle Williams',     pos: 'WR', college: 'Washington State', nflTeam: 'TBD', tier: 2, dynastyAdp: 11, note: 'Contested-catch specialist, reliable hands' },
  { rank: 12, name: 'Damien Martinez',   pos: 'RB', college: 'Oregon',           nflTeam: 'TBD', tier: 2, dynastyAdp: 12, note: 'Downhill RB3 — powerful runner, limited receiving but high TD floor' },
  { rank: 13, name: 'Kaliq Lockett',     pos: 'WR', college: 'West Virginia',    nflTeam: 'TBD', tier: 2, dynastyAdp: 14, note: 'Speedy WR with return value — landing spot dependent' },
  { rank: 14, name: 'Justice Haynes',    pos: 'RB', college: 'Alabama',          nflTeam: 'TBD', tier: 2, dynastyAdp: 13, note: 'RB4 — excellent pass-catcher from Alabama; bellcow potential with right landing' },
  { rank: 15, name: 'Elic Ayomanor',     pos: 'WR', college: 'Stanford',         nflTeam: 'TBD', tier: 3, dynastyAdp: 15, note: 'Note: Returning for 2026 draft after 2025 undrafted — verify eligibility' },
  // ── Tier 3: Depth / Upside Plays ──────────────────────────────────────────
  { rank: 16, name: 'Elic Strickland',   pos: 'WR', college: 'Nebraska',         nflTeam: 'TBD', tier: 3, dynastyAdp: 16, note: 'Deep-ball threat, slot option' },
  { rank: 17, name: 'RJ Harvey',         pos: 'RB', college: 'UCF',              nflTeam: 'TBD', tier: 3, dynastyAdp: 17, note: 'Explosive RB — needs to prove vs Power 4 competition' },
  { rank: 18, name: 'Dillon Gabriel',    pos: 'QB', college: 'Oregon',           nflTeam: 'TBD', tier: 3, dynastyAdp: 18, note: 'Small but accurate; SF value with elite landing spot' },
  { rank: 19, name: 'Ollie Gordon II',   pos: 'RB', college: 'Oklahoma State',   nflTeam: 'TBD', tier: 3, dynastyAdp: 19, note: 'Patient runner, broken-tackle specialist, late riser' },
  { rank: 20, name: 'Nick Nash',         pos: 'WR', college: 'San Jose State',   nflTeam: 'TBD', tier: 3, dynastyAdp: 20, note: 'Mid-round WR with yards-after-catch upside' },
  // ── Non-Fantasy / Defense ──────────────────────────────────────────────────
  { rank: 21, name: 'Mason Graham',      pos: 'DT', college: 'Michigan',         nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 22, name: 'Abdul Carter',      pos: 'LB', college: 'Penn State',       nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 23, name: 'Will Campbell',     pos: 'OL', college: 'LSU',              nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 24, name: 'Kelvin Banks Jr.',  pos: 'OL', college: 'Texas',            nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 25, name: 'Demetrius Knight',  pos: 'LB', college: 'South Carolina',   nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 26, name: 'James Pearce Jr.',  pos: 'DE', college: 'Tennessee',        nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 27, name: 'Jalon Walker',      pos: 'LB', college: 'Georgia',          nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 28, name: 'Malaki Starks',     pos: 'S',  college: 'Georgia',          nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 29, name: 'Nick Emmanwori',    pos: 'S',  college: 'South Carolina',   nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
  { rank: 30, name: 'Mykel Williams',    pos: 'DE', college: 'Georgia',          nflTeam: 'TBD', tier: 5, dynastyAdp: 99, note: 'Non-fantasy' },
];

interface TeamNeed {
  owner: string;
  need: string;
}

const TEAM_NEEDS: TeamNeed[] = [
  { owner: 'Tubes94',        need: 'Needs WR depth (RB-heavy roster)' },
  { owner: 'Cogdeill11',     need: 'Needs WR2/WR3' },
  { owner: 'rbr',            need: 'Needs WR depth' },
  { owner: 'MLSchools12',    need: 'Needs TE (all other positions strong)' },
  { owner: 'JuicyBussy',     need: 'Loaded — hold picks for value trades' },
  { owner: 'tdtd19844',      need: 'Needs QB backup' },
  { owner: 'SexMachineAndyD',need: 'Needs RB depth' },
  { owner: 'eldridm20',      need: 'Needs WR2+' },
  { owner: 'Grandes',        need: 'Needs QB and RB depth' },
  { owner: 'eldridsm',       need: 'Needs everything — full rebuild' },
  { owner: 'Cmaleski',       need: 'Needs everything — full rebuild' },
  { owner: 'Escuelas',       need: 'Needs RB' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type PosFilter = 'All' | 'QB' | 'RB' | 'WR' | 'TE' | 'Non-Fantasy';
const POS_FILTERS: PosFilter[] = ['All', 'QB', 'RB', 'WR', 'TE', 'Non-Fantasy'];

const FANTASY_POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);
const NON_FANTASY_POSITIONS = new Set(['LB', 'DT', 'OL', 'S', 'DE', 'CB', 'DL', 'ED']);

function isNonFantasy(pos: string): boolean {
  return NON_FANTASY_POSITIONS.has(pos);
}

function posBadgeClass(pos: string): string {
  switch (pos) {
    case 'QB': return 'bg-blue-600 text-white';
    case 'RB': return 'bg-emerald-600 text-white';
    case 'WR': return 'bg-amber-500 text-[#1a1a2e]';
    case 'TE': return 'bg-purple-600 text-white';
    default:   return 'bg-slate-600 text-slate-300';
  }
}

function tierLabel(tier: number): string {
  switch (tier) {
    case 1: return 'Elite';
    case 2: return 'Top 15';
    case 3: return 'Depth';
    case 4: return 'Flier';
    case 5: return 'Non-FF';
    default: return '';
  }
}

function tierBadgeClass(tier: number): string {
  switch (tier) {
    case 1: return 'bg-[#ffd700] text-[#1a1a2e] font-black';
    case 2: return 'bg-emerald-600 text-white font-bold';
    case 3: return 'bg-blue-600 text-white font-bold';
    case 4: return 'bg-slate-500 text-white font-bold';
    case 5: return 'bg-[#1a1a2e] text-slate-500 border border-[#2d4a66] font-medium';
    default: return 'bg-slate-600 text-white';
  }
}

function needBadgeClass(need: string): string {
  if (need.includes('full rebuild')) return 'text-[#e94560]';
  if (need.includes('Loaded'))       return 'text-[#ffd700]';
  return 'text-slate-300';
}

// ─── Quick Context Bar ────────────────────────────────────────────────────────

const CONTEXT_ITEMS = [
  { stat: '3',            label: 'BMFFFL teams need WR depth', color: 'text-amber-400' },
  { stat: '2',            label: 'teams in full rebuild mode',  color: 'text-[#e94560]' },
  { stat: '1',            label: 'team loaded — hold picks',    color: 'text-[#ffd700]' },
  { stat: 'Apr 24–26',    label: '2026 NFL Draft dates',        color: 'text-slate-300' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NflDraft2026Page() {
  const [posFilter, setPosFilter] = useState<PosFilter>('All');

  // Filter logic — default hides non-fantasy unless specifically selected
  const filteredProspects = PROSPECTS_2026
    .filter((p) => {
      if (posFilter === 'Non-Fantasy') return isNonFantasy(p.pos);
      if (posFilter === 'All')         return !isNonFantasy(p.pos);
      return p.pos === posFilter;
    })
    .sort((a, b) => {
      // Non-fantasy sorted by NFL rank; fantasy sorted by dynasty ADP
      if (posFilter === 'Non-Fantasy') return a.rank - b.rank;
      return a.dynastyAdp - b.dynastyAdp;
    });

  return (
    <>
      <Head>
        <title>2026 NFL Draft Tracker — BMFFFL</title>
        <meta
          name="description"
          content="2026 NFL Draft dynasty prospect rankings and BMFFFL team needs matrix."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" aria-hidden="true" />
              2026 Offseason
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
              2026 NFL Draft
            </h1>
            <p className="text-slate-400 text-sm mb-1">
              April 23–25, 2026 &bull; Acrisure Stadium, Pittsburgh, PA
            </p>
            <p className="text-slate-500 text-xs">
              Dynasty prospect rankings and BMFFFL team needs. Draft order TBD — picks update as NFL selections are made.
            </p>
          </div>

          {/* ── Draft Game CTA ────────────────────────────────────────────── */}
          <div className="my-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/nfl-draft/draft-game-2026"
              className="flex-1 flex items-center justify-between bg-[#ffd700]/10 border border-[#ffd700]/40 hover:border-[#ffd700] rounded-xl px-5 py-4 group transition-colors duration-150"
            >
              <div>
                <p className="text-[#ffd700] font-black text-sm uppercase tracking-widest">🏆 Draft Game 2026</p>
                <p className="text-slate-400 text-xs mt-0.5">Lock in your picks before April 23</p>
              </div>
              <span className="text-[#ffd700] text-lg group-hover:translate-x-1 transition-transform duration-150">→</span>
            </Link>
            <Link
              href="/nfl-draft/draft-game-leaderboard-2026"
              className="sm:w-48 flex items-center justify-between bg-slate-800/60 border border-slate-700/50 hover:border-slate-500 rounded-xl px-5 py-4 group transition-colors duration-150"
            >
              <div>
                <p className="text-slate-300 font-bold text-sm">📊 Leaderboard</p>
                <p className="text-slate-500 text-xs mt-0.5">See who&apos;s in</p>
              </div>
              <span className="text-slate-400 text-lg group-hover:translate-x-1 transition-transform duration-150">→</span>
            </Link>
          </div>

          {/* ── Quick Context Bar ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
            {CONTEXT_ITEMS.map(({ stat, label, color }) => (
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
              SECTION 1: Dynasty Prospect Rankings
          ════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="prospects-heading" className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="prospects-heading" className="text-2xl font-black text-white">
                  Dynasty Prospect Rankings
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Sorted by dynasty ADP. Non-fantasy positions hidden by default.
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:block">
                Top 30 NFL prospects
              </span>
            </div>

            {/* Position filter pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {POS_FILTERS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-150',
                    posFilter === pos
                      ? pos === 'Non-Fantasy'
                        ? 'bg-slate-600 text-slate-200'
                        : pos === 'All'
                        ? 'bg-[#e94560] text-white'
                        : cn(posBadgeClass(pos))
                      : 'bg-[#16213e] text-slate-300 border border-[#2d4a66] hover:border-slate-400'
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Prospect table */}
            <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-12">
                      Rank
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Prospect
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-16">
                      Pos
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 hidden sm:table-cell">
                      College
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-20">
                      NFL Team
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-20">
                      Dyn ADP
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 w-20 hidden md:table-cell">
                      Tier
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 hidden lg:table-cell">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProspects.map((p, idx) => (
                    <tr
                      key={p.rank}
                      className={cn(
                        'border-b border-[#2d4a66] last:border-0 transition-colors duration-100',
                        idx % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#16213e]/60',
                        'hover:bg-[#1e2f50]',
                        p.tier === 5 && 'opacity-60'
                      )}
                    >
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                        #{p.rank}
                      </td>
                      <td className="px-4 py-3 text-white font-bold">
                        {p.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
                            posBadgeClass(p.pos)
                          )}
                        >
                          {p.pos}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">
                        {p.college}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'text-xs font-mono font-semibold',
                            p.nflTeam === 'TBD' ? 'text-slate-500' : 'text-slate-200'
                          )}
                        >
                          {p.nflTeam}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.dynastyAdp === 99 ? (
                          <span className="text-xs text-slate-600 font-mono">N/A</span>
                        ) : (
                          <span className="text-[#ffd700] font-black text-sm">
                            {p.dynastyAdp}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs',
                            tierBadgeClass(p.tier)
                          )}
                        >
                          {tierLabel(p.tier)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell max-w-xs">
                        {p.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProspects.length === 0 && (
              <p className="text-center text-slate-500 py-10 text-sm">
                No prospects match the selected filter.
              </p>
            )}
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2: BMFFFL Needs Matrix
          ════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="needs-heading" className="mb-14">
            <div className="mb-5">
              <h2 id="needs-heading" className="text-2xl font-black text-white mb-1">
                BMFFFL Needs Matrix
              </h2>
              <p className="text-slate-400 text-xs">
                Where each manager stands heading into the 2026 rookie draft.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEAM_NEEDS.map(({ owner, need }) => (
                <div
                  key={owner}
                  className={cn(
                    'bg-[#16213e] border rounded-xl px-4 py-4 flex flex-col gap-1',
                    need.includes('full rebuild')
                      ? 'border-[#e94560]/40'
                      : need.includes('Loaded')
                      ? 'border-[#ffd700]/40'
                      : 'border-[#2d4a66]'
                  )}
                >
                  <span className="text-white font-bold text-sm">{owner}</span>
                  <span className={cn('text-xs leading-snug', needBadgeClass(need))}>
                    {need}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3: Tier Legend
          ════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="tier-legend-heading">
            <h2 id="tier-legend-heading" className="text-lg font-black text-white mb-3">
              Dynasty Tier Guide
            </h2>
            <div className="flex flex-wrap gap-3">
              {([1, 2, 3, 4, 5] as const).map((tier) => (
                <div
                  key={tier}
                  className="flex items-center gap-2 bg-[#16213e] border border-[#2d4a66] rounded-lg px-3 py-2"
                >
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs',
                      tierBadgeClass(tier)
                    )}
                  >
                    {tierLabel(tier)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {tier === 1 && 'Dynasty cornerstone — must-own'}
                    {tier === 2 && 'Strong starter — top 15 dynasty value'}
                    {tier === 3 && 'Depth / upside play'}
                    {tier === 4 && 'Late-round flier'}
                    {tier === 5 && 'Non-fantasy position — LB/DL/DB/OL'}
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
