const readFile = require("../readFile");

const DIRECTIONS = ["N", "E", "S", "W"];

const getRegexGroups = (regex, groups) => (str) =>
  regex.exec(str).filter((_, i) => groups.includes(i));

const parseIns = (ins) =>
  getRegexGroups(/([A-Z])(\d*)/, [1, 2])(ins).reduce(
    (acc, e, i) => ({
      ...acc,
      [i === 0 ? "direction" : "units"]: i === 0 ? e : parseInt(e, 10),
    }),
    {}
  );

const getSign = (heading) => (heading === "N" || heading === "E" ? 1 : -1);

const updatePos = (pos, heading, units) => [
  heading == "N" || heading == "S" ? pos[0] + getSign(heading) * units : pos[0],
  heading == "E" || heading == "W" ? pos[1] + getSign(heading) * units : pos[1],
];

const getDelta = (h) => (h === "R" ? 1 : -1);
const getSteps = (deg) => (deg / 360) * 4;

const toRange = (min, max) => (i) =>
  i < min ? i + max + 1 : i > max ? i % (max + 1) : i;

const getNext = (heading, delta) =>
  DIRECTIONS[toRange(0, 3)(DIRECTIONS.indexOf(heading) + delta)];

const updateHeading = (heading, dir) =>
  getNext(heading, getDelta(dir.direction) * getSteps(dir.units));

const getHeading = (heading, direction) =>
  DIRECTIONS.includes(direction) ? direction : heading;

const run = (directions, heading, pos) =>
  directions.length === 0
    ? pos
    : ["L", "R"].includes(directions[0].direction)
    ? run(directions.slice(1), updateHeading(heading, directions[0]), pos)
    : ["F", ...DIRECTIONS].includes(directions[0].direction)
    ? run(
        directions.slice(1),
        heading,
        updatePos(
          pos,
          getHeading(heading, directions[0].direction),
          directions[0].units
        )
      )
    : null;

const manhattanDist = (pos) => Math.abs(pos[0]) + Math.abs(pos[1]);

const task1 = (input) => manhattanDist(run(input.map(parseIns), "E", [0, 0]));

const moveToWaypoint = (pos, wp, times) => [
  pos[0] + wp[0] * times,
  pos[1] + wp[1] * times,
];

const toRad = (d) => d * (Math.PI / 180);

const rotate = (p, a) => [
  Math.round(Math.cos(toRad(a)) * p[0] - Math.sin(toRad(a)) * p[1]),
  Math.round(Math.sin(toRad(a)) * p[0] + Math.cos(toRad(a)) * p[1]),
];

const moveForward = (dir, pos, wp) => [moveToWaypoint(pos, wp, dir.units), wp];

const moveWaypoint = (dir, pos, wp) => [
  pos,
  updatePos(wp, dir.direction, dir.units),
];

const rotateWaypoint = (dir, pos, wp) => [
  pos,
  rotate(wp, dir.units * (dir.direction === "R" ? 1 : -1)),
];

const run2 = (directions, pos, wp) =>
  directions.length === 0
    ? pos
    : run2(
        directions.slice(1),
        ...(directions[0].direction === "F"
          ? moveForward(directions[0], pos, wp)
          : DIRECTIONS.includes(directions[0].direction)
          ? moveWaypoint(directions[0], pos, wp)
          : ["L", "R"].includes(directions[0].direction)
          ? rotateWaypoint(directions[0], pos, wp)
          : [])
      );

const task2 = (input) =>
  manhattanDist(run2(input.map(parseIns), [0, 0], [1, 10]));

const main = async () => {
  const testinput = await readFile("testinput.txt");

  const input = await readFile("input.txt");
  console.log(task1(testinput) == 25);
  console.log(task1(input) === 1838);

  console.log(task2(testinput) === 286);
  console.log(task2(input) === 89936);
};

main();
