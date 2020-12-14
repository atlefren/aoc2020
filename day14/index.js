const { memory } = require("console");
const readFile = require("../readFile");

const toBits = (num) => (num >>> 0).toString(2).padStart(36, "0").split("");

const toInt = (bits) => parseInt(bits.join(""), 2);

const applyMask = (bits, mask) =>
  bits.map((b, i) => (mask[i] !== "X" ? mask[i] : b));

const parseLine = (l) => (l.startsWith("mask") ? parseMask(l) : parseAssign(l));

const parseMask = (l) => l.split(" = ")[1].split("");

const parseAssign = (l) => {
  const [_, addr, value] = /mem\[(\d+)] = (\d+)/.exec(l);
  return { addr: parseInt(addr, 10), value: parseInt(value, 10) };
};

const parseProgram = (lines) => lines.map(parseLine);

const executeLine1 = (acc, line) => {
  if (Array.isArray(line)) {
    return { memory: acc.memory, mask: line };
  }

  return {
    mask: acc.mask,
    memory: {
      ...acc.memory,
      [line.addr]: toInt(applyMask(toBits(line.value), acc.mask)),
    },
  };
};

const execute = (program, executeLine) =>
  program.reduce(executeLine, { mask: null, memory: {} });

const sumMemory = (memory) =>
  Object.values(memory).reduce((acc, v) => acc + v, 0);

const run = (input, executeLine) =>
  sumMemory(execute(parseProgram(input), executeLine).memory);

const task1 = (input) => run(input, executeLine1);

const fluct = (bits, tree = [[]]) => {
  const b = bits[0];
  if (b === undefined) {
    return tree;
  }

  return fluct(
    bits.slice(1),
    b === "X"
      ? tree
          .map((t) => [
            [...t, "0"],
            [...t, "1"],
          ])
          .flat()
      : tree.map((st) => [...st, b])
  );
};

const getAddr = (address, mask) =>
  fluct(
    toBits(address).map(
      (b, i) =>
        mask[i] === "0"
          ? b
          : ["1", "X"].includes(mask[i])
          ? mask[i]
          : undefined,
      []
    )
  ).map(toInt);

const executeLine2 = (acc, line) => {
  if (Array.isArray(line)) {
    return { memory: acc.memory, mask: line };
  }

  const addresses = getAddr(line.addr, acc.mask);

  //meh
  addresses.forEach((addr) => {
    acc.memory[addr] = line.value;
  });

  return acc;
};

const task2 = (input) => run(input, executeLine2);

const main = async () => {
  const testinput = await readFile("testinput.txt");
  const testinput2 = await readFile("testinput2.txt");
  const input = await readFile("input.txt");
  console.log(task1(testinput) === 165);
  console.log(task1(input) === 10717676595607);

  console.log(task2(testinput2) === 208);
  console.log(task2(input) === 3974538275659);
};

main();
