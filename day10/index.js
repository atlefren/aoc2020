const readFile = require("../readFile");

const readInts = (filename) => readFile(filename, (i) => parseInt(i, 10));

const max = (lst) => Math.max(...lst);

const sort = (lst) => lst.sort((a, b) => a - b);

const pairs = (arr) =>
  arr.map((e, i) => (i + 1 < arr.length ? [e, arr[i + 1]] : [e]));

const getNum = (input, val) => input.filter((d) => d === val).length;

const task1 = (inputs) => {
  const target = max(inputs) + 3;

  const diffs = pairs(sort([0, ...inputs, target])).map((p) => p[1] - p[0]);

  return getNum(diffs, 1) * getNum(diffs, 3);
};

const within = (lst, target) => lst.filter((e) => e - target <= 0);

const numPaths3 = (lst, cache = []) => {
  const [a, ...rest] = lst;
  return rest.length === 0
    ? cache
    : numPaths3(rest, [...cache, [a, within(rest, a + 3)]]);
};

const n = (es, cache, target) =>
  es.reduce((acc, e) => {
    return acc + (e === target ? 1 : cache[e]);
  }, 0);

const process = (lst, target, cache = {}) => {
  const [a, ...rest] = lst;
  cache[a[0]] = n(a[1], cache, target);
  return rest.length ? process(rest, target, cache) : cache[a[0]];
};

const task2 = (inputs) => {
  const target = max(inputs) + 3;
  const sorted = [0, ...sort(inputs), target];
  return process(numPaths3(sorted).reverse(), target);
};

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
