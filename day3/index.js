const readFile = require("../readFile");

const getPos = (line, x) => line[x % line.length];

const task1 = (input, down, right) => {
  const height = input.length;

  let y = 0;
  let x = 0;
  let numTrees = 0;
  while (y + down < height) {
    y += down;
    x += right;
    numTrees += getPos(input[y], x) === "#" ? 1 : 0;
  }
  return numTrees;
};

const task2 = (input, slopes) =>
  slopes.reduce((acc, slope) => acc * task1(input, slope.d, slope.r), 1);

const main = async () => {
  const testInput = await readFile("testinput.txt");

  const testres1 = task1(testInput, 1, 3);
  console.log("ex1=", testres1, testres1 === 7);

  const input = await readFile("input.txt");
  const res1 = task1(input, 1, 3);
  console.log("t1 =", res1, res1 === 209);

  const slopes = [
    { d: 1, r: 1 },
    { d: 1, r: 3 },
    { d: 1, r: 5 },
    { d: 1, r: 7 },
    { d: 2, r: 1 },
  ];

  const testres2 = task2(testInput, slopes);
  console.log("ex2=", testres2, testres2 === 336);

  const res2 = task2(input, slopes);
  console.log("t2 =", res2, res2 === 1574890240);
};

main();
