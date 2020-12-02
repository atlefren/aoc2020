const readFile = require("../readFile");

const part1 = (input, targetSum) => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (input[i] + input[j] == targetSum) {
        return input[i] * input[j];
      }
    }
  }
};

const part2 = (input, targetSum) => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      for (let k = 0; k < input.length; k++) {
        if (input[i] + input[j] + input[k] == targetSum) {
          return input[i] * input[j] * input[k];
        }
      }
    }
  }
};

const main = async () => {
  const testInput = await readFile("testinput.txt", parseFloat);
  const input = await readFile("input.txt", parseFloat);
  const targetSum = 2020;

  const testPart1Res = part1(testInput, targetSum);
  console.log(testPart1Res === 514579);

  console.time("part1");
  const part1Res = part1(input, targetSum);
  console.timeEnd("part1");
  console.log(`Part1: ${part1Res}`);

  console.log(part1Res === 1020099);

  const testPart2Res = part2(testInput, targetSum);
  console.log(testPart2Res === 241861950);

  console.time("part2");
  const part2Res = part2(input, targetSum);
  console.timeEnd("part2");
  console.log(`Part2: ${part2Res}`);

  console.log(part2Res === 49214880);
};

main();
