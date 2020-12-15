const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const last = (lst) => lst[lst.length - 1];

const getCache = (numbers) =>
  numbers.slice(0, -1).reduce((acc, n, i) => ({ ...acc, [n]: i + 1 }), {});

//Making this immutable is tempting, but stupid in terms of running time
const addToCache = (cache, n, i) => {
  cache[n] = i;
  return cache;
};

const getNext = (number, i, cache) =>
  cache[number] !== undefined ? i - cache[number] : 0;

const getAcc = (acc, next, i) => ({
  c: next,
  cache: addToCache(acc.cache, acc.last, i),
  last: next,
});

const task1 = (input, turns) =>
  range(input.length, turns).reduce(
    (acc, i) => getAcc(acc, getNext(acc.last, i, acc.cache), i),
    { c: null, cache: getCache(input), last: last(input) }
  ).c;

const main = async () => {
  const testinput = [0, 3, 6];
  const input = [9, 19, 1, 6, 0, 5, 4];

  console.log(task1(testinput, 2020));

  console.log(task1(testinput, 2020) == 436);

  console.log(task1([1, 3, 2], 2020) == 1);
  console.log(task1([2, 1, 3], 2020) == 10);
  console.log(task1([1, 2, 3], 2020) == 27);
  console.log(task1([2, 3, 1], 2020) == 78);
  console.log(task1([3, 2, 1], 2020) == 438);
  console.log(task1([3, 1, 2], 2020) == 1836);

  console.log(task1(input, 2020) == 1522);

  //console.log(task1([0, 3, 6], 30000000) == 175594);

  //approx 6 mins
  console.time("a");
  //console.log(task1(input, 30000000) === 18234);
  console.timeEnd("a");
};

main();
