# 2025 BMFFFL Season — Standings Validation

**League ID:** 1180109269263917056
**Validation Date:** 2026-03-15
**Data Source:** Sleeper API (live)

---

## 1. API Data Summary

### League Info (`/v1/league/1180109269263917056`)

- **League Name:** BMFFFL
- **Season:** 2025
- **Status:** complete
- **Format:** 12 teams, 3 divisions, dynasty (type 2)
- **Playoff Teams:** 6
- **Playoff Start Week:** 15, Regular Season ends Week 14
- **Latest League Winner Roster ID:** 11
- **Trophy Winner Banner:** "2025 BMFFFL CHAMPION"
- **Trophy Loser Banner:** "MOODIE BOWL WINNER"

### Rosters (`/v1/league/1180109269263917056/rosters`)

Roster IDs mapped to owners and regular season W-L records:

| Roster ID | Owner (display_name) | Team Name | W | L | Record String |
|-----------|----------------------|-----------|---|---|---------------|
| 1  | Grandes       | El Rioux Grandes          |  4 | 10 | WLLLLLWWLLLLWL |
| 2  | SexMachineAndyD | SexMachineAndyD          |  9 |  5 | WWWLWWLLWWLWLW |
| 3  | rbr           | Really Big Rings          |  5 |  9 | LLWLWLLWLLWLLW |
| 4  | Cogdeill11    | Earn it                   |  5 |  9 | WWLLWLWLLLLWLL |
| 5  | MLSchools12   | Schoolcraft Football Team | 13 |  1 | WWWWWWWLWWWWWW |
| 6  | Cmaleski      | Showtyme Boyz             |  6 |  8 | LLWWLWWWWLLLLL |
| 7  | eldridm20     | Franks Little Beauties    |  6 |  8 | LWLWLWLLLWWLLW |
| 8  | JuicyBussy    | Juicy Bussy               |  7 |  7 | LWLLLWWLWLWWWL |
| 9  | Escuelas      | Booty Cheeks              |  6 |  8 | LLLWWLWWLLLLWW |
| 10 | eldridsm      | (no team name set)        |  5 |  9 | WLWLLLLLLWWWLL |
| 11 | tdtd19844     | THE Shameful Saggy sack   |  8 |  6 | LLWWWWLWWWLLWL |
| 12 | Tubes94       | Whale Tails               | 10 |  4 | WWLWLLLWWWWWWW |

### Winners Bracket (`/v1/league/1180109269263917056/winners_bracket`)

| Round | Match | Team 1 (Roster) | Team 2 (Roster) | Winner | Placement |
|-------|-------|-----------------|-----------------|--------|-----------|
| 1 | 1 | Roster 11 (tdtd19844) | Roster 8 (JuicyBussy) | Roster 11 | — |
| 1 | 2 | Roster 6 (Cmaleski) | Roster 2 (SexMachineAndyD) | Roster 6 | — |
| 2 | 3 | Roster 5 (MLSchools12) | Roster 11 (tdtd19844) | Roster 11 | — |
| 2 | 4 | Roster 12 (Tubes94) | Roster 6 (Cmaleski) | Roster 12 | — |
| 2 | 5 | Roster 8 (JuicyBussy) | Roster 2 (SexMachineAndyD) | Roster 2 | 5th place |
| 3 | 6 | Roster 11 (tdtd19844) | Roster 12 (Tubes94) | **Roster 11** | **1st place (Champion)** |
| 3 | 7 | Roster 5 (MLSchools12) | Roster 6 (Cmaleski) | Roster 5 | **3rd place** |

### Losers Bracket (`/v1/league/1180109269263917056/losers_bracket`)

| Round | Match | Team 1 (Roster) | Team 2 (Roster) | Winner | Placement |
|-------|-------|-----------------|-----------------|--------|-----------|
| 1 | 1 | Roster 10 (eldridsm) | Roster 9 (Escuelas) | Roster 9 | — |
| 1 | 2 | Roster 7 (eldridm20) | Roster 3 (rbr) | Roster 3 | — |
| 2 | 3 | Roster 1 (Grandes) | Roster 9 (Escuelas) | Roster 1 | — |
| 2 | 4 | Roster 4 (Cogdeill11) | Roster 3 (rbr) | Roster 4 | — |
| 2 | 5 | Roster 10 (eldridsm) | Roster 7 (eldridm20) | Roster 7 | — |
| 3 | 6 | Roster 1 (Grandes) | Roster 4 (Cogdeill11) | **Roster 1** | **Moodie Bowl Winner (Last Place)** |
| 3 | 7 | Roster 9 (Escuelas) | Roster 3 (rbr) | Roster 9 | — |

---

## 2. Comparison Against Internal Claims

### Claim 1: Champion is tdtd19844

- **API says:** Winners bracket match 6 (championship game), winner = Roster 11 = tdtd19844. The league metadata field `latest_league_winner_roster_id` = "11", confirming Roster 11 is the champion.
- **Status: VERIFIED**

### Claim 2: Runner-up is Tubes94

- **API says:** Winners bracket match 6 (championship game), loser = Roster 12 = Tubes94.
- **Status: VERIFIED**

### Claim 3: 3rd place is MLSchools12

- **API says:** Winners bracket match 7 (3rd place game, `p:3`), winner = Roster 5 = MLSchools12.
- **Status: VERIFIED**

### Claim 4: MLSchools12 record is 13-1

- **API says:** Roster 5 (MLSchools12) — `wins: 13`, `losses: 1`. Record string: "WWWWWWWLWWWWWW" (14 weeks).
- **Status: VERIFIED**

### Claim 5: Moodie Bowl winner is Grandes (4-10)

- **API says:** Losers bracket match 6 (Moodie Bowl, `p:1`), winner = Roster 1 = Grandes. Regular season record: `wins: 4`, `losses: 10`. Record string confirms "WLLLLLWWLLLLWL".
- **Note:** The Moodie Bowl is the losers bracket championship — in this league, the `trophy_loser_banner_text` reads "MOODIE BOWL WINNER", confirming Grandes holds this distinction.
- **Status: VERIFIED**

---

## 3. Full Final Standings Summary

### Playoff Results

| Finish | Owner | Team Name | Reg. Season |
|--------|-------|-----------|-------------|
| 1st — Champion | tdtd19844 | THE Shameful Saggy sack | 8-6 |
| 2nd — Runner-up | Tubes94 | Whale Tails | 10-4 |
| 3rd | MLSchools12 | Schoolcraft Football Team | 13-1 |
| 4th | Cmaleski | Showtyme Boyz | 6-8 |
| 5th | SexMachineAndyD | SexMachineAndyD | 9-5 |
| 6th | JuicyBussy | Juicy Bussy | 7-7 |

### Non-Playoff Finishers (by regular season record)

| Reg. Season Rank | Owner | Team Name | Record |
|------------------|-------|-----------|--------|
| 7th | eldridsm | — | 5-9 |
| 8th (tie) | rbr | Really Big Rings | 5-9 |
| 9th (tie) | Cogdeill11 | Earn it | 5-9 |
| 10th | Escuelas | Booty Cheeks | 6-8 |
| 11th | eldridm20 | Franks Little Beauties | 6-8 |
| 12th — Moodie Bowl | Grandes | El Rioux Grandes | 4-10 |

---

## 4. Corrections Needed

**None.** All five internal claims are verified against live Sleeper API data:

1. Champion: tdtd19844 — VERIFIED
2. Runner-up: Tubes94 — VERIFIED
3. 3rd place: MLSchools12 — VERIFIED
4. MLSchools12 record 13-1 — VERIFIED
5. Moodie Bowl winner: Grandes (4-10) — VERIFIED

The internal data is accurate and consistent with the Sleeper API.

---

*Generated from Sleeper API — League ID 1180109269263917056*
