const readFile = require("../readFile");

const DIRECTIONS = ["N", "E", "S", "W"];

const parseIns = (ins) => {
  const [_, direction, units] = /([A-Z])(\d*)/.exec(ins);
  return { direction, units: parseInt(units, 10) };
};

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

const run = (directions, heading, pos) => {
  const dir = directions[0];
  if (!dir) {
    return pos;
  }

  if (["L", "R"].includes(dir.direction)) {
    return run(directions.slice(1), updateHeading(heading, dir), pos);
  }
  if (["F", ...DIRECTIONS].includes(dir.direction)) {
    return run(
      directions.slice(1),
      heading,
      updatePos(pos, getHeading(heading, dir.direction), dir.units)
    );
  }
};

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

const moveForward = (directions, dir, pos, wp) =>
  run2(directions.slice(1), moveToWaypoint(pos, wp, dir.units), wp);

const moveWaypoint = (directions, dir, pos, wp) =>
  run2(directions.slice(1), pos, updatePos(wp, dir.direction, dir.units));

const rotateWaypoint = (directions, dir, pos, wp) =>
  run2(
    directions.slice(1),
    pos,
    rotate(wp, dir.units * (dir.direction === "R" ? 1 : -1))
  );

const run2 = (directions, pos, wp) => {
  const dir = directions[0];

  if (!dir) {
    return pos;
  }

  if (dir.direction === "F") {
    return moveForward(directions, dir, pos, wp);
  }
  if (DIRECTIONS.includes(dir.direction)) {
    return moveWaypoint(directions, dir, pos, wp);
  }
  if (["L", "R"].includes(dir.direction)) {
    return rotateWaypoint(directions, dir, pos, wp);
  }
};

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
