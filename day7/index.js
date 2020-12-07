const readFile = require("../readFile");

const parseBag = (bag) => {
  const [_, num, color] = /^(\d+) (\w+ \w+) bags?/g.exec(bag.trim());

  return { num: parseInt(num, 10), color };
};

const parseContains = (contains) =>
  contains.trim() === "no other bags." ? [] : contains.split(",").map(parseBag);

const canContain = (bags, color) =>
  bags.filter((b) => b.contains.some((c) => c.color === color));

const parseRule = (rule) => {
  const [container, contains] = rule.split("contain");
  const color = container.replace("bags", "").trim();
  return { color, contains: parseContains(contains) };
};

const distinct = (lst) => Array.from(new Set(lst));

const findColors = (rules, color) => {
  const bags = canContain(rules, color);
  return bags.length === 0
    ? []
    : [
        ...bags,
        ...bags.reduce(
          (acc, bag) => [...acc, ...findColors(rules, bag.color)],
          []
        ),
      ];
};

const task1 = (input, color) =>
  distinct(findColors(input.map(parseRule), color).map((r) => r.color)).length;

const getChildren = (rules, color) => {
  const r = rules.find((r) => r.color === color);
  return r
    ? r.contains.map((c) => ({
        num: c.num,
        color: c.color,
        children: getChildren(rules, c.color),
      }))
    : [];
};

const countChildren = (children) =>
  children.length === 0
    ? 1
    : children.reduce((sum, c) => sum + c.num * countChildren(c.children), 1);

const task2 = (input, color) =>
  countChildren(getChildren(input.map(parseRule), color)) - 1;

const main = async () => {
  const testinput1 = await readFile("testinput.txt");
  const input = await readFile("input.txt");

  console.log(task1(testinput1, "shiny gold") === 4);
  console.log(task1(input, "shiny gold") === 169);

  console.log(task2(testinput1, "shiny gold") === 32);
  console.log(task2(input, "shiny gold") === 82372);
};

main();
