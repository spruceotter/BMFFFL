import Head from 'next/head';
import Link from 'next/link';
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
    definition: '10 starters + 12 bench spots + 5 taxi squad spots + 3 IR spots = 30 total.',
  },
  {
    term: 'Starting Lineup',
    definition: '1 QB, 2 RB, 3 WR, 1 TE, 2 Flex (RB/WR/TE), 1 Superflex (QB/RB/WR/TE) — 10 starters total.',
  },
  {
    term: 'Taxi Squad',
    definition: '5 spots. Players may remain on taxi for up to 3 seasons of NFL eligibility. Must declare taxi squad players before Week 1 each season.',
  },
  {
    term: 'IR Spots',
    definition: '3 IR/Reserve spots. Eligible designations: IR, Out (O), or Doubtful (D). Players tagged SSPD, Did-not-report, or Not active do not qualify.',
  },
  {
    term: 'QB Limit',
    definition: 'Maximum 4 quarterbacks on active roster during the regular season. IR and taxi squad slots do not count toward this limit.',
  },
  {
    term: 'FAAB',
    definition: 'DogeFAAB — dynamic Dogecoin-backed blind bid budget. Refreshes each offseason. Minimum bid is $0.',
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
    definition: 'Future draft picks may be included in trades year-round. Owners may only trade picks for seasons in which they have already pre-paid league dues. Any trade including picks for an unpaid season is invalid until dues are paid in full for that year and every year before it. Source: 2021 Meeting, Prop M.',
  },
];

const PUNISHMENT_RULES: RuleEntry[] = [
  {
    term: 'Last Place — Loser Punishment',
    definition: 'The team that finishes last in the regular season standings must select one of three punishments before the season starts: (1) Run the Matt Moodie Memorial Mile (beer mile), (2) Wax their hairiest body part (excluding head/face), or (3) Play 18 holes of golf in a skirt. Established 2019 · Renamed 2023 · Selectable options added 2025.',
  },
  {
    term: 'Moodie Bowl — Losers Bracket',
    definition: 'Non-playoff teams compete in the Moodie Bowl (Sleeper\'s losers bracket). Each round, the higher-scoring team "escapes" the Moodie Bowl. The team that cannot escape — the final Moodie Bowl loser — must display a framed photo of Matt Moodie in a bathroom in their home for the entire following season. Must prove compliance if asked. Non-compliance = $100 FAAB fine. Note: the same person can finish last in the regular season AND lose the Moodie Bowl (both happened to Grandes in 2025). Source: 2022 Meeting, Prop G.',
  },
  {
    term: 'No-Call / No-Show',
    definition: 'Owners absent from the Owners Meeting without a proxy or advance notice have their team name chosen by the league via group poll, effective for the entire following season. Source: 2022 Meeting, Prop B / 2024 Meeting, SV-B.',
  },
  {
    term: 'Late to Meeting',
    definition: '$5 FAAB fine per minute late after the scheduled meeting start time. Source: 2024 Meeting, SV-A.',
  },
  {
    term: 'Inactivity Fine — The Mercy System',
    definition: 'After Tax Day, these are $100 FAAB punishable infractions: not voting on official polls, not responding to a trade offer within 5 days (offseason) or 3 days (in-season), starting a player on a BYE. The reporting owner must contact the offender first. The accused gets one Mercy plea — if 7+ owners vote No Mercy the fine stands. Third offense = possible expulsion vote. Source: 2022 Meeting, Prop B.',
  },
];

const SPECIAL_MECHANIC_RULES: RuleEntry[] = [
  {
    term: "STEAL!",
    definition: "Any owner may attempt to steal a taxi squad player by announcing 'STEAL!' in group chat with the target player named. The targeted owner has 48 hours to promote the player to their active roster, accept pick compensation (one round higher than the player's draft round), or trade the player elsewhere. Failure to respond = auto-steal. FA/FAAB-acquired taxi players cost a 3rd-round pick to steal. Source: 2024 Meeting, Prop C.",
  },
  {
    term: 'Plan B — Trade Counter Window',
    definition: "After a 'pushed' (immediately processed) trade, any owner may call for a Plan B Vote. If 4+ owners signal they have a better offer, either party may invoke Plan B and accept a counteroffer within 24 hours. There is no Plan C. Source: 2024 Meeting, Prop G.",
  },
  {
    term: 'Division Naming',
    definition: 'After each season, the top 2 divisions (by total combined team points) vote on whether to rename their division. If 75% of teams in a division agree on a new name, it becomes official. The top division also votes to name the bottom division. Source: 2022 Meeting, Prop A.',
  },
  {
    term: 'Core Four Challenge',
    definition: 'Season-long mini-league. Each owner designates a Core Four roster (QB + RB + WR + TE + 2 subs). Weekly Core Four rankings earn Core Points (1st = 10 pts down to last = −5 pts). One captain-doubler and one free swap per week. The Core Four champion earns a separate prize. Source: 2024 Meeting, Prop E.',
  },
  {
    term: 'Ultimate Championship',
    definition: 'Every 4 years, all dues-paying owners compete in a season-long survivor elimination tournament running alongside the main league (Weeks 1–16). Low scorer each week is eliminated. The first was held during the 2025 BMFFFL season. All owners contribute $10/year extra toward the jackpot (Champ: $300, Runner-up: $50). Source: 2022 Meeting, Prop J (amended 2024).',
  },
];

const SCORING_RULES: { category: string; entries: Array<{ play: string; points: string }> }[] = [
  {
    category: 'Passing',
    entries: [
      { play: 'Passing yards', points: '0.04 pts/yd (25 yds = 1 pt)' },
      { play: 'Passing TD', points: '4 pts' },
      { play: 'Interception thrown', points: '-3 pts' },
      { play: 'Pick 6 (returned for TD)', points: '-4 pts total (-1 extra)' },
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
                <span className="text-[#ffd700] font-bold">DogeFAAB</span> Dogecoin-backed
              </span>
              <span className="text-slate-300">
                <span className="text-[#ffd700] font-bold">6-team</span> playoffs
              </span>
            </div>
          </div>

          {/* Meeting history link */}
          <div className="mb-8 text-sm text-slate-500">
            Rules are derived from annual Owners Meeting votes.{' '}
            <Link href="/history/meetings" className="text-[#ffd700] hover:underline">
              View full meeting history →
            </Link>
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

              <section>
                <SectionHeader title="Punishments & Governance" subtitle="Established by Owners Meeting vote" />
                <RuleTable rules={PUNISHMENT_RULES} />
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <section>
                <SectionHeader title="Scoring System" subtitle="Full PPR · 4-pt passing TDs · -2 fumble lost" />
                <ScoringTable />
              </section>

              <section>
                <SectionHeader title="Special Mechanics" subtitle="Unique rules voted in by Owners Meeting" />
                <RuleTable rules={SPECIAL_MECHANIC_RULES} />
              </section>

              {/* Roster breakdown card */}
              <section>
                <SectionHeader title="Roster Breakdown" subtitle="30 total slots" />
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
                        { slot: 'WR', eligible: 'WR', count: '3' },
                        { slot: 'TE', eligible: 'TE', count: '1' },
                        { slot: 'Flex', eligible: 'RB / WR / TE', count: '2' },
                        { slot: 'Superflex', eligible: 'QB / RB / WR / TE', count: '1' },
                        { slot: 'Bench', eligible: 'Any', count: '12' },
                        { slot: 'Taxi Squad', eligible: 'Yr 1–3 rookies/draftees', count: '5' },
                        { slot: 'IR', eligible: 'IR-designated', count: '3' },
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
          <div className="mt-10 pt-6 border-t border-[#2d4a66] text-xs text-slate-500 space-y-1">
            <p>Rules last updated May 2026 — sourced from 10 years of Owners Meeting votes (2017–2026).</p>
            <p>All disputes subject to commissioner ruling within 48 hours of the scoring event.</p>
            <p>
              <Link href="/history/meetings" className="text-[#ffd700]/70 hover:text-[#ffd700]">
                Full meeting history →
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
