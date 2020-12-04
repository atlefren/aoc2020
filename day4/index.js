const readFile = require("../readFile");

const parseLine = (l) => {
  return l
    .replace(/\n|\r/g, " ")
    .split(" ")
    .reduce((acc, el) => {
      const [key, value] = el.split(":");
      return { [key]: value, ...acc };
    }, {});
};

const readPassports = (file) => readFile(file, parseLine, "\n\n");

const isValid = (requiredFields) => (fields) =>
  requiredFields.every((rf) => {
    var i = fields.includes(rf);
    return i;
  });

const task1 = (input, validate) =>
  input.map((p) => validate(Object.keys(p))).filter((v) => v).length;

const validateInt = (min, max) => (data) => {
  const year = parseInt(data);
  return year >= min && year <= max;
};

const validateHeight = (str) => {
  if (!str) {
    return false;
  }
  if (str.endsWith("cm")) {
    return validateInt(150, 193)(str.replace("cm", ""));
  }
  if (str.endsWith("in")) {
    return validateInt(59, 76)(str.replace("in", ""));
  }
  return false;
};

const validateEnum = (values) => (value) => values.includes(value);

const validatePid = (pid) => pid.length === 9 && /[0-9]{9}/g.exec(pid);

const validateHcl = (hcl) => hcl.length === 7 && /#([0-9]|[a-f]){6}/g.exec(hcl);

const task2 = (input, fields) => {
  const isPresent = isValid(Object.keys(fields));

  return input
    .map(
      (p) =>
        isPresent(Object.keys(p)) &&
        Object.keys(fields).every((k) => fields[k](p[k]))
    )
    .filter((v) => v).length;
};

const main = async () => {
  const fields = {
    byr: validateInt(1920, 2002),
    iyr: validateInt(2010, 2020),
    eyr: validateInt(2020, 2030),
    hgt: validateHeight,
    hcl: validateHcl,
    ecl: validateEnum(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]),
    pid: validatePid,
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
