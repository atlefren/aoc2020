const readFile = require("../readFile");

const readInts = (filename) => readFile(filename, (i) => parseInt(i, 10));

const max = (lst) => Math.max(...lst);

const sort = (lst) => lst.sort((a, b) => a - b);

const pairs = (arr) =>
  arr.map((e, i) => (i + 1 < arr.length ? [e, arr[i + 1]] : [e]));

const getNum = (input, val) => input.filter((d) => d === val).length;

const getTarget = (inputs) => max(inputs) + 3;

const getCompleteList = (inputs) => sort([0, ...inputs, getTarget(inputs)]);

const getNums = (diffs) => getNum(diffs, 1) * getNum(diffs, 3);

const getPairDiff = (p) => p[1] - p[0];

const task1 = (inputs) =>
  getNums(pairs(getCompleteList(inputs)).map(getPairDiff));

const within = (lst, target) => lst.filter((e) => e - target <= 0);

const countBranches = (es, cache, target) =>
  es.reduce((acc, e) => acc + (e === target ? 1 : cache[e]), 0);

const updateCache = (cache, branch, target) => ({
  ...cache,
  [branch.num]: countBranches(branch.to, cache, target),
});

const computeNext = (branches, cache, target) =>
  branches.length > 1
    ? traverse(branches.slice(1), target, cache)
    : cache[branches[0].num];

const traverse = (branches, target, cache = {}) =>
  computeNext(branches, updateCache(cache, branches[0], target));

const getBranches = (inputs) =>
  inputs.slice(0, -1).map((num, i) => ({
    num,
    to: within(inputs.slice(i + 1), num + 3),
  }));

const task2 = (inputs) =>
  traverse(getBranches(getCompleteList(inputs)).reverse(), getTarget(inputs));

const main = async () => {
  const testinput1 = await readInts("testinput.txt");
  const testinput2 = await readInts("testinput2.txt");
  const input = await readInts("input.txt");
  console.log(task1(testinput1) === 35);
  console.log(task1(testinput2) === 220);
  console.log(task1(input) === 2244);

  console.log(task2(testinput1) === 8);
  console.log(task2(testinput2) === 19208);
  console.time("a");
  console.log(task2(input) === 3947645370368);
  console.timeEnd("a");
};

main();
