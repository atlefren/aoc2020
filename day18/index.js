const readFile = require("../readFile");

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const addAtDepth = (arr, depth, e) =>
  depth === 0
    ? [...arr, e]
    : Array.isArray(arr[arr.length - 1])
    ? [...arr.slice(0, -1), addAtDepth(arr[arr.length - 1], depth - 1, e)]
    : [...arr, addAtDepth([], depth - 1, e)];

const getValue = (h) => (h.match(/\d+/) ? parseInt(h) : h);

const getDepthDelta = (h) => (h === "(" ? 1 : h === ")" ? -1 : 0);

const parseLine = (l) => {
  let exp = [];
  let depth = 0;
  let line = l;
  while (line.length) {
    const m = /\d+|\s|\+|\*|\(|\)/.exec(line);
    line = line.substring(m.index + m[0].length);
    const delta = getDepthDelta(m[0]);
    depth += delta;
    if (delta === 0 && m[0].trim() != "") {
      exp = addAtDepth(exp, depth, getValue(m[0]));
    }
  }

  return exp;
};

const op = ([a, operation, b]) =>
  operation === "+" ? evaluate(a) + evaluate(b) : evaluate(a) * evaluate(b);

const evaluate = (e) =>
  Array.isArray(e)
    ? e.length === 1
      ? evaluate(e[0])
      : range(3, e.length, 2).reduce(
          (acc, i) => op([acc, ...e.slice(i, i + 2)]),
          op(e.slice(0, 3))
        )
    : e;

const isOperator = (e) => ["+", "*"].includes(e);

const addElement = (l, e) => [...l, addPrecedence(e)];

const isGroupStart = (acc, e, i, exp) =>
  !isOperator(e) && exp[i + 1] === "+" && acc.group === null;

const isGroupEnd = (acc, e, i, exp) =>
  !isOperator(e) && exp[i + 1] !== "+" && acc.group !== null;

const addPrecedence = (exp) =>
  Array.isArray(exp)
    ? exp.reduce(
        (acc, e, i) =>
          isGroupStart(acc, e, i, exp)
            ? {
                l: acc.l,
                group: [addPrecedence(e)],
              }
            : isGroupEnd(acc, e, i, exp)
            ? {
                l: [...acc.l, addElement(acc.group, e)],
                group: null,
              }
            : acc.group
            ? {
                l: acc.l,
                group: addElement(acc.group, e),
              }
            : {
                l: addElement(acc.l, e),
                group: acc.group,
              },
        { l: [], group: null }
      ).l
    : exp;

const sum = (l) => l.reduce((acc, a) => acc + a, 0);

const solveBasic = (line) => evaluate(parseLine(line));

const solveAdvanced = (line) => evaluate(addPrecedence(parseLine(line)));

const task1 = (input) => sum(input.map(solveBasic));

const task2 = (input) => sum(input.map(solveAdvanced));

const main = async () => {
  const input = await readFile("input.txt");

  console.log(task1(input) === 3159145843816);
  console.log(task2(input) === 55699621957369);
};

main();

/*
console.log(evaluate(parseLine("1 + 2 * 3 + 4 * 5 + 6")) == 71);
console.log(evaluate(parseLine("1 + (2 * 3) + (4 * (5 + 6))")) == 51);
console.log(evaluate(parseLine("2 * 3 + (4 * 5)")) == 26);
console.log(evaluate(parseLine("5 + (8 * 3 + 9 + 3 * 4 * 3)")) == 437);
console.log(
  evaluate(parseLine("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")) == 12240
);
console.log(
  evaluate(parseLine("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")) ===
    13632
);

console.log(evaluate(addPrecedence(parseLine("1 + 2 * 3 + 4 * 5 + 6"))) == 231);
console.log(evaluate(addPrecedence(parseLine("2 * 3 + (4 * 5)"))) == 46);

console.log(
  evaluate(addPrecedence(parseLine("5 + (8 * 3 + 9 + 3 * 4 * 3)"))) == 1445
);

console.log(
  evaluate(
    addPrecedence(parseLine("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"))
  ) == 669060
);
console.log(
  evaluate(
    addPrecedence(parseLine("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"))
  ) == 23340
);
*/
