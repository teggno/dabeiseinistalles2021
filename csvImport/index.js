const fs = require("fs");

const sourceFileName = "datav1.tsv";
const betsPath = "../web/game/bets.json";
const teamsPath = "../web/game/teams.json";
const playersPath = "../web/game/players.json";

const allLines = fs.readFileSync(sourceFileName).toString();
const bets = allLines
  .split("\n")
  .map((l) => l.trim().split("\t"))
  .filter((parts) => parts.length === 12 && parts[0] !== "Namen")
  .map((parts) => parts.map((part) => part.trim()))
  .map(
    ([
      firstName,
      lastName,
      team1,
      team2,
      team3,
      team4,
      player1,
      player2,
      player3,
      player4,
      topScorer,
      champion,
    ]) => ({
      firstName,
      lastName,
      team1,
      team2,
      team3,
      team4,
      champion,
      player1,
      player2,
      player3,
      player4,
      topScorer,
    })
  );

const dataForBetsFile = { bets };
fs.writeFileSync(betsPath, JSON.stringify(dataForBetsFile, null, 2));

const teamsUnique = [
  ...new Set(
    bets.flatMap((b) => [b.team1, b.team2, b.team3, b.team4, b.champion])
  ),
].sort((a, b) => a.localeCompare(b));
const dataForTeamsFile = { teams: teamsUnique.map((name) => ({ name })) };
fs.writeFileSync(teamsPath, JSON.stringify(dataForTeamsFile, null, 2));

const playersUnique = [
  ...new Set(
    bets.flatMap((b) => [
      b.player1,
      b.player2,
      b.player3,
      b.player4,
      b.topScorer,
    ])
  ),
].sort((a, b) => a.localeCompare(b));
const dataForPlayersFile = { players: playersUnique.map((name) => ({ name })) };
fs.writeFileSync(playersPath, JSON.stringify(dataForPlayersFile, null, 2));
