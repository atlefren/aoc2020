const readFile = require("../readFile");

const parseLine = (line) => {
  const [instruction, value] = line.split(" ");
  return { instruction, value: parseInt(value, 10) };
};

const read = (filename) => readFile(filename, parseLine);

const flip = (i) => (i === "jmp" ? "nop" : "jmp");

const replace = (program, idx) =>
  program.map((p, i) =>
    i === idx ? { instruction: flip(p.instruction), value: p.value } : p
  );

const execute = (program) => {
  let acc = 0;
  let idx = 0;

  const used = [];

  while (true) {
    const op = program[idx];

    if (used.includes(idx)) {
      return { completed: false, acc };
    }
    if (!op) {
      return { completed: true, acc };
    }
    used.push(idx);

    if (op.instruction === "acc") {
      acc += op.value;
      idx += 1;
    }
    if (op.instruction === "nop") {
      idx += 1;
    }
    if (op.instruction === "jmp") {
      idx += op.value;
    }
  }
};

const task1 = (program) => execute(program).acc;

const task2 = (program) =>
  program
    .map((op, i) =>
      op.instruction === "jmp" || op.instruction === "nop" ? i : null
    )
    .filter((x) => x !== null)
    .map((j) => execute(replace(program, j)))
    .find((r) => r.completed).acc;

const main = async () => {
  const testinput = await read("testinput.txt");
  const input = await read("input.txt");

  console.log(task1(testinput) === 5);
  console.log(task1(input) === 1600);

  console.log(task2(testinput) === 8);
  console.log(task2(input) === 1543);
};

main();
