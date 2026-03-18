import Head from 'next/head';
import { Activity, AlertTriangle, CheckCircle, TrendingDown, Shield, Award } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Outlook = 'FULL RETURN' | 'MONITOR' | 'OPTIMISTIC' | 'SELL';

interface CurrentInjury {
  player:        string;
  position:      string;
  nflTeam:       string;
  owner:         string;
  injuryType:    string;
  dynastyImpact: number;
  outlook:       Outlook;
  timeline:      string;
  notes:         string;
}

interface AdjustedRecord {
  owner:          string;
  actual:         string;
  adjusted:       string;
  injuredPlayer:  string;
  estimatedWins:  number;
}

interface AllTimeRecord {
  label:    string;
  value:    string;
  detail:   string;
  icon:     'trophy' | 'shield' | 'alert' | 'trending';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CURRENT_INJURIES: CurrentInjury[] = [
  {
    player:        'Jonathon Brooks',
    position:      'RB',
    nflTeam:       'CAR',
    owner:         'SexMachineAndyD',
    injuryType:    'ACL tear — full season lost in 2025',
    dynastyImpact: -1200,
    outlook:       'OPTIMISTIC',
    timeline:      'Expected full return training camp 2026',
    notes:         'Young RB talent with a high pre-injury dynasty ceiling. ACL recovery at age 22 carries a strong prognosis. 2026 is the full evaluation window.',
  },
  {
    player:        'Rashee Rice',
    position:      'WR',
    nflTeam:       'KC',
    owner:         'MLSchools12',
    injuryType:    'Suspension — missed most of 2025 season',
    dynastyImpact: -900,
    outlook:       'FULL RETURN',
    timeline:      'Eligible and expected fully available 2026',
    notes:         'Suspension served. Returns to a prime Patrick Mahomes connection. Dynasty value should recover significantly if he reclaims his role in the KC offense.',
  },
  {
    player:        'Javonte Williams',
    position:      'RB',
    nflTeam:       'DEN',
    owner:         'rbr',
    injuryType:    'Knee management — cautious usage following prior ACL',
    dynastyImpact: -600,
    outlook:       'MONITOR',
    timeline:      'Situation-dependent — watch offseason workload reports',
    notes:         'Previous ACL created permanent uncertainty around his explosiveness. Limited 2025 usage kept his dynasty value suppressed. A change in usage or coaching approach could revive value.',
  },
  {
    player:        'Breece Hall',
    position:      'RB',
    nflTeam:       'NYJ',
    owner:         'Tubes94',
    injuryType:    'Knee management — played through soreness in 2025',
    dynastyImpact: -400,
    outlook:       'OPTIMISTIC',
    timeline:      'Expected healthy for 2026 season',
    notes:         'The cautious usage in 2025 was likely protective rather than indicative of serious long-term damage. His talent profile and age-24 upside remain compelling dynasty assets.',
  },
  {
    player:        'Kyren Williams',
    position:      'RB',
    nflTeam:       'LAR',
    owner:         'JuicyBussy',
    injuryType:    'Ankle — late 2025 injury',
    dynastyImpact: -200,
    outlook:       'FULL RETURN',
    timeline:      'Expected full recovery by training camp 2026',
    notes:         'Ankle injuries in late-season rarely carry long-term implications. Kyren Williams remains a top LAR asset with clear role security entering 2026.',
  },
  {
    player:        'Davante Adams',
    position:      'WR',
    nflTeam:       'LV',
    owner:         'MLSchools12',
    injuryType:    'Age-related decline + knee soreness',
    dynastyImpact: -800,
    outlook:       'SELL',
    timeline:      'Dynasty value declining regardless of recovery',
    notes:         'Adams is 33 entering 2026. The knee soreness compounds an already-declining age curve. His dynasty value is near exhaustion — sell now while name recognition still carries trade leverage.',
  },
];

const ADJUSTED_RECORDS: AdjustedRecord[] = [
  {
    owner:         'SexMachineAndyD',
    actual:        '6-7',
    adjusted:      '8-5',
    injuredPlayer: 'Jonathon Brooks (ACL, full season)',
    estimatedWins: 2,
  },
  {
    owner:         'MLSchools12',
    actual:        '7-6',
    adjusted:      '8-5',
    injuredPlayer: 'Rashee Rice (suspension)',
    estimatedWins: 1,
  },
  {
    owner:         'rbr',
    actual:        '6-7',
    adjusted:      '7-6',
    injuredPlayer: 'Javonte Williams (knee managed)',
    estimatedWins: 1,
  },
  {
    owner:         'Tubes94',
    actual:        '9-4',
    adjusted:      '10-3',
    injuredPlayer: 'Breece Hall (knee managed)',
    estimatedWins: 1,
  },
  {
    owner:         'JuicyBussy',
    actual:        '7-6',
    adjusted:      '8-5',
    injuredPlayer: 'Kyren Williams (ankle, late season)',
    estimatedWins: 1,
  },
  {
    owner:         'tdtd19844',
    actual:        '10-3',
    adjusted:      '10-3',
    injuredPlayer: 'No significant injuries — stayed healthy through playoffs',
    estimatedWins: 0,
  },
];

const ALL_TIME_RECORDS: AllTimeRecord[] = [
  {
    label:   'Most Injury-Impacted Season',
    value:   'SexMachineAndyD — 2025',
    detail:  'Lost Jonathon Brooks for the entire season to an ACL tear — the single largest individual dynasty value loss in recent BMFFFL history.',
    icon:    'alert',
  },
  {
    label:   'Most Injury-Resilient Roster',
    value:   'MLSchools12 — All-Time',
    detail:  'Depth has consistently masked individual injuries. Despite frequent injury exposure, roster depth has prevented any single injury from derailing a full season.',
    icon:    'shield',
  },
  {
    label:   'Most Injury-Lucky Team (2025)',
    value:   'Tubes94',
    detail:  "Breece Hall stayed healthy enough to produce through 2025. Despite chronic knee management, Hall's cautious usage preserved Tubes94's postseason viability.",
    icon:    'trophy',
  },
  {
    label:   'The ACL Curse',
    value:   '4 ACL injuries since 2020',
    detail:  'BMFFFL has seen four ACL injuries to top-5 dynasty players since 2020 — an unusually high frequency that has shaped multiple managers\' dynasty strategies.',
    icon:    'trending',
  },
];

const HISTORICAL_IMPACT = [
  {
    year:      '2025',
    summary:   'Most injury-impacted team: SexMachineAndyD (Jonathon Brooks ACL). Most injury-lucky: Tubes94 (Breece Hall stayed healthy enough). Biggest dynasty value loss: Brooks ACL, -1,800 from peak. Most impactful health: tdtd19844 key players stayed healthy through playoffs.',
    highlight: 'Brooks ACL — Season-defining injury',
  },
  {
    year:      '2024',
    summary:   'Tua Tagovailoa concussion issues impacted MLSchools12 QB-adjacent assets. CeeDee Lamb shoulder cost multiple weeks. Christian McCaffrey hamstring/PCL concerns loomed large for SF-adjacent rosters.',
    highlight: 'Tua concussion situation — ongoing risk',
  },
  {
    year:      '2023',
    summary:   'Historically the most significant dynasty value loss year across the league. Multiple managers saw top-5 dynasty players miss significant time. The ACL Curse continued with another high-profile tear.',
    highlight: 'Worst dynasty value loss year on record',
  },
  {
    year:      '2022',
    summary:   "Javonte Williams ACL in Denver marked the start of his multi-year recovery story. Depth-heavy rosters weathered the storm better than star-dependent builds.",
    highlight: 'Javonte Williams ACL — long recovery arc begins',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const OUTLOOK_CONFIG: Record<Outlook, { label: string; color: string; bg: string; border: string }> = {
  'FULL RETURN': {
    label:  'FULL RETURN',
    color:  '#4ade80',
    bg:     'bg-green-500/10',
    border: 'border-green-500/30',
  },
  OPTIMISTIC: {
    label:  'OPTIMISTIC',
    color:  '#60a5fa',
    bg:     'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  MONITOR: {
    label:  'MONITOR',
    color:  '#fbbf24',
    bg:     'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  SELL: {
    label:  'SELL',
    color:  '#e94560',
    bg:     'bg-red-500/10',
    border: 'border-red-500/30',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function InjuryTrackerPage() {
  const totalLost = CURRENT_INJURIES.reduce((sum, i) => sum + i.dynastyImpact, 0);

  return (
    <>
      <Head>
        <title>Injury Impact Tracker | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Tracks how injuries to key BMFFFL-rostered players have impacted dynasty value and season performance — current situations, historical impact, and injury-adjusted records."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Injury Impact Tracker</h1>
          <p className="text-slate-400 text-sm">
            Current injury situations &amp; historical impact on BMFFFL rosters
          </p>

          {/* Summary stat strip */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-lg px-4 py-3 min-w-[140px]">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Active Situations</p>
              <p className="text-2xl font-black text-white">{CURRENT_INJURIES.length}</p>
            </div>
            <div className="bg-[#16213e] border border-red-500/30 rounded-lg px-4 py-3 min-w-[180px]">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Total Dynasty Value Lost</p>
              <p className="text-2xl font-black text-red-400">{totalLost.toLocaleString()}</p>
            </div>
            <div className="bg-[#16213e] border border-yellow-500/30 rounded-lg px-4 py-3 min-w-[180px]">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">ACL Injuries Since 2020</p>
              <p className="text-2xl font-black text-yellow-400">4</p>
            </div>
            <div className="bg-[#16213e] border border-green-500/30 rounded-lg px-4 py-3 min-w-[160px]">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Expecting Full Return</p>
              <p className="text-2xl font-black text-green-400">
                {CURRENT_INJURIES.filter((i) => i.outlook === 'FULL RETURN' || i.outlook === 'OPTIMISTIC').length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Current Situations ──────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Current Situations</h2>
          <p className="text-slate-500 text-xs mb-6">March 2026 offseason — active injury and recovery cases</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRENT_INJURIES.map((inj) => {
              const cfg = OUTLOOK_CONFIG[inj.outlook];
              return (
                <div
                  key={inj.player}
                  className={cn(
                    'bg-[#16213e] rounded-xl p-5 border flex flex-col gap-3',
                    cfg.border,
                  )}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-black text-white text-base leading-tight truncate">
                        {inj.player}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {inj.position} · {inj.nflTeam}
                      </div>
                    </div>
                    {/* Outlook badge */}
                    <div
                      className={cn(
                        'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap',
                        cfg.bg,
                      )}
                      style={{ color: cfg.color }}
                    >
                      {cfg.label}
                    </div>
                  </div>

                  {/* Accent bar */}
                  <div
                    className="h-px w-full rounded-full opacity-30"
                    style={{ backgroundColor: cfg.color }}
                  />

                  {/* Injury type */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                      Injury / Situation
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">{inj.injuryType}</p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                      Timeline
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">{inj.timeline}</p>
                  </div>

                  {/* Notes */}
                  <div className={cn('rounded-lg px-3 py-2', cfg.bg)}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: cfg.color }}>
                      Dynasty Notes
                    </p>
                    <p className="text-slate-200 text-xs leading-relaxed">{inj.notes}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs mt-auto pt-1">
                    <span className="text-slate-500">
                      Owner: <span className="text-slate-300 font-medium">{inj.owner}</span>
                    </span>
                    <span className="font-bold text-red-400">
                      {inj.dynastyImpact.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Historical Impact ───────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Historical Injury Impact</h2>
          <p className="text-slate-500 text-xs mb-6">Year-by-year summary of how injuries shaped BMFFFL rosters</p>

          <div className="flex flex-col gap-3">
            {HISTORICAL_IMPACT.map((yr) => (
              <div
                key={yr.year}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center">
                    <span className="text-[#ffd700] font-black text-sm">{yr.year}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#ffd700] mb-1 uppercase tracking-wide">
                    {yr.highlight}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">{yr.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All-Time Records ────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">All-Time Injury Records</h2>
          <p className="text-slate-500 text-xs mb-6">Defining injury moments in BMFFFL history</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_TIME_RECORDS.map((rec) => {
              const Icon =
                rec.icon === 'trophy'   ? Award        :
                rec.icon === 'shield'   ? Shield       :
                rec.icon === 'alert'    ? AlertTriangle :
                TrendingDown;

              const iconColor =
                rec.icon === 'trophy'   ? '#ffd700' :
                rec.icon === 'shield'   ? '#4ade80' :
                rec.icon === 'alert'    ? '#e94560' :
                '#fbbf24';

              return (
                <div
                  key={rec.label}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 flex gap-4"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" style={{ color: iconColor }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                      {rec.label}
                    </p>
                    <p className="text-white font-bold text-sm mb-1">{rec.value}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{rec.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Injury-Adjusted Records ─────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Injury-Adjusted Records — 2025</h2>
          <p className="text-slate-500 text-xs mb-6">
            Estimated 2025 records if key injuries had not occurred — based on projected production and historical lineup impact
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-[#16213e]">
                    Owner
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-[#16213e]">
                    Actual Record
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-[#16213e]">
                    Adjusted Record
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-[#16213e]">
                    Wins Added
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-[#16213e]">
                    Injury Factor
                  </th>
                </tr>
              </thead>
              <tbody>
                {ADJUSTED_RECORDS.map((row, idx) => (
                  <tr
                    key={row.owner}
                    className={cn(
                      'border-b border-[#2d4a66] last:border-0',
                      idx % 2 === 0 ? 'bg-[#0d1b2a]' : 'bg-[#16213e]/50',
                    )}
                  >
                    <td className="px-4 py-3 font-bold text-white">{row.owner}</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-300">{row.actual}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#ffd700]">{row.adjusted}</td>
                    <td className="px-4 py-3 text-center">
                      {row.estimatedWins > 0 ? (
                        <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 text-xs font-bold">
                          +{row.estimatedWins}W
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.injuredPlayer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-600 mt-3">
            * Adjustments are estimates based on projected points-added per healthy start and historical lineup frequency.
          </p>
        </div>
      </section>

      {/* ── Bimfle Note ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#16213e] border border-[#ffd700]/20 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">A Word from Bimfle</span>
            </div>
            <blockquote className="text-slate-300 text-sm leading-relaxed italic">
              &ldquo;Injury is the dynasty manager&rsquo;s most feared adversary — beyond one&rsquo;s control
              and entirely consequential. Your Commissioner recommends depth at every position as the only
              reliable prophylactic.&rdquo;
            </blockquote>
            <p className="text-slate-500 text-xs mt-3">~Love, Bimfle.</p>
          </div>
        </div>
      </section>

      {/* ── Footer note ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-t border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-slate-600 text-center">
            Updated March 2026 — injury data based on known situations as of offseason reporting
          </p>
        </div>
      </section>
    </>
  );
}
