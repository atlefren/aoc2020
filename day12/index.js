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

const toRange = (i) => {
  const min = 0;
  const max = 3;
  //console.log(i);
  if (i < min) {
    return i + max + 1;
  }
  if (i > max) {
    //console.log("!!", i, max, (i % max) - 1, i - (max + 1));
    return i % (max + 1);
  }
  return i;
};

const getNext = (heading, delta) => {
  return DIRECTIONS[toRange(DIRECTIONS.indexOf(heading) + delta)];
};

const turn = (heading, dir) =>
  getNext(heading, getDelta(dir.direction) * getSteps(dir.units));

const getHeading = (heading, direction) =>
  DIRECTIONS.includes(direction) ? direction : heading;

const updateHeading = (heading, dir) => {
  return turn(heading, dir);
};

const run = (directions, heading, pos) => {
  const dir = directions[0];

  const nHeading = ["L", "R"].includes(dir.direction)
    ? updateHeading(heading, dir)
    : heading;

  const nPos = ["F", ...DIRECTIONS].includes(dir.direction)
    ? updatePos(pos, getHeading(heading, dir.direction), dir.units)
    : pos;

  //console.log(heading, dir, nPos);
  return directions.length > 1
    ? run(directions.slice(1), nHeading, nPos)
    : nPos;
};

const manhattanDist = (pos) => Math.abs(pos[0]) + Math.abs(pos[1]);

const task1 = (input) => {
  return manhattanDist(run(input.map(parseIns), "E", [0, 0]));
};

const moveToWaypoint = (pos, wp, times) => {
  return [pos[0] + wp[0] * times, pos[1] + wp[1] * times];
};

const toRad = (d) => d * (Math.PI / 180);
const rotate2 = (p, a) => {
  const x = Math.cos(toRad(a)) * p[0] - Math.sin(toRad(a)) * p[1];
  const y = Math.sin(toRad(a)) * p[0] + Math.cos(toRad(a)) * p[1];
  return [Math.round(x), Math.round(y)];
};

const run2 = (directions, pos, wp) => {
  const dir = directions[0];
  //console.log("pos", pos);
  //console.log("wp ", wp);

  if (!dir) {
    return pos;
  }

  if (dir.direction === "F") {
    //console.log("forward", dir);
    const newPos = moveToWaypoint(pos, wp, dir.units);
    return run2(directions.slice(1), newPos, wp);
  }
  if (DIRECTIONS.includes(dir.direction)) {
    //  console.log("Move wp", dir);
    const newWp = updatePos(wp, dir.direction, dir.units);
    //const [newPos, newWp] = moveToWaypoint(pos, wp, dir.units);
    return run2(directions.slice(1), pos, newWp);
  }
  if (["L", "R"].includes(dir.direction)) {
    //    console.log("rotate", dir);

    const angle = dir.units * (dir.direction === "R" ? 1 : -1);
    const r = rotate2(wp, angle);

    return run2(directions.slice(1), pos, r);

    //const [newPos, newWp] = moveToWaypoint(pos, wp, dir.units);
    //return run2(directions.slice(1), pos, newWp);
  }

  console.log(dir);

  /*
  const nHeading = ["L", "R"].includes(dir.direction)
    ? updateHeading(heading, dir)
    : heading;

  const nPos = ["F", ...DIRECTIONS].includes(dir.direction)
    ? updatePos(pos, getHeading(heading, dir.direction), dir.units)
    : pos;

  //console.log(heading, dir, nPos);
  return directions.length > 1
    ? run2(directions.slice(1), nHeading, nPos, wp)
    : nPos;
    */
};

const task2 = (input) => {
  return manhattanDist(run2(input.map(parseIns), [0, 0], [1, 10]));
};

const main = async () => {
  const testinput = await readFile("testinput.txt");

  const input = await readFile("input.txt");
  console.log(task1(testinput) == 25);
  console.log(task1(input) === 1838);

  console.log(task2(testinput));
  console.log(task2(input));

  /*
  console.log(toRange(0));
  console.log(toRange(1));
  console.log(toRange(2));
  console.log(toRange(3));
  console.log(toRange(4));
  console.log(toRange(5));
  console.log(toRange(6));
  console.log(toRange(-1));
  console.log(toRange(-2));
  */

  /*
  console.log(turn("W", { direction: "R", units: 90 }) == "N");
  console.log(turn("N", { direction: "R", units: 90 }) == "E");
  console.log(turn("E", { direction: "R", units: 90 }) == "S");
  console.log(turn("S", { direction: "R", units: 90 }) == "W");

  console.log(turn("N", { direction: "L", units: 90 }) == "W");
  console.log(turn("W", { direction: "L", units: 90 }) == "S");
  console.log(turn("S", { direction: "L", units: 90 }) == "E");
  console.log(turn("E", { direction: "L", units: 90 }) == "N");

  console.log(turn("N", { direction: "L", units: 180 }) == "S");
  console.log(turn("N", { direction: "R", units: 180 }) == "S");

  console.log(turn("E", { direction: "L", units: 180 }) == "W");
  console.log(turn("E", { direction: "R", units: 180 }) == "W");

  console.log(turn("S", { direction: "L", units: 180 }) == "N");
  console.log(turn("S", { direction: "R", units: 180 }) == "N");

  console.log(turn("W", { direction: "L", units: 180 }) == "E");
  console.log(turn("W", { direction: "R", units: 180 }) == "E");

  console.log(turn("N", { direction: "R", units: 270 }) == "W");
  console.log(turn("E", { direction: "R", units: 270 }) == "N");
  console.log(turn("S", { direction: "R", units: 270 }) == "E");
  console.log(turn("W", { direction: "R", units: 270 }) == "S");

  console.log(turn("N", { direction: "L", units: 270 }) == "E");
  console.log(turn("E", { direction: "L", units: 270 }) == "S");
  console.log(turn("S", { direction: "L", units: 270 }) == "W");
  console.log(turn("W", { direction: "L", units: 270 }) == "N");
*/
  //console.log(turn("N", { direction: "L", units: 180 }));
  /*
  console.log(turn("N", { direction: "R", units: 90 }));
  console.log(turn("E", { direction: "R", units: 90 }) === "S");
  console.log(turn("E", { direction: "L", units: 90 }) === "N");
  console.log(turn("S", { direction: "L", units: 90 }) === "E");

  console.log(turn("W", { direction: "R", units: 90 }));
  */
};

main();
