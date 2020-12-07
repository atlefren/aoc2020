const readFile = require("../readFile");

const compose = (f1, f2) => (...args) => f2(f1(...args));

const regexBag = (bag) => /^(\d+) (\w+ \w+) bags?/g.exec(bag.trim());

const parseBag = (bag) =>
  compose(regexBag, ([_, num, color]) => ({ num: parseInt(num, 10), color }))(
    bag
  );

const parseContains = (contains) =>
  contains.trim() === "no other bags." ? [] : contains.split(",").map(parseBag);

const split = (rule) => rule.split("contain");

const parseRule = (rule) =>
  compose(split, ([container, contains]) => ({
    color: container.replace("bags", "").trim(),
    contains: parseContains(contains),
  }))(rule);

const canContain = (bags, color) =>
  bags.filter((b) => b.contains.some((c) => c.color === color));

const distinct = (lst) => Array.from(new Set(lst));

const findColors = (rules, color) =>
  compose(canContain, (bags) =>
    bags.length === 0
      ? []
      : [
          ...bags,
          ...bags.reduce(
            (acc, bag) => [...acc, ...findColors(rules, bag.color)],
            []
          ),
        ]
  )(rules, color);

const task1 = (input, color) =>
  distinct(findColors(input.map(parseRule), color).map((r) => r.color)).length;

const getRuleForColor = (rules, color) => rules.find((r) => r.color === color);

const countChildren = (rules, color) =>
  compose(getRuleForColor, (rule) =>
    rule.contains.reduce(
      (sum, c) => sum + c.num * countChildren(rules, c.color),
      1
    )
  )(rules, color);

const task2 = (input, color) => countChildren(input.map(parseRule), color) - 1;

const main = async () => {
  const testinput1 = await readFile("testinput.txt");
  const input = await readFile("input.txt");

  console.log(task1(testinput1, "shiny gold") === 4);
  console.log(task1(input, "shiny gold") === 169);

  console.log(task2(testinput1, "shiny gold") === 32);
  console.log(task2(input, "shiny gold") === 82372);
};

main();
