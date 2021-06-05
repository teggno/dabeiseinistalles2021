const fs = require("fs");

const betsPath = "../game/bets.json";
const playersPath = "../game/players.json";
const resultsPath = "../game/results.json";

const outputPath = "../web/site/data/leaderboard.json";

const { bets } = JSON.parse(fs.readFileSync(betsPath).toString());
const { players } = JSON.parse(fs.readFileSync(playersPath).toString());
const { results, champion, topScorer } = JSON.parse(
  fs.readFileSync(resultsPath).toString()
);

const configWinnerPoints = 30;
const configDrawPoints = 10;
const configGoalPoints = 10;
const configChampionPoints = 150;
const configTopScorerPoints = 150;

const betsWithPoints = bets
  .map((bet) => {
    return {
      bet,
      points: calculateBetPoints(bet, results, players, champion, topScorer),
    };
  })
  .sort((a, b) => b.points.totalPoints - a.points.totalPoints);

const allTotalPoints = betsWithPoints.map((b) => b.points.totalPoints);
const leaderboard = betsWithPoints.map((b) => ({
  ...b,
  rank: calculateRank(b.points.totalPoints, allTotalPoints),
}));
fs.writeFileSync(outputPath, JSON.stringify(leaderboard, null, 2));

function calculateRank(totalPoints, allTotalPoints) {
  return allTotalPoints.filter((atp) => atp > totalPoints).length + 1;
}

exports.calculateRank = calculateRank;

function calculateBetPoints(bet, results, players, champion, topScorer) {
  const betTeams = [bet.team1, bet.team2, bet.team3, bet.team4];
  const betPlayers = [bet.player1, bet.player2, bet.player3, bet.player4];

  const teamsPoints = results.reduce(
    (points, result) => points + teamPointsForResult(betTeams, result),
    0
  );
  const playersPoints = players.reduce(
    (points, player) => points + playerPointsForPlayer(betPlayers, player),
    0
  );
  const championPoints = champion === bet.champion ? configChampionPoints : 0;
  const topScorerPoints =
    topScorer === bet.topScorer ? configTopScorerPoints : 0;
  const totalPoints =
    teamsPoints + playersPoints + championPoints + topScorerPoints;

  return {
    teamsPoints,
    playersPoints,
    championPoints,
    topScorerPoints,
    totalPoints,
  };
}

exports.calculateBetPoints = calculateBetPoints;
exports.pointsConfigs = {
  configWinnerPoints,
  configDrawPoints,
  configGoalPoints,
  configChampionPoints,
  configTopScorerPoints,
};

function teamPointsForResult(betTeams, result) {
  return betTeams.reduce((p, team) => {
    if (result.team1 === team && result.result === "1") p += configWinnerPoints;
    if (result.team2 === team && result.result === "2") p += configWinnerPoints;
    if (result.team1 === team && result.result === "X") p += configDrawPoints;
    if (result.team2 === team && result.result === "X") p += configDrawPoints;

    return p;
  }, 0);
}

function playerPointsForPlayer(betPlayers, { name, goals }) {
  return betPlayers.some((p) => p === name) ? goals * configGoalPoints : 0;
}
