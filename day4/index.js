const readFile = require("../readFile");

const parseLine = (l) =>
  l
    .replace(/\n|\r/g, " ")
    .split(" ")
    .reduce((acc, el) => {
      const [key, value] = el.split(":");
      return { [key]: value, ...acc };
    }, {});

const readPassports = (file) => readFile(file, parseLine, "\n\n");

const isValid = (requiredFields) => (fields) =>
  requiredFields.every((rf) => fields.includes(rf));

const task1 = (input, validate) =>
  input.map((p) => validate(Object.keys(p))).filter((v) => v).length;

const isBetween = (int, min, max) => int >= min && int <= max;

const validateInt = (min, max) => (data) =>
  isBetween(parseInt(data, 10), min, max);

const remove = (str, chars) => str.replace(chars, "");

const validateHeight = (str) =>
  str.endsWith("cm")
    ? validateInt(150, 193)(remove(str, "cm"))
    : str.endsWith("in")
    ? validateInt(59, 76)(remove(str, "in"))
    : false;

const validateEnum = (values) => (value) => values.includes(value);

const validateRegex = (regex) => (value) => new RegExp(regex).exec(value);

const validate = (isPresent) => (input, fields) =>
  input
    .map(
      (p) =>
        isPresent(Object.keys(p)) &&
        Object.keys(fields).every((k) => fields[k](p[k]))
    )
    .filter((v) => v).length;

const task2 = (input, fields) =>
  validate(isValid(Object.keys(fields)))(input, fields);

const main = async () => {
  const fields = {
    byr: validateInt(1920, 2002),
    iyr: validateInt(2010, 2020),
    eyr: validateInt(2020, 2030),
    hgt: validateHeight,
    hcl: validateRegex(/^#([0-9]|[a-f]){6}$/g),
    ecl: validateEnum(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]),
    pid: validateRegex(/^[0-9]{9}$/g),
  };

  const validate = isValid(Object.keys(fields));

  const testInput = await readPassports("testinput.txt");
  const input = await readPassports("input.txt");

  const test1Res = task1(testInput, validate);
  console.log(test1Res, test1Res === 2);

  const task1Res = task1(input, validate);
  console.log(task1Res, task1Res === 190);

  const validinput = await readPassports("valid.txt");
  const invalidinput = await readPassports("invalid.txt");

  console.log(validinput.length === task2(validinput, fields));
  console.log(0 === task2(invalidinput, fields));

  const task2Res = task2(input, fields);
  console.log(task2Res, task2Res === 121);
};

main();
