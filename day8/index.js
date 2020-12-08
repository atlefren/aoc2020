const readFile = require("../readFile");

const formatLine = (instruction, value) => ({
  instruction,
  value: parseInt(value, 10),
});

const parseLine = (line) => formatLine(...line.split(" "));

const readProgram = (filename) => readFile(filename, parseLine);

const flip = (op) => ({ jmp: "nop", nop: "jmp" }[op]);

const replace = (program, idx) =>
  program.map((p, i) =>
    i === idx ? { ...p, instruction: flip(p.instruction) } : p
  );

const match = (d, val) => d[val]();

const eval = (op, idx, acc) =>
  match(
    {
      acc: () => [idx + 1, acc + op.value],
      nop: () => [idx + 1, acc],
      jmp: () => [idx + op.value, acc],
    },
    op.instruction
  );

const execute = (program, idx = 0, acc = 0, used = []) =>
  used.includes(idx)
    ? { exitCode: 1, acc }
    : idx < 0 || idx >= program.length
    ? { exitCode: 0, acc }
    : execute(program, ...eval(program[idx], idx, acc), [idx, ...used]);

const task1 = (program) => execute(program).acc;

const task2 = (program) =>
  program
    .map((op, i) => (["jmp", "nop"].includes(op.instruction) ? i : null))
    .filter((x) => x !== null)
    .map((idx) => execute(replace(program, idx)))
    .find((res) => res.exitCode === 0).acc;

const main = async () => {
  const testinput = await readProgram("testinput.txt");
  const input = await readProgram("input.txt");

  console.log(task1(testinput) === 5);
  console.log(task1(input) === 1600);

  console.log(task2(testinput) === 8);
  console.log(task2(input) === 1543);
};

main();
