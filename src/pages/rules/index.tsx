import Head from 'next/head';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface RuleEntry {
  term: string;
  definition: string;
}

const GENERAL_RULES: RuleEntry[] = [
  {
    term: 'Format',
    definition: '12-team dynasty league. Superflex (2 QB/SF spots). Full PPR scoring.',
  },
  {
    term: 'Roster Size',
    definition: '9 starters + 7 bench spots + 3 taxi squad spots + 2 IR spots = 21 total.',
  },
  {
    term: 'Starting Lineup',
    definition: '1 QB, 2 RB, 2 WR, 1 TE, 1 Flex (RB/WR/TE), 1 Superflex (QB/RB/WR/TE), 1 K, 1 DEF.',
  },
  {
    term: 'Taxi Squad',
    definition: '3 spots for players in their first 3 seasons of NFL eligibility. Must declare taxi squad players before Week 1 each season.',
  },
  {
    term: 'IR Spots',
    definition: '2 IR spots. Player must have an official IR designation to be eligible.',
  },
  {
    term: 'FAAB',
    definition: '$10,000 blind bid budget per season. Resets each year. Minimum bid is $0.',
  },
  {
    term: 'Waiver Priority',
    definition: 'After FAAB blind bid, priority resets each week. The last team to successfully claim moves to last priority.',
  },
  {
    term: 'Trade Deadline',
    definition: 'After Week 14. Trades including future draft picks are allowed year-round outside of the deadline restriction window.',
  },
  {
    term: 'Scoring Disputes',
    definition: 'Commissioner has final say on all scoring disputes. Disputes must be raised within 48 hours of the score being posted.',
  },
];

const PLAYOFF_RULES: RuleEntry[] = [
  {
    term: 'Playoff Field',
    definition: '6 teams qualify — seeds 1 through 6 based on regular season standings.',
  },
  {
    term: 'Playoff Schedule',
    definition: 'Weeks 15, 16, and 17. Three rounds total.',
  },
  {
    term: 'First-Round Bye',
    definition: 'Top 2 seeds receive a bye in Week 15 (first round). Seeds 3–6 play in the first round.',
  },
  {
    term: 'Bracket',
    definition: 'Standard single-elimination bracket seeded 1–6. Higher seed is home team (no home-field advantage in scoring).',
  },
];

const DRAFT_RULES: RuleEntry[] = [
  {
    term: 'Rookie Draft Format',
    definition: 'Linear format, 4 rounds. Pick order is the same in every round (snake rules do NOT apply).',
  },
  {
    term: 'Rookie Draft Timing',
    definition: 'First Friday of June (est. Jun 6, 2026 for the 2026 season).',
  },
  {
    term: 'Draft Order — Non-Playoff Teams',
    definition: 'Picks 1–6 assigned to non-playoff teams in reverse order of final regular season standings (worst record picks first).',
  },
  {
    term: 'Draft Order — Playoff Teams',
    definition: 'Picks 7–12 assigned to playoff teams in order of playoff seeding (lowest seed picks first among playoff teams).',
  },
  {
    term: 'Future Pick Trading',
    definition: 'Future draft picks (up to 2 years out) may be included in trades year-round.',
  },
];

const SCORING_RULES: { category: string; entries: Array<{ play: string; points: string }> }[] = [
  {
    category: 'Passing',
    entries: [
      { play: 'Passing yards', points: '0.04 pts/yd (25 yds = 1 pt)' },
      { play: 'Passing TD', points: '4 pts' },
      { play: 'Interception thrown', points: '-1 pt' },
    ],
  },
  {
    category: 'Rushing',
    entries: [
      { play: 'Rushing yards', points: '0.1 pts/yd (10 yds = 1 pt)' },
      { play: 'Rushing TD', points: '6 pts' },
    ],
  },
  {
    category: 'Receiving',
    entries: [
      { play: 'Reception', points: '1 pt (Full PPR)' },
      { play: 'Receiving yards', points: '0.1 pts/yd (10 yds = 1 pt)' },
      { play: 'Receiving TD', points: '6 pts' },
    ],
  },
  {
    category: 'Misc / Penalties',
    entries: [
      { play: 'Fumble lost', points: '-2 pts' },
      { play: '2-point conversion (pass/rush/rec)', points: '2 pts' },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-black text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function RuleTable({ rules }: { rules: RuleEntry[] }) {
  return (
    <dl className="rounded-xl overflow-hidden border border-[#2d4a66] divide-y divide-[#2d4a66]">
      {rules.map((rule, i) => (
        <div
          key={rule.term}
          className={cn(
            'grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0',
            i % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#1a2d42]'
          )}
        >
          <dt className="px-4 py-3 font-semibold text-slate-200 text-sm sm:border-r border-[#2d4a66] flex items-start">
            {rule.term}
          </dt>
          <dd className="px-4 py-3 text-slate-400 text-sm leading-relaxed">
            {rule.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ScoringTable() {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Play
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              Points
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2d4a66]">
          {SCORING_RULES.map((category) => (
            <>
              <tr key={`cat-${category.category}`} className="bg-[#0f2744]">
                <td
                  colSpan={2}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ffd700]"
                >
                  {category.category}
                </td>
              </tr>
              {category.entries.map((entry, i) => (
                <tr
                  key={`${category.category}-${i}`}
                  className="bg-[#16213e] hover:bg-[#1a2d42] transition-colors duration-100"
                >
                  <td className="px-4 py-2.5 text-slate-300">{entry.play}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-white whitespace-nowrap">
                    {entry.points}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RulesPage() {
  return (
    <>
      <Head>
        <title>League Rules — BMFFFL Dynasty</title>
        <meta name="description" content="Official BMFFFL dynasty fantasy football league rules — scoring, roster, playoffs, and draft." />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
              BMFFFL
            </p>
            <h1 className="text-4xl font-black text-white mb-2">League Rules</h1>
            <p className="text-slate-400 text-sm">
              Official rules reference for the BMFFFL dynasty league. Commissioner has final say on all disputes.
            </p>
          </div>

          {/* Quick summary banner */}
          <div className="rounded-xl p-4 bg-[#ffd700]/5 border border-[#ffd700]/20 mb-8">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">12-team</span> dynasty
              </span>
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">Superflex</span> (2 QB/SF spots)
              </span>
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">Full PPR</span> (1.0 pts/rec)
              </span>
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">4 pts</span> passing TDs
              </span>
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">$10,000</span> FAAB/season
              </span>
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">6-team</span> playoffs
              </span>
            </div>
          </div>

          {/* Two-column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">

            {/* Left column */}
            <div className="space-y-8">
              <section>
                <SectionHeader title="General Rules" subtitle="Roster, FAAB, trades, and disputes" />
                <RuleTable rules={GENERAL_RULES} />
              </section>

              <section>
                <SectionHeader title="Playoff Rules" subtitle="6-team bracket, Weeks 15–17" />
                <RuleTable rules={PLAYOFF_RULES} />
              </section>

              <section>
                <SectionHeader title="Rookie Draft Rules" subtitle="Linear format, 4 rounds" />
                <RuleTable rules={DRAFT_RULES} />
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <section>
                <SectionHeader title="Scoring System" subtitle="Full PPR · 4-pt passing TDs · -2 fumble lost" />
                <ScoringTable />
              </section>

              {/* Roster breakdown card */}
              <section>
                <SectionHeader title="Roster Breakdown" subtitle="21 total slots" />
                <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Slot</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Eligible Positions</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d4a66]">
                      {[
                        { slot: 'QB', eligible: 'QB', count: '1' },
                        { slot: 'RB', eligible: 'RB', count: '2' },
                        { slot: 'WR', eligible: 'WR', count: '2' },
                        { slot: 'TE', eligible: 'TE', count: '1' },
                        { slot: 'Flex', eligible: 'RB / WR / TE', count: '1' },
                        { slot: 'Superflex', eligible: 'QB / RB / WR / TE', count: '1' },
                        { slot: 'K', eligible: 'K', count: '1' },
                        { slot: 'DEF', eligible: 'Team Defense', count: '1' },
                        { slot: 'Bench', eligible: 'Any', count: '7' },
                        { slot: 'Taxi Squad', eligible: 'Yr 1–3 rookies', count: '3' },
                        { slot: 'IR', eligible: 'IR-designated', count: '2' },
                      ].map((row, i) => (
                        <tr
                          key={row.slot}
                          className={cn(
                            'transition-colors duration-100',
                            i % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#1a2d42]'
                          )}
                        >
                          <td className="px-4 py-2.5 font-semibold text-white">{row.slot}</td>
                          <td className="px-4 py-2.5 text-slate-400">{row.eligible}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-200">{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-10 pt-6 border-t border-[#2d4a66] text-xs text-slate-500">
            Rules last reviewed March 2026. All disputes subject to commissioner ruling within 48 hours of the scoring event.
          </div>
        </div>
      </main>
    </>
  );
}
