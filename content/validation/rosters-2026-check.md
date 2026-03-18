# BMFFFL 2026 Roster Validation Check

**Date:** 2026-03-15
**League ID:** 1312123497203376128
**API Endpoints Used:**
- `GET https://api.sleeper.app/v1/league/1312123497203376128/rosters`
- `GET https://api.sleeper.app/v1/league/1312123497203376128/users`
- Player name resolution via `GET https://api.sleeper.app/v1/players/nfl`

---

## Summary

The Sleeper API returned valid data. All 12 rosters and all 12 users were successfully retrieved and mapped.

- **Total rosters confirmed:** 12 (matches expected count)
- **Player IDs resolved:** Yes, via full players endpoint
- **Key player assignments verified:** 12 of 13 confirmed, 1 discrepancy found

---

## Roster to Owner Mapping

| Roster ID | Username | Team Name | Total Players |
|-----------|----------|-----------|---------------|
| 1 | Grandes | El Rioux Grandes | 28 |
| 2 | SexMachineAndyD | SexMachineAndyD | 28 |
| 3 | rbr | Really Big Rings | 27 |
| 4 | Cogdeill11 | Earn it | 30 |
| 5 | MLSchools12 | Schoolcraft Football Team | 29 |
| 6 | Cmaleski | Showtyme Boyz | 28 |
| 7 | eldridm20 | Franks Little Beauties | 30 |
| 8 | JuicyBussy | Juicy Bussy | 25 |
| 9 | Bimfle | (no team name set) | 28 |
| 10 | eldridsm | (no team name set) | 30 |
| 11 | tdtd19844 | THE Shameful Saggy sack | 29 |
| 12 | Tubes94 | Whale Tails | 27 |

---

## Key Player Assignment Verification

### Expected vs. Actual Results

| Player | Expected Owner | Actual Owner | Roster | Status | Result |
|--------|---------------|--------------|--------|--------|--------|
| Lamar Jackson (QB, BAL) | MLSchools12 | MLSchools12 | 5 | STARTER | CONFIRMED |
| Josh Allen (QB, BUF) | MLSchools12 | **eldridm20** | **7** | STARTER | **MISMATCH** |
| Bijan Robinson (RB, ATL) | Tubes94 | Tubes94 | 12 | STARTER | CONFIRMED |
| Trevor Lawrence (QB, JAX) | Tubes94 | Tubes94 | 12 | STARTER | CONFIRMED |
| Puka Nacua (WR, LAR) | Tubes94 | Tubes94 | 12 | STARTER | CONFIRMED |
| Breece Hall (RB, NYJ) | Tubes94 | Tubes94 | 12 | STARTER | CONFIRMED |
| Omarion Hampton (RB, LAC) | Cogdeill11 | Cogdeill11 | 4 | STARTER | CONFIRMED |
| Colston Loveland (TE, CHI) | Cogdeill11 | Cogdeill11 | 4 | STARTER | CONFIRMED |
| Matthew Golden (WR, GB) | JuicyBussy | JuicyBussy | 8 | BENCH | CONFIRMED |
| Harold Fannin Jr. (TE, CLE) | JuicyBussy | JuicyBussy | 8 | STARTER | CONFIRMED |
| Luther Burden III (WR, CHI) | eldridm20 | eldridm20 | 7 | BENCH | CONFIRMED |
| Elic Ayomanor (WR, TEN) | rbr | rbr | 3 | STARTER | CONFIRMED |
| Quinshon Judkins (RB, CLE) | rbr | rbr | 3 | BENCH | CONFIRMED |

### Discrepancy Detail

**Josh Allen (QB, BUF) — Sleeper player ID: 4984**

- Expected on: MLSchools12 (Roster 5 — Schoolcraft Football Team)
- Actually on: eldridm20 (Roster 7 — Franks Little Beauties), where he is a **starting QB**
- MLSchools12 does have Lamar Jackson as their QB1 (confirmed starter). Their QB depth includes Jacoby Brissett (starter), Kyler Murray, Justin Fields, and Gardner Minshew — but Josh Allen is not on their roster.

This is either a source data error in what was expected, or Josh Allen was traded/dropped from MLSchools12 at some point. The live API data is unambiguous: Josh Allen is on eldridm20's roster.

---

## Full Roster Listings (by Owner)

### Roster 1 — Grandes (El Rioux Grandes) — 28 players

**Starters (10):** Patrick Mahomes (QB), Tyreek Hill (WR), Tyler Shough (QB), Joe Mixon (RB), J.K. Dobbins (RB), Xavier Worthy (WR), Jack Bech (WR), Dylan Sampson (RB), Jake Ferguson (TE), Rhamondre Stevenson (RB)

**Bench:** Anthony Richardson (QB), Mac Jones (QB), Tyler Lockett (WR), Ja'Lynn Polk (WR), Malik Washington (WR), KeAndre Lambert-Smith (WR), Jaleel McLaughlin (RB), Chris Rodriguez (RB), Michael Carter (RB), Dameon Pierce (RB), Mike Gesicki (TE), DeMario Douglas (WR), Malik Davis (RB)

**Taxi (5):** Luke Schoonmaker (TE), Rasheen Ali (RB), Jalen Milroe (QB), Kyle Williams (WR), Keaton Mitchell (RB)

---

### Roster 2 — SexMachineAndyD — 28 players

**Starters (10):** Justin Herbert (QB), Saquon Barkley (RB), De'Von Achane (RB), Terry McLaurin (WR), Stefon Diggs (WR), Jaxon Smith-Njigba (WR), Chimere Dike (WR), Jake Tonges (TE), Kenneth Gainwell (RB), 0 (empty slot)

**Bench:** Keenan Allen (WR), Garrett Wilson (WR), Jerry Jeudy (WR), Treylon Burks (WR), Kyren Williams (RB), Jordan Mason (RB), Pat Freiermuth (TE), Brock Bowers (TE), Malik Nabers (WR), Isaac Guerendo (RB), Devin Neal (RB), Aaron Rodgers (QB), Bryce Young (QB), Kendre Miller (RB)

**Taxi (5):** Jordan Whittington (WR), Raheim Sanders (RB), Brady Cook (QB), Arian Smith (WR), Max Brosmer (QB)

---

### Roster 3 — rbr (Really Big Rings) — 27 players

**Starters (10):** Bo Nix (QB), Jared Goff (QB), Kimani Vidal (RB), Derrick Henry (RB), Justin Jefferson (WR), Elic Ayomanor (WR), Gabe Davis (WR), Travis Kelce (TE), Christian Watson (WR), Zach Charbonnet (RB)

**Bench:** Jayden Daniels (QB), Quinshon Judkins (RB), Nathan Carter (RB), Brandin Cooks (WR), Chris Moore (WR), Mack Hollins (WR), Christian Kirk (WR), Daniel Jones (QB), Tyler Johnson (WR), Tutu Atwell (WR), Rachaad White (RB), Savion Williams (WR)

**IR/Reserve (2):** Sam LaPorta (TE), James Conner (RB)

**Taxi (3):** Audric Estime (RB), Darius Cooper (WR), Tyrion Davis-Price (RB)

---

### Roster 4 — Cogdeill11 (Earn it) — 30 players

**Starters (10):** Kirk Cousins (QB), Omarion Hampton (RB), Geno Smith (QB), Jahmyr Gibbs (RB), Alvin Kamara (RB — bench slot?), Cooper Kupp (WR), Olamide Zaccheaus (WR), Rico Dowdle (RB), Chris Olave (WR), Colston Loveland (TE)

**Bench:** Rome Odunze (WR), Theo Johnson (TE), Mason Taylor (TE), Will Shipley (RB), Jawhar Jordan (RB), Emari Demercado (RB), Jeremy McNichols (RB), Jonnu Smith (TE), Darnell Washington (TE), Jalen Nailor (WR), KaVontae Turpin (WR), Jayden Higgins (WR)

**IR/Reserve (3):** Michael Penix (QB), J.J. McCarthy (QB), Deshaun Watson (QB)

**Taxi (5):** Cade Stover (TE), Sione Vaki (RB), Jordan James (RB), Jalen Royals (WR), Parker Washington (WR)

---

### Roster 5 — MLSchools12 (Schoolcraft Football Team) — 29 players

**Starters (10):** Lamar Jackson (QB), Jacoby Brissett (QB), Christian McCaffrey (RB), Josh Jacobs (RB), Bucky Irving (RB), CeeDee Lamb (WR), Davante Adams (WR), Deebo Samuel (WR), Jaylen Waddle (WR), Hunter Henry (TE)

**Bench:** Kyler Murray (QB), Justin Fields (QB), Gardner Minshew (QB), Kareem Hunt (RB), Brian Robinson (RB), Evan Hull (RB), George Kittle (TE), Darren Waller (TE), Ricky Pearsall (WR), Tez Johnson (WR), John Metchie (WR), Tyquan Thornton (WR), Quentin Johnston (WR), Jordan Addison (WR)

**Taxi (5):** Riley Leonard (QB), Mitchell Evans (TE), Jaylin Lane (WR), Konata Mumpfield (WR), Gage Larvadain (WR)

---

### Roster 6 — Cmaleski (Showtyme Boyz) — 28 players

**Starters (10):** Jalen Hurts (QB), Drake Maye (QB), Travis Etienne (RB), Tony Pollard (RB), Javonte Williams (RB), DJ Moore (WR), DeVonta Smith (WR), Drake London (WR), Tyler Warren (TE), Tucker Kraft (TE)

**Bench:** Shedeur Sanders (QB), Spencer Rattler (QB), Blake Corum (RB), Devin Singletary (RB), Adonai Mitchell (WR), Xavier Legette (WR), Rashod Bateman (WR), Calvin Austin (WR), Josh Downs (WR), Tyjae Spears (RB), Dalton Schultz (TE), Michael Mayer (TE)

**IR/Reserve (3):** Cam Skattebo (RB), Travis Hunter (WR), Will Levis (QB)

**Taxi (3):** Jaydon Blue (RB), Will Howard (QB), Tahj Brooks (RB)

---

### Roster 7 — eldridm20 (Franks Little Beauties) — 30 players

**Starters (10):** Josh Allen (QB), Baker Mayfield (QB), Aaron Jones (RB), TreVeyon Henderson (RB), Ja'Marr Chase (WR), Troy Franklin (WR), Wan'Dale Robinson (WR), Jameson Williams (WR), Chris Godwin (WR), Oronde Gadsden (TE)

**Bench:** Luther Burden III (WR), Brandon Aiyuk (WR), Evan Engram (TE), Trevor Etienne (RB), Jaylen Wright (RB), Woody Marks (RB), Jacory Croskey-Merritt (RB), Kyle Monangai (RB), Trey Lance (QB), Dont'e Thornton (WR), AJ Barner (TE), Brenton Strange (TE)

**IR/Reserve (3):** Jonathon Brooks (RB), Elijah Arroyo (TE), Tank Dell (WR)

**Taxi (5):** Jarquez Hunter (RB), Jalen Coker (WR), Quinn Ewers (QB), Jaylin Noel (WR), Efton Chism (WR)

---

### Roster 8 — JuicyBussy (Juicy Bussy) — 25 players

**Starters (10):** Sam Darnold (QB), Joe Burrow (QB), D'Andre Swift (RB), Kenneth Walker (RB), A.J. Brown (WR), Amon-Ra St. Brown (WR), Nico Collins (WR), Tee Higgins (WR), George Pickens (WR), Harold Fannin Jr. (TE)

**Bench:** Matthew Golden (WR), Joe Flacco (QB), Jameis Winston (QB), Jake Browning (QB), Samaje Perine (RB), Ty Johnson (RB), Isiah Pacheco (RB), David Njoku (TE), Dawson Knox (TE), Mark Andrews (TE), Xavier Hutchinson (WR)

**IR/Reserve (3):** Zach Ertz (TE), Justice Hill (RB), Najee Harris (RB)

**Taxi (1):** Isaac TeSlaa (WR)

---

### Roster 9 — Bimfle — 28 players

**Starters (10):** C.J. Stroud (QB), Chase Brown (RB), Ashton Jeanty (RB), Zonovan Knight (RB), Michael Pittman (WR), Michael Wilson (WR), Devaughn Vele (WR), Isaiah Likely (TE), Juwan Johnson (TE), Ross Dwelley (TE)

**Bench:** Jaxson Dart (QB), Malik Willis (QB), Jimmy Garoppolo (QB), Tetairoa McMillan (WR), Keon Coleman (WR), DeAndre Hopkins (WR), Marquise Brown (WR), Darius Slayton (WR), David Sills (WR), Greg Dortch (WR), Kayshon Boutte (WR), Noah Fant (TE)

**IR/Reserve (2):** Braelon Allen (RB), Trey Benson (RB)

**Taxi (4):** Ben Sinnott (TE), Roman Wilson (WR), Luke McCaffrey (WR), LaJohntay Wester (WR)

---

### Roster 10 — eldridsm — 30 players

**Starters (10):** Dak Prescott (QB), Cam Ward (QB), James Cook (RB), Jaylen Warren (RB), Tre Tucker (WR), Emeka Egbuka (WR), Courtland Sutton (WR), Jauan Jennings (WR), Zay Flowers (WR), Cade Otton (TE)

**Bench:** Joe Milton (QB), Marcus Mariota (QB), Ray Davis (RB), Raheem Mostert (RB), Kaleb Johnson (RB), Cedric Tillman (WR), Jalen McMillan (WR), Marvin Harrison (WR), Mason Tipton (WR), Dontayvion Wicks (WR), T.J. Hockenson (TE), Colby Parkinson (TE)

**IR/Reserve (3):** MarShawn Lloyd (RB), Calvin Ridley (WR), Jerome Ford (RB)

**Taxi (5):** Brashard Smith (RB), Terrance Ferguson (TE), Gunnar Helm (TE), LeQuint Allen (RB), Jackson Hawes (TE)

---

### Roster 11 — tdtd19844 (THE Shameful Saggy sack) — 29 players

**Starters (10):** Caleb Williams (QB), Brock Purdy (QB), Jonathan Taylor (RB), Tyrone Tracy (RB), RJ Harvey (RB), Brian Thomas (WR), Romeo Doubs (WR), Rashid Shaheed (WR), Dallas Goedert (TE), Trey McBride (TE)

**Bench:** Tua Tagovailoa (QB), Jayden Reed (WR), Andrei Iosivas (WR), Tyrell Shavers (WR), Emanuel Wilson (RB), David Montgomery (RB), Nick Chubb (RB), Tyler Allgeier (RB), Sean Tucker (RB), DK Metcalf (WR), Kendrick Bourne (WR), Adam Thielen (WR)

**IR/Reserve (2):** Rashee Rice (WR), Carson Wentz (QB)

**Taxi (5):** Isaiah Davis (RB), Kameron Johnson (WR), DJ Giddens (RB), Tre' Harris (WR), Tyler Badie (RB)

---

### Roster 12 — Tubes94 (Whale Tails) — 27 players

**Starters (10):** Trevor Lawrence (QB), Matthew Stafford (QB), Breece Hall (RB), Bijan Robinson (RB), Mike Evans (WR), Ladd McConkey (WR), Jakobi Meyers (WR), Alec Pierce (WR), Puka Nacua (WR), Kyle Pitts (TE)

**Bench:** Jordan Love (QB), Chuba Hubbard (RB), Tank Bigsby (RB), Bhayshul Tuten (RB), Dalton Kincaid (TE), Taysom Hill (TE), Chig Okonkwo (TE), Darnell Mooney (WR), Joshua Palmer (WR), Khalil Shakir (WR), Marvin Mims (WR), Isaiah Bond (WR)

**IR/Reserve (1):** Tory Horton (WR)

**Taxi (4):** Malachi Corley (WR), Pat Bryant (WR), Ollie Gordon (RB), Jimmy Horn (WR)

---

## What Was Confirmed

- All 12 rosters exist and were returned by the API.
- All 12 users were successfully mapped to roster IDs.
- 12 of 13 expected key player assignments were confirmed exactly as specified.
- Tubes94 confirmed with all four expected players: Bijan Robinson, Trevor Lawrence, Puka Nacua, and Breece Hall — all active starters.
- Cogdeill11 confirmed with both Omarion Hampton and Colston Loveland as active starters.
- JuicyBussy confirmed with both Matthew Golden (bench) and Harold Fannin Jr. (starter).
- eldridm20 confirmed with Luther Burden III on roster (bench).
- rbr confirmed with both Elic Ayomanor (starter) and Quinshon Judkins (bench).
- MLSchools12 confirmed with Lamar Jackson as an active starter.

## What Could Not Be Verified

- No player data was unavailable — the full players endpoint resolved all IDs successfully.
- Two owners (Bimfle and eldridsm) have not set team names in their league metadata.

## Discrepancies Found

**Josh Allen (QB, BUF) — Expected: MLSchools12 — Actual: eldridm20**

Josh Allen (Sleeper ID: 4984) is on Roster 7 (eldridm20 / Franks Little Beauties), where he is an active starting QB alongside Baker Mayfield. He is not present anywhere on MLSchools12's roster (Roster 5). MLSchools12 does own Lamar Jackson as their QB1, which was confirmed. The assignment of Josh Allen to MLSchools12 in the expected data appears to be incorrect. This may reflect a past roster state, a trade that occurred, or a documentation error.

---

*Validation performed against live Sleeper API data as of 2026-03-15.*
