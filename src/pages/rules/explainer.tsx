import Head from 'next/head';
import { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  Scale,
  Users,
  Trophy,
  ArrowLeftRight,
  Star,
  DollarSign,
  Shield,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RuleItem {
  rule: string;
  detail: string;
}

interface ExampleBox {
  label: string;
  text: string;
}

interface RulesCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  rules: RuleItem[];
  example?: ExampleBox;
  bimfle: string;
}

interface QuickFaq {
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_FAQS: QuickFaq[] = [
  {
    question: 'How many players on a roster?',
    answer: '24 total: 9 starters, 10 bench, 3 taxi squad, 2 IR.',
  },
  {
    question: 'Is it full PPR or half PPR?',
    answer: 'Half PPR — each reception scores 0.5 points.',
  },
  {
    question: 'When is the trade deadline?',
    answer: 'Week 10 of the regular season. Future picks can be traded year-round.',
  },
  {
    question: 'How much FAAB do I get per season?',
    answer: '$100, resets every year. Minimum bid is $1.',
  },
  {
    question: 'How many teams make the playoffs?',
    answer: '6 teams. Seeds 1–2 get a first-round bye.',
  },
  {
    question: 'Who has final say on disputes?',
    answer: 'Commissioner Grandes. Rule changes need a 7-of-12 majority vote.',
  },
  {
    question: 'What is the Moodie Bowl?',
    answer: 'The last-place consolation game. Loser pays a $20 shame fee the next season.',
  },
  {
    question: 'How far out can I trade draft picks?',
    answer: 'Up to 2 seasons in advance.',
  },
];

const RULES_CATEGORIES: RulesCategory[] = [
  {
    id: 'roster',
    title: 'Roster Construction',
    icon: <Users className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Total roster size',
        detail: '24 players — 9 starters, 10 bench spots, 3 taxi squad, 2 IR slots.',
      },
      {
        rule: 'Starting lineup',
        detail: '1 QB · 2 RB · 2 WR · 1 TE · 1 FLEX (RB/WR/TE) · 1 K · 1 DEF — 9 starters total.',
      },
      {
        rule: 'Taxi squad (3 spots)',
        detail: 'Players with fewer than 2 years of NFL experience only. Taxi squad players do not count against your active roster limit.',
      },
      {
        rule: 'IR slots (2 spots)',
        detail: 'Player must carry an official Injured Reserve designation. If a player is activated off IR by their NFL team, you have one week to move them to your bench or drop them.',
      },
      {
        rule: 'FLEX eligibility',
        detail: 'The FLEX slot accepts RB, WR, or TE — not QB.',
      },
    ],
    example: {
      label: 'Example',
      text: 'You roster Puka Nacua (WR, Year 2) — he still qualifies for the taxi squad. Once he enters Year 3, he must move to your active bench.',
    },
    bimfle:
      "The roster is one's domain. Curate it with the care of a Victorian collector arranging specimens. A bloated bench is a sign of panic; a lean squad signals confidence.",
  },
  {
    id: 'scoring',
    title: 'Scoring System',
    icon: <Zap className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Passing TD',
        detail: '4 points. Interception: −2 points. Every 25 passing yards = 1 point.',
      },
      {
        rule: 'Passing bonus',
        detail: '300+ passing yards in a game earns a 3-point bonus.',
      },
      {
        rule: 'Rushing TD',
        detail: '6 points. Every 10 rushing yards = 1 point.',
      },
      {
        rule: 'Rushing bonus',
        detail: '100+ rushing yards in a game earns a 3-point bonus.',
      },
      {
        rule: 'Receiving TD',
        detail: '6 points. Every 10 receiving yards = 1 point. Reception = 0.5 points (half PPR).',
      },
      {
        rule: 'Receiving bonus',
        detail: '100+ receiving yards in a game earns a 3-point bonus.',
      },
      {
        rule: 'Kicking — FG by distance',
        detail: '0–39 yds: 3 pts · 40–49 yds: 4 pts · 50+ yds: 5 pts. PAT = 1 pt. Missed FG = −1 pt.',
      },
      {
        rule: 'Defense / Special Teams',
        detail:
          'Sack: 1 pt · INT: 2 pts · Fumble recovery: 2 pts · Safety: 5 pts · DEF TD: 6 pts · Shutout: 10 pts · Allow <7 pts: 7 pts · Allow <14 pts: 4 pts · Allow <21 pts: 1 pt.',
      },
    ],
    example: {
      label: 'Scoring scenario',
      text: 'QB throws for 320 yards (12.8 pts for yardage + 3 bonus = 15.8), 2 TDs (+8), 1 INT (−2) = 21.8 points from passing alone.',
    },
    bimfle:
      "Half PPR — because full PPR rewards the checkdown merchant and this league refuses to celebrate mediocrity. Every point here is earned, not gifted.",
  },
  {
    id: 'draft',
    title: 'Draft Rules',
    icon: <Star className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Rookie draft format',
        detail: '3 rounds, 12 teams, 36 total picks. Linear (non-snake) — same order every round.',
      },
      {
        rule: 'Draft order',
        detail: 'Inverse of prior season standings: worst record picks first. Champion picks last in Round 1.',
      },
      {
        rule: 'Tradeable picks',
        detail: 'All draft picks are tradeable. You may trade picks up to 2 seasons in advance.',
      },
      {
        rule: 'Tiebreaker for draft order',
        detail: 'If two teams have the same record, total points scored (lowest points = earlier pick) is the tiebreaker.',
      },
      {
        rule: 'Auction FAAB for waivers',
        detail: '$100 budget per season for free agent pickups via blind bid. Resets to $100 each new season.',
      },
    ],
    example: {
      label: 'Trade example',
      text: "You trade your 2026 1st-round pick to a rival for their star RB. They now control your pick's slot — if you finish last, they pick 1.01.",
    },
    bimfle:
      "The rookie draft is where dynasties are born or buried. Mortgaging picks is permissible — but know that karma keeps a ledger, and the last-place team picks first for a reason.",
  },
  {
    id: 'trades',
    title: 'Trade Rules',
    icon: <ArrowLeftRight className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Trade deadline',
        detail: 'Week 10 of the regular season. No player-for-player trades after this point.',
      },
      {
        rule: 'Future picks — always open',
        detail: 'Trades involving only future draft picks can be made year-round, including after the trade deadline.',
      },
      {
        rule: 'Veto period',
        detail: '48 hours after a trade is submitted. Any owner may flag a trade for review; commissioner makes final call.',
      },
      {
        rule: 'Collusion',
        detail: 'Commissioner may void any trade with credible evidence of collusion. Both teams lose the assets involved.',
      },
      {
        rule: 'No reversal',
        detail: 'Once a trade is accepted and processed, it cannot be reversed without explicit commissioner approval.',
      },
      {
        rule: 'Future pick limit',
        detail: 'You may trade picks up to 2 years forward. No 3-year-out picks.',
      },
    ],
    example: {
      label: 'Veto example',
      text: 'Team A trades a stud WR1 for Team B\'s late-round pick. Owners can flag within 48 hours; the commissioner reviews and can void if it smells like a tank job.',
    },
    bimfle:
      "Trades are the lifeblood of a dynasty. Make them boldly, accept the consequences quietly. The veto exists to protect the league, not to punish innovation.",
  },
  {
    id: 'waivers',
    title: 'Waiver Wire',
    icon: <DollarSign className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'FAAB budget',
        detail: '$100 per team per season. Resets to $100 each year. Minimum bid: $1.',
      },
      {
        rule: 'Waiver processing',
        detail: 'Claims process Tuesday morning after each week. Blind bid — you do not see other bids.',
      },
      {
        rule: 'Tiebreaker',
        detail: 'If two teams bid the same amount, inverse standings order (worst record wins the tie).',
      },
      {
        rule: 'After FAAB is exhausted',
        detail: 'Once your $100 is spent, you can still claim players who clear waivers with a $0 bid — if no one with FAAB remaining also wants them.',
      },
      {
        rule: 'Free agents',
        detail: 'Players not claimed during the waiver window become free agents. Free agents can be added without a bid on a first-come, first-served basis.',
      },
    ],
    example: {
      label: 'Waiver scenario',
      text: "Running back breaks out in Week 6. You bid $22, a rival bids $21 — you win the claim and lose $22 from your budget. Your rival keeps their $21.",
    },
    bimfle:
      "The waiver wire is a silent auction, and like all auctions, it rewards those who know the true value of a player. Overbid on studs; let the timid have the handcuffs.",
  },
  {
    id: 'playoffs',
    title: 'Playoff Structure',
    icon: <Trophy className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Playoff field',
        detail: '6 teams qualify — top 6 by regular season record. Tiebreaker: total points scored.',
      },
      {
        rule: 'First-round bye',
        detail: 'Seeds 1 and 2 skip the first round (Week 15) and advance directly to the semifinals.',
      },
      {
        rule: 'Bracket',
        detail: 'Single elimination. QF: Week 15 · SF: Week 16 · Championship: Week 17.',
      },
      {
        rule: 'Moodie Bowl',
        detail: 'The bottom 2 regular-season finishers play in the Moodie Bowl. Loser earns maximum shame.',
      },
      {
        rule: 'Championship prize',
        detail: 'Perpetual league trophy + digital crown on Sleeper profile for the season.',
      },
    ],
    example: {
      label: 'Seeding example',
      text: 'Seeds 3 vs 6 and 4 vs 5 play in the QF (Week 15). Winners join Seeds 1 and 2 in the SF (Week 16). SF winners meet in the Championship (Week 17).',
    },
    bimfle:
      "Six teams. Three weeks. One crown. The regular season is prologue. The truly dangerous teams reveal themselves in December, when the pressure is real and the rosters are battered.",
  },
  {
    id: 'fees',
    title: 'League Fees & Prizes',
    icon: <Scale className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Annual buy-in',
        detail: '$100 per team per season. Must be paid before the rookie draft.',
      },
      {
        rule: '1st place',
        detail: '60% of the prize pool.',
      },
      {
        rule: '2nd place',
        detail: '25% of the prize pool.',
      },
      {
        rule: '3rd place',
        detail: '15% of the prize pool.',
      },
      {
        rule: 'Moodie Bowl penalty',
        detail: 'Moodie Bowl loser must pay a $20 shame fee the following season — or wear the Moodie Crown at the Owners Meeting.',
      },
    ],
    example: {
      label: 'Payout example',
      text: '12 teams × $100 = $1,200 pool. 1st: $720 · 2nd: $300 · 3rd: $180. The Moodie Bowl loser contributes an extra $20 the following year.',
    },
    bimfle:
      "Money focuses the mind. The $100 entry ensures everyone is invested. The Moodie Crown, however, ensures they are humiliated. Both motivators are necessary.",
  },
  {
    id: 'commissioner',
    title: 'Commissioner Authority',
    icon: <Shield className="w-5 h-5" aria-hidden="true" />,
    rules: [
      {
        rule: 'Final say',
        detail: 'Commissioner Grandes has final authority on all rule disputes and scoring questions.',
      },
      {
        rule: 'Rule changes',
        detail: 'Permanent rule changes require a majority vote — 7 of 12 owners — at the annual Owners Meeting.',
      },
      {
        rule: 'Emergency rules',
        detail: 'Mid-season emergency rules may be enacted with 9 of 12 owner approval.',
      },
      {
        rule: 'Trade veto authority',
        detail: 'Commissioner may void trades with credible evidence of collusion or league manipulation.',
      },
      {
        rule: 'Disputes window',
        detail: 'Scoring disputes must be raised within 48 hours of the score being posted.',
      },
    ],
    example: {
      label: 'Rule change example',
      text: 'At the 2026 Owners Meeting, 7+ owners vote to change the scoring from half PPR to full PPR. The change takes effect the following season.',
    },
    bimfle:
      "The commissioner is not a tyrant — merely a necessary arbiter in a league of strong opinions. Respect the office, even when you disagree with the ruling. That is what separates a dynasty from anarchy.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuickReferenceBar() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors duration-150"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <span className="font-bold text-white text-sm">Quick Reference — Most Asked Questions</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="border-t border-[#2d4a66] grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#2d4a66]">
          {QUICK_FAQS.map((faq) => (
            <div key={faq.question} className="px-5 py-3 border-b border-[#2d4a66] last:border-b-0 sm:last:border-b-0">
              <p className="text-xs font-semibold text-[#ffd700] mb-0.5">{faq.question}</p>
              <p className="text-sm text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CategoryAccordion({
  category,
  isOpen,
  onToggle,
}: {
  category: RulesCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700] focus-visible:ring-inset"
        aria-expanded={isOpen}
        id={`accordion-header-${category.id}`}
        aria-controls={`accordion-panel-${category.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-[#ffd700]">{category.icon}</span>
          <span className="font-bold text-white">{category.title}</span>
          <span className="hidden sm:inline text-xs text-slate-500">
            {category.rules.length} rule{category.rules.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Body */}
      {isOpen && (
        <div
          id={`accordion-panel-${category.id}`}
          role="region"
          aria-labelledby={`accordion-header-${category.id}`}
          className="border-t border-[#2d4a66]"
        >
          {/* Rules list */}
          <ul className="divide-y divide-[#2d4a66]">
            {category.rules.map((item) => (
              <li
                key={item.rule}
                className="grid grid-cols-1 sm:grid-cols-[220px_1fr] px-5 py-3 gap-0.5 sm:gap-4 bg-[#0d1b2a]/30"
              >
                <span className="text-sm font-semibold text-slate-200">{item.rule}</span>
                <span className="text-sm text-slate-400 leading-relaxed">{item.detail}</span>
              </li>
            ))}
          </ul>

          {/* Example callout */}
          {category.example && (
            <div className="mx-5 my-4 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {category.example.label}
              </span>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">{category.example.text}</p>
            </div>
          )}

          {/* Bimfle commentary */}
          <div className="mx-5 mb-5 rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/5 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
              Bimfle Says
            </span>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed italic">
              &ldquo;{category.bimfle}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RulesExplainerPage() {
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(RULES_CATEGORIES.map((c) => c.id)));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return RULES_CATEGORIES;
    const q = search.toLowerCase();
    return RULES_CATEGORIES.filter((cat) => {
      if (cat.title.toLowerCase().includes(q)) return true;
      if (cat.bimfle.toLowerCase().includes(q)) return true;
      if (cat.example?.text.toLowerCase().includes(q)) return true;
      return cat.rules.some(
        (r) => r.rule.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q)
      );
    });
  }, [search]);

  // Auto-expand matched categories when searching
  const displayCategories = useMemo(() => {
    if (!search.trim()) return filteredCategories;
    return filteredCategories.map((cat) => ({ ...cat, forceOpen: true }));
  }, [filteredCategories, search]);

  return (
    <>
      <Head>
        <title>Rules Explainer — BMFFFL Dynasty</title>
        <meta
          name="description"
          content="The official BMFFFL dynasty fantasy football rulebook, explained by Bimfle. Searchable, categorized, with examples and commentary."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]">
                BMFFFL
              </p>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">League Rules Explainer</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              The official BMFFFL rulebook, explained by Bimfle. Searchable and categorized — ideal
              for new owners or settling disputes mid-season.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rules — try &quot;FAAB&quot;, &quot;trade deadline&quot;, &quot;taxi&quot;..."
              className={cn(
                'w-full pl-10 pr-4 py-3 rounded-xl text-sm',
                'bg-[#16213e] border border-[#2d4a66] text-white placeholder-slate-500',
                'focus:outline-none focus:border-[#ffd700]/60 focus:ring-1 focus:ring-[#ffd700]/30',
                'transition-colors duration-150'
              )}
              aria-label="Search rules"
            />
            {search && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {filteredCategories.length} section{filteredCategories.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Expand / Collapse controls */}
          {!search && (
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={expandAll}
                className="text-xs text-slate-400 hover:text-white transition-colors duration-150 underline underline-offset-2"
              >
                Expand all
              </button>
              <span className="text-slate-700">·</span>
              <button
                type="button"
                onClick={collapseAll}
                className="text-xs text-slate-400 hover:text-white transition-colors duration-150 underline underline-offset-2"
              >
                Collapse all
              </button>
            </div>
          )}

          {/* Quick reference */}
          <QuickReferenceBar />

          {/* Category accordions */}
          {displayCategories.length > 0 ? (
            <div className="space-y-3">
              {displayCategories.map((category) => (
                <CategoryAccordion
                  key={category.id}
                  category={category}
                  isOpen={
                    'forceOpen' in category
                      ? (category as RulesCategory & { forceOpen?: boolean }).forceOpen === true
                      : openSections.has(category.id)
                  }
                  onToggle={() => toggleSection(category.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-10 text-center">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-400 text-sm">
                No rules matched &ldquo;{search}&rdquo;. Try a different keyword.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[#2d4a66] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
            <span>Rules last reviewed March 2026. Commissioner Grandes has final authority on all disputes.</span>
            <a
              href="/rules"
              className="text-[#ffd700]/70 hover:text-[#ffd700] transition-colors duration-150 whitespace-nowrap"
            >
              View raw rules &rarr;
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
