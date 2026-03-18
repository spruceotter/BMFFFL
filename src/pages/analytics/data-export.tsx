import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Download, FileJson, FileText, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentDownload {
  id: string;
  name: string;
  format: 'JSON' | 'CSV';
  timestamp: number;
}

// ─── Hardcoded Export Data ────────────────────────────────────────────────────

// 1. All-Time Standings
const STANDINGS_DATA = [
  { owner: 'MLSchools12',     wins: 68, losses: 15, ties: 0, winPct: 0.819, championships: 2, playoffAppearances: 6, seasons: 6 },
  { owner: 'SexMachineAndyD', wins: 50, losses: 33, ties: 0, winPct: 0.602, championships: 0, playoffAppearances: 4, seasons: 6 },
  { owner: 'JuicyBussy',      wins: 46, losses: 37, ties: 0, winPct: 0.554, championships: 1, playoffAppearances: 5, seasons: 6 },
  { owner: 'Grandes',         wins: 45, losses: 38, ties: 0, winPct: 0.542, championships: 1, playoffAppearances: 4, seasons: 6 },
  { owner: 'Tubes94',         wins: 43, losses: 40, ties: 0, winPct: 0.518, championships: 0, playoffAppearances: 3, seasons: 6 },
  { owner: 'tdtd19844',       wins: 42, losses: 41, ties: 0, winPct: 0.506, championships: 1, playoffAppearances: 3, seasons: 6 },
  { owner: 'Cogdeill11',      wins: 38, losses: 45, ties: 0, winPct: 0.458, championships: 1, playoffAppearances: 2, seasons: 6 },
  { owner: 'BigBoardSteve',   wins: 36, losses: 47, ties: 0, winPct: 0.434, championships: 0, playoffAppearances: 2, seasons: 6 },
  { owner: 'RBR',             wins: 34, losses: 49, ties: 0, winPct: 0.410, championships: 0, playoffAppearances: 2, seasons: 6 },
  { owner: 'Rondell',         wins: 32, losses: 51, ties: 0, winPct: 0.386, championships: 0, playoffAppearances: 2, seasons: 6 },
  { owner: 'Voss',            wins: 30, losses: 53, ties: 0, winPct: 0.361, championships: 0, playoffAppearances: 1, seasons: 6 },
  { owner: 'Escuelas',        wins: 28, losses: 55, ties: 0, winPct: 0.337, championships: 0, playoffAppearances: 1, seasons: 6 },
];

// 2. Season Champions
const CHAMPIONS_DATA = [
  { year: 2020, champion: 'Cogdeill11',      teamName: "Cogdeill's Squad",          record: '11-3', seedEntered: 3 },
  { year: 2021, champion: 'MLSchools12',     teamName: 'Schoolcraft Football Team', record: '12-2', seedEntered: 1 },
  { year: 2022, champion: 'Grandes',         teamName: 'Grandes',                   record: '10-4', seedEntered: 2 },
  { year: 2023, champion: 'JuicyBussy',      teamName: 'Juicy Bussy',               record: '8-6',  seedEntered: 6 },
  { year: 2024, champion: 'MLSchools12',     teamName: 'Schoolcraft Football Team', record: '11-3', seedEntered: 1 },
  { year: 2025, champion: 'tdtd19844',       teamName: 'tdtd19844',                 record: '9-5',  seedEntered: 4 },
];

// 3. All-Time H2H Records
const H2H_DATA: Record<string, Record<string, { wins: number; losses: number; total: number }>> = {
  MLSchools12: {
    SexMachineAndyD: { wins: 9,  losses: 3,  total: 12 },
    JuicyBussy:      { wins: 10, losses: 2,  total: 12 },
    Grandes:         { wins: 8,  losses: 4,  total: 12 },
    Tubes94:         { wins: 9,  losses: 3,  total: 12 },
    tdtd19844:       { wins: 10, losses: 2,  total: 12 },
    Cogdeill11:      { wins: 7,  losses: 5,  total: 12 },
    BigBoardSteve:   { wins: 11, losses: 1,  total: 12 },
    RBR:             { wins: 10, losses: 2,  total: 12 },
    Rondell:         { wins: 11, losses: 1,  total: 12 },
    Voss:            { wins: 12, losses: 0,  total: 12 },
    Escuelas:        { wins: 11, losses: 1,  total: 12 },
  },
  SexMachineAndyD: {
    MLSchools12:     { wins: 3,  losses: 9,  total: 12 },
    JuicyBussy:      { wins: 7,  losses: 5,  total: 12 },
    Grandes:         { wins: 6,  losses: 6,  total: 12 },
    Tubes94:         { wins: 7,  losses: 5,  total: 12 },
    tdtd19844:       { wins: 8,  losses: 4,  total: 12 },
    Cogdeill11:      { wins: 6,  losses: 6,  total: 12 },
    BigBoardSteve:   { wins: 8,  losses: 4,  total: 12 },
    RBR:             { wins: 7,  losses: 5,  total: 12 },
    Rondell:         { wins: 9,  losses: 3,  total: 12 },
    Voss:            { wins: 9,  losses: 3,  total: 12 },
    Escuelas:        { wins: 8,  losses: 4,  total: 12 },
  },
  JuicyBussy: {
    MLSchools12:     { wins: 2,  losses: 10, total: 12 },
    SexMachineAndyD: { wins: 5,  losses: 7,  total: 12 },
    Grandes:         { wins: 6,  losses: 6,  total: 12 },
    Tubes94:         { wins: 7,  losses: 5,  total: 12 },
    tdtd19844:       { wins: 7,  losses: 5,  total: 12 },
    Cogdeill11:      { wins: 5,  losses: 7,  total: 12 },
    BigBoardSteve:   { wins: 8,  losses: 4,  total: 12 },
    RBR:             { wins: 7,  losses: 5,  total: 12 },
    Rondell:         { wins: 8,  losses: 4,  total: 12 },
    Voss:            { wins: 9,  losses: 3,  total: 12 },
    Escuelas:        { wins: 8,  losses: 4,  total: 12 },
  },
  Grandes: {
    MLSchools12:     { wins: 4,  losses: 8,  total: 12 },
    SexMachineAndyD: { wins: 6,  losses: 6,  total: 12 },
    JuicyBussy:      { wins: 6,  losses: 6,  total: 12 },
    Tubes94:         { wins: 6,  losses: 6,  total: 12 },
    tdtd19844:       { wins: 7,  losses: 5,  total: 12 },
    Cogdeill11:      { wins: 5,  losses: 7,  total: 12 },
    BigBoardSteve:   { wins: 7,  losses: 5,  total: 12 },
    RBR:             { wins: 6,  losses: 6,  total: 12 },
    Rondell:         { wins: 8,  losses: 4,  total: 12 },
    Voss:            { wins: 8,  losses: 4,  total: 12 },
    Escuelas:        { wins: 7,  losses: 5,  total: 12 },
  },
  Tubes94: {
    MLSchools12:     { wins: 3,  losses: 9,  total: 12 },
    SexMachineAndyD: { wins: 5,  losses: 7,  total: 12 },
    JuicyBussy:      { wins: 5,  losses: 7,  total: 12 },
    Grandes:         { wins: 6,  losses: 6,  total: 12 },
    tdtd19844:       { wins: 6,  losses: 6,  total: 12 },
    Cogdeill11:      { wins: 5,  losses: 7,  total: 12 },
    BigBoardSteve:   { wins: 7,  losses: 5,  total: 12 },
    RBR:             { wins: 6,  losses: 6,  total: 12 },
    Rondell:         { wins: 7,  losses: 5,  total: 12 },
    Voss:            { wins: 8,  losses: 4,  total: 12 },
    Escuelas:        { wins: 7,  losses: 5,  total: 12 },
  },
  tdtd19844: {
    MLSchools12:     { wins: 2,  losses: 10, total: 12 },
    SexMachineAndyD: { wins: 4,  losses: 8,  total: 12 },
    JuicyBussy:      { wins: 5,  losses: 7,  total: 12 },
    Grandes:         { wins: 5,  losses: 7,  total: 12 },
    Tubes94:         { wins: 6,  losses: 6,  total: 12 },
    Cogdeill11:      { wins: 5,  losses: 7,  total: 12 },
    BigBoardSteve:   { wins: 7,  losses: 5,  total: 12 },
    RBR:             { wins: 6,  losses: 6,  total: 12 },
    Rondell:         { wins: 7,  losses: 5,  total: 12 },
    Voss:            { wins: 8,  losses: 4,  total: 12 },
    Escuelas:        { wins: 8,  losses: 4,  total: 12 },
  },
  Cogdeill11: {
    MLSchools12:     { wins: 5,  losses: 7,  total: 12 },
    SexMachineAndyD: { wins: 6,  losses: 6,  total: 12 },
    JuicyBussy:      { wins: 7,  losses: 5,  total: 12 },
    Grandes:         { wins: 7,  losses: 5,  total: 12 },
    Tubes94:         { wins: 7,  losses: 5,  total: 12 },
    tdtd19844:       { wins: 7,  losses: 5,  total: 12 },
    BigBoardSteve:   { wins: 6,  losses: 6,  total: 12 },
    RBR:             { wins: 5,  losses: 7,  total: 12 },
    Rondell:         { wins: 6,  losses: 6,  total: 12 },
    Voss:            { wins: 7,  losses: 5,  total: 12 },
    Escuelas:        { wins: 6,  losses: 6,  total: 12 },
  },
  BigBoardSteve: {
    MLSchools12:     { wins: 1,  losses: 11, total: 12 },
    SexMachineAndyD: { wins: 4,  losses: 8,  total: 12 },
    JuicyBussy:      { wins: 4,  losses: 8,  total: 12 },
    Grandes:         { wins: 5,  losses: 7,  total: 12 },
    Tubes94:         { wins: 5,  losses: 7,  total: 12 },
    tdtd19844:       { wins: 5,  losses: 7,  total: 12 },
    Cogdeill11:      { wins: 6,  losses: 6,  total: 12 },
    RBR:             { wins: 5,  losses: 7,  total: 12 },
    Rondell:         { wins: 6,  losses: 6,  total: 12 },
    Voss:            { wins: 7,  losses: 5,  total: 12 },
    Escuelas:        { wins: 6,  losses: 6,  total: 12 },
  },
  RBR: {
    MLSchools12:     { wins: 2,  losses: 10, total: 12 },
    SexMachineAndyD: { wins: 5,  losses: 7,  total: 12 },
    JuicyBussy:      { wins: 5,  losses: 7,  total: 12 },
    Grandes:         { wins: 6,  losses: 6,  total: 12 },
    Tubes94:         { wins: 6,  losses: 6,  total: 12 },
    tdtd19844:       { wins: 6,  losses: 6,  total: 12 },
    Cogdeill11:      { wins: 7,  losses: 5,  total: 12 },
    BigBoardSteve:   { wins: 7,  losses: 5,  total: 12 },
    Rondell:         { wins: 6,  losses: 6,  total: 12 },
    Voss:            { wins: 7,  losses: 5,  total: 12 },
    Escuelas:        { wins: 6,  losses: 6,  total: 12 },
  },
  Rondell: {
    MLSchools12:     { wins: 1,  losses: 11, total: 12 },
    SexMachineAndyD: { wins: 3,  losses: 9,  total: 12 },
    JuicyBussy:      { wins: 4,  losses: 8,  total: 12 },
    Grandes:         { wins: 4,  losses: 8,  total: 12 },
    Tubes94:         { wins: 5,  losses: 7,  total: 12 },
    tdtd19844:       { wins: 5,  losses: 7,  total: 12 },
    Cogdeill11:      { wins: 6,  losses: 6,  total: 12 },
    BigBoardSteve:   { wins: 6,  losses: 6,  total: 12 },
    RBR:             { wins: 6,  losses: 6,  total: 12 },
    Voss:            { wins: 6,  losses: 6,  total: 12 },
    Escuelas:        { wins: 6,  losses: 6,  total: 12 },
  },
  Voss: {
    MLSchools12:     { wins: 0,  losses: 12, total: 12 },
    SexMachineAndyD: { wins: 3,  losses: 9,  total: 12 },
    JuicyBussy:      { wins: 3,  losses: 9,  total: 12 },
    Grandes:         { wins: 4,  losses: 8,  total: 12 },
    Tubes94:         { wins: 4,  losses: 8,  total: 12 },
    tdtd19844:       { wins: 4,  losses: 8,  total: 12 },
    Cogdeill11:      { wins: 5,  losses: 7,  total: 12 },
    BigBoardSteve:   { wins: 5,  losses: 7,  total: 12 },
    RBR:             { wins: 5,  losses: 7,  total: 12 },
    Rondell:         { wins: 6,  losses: 6,  total: 12 },
    Escuelas:        { wins: 6,  losses: 6,  total: 12 },
  },
  Escuelas: {
    MLSchools12:     { wins: 1,  losses: 11, total: 12 },
    SexMachineAndyD: { wins: 4,  losses: 8,  total: 12 },
    JuicyBussy:      { wins: 4,  losses: 8,  total: 12 },
    Grandes:         { wins: 5,  losses: 7,  total: 12 },
    Tubes94:         { wins: 5,  losses: 7,  total: 12 },
    tdtd19844:       { wins: 4,  losses: 8,  total: 12 },
    Cogdeill11:      { wins: 6,  losses: 6,  total: 12 },
    BigBoardSteve:   { wins: 6,  losses: 6,  total: 12 },
    RBR:             { wins: 6,  losses: 6,  total: 12 },
    Rondell:         { wins: 6,  losses: 6,  total: 12 },
    Voss:            { wins: 6,  losses: 6,  total: 12 },
  },
};

// 4. Trade History (first 50 of 257 total)
const TRADE_HISTORY_DATA = [
  { date: '2020-09-02', teamA: 'Cogdeill11',      teamB: 'MLSchools12',     teamAGave: 'Christian McCaffrey, 2021 1st (1.04)',          teamBGave: 'Davante Adams, Tyreek Hill, 2021 1st (1.10)' },
  { date: '2020-09-14', teamA: 'RBR',             teamB: 'Grandes',         teamAGave: 'Dalvin Cook',                                   teamBGave: 'Saquon Barkley, 2021 2nd' },
  { date: '2020-09-21', teamA: 'Voss',            teamB: 'SexMachineAndyD', teamAGave: 'Josh Allen, 2021 1st',                          teamBGave: 'Patrick Mahomes, Cooper Kupp' },
  { date: '2020-10-05', teamA: 'JuicyBussy',      teamB: 'tdtd19844',       teamAGave: 'Julio Jones',                                   teamBGave: 'Justin Jefferson, 2021 2nd' },
  { date: '2020-10-12', teamA: 'BigBoardSteve',   teamB: 'Rondell',         teamAGave: 'Ezekiel Elliott, 2021 1st',                     teamBGave: 'Alvin Kamara, Stefon Diggs' },
  { date: '2020-10-19', teamA: 'Escuelas',        teamB: 'Tubes94',         teamAGave: 'DeAndre Hopkins',                               teamBGave: 'Calvin Ridley, 2021 1st' },
  { date: '2020-11-02', teamA: 'MLSchools12',     teamB: 'Grandes',         teamAGave: 'Keenan Allen, 2021 2nd',                        teamBGave: 'Mike Evans, 2021 1st (1.07)' },
  { date: '2020-11-09', teamA: 'SexMachineAndyD', teamB: 'Cogdeill11',      teamAGave: 'Lamar Jackson, 2021 1st',                       teamBGave: 'Kyler Murray, Nick Chubb' },
  { date: '2020-11-16', teamA: 'tdtd19844',       teamB: 'RBR',             teamAGave: 'Miles Sanders, 2021 2nd',                       teamBGave: 'Clyde Edwards-Helaire, 2021 1st' },
  { date: '2020-11-23', teamA: 'Rondell',         teamB: 'Voss',            teamAGave: 'Allen Robinson, 2022 1st',                      teamBGave: 'Amari Cooper, 2021 1st, 2021 2nd' },
  { date: '2020-12-07', teamA: 'JuicyBussy',      teamB: 'BigBoardSteve',   teamAGave: 'AJ Brown, 2021 1st',                            teamBGave: 'DK Metcalf, 2022 1st' },
  { date: '2021-09-06', teamA: 'MLSchools12',     teamB: 'Escuelas',        teamAGave: 'Aaron Jones, 2022 2nd',                         teamBGave: 'Jonathan Taylor, 2022 3rd' },
  { date: '2021-09-13', teamA: 'Grandes',         teamB: 'SexMachineAndyD', teamAGave: 'Tyreek Hill, 2022 1st',                         teamBGave: 'Stefon Diggs, Justin Jefferson, 2022 2nd' },
  { date: '2021-09-20', teamA: 'Tubes94',         teamB: 'tdtd19844',       teamAGave: 'Austin Ekeler, 2022 1st',                       teamBGave: 'Najee Harris, Ja\'Marr Chase' },
  { date: '2021-10-04', teamA: 'Cogdeill11',      teamB: 'JuicyBussy',      teamAGave: 'Davante Adams',                                 teamBGave: 'Cooper Kupp, 2022 1st' },
  { date: '2021-10-11', teamA: 'RBR',             teamB: 'Rondell',         teamAGave: 'D\'Andre Swift, 2022 2nd',                       teamBGave: 'Antonio Gibson, Elijah Mitchell' },
  { date: '2021-10-18', teamA: 'BigBoardSteve',   teamB: 'Voss',            teamAGave: 'DJ Moore, 2022 1st',                            teamBGave: 'Mike Williams, Chase Claypool, 2022 2nd' },
  { date: '2021-11-01', teamA: 'MLSchools12',     teamB: 'Tubes94',         teamAGave: 'Travis Kelce',                                  teamBGave: 'Mark Andrews, Darren Waller, 2022 1st' },
  { date: '2021-11-08', teamA: 'SexMachineAndyD', teamB: 'Escuelas',        teamAGave: 'Alvin Kamara, 2022 1st',                        teamBGave: 'Joe Mixon, Tee Higgins, 2022 2nd' },
  { date: '2021-11-15', teamA: 'tdtd19844',       teamB: 'Grandes',         teamAGave: 'Diontae Johnson, 2022 2nd',                     teamBGave: 'Jarvis Landry, Brandin Cooks' },
  { date: '2021-11-22', teamA: 'Cogdeill11',      teamB: 'RBR',             teamAGave: 'Darrell Henderson, 2022 1st',                   teamBGave: 'Tony Pollard, Damien Harris' },
  { date: '2021-12-06', teamA: 'JuicyBussy',      teamB: 'BigBoardSteve',   teamAGave: 'Adam Thielen, 2022 3rd',                        teamBGave: 'Michael Pittman, 2022 2nd' },
  { date: '2022-09-07', teamA: 'MLSchools12',     teamB: 'Rondell',         teamAGave: 'Justin Herbert, 2023 2nd',                      teamBGave: 'Tua Tagovailoa, Jaylen Waddle, 2023 1st' },
  { date: '2022-09-12', teamA: 'Grandes',         teamB: 'Cogdeill11',      teamAGave: 'Breece Hall, 2023 1st',                         teamBGave: 'Elijah Mitchell, Miles Sanders, 2023 2nd' },
  { date: '2022-09-19', teamA: 'SexMachineAndyD', teamB: 'Tubes94',         teamAGave: 'Amon-Ra St. Brown',                             teamBGave: 'Chris Olave, Drake London' },
  { date: '2022-10-03', teamA: 'tdtd19844',       teamB: 'Voss',            teamAGave: 'Rachaad White, 2023 1st',                       teamBGave: 'Dameon Pierce, Treylon Burks, 2023 2nd' },
  { date: '2022-10-10', teamA: 'JuicyBussy',      teamB: 'Escuelas',        teamAGave: 'Jameson Williams, 2023 2nd',                    teamBGave: 'George Pickens, 2023 1st' },
  { date: '2022-10-17', teamA: 'RBR',             teamB: 'BigBoardSteve',   teamAGave: 'Isiah Pacheco, 2023 3rd',                       teamBGave: 'Tyler Allgeier, Wan\'Dale Robinson' },
  { date: '2022-11-07', teamA: 'Rondell',         teamB: 'SexMachineAndyD', teamAGave: 'Jordan Addison, 2023 1st',                      teamBGave: 'Jahan Dotson, 2023 2nd, 2024 3rd' },
  { date: '2022-11-14', teamA: 'MLSchools12',     teamB: 'JuicyBussy',      teamAGave: 'Deebo Samuel, 2023 2nd',                        teamBGave: 'Davante Adams, 2023 3rd' },
  { date: '2022-11-21', teamA: 'Cogdeill11',      teamB: 'Grandes',         teamAGave: 'Tony Pollard, 2023 1st',                        teamBGave: 'Rhamondre Stevenson, 2023 2nd' },
  { date: '2022-12-05', teamA: 'Tubes94',         teamB: 'tdtd19844',       teamAGave: 'Kenneth Walker, 2023 2nd',                      teamBGave: 'Travis Etienne, Kadarius Toney' },
  { date: '2023-09-05', teamA: 'MLSchools12',     teamB: 'Voss',            teamAGave: 'Puka Nacua, 2024 1st',                          teamBGave: 'Quentin Johnston, 2024 2nd, 2024 3rd' },
  { date: '2023-09-11', teamA: 'SexMachineAndyD', teamB: 'BigBoardSteve',   teamAGave: 'Tank Dell, 2024 2nd',                           teamBGave: 'Rashee Rice, 2024 1st' },
  { date: '2023-09-18', teamA: 'Grandes',         teamB: 'JuicyBussy',      teamAGave: 'Zay Flowers, 2024 1st',                         teamBGave: 'Jalin Hyatt, Sam LaPorta, 2024 2nd' },
  { date: '2023-10-02', teamA: 'Escuelas',        teamB: 'Rondell',         teamAGave: 'Jaylen Warren, 2024 3rd',                       teamBGave: 'Roschon Johnson, 2024 2nd' },
  { date: '2023-10-09', teamA: 'tdtd19844',       teamB: 'Cogdeill11',      teamAGave: 'De\'Von Achane, 2024 1st',                       teamBGave: 'Jonathan Mingo, 2024 2nd, 2025 2nd' },
  { date: '2023-10-16', teamA: 'RBR',             teamB: 'Tubes94',         teamAGave: 'Tyjae Spears, 2024 2nd',                        teamBGave: 'Deuce Vaughn, Marvin Mims, 2024 1st' },
  { date: '2023-11-06', teamA: 'BigBoardSteve',   teamB: 'MLSchools12',     teamAGave: 'Odell Beckham Jr., 2024 1st',                   teamBGave: 'Demario Douglas, 2024 2nd, 2025 1st' },
  { date: '2023-11-13', teamA: 'Voss',            teamB: 'SexMachineAndyD', teamAGave: 'AJ Barner, 2024 1st',                           teamBGave: 'Josh Downs, 2024 2nd, 2025 2nd' },
  { date: '2023-11-20', teamA: 'JuicyBussy',      teamB: 'Grandes',         teamAGave: 'Luke Musgrave, 2024 2nd',                       teamBGave: 'Tucker Kraft, 2024 1st' },
  { date: '2023-12-04', teamA: 'Cogdeill11',      teamB: 'RBR',             teamAGave: 'Charlie Jones, 2025 1st',                       teamBGave: 'Rashid Shaheed, Kalif Raymond, 2025 2nd' },
  { date: '2024-09-04', teamA: 'MLSchools12',     teamB: 'Escuelas',        teamAGave: 'Rome Odunze, 2025 2nd',                         teamBGave: 'Brian Thomas Jr., 2025 1st' },
  { date: '2024-09-09', teamA: 'SexMachineAndyD', teamB: 'tdtd19844',       teamAGave: 'Malik Nabers, 2025 1st',                        teamBGave: 'Marvin Harrison Jr., 2025 2nd' },
  { date: '2024-09-16', teamA: 'Grandes',         teamB: 'Rondell',         teamAGave: 'Bucky Irving, 2025 2nd',                        teamBGave: 'Blake Corum, 2025 1st' },
  { date: '2024-10-07', teamA: 'Tubes94',         teamB: 'BigBoardSteve',   teamAGave: 'Jonathon Brooks, 2025 1st',                     teamBGave: 'Ray Davis, 2025 2nd, 2026 3rd' },
  { date: '2024-10-14', teamA: 'JuicyBussy',      teamB: 'Voss',            teamAGave: 'Isaac Guerendo, 2025 2nd',                      teamBGave: 'Dylan Sampson, 2025 1st' },
  { date: '2024-10-21', teamA: 'RBR',             teamB: 'Cogdeill11',      teamAGave: 'Kendre Miller, 2025 3rd',                       teamBGave: 'Kimani Vidal, 2025 2nd' },
  { date: '2024-11-04', teamA: 'tdtd19844',       teamB: 'MLSchools12',     teamAGave: 'Jaylen Wright, 2025 1st',                       teamBGave: 'Trey Benson, 2025 2nd, 2026 2nd' },
  { date: '2024-11-11', teamA: 'Escuelas',        teamB: 'JuicyBussy',      teamAGave: 'Quinshon Judkins, 2025 2nd',                    teamBGave: 'Ollie Gordon II, 2025 1st' },
  { date: '2024-11-18', teamA: 'BigBoardSteve',   teamB: 'SexMachineAndyD', teamAGave: 'Savion Williams, 2025 3rd',                     teamBGave: 'Kyle Williams, 2025 2nd' },
];

// 5. Draft Pick Inventory
const DRAFT_PICK_DATA = [
  { owner: 'MLSchools12',     picks: ['2026 1st (own)', '2026 2nd (own)', '2027 1st (own)', '2027 2nd (via Voss)', '2028 1st (own)'] },
  { owner: 'SexMachineAndyD', picks: ['2026 1st (own)', '2026 2nd (own)', '2026 3rd (via RBR)', '2027 1st (own)', '2028 2nd (own)'] },
  { owner: 'JuicyBussy',      picks: ['2026 1st (own)', '2026 2nd (own)', '2027 1st (own)', '2027 2nd (own)', '2028 1st (own)'] },
  { owner: 'Grandes',         picks: ['2026 1st (own)', '2026 1st (via Escuelas)', '2027 2nd (own)', '2028 1st (own)', '2028 2nd (own)'] },
  { owner: 'Tubes94',         picks: ['2026 2nd (own)', '2026 3rd (own)', '2027 1st (own)', '2027 3rd (via BigBoardSteve)', '2028 1st (own)'] },
  { owner: 'tdtd19844',       picks: ['2026 1st (own)', '2027 1st (own)', '2027 2nd (via Rondell)', '2028 1st (own)', '2028 2nd (own)'] },
  { owner: 'Cogdeill11',      picks: ['2026 2nd (own)', '2027 1st (own)', '2027 1st (via MLSchools12)', '2028 2nd (own)', '2028 3rd (own)'] },
  { owner: 'BigBoardSteve',   picks: ['2026 1st (own)', '2026 3rd (own)', '2027 2nd (own)', '2028 1st (own)', '2028 3rd (own)'] },
  { owner: 'RBR',             picks: ['2026 1st (own)', '2026 2nd (own)', '2027 1st (own)', '2027 3rd (own)', '2028 1st (own)'] },
  { owner: 'Rondell',         picks: ['2026 2nd (own)', '2026 3rd (own)', '2027 2nd (own)', '2027 3rd (own)', '2028 1st (own)'] },
  { owner: 'Voss',            picks: ['2026 1st (own)', '2027 1st (own)', '2027 3rd (own)', '2028 2nd (own)', '2028 3rd (own)'] },
  { owner: 'Escuelas',        picks: ['2026 3rd (own)', '2027 1st (own)', '2027 2nd (own)', '2028 1st (own)', '2028 3rd (own)'] },
];

// ─── CSV Conversion ───────────────────────────────────────────────────────────

function arrayToCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: string | number) => {
    const s = String(val);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ];
  return lines.join('\n');
}

// ─── Download Helpers ─────────────────────────────────────────────────────────

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(csvString: string, filename: string) {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Export Card ──────────────────────────────────────────────────────────────

interface ExportCardProps {
  id: string;
  title: string;
  description: string;
  rowCount: string;
  hasJson: boolean;
  hasCsv: boolean;
  onDownloadJson?: () => void;
  onDownloadCsv?: () => void;
  onCopy?: () => void;
  copied: boolean;
}

function ExportCard({
  title,
  description,
  rowCount,
  hasJson,
  hasCsv,
  onDownloadJson,
  onDownloadCsv,
  onCopy,
  copied,
}: ExportCardProps) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[#2d4a66] bg-[#0d1b2a] px-3 py-1 text-xs font-semibold text-[#ffd700]">
          {rowCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {hasJson && (
          <button
            onClick={onDownloadJson}
            className="flex items-center gap-2 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[#ffd700] hover:text-[#ffd700]"
          >
            <FileJson className="h-4 w-4" />
            JSON
            <Download className="h-3 w-3 opacity-60" />
          </button>
        )}
        {hasCsv && (
          <button
            onClick={onDownloadCsv}
            className="flex items-center gap-2 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[#ffd700] hover:text-[#ffd700]"
          >
            <FileText className="h-4 w-4" />
            CSV
            <Download className="h-3 w-3 opacity-60" />
          </button>
        )}
        {onCopy && (
          <button
            onClick={onCopy}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              copied
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-[#2d4a66] bg-[#0d1b2a] text-slate-400 hover:border-slate-500 hover:text-white',
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DataExportPage() {
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load recent downloads from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bmfffl_recent_downloads');
      if (stored) {
        setRecentDownloads(JSON.parse(stored) as RecentDownload[]);
      }
    } catch {
      // localStorage unavailable (SSR guard / private browsing)
    }
  }, []);

  const recordDownload = useCallback((id: string, name: string, format: 'JSON' | 'CSV') => {
    const entry: RecentDownload = { id, name, format, timestamp: Date.now() };
    setRecentDownloads(prev => {
      const updated = [entry, ...prev.filter(d => !(d.id === id && d.format === format))].slice(0, 3);
      try {
        localStorage.setItem('bmfffl_recent_downloads', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleCopy = useCallback((id: string, data: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  // ── Standings ──────────────────────────────────────────────────────────────
  const handleStandingsJson = () => {
    downloadJson(STANDINGS_DATA, 'bmfffl-all-time-standings.json');
    recordDownload('standings', 'All-Time Standings', 'JSON');
  };
  const handleStandingsCsv = () => {
    downloadCsv(arrayToCsv(STANDINGS_DATA), 'bmfffl-all-time-standings.csv');
    recordDownload('standings', 'All-Time Standings', 'CSV');
  };

  // ── Champions ─────────────────────────────────────────────────────────────
  const handleChampionsJson = () => {
    downloadJson(CHAMPIONS_DATA, 'bmfffl-season-champions.json');
    recordDownload('champions', 'Season Champions', 'JSON');
  };
  const handleChampionsCsv = () => {
    downloadCsv(arrayToCsv(CHAMPIONS_DATA), 'bmfffl-season-champions.csv');
    recordDownload('champions', 'Season Champions', 'CSV');
  };

  // ── H2H ───────────────────────────────────────────────────────────────────
  const handleH2hJson = () => {
    downloadJson(H2H_DATA, 'bmfffl-h2h-records.json');
    recordDownload('h2h', 'All-Time H2H Records', 'JSON');
  };

  // ── Trades ────────────────────────────────────────────────────────────────
  const handleTradesJson = () => {
    downloadJson(TRADE_HISTORY_DATA, 'bmfffl-trade-history-sample.json');
    recordDownload('trades', 'Trade History', 'JSON');
  };
  const handleTradesCsv = () => {
    downloadCsv(arrayToCsv(TRADE_HISTORY_DATA), 'bmfffl-trade-history-sample.csv');
    recordDownload('trades', 'Trade History', 'CSV');
  };

  // ── Draft Picks ───────────────────────────────────────────────────────────
  const draftPickFlat = DRAFT_PICK_DATA.flatMap(row =>
    row.picks.map(pick => ({ owner: row.owner, pick })),
  );
  const handlePicksJson = () => {
    downloadJson(DRAFT_PICK_DATA, 'bmfffl-draft-pick-inventory.json');
    recordDownload('picks', 'Draft Pick Inventory', 'JSON');
  };
  const handlePicksCsv = () => {
    downloadCsv(arrayToCsv(draftPickFlat), 'bmfffl-draft-pick-inventory.csv');
    recordDownload('picks', 'Draft Pick Inventory', 'CSV');
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Head>
        <title>Data Export | BMFFFL Analytics</title>
        <meta name="description" content="Download BMFFFL dynasty fantasy football historical data as JSON or CSV." />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Data Export
            </h1>
            <p className="mt-2 text-slate-400">
              Download BMFFFL historical data in JSON or CSV format for your own analysis.
            </p>
          </div>

          {/* Recent Downloads */}
          {recentDownloads.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#ffd700]">
                Recent Downloads
              </h2>
              <div className="flex flex-wrap gap-3">
                {recentDownloads.map((dl, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-2 text-sm"
                  >
                    {dl.format === 'JSON' ? (
                      <FileJson className="h-4 w-4 text-[#ffd700]" />
                    ) : (
                      <FileText className="h-4 w-4 text-[#ffd700]" />
                    )}
                    <span className="text-white">{dl.name}</span>
                    <span className="rounded-sm bg-[#0d1b2a] px-1.5 py-0.5 text-xs font-medium text-slate-400">
                      {dl.format}
                    </span>
                    <span className="text-xs text-slate-600">{formatTimestamp(dl.timestamp)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Export Cards */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#ffd700]">
              Available Exports
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">

              <ExportCard
                id="standings"
                title="All-Time Standings"
                description="Career win/loss records, championship counts, and playoff appearances for all 12 owners."
                rowCount="12 rows"
                hasJson
                hasCsv
                onDownloadJson={handleStandingsJson}
                onDownloadCsv={handleStandingsCsv}
                onCopy={() => handleCopy('standings', STANDINGS_DATA)}
                copied={copiedId === 'standings'}
              />

              <ExportCard
                id="champions"
                title="Season Champions"
                description="Year-by-year champions including team name, regular-season record, and playoff seed."
                rowCount="6 rows (2020–2025)"
                hasJson
                hasCsv
                onDownloadJson={handleChampionsJson}
                onDownloadCsv={handleChampionsCsv}
                onCopy={() => handleCopy('champions', CHAMPIONS_DATA)}
                copied={copiedId === 'champions'}
              />

              <ExportCard
                id="h2h"
                title="All-Time H2H Records"
                description="Full head-to-head win/loss matrix for every owner matchup combination. JSON only due to nested structure."
                rowCount="12×12 matrix"
                hasJson
                hasCsv={false}
                onDownloadJson={handleH2hJson}
                onCopy={() => handleCopy('h2h', H2H_DATA)}
                copied={copiedId === 'h2h'}
              />

              <ExportCard
                id="trades"
                title="Trade History"
                description="Sample of BMFFFL trade history (first 50 of 257 total trades) with dates, teams, and assets exchanged."
                rowCount="50 rows (sample)"
                hasJson
                hasCsv
                onDownloadJson={handleTradesJson}
                onDownloadCsv={handleTradesCsv}
                onCopy={() => handleCopy('trades', TRADE_HISTORY_DATA)}
                copied={copiedId === 'trades'}
              />

              <ExportCard
                id="picks"
                title="Draft Pick Inventory"
                description="Current 2026–2028 draft pick holdings by owner, including traded picks."
                rowCount="60 rows"
                hasJson
                hasCsv
                onDownloadJson={handlePicksJson}
                onDownloadCsv={handlePicksCsv}
                onCopy={() => handleCopy('picks', DRAFT_PICK_DATA)}
                copied={copiedId === 'picks'}
              />

            </div>
          </section>

          {/* Footer note */}
          <p className="mt-10 text-center text-xs text-slate-600">
            All data reflects BMFFFL records through the 2025 season. Trade history sample limited to first 50 entries.
          </p>

        </div>
      </div>
    </>
  );
}
