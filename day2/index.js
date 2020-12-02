const readFile = require("../readFile");

const parsePolicy = (policy) => {
  const [_, min, max, char] = /(\d*)-(\d*) ([a-z])/g.exec(policy);
  return { min: parseInt(min, 10), max: parseInt(max, 10), char };
};

const validateMinMax = (password, policy) => {
  const count = (password.match(new RegExp(policy.char, "g")) || []).length;

  return count >= policy.min && count <= policy.max;
};

const validatePositions = (password, policy) => {
  const first = password.split("")[policy.min];
  const last = password.split("")[policy.max];

  return (
    [first === policy.char, last === policy.char].filter((a) => a).length === 1
  );
};

const parsePwd = (pwd) => {
  const [policyStr, password] = pwd.split(":");
  const policy = parsePolicy(policyStr);

  return {
    isValid: (validate) => validate(password, policy),
  };
};

const task1 = (input) =>
  input.map(parsePwd).filter((p) => p.isValid(validateMinMax)).length;

const task2 = (input) =>
  input.map(parsePwd).filter((p) => p.isValid(validatePositions)).length;

const main = async () => {
  const testInput = await readFile("testinput.txt");
  const input = await readFile("input.txt");

  const testres1 = task1(testInput);
  console.log(testres1, testres1 === 2);

  const res1 = task1(input);
  console.log(res1, res1 == 620);

  const testres2 = task2(testInput);
  console.log(testres2, testres2 === 1);

  const res2 = task2(input);
  console.log(res2, res2 == 727);
};

main();
