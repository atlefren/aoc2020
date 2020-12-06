const readFile = require("../readFile");

const merge = (l1, l2) => [...l1, ...l2];

const sum = (lst) => lst.reduce((s, e) => s + e.length, 0);

const distinct = (lst) => Array.from(new Set(lst));

const flatten = (lst) => lst.reduce((acc, lst) => [...lst, ...acc], []);

const parseGroup = (group) => group.split("\n").map((p) => p.split(""));

const read = (file) => readFile(file, parseGroup, "\n\n");

const includes = (element) => (subLst) => subLst.includes(element);

const allListsIncludes = (lstOfLsts) => (e) => lstOfLsts.every(includes(e));

const overlap = (list, lstOfLsts) => list.filter(allListsIncludes(lstOfLsts));

const common = (lst) => lst.reduce((acc, e) => merge(overlap(e, lst), acc), []);

const isInAll = (lst) => distinct(common(lst));

const isInAny = (lst) => distinct(flatten(lst));

const genericTask = async (filename, f) => sum((await read(filename)).map(f));

const task1 = async (filename) => genericTask(filename, isInAny);

const task2 = async (filename) => genericTask(filename, isInAll);

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
