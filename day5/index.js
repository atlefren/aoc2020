const readFile = require("../readFile");

const middle = (min, max) => min + Math.floor((max - min) / 2);

const goUp = (min, max) => middle(min, max) + 1;
const goDown = (min, max) => middle(min, max);

const isUp = (el, up) => el === up;

const traverse = (arr, min, max, up, down) => {
  const first = arr.shift();
  const u = isUp(first, up);
  if (arr.length === 0) {
    return u ? goUp(min, max) : goDown(min, max);
  }
  return u
    ? traverse(arr, goUp(min, max), max, up, down)
    : traverse(arr, min, goDown(min, max), up, down);
};

const getRow = (identifier) =>
  traverse(identifier.split("").slice(0, 7), 0, 127, "B", "F");

const getColumn = (identifier) =>
  traverse(identifier.split("").slice(7, 10), 0, 7, "R", "L");

const getSeat = (identifier) => ({
  row: getRow(identifier),
  column: getColumn(identifier),
});

const getSeatId = (identifier) => getId(getSeat(identifier));

const getId = (seat) => seat.row * 8 + seat.column;

const getSeatIds = (input) => input.map(getSeatId);

const task1 = (input) => Math.max.apply(Math, getSeatIds(input));

const task2 = (input) => {
  const ids = getSeatIds(input).sort();

  //ffs
  for (const [i, id] of ids.entries()) {
    const candidate = id + 1;

    if (i !== 0 && i !== ids.length - 1) {
      if (candidate != ids[i + 1]) {
        return candidate;
      }
    }
  }
};

const main = async () => {
  const testinput1 = await readFile("testinput.txt");
  const input = await readFile("input.txt");

  const res1 = task1(input);
  console.log("task1", res1, res1 === 861);

  const res2 = task2(input);
  console.log("task2", res2, res2 == 633);
};

main();
