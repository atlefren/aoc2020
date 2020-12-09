const readFile = require("../readFile");

const isSumOfAny = (num, numbers) =>
  numbers.some((n1) => numbers.some((n2) => n2 !== n1 && n1 + n2 === num));

const task1 = (numbers, len, idx = len) =>
  !isSumOfAny(numbers[idx], numbers.slice(idx - len, idx))
    ? numbers[idx]
    : idx + 2 < numbers.length
    ? task1(numbers, len, idx + 1)
    : null;

const sum = (numbers) => numbers.reduce((acc, n) => acc + n, 0);

const getBelow = (numbers, target) =>
  sum(numbers) > target ? getBelow(numbers.slice(1), target) : numbers;

const sumMinMax = (seq) => Math.min(...seq) + Math.max(...seq);

const task2 = (numbers, target) =>
  sumMinMax(
    numbers.reduce(
      (seq, n) =>
        seq.length > 1 && sum(seq) === target
          ? seq
          : getBelow([...seq, n], target),
      []
    )
  );

const main = async () => {
  const testinput = await readFile("testinput.txt", (i) => parseInt(i, 10));
  const testRes = task1(testinput, 5);
  console.log(testRes === 127);
  console.log(task2(testinput, testRes) === 62);

  const input = await readFile("input.txt", (i) => parseInt(i, 10));
  const task1Res = task1(input, 25);
  console.log(task1Res === 1398413738);
  const task2Res = task2(input, task1Res);
  console.log(task2Res === 169521051);
};

main();
