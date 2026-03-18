import Head from 'next/head';
import { useState } from 'react';
import { Trophy, Star, ChevronRight, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DraftPick {
  pick: string;        // e.g. "1.01"
  pickNum: number;     // 1–12
  player: string;
  position: string;
  nflTeam: string;
  manager: string;
  note?: string;
}

interface BestPick {
  year: number;
  player: string;
  manager: string;
  blurb: string;
}

interface DraftGrade {
  manager: string;
  grade: string;
  note: string;
}

interface SeasonDraft {
  year: number;
  label: string;
  picks: DraftPick[];
  grades: DraftGrade[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DRAFT_DATA: SeasonDraft[] = [
  {
    year: 2020,
    label: '2020 Rookie Draft (pre-season)',
    picks: [
      { pick: '1.01', pickNum: 1,  player: 'Travis Etienne',        position: 'RB', nflTeam: 'JAX', manager: 'eldridm20' },
      { pick: '1.02', pickNum: 2,  player: 'Justin Jefferson',       position: 'WR', nflTeam: 'MIN', manager: 'MLSchools12', note: 'All-time WR1 value' },
      { pick: '1.03', pickNum: 3,  player: 'CeeDee Lamb',            position: 'WR', nflTeam: 'DAL', manager: 'Cogdeill11', note: 'Elite WR' },
      { pick: '1.04', pickNum: 4,  player: 'Jerry Jeudy',            position: 'WR', nflTeam: 'DEN', manager: 'Grandes' },
      { pick: '1.05', pickNum: 5,  player: 'Jonathan Taylor',        position: 'RB', nflTeam: 'IND', manager: 'Tubes94', note: 'Future RB1' },
      { pick: '1.06', pickNum: 6,  player: 'Clyde Edwards-Helaire',  position: 'RB', nflTeam: 'KC',  manager: 'JuicyBussy' },
      { pick: '1.07', pickNum: 7,  player: 'Tee Higgins',            position: 'WR', nflTeam: 'CIN', manager: 'Cmaleski' },
      { pick: '1.08', pickNum: 8,  player: 'Laviska Shenault',       position: 'WR', nflTeam: '',    manager: 'eldridsm' },
      { pick: '1.09', pickNum: 9,  player: "D'Andre Swift",          position: 'RB', nflTeam: 'DET', manager: 'rbr' },
      { pick: '1.10', pickNum: 10, player: 'Cam Akers',              position: 'RB', nflTeam: 'LAR', manager: 'SexMachineAndyD' },
      { pick: '1.11', pickNum: 11, player: 'Henry Ruggs III',        position: 'WR', nflTeam: '',    manager: 'tdtd19844' },
      { pick: '1.12', pickNum: 12, player: 'Brandon Aiyuk',          position: 'WR', nflTeam: 'SF',  manager: 'Escuelas' },
    ],
    grades: [
      { manager: 'eldridm20',       grade: 'B+', note: 'Travis Etienne at 1.01 — Achilles cost him year one, but proved the pick.' },
      { manager: 'MLSchools12',     grade: 'A+', note: 'Justin Jefferson at 1.02 became arguably the best dynasty WR in football.' },
      { manager: 'Cogdeill11',      grade: 'A',  note: 'CeeDee Lamb at 1.03 — perennial WR1.' },
      { manager: 'Grandes',         grade: 'C+', note: 'Jerry Jeudy had the draft buzz; never fully delivered.' },
      { manager: 'Tubes94',         grade: 'A',  note: 'Jonathan Taylor fell to 1.05 — ran for 1,811 yards two years later.' },
      { manager: 'JuicyBussy',      grade: 'C',  note: 'CEH was a fine pick positionally; never lived up to top-6 billing.' },
      { manager: 'Cmaleski',        grade: 'B+', note: 'Tee Higgins is a reliable WR2 who has flashed WR1 upside.' },
      { manager: 'eldridsm',        grade: 'D',  note: 'Laviska Shenault never emerged — rough debut draft.' },
      { manager: 'rbr',             grade: 'B',  note: "D'Andre Swift had splash moments, durability has been the issue." },
      { manager: 'SexMachineAndyD', grade: 'B-', note: 'Cam Akers was a strong prospect; the Achilles derailed everything.' },
      { manager: 'tdtd19844',       grade: 'F',  note: 'Henry Ruggs III — career ended off the field.' },
      { manager: 'Escuelas',        grade: 'B+', note: 'Brandon Aiyuk at 1.12 is stellar value — eventual SF1.' },
    ],
  },
  {
    year: 2021,
    label: '2021 Rookie Draft',
    picks: [
      { pick: '1.01', pickNum: 1,  player: 'Trevor Lawrence',   position: 'QB', nflTeam: 'JAX', manager: 'Tubes94' },
      { pick: '1.02', pickNum: 2,  player: "Kyle Pitts",        position: 'TE', nflTeam: 'ATL', manager: 'JuicyBussy' },
      { pick: '1.03', pickNum: 3,  player: "Ja'Marr Chase",     position: 'WR', nflTeam: 'CIN', manager: 'MLSchools12', note: 'Greatest dynasty pick ever?' },
      { pick: '1.04', pickNum: 4,  player: 'DeVonta Smith',     position: 'WR', nflTeam: 'PHI', manager: 'Cogdeill11' },
      { pick: '1.05', pickNum: 5,  player: 'Najee Harris',      position: 'RB', nflTeam: 'PIT', manager: 'Grandes' },
      { pick: '1.06', pickNum: 6,  player: 'Jaylen Waddle',     position: 'WR', nflTeam: 'MIA', manager: 'eldridm20' },
      { pick: '1.07', pickNum: 7,  player: 'Rashod Bateman',    position: 'WR', nflTeam: '',    manager: 'Cmaleski' },
      { pick: '1.08', pickNum: 8,  player: 'Javonte Williams',  position: 'RB', nflTeam: 'DEN', manager: 'rbr' },
      { pick: '1.09', pickNum: 9,  player: 'Elijah Moore',      position: 'WR', nflTeam: '',    manager: 'eldridsm' },
      { pick: '1.10', pickNum: 10, player: 'Kadarius Toney',    position: 'WR', nflTeam: '',    manager: 'SexMachineAndyD' },
      { pick: '1.11', pickNum: 11, player: 'Rondale Moore',     position: 'WR', nflTeam: '',    manager: 'tdtd19844' },
      { pick: '1.12', pickNum: 12, player: 'Terrace Marshall',  position: 'WR', nflTeam: '',    manager: 'Escuelas' },
    ],
    grades: [
      { manager: 'Tubes94',         grade: 'B',  note: "Trevor Lawrence at 1.01 — franchise QB ceiling, slow start under Urban Meyer." },
      { manager: 'JuicyBussy',      grade: 'A-', note: 'Kyle Pitts was an elite tight end prospect; injuries limited the dynasty payoff.' },
      { manager: 'MLSchools12',     grade: 'A+', note: "Ja'Marr Chase at 1.03 — set the rookie WR record and never looked back. Elite." },
      { manager: 'Cogdeill11',      grade: 'A-', note: 'DeVonta Smith became a WR1-caliber dynasty asset. Great value at four.' },
      { manager: 'Grandes',         grade: 'B-', note: 'Najee Harris had volume but mediocre efficiency — expected more.' },
      { manager: 'eldridm20',       grade: 'B+', note: 'Jaylen Waddle is a reliable PPR weapon — excellent pick at 1.06.' },
      { manager: 'Cmaleski',        grade: 'D+', note: 'Rashod Bateman never stuck — one of the bigger draft busts of the class.' },
      { manager: 'rbr',             grade: 'B',  note: 'Javonte Williams flashed before the ACL; the upside was real.' },
      { manager: 'eldridsm',        grade: 'C-', note: 'Elijah Moore never developed into a consistent starter.' },
      { manager: 'SexMachineAndyD', grade: 'D',  note: 'Kadarius Toney became a punchline more than a player.' },
      { manager: 'tdtd19844',       grade: 'D',  note: 'Rondale Moore is easily the forgettable pick of the bunch.' },
      { manager: 'Escuelas',        grade: 'D+', note: 'Terrace Marshall never earned a starter role in the NFL.' },
    ],
  },
  {
    year: 2022,
    label: '2022 Rookie Draft',
    picks: [
      { pick: '1.01', pickNum: 1,  player: 'Drake London',      position: 'WR', nflTeam: 'ATL', manager: 'rbr' },
      { pick: '1.02', pickNum: 2,  player: 'Breece Hall',       position: 'RB', nflTeam: 'NYJ', manager: 'Grandes', note: 'ACL year 1 — returned strong' },
      { pick: '1.03', pickNum: 3,  player: 'Garrett Wilson',    position: 'WR', nflTeam: 'NYJ', manager: 'JuicyBussy', note: 'OROY winner' },
      { pick: '1.04', pickNum: 4,  player: 'Chris Olave',       position: 'WR', nflTeam: 'NO',  manager: 'MLSchools12' },
      { pick: '1.05', pickNum: 5,  player: 'Jameson Williams',  position: 'WR', nflTeam: 'DET', manager: 'Cogdeill11' },
      { pick: '1.06', pickNum: 6,  player: 'Jahan Dotson',      position: 'WR', nflTeam: '',    manager: 'eldridm20' },
      { pick: '1.07', pickNum: 7,  player: 'Christian Watson',  position: 'WR', nflTeam: 'GB',  manager: 'Cmaleski' },
      { pick: '1.08', pickNum: 8,  player: 'Treylon Burks',     position: 'WR', nflTeam: 'TEN', manager: 'Tubes94' },
      { pick: '1.09', pickNum: 9,  player: 'Skyy Moore',        position: 'WR', nflTeam: '',    manager: 'eldridsm' },
      { pick: '1.10', pickNum: 10, player: 'George Pickens',    position: 'WR', nflTeam: 'PIT', manager: 'SexMachineAndyD', note: 'Elite late-round steal' },
      { pick: '1.11', pickNum: 11, player: 'Dameon Pierce',     position: 'RB', nflTeam: 'HOU', manager: 'tdtd19844' },
      { pick: '1.12', pickNum: 12, player: 'Romeo Doubs',       position: 'WR', nflTeam: '',    manager: 'Escuelas' },
    ],
    grades: [
      { manager: 'rbr',             grade: 'B',  note: 'Drake London is a legit WR2 with alpha size. Solid 1.01.' },
      { manager: 'Grandes',         grade: 'A-', note: 'Breece Hall tore his ACL week five but came back as a top-5 RB dynasty asset.' },
      { manager: 'JuicyBussy',      grade: 'A',  note: 'Garrett Wilson won OROY and is among the best WRs in the league.' },
      { manager: 'MLSchools12',     grade: 'B+', note: 'Chris Olave is a premium route runner. Top pick value.' },
      { manager: 'Cogdeill11',      grade: 'B-', note: 'Jameson Williams is a deep-threat boom-or-bust pick. Upside still alive.' },
      { manager: 'eldridm20',       grade: 'D',  note: 'Jahan Dotson never developed into a reliable starter.' },
      { manager: 'Cmaleski',        grade: 'C+', note: 'Christian Watson had flashes but injuries derailed consistency.' },
      { manager: 'Tubes94',         grade: 'C-', note: 'Treylon Burks was a massive disappointment relative to his draft capital.' },
      { manager: 'eldridsm',        grade: 'D',  note: 'Skyy Moore was a total whiff.' },
      { manager: 'SexMachineAndyD', grade: 'A-', note: 'George Pickens at 1.10 is exceptional value — elite contested-catch WR.' },
      { manager: 'tdtd19844',       grade: 'C',  note: 'Dameon Pierce had one great game stretch, then faded.' },
      { manager: 'Escuelas',        grade: 'C-', note: 'Romeo Doubs is a depth piece at best.' },
    ],
  },
  {
    year: 2023,
    label: '2023 Rookie Draft',
    picks: [
      { pick: '1.01', pickNum: 1,  player: 'Bijan Robinson',       position: 'RB', nflTeam: 'ATL', manager: 'JuicyBussy', note: 'Most complete RB in years' },
      { pick: '1.02', pickNum: 2,  player: 'Jaxon Smith-Njigba',   position: 'WR', nflTeam: 'SEA', manager: 'MLSchools12' },
      { pick: '1.03', pickNum: 3,  player: 'Jordan Addison',       position: 'WR', nflTeam: 'MIN', manager: 'Grandes' },
      { pick: '1.04', pickNum: 4,  player: 'Quentin Johnston',     position: 'WR', nflTeam: '',    manager: 'Cogdeill11' },
      { pick: '1.05', pickNum: 5,  player: 'Sam LaPorta',          position: 'TE', nflTeam: 'DET', manager: 'eldridm20', note: 'Best TE in the class' },
      { pick: '1.06', pickNum: 6,  player: 'Zach Charbonnet',      position: 'RB', nflTeam: '',    manager: 'rbr' },
      { pick: '1.07', pickNum: 7,  player: 'Tank Dell',            position: 'WR', nflTeam: 'HOU', manager: 'SexMachineAndyD' },
      { pick: '1.08', pickNum: 8,  player: 'Jahmyr Gibbs',         position: 'RB', nflTeam: 'DET', manager: 'Cmaleski', note: 'PPR monster' },
      { pick: '1.09', pickNum: 9,  player: 'Rashee Rice',          position: 'WR', nflTeam: 'KC',  manager: 'Tubes94' },
      { pick: '1.10', pickNum: 10, player: 'Puka Nacua',           position: 'WR', nflTeam: 'LAR', manager: 'eldridsm', note: 'Record-breaking rookie' },
      { pick: '1.11', pickNum: 11, player: 'Roschon Johnson',      position: 'RB', nflTeam: '',    manager: 'tdtd19844' },
      { pick: '1.12', pickNum: 12, player: 'Cedric Tillman',       position: 'WR', nflTeam: '',    manager: 'Escuelas' },
    ],
    grades: [
      { manager: 'JuicyBussy',      grade: 'A+', note: 'Bijan Robinson is the best dynasty RB taken in years. Perfect 1.01.' },
      { manager: 'MLSchools12',     grade: 'A',  note: 'JSN is a WR1 in the making — high-floor dynasty WR.' },
      { manager: 'Grandes',         grade: 'B+', note: 'Jordan Addison is a reliable WR2 with WR1 potential.' },
      { manager: 'Cogdeill11',      grade: 'C',  note: 'Quentin Johnston had the measurables but the production never arrived.' },
      { manager: 'eldridm20',       grade: 'A',  note: 'Sam LaPorta became TE1 immediately — best TE pick of the draft.' },
      { manager: 'rbr',             grade: 'B-', note: 'Zach Charbonnet is a solid handcuff who earns snaps but not a starter.' },
      { manager: 'SexMachineAndyD', grade: 'B',  note: 'Tank Dell flashed big before injury — huge upside if healthy.' },
      { manager: 'Cmaleski',        grade: 'A',  note: 'Jahmyr Gibbs is a PPR monster in Detroit. Great late value.' },
      { manager: 'Tubes94',         grade: 'B+', note: 'Rashee Rice was electric before the legal issues slowed him down.' },
      { manager: 'eldridsm',        grade: 'A-', note: 'Puka Nacua at 1.10 set NFL rookie records. Exceptional late-round find.' },
      { manager: 'tdtd19844',       grade: 'D+', note: 'Roschon Johnson never broke through to a starter role.' },
      { manager: 'Escuelas',        grade: 'D',  note: 'Cedric Tillman is a fringe roster player — tough 1.12.' },
    ],
  },
  {
    year: 2024,
    label: '2024 Rookie Draft',
    picks: [
      { pick: '1.01', pickNum: 1,  player: 'Marvin Harrison Jr.', position: 'WR', nflTeam: 'ARI', manager: 'Cogdeill11', note: 'Generational WR prospect' },
      { pick: '1.02', pickNum: 2,  player: 'Malik Nabers',        position: 'WR', nflTeam: 'NYG', manager: 'MLSchools12' },
      { pick: '1.03', pickNum: 3,  player: 'Brian Thomas Jr.',    position: 'WR', nflTeam: 'JAX', manager: 'Grandes' },
      { pick: '1.04', pickNum: 4,  player: 'Rome Odunze',         position: 'WR', nflTeam: 'CHI', manager: 'JuicyBussy' },
      { pick: '1.05', pickNum: 5,  player: 'Brock Bowers',        position: 'TE', nflTeam: 'LV',  manager: 'Tubes94', note: 'OROY candidate' },
      { pick: '1.06', pickNum: 6,  player: 'Bo Nix',              position: 'QB', nflTeam: 'DEN', manager: 'Cmaleski' },
      { pick: '1.07', pickNum: 7,  player: 'J.J. McCarthy',       position: 'QB', nflTeam: 'MIN', manager: 'eldridm20' },
      { pick: '1.08', pickNum: 8,  player: 'Keon Coleman',        position: 'WR', nflTeam: '',    manager: 'rbr' },
      { pick: '1.09', pickNum: 9,  player: 'Ladd McConkey',       position: 'WR', nflTeam: '',    manager: 'SexMachineAndyD', note: 'Sneaky value' },
      { pick: '1.10', pickNum: 10, player: 'Trey Benson',         position: 'RB', nflTeam: '',    manager: 'eldridsm' },
      { pick: '1.11', pickNum: 11, player: 'Ray Davis',           position: 'RB', nflTeam: '',    manager: 'tdtd19844' },
      { pick: '1.12', pickNum: 12, player: 'Kimani Vidal',        position: 'RB', nflTeam: '',    manager: 'Escuelas' },
    ],
    grades: [
      { manager: 'Cogdeill11',      grade: 'A+', note: 'MHJ at 1.01 — generational WR talent going to a growing offense.' },
      { manager: 'MLSchools12',     grade: 'A',  note: 'Malik Nabers had one of the best rookie WR seasons in recent memory.' },
      { manager: 'Grandes',         grade: 'A',  note: 'Brian Thomas Jr. emerged as a true WR1 threat in Jacksonville.' },
      { manager: 'JuicyBussy',      grade: 'B+', note: 'Rome Odunze is a polished WR2 with alpha size. Good pick.' },
      { manager: 'Tubes94',         grade: 'A',  note: 'Brock Bowers shattered TE rookie records — elite dynasty value.' },
      { manager: 'Cmaleski',        grade: 'B-', note: 'Bo Nix as a starting QB has been functional; dynasty ceiling unclear.' },
      { manager: 'eldridm20',       grade: 'B',  note: 'JJ McCarthy — strong upside as the Vikings franchise QB, missed rookie year.' },
      { manager: 'rbr',             grade: 'C+', note: 'Keon Coleman has size but production has been inconsistent.' },
      { manager: 'SexMachineAndyD', grade: 'A-', note: 'Ladd McConkey at 1.09 is exceptional value — immediate WR2 production.' },
      { manager: 'eldridsm',        grade: 'C',  note: 'Trey Benson is a depth RB fighting for carries.' },
      { manager: 'tdtd19844',       grade: 'C-', note: 'Ray Davis has flashed but lacks a path to a clear starting role.' },
      { manager: 'Escuelas',        grade: 'D',  note: 'Kimani Vidal has not carved out a meaningful role yet.' },
    ],
  },
  {
    year: 2025,
    label: '2025 Rookie Draft',
    picks: [
      { pick: '1.01', pickNum: 1,  player: 'Ashton Jeanty',       position: 'RB', nflTeam: 'LV',  manager: 'Cogdeill11', note: 'Had 1.01 pick from trade' },
      { pick: '1.02', pickNum: 2,  player: 'Omarion Hampton',     position: 'RB', nflTeam: 'LAC', manager: 'JuicyBussy' },
      { pick: '1.03', pickNum: 3,  player: 'Abdul Carter',        position: 'DEF', nflTeam: 'NYG', manager: 'MLSchools12' },
      { pick: '1.04', pickNum: 4,  player: 'Tetairoa McMillan',   position: 'WR', nflTeam: '',    manager: 'Grandes' },
      { pick: '1.05', pickNum: 5,  player: 'Luther Burden',       position: 'WR', nflTeam: '',    manager: 'Tubes94' },
      { pick: '1.06', pickNum: 6,  player: 'Emeka Egbuka',        position: 'WR', nflTeam: '',    manager: 'Cmaleski' },
      { pick: '1.07', pickNum: 7,  player: 'Quinshon Judkins',    position: 'RB', nflTeam: '',    manager: 'eldridm20' },
      { pick: '1.08', pickNum: 8,  player: 'Kyle Williams',       position: 'WR', nflTeam: '',    manager: 'rbr' },
      { pick: '1.09', pickNum: 9,  player: 'TreVeyon Henderson',  position: 'RB', nflTeam: '',    manager: 'SexMachineAndyD' },
      { pick: '1.10', pickNum: 10, player: 'Dylan Sampson',       position: 'RB', nflTeam: '',    manager: 'eldridsm' },
      { pick: '1.11', pickNum: 11, player: 'Cam Skattebo',        position: 'RB', nflTeam: '',    manager: 'tdtd19844' },
      { pick: '1.12', pickNum: 12, player: 'Jaylen Wright',       position: 'RB', nflTeam: '',    manager: 'Escuelas' },
    ],
    grades: [
      { manager: 'Cogdeill11',      grade: 'A+', note: 'Ashton Jeanty is the most hyped RB prospect since Bijan. Smart trade to land 1.01.' },
      { manager: 'JuicyBussy',      grade: 'A',  note: 'Omarion Hampton is a feature back with immediate NFL impact projected.' },
      { manager: 'MLSchools12',     grade: 'B+', note: 'Abdul Carter is a premier pass rusher — high upside IDP/superflex play.' },
      { manager: 'Grandes',         grade: 'A-', note: 'Tetairoa McMillan is a big, polished WR with legitimate WR1 upside.' },
      { manager: 'Tubes94',         grade: 'B+', note: 'Luther Burden is a highly productive slot WR. Solid value at five.' },
      { manager: 'Cmaleski',        grade: 'B',  note: 'Emeka Egbuka is a versatile WR from Ohio State with reliable hands.' },
      { manager: 'eldridm20',       grade: 'B',  note: 'Quinshon Judkins is a physical RB with proven college production.' },
      { manager: 'rbr',             grade: 'B-', note: 'Kyle Williams has upside as a speed WR but landing spot is key.' },
      { manager: 'SexMachineAndyD', grade: 'B',  note: 'TreVeyon Henderson brings speed and pass-catching ability from behind.' },
      { manager: 'eldridsm',        grade: 'B-', note: 'Dylan Sampson is a physical runner who needs a good situation.' },
      { manager: 'tdtd19844',       grade: 'C+', note: 'Cam Skattebo is a grinder who earned his way into the first round.' },
      { manager: 'Escuelas',        grade: 'C+', note: 'Jaylen Wright is a depth RB — solid pick at 1.12.' },
    ],
  },
];

const BEST_PICKS: BestPick[] = [
  { year: 2020, player: 'Justin Jefferson',   manager: 'MLSchools12', blurb: '1.02 → All-time dynasty WR. Defining value of the era.' },
  { year: 2021, player: "Ja'Marr Chase",      manager: 'MLSchools12', blurb: '1.03 → Broke the all-time rookie WR record. A+ forever.' },
  { year: 2022, player: 'George Pickens',     manager: 'SexMachineAndyD', blurb: '1.10 → Elite contested-catch WR fell to pick 10.' },
  { year: 2023, player: 'Puka Nacua',         manager: 'eldridsm',    blurb: '1.10 → Set NFL rookie receiving records out of nowhere.' },
  { year: 2024, player: 'Brock Bowers',       manager: 'Tubes94',     blurb: '1.05 → Shattered TE rookie records. Dynasty gold.' },
  { year: 2025, player: 'Ashton Jeanty',      manager: 'Cogdeill11',  blurb: '1.01 (via trade) → Most hyped RB since Bijan Robinson.' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const YEARS = DRAFT_DATA.map((d) => d.year);

function positionBadgeClass(position: string): string {
  switch (position) {
    case 'QB':  return 'bg-blue-600 text-white';
    case 'RB':  return 'bg-emerald-600 text-white';
    case 'WR':  return 'bg-amber-500 text-[#1a1a2e]';
    case 'TE':  return 'bg-purple-600 text-white';
    case 'DEF': return 'bg-rose-700 text-white';
    default:    return 'bg-slate-600 text-white';
  }
}

function gradeColor(grade: string): string {
  const letter = grade[0];
  if (letter === 'A') return 'text-[#22c55e]';
  if (letter === 'B') return 'text-[#60a5fa]';
  if (letter === 'C') return 'text-amber-400';
  if (letter === 'D') return 'text-[#f97316]';
  return 'text-[#ef4444]';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PickCard({ pick }: { pick: DraftPick }) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-2 rounded-xl border p-4',
        'bg-[#16213e] border-[#2d4a66]',
        'hover:border-[#ffd700]/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30',
        'transition-all duration-150'
      )}
    >
      {/* Pick number badge */}
      <div className="flex items-center justify-between">
        <span className="text-[#ffd700] font-black text-2xl tabular-nums leading-none">
          {pick.pick}
        </span>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
            positionBadgeClass(pick.position)
          )}
        >
          {pick.position}
        </span>
      </div>

      {/* Player name */}
      <p className="text-white font-bold text-sm leading-snug">{pick.player}</p>

      {/* NFL team */}
      {pick.nflTeam && (
        <p className="text-xs text-slate-400 font-mono">{pick.nflTeam}</p>
      )}

      {/* Note */}
      {pick.note && (
        <p className="text-[10px] text-[#ffd700]/80 italic leading-snug">{pick.note}</p>
      )}

      {/* Divider + manager */}
      <div className="border-t border-[#2d4a66] pt-2 mt-auto flex items-center gap-1.5">
        <Users className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
        <span className="text-xs text-slate-300 font-semibold">{pick.manager}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraftsPage() {
  const [activeYear, setActiveYear] = useState<number>(2025);

  const season = DRAFT_DATA.find((d) => d.year === activeYear)!;
  const bestPick = BEST_PICKS.find((b) => b.year === activeYear);

  return (
    <>
      <Head>
        <title>Rookie Draft History — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL dynasty rookie draft history — every first-round pick from 2020 through 2025, with draft grades and best picks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
              Draft Room
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
              Rookie Draft History
            </h1>
            <p className="text-slate-400 text-base sm:text-lg">
              BMFFFL &bull; 2020 &ndash; 2025 &bull; First-round picks, grades &amp; lore
            </p>
          </header>

          {/* ── Season Selector Tabs ─────────────────────────────────────── */}
          <div
            className="flex flex-wrap gap-2 mb-10"
            role="tablist"
            aria-label="Draft year selector"
          >
            {YEARS.map((year) => (
              <button
                key={year}
                role="tab"
                aria-selected={activeYear === year}
                aria-controls={`panel-${year}`}
                onClick={() => setActiveYear(year)}
                className={cn(
                  'px-5 py-2.5 rounded-lg text-sm font-black transition-all duration-150',
                  activeYear === year
                    ? 'bg-[#ffd700] text-[#0d1b2a] shadow-lg shadow-[#ffd700]/20'
                    : 'bg-[#16213e] text-slate-300 border border-[#2d4a66] hover:border-[#ffd700]/50 hover:text-[#ffd700]'
                )}
              >
                {year}
              </button>
            ))}
          </div>

          {/* ── Main content + sidebar ───────────────────────────────────── */}
          <div
            id={`panel-${activeYear}`}
            role="tabpanel"
            aria-label={`${activeYear} draft picks`}
            className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8"
          >
            {/* Left: picks grid + grades */}
            <div className="min-w-0">

              {/* Season heading */}
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {season.label}
                </h2>
                <span className="px-2.5 py-0.5 bg-[#16213e] border border-[#2d4a66] rounded-full text-xs text-slate-400 font-semibold shrink-0">
                  Round 1
                </span>
              </div>

              {/* Pick cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {season.picks.map((pick) => (
                  <PickCard key={pick.pick} pick={pick} />
                ))}
              </div>

              {/* Draft Grades */}
              <section aria-labelledby={`grades-${activeYear}`}>
                <h3
                  id={`grades-${activeYear}`}
                  className="text-xl font-black text-white mb-4 flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  Draft Grades — {activeYear}
                </h3>
                <div className="rounded-xl overflow-hidden border border-[#2d4a66]">
                  <table className="w-full text-sm" aria-label={`${activeYear} draft grades by manager`}>
                    <thead>
                      <tr className="bg-[#0d1b2a] border-b border-[#2d4a66]">
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[130px]">
                          Manager
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                          Grade
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3347]">
                      {season.grades.map((g, idx) => (
                        <tr
                          key={g.manager}
                          className={cn(
                            'transition-colors duration-100 hover:bg-[#1f3550]',
                            idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          <td className="px-4 py-3 text-white font-semibold">{g.manager}</td>
                          <td className="px-4 py-3 text-center font-black text-base">
                            <span className={gradeColor(g.grade)}>{g.grade}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs leading-relaxed">{g.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Footer note */}
              <p className="mt-5 text-xs text-slate-500 italic">
                Round 1 shown. Full draft history available via Sleeper API.
              </p>
            </div>

            {/* Right: sidebar */}
            <aside className="space-y-6">

              {/* Best Pick of the Year callout */}
              {bestPick && (
                <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#ffd700]">
                      Best Pick {bestPick.year}
                    </span>
                  </div>
                  <p className="text-white font-black text-base mb-1">{bestPick.player}</p>
                  <p className="text-xs text-slate-400 mb-3 leading-snug">{bestPick.blurb}</p>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span className="text-xs text-slate-300 font-semibold">{bestPick.manager}</span>
                  </div>
                </div>
              )}

              {/* Best Picks by Season — full list */}
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                  Best Picks by Season
                </h3>
                <ul className="space-y-4">
                  {BEST_PICKS.map((bp) => (
                    <li
                      key={bp.year}
                      className={cn(
                        'pb-4 border-b border-[#2d4a66] last:border-0 last:pb-0',
                        bp.year === activeYear && 'opacity-100',
                        bp.year !== activeYear && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <span
                          className={cn(
                            'text-xs font-black tabular-nums',
                            bp.year === activeYear ? 'text-[#ffd700]' : 'text-slate-500'
                          )}
                        >
                          {bp.year}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
                      </div>
                      <p className="text-white text-xs font-bold leading-snug">{bp.player}</p>
                      <p className="text-slate-500 text-[10px] leading-snug mt-0.5">{bp.blurb}</p>
                      <p className="text-slate-400 text-[10px] mt-1 font-semibold">{bp.manager}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Position legend */}
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Position Key
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(['QB', 'RB', 'WR', 'TE', 'DEF'] as const).map((pos) => (
                    <span
                      key={pos}
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
                        positionBadgeClass(pos)
                      )}
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

        </div>
      </div>
    </>
  );
}
