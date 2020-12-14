const { off } = require("process");
const readFile = require("../readFile");

const getNext = (offset, t) => Math.ceil(offset / t) * t;

const task1 = (input) => {
  const [dep, times] = input;
  const earliest = parseInt(dep, 10);
  const t = times
    .split(",")
    .filter((t) => t != "x")
    .map((t) => parseInt(t, 10))
    .map((id) => ({ id, n: getNext(earliest, id) - earliest }))
    .reduce((acc, e) => (e.n < acc.n ? e : acc), { n: 100 });

  return t.id * t.n;
};

const findNewTime = (time, multiplier, offset, id) => {
  while (true) {
    if ((time + offset) % id === 0) {
      return [multiplier * id, time];
    }
    time = time + multiplier;
  }
};

const solve = (schedule, multiplier, time) => {
  if (schedule.length === 0) {
    return time;
  }
  const s = schedule[0];

  return solve(
    schedule.slice(1),
    ...findNewTime(time, multiplier, s.offset, s.id)
  );
};

const getTime = (times) => {
  const schedule = times
    .split(",")
    .map((t, i) => (t == "x" ? null : { id: parseInt(t, 10), offset: i }))
    .filter((x) => x != null);

  return solve(schedule.slice(1), schedule[0].id, 0);
};

const task2 = (input) => getTime(input[1]);

const getDepartures = (time, schedule) =>
  schedule.every((s) => getNext(time, s.id) === time + s.offset);

const main = async () => {
  const testinput = await readFile("testinput.txt");

  const input = await readFile("input.txt");
  console.log(task1(testinput) == 295);
  console.log(task1(input) === 1835);

  console.log(task2(testinput) === 1068781);
  /*
  console.log(getTime("17,x,13,19") === 3417);
  console.log(getTime("67,7,59,61") === 754018);
  console.log(getTime("67,x,7,59,61") === 779210);
  console.log(getTime("67,7,x,59,61") === 1261476);

  console.time("a");
  console.log(getTime("7,13,x,x,59,x,31,19") === 1068781);
  //console.log(getTime("1789,37,47,1889", 1000000000) === 1202161486);
  console.timeEnd("a");

  console.log(task2(input));
*/
};

main();
