<script>
	import BarChart from '$lib/BarChart.svelte';
    import { generateGraph, getTeamFromTeamManagers, round, predictScores, loadPlayers } from '$lib/utils/helper';
    export let nflState, rostersData, leagueTeamManagers, playersInfo, leagueData;

    const rosters = rostersData.rosters;
    const manualScores = {
    	1: 100, 
    	2: 90, 
    	3: 80,
    	4: 75,
	5: 70,
	6: 65,
	7: 60,
	8: 55,
	9: 50,
	10: 45,
	11: 40,
	12: 35
    };



    let validGraph = false;

    let graphs = [];

    let seasonOver = false;

    const buildRankings = () => {
        const rosterPowers = [];
        let week = nflState.week;
        if(week == 0) {
            week = 1;
        }
        let max = 0;

        for(const rosterID in rosters) {
            const roster = rosters[rosterID];
            // make sure the roster has players on it
            if(!roster.players) continue;
            // if at least one team has players, create the graph
            validGraph = true;

            const rosterPlayers = [];

            for(const rosterPlayer of roster.players) {
                if(!players[rosterPlayer]) contnue;
                rosterPlayers.push({
                    name: players[rosterPlayer].ln,
                    pos: players[rosterPlayer].pos,
                    wi: players[rosterPlayer].wi
                })
            }

            const rosterPower = {
                rosterID,
                manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
                powerScore: 0,
            }
            const seasonEnd = 18;
            if(week >= seasonEnd) {
                seasonOver = true;
            }
	    if (manualScores[rosterID]) {
    	       rosterPower.powerScore = manualScores[rosterID];
	    } else {
    	      for(let i = week; i < seasonEnd; i++) {
                 rosterPower.powerScore += predictScores(rosterPlayers, i, leagueData);
    	      }
	   }
	   if(rosterPower.powerScore > max) {
    	      max = rosterPower.powerScore;
	   }
            rosterPowers.push(rosterPower);
        }

        for(const rosterPower of rosterPowers) {
            rosterPower.powerScore = round(rosterPower.powerScore/max * 100);
        }

        const powerGraph = {
            stats: rosterPowers,
            x: "Owner",
            y: "Power Ranking",
            stat: "",
            header: "Official Power Rankings",
            field: "powerScore",
            short: "Power Ranking"
        };

        graphs = [
            generateGraph(powerGraph, leagueData.season),
        ]
    }

    let players = playersInfo.players;

    buildRankings();

    const refreshPlayers = async () => {
        const newPlayersInfo = await loadPlayers(null, true);
        players = newPlayersInfo.players;
        buildRankings();
    }

    if(playersInfo.stale) {
        refreshPlayers();
    }

    let curGraph = 0;

</script>

<style>
    .enclosure {
        display: block;
        position: relative;
        width: 100%;
    }
</style>

{#if validGraph && !seasonOver}
    <div class="enclosure">
        <BarChart {graphs} bind:curGraph={curGraph} {leagueTeamManagers} />
    </div>
{/if}
