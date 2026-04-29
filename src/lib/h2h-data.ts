/**
 * BMFFFL H2H Records — AUTO-GENERATED
 * Sources:
 *   ESPN era (2016–2019): bimfle-data/espn-era/h2h-matchups.json (from ESPN API)
 *   Sleeper era (2020–2025): bimfle-data/sleeper.db matchups table
 * Generated: 2026-04-29T20:46:37.749Z
 *
 * DO NOT EDIT BY HAND — run scripts/generate-h2h-data.ts to regenerate.
 *
 * Key format: 'slugA:slugB' where slugA < slugB lexicographically.
 * wins/losses = slugA's record. Use getH2H(slugA, slugB) for direction-aware lookup.
 */

export interface EraRecord {
  wins: number;
  losses: number;
  games: number;
  ptsFor: number;     // total points scored
  ptsAgainst: number; // total points allowed
}

export interface H2HRecord {
  wins: number;           // slugA wins (all-time)
  losses: number;         // slugA losses (all-time)
  games: number;          // total games (all-time)
  avgPtsFor: number;      // slugA avg pts per game
  avgPtsAgainst: number;  // slugB avg pts per game
  espn: EraRecord | null;    // ESPN era 2016-2019
  sleeper: EraRecord | null; // Sleeper era 2020-2025
}

export interface OwnerH2HSummary {
  slug: string;
  displayName: string;
  totalWins: number;
  totalLosses: number;
  totalGames: number;
  winPct: number;
  espnWins: number;
  espnLosses: number;
  sleeperWins: number;
  sleeperLosses: number;
  nemesis: string | null;
  bestVictim: string | null;
  biggestRivalry: string | null;
}

/** All-time H2H records (ESPN 2016-2019 + Sleeper 2020-2025). */
export const H2H_RECORDS: Record<string, H2HRecord> = {
  'juicybussy:tdtd19844': { wins: 9, losses: 8, games: 17, avgPtsFor: 128.8, avgPtsAgainst: 126.6, espn: { wins: 4, losses: 4, games: 8, ptsFor: 926.4, ptsAgainst: 1012.8 }, sleeper: { wins: 5, losses: 4, games: 9, ptsFor: 1263.5, ptsAgainst: 1139.1 } },
  'grandes:mlschools12': { wins: 5, losses: 13, games: 18, avgPtsFor: 127, avgPtsAgainst: 156.9, espn: { wins: 1, losses: 8, games: 9, ptsFor: 1064.2, ptsAgainst: 1359.1 }, sleeper: { wins: 4, losses: 5, games: 9, ptsFor: 1221, ptsAgainst: 1465.3 } },
  'cogdeill11:rbr': { wins: 6, losses: 11, games: 17, avgPtsFor: 129.8, avgPtsAgainst: 139.3, espn: { wins: 2, losses: 5, games: 7, ptsFor: 935.1, ptsAgainst: 1023.1 }, sleeper: { wins: 4, losses: 6, games: 10, ptsFor: 1270.8, ptsAgainst: 1345.8 } },
  'cmaleski:eldridsm': { wins: 8, losses: 6, games: 14, avgPtsFor: 121.8, avgPtsAgainst: 122.5, espn: { wins: 2, losses: 4, games: 6, ptsFor: 635.5, ptsAgainst: 741.7 }, sleeper: { wins: 6, losses: 2, games: 8, ptsFor: 1069.9, ptsAgainst: 973.5 } },
  'eldridm20:miroslav081': { wins: 4, losses: 3, games: 7, avgPtsFor: 125.2, avgPtsAgainst: 108.8, espn: { wins: 4, losses: 3, games: 7, ptsFor: 876.3, ptsAgainst: 761.6 }, sleeper: null },
  'mmoodie12:sexmachineandy': { wins: 3, losses: 3, games: 6, avgPtsFor: 128.1, avgPtsAgainst: 127.7, espn: { wins: 3, losses: 2, games: 5, ptsFor: 645.5, ptsAgainst: 608.2 }, sleeper: { wins: 0, losses: 1, games: 1, ptsFor: 123.1, ptsAgainst: 158.2 } },
  'mlschools12:tdtd19844': { wins: 10, losses: 2, games: 12, avgPtsFor: 154.8, avgPtsAgainst: 124, espn: { wins: 3, losses: 1, games: 4, ptsFor: 583.2, ptsAgainst: 455.4 }, sleeper: { wins: 7, losses: 1, games: 8, ptsFor: 1274.1, ptsAgainst: 1032.1 } },
  'grandes:juicybussy': { wins: 7, losses: 10, games: 17, avgPtsFor: 130.8, avgPtsAgainst: 138.8, espn: { wins: 2, losses: 3, games: 5, ptsFor: 679.3, ptsAgainst: 723.5 }, sleeper: { wins: 5, losses: 7, games: 12, ptsFor: 1544.5, ptsAgainst: 1636.5 } },
  'cmaleski:rbr': { wins: 6, losses: 8, games: 14, avgPtsFor: 131.5, avgPtsAgainst: 136, espn: { wins: 3, losses: 5, games: 8, ptsFor: 965.2, ptsAgainst: 1036.5 }, sleeper: { wins: 3, losses: 3, games: 6, ptsFor: 875.2, ptsAgainst: 868.2 } },
  'cogdeill11:eldridsm': { wins: 7, losses: 7, games: 14, avgPtsFor: 135.2, avgPtsAgainst: 137.9, espn: { wins: 4, losses: 2, games: 6, ptsFor: 827.3, ptsAgainst: 724.7 }, sleeper: { wins: 3, losses: 5, games: 8, ptsFor: 1066, ptsAgainst: 1205.8 } },
  'miroslav081:sexmachineandy': { wins: 4, losses: 2, games: 6, avgPtsFor: 134.2, avgPtsAgainst: 102.2, espn: { wins: 4, losses: 2, games: 6, ptsFor: 804.9, ptsAgainst: 613 }, sleeper: null },
  'eldridm20:mmoodie12': { wins: 3, losses: 5, games: 8, avgPtsFor: 110.5, avgPtsAgainst: 121.7, espn: { wins: 1, losses: 5, games: 6, ptsFor: 667.6, ptsAgainst: 779.8 }, sleeper: { wins: 2, losses: 0, games: 2, ptsFor: 216.7, ptsAgainst: 193.6 } },
  'grandes:tdtd19844': { wins: 9, losses: 3, games: 12, avgPtsFor: 129.6, avgPtsAgainst: 107.4, espn: { wins: 5, losses: 1, games: 6, ptsFor: 720.2, ptsAgainst: 587.6 }, sleeper: { wins: 4, losses: 2, games: 6, ptsFor: 835.1, ptsAgainst: 700.8 } },
  'juicybussy:mlschools12': { wins: 2, losses: 12, games: 14, avgPtsFor: 126.5, avgPtsAgainst: 150.9, espn: { wins: 0, losses: 7, games: 7, ptsFor: 772.7, ptsAgainst: 998.9 }, sleeper: { wins: 2, losses: 5, games: 7, ptsFor: 997.7, ptsAgainst: 1114.2 } },
  'eldridsm:rbr': { wins: 8, losses: 9, games: 17, avgPtsFor: 133, avgPtsAgainst: 132.5, espn: { wins: 5, losses: 5, games: 10, ptsFor: 1371.2, ptsAgainst: 1288.7 }, sleeper: { wins: 3, losses: 4, games: 7, ptsFor: 889.2, ptsAgainst: 964.3 } },
  'cmaleski:cogdeill11': { wins: 5, losses: 12, games: 17, avgPtsFor: 119.5, avgPtsAgainst: 134.1, espn: { wins: 2, losses: 3, games: 5, ptsFor: 571.8, ptsAgainst: 686.6 }, sleeper: { wins: 3, losses: 9, games: 12, ptsFor: 1459, ptsAgainst: 1593.4 } },
  'miroslav081:mmoodie12': { wins: 1, losses: 2, games: 3, avgPtsFor: 132.4, avgPtsAgainst: 134.8, espn: { wins: 1, losses: 2, games: 3, ptsFor: 397.2, ptsAgainst: 404.4 }, sleeper: null },
  'eldridm20:sexmachineandy': { wins: 6, losses: 6, games: 12, avgPtsFor: 124.9, avgPtsAgainst: 122.7, espn: { wins: 2, losses: 3, games: 5, ptsFor: 533.9, ptsAgainst: 541.6 }, sleeper: { wins: 4, losses: 3, games: 7, ptsFor: 964.6, ptsAgainst: 930.2 } },
  'miroslav081:rbr': { wins: 1, losses: 2, games: 3, avgPtsFor: 125.7, avgPtsAgainst: 126.6, espn: { wins: 1, losses: 2, games: 3, ptsFor: 377.2, ptsAgainst: 379.8 }, sleeper: null },
  'cogdeill11:eldridm20': { wins: 10, losses: 6, games: 16, avgPtsFor: 132.7, avgPtsAgainst: 128.8, espn: { wins: 7, losses: 2, games: 9, ptsFor: 1209.3, ptsAgainst: 1128.9 }, sleeper: { wins: 3, losses: 4, games: 7, ptsFor: 913.1, ptsAgainst: 931.4 } },
  'cmaleski:sexmachineandy': { wins: 9, losses: 6, games: 15, avgPtsFor: 126.5, avgPtsAgainst: 128.5, espn: { wins: 4, losses: 3, games: 7, ptsFor: 803.9, ptsAgainst: 836.4 }, sleeper: { wins: 5, losses: 3, games: 8, ptsFor: 1094.3, ptsAgainst: 1091 } },
  'eldridsm:mmoodie12': { wins: 6, losses: 3, games: 9, avgPtsFor: 126, avgPtsAgainst: 113.3, espn: { wins: 5, losses: 3, games: 8, ptsFor: 1013.3, ptsAgainst: 913.2 }, sleeper: { wins: 1, losses: 0, games: 1, ptsFor: 120.2, ptsAgainst: 106.4 } },
  'cogdeill11:miroslav081': { wins: 3, losses: 4, games: 7, avgPtsFor: 128.3, avgPtsAgainst: 126.2, espn: { wins: 3, losses: 4, games: 7, ptsFor: 898.3, ptsAgainst: 883.5 }, sleeper: null },
  'cmaleski:eldridm20': { wins: 3, losses: 9, games: 12, avgPtsFor: 106.6, avgPtsAgainst: 132, espn: { wins: 1, losses: 3, games: 4, ptsFor: 353.9, ptsAgainst: 503.1 }, sleeper: { wins: 2, losses: 6, games: 8, ptsFor: 924.7, ptsAgainst: 1080.3 } },
  'eldridsm:sexmachineandy': { wins: 6, losses: 5, games: 11, avgPtsFor: 128.6, avgPtsAgainst: 118.8, espn: { wins: 3, losses: 2, games: 5, ptsFor: 643, ptsAgainst: 555.2 }, sleeper: { wins: 3, losses: 3, games: 6, ptsFor: 771.2, ptsAgainst: 751.6 } },
  'mmoodie12:rbr': { wins: 6, losses: 3, games: 9, avgPtsFor: 127.4, avgPtsAgainst: 128.3, espn: { wins: 4, losses: 3, games: 7, ptsFor: 876.6, ptsAgainst: 916 }, sleeper: { wins: 2, losses: 0, games: 2, ptsFor: 270.2, ptsAgainst: 238.8 } },
  'cmaleski:miroslav081': { wins: 3, losses: 7, games: 10, avgPtsFor: 115.1, avgPtsAgainst: 137.5, espn: { wins: 3, losses: 7, games: 10, ptsFor: 1151.4, ptsAgainst: 1375.1 }, sleeper: null },
  'eldridm20:eldridsm': { wins: 6, losses: 11, games: 17, avgPtsFor: 125.1, avgPtsAgainst: 136.6, espn: { wins: 0, losses: 3, games: 3, ptsFor: 361.9, ptsAgainst: 414 }, sleeper: { wins: 6, losses: 8, games: 14, ptsFor: 1764.3, ptsAgainst: 1908.3 } },
  'rbr:sexmachineandy': { wins: 8, losses: 8, games: 16, avgPtsFor: 135.3, avgPtsAgainst: 132.5, espn: { wins: 4, losses: 0, games: 4, ptsFor: 543.9, ptsAgainst: 417.9 }, sleeper: { wins: 4, losses: 8, games: 12, ptsFor: 1621, ptsAgainst: 1702.7 } },
  'cogdeill11:mmoodie12': { wins: 4, losses: 3, games: 7, avgPtsFor: 140.8, avgPtsAgainst: 127.3, espn: { wins: 3, losses: 3, games: 6, ptsFor: 821.7, ptsAgainst: 790.1 }, sleeper: { wins: 1, losses: 0, games: 1, ptsFor: 164, ptsAgainst: 100.8 } },
  'eldridsm:miroslav081': { wins: 5, losses: 2, games: 7, avgPtsFor: 141.3, avgPtsAgainst: 126.1, espn: { wins: 5, losses: 2, games: 7, ptsFor: 989.3, ptsAgainst: 882.8 }, sleeper: null },
  'eldridm20:rbr': { wins: 3, losses: 9, games: 12, avgPtsFor: 134.1, avgPtsAgainst: 145.8, espn: { wins: 2, losses: 2, games: 4, ptsFor: 531.1, ptsAgainst: 599.1 }, sleeper: { wins: 1, losses: 7, games: 8, ptsFor: 1078.1, ptsAgainst: 1151 } },
  'cogdeill11:sexmachineandy': { wins: 7, losses: 6, games: 13, avgPtsFor: 124.6, avgPtsAgainst: 123.2, espn: { wins: 4, losses: 1, games: 5, ptsFor: 703.8, ptsAgainst: 546.6 }, sleeper: { wins: 3, losses: 5, games: 8, ptsFor: 915.4, ptsAgainst: 1055.4 } },
  'cmaleski:mmoodie12': { wins: 6, losses: 1, games: 7, avgPtsFor: 131.1, avgPtsAgainst: 112, espn: { wins: 4, losses: 1, games: 5, ptsFor: 662.8, ptsAgainst: 585.8 }, sleeper: { wins: 2, losses: 0, games: 2, ptsFor: 254.6, ptsAgainst: 198.2 } },
  'miroslav081:tdtd19844': { wins: 4, losses: 0, games: 4, avgPtsFor: 147.9, avgPtsAgainst: 88.8, espn: { wins: 4, losses: 0, games: 4, ptsFor: 591.5, ptsAgainst: 355.4 }, sleeper: null },
  'eldridm20:juicybussy': { wins: 5, losses: 10, games: 15, avgPtsFor: 114.7, avgPtsAgainst: 133.6, espn: { wins: 3, losses: 5, games: 8, ptsFor: 819.7, ptsAgainst: 911.6 }, sleeper: { wins: 2, losses: 5, games: 7, ptsFor: 900.9, ptsAgainst: 1092.1 } },
  'mlschools12:sexmachineandy': { wins: 10, losses: 2, games: 12, avgPtsFor: 155.8, avgPtsAgainst: 122.7, espn: { wins: 3, losses: 1, games: 4, ptsFor: 562.2, ptsAgainst: 445 }, sleeper: { wins: 7, losses: 1, games: 8, ptsFor: 1306.9, ptsAgainst: 1027.4 } },
  'grandes:mmoodie12': { wins: 6, losses: 1, games: 7, avgPtsFor: 133.8, avgPtsAgainst: 115.4, espn: { wins: 5, losses: 1, games: 6, ptsFor: 797.6, ptsAgainst: 732.4 }, sleeper: { wins: 1, losses: 0, games: 1, ptsFor: 139, ptsAgainst: 75.3 } },
  'juicybussy:miroslav081': { wins: 1, losses: 4, games: 5, avgPtsFor: 132, avgPtsAgainst: 133, espn: { wins: 1, losses: 4, games: 5, ptsFor: 660, ptsAgainst: 665.1 }, sleeper: null },
  'eldridm20:mlschools12': { wins: 2, losses: 12, games: 14, avgPtsFor: 123.5, avgPtsAgainst: 154.2, espn: { wins: 0, losses: 6, games: 6, ptsFor: 695.8, ptsAgainst: 945.3 }, sleeper: { wins: 2, losses: 6, games: 8, ptsFor: 1032.6, ptsAgainst: 1213.7 } },
  'grandes:sexmachineandy': { wins: 11, losses: 9, games: 20, avgPtsFor: 133.9, avgPtsAgainst: 132.3, espn: { wins: 6, losses: 1, games: 7, ptsFor: 908.4, ptsAgainst: 790.4 }, sleeper: { wins: 5, losses: 8, games: 13, ptsFor: 1769.5, ptsAgainst: 1855 } },
  'mmoodie12:tdtd19844': { wins: 5, losses: 4, games: 9, avgPtsFor: 126.3, avgPtsAgainst: 106.4, espn: { wins: 4, losses: 4, games: 8, ptsFor: 982.7, ptsAgainst: 855.3 }, sleeper: { wins: 1, losses: 0, games: 1, ptsFor: 153.6, ptsAgainst: 102.1 } },
  'miroslav081:mlschools12': { wins: 2, losses: 4, games: 6, avgPtsFor: 132.7, avgPtsAgainst: 139.7, espn: { wins: 2, losses: 4, games: 6, ptsFor: 796.4, ptsAgainst: 838.3 }, sleeper: null },
  'eldridm20:grandes': { wins: 7, losses: 8, games: 15, avgPtsFor: 129.9, avgPtsAgainst: 136.5, espn: { wins: 3, losses: 4, games: 7, ptsFor: 860.3, ptsAgainst: 927.1 }, sleeper: { wins: 4, losses: 4, games: 8, ptsFor: 1088.6, ptsAgainst: 1119.9 } },
  'sexmachineandy:tdtd19844': { wins: 9, losses: 5, games: 14, avgPtsFor: 119.1, avgPtsAgainst: 115.2, espn: { wins: 5, losses: 2, games: 7, ptsFor: 790.1, ptsAgainst: 727.9 }, sleeper: { wins: 4, losses: 3, games: 7, ptsFor: 876.8, ptsAgainst: 885.3 } },
  'juicybussy:mmoodie12': { wins: 3, losses: 3, games: 6, avgPtsFor: 130, avgPtsAgainst: 127.7, espn: { wins: 2, losses: 3, games: 5, ptsFor: 624.9, ptsAgainst: 657.8 }, sleeper: { wins: 1, losses: 0, games: 1, ptsFor: 154.9, ptsAgainst: 108.4 } },
  'grandes:miroslav081': { wins: 2, losses: 4, games: 6, avgPtsFor: 132, avgPtsAgainst: 148, espn: { wins: 2, losses: 4, games: 6, ptsFor: 792.1, ptsAgainst: 888 }, sleeper: null },
  'eldridm20:tdtd19844': { wins: 9, losses: 7, games: 16, avgPtsFor: 128.5, avgPtsAgainst: 118.8, espn: { wins: 2, losses: 3, games: 5, ptsFor: 550.8, ptsAgainst: 554.9 }, sleeper: { wins: 7, losses: 4, games: 11, ptsFor: 1504.4, ptsAgainst: 1346.1 } },
  'juicybussy:sexmachineandy': { wins: 11, losses: 10, games: 21, avgPtsFor: 131.6, avgPtsAgainst: 134.5, espn: { wins: 6, losses: 2, games: 8, ptsFor: 913.9, ptsAgainst: 788.3 }, sleeper: { wins: 5, losses: 8, games: 13, ptsFor: 1850.7, ptsAgainst: 2035.2 } },
  'mlschools12:mmoodie12': { wins: 6, losses: 0, games: 6, avgPtsFor: 138.3, avgPtsAgainst: 106.8, espn: { wins: 5, losses: 0, games: 5, ptsFor: 664.3, ptsAgainst: 534.1 }, sleeper: { wins: 1, losses: 0, games: 1, ptsFor: 165.3, ptsAgainst: 106.9 } },
  'rbr:tdtd19844': { wins: 10, losses: 6, games: 16, avgPtsFor: 129.2, avgPtsAgainst: 115.1, espn: { wins: 5, losses: 3, games: 8, ptsFor: 982.1, ptsAgainst: 849.8 }, sleeper: { wins: 5, losses: 3, games: 8, ptsFor: 1085.2, ptsAgainst: 991.6 } },
  'cogdeill11:juicybussy': { wins: 6, losses: 6, games: 12, avgPtsFor: 129.8, avgPtsAgainst: 137.7, espn: { wins: 4, losses: 2, games: 6, ptsFor: 732.5, ptsAgainst: 702 }, sleeper: { wins: 2, losses: 4, games: 6, ptsFor: 825.2, ptsAgainst: 950 } },
  'cmaleski:mlschools12': { wins: 2, losses: 15, games: 17, avgPtsFor: 125.3, avgPtsAgainst: 147.9, espn: { wins: 0, losses: 5, games: 5, ptsFor: 563.6, ptsAgainst: 716.8 }, sleeper: { wins: 2, losses: 10, games: 12, ptsFor: 1565.8, ptsAgainst: 1797 } },
  'eldridsm:grandes': { wins: 5, losses: 7, games: 12, avgPtsFor: 129.3, avgPtsAgainst: 143.7, espn: { wins: 3, losses: 2, games: 5, ptsFor: 647.6, ptsAgainst: 596.6 }, sleeper: { wins: 2, losses: 5, games: 7, ptsFor: 904.5, ptsAgainst: 1127.7 } },
  'juicybussy:rbr': { wins: 9, losses: 8, games: 17, avgPtsFor: 138.2, avgPtsAgainst: 141.6, espn: { wins: 2, losses: 3, games: 5, ptsFor: 621.4, ptsAgainst: 748.9 }, sleeper: { wins: 7, losses: 5, games: 12, ptsFor: 1728.8, ptsAgainst: 1658.1 } },
  'cogdeill11:mlschools12': { wins: 4, losses: 14, games: 18, avgPtsFor: 122.3, avgPtsAgainst: 152.2, espn: { wins: 2, losses: 5, games: 7, ptsFor: 921.8, ptsAgainst: 1063.8 }, sleeper: { wins: 2, losses: 9, games: 11, ptsFor: 1279.1, ptsAgainst: 1675.1 } },
  'cmaleski:grandes': { wins: 5, losses: 9, games: 14, avgPtsFor: 119.6, avgPtsAgainst: 136.7, espn: { wins: 2, losses: 4, games: 6, ptsFor: 650, ptsAgainst: 825 }, sleeper: { wins: 3, losses: 5, games: 8, ptsFor: 1024.6, ptsAgainst: 1089 } },
  'eldridsm:tdtd19844': { wins: 10, losses: 9, games: 19, avgPtsFor: 132.8, avgPtsAgainst: 132.1, espn: { wins: 4, losses: 2, games: 6, ptsFor: 739.4, ptsAgainst: 680.3 }, sleeper: { wins: 6, losses: 7, games: 13, ptsFor: 1783.9, ptsAgainst: 1829.8 } },
  'cmaleski:juicybussy': { wins: 7, losses: 5, games: 12, avgPtsFor: 128.4, avgPtsAgainst: 127.2, espn: { wins: 2, losses: 2, games: 4, ptsFor: 459.3, ptsAgainst: 465.6 }, sleeper: { wins: 5, losses: 3, games: 8, ptsFor: 1081.4, ptsAgainst: 1060.9 } },
  'grandes:rbr': { wins: 8, losses: 9, games: 17, avgPtsFor: 138, avgPtsAgainst: 136.6, espn: { wins: 3, losses: 1, games: 4, ptsFor: 542.4, ptsAgainst: 522 }, sleeper: { wins: 5, losses: 8, games: 13, ptsFor: 1803.2, ptsAgainst: 1800.9 } },
  'mlschools12:rbr': { wins: 9, losses: 3, games: 12, avgPtsFor: 161.7, avgPtsAgainst: 143.4, espn: { wins: 3, losses: 1, games: 4, ptsFor: 584.3, ptsAgainst: 594.4 }, sleeper: { wins: 6, losses: 2, games: 8, ptsFor: 1355.7, ptsAgainst: 1126.4 } },
  'cogdeill11:grandes': { wins: 4, losses: 6, games: 10, avgPtsFor: 121.9, avgPtsAgainst: 133.5, espn: { wins: 0, losses: 2, games: 2, ptsFor: 186.7, ptsAgainst: 265.8 }, sleeper: { wins: 4, losses: 4, games: 8, ptsFor: 1032.8, ptsAgainst: 1068.8 } },
  'cogdeill11:tdtd19844': { wins: 8, losses: 3, games: 11, avgPtsFor: 130.2, avgPtsAgainst: 116.8, espn: { wins: 3, losses: 0, games: 3, ptsFor: 447.6, ptsAgainst: 344.1 }, sleeper: { wins: 5, losses: 3, games: 8, ptsFor: 985.1, ptsAgainst: 940.4 } },
  'eldridsm:juicybussy': { wins: 7, losses: 4, games: 11, avgPtsFor: 132.7, avgPtsAgainst: 127, espn: { wins: 3, losses: 0, games: 3, ptsFor: 428.5, ptsAgainst: 318.7 }, sleeper: { wins: 4, losses: 4, games: 8, ptsFor: 1031.5, ptsAgainst: 1078.7 } },
  'cmaleski:tdtd19844': { wins: 4, losses: 6, games: 10, avgPtsFor: 118.9, avgPtsAgainst: 119.5, espn: { wins: 2, losses: 2, games: 4, ptsFor: 458.5, ptsAgainst: 423.4 }, sleeper: { wins: 2, losses: 4, games: 6, ptsFor: 731, ptsAgainst: 771.6 } },
  'eldridsm:mlschools12': { wins: 2, losses: 8, games: 10, avgPtsFor: 129.3, avgPtsAgainst: 166, espn: { wins: 1, losses: 2, games: 3, ptsFor: 463.2, ptsAgainst: 524 }, sleeper: { wins: 1, losses: 6, games: 7, ptsFor: 829.8, ptsAgainst: 1135.9 } },
  'cogdeill11:escuelas': { wins: 8, losses: 5, games: 13, avgPtsFor: 119.9, avgPtsAgainst: 101.9, espn: null, sleeper: { wins: 8, losses: 5, games: 13, ptsFor: 1559.2, ptsAgainst: 1325 } },
  'cogdeill11:tubes94': { wins: 2, losses: 3, games: 5, avgPtsFor: 101.6, avgPtsAgainst: 104.8, espn: null, sleeper: { wins: 2, losses: 3, games: 5, ptsFor: 507.8, ptsAgainst: 523.8 } },
  'escuelas:grandes': { wins: 3, losses: 5, games: 8, avgPtsFor: 91.7, avgPtsAgainst: 121.7, espn: null, sleeper: { wins: 3, losses: 5, games: 8, ptsFor: 733.4, ptsAgainst: 973.8 } },
  'grandes:tubes94': { wins: 3, losses: 2, games: 5, avgPtsFor: 130.7, avgPtsAgainst: 117.5, espn: null, sleeper: { wins: 3, losses: 2, games: 5, ptsFor: 653.6, ptsAgainst: 587.3 } },
  'escuelas:tubes94': { wins: 3, losses: 4, games: 7, avgPtsFor: 104.1, avgPtsAgainst: 112.1, espn: null, sleeper: { wins: 3, losses: 4, games: 7, ptsFor: 728.7, ptsAgainst: 784.9 } },
  'eldridsm:escuelas': { wins: 7, losses: 1, games: 8, avgPtsFor: 142.7, avgPtsAgainst: 94.4, espn: null, sleeper: { wins: 7, losses: 1, games: 8, ptsFor: 1142, ptsAgainst: 755 } },
  'escuelas:mmoodie12': { wins: 0, losses: 2, games: 2, avgPtsFor: 106.9, avgPtsAgainst: 122.4, espn: null, sleeper: { wins: 0, losses: 2, games: 2, ptsFor: 213.8, ptsAgainst: 244.7 } },
  'escuelas:tdtd19844': { wins: 2, losses: 5, games: 7, avgPtsFor: 124.7, avgPtsAgainst: 147.1, espn: null, sleeper: { wins: 2, losses: 5, games: 7, ptsFor: 872.6, ptsAgainst: 1029.4 } },
  'escuelas:mlschools12': { wins: 0, losses: 11, games: 11, avgPtsFor: 108.6, avgPtsAgainst: 161.9, espn: null, sleeper: { wins: 0, losses: 11, games: 11, ptsFor: 1194.9, ptsAgainst: 1780.9 } },
  'mlschools12:tubes94': { wins: 4, losses: 2, games: 6, avgPtsFor: 139.9, avgPtsAgainst: 130.2, espn: null, sleeper: { wins: 4, losses: 2, games: 6, ptsFor: 839.4, ptsAgainst: 781.1 } },
  'escuelas:sexmachineandy': { wins: 1, losses: 6, games: 7, avgPtsFor: 114.9, avgPtsAgainst: 132.3, espn: null, sleeper: { wins: 1, losses: 6, games: 7, ptsFor: 804.1, ptsAgainst: 926 } },
  'sexmachineandy:tubes94': { wins: 4, losses: 2, games: 6, avgPtsFor: 126.3, avgPtsAgainst: 120.9, espn: null, sleeper: { wins: 4, losses: 2, games: 6, ptsFor: 757.9, ptsAgainst: 725.4 } },
  'escuelas:juicybussy': { wins: 2, losses: 6, games: 8, avgPtsFor: 115.4, avgPtsAgainst: 135.8, espn: null, sleeper: { wins: 2, losses: 6, games: 8, ptsFor: 923, ptsAgainst: 1086.7 } },
  'juicybussy:tubes94': { wins: 4, losses: 2, games: 6, avgPtsFor: 140.6, avgPtsAgainst: 129, espn: null, sleeper: { wins: 4, losses: 2, games: 6, ptsFor: 843.9, ptsAgainst: 773.8 } },
  'eldridm20:escuelas': { wins: 4, losses: 3, games: 7, avgPtsFor: 145.7, avgPtsAgainst: 111.8, espn: null, sleeper: { wins: 4, losses: 3, games: 7, ptsFor: 1019.8, ptsAgainst: 782.4 } },
  'eldridm20:tubes94': { wins: 6, losses: 4, games: 10, avgPtsFor: 122.5, avgPtsAgainst: 113.6, espn: null, sleeper: { wins: 6, losses: 4, games: 10, ptsFor: 1225.4, ptsAgainst: 1136.2 } },
  'eldridsm:tubes94': { wins: 5, losses: 5, games: 10, avgPtsFor: 125.6, avgPtsAgainst: 112.5, espn: null, sleeper: { wins: 5, losses: 5, games: 10, ptsFor: 1256.1, ptsAgainst: 1124.8 } },
  'cmaleski:escuelas': { wins: 9, losses: 3, games: 12, avgPtsFor: 131.1, avgPtsAgainst: 101.3, espn: null, sleeper: { wins: 9, losses: 3, games: 12, ptsFor: 1573.5, ptsAgainst: 1215.2 } },
  'cmaleski:tubes94': { wins: 3, losses: 4, games: 7, avgPtsFor: 125.8, avgPtsAgainst: 130.6, espn: null, sleeper: { wins: 3, losses: 4, games: 7, ptsFor: 880.4, ptsAgainst: 914.3 } },
  'escuelas:rbr': { wins: 1, losses: 7, games: 8, avgPtsFor: 95.7, avgPtsAgainst: 122.2, espn: null, sleeper: { wins: 1, losses: 7, games: 8, ptsFor: 765.4, ptsAgainst: 977.5 } },
  'rbr:tubes94': { wins: 1, losses: 4, games: 5, avgPtsFor: 106.1, avgPtsAgainst: 145.9, espn: null, sleeper: { wins: 1, losses: 4, games: 5, ptsFor: 530.4, ptsAgainst: 729.3 } },
  'tdtd19844:tubes94': { wins: 7, losses: 6, games: 13, avgPtsFor: 119.2, avgPtsAgainst: 121.6, espn: null, sleeper: { wins: 7, losses: 6, games: 13, ptsFor: 1549.3, ptsAgainst: 1580.5 } },
};

/** Per-owner H2H summary stats, sorted by overall H2H win%. */
export const H2H_SUMMARIES: OwnerH2HSummary[] = [
  {
    slug: 'mlschools12', displayName: 'MLSchools12',
    totalWins: 128, totalLosses: 28, totalGames: 156,
    winPct: 0.821, espnWins: 51, espnLosses: 9,
    sleeperWins: 77, sleeperLosses: 19,
    nemesis: 'grandes',
    bestVictim: 'cmaleski',
    biggestRivalry: 'cogdeill11',
  },
  {
    slug: 'miroslav081', displayName: 'Miroslav081',
    totalWins: 36, totalLosses: 28, totalGames: 64,
    winPct: 0.563, espnWins: 36, espnLosses: 28,
    sleeperWins: 0, sleeperLosses: 0,
    nemesis: 'eldridsm',
    bestVictim: 'tdtd19844',
    biggestRivalry: 'cmaleski',
  },
  {
    slug: 'rbr', displayName: 'rbr',
    totalWins: 88, totalLosses: 75, totalGames: 163,
    winPct: 0.54, espnWins: 36, espnLosses: 28,
    sleeperWins: 52, sleeperLosses: 47,
    nemesis: 'mlschools12',
    bestVictim: 'eldridm20',
    biggestRivalry: 'cogdeill11',
  },
  {
    slug: 'eldridsm', displayName: 'eldridsm',
    totalWins: 85, totalLosses: 74, totalGames: 159,
    winPct: 0.535, espnWins: 38, espnLosses: 24,
    sleeperWins: 47, sleeperLosses: 50,
    nemesis: 'rbr',
    bestVictim: 'escuelas',
    biggestRivalry: 'tdtd19844',
  },
  {
    slug: 'grandes', displayName: 'Grandes',
    totalWins: 86, totalLosses: 75, totalGames: 161,
    winPct: 0.534, espnWins: 36, espnLosses: 27,
    sleeperWins: 50, sleeperLosses: 48,
    nemesis: 'mlschools12',
    bestVictim: 'tdtd19844',
    biggestRivalry: 'sexmachineandy',
  },
  {
    slug: 'cogdeill11', displayName: 'Cogdeill11',
    totalWins: 81, totalLosses: 79, totalGames: 160,
    winPct: 0.506, espnWins: 35, espnLosses: 28,
    sleeperWins: 46, sleeperLosses: 51,
    nemesis: 'mlschools12',
    bestVictim: 'cmaleski',
    biggestRivalry: 'mlschools12',
  },
  {
    slug: 'juicybussy', displayName: 'JuicyBussy',
    totalWins: 80, totalLosses: 81, totalGames: 161,
    winPct: 0.497, espnWins: 27, espnLosses: 37,
    sleeperWins: 53, sleeperLosses: 44,
    nemesis: 'mlschools12',
    bestVictim: 'eldridm20',
    biggestRivalry: 'sexmachineandy',
  },
  {
    slug: 'sexmachineandy', displayName: 'SexMachineAndyD',
    totalWins: 76, totalLosses: 83, totalGames: 159,
    winPct: 0.478, espnWins: 22, espnLosses: 41,
    sleeperWins: 54, sleeperLosses: 42,
    nemesis: 'grandes',
    bestVictim: 'escuelas',
    biggestRivalry: 'juicybussy',
  },
  {
    slug: 'tubes94', displayName: 'Tubes94',
    totalWins: 38, totalLosses: 42, totalGames: 80,
    winPct: 0.475, espnWins: 0, espnLosses: 0,
    sleeperWins: 38, sleeperLosses: 42,
    nemesis: 'tdtd19844',
    bestVictim: 'rbr',
    biggestRivalry: 'tdtd19844',
  },
  {
    slug: 'eldridm20', displayName: 'eldridm20',
    totalWins: 70, totalLosses: 91, totalGames: 161,
    winPct: 0.435, espnWins: 22, espnLosses: 42,
    sleeperWins: 48, sleeperLosses: 49,
    nemesis: 'mlschools12',
    bestVictim: 'cmaleski',
    biggestRivalry: 'eldridsm',
  },
  {
    slug: 'cmaleski', displayName: 'Cmaleski',
    totalWins: 70, totalLosses: 91, totalGames: 161,
    winPct: 0.435, espnWins: 25, espnLosses: 39,
    sleeperWins: 45, sleeperLosses: 52,
    nemesis: 'mlschools12',
    bestVictim: 'escuelas',
    biggestRivalry: 'mlschools12',
  },
  {
    slug: 'mmoodie12', displayName: 'MMoodie12',
    totalWins: 34, totalLosses: 45, totalGames: 79,
    winPct: 0.43, espnWins: 29, espnLosses: 35,
    sleeperWins: 5, sleeperLosses: 10,
    nemesis: 'mlschools12',
    bestVictim: 'rbr',
    biggestRivalry: 'rbr',
  },
  {
    slug: 'tdtd19844', displayName: 'tdtd19844',
    totalWins: 65, totalLosses: 95, totalGames: 160,
    winPct: 0.406, espnWins: 22, espnLosses: 41,
    sleeperWins: 43, sleeperLosses: 54,
    nemesis: 'mlschools12',
    bestVictim: 'escuelas',
    biggestRivalry: 'eldridsm',
  },
  {
    slug: 'escuelas', displayName: 'MCSchools',
    totalWins: 24, totalLosses: 74, totalGames: 98,
    winPct: 0.245, espnWins: 0, espnLosses: 0,
    sleeperWins: 24, sleeperLosses: 74,
    nemesis: 'mlschools12',
    bestVictim: 'eldridm20',
    biggestRivalry: 'cogdeill11',
  }
];

/**
 * Get H2H record between two owners (direction-aware).
 * Returns stats from ownerA's perspective. Returns null if no games played.
 */
export function getH2H(slugA: string, slugB: string): H2HRecord | null {
  const flip = slugA >= slugB;
  const [keyA, keyB] = flip ? [slugB, slugA] : [slugA, slugB];
  const entry = H2H_RECORDS[`${keyA}:${keyB}`];
  if (!entry) return null;
  if (!flip) return entry;
  return {
    wins: entry.losses,
    losses: entry.wins,
    games: entry.games,
    avgPtsFor: entry.avgPtsAgainst,
    avgPtsAgainst: entry.avgPtsFor,
    espn: entry.espn ? { wins: entry.espn.losses, losses: entry.espn.wins, games: entry.espn.games, ptsFor: entry.espn.ptsAgainst, ptsAgainst: entry.espn.ptsFor } : null,
    sleeper: entry.sleeper ? { wins: entry.sleeper.losses, losses: entry.sleeper.wins, games: entry.sleeper.games, ptsFor: entry.sleeper.ptsAgainst, ptsAgainst: entry.sleeper.ptsFor } : null,
  };
}

/** All owner slugs in the H2H data. */
export const H2H_OWNER_SLUGS = ["mlschools12","sexmachineandy","cogdeill11","grandes","rbr","eldridsm","juicybussy","tdtd19844","eldridm20","tubes94","cmaleski","mmoodie12","escuelas","miroslav081"] as const;

/** Display name lookup. */
export const H2H_DISPLAY_NAMES: Record<string, string> = {
  "mlschools12": "MLSchools12",
  "sexmachineandy": "SexMachineAndyD",
  "cogdeill11": "Cogdeill11",
  "grandes": "Grandes",
  "rbr": "rbr",
  "eldridsm": "eldridsm",
  "juicybussy": "JuicyBussy",
  "tdtd19844": "tdtd19844",
  "eldridm20": "eldridm20",
  "tubes94": "Tubes94",
  "cmaleski": "Cmaleski",
  "mmoodie12": "MMoodie12",
  "escuelas": "MCSchools",
  "miroslav081": "Miroslav081"
};
