const readFile = require("../readFile");
const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const getId = (s) => parseInt(/Tile (\d+):/.exec(s)[1], 10);

const readTile = (t) => ({
  id: getId(t.split("\n")[0]),
  data: t
    .split("\n")
    .slice(1)
    .map((l) => l.split("")),
});

const fliph = (t) => ({ id: t.id, data: t.data.map((l) => [...l].reverse()) });
const flipv = (t) => ({ id: t.id, data: [...t.data].reverse() });

const rotateL = (t) => ({
  id: t.id,
  data: range(0, t.data.length).map((i) =>
    range(0, t.data.length)
      .reverse()
      .map((j) => t.data[j][i])
  ),
});

const rotateR = (t) => ({
  id: t.id,
  data: range(0, t.data.length)
    .reverse()
    .map((i) => range(0, t.data.length).map((j) => t.data[j][i])),
});

const rotate180 = (t) => ({
  id: t.id,
  data: range(0, t.data.length)
    .reverse()
    .map((i) =>
      range(0, t.data.length)
        .reverse()
        .map((j) => t.data[i][j])
    ),
});

const flipRotateL = (t) => rotateL(flipv(t));

const flipRotateR = (t) => rotateR(flipv(t));

const noop = (t) => t;

const print = (t) => `${t.id}\n${t.data.map((l) => l.join("")).join("\n")}\n`;

const ops = [
  noop,
  rotateL,
  rotateR,
  rotate180,
  fliph,
  flipv,
  flipRotateL,
  flipRotateR,
];

const getTop = (t) => t[0].join("");
const getBottom = (t) => t[t.length - 1].join("");

const getRow = (t, i) => t.map((l) => l[i]);
const getLeft = (t) => getRow(t, 0).join("");
const getRight = (t) => getRow(t, t.length - 1).join("");

const getSides = (tile) =>
  [getTop, getBottom, getLeft, getRight].map((f) => f(tile.data));

const distinct = (lst) => [...new Set(lst)];

const getAllSides = (tile) =>
  distinct([...getSides(tile), ...getSides(flipv(tile))]);

const getSides2 = (tile, rotations) =>
  rotations.map((op) => op(tile).data[0].join(""));

const allRotations = [
  noop,
  rotateL,
  rotateR,
  rotate180,
  fliph,
  flipv,
  flipRotateL,
  flipRotateR,
];

const rotations = [noop, rotateL, rotateR, rotate180];

const isCorner = (tile, tiles) => {
  const others = tiles.filter((t) => t.id !== tile.id);

  const sides = getSides2(tile, allRotations);

  const aa = others.reduce(
    (acc, t) => [
      ...acc,
      ...getSides2(t, rotations).filter((s) => sides.includes(s)),
    ],
    []
  );

  if (aa.length == 2) {
    console.log(tile.id, aa);
  }
  return aa.length == 2;

  /*

  //.reduce((acc, t) => [...acc, ...ops.map((o) => o(t))], []);
  

  
  const a = getSides(tile).filter((side) => {
    //  console.log("check ", side);
    const reversed = side.split("").reverse().join("");
    return others.some((t) => {
      const sides = getSides(t);
      return sides.includes(side);
    });
  });

  const b = getSides(tile).filter((side) => {
    //  console.log("check ", side);
    const reversed = side.split("").reverse().join("");
    return others.some((t) => {
      const sides = getSides(t).map((s) => s.split("").reverse().join(""));
      return sides.includes(reversed);
    });
  });

  //console.log(a);

  return a.length + b.length == 2;
*/
  /*
  const a = [leftOf, rightOf, over, under].map((f) => get(tile, others, f));

  const isCorner = a.filter((a) => a.length == 0).length == 2;

  if (isCorner) {
    console.log("---");
    console.log(tile.id);
    console.log(a);
    const isupperLeft = a[0] == 0 && a[1] == 0;
    //console.log(tile.id, isupperLeft);
  }

  return isCorner;
  */
};

const task1 = (tiles) => {
  /*console.log(
    isCorner(
      tiles.find((t) => t.id === 1951),
      tiles
    )
  );*/
  return tiles.filter((t) => isCorner(t, tiles)).map((t) => t.id);
  //  .reduce((acc, id) => acc * id, 1);
};

const main = async () => {
  const testinput = await readFile("testinput.txt", readTile, "\n\n");

  const input = await readFile("input.txt", readTile, "\n\n");

  console.log(task1(testinput));
  //console.log(task1(testinput) === 20899048083289);
  console.log("=====");
  console.log(task1(input));
  //console.log(input.length);
};

main();
