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

const isFunction = (f) => !!(f && f.constructor && f.call && f.apply);

const toList = (l) => (Array.isArray(l) ? l : [l]);

const match = (operations, params) => {
  const op = operations.find((o) =>
    isFunction(o[0]) ? o[0](...toList(params)) : o[0] === params
  );

  return isFunction(op[1]) ? op[1]() : op[1];
};

const eval = (op, idx, acc) =>
  match(
    [
      ["acc", [idx + 1, acc + op.value, null]],
      ["nop", [idx + 1, acc, null]],
      ["jmp", [idx + op.value, acc, null]],
      [
        () => true,
        [idx + op.value, acc, `unknown instruction: ${op.instruction}`],
      ],
    ],
    op.instruction
  );

const execute = (program, idx = 0, acc = 0, err = null, used = []) =>
  match([
    [() => err !== null, () => ({ exitCode: 1, acc, message: err })],
    [
      () => used.includes(idx),
      () => ({ exitCode: 1, acc, message: "infinite loop" }),
    ],
    [
      () => idx < 0 || idx >= program.length,
      () => ({ exitCode: 0, acc, message: "completed" }),
    ],
    [
      () => true,
      () => execute(program, ...eval(program[idx], idx, acc), [idx, ...used]),
    ],
  ]);

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

  //test checking for invalid instrauction
  console.log(execute(await readProgram("meh.txt")));
};

main();
