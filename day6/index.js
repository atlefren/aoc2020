const readFile = require("../readFile");

const parseGroup = (group) => group.split("\n").map((p) => p.split(""));

const read = (file) => readFile(file, parseGroup, "\n\n");

const distinctInList = (lst) => Array.from(new Set(lst));

const getDistinct = (lst) =>
  distinctInList(lst.reduce((acc, lst) => [...lst, ...acc], []));

const getCommon = (l, a) => l.filter((x) => a.every((ee) => ee.includes(x)));

const getInAll = (lst) =>
  distinctInList(lst.reduce((acc, e) => [...getCommon(e, lst), ...acc], []));

const count = (lst) => lst.reduce((s, e) => s + e.length, 0);

const task1 = async (filename) =>
  count((await read(filename)).map(getDistinct));

const task2 = async (filename) => count((await read(filename)).map(getInAll));

const main = async () => {
  const test1 = await task1("testinput.txt");
  console.log(test1 === 11);
  const res1 = await task1("input.txt");
  console.log(res1, res1 === 6714);

  const test2 = await task2("testinput.txt");
  console.log(test2 === 6);

  const res2 = await task2("input.txt");
  console.log(res2, res2 === 3435);
};

main();
