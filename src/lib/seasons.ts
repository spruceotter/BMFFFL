// src/lib/seasons.ts
// Re-exports season data as a utility
// The actual data lives in src/pages/history/[year].tsx
// This provides types for external consumers

export interface SeasonSummary {
  year: number;
  champion: string;
  championOwner: string;
  runnerUp: string;
  championshipScore: string;
}

export const SEASON_SUMMARIES: SeasonSummary[] = [
  { year: 2020, champion: 'Cogdeill11',        championOwner: 'Cogdeill11',    runnerUp: 'MLSchools12',     championshipScore: '158.24 - 142.16' },
  { year: 2021, champion: 'The Murder Boners', championOwner: 'MLSchools12',   runnerUp: 'rbr',             championshipScore: '150.90 - 103.38' },
  { year: 2022, champion: 'tdtd19844',         championOwner: 'tdtd19844',     runnerUp: 'Cogdeill11',      championshipScore: '162.44 - 138.90' },
  { year: 2023, champion: 'Cogdeill11',        championOwner: 'Cogdeill11',    runnerUp: 'SexMachineAndyD', championshipScore: '155.12 - 131.44' },
  { year: 2024, champion: 'Juicy Bussy',       championOwner: 'JuicyBussy',    runnerUp: 'Tubes94',         championshipScore: '178.44 - 155.22' },
  { year: 2025, champion: 'Really Big Rings',  championOwner: 'rbr',           runnerUp: 'MLSchools12',     championshipScore: '161.80 - 143.20' },
];
