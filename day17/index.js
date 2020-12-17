const readFile = require("../readFile");

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const getRow = (dim) => [...Array(dim)].map((_) => ".");

const getSlize = (dim) => [...Array(dim)].map((_) => getRow(dim));

const padRow = (row) => [".", ...row, "."];

const padSlize = (slize, dim) => [
  getRow(dim),
  ...slize.map((r) => padRow(r)),
  getRow(dim),
];

const padCube = (cube, dim) => [
  getSlize(dim),
  ...cube.map((s) => padSlize(s, dim)),
  getSlize(dim),
];

const getCube = (dim) => [...Array(dim)].map((_) => getSlize(dim + 2));

const padHCube = (hcube, dim) => [
  getCube(dim),
  ...hcube.map((c) => padCube(c, dim)),
  getCube(dim),
];

const getElement = (hcube, w, z, y, x) =>
  hcube[w] && hcube[w][z] && hcube[w][z][y] && hcube[w][z][y][x]
    ? hcube[w][z][y][x]
    : ".";

const getActiveNeighbours = (hcube, w1, x1, y1, z1) =>
  range(w1 - 1, w1 + 2).reduce(
    (ss, w) =>
      ss +
      range(z1 - 1, z1 + 2).reduce(
        (s, z) =>
          s +
          range(y1 - 1, y1 + 2).reduce(
            (acc, y) =>
              acc +
              range(x1 - 1, x1 + 2).filter(
                (x) =>
                  !(w === w1 && z === z1 && y === y1 && x === x1) &&
                  getElement(hcube, w, z, y, x) === "#"
              ).length,
            0
          ),
        0
      ),
    0
  );

const flipActive = (hcube, w, x, y, z) =>
  [2, 3].includes(getActiveNeighbours(hcube, w, x, y, z)) ? "#" : ".";

const flipInactive = (hcube, w, x, y, z) =>
  [3].includes(getActiveNeighbours(hcube, w, x, y, z)) ? "#" : ".";

const flip = (element, hcube, w, x, y, z) =>
  element === "#"
    ? flipActive(hcube, w, x, y, z)
    : flipInactive(hcube, w, x, y, z);

const cycleRow = (hcube, w, z, y) =>
  hcube[w][z][y].map((element, x) => flip(element, hcube, w, x, y, z));

const cycleSlize = (hcube, w, z) =>
  hcube[w][z].map((_, y) => cycleRow(hcube, w, z, y));

const cycleCubeFromHcube = (hcube, w) =>
  hcube[w].map((_, z) => cycleSlize(hcube, w, z));

const cycleCube = (cube) => cycleCubeFromHcube([cube], 0);

const cycleHCube = (hcube) => hcube.map((_, w) => cycleCubeFromHcube(hcube, w));

const print = (cube, w = 0) =>
  cube
    .map(
      (slice, z) => `z=${z} w=${w}\n${slice.map((r) => r.join("")).join("\n")}`
    )
    .join("\n\n");

const printHcube = (hcube) => hcube.map(print).join("\n\n");

const countActive = (cube) =>
  cube.reduce(
    (a1, s) =>
      a1 +
      s.reduce(
        (a2, r) => a2 + r.reduce((a3, e) => a3 + (e === "#" ? 1 : 0), 0),
        0
      ),
    0
  );

const countActiveHcube = (hcube) =>
  hcube.reduce((a1, c) => a1 + countActive(c), 0);

const cycle = (cube, times, dim, iteration = 0) =>
  iteration >= times
    ? cube
    : cycle(cycleCube(padCube(cube, dim)), times, dim + 2, iteration + 1);

const task1 = (input) => countActive(cycle([input], 6, input.length + 2));

const cycle2 = (hcube, times, dim, iteration = 0) =>
  iteration >= times
    ? hcube
    : cycle2(cycleHCube(padHCube(hcube, dim)), times, dim + 2, iteration + 1);

const task2 = (input) =>
  countActiveHcube(cycle2([[input]], 6, input.length + 2));

const main = async () => {
  const testinput = await readFile("testinput.txt", (l) => l.split(""), "\n");
  const input = await readFile("input.txt", (l) => l.split(""), "\n");

  console.log(task1(testinput) == 112);
  console.log(task1(input) == 242);

  console.log(task2(testinput) == 848);
  console.log(task2(input) === 2292);
};

main();
