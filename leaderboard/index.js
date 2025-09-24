const fs = require("fs");

const betsPath = "../game/bets.json";
const playersPath = "../game/players.json";
const teamsPath = "../game/teams.json";
const resultsPath = "../game/results.json";

const outputPath = "../web/site/data/leaderboard.json";

const { bets } = JSON.parse(fs.readFileSync(betsPath).toString());
const { players } = JSON.parse(fs.readFileSync(playersPath).toString());
const { teams } = JSON.parse(fs.readFileSync(teamsPath).toString());
const { champion, topScorer } = JSON.parse(
  fs.readFileSync(resultsPath).toString()
);

const configWinnerPoints = 30;
const configDrawPoints = 10;
const configGoalPoints = 10;
const configChampionPoints = 300;
const configTopScorerPoints = 150;

const betsWithPoints = bets
  .map((bet) => {
    return {
      bet,
      points: calculateBetPoints(bet, teams, players, champion, topScorer),
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

function calculateBetPoints(bet, teams, players, champion, topScorer) {
  const betTeams = [bet.team1, bet.team2, bet.team3, bet.team4];
  const betPlayers = [bet.player1, bet.player2, bet.player3, bet.player4];

  const teamsPoints = teams.reduce(
    (points, team) => points + teamPointsForResult(betTeams, team),
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

function teamPointsForResult(betTeams, team) {
  return betTeams.reduce(
    (p, betTeam) =>
      p +
      (betTeam === team.name
        ? team.victories * configWinnerPoints + team.draws * configDrawPoints
        : 0),
    0
  );
}

function playerPointsForPlayer(betPlayers, { name, goals }) {
  return betPlayers.some((p) => p === name) ? goals * configGoalPoints : 0;
}
