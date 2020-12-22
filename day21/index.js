const readFile = require("../readFile");

const readFood = (line) => {
  const [a, b] = line.replace(")", "").split(" (contains ");
  return { ingredients: a.split(" "), allergens: b.split(", ") };
};

const distinct = (lst) => [...new Set(lst)];

const getCandidates = (allergen, lst) =>
  intersection(
    lst.filter((i) => i.allergens.includes(allergen)).map((i) => i.ingredients)
  );

const intersection = (lists) =>
  lists
    .splice(1)
    .reduce((acc, l) => acc.filter((x) => l.includes(x)), lists[0]);

const difference = (a, b) => a.filter((x) => !b.includes(x));

const countOccurrences = (e, lst) => lst.filter((i) => i === e).length;

const getAllergens = (input) =>
  distinct(input.reduce((acc, f) => [...acc, ...f.allergens], []));

const task1 = (input) => {
  const areAllergens = distinct(
    getAllergens(input).reduce(
      (acc, allergen) => [...acc, ...getCandidates(allergen, input)],
      []
    )
  );

  const allIngredients = input.reduce(
    (acc, f) => [...acc, ...f.ingredients],
    []
  );
  const ingredients = distinct(allIngredients);

  const nonAllergens = ingredients.filter((i) => !areAllergens.includes(i));
  return nonAllergens.reduce(
    (acc, i) => acc + countOccurrences(i, allIngredients),
    0
  );
};

const find = (candidates, decided = []) => {
  if (candidates.length === 0) {
    return decided;
  }

  const d = candidates
    .filter((c) => c.candidates.length === 1)
    .map((c) => ({
      allergen: c.allergen,
      ingredient: c.candidates[0],
    }));

  const found = d.map((e) => e.ingredient);
  if (found.length === 0) {
    decided;
  }

  const newCandidates = candidates
    .filter((c) => c.candidates.length > 1)
    .map((c) => ({
      allergen: c.allergen,
      candidates: difference(c.candidates, found),
    }));

  return find(newCandidates, [...decided, ...d]);
};

const getList = (l) =>
  l
    .sort((a, b) => (a.allergen > b.allergen ? 1 : -1))
    .map((l) => l.ingredient)
    .join(",");

const task2 = (input) => {
  const allergens = getAllergens(input).map((allergen) => ({
    allergen,
    candidates: getCandidates(allergen, input),
  }));

  const res = find(allergens);

  console.log("R", res);
  return getList(res);
};

const main = async () => {
  const testinput = await readFile("testinput.txt", readFood, "\n");

  const input = await readFile("input.txt", readFood, "\n");

  // console.log(task1(testinput) === 5);
  //  console.log(task1(input) === 2170);
  console.log(task2(testinput));
  console.log(task2(input));

  //console.log(difference([1, 2], [2, 3]));
};

main();
