import { useState, useEffect } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Trophy, ChevronLeft, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PlayerCard from '@/components/players/PlayerCard';

// ─── Owner Data ───────────────────────────────────────────────────────────────

// All-time champions — verified 2026-04-25:
// ESPN era (2016-2019): MLSchools12 (2016), Cogdeill11 (2017), SexMachineAndyD (2018), MLSchools12 (2019)
// Sleeper era (2020-2025): Cogdeill11 (2020), MLSchools12 (2021), Grandes (2022), JuicyBussy (2023), MLSchools12 (2024), tdtd19844 (2025)
// wins/losses = ALL-TIME (ESPN 2016-2019 API-verified + Sleeper 2020-2025 DB-verified).
// playoffApps = all-time (ESPN winners bracket + Sleeper winners bracket, API+DB verified).
// Season table includes ESPN era (2016-2019) for ESPN-era owners; ranks are ESPN regular season seeds (estimated by wins).
// Real names confirmed via ESPN member API (2026-04-25). Sleeper team names from DB; ESPN team names from ESPN API.
const OWNERS = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    realName: 'Michael Schoolcraft',
    teamName: 'The Murder Boners',
    championships: [2016, 2019, 2021, 2024],
    runnerUps: [2018],
    playoffApps: 10,
    wins: 114, losses: 21,
    dynastyRank: 1,
    status: 'Four-time champion (2016, 2019, 2021, 2024). Runner-up in 2018 (ESPN era). All-time wins leader (.844 win%). 10 playoff appearances across 10 seasons — made the playoffs every year of the league\'s existence. The defining dynasty of the BMFFFL era.',
    currentRoster: ['CeeDee Lamb (WR)', 'Tyreek Hill (WR)', 'Garrett Wilson (WR)', 'Brock Purdy (QB)', 'Breece Hall (RB)'],
    seasons: [
      { year: 2025, rank: 1,  wins: 13, losses: 1,  champion: false, teamName: 'Schoolcraft Football Team' },
      { year: 2024, rank: 3,  wins: 10, losses: 4,  champion: true,  teamName: 'Schoolcraft Football Team' },
      { year: 2023, rank: 1,  wins: 13, losses: 1,  champion: false, teamName: 'The Murder Boners' },
      { year: 2022, rank: 1,  wins: 10, losses: 4,  champion: false, teamName: 'The Murder Boners' },
      { year: 2021, rank: 1,  wins: 11, losses: 3,  champion: true,  teamName: 'The Murder Boners' },
      { year: 2020, rank: 1,  wins: 11, losses: 2,  champion: false, teamName: 'The Murder Boners' },
      { year: 2019, rank: 1,  wins: 12, losses: 1,  champion: true,  teamName: 'The Murder Boners',  era: 'espn' as const },
      { year: 2018, rank: 1,  wins: 11, losses: 2,  champion: false, teamName: 'The Murder Boners',  era: 'espn' as const },
      { year: 2017, rank: 1,  wins: 12, losses: 1,  champion: false, teamName: 'The Murder Boners',  era: 'espn' as const },
      { year: 2016, rank: 1,  wins: 11, losses: 2,  champion: true,  teamName: 'The Murder Boners',  era: 'espn' as const },
    ],
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    realName: 'Joe Tuberdyke',
    teamName: 'Whale Tails',
    championships: [] as number[],
    runnerUps: [2025],
    playoffApps: 2,
    wins: 34, losses: 36,
    dynastyRank: 2,
    status: 'Runner-up 2025. Joined in 2021. Went 2-12 in their first season, then rebuilt to 11-3 in 2024. One of two favorites for the 2026 championship.',
    currentRoster: ['Bijan Robinson (RB)', 'Breece Hall (RB)', 'Drake London (WR)', 'Trevor Lawrence (QB)', 'Puka Nacua (WR)'],
    seasons: [
      { year: 2025, rank: 2,  wins: 10, losses: 4,  champion: false, teamName: 'Whale Tails' },
      { year: 2024, rank: 2,  wins: 11, losses: 3,  champion: false, teamName: 'Nacua Matata' },
      { year: 2023, rank: 7,  wins: 7,  losses: 7,  champion: false, teamName: 'Burn it all' },
      { year: 2022, rank: 11, wins: 4,  losses: 10, champion: false, teamName: 'Burn it all' },
      { year: 2021, rank: 11, wins: 2,  losses: 12, champion: false, teamName: "Swamp Donkey's" },
    ],
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    realName: 'Mike Vieyra',
    teamName: 'SexMachineAndyD',
    championships: [2018],
    runnerUps: [2021, 2024],
    playoffApps: 6,
    wins: 78, losses: 57,
    dynastyRank: 3,
    status: '2018 ESPN champion. Runner-up in 2021 and 2024. Six playoff appearances across both eras. ESPN usernames: vieyramf@sbu.edu → MilwaukeeBrowns (Sleeper). The most consistent multi-era performer.',
    currentRoster: ['Josh Allen (QB)', 'Jonathan Taylor (RB)', 'Davante Adams (WR)', 'Cooper Kupp (WR)', 'Tony Pollard (RB)'],
    seasons: [
      { year: 2025, rank: 3,  wins: 9,  losses: 5,  champion: false, teamName: 'SexMachineAndyD' },
      { year: 2024, rank: 1,  wins: 11, losses: 3,  champion: false, teamName: 'SexMachineAndyD' },
      { year: 2023, rank: 10, wins: 5,  losses: 9,  champion: false, teamName: 'SexMachineAndyD' },
      { year: 2022, rank: 9,  wins: 6,  losses: 8,  champion: false, teamName: 'SexMachineAndyD' },
      { year: 2021, rank: 2,  wins: 10, losses: 4,  champion: false, teamName: 'SexMachineAndyD' },
      { year: 2020, rank: 3,  wins: 9,  losses: 4,  champion: false, teamName: "Herbert's Heros" },
      { year: 2019, rank: 6,  wins: 7,  losses: 6,  champion: false, teamName: 'Stand Against Trade Rape', era: 'espn' as const },
      { year: 2018, rank: 2,  wins: 9,  losses: 4,  champion: true,  teamName: 'Stand Against Trade Rape', era: 'espn' as const },
      { year: 2017, rank: 3,  wins: 9,  losses: 4,  champion: false, teamName: 'Gordon Bongbay',           era: 'espn' as const },
      { year: 2016, rank: 11, wins: 3,  losses: 10, champion: false, teamName: 'Los Angeles TBD',          era: 'espn' as const },
    ],
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    realName: 'Matt DeLaura',
    teamName: 'Juicy Bussy',
    championships: [2023],
    runnerUps: [] as number[],
    playoffApps: 5,
    wins: 67, losses: 68,
    dynastyRank: 4,
    status: '2023 champion as the 6th seed. Holds the all-time single-week scoring record (245.80 pts, Week 16 2021). The most explosive offense in the league.',
    currentRoster: ['Joe Burrow (QB)', "De'Von Achane (RB)", 'Malik Nabers (WR)', 'Harold Fannin Jr. (TE)', 'Matthew Golden (WR)'],
    seasons: [
      { year: 2025, rank: 5,  wins: 7,  losses: 7,  champion: false, teamName: 'Juicy Bussy' },
      { year: 2024, rank: 4,  wins: 8,  losses: 6,  champion: false, teamName: 'Juicy Bussy' },
      { year: 2023, rank: 6,  wins: 8,  losses: 6,  champion: true,  teamName: 'JuicyBussy' },
      { year: 2022, rank: 2,  wins: 10, losses: 4,  champion: false, teamName: 'JuicyBussy' },
      { year: 2021, rank: 6,  wins: 8,  losses: 6,  champion: false, teamName: 'JuicyBussy' },
      { year: 2020, rank: 8,  wins: 5,  losses: 8,  champion: false, teamName: 'Juicy Bussy' },
      { year: 2019, rank: 7,  wins: 6,  losses: 7,  champion: false, teamName: 'Juicy Bussy Bussy',       era: 'espn' as const },
      { year: 2018, rank: 11, wins: 2,  losses: 11, champion: false, teamName: 'Juicy Bussy',             era: 'espn' as const },
      { year: 2017, rank: 9,  wins: 4,  losses: 9,  champion: false, teamName: 'Juicy Bussy',             era: 'espn' as const },
      { year: 2016, rank: 2,  wins: 9,  losses: 4,  champion: false, teamName: 'Hitler Youths',           era: 'espn' as const },
    ],
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    realName: 'Michael Rioux',
    teamName: 'Really Big Rings',
    championships: [] as number[],
    runnerUps: [2019, 2022],
    playoffApps: 8,
    wins: 73, losses: 62,
    dynastyRank: 5,
    status: '2019 and 2022 runner-up. Made the playoffs in all 4 ESPN seasons and 4 of 6 Sleeper seasons — 8 all-time appearances, the most without a title. Best lineup IQ in the league (89.78%).',
    currentRoster: ['Patrick Mahomes (QB)', 'Stefon Diggs (WR)', 'Marvin Harrison Jr. (WR)', 'Travis Kelce (TE)', 'Quinshon Judkins (RB)'],
    seasons: [
      { year: 2025, rank: 10, wins: 5,  losses: 9,  champion: false, teamName: 'Really Big Rings' },
      { year: 2024, rank: 6,  wins: 8,  losses: 6,  champion: false, teamName: 'Really Big Rings' },
      { year: 2023, rank: 8,  wins: 6,  losses: 8,  champion: false, teamName: 'Really Big Rings' },
      { year: 2022, rank: 3,  wins: 10, losses: 4,  champion: false, teamName: 'Really Big Rings' },
      { year: 2021, rank: 5,  wins: 9,  losses: 5,  champion: false, teamName: 'Really Big Rings' },
      { year: 2020, rank: 5,  wins: 6,  losses: 7,  champion: false, teamName: 'Really Big Rings' },
      { year: 2019, rank: 8,  wins: 6,  losses: 7,  champion: false, teamName: 'Really Big Rings',        era: 'espn' as const },
      { year: 2018, rank: 5,  wins: 8,  losses: 5,  champion: false, teamName: 'Really Big Rings',        era: 'espn' as const },
      { year: 2017, rank: 4,  wins: 8,  losses: 5,  champion: false, teamName: 'Really Big Rings',        era: 'espn' as const },
      { year: 2016, rank: 5,  wins: 7,  losses: 6,  champion: false, teamName: 'Really Big Rings',        era: 'espn' as const },
    ],
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    realName: 'David Cogdeill',
    teamName: 'Earn it',
    championships: [2017, 2020],
    runnerUps: [] as number[],
    playoffApps: 5,
    wins: 67, losses: 68,
    dynastyRank: 6,
    status: 'Two-time champion (2017 ESPN, 2020 Sleeper). Five all-time playoff appearances. Won the tightest championship game on record (203.10–198.34). Has not made the playoffs since 2021.',
    currentRoster: ['Omarion Hampton (RB)', "Ja'Marr Chase (WR)", 'Saquon Barkley (RB)', 'Brock Purdy (QB)', 'Colston Loveland (TE)'],
    seasons: [
      { year: 2025, rank: 11, wins: 5,  losses: 9,  champion: false, teamName: 'Earn it' },
      { year: 2024, rank: 10, wins: 4,  losses: 10, champion: false, teamName: 'With alvins penix' },
      { year: 2023, rank: 11, wins: 3,  losses: 11, champion: false, teamName: 'Cogdeill11' },
      { year: 2022, rank: 8,  wins: 7,  losses: 7,  champion: false, teamName: 'Cogdeill11' },
      { year: 2021, rank: 4,  wins: 9,  losses: 5,  champion: false, teamName: 'Cogdeill11' },
      { year: 2020, rank: 2,  wins: 10, losses: 3,  champion: true,  teamName: 'Cogdeill11' },
      { year: 2019, rank: 3,  wins: 8,  losses: 5,  champion: false, teamName: 'Alvin and the Chipmunks', era: 'espn' as const },
      { year: 2018, rank: 3,  wins: 9,  losses: 4,  champion: false, teamName: 'Alvin and the Chipmunks', era: 'espn' as const },
      { year: 2017, rank: 6,  wins: 7,  losses: 6,  champion: true,  teamName: 'Team Cogdeill',           era: 'espn' as const },
      { year: 2016, rank: 9,  wins: 5,  losses: 8,  champion: false, teamName: 'Team Cogdeill',           era: 'espn' as const },
    ],
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    realName: 'Chris Rioux',
    teamName: 'El Rioux Grandes',
    championships: [2022],
    runnerUps: [2016],
    playoffApps: 5,
    wins: 71, losses: 64,
    dynastyRank: 7,
    status: '2022 champion. Runner-up in 2016 (ESPN era). League Commissioner and founding member. Five all-time playoff appearances. The fastest title-to-last trajectory: champion in 2022, Moodie Bowl in 2025.',
    currentRoster: ['C.J. Stroud (QB)', 'Rashee Rice (WR)', 'Rhamondre Stevenson (RB)', 'Evan Engram (TE)', 'Dameon Pierce (RB)'],
    seasons: [
      { year: 2025, rank: 12, wins: 4,  losses: 10, champion: false, teamName: 'El Rioux Grandes' },
      { year: 2024, rank: 7,  wins: 7,  losses: 7,  champion: false, teamName: 'El Rioux Grandes' },
      { year: 2023, rank: 2,  wins: 9,  losses: 5,  champion: false, teamName: 'El Rioux Grandes' },
      { year: 2022, rank: 4,  wins: 8,  losses: 6,  champion: true,  teamName: 'El Rioux Grandes' },
      { year: 2021, rank: 3,  wins: 10, losses: 4,  champion: false, teamName: 'El Rioux Grandes' },
      { year: 2020, rank: 10, wins: 4,  losses: 9,  champion: false, teamName: 'El Rioux Grandes' },
      { year: 2019, rank: 4,  wins: 8,  losses: 5,  champion: false, teamName: 'El Rioux Grandes',        era: 'espn' as const },
      { year: 2018, rank: 6,  wins: 7,  losses: 6,  champion: false, teamName: 'El Rioux Grandes',        era: 'espn' as const },
      { year: 2017, rank: 7,  wins: 6,  losses: 7,  champion: false, teamName: 'El Rioux Grandes',        era: 'espn' as const },
      { year: 2016, rank: 3,  wins: 8,  losses: 5,  champion: false, teamName: 'El Rioux Grandes',        era: 'espn' as const },
    ],
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    realName: 'Tyler Drysdale',
    teamName: 'THE Shameful Saggy sack',
    championships: [2025],
    runnerUps: [] as number[],
    playoffApps: 4,
    wins: 55, losses: 80,
    dynastyRank: 8,
    status: '2025 champion as the #4 seed. Went 3-11 in 2022, clawed back to playoff contention, and won it all — upset MLSchools12 in the semis and Tubes94 in the final.',
    currentRoster: ['Jayden Daniels (QB)', 'Kyren Williams (RB)', 'Tee Higgins (WR)', 'Sam LaPorta (TE)', 'Jalen McMillan (WR)'],
    seasons: [
      { year: 2025, rank: 4,  wins: 8,  losses: 6,  champion: true,  teamName: 'THE Shameful Saggy sack' },
      { year: 2024, rank: 5,  wins: 8,  losses: 6,  champion: false, teamName: 'THE Shameful Saggy sack' },
      { year: 2023, rank: 9,  wins: 5,  losses: 9,  champion: false, teamName: '14kids0wins/teammoodie' },
      { year: 2022, rank: 12, wins: 3,  losses: 11, champion: false, teamName: 'WaiverWireWarriors' },
      { year: 2021, rank: 9,  wins: 6,  losses: 8,  champion: false, teamName: 'WaiverWireWarriors' },
      { year: 2020, rank: 6,  wins: 6,  losses: 7,  champion: false, teamName: 'Acorns & river water' },
      { year: 2019, rank: 11, wins: 3,  losses: 10, champion: false, teamName: 'Lost hope Needdraft picks', era: 'espn' as const },
      { year: 2018, rank: 9,  wins: 5,  losses: 8,  champion: false, teamName: 'Lost hope Needdraft picks', era: 'espn' as const },
      { year: 2017, rank: 11, wins: 4,  losses: 9,  champion: false, teamName: 'Lost hope Needdraft picks', era: 'espn' as const },
      { year: 2016, rank: 6,  wins: 7,  losses: 6,  champion: false, teamName: 'Team drysdale',             era: 'espn' as const },
    ],
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    realName: 'Steve Eldridge',
    teamName: 'eldridsm',
    championships: [] as number[],
    runnerUps: [2017, 2020],
    playoffApps: 6,
    wins: 75, losses: 60,
    dynastyRank: 9,
    status: '2x runner-up (2017 ESPN, 2020 Sleeper). Six all-time playoff appearances across both eras. ESPN username: eldge19 ("Arnie\'s Army"). Eliminated the #1 seed MLSchools12 in the 2020 semis.',
    currentRoster: ['Dak Prescott (QB)', 'Isiah Pacheco (RB)', 'Courtland Sutton (WR)', 'Cole Kmet (TE)', 'Demario Douglas (WR)'],
    seasons: [
      { year: 2025, rank: 9,  wins: 5,  losses: 9,  champion: false, teamName: 'eldridsm' },
      { year: 2024, rank: 11, wins: 4,  losses: 10, champion: false, teamName: 'eldridsm' },
      { year: 2023, rank: 3,  wins: 9,  losses: 5,  champion: false, teamName: 'eldridsm' },
      { year: 2022, rank: 5,  wins: 8,  losses: 6,  champion: false, teamName: 'eldridsm' },
      { year: 2021, rank: 8,  wins: 7,  losses: 7,  champion: false, teamName: 'eldridsm' },
      { year: 2020, rank: 4,  wins: 8,  losses: 5,  champion: false, teamName: 'eldridsm' },
      { year: 2019, rank: 2,  wins: 10, losses: 3,  champion: false, teamName: "Arnie's Army",             era: 'espn' as const },
      { year: 2018, rank: 7,  wins: 7,  losses: 6,  champion: false, teamName: "Arnie's Army",             era: 'espn' as const },
      { year: 2017, rank: 2,  wins: 11, losses: 2,  champion: false, teamName: "Arnie's Army",             era: 'espn' as const },
      { year: 2016, rank: 7,  wins: 6,  losses: 7,  champion: false, teamName: "Arnie's Army",             era: 'espn' as const },
    ],
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    realName: 'Matt Eldridge',
    teamName: 'Franks Little Beauties',
    championships: [] as number[],
    runnerUps: [2023],
    playoffApps: 4,
    wins: 57, losses: 78,
    dynastyRank: 10,
    status: '2023 runner-up. Eliminated the #1 seed MLSchools12 (13-1) in the 2023 semis. Four playoff appearances (ESPN 2019 + Sleeper 2021, 2022, 2023). ESPN username: mahoo1919 ("Role Players"). Dangerous in single-elimination.',
    currentRoster: ['Josh Allen (QB)', 'Luther Burden III (WR)', 'Jayden Reed (WR)', 'James Cook (RB)', 'Chuba Hubbard (RB)'],
    seasons: [
      { year: 2025, rank: 7,  wins: 6,  losses: 8,  champion: false, teamName: 'Franks Little Beauties' },
      { year: 2024, rank: 8,  wins: 6,  losses: 8,  champion: false, teamName: 'Franks Little Beauties' },
      { year: 2023, rank: 5,  wins: 8,  losses: 6,  champion: false, teamName: 'Franks Little Beauties' },
      { year: 2022, rank: 6,  wins: 7,  losses: 7,  champion: false, teamName: 'Franks Little Beauties' },
      { year: 2021, rank: 7,  wins: 8,  losses: 6,  champion: false, teamName: 'Franks Little Beauties' },
      { year: 2020, rank: 11, wins: 4,  losses: 9,  champion: false, teamName: 'eldridm20' },
      { year: 2019, rank: 5,  wins: 7,  losses: 6,  champion: false, teamName: 'Role Players',            era: 'espn' as const },
      { year: 2018, rank: 8,  wins: 6,  losses: 7,  champion: false, teamName: 'Role Players',            era: 'espn' as const },
      { year: 2017, rank: 12, wins: 2,  losses: 11, champion: false, teamName: 'Team Smeldridge',         era: 'espn' as const },
      { year: 2016, rank: 12, wins: 3,  losses: 10, champion: false, teamName: 'Team Eldridge',           era: 'espn' as const },
    ],
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    realName: 'Chad Maleski',
    teamName: 'Showtyme Boyz',
    championships: [] as number[],
    runnerUps: [] as number[],
    playoffApps: 4,
    wins: 55, losses: 80,
    dynastyRank: 11,
    status: 'Four all-time playoff appearances: 2 ESPN (2016, 2017) + 2 Sleeper (2023, 2025). In 2025 scored 1,990 pts (3rd in league) while going 6-8. The league\'s most underrated team by record.',
    currentRoster: ['Jaylen Waddle (WR)', 'George Kittle (TE)', 'Josh Downs (WR)', 'Gus Edwards (RB)', 'Baker Mayfield (QB)'],
    seasons: [
      { year: 2025, rank: 6,  wins: 6,  losses: 8,  champion: false, teamName: 'Showtyme Boyz' },
      { year: 2024, rank: 9,  wins: 4,  losses: 10, champion: false, teamName: 'Showtyme Boyz' },
      { year: 2023, rank: 4,  wins: 9,  losses: 5,  champion: false, teamName: 'Showtyme Boyz' },
      { year: 2022, rank: 7,  wins: 7,  losses: 7,  champion: false, teamName: 'Showtyme Boyz' },
      { year: 2021, rank: 10, wins: 4,  losses: 10, champion: false, teamName: 'Showtyme Boyz' },
      { year: 2020, rank: 7,  wins: 6,  losses: 7,  champion: false, teamName: 'Locked & Loaded' },
      { year: 2019, rank: 12, wins: 2,  losses: 11, champion: false, teamName: 'No Fly Zone',             era: 'espn' as const },
      { year: 2018, rank: 12, wins: 2,  losses: 11, champion: false, teamName: 'Team No Fly Zone',        era: 'espn' as const },
      { year: 2017, rank: 5,  wins: 7,  losses: 6,  champion: false, teamName: 'Team No Fly Zone',        era: 'espn' as const },
      { year: 2016, rank: 4,  wins: 8,  losses: 5,  champion: false, teamName: 'Team Maleski',            era: 'espn' as const },
    ],
  },
  {
    slug: 'escuelas',
    displayName: 'Escuelas',
    realName: undefined,
    teamName: 'Booty Cheeks',
    championships: [] as number[],
    runnerUps: [] as number[],
    playoffApps: 0,
    wins: 20, losses: 63,
    dynastyRank: 12,
    status: 'Joined 2020 as MCSchools, renamed Escuelas from 2022. No playoff appearances in 6 seasons. First registered winning record in 2025 (6-8). Commissioner\'s brother.',
    currentRoster: ['Jordan Love (QB)', 'Zay Flowers (WR)', 'Jaylen Warren (RB)', 'Jelani Woods (TE)', 'Dontayvion Wicks (WR)'],
    seasons: [
      { year: 2025, rank: 8,  wins: 6,  losses: 8,  champion: false, teamName: 'Booty Cheeks' },
      { year: 2024, rank: 12, wins: 3,  losses: 11, champion: false, teamName: 'The Young Guns + backups' },
      { year: 2023, rank: 12, wins: 2,  losses: 12, champion: false, teamName: 'Loud and Stroud!' },
      { year: 2022, rank: 10, wins: 4,  losses: 10, champion: false, teamName: "Grindin Gere's" },
      { year: 2021, rank: 12, wins: 0,  losses: 14, champion: false, teamName: 'Our Lady of the Poor' },
      { year: 2020, rank: 9,  wins: 5,  losses: 8,  champion: false, teamName: 'Mike Was Adopted' },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface OwnerSeason {
  year: number;
  rank: number;
  wins: number;
  losses: number;
  champion: boolean;
  teamName: string;
  era?: 'espn';
}

type Owner = Omit<typeof OWNERS[number], 'seasons'> & { seasons: OwnerSeason[] };

interface LivePlayer {
  player_id: string;
  full_name: string;
  position: string;
  team: string | null;
  age: number | null;
}

// ─── Live Roster Section ──────────────────────────────────────────────────────

const LEAGUE_ID = '1312123497203376128';
const SKILL_POSITIONS = new Set(['QB', 'RB', 'WR', 'TE', 'K']);

function LiveRosterSection({ displayName }: { displayName: string }) {
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 1. Find the owner's Sleeper user_id
        const users = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`).then(r => r.json()) as Array<{ user_id: string; display_name: string }>;
        const user = users.find(u => u.display_name === displayName);
        if (!user) throw new Error(`No Sleeper user found for ${displayName}`);

        // 2. Find their roster player IDs
        const rosters = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`).then(r => r.json()) as Array<{ owner_id: string; players: string[] | null }>;
        const roster = rosters.find(r => r.owner_id === user.user_id);
        const playerIds = roster?.players ?? [];
        if (playerIds.length === 0) {
          setPlayers([]);
          setLoading(false);
          return;
        }

        // 3. Fetch full player DB (cached by browser after first load)
        const allPlayers = await fetch('https://api.sleeper.app/v1/players/nfl').then(r => r.json()) as Record<string, { full_name?: string; position?: string; team?: string; age?: number }>;

        // 4. Map player IDs → player info (skill positions only)
        const roster_players: LivePlayer[] = playerIds
          .map(id => {
            const p = allPlayers[id];
            if (!p || !SKILL_POSITIONS.has(p.position ?? '')) return null;
            return {
              player_id: id,
              full_name: p.full_name ?? id,
              position: p.position ?? 'WR',
              team: p.team ?? null,
              age: p.age ?? null,
            };
          })
          .filter(Boolean) as LivePlayer[];

        // Sort: QB first, then RB, WR, TE, K
        const POS_ORDER: Record<string, number> = { QB: 0, RB: 1, WR: 2, TE: 3, K: 4 };
        roster_players.sort((a, b) => (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9));

        setPlayers(roster_players);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load roster');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [displayName]);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-3 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-[#ffd700]" aria-hidden="true" />
        <span className="text-sm">Loading live roster from Sleeper…</span>
      </div>
    );
  }

  if (error || players.length === 0) {
    return (
      <div className="p-4 text-sm text-slate-500 italic">
        {error ? `Could not load live roster: ${error}` : 'No roster data available.'}
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {players.map((p) => {
        const pos = (['QB', 'RB', 'WR', 'TE'] as const).includes(p.position as 'QB' | 'RB' | 'WR' | 'TE')
          ? (p.position as 'QB' | 'RB' | 'WR' | 'TE')
          : 'WR';
        return (
          <PlayerCard
            key={p.player_id}
            name={p.full_name}
            position={pos}
            nflTeam={p.team ?? ''}
            age={p.age ?? 0}
            compact
          />
        );
      })}
    </div>
  );
}

// ─── Roster History Section ───────────────────────────────────────────────────

interface HistoricalPlayer {
  player_id: string;
  full_name: string;
  position: string;
  team: string | null;
  is_starter: boolean;
}

interface HistoricalSeasonRoster {
  display_name: string;
  team_name: string;
  roster_id: number;
  wins: number;
  losses: number;
  players: HistoricalPlayer[];
}

interface RosterHistory {
  generated_at: string;
  seasons: string[];
  history: Record<string, Record<string, HistoricalSeasonRoster>>;
}

const POS_BADGE: Record<string, string> = {
  QB: 'bg-[#e94560]/20 text-[#e94560]',
  RB: 'bg-[#22c55e]/20 text-[#22c55e]',
  WR: 'bg-[#3b82f6]/20 text-[#3b82f6]',
  TE: 'bg-[#f97316]/20 text-[#f97316]',
  K:  'bg-slate-700 text-slate-300',
};

function RosterHistorySection({ displayName }: { displayName: string }) {
  const [data, setData] = useState<Record<string, HistoricalSeasonRoster> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSeason, setOpenSeason] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/roster-history.json')
      .then(r => r.json())
      .then((json: RosterHistory) => {
        const ownerHistory = json.history[displayName] ?? null;
        setData(ownerHistory);
        // Default open: most recent season
        if (ownerHistory) {
          const seasons = Object.keys(ownerHistory).sort((a, b) => Number(b) - Number(a));
          setOpenSeason(seasons[0] ?? null);
        }
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [displayName]);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-3 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-[#ffd700]" aria-hidden="true" />
        <span className="text-sm">Loading roster history…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-sm text-slate-500 italic">
        {error ?? 'No roster history available.'}
      </div>
    );
  }

  const seasons = Object.keys(data).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="divide-y divide-[#2d4a66]">
      {seasons.map(season => {
        const roster = data[season];
        const isOpen = openSeason === season;
        const record = `${roster.wins}-${roster.losses}`;

        return (
          <div key={season}>
            <button
              type="button"
              onClick={() => setOpenSeason(isOpen ? null : season)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#1a2d42] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{season}</span>
                <span className="text-xs text-slate-400 font-mono">{record}</span>
                <span className="text-xs text-slate-500 italic truncate max-w-[160px]">{roster.team_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{roster.players.length} players</span>
                <ChevronLeft
                  className={cn('w-4 h-4 text-slate-500 transition-transform', isOpen ? '-rotate-90' : 'rotate-180')}
                  aria-hidden="true"
                />
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {roster.players.map(p => {
                  const badgeClass = POS_BADGE[p.position] ?? 'bg-slate-700 text-slate-300';
                  return (
                    <div
                      key={p.player_id}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                        'bg-[#0d1b2a] border border-[#2d4a66]',
                        p.is_starter && 'border-[#ffd700]/30'
                      )}
                    >
                      <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded font-mono', badgeClass)}>
                        {p.position}
                      </span>
                      <span className="text-white truncate">{p.full_name}</span>
                      {p.team && <span className="text-slate-500 text-xs ml-auto">{p.team}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Owner History Section (draft picks + trades) ────────────────────────────

interface OwnerDraftPick {
  season: string;
  draft_type: string;
  round: number;
  pick_no: number;
  player_name: string;
  position: string;
  team: string;
}

interface OwnerTrade {
  week: number;
  acquired: string[];
  sent: string[];
  trade_partner: string;
}

interface OwnerSeasonData {
  season: string;
  draft_picks: OwnerDraftPick[];
  trades: OwnerTrade[];
  notable_adds: Array<{ week: number; type: string; player_name: string; position: string }>;
}

interface OwnerHistoryFile {
  generated_at: string;
  owners: Record<string, Record<string, OwnerSeasonData>>;
}

function DraftHistorySection({ displayName }: { displayName: string }) {
  const [data, setData] = useState<Record<string, OwnerSeasonData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/owner-history.json')
      .then(r => r.json())
      .then((json: OwnerHistoryFile) => {
        const ownerData = json.owners[displayName] ?? null;
        setData(ownerData);
        if (ownerData) {
          // Default open: most recent season with draft picks
          const seasonsWithPicks = Object.entries(ownerData)
            .filter(([, d]) => d.draft_picks.length > 0)
            .map(([s]) => s)
            .sort((a, b) => Number(b) - Number(a));
          setOpenSeason(seasonsWithPicks[0] ?? null);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [displayName]);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-3 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-[#ffd700]" aria-hidden="true" />
        <span className="text-sm">Loading draft history…</span>
      </div>
    );
  }

  if (!data) return <div className="p-4 text-sm text-slate-500 italic">No draft history available.</div>;

  const seasons = Object.entries(data)
    .filter(([, d]) => d.draft_picks.length > 0)
    .map(([s]) => s)
    .sort((a, b) => Number(b) - Number(a));

  if (seasons.length === 0) return <div className="p-4 text-sm text-slate-500 italic">No draft picks recorded.</div>;

  return (
    <div className="divide-y divide-[#2d4a66]">
      {seasons.map(season => {
        const isOpen = openSeason === season;
        const picks = data[season].draft_picks;
        const label = picks[0]?.draft_type === 'espn_startup' ? 'ESPN startup' :
                      picks[0]?.draft_type === 'startup' ? 'startup' : 'rookie';

        return (
          <div key={season}>
            <button
              type="button"
              onClick={() => setOpenSeason(isOpen ? null : season)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#1a2d42] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{season}</span>
                <span className="text-xs text-slate-500 capitalize">{label} draft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{picks.length} picks</span>
                <ChevronLeft
                  className={cn('w-4 h-4 text-slate-500 transition-transform', isOpen ? '-rotate-90' : 'rotate-180')}
                  aria-hidden="true"
                />
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 space-y-1">
                {picks.map((p, i) => {
                  const badgeClass = POS_BADGE[p.position] ?? 'bg-slate-700 text-slate-300';
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-sm"
                    >
                      <span className="text-xs text-slate-500 font-mono w-10 shrink-0">R{p.round}</span>
                      {p.position && (
                        <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded font-mono shrink-0', badgeClass)}>
                          {p.position}
                        </span>
                      )}
                      <span className="text-white">{p.player_name}</span>
                      {p.team && <span className="text-slate-500 text-xs ml-auto">{p.team}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TransactionsSection({ displayName }: { displayName: string }) {
  const [data, setData] = useState<Record<string, OwnerSeasonData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/owner-history.json')
      .then(r => r.json())
      .then((json: OwnerHistoryFile) => {
        const ownerData = json.owners[displayName] ?? null;
        setData(ownerData);
        if (ownerData) {
          const seasonsWithTrades = Object.entries(ownerData)
            .filter(([, d]) => d.trades.length > 0)
            .map(([s]) => s)
            .sort((a, b) => Number(b) - Number(a));
          setOpenSeason(seasonsWithTrades[0] ?? null);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [displayName]);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-3 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-[#ffd700]" aria-hidden="true" />
        <span className="text-sm">Loading transactions…</span>
      </div>
    );
  }

  if (!data) return <div className="p-4 text-sm text-slate-500 italic">No transaction history available.</div>;

  const seasons = Object.entries(data)
    .filter(([, d]) => d.trades.length > 0)
    .map(([s]) => s)
    .sort((a, b) => Number(b) - Number(a));

  if (seasons.length === 0) return <div className="p-4 text-sm text-slate-500 italic">No trades recorded.</div>;

  return (
    <div className="divide-y divide-[#2d4a66]">
      {seasons.map(season => {
        const isOpen = openSeason === season;
        const trades = data[season].trades;

        return (
          <div key={season}>
            <button
              type="button"
              onClick={() => setOpenSeason(isOpen ? null : season)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#1a2d42] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{season}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{trades.length} trade{trades.length !== 1 ? 's' : ''}</span>
                <ChevronLeft
                  className={cn('w-4 h-4 text-slate-500 transition-transform', isOpen ? '-rotate-90' : 'rotate-180')}
                  aria-hidden="true"
                />
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 space-y-2">
                {trades.map((trade, i) => (
                  <div key={i} className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] p-3 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">Wk {trade.week}</span>
                      <span className="text-xs text-slate-400">with {trade.trade_partner}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-[#22c55e] font-semibold mb-1">Acquired</div>
                        {trade.acquired.map((p, j) => (
                          <div key={j} className="text-slate-300 text-xs">{p}</div>
                        ))}
                        {trade.acquired.length === 0 && <div className="text-slate-600 text-xs italic">picks only</div>}
                      </div>
                      <div>
                        <div className="text-xs text-[#e94560] font-semibold mb-1">Sent</div>
                        {trade.sent.map((p, j) => (
                          <div key={j} className="text-slate-300 text-xs">{p}</div>
                        ))}
                        {trade.sent.length === 0 && <div className="text-slate-600 text-xs italic">picks only</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRankLabel(rank: number): string {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

// ─── getStaticPaths ───────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = OWNERS.map((owner) => ({
    params: { slug: owner.slug },
  }));
  return { paths, fallback: false };
};

// ─── getStaticProps ───────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<{ owner: Owner }> = async ({ params }) => {
  const slug = params?.slug as string;
  const owner = OWNERS.find((o) => o.slug === slug);
  if (!owner) return { notFound: true };
  return { props: { owner } };
};

// ─── Confetti data ────────────────────────────────────────────────────────────

interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: string;
  rotation: string;
}

const CONFETTI_PIECES: ConfettiPiece[] = [
  { id:  1, left:  '5%', delay: '0.0s', duration: '1.8s', color: '#ffd700', size: '10px', rotation: '20deg'  },
  { id:  2, left: '10%', delay: '0.1s', duration: '2.1s', color: '#ffffff', size:  '8px', rotation: '-35deg' },
  { id:  3, left: '18%', delay: '0.3s', duration: '1.6s', color: '#cc2200', size: '12px', rotation: '55deg'  },
  { id:  4, left: '25%', delay: '0.0s', duration: '2.0s', color: '#ffd700', size:  '9px', rotation: '-15deg' },
  { id:  5, left: '32%', delay: '0.2s', duration: '1.9s', color: '#0d1b2a', size: '11px', rotation: '40deg'  },
  { id:  6, left: '40%', delay: '0.4s', duration: '1.7s', color: '#ffffff', size:  '8px', rotation: '-50deg' },
  { id:  7, left: '48%', delay: '0.1s', duration: '2.2s', color: '#ffd700', size: '13px', rotation: '30deg'  },
  { id:  8, left: '55%', delay: '0.5s', duration: '1.8s', color: '#cc2200', size:  '9px', rotation: '-25deg' },
  { id:  9, left: '62%', delay: '0.2s', duration: '2.0s', color: '#ffffff', size: '10px', rotation: '60deg'  },
  { id: 10, left: '70%', delay: '0.0s', duration: '1.6s', color: '#ffd700', size: '12px', rotation: '-40deg' },
  { id: 11, left: '76%', delay: '0.3s', duration: '2.1s', color: '#0d1b2a', size:  '8px', rotation: '15deg'  },
  { id: 12, left: '82%', delay: '0.1s', duration: '1.9s', color: '#cc2200', size: '11px', rotation: '-55deg' },
  { id: 13, left: '88%', delay: '0.4s', duration: '1.7s', color: '#ffd700', size:  '9px', rotation: '45deg'  },
  { id: 14, left: '93%', delay: '0.2s', duration: '2.0s', color: '#ffffff', size: '13px', rotation: '-20deg' },
  { id: 15, left: '97%', delay: '0.0s', duration: '1.8s', color: '#ffd700', size: '10px', rotation: '35deg'  },
  { id: 16, left:  '2%', delay: '0.6s', duration: '1.9s', color: '#cc2200', size: '11px', rotation: '-45deg' },
  { id: 17, left: '14%', delay: '0.5s', duration: '2.2s', color: '#ffffff', size:  '8px', rotation: '50deg'  },
  { id: 18, left: '36%', delay: '0.7s', duration: '1.7s', color: '#ffd700', size: '12px', rotation: '-30deg' },
  { id: 19, left: '58%', delay: '0.6s', duration: '2.0s', color: '#0d1b2a', size:  '9px', rotation: '25deg'  },
  { id: 20, left: '84%', delay: '0.8s', duration: '1.8s', color: '#cc2200', size: '10px', rotation: '-60deg' },
];

// Inline styles for confetti keyframes — injected once via a <style> tag.
const CONFETTI_CSS = `
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(340px) rotate(var(--confetti-rot, 45deg)); opacity: 0; }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.confetti-piece {
  position: absolute;
  top: 0;
  border-radius: 2px;
  animation-name: confettiFall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
  pointer-events: none;
}
.champion-badge-shimmer {
  background: linear-gradient(
    90deg,
    #ffd700 0%,
    #fff7c0 40%,
    #ffd700 60%,
    #e6b800 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2.4s linear infinite;
}
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OwnerDetailPage({ owner }: { owner: Owner }) {
  const isChampion = owner.championships.length > 0;
  const total = owner.wins + owner.losses;
  const winPct = total > 0 ? (owner.wins / total) : 0;
  const winPctStr = winPct.toFixed(3).replace(/^0/, '');

  return (
    <>
      <Head>
        <title>{owner.displayName} — BMFFFL Dynasty</title>
        <meta name="description" content={`${owner.displayName} dynasty profile: ${owner.wins}-${owner.losses} all-time, ${owner.championships.length} championship(s).`} />
      </Head>

      {/* Inject confetti CSS keyframes */}
      {isChampion && <style dangerouslySetInnerHTML={{ __html: CONFETTI_CSS }} />}

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link
            href="/owners"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            All Owners
          </Link>

          {/* ── Section 1: Header ─────────────────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-6 mb-6 relative overflow-hidden',
              'bg-[#16213e] border',
              isChampion ? 'border-[#ffd700]/40' : 'border-[#2d4a66]'
            )}
          >
            {/* Confetti overlay — only rendered for champions, CSS-only stop after ~3s */}
            {isChampion && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                {CONFETTI_PIECES.map((piece) => (
                  <div
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                      left: piece.left,
                      width: piece.size,
                      height: piece.size,
                      backgroundColor: piece.color,
                      animationDelay: piece.delay,
                      animationDuration: piece.duration,
                      // pass rotation as CSS custom property consumed by the keyframe
                      ['--confetti-rot' as string]: piece.rotation,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-start gap-5 relative z-10">
              {/* Avatar */}
              <div
                className={cn(
                  'w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  isChampion
                    ? 'bg-[#ffd700]/10 border-[#ffd700]'
                    : 'bg-[#0f3460] border-[#2d4a66]'
                )}
              >
                <span className={cn('text-2xl font-black', isChampion ? 'text-[#ffd700]' : 'text-slate-300')}>
                  {owner.displayName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-3xl font-black text-white">{owner.displayName}</h1>
                  <Badge variant={owner.dynastyRank === 1 ? 'champion' : 'default'} size="md">
                    Dynasty #{owner.dynastyRank}
                  </Badge>
                  {/* Champion badge with shimmer — only for champions */}
                  {isChampion && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/40 text-sm font-black"
                      aria-label="Champion"
                    >
                      <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                      <span className="champion-badge-shimmer">Champion</span>
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mb-1">{owner.teamName}</p>
                {owner.realName && (
                  <p className="text-xs text-slate-500 mb-2">{owner.realName}</p>
                )}
                {/* Championship badges */}
                {owner.championships.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {owner.championships.map((year) => (
                      <Badge key={year} variant="champion" size="md">
                        <Trophy className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                        {year} Champion
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-500 italic">No championships yet</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 2: Career Stats ───────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="All-Time Record"
              value={`${owner.wins}-${owner.losses}`}
              subtext={`${total} games played`}
            />
            <StatCard
              label="Win %"
              value={winPctStr}
              subtext="Career average"
            />
            <StatCard
              label="Playoff Apps"
              value={owner.playoffApps}
              subtext={`${owner.seasons.length} seasons`}
            />
            <StatCard
              label="Championships"
              value={owner.championships.length}
              subtext={owner.championships.length > 0 ? owner.championships.join(', ') : 'No titles yet'}
            />
          </div>

          {/* ── Section 3: Season-by-Season ───────────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66] flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Season-by-Season</h2>
              {owner.seasons.some(s => s.era === 'espn') && (
                <span className="text-[10px] text-slate-500 font-mono">ESPN era 2016–2019 included</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d1b2a] text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-semibold">Year</th>
                    <th className="px-4 py-3 text-left font-semibold">Team Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Seed</th>
                    <th className="px-4 py-3 text-left font-semibold">Record</th>
                    <th className="px-4 py-3 text-center font-semibold">🏆</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d4a66]">
                  {owner.seasons.map((season) => (
                    <tr
                      key={season.year}
                      className={cn(
                        'transition-colors',
                        season.champion
                          ? 'bg-[#ffd700]/5 hover:bg-[#ffd700]/10'
                          : season.era === 'espn'
                          ? 'bg-[#0d1b2a]/60 hover:bg-[#0d1b2a]'
                          : 'bg-[#16213e] hover:bg-[#1a2d42]'
                      )}
                    >
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                        {season.year}
                        {season.era === 'espn' && (
                          <span className="ml-1.5 text-[9px] font-bold text-[#e94560]/70 bg-[#e94560]/10 px-1 py-0.5 rounded uppercase tracking-wide">ESPN</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-[180px]">
                        <span className="truncate block" title={season.teamName}>{season.teamName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('font-semibold', season.rank === 1 ? 'text-[#ffd700]' : 'text-slate-300')}>
                          #{season.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-300">
                        {season.wins}-{season.losses}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {season.champion ? (
                          <Trophy className="w-4 h-4 text-[#ffd700] mx-auto" aria-label="Champion" />
                        ) : (
                          <span className="text-slate-700">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Section 4: Current Roster (live from Sleeper) ────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66] flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Current Roster</h2>
              <span className="text-xs text-[#22c55e] font-medium">● Live</span>
            </div>
            <LiveRosterSection displayName={owner.displayName} />
          </div>

          {/* ── Section 5: Roster History (end-of-season snapshots) ─────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66] flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Roster History</h2>
              <span className="text-xs text-slate-500">End-of-season snapshots · 2020–present</span>
            </div>
            <RosterHistorySection displayName={owner.displayName} />
          </div>

          {/* ── Section 6: Draft History ──────────────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66] flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Draft History</h2>
              <span className="text-xs text-slate-500">Rookie picks by season · 2020–present</span>
            </div>
            <DraftHistorySection displayName={owner.displayName} />
          </div>

          {/* ── Section 7: Trades ─────────────────────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-[#2d4a66] mb-6">
            <div className="bg-[#16213e] px-5 py-3 border-b border-[#2d4a66] flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Trade History</h2>
              <span className="text-xs text-slate-500">All trades · 2020–present</span>
            </div>
            <TransactionsSection displayName={owner.displayName} />
          </div>

          {/* ── Section 8: Owner Profile ──────────────────────────────────── */}
          <div className="rounded-xl p-5 bg-[#16213e] border border-[#2d4a66] mb-6">
            <h2 className="text-base font-bold text-white mb-3">Owner Profile</h2>
            <p className="text-slate-300 leading-relaxed">{owner.status}</p>
          </div>

          {/* Back to owners */}
          <Link
            href="/owners"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Back to all owners
          </Link>
        </div>
      </main>
    </>
  );
}
