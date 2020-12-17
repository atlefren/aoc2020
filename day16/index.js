const readFile = require("../readFile");

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const parseTicket = (t) => t.split(",").map((n) => parseInt(n, 10));

const parseRange = (r) => {
  const [min, max] = r.split("-");
  return { min: parseInt(min, 10), max: parseInt(max, 10) };
};

const parseRule = (rule) =>
  rule
    .trim()
    .split("or")
    .map((r) => parseRange(r.trim()));

const isInRange = (value, range) => value >= range.min && value <= range.max;

const fulfillsRule = (value, rule) =>
  rule.some((range) => isInRange(value, range));

const isValid = (value, rules) => rules.some((r) => fulfillsRule(value, r));

const getInvalidValues = (ticket, rules) =>
  ticket.filter((v) => !isValid(v, rules));

const task1 = (input) =>
  input.nearby
    .map((t) => getInvalidValues(t, Object.values(input.rules)))
    .flat()
    .reduce((acc, n) => acc + n, 0);

const isValidTicket = (ticket, rules) =>
  getInvalidValues(ticket, rules).length === 0;

const getPosition = (rule, validTickets, numFields) =>
  range(0, numFields).filter((i) =>
    validTickets.every((t) => fulfillsRule(t[i], rule))
  );

const readTicket = (fields, values) =>
  Object.keys(fields).reduce(
    (acc, k) => ({ ...acc, [k]: values[fields[k]] }),
    {}
  );

const getAnswerTo2 = (ticket, startsWith) =>
  Object.keys(ticket)
    .filter((k) => k.startsWith(startsWith))
    .map((k) => ticket[k])
    .reduce((acc, i) => acc * i, 1);

const r = (vals, val) =>
  vals.length === 1 ? vals : vals.filter((v) => v !== val);

const remove = (positions, val) =>
  Object.keys(positions).reduce(
    (acc, k) => ({ ...acc, [k]: r(positions[k], val) }),
    {}
  );

const finished = (positions) =>
  Object.values(positions).every((p) => p.length === 1);

const buildDict = (positions) =>
  Object.keys(positions).reduce(
    (acc, k) => ({ ...acc, [k]: positions[k][0] }),
    {}
  );

const distribute = (positions) =>
  finished(positions)
    ? buildDict(positions)
    : distribute(
        Object.values(positions)
          .filter((pos) => pos.length === 1)
          .reduce((acc, o) => remove(acc, o[0]), positions)
      );

const getValidTickets = (tickets, rules) =>
  tickets.filter((t) => isValidTicket(t, rules));

const getFieldPositions = (validTickets, numFields, rules) =>
  distribute(
    Object.keys(rules).reduce(
      (acc, k) => ({
        ...acc,
        [k]: getPosition(rules[k], validTickets, numFields),
      }),
      {}
    )
  );

const task2 = (input, startsWith) =>
  getAnswerTo2(
    readTicket(
      getFieldPositions(
        getValidTickets(input.nearby, Object.values(input.rules)),
        input.your.length,
        input.rules
      ),
      input.your
    ),
    startsWith
  );

const readRules = (input) =>
  input
    .split("\n")
    .map((r) => r.split(":"))
    .reduce((acc, r) => ({ ...acc, [r[0]]: parseRule(r[1]) }), {});

const readInput = async (filename) => {
  const d = await readFile(filename, (l) => l, "\n\n");

  const rules = readRules(d[0]);
  const your = parseTicket(d[1].split(":\n")[1]);
  const nearby = d[2]
    .split(":")[1]
    .split("\n")
    .filter((v) => v !== "")
    .map(parseTicket);
  return { rules, your, nearby };
};

const main = async () => {
  const testinput = await readInput("testinput.txt");
  const input = await readInput("input.txt");

  console.log(task1(testinput) === 71);
  console.log(task1(input) === 24021);

  console.log(task2(input, "departure") === 1289178686687);
};

main();
