const test = require("ava");
const sut = require(".");

test("Zero points if all wrong", (t) => {
  const bet = {
    team1: "a",
    team2: "b",
    team3: "c",
    team4: "d",
    player1: "1",
    player2: "2",
    player3: "3",
    player4: "4",
    champion: "b",
    topScorer: "3",
  };
  const results = [{ team1: "x", team2: "y", result: "x" }];
  const players = [
    { name: "sdf", goals: 15 },
    { name: "xyz", goals: 0 },
  ];
  const actual = sut.calculateBetPoints(bet, results, players, "hans", "fritz");
  t.is(actual.totalPoints, 0);
});

test("Test2", (t) => {
  const bet = {
    team1: "a",
    team2: "b",
    team3: "c",
    team4: "d",
    player1: "1",
    player2: "2",
    player3: "3",
    player4: "4",
    champion: "b",
    topScorer: "3",
  };
  const teams = [
    { name: "a", victories: 1, draws: 0 },
    { name: "y", victories: 1, draws: 1 },
    { name: "m", victories: 1, draws: 1 },
  ];
  const players = [
    { name: "1", goals: 4 },
    { name: "2", goals: 0 },
  ];
  const actual = sut.calculateBetPoints(bet, teams, players, "hans", "fritz");
  t.is(
    actual.totalPoints,
    sut.pointsConfigs.configWinnerPoints +
      4 * sut.pointsConfigs.configGoalPoints
  );
});

test("Test3", (t) => {
  const bet = {
    team1: "a",
    team2: "b",
    team3: "c",
    team4: "d",
    player1: "1",
    player2: "2",
    player3: "3",
    player4: "4",
    champion: "b",
    topScorer: "3",
  };
  const teams = [
    { name: "a", victories: 1, draws: 0 },
    { name: "y", victories: 1, draws: 1 },
    { name: "m", victories: 1, draws: 1 },
  ];
  const players = [
    { name: "1", goals: 4 },
    { name: "2", goals: 0 },
  ];
  const actual = sut.calculateBetPoints(bet, teams, players, "b", "3");
  t.is(
    actual.totalPoints,
    sut.pointsConfigs.configWinnerPoints +
      4 * sut.pointsConfigs.configGoalPoints +
      sut.pointsConfigs.configChampionPoints +
      sut.pointsConfigs.configTopScorerPoints
  );
});

test("Test4", (t) => {
  const bet = {
    team1: "a",
    team2: "b",
    team3: "c",
    team4: "d",
    player1: "1",
    player2: "2",
    player3: "3",
    player4: "4",
    champion: "a",
    topScorer: "3",
  };
  const teams = [
    { name: "a", victories: 1, draws: 1 },
    { name: "y", victories: 1, draws: 1 },
    { name: "m", victories: 1, draws: 1 },
    { name: "b", victories: 0, draws: 1 },
    { name: "c", victories: 1, draws: 0 },
  ];
  const players = [
    { name: "1", goals: 4 },
    { name: "2", goals: 0 },
  ];
  const actual = sut.calculateBetPoints(bet, teams, players, "b", "3");
  t.is(
    actual.totalPoints,
    2 * sut.pointsConfigs.configWinnerPoints +
      2 * sut.pointsConfigs.configDrawPoints +
      4 * sut.pointsConfigs.configGoalPoints +
      sut.pointsConfigs.configTopScorerPoints
  );
});

test("calculateRank for 1st when two 1st", (t) => {
  const actual = sut.calculateRank(20, [20, 20, 5, 1, 2, 3, 10]);
  t.is(actual, 1);
});

test("calculateRank for last two 1st", (t) => {
  const actual = sut.calculateRank(1, [20, 20, 5, 1, 2, 3, 10]);
  t.is(actual, 7);
});

test("calculateRank for 3rd", (t) => {
  const actual = sut.calculateRank(5, [20, 5, 1, 2, 3, 10]);
  t.is(actual, 3);
});

test("calculateRank for 5th when duplicate before", (t) => {
  const actual = sut.calculateRank(5, [20, 5, 1, 2, 3, 10, 10, 10]);
  t.is(actual, 5);
});
