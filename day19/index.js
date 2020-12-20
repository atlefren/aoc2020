const readFile = require("../readFile");

const parseStr = (s) => /\"(\w+)\"/.exec(s);

const isSelfReference = (id, refs) => refs.includes(id);

const parseRef = (s, id) => {
  const refs = s
    .trim()
    .split(" ")
    .map((i) => parseInt(i, 10));

  return {
    type: "ref",
    refs: refs.map((r) => ({ ref: r, loop: r === parseInt(id, 10) })),
  };
};

const parse = (r, id) => {
  const res = parseStr(r);
  if (res) {
    return { type: "literal", value: res[1] };
  }
  if (r.includes("|")) {
    return { type: "or", refs: r.split("|").map((r) => parseRef(r, id)) };
  }

  return parseRef(r, id);
};

const parseRule = (r) => {
  const [id, rule] = r.split(":");

  return { id, rule: parse(rule.trim(), id) };
};

const parseRules = (input, replacements) =>
  input
    .split("\n")
    .map((l) => (replacements[l] ? replacements[l] : l))
    .reduce((acc, r) => {
      const p = parseRule(r);
      return { ...acc, [p.id]: p.rule };
    }, {});

const writeRule = (rule, rules) => {
  if (rule.type === "literal") {
    return rule.value;
  }
  if (rule.type === "ref") {
    return rule.refs
      .map((ref) => {
        if (ref.loop) {
          return ref.ref;
        }
        return writeRuleById(rules, ref.ref);
      })
      .join("");
  }
  if (rule.type === "or") {
    return `(${rule.refs
      .map((ref) => {
        return writeRule(ref, rules);
      })
      .join("|")})`;
  }
};

const writeRuleById = (rules, id) => {
  //console.log(JSON.stringify(rules, null, 2));
  const rule = rules[id];
  return writeRule(rule, rules);
};

const toRegex = (rules, id) => new RegExp(`^${writeRuleById(rules, id)}$`);

const vList = (rules, refs, chars) =>
  refs.every((ref, i) => v(rules, ref.ref, chars.slice(i)));

const v = (rules, id, chars) => {
  console.log(chars, id);
  const r = rules[id];
  if (r.type === "literal") {
    if (chars[0] !== r.value) {
      return false;
    }
    return true;
  }
  if (r.type === "ref") {
    return vList(rules, r.refs, chars);
  }
  if (r.type === "or") {
    console.log(r);
    return r.refs.some((ref) => vList(rules, ref.refs, chars));
  }
};

const validate = (rules, id, str) => {
  console.log(rules[id]);
  console.log("!!", v(rules, id, str.split("")));
};

const task = (input, replacements = {}) => {
  const [rulesStr, messagesStr] = input;
  const rules = parseRules(rulesStr, replacements);

  validate(rules, 0, "ababbb");

  //console.log(writeRuleById(rules, 8));

  //return messagesStr.split("\n").filter((m) => validate(rules, 0, m)).length;

  /*
  const rule0 = toRegex(rules, 0);
  //return messagesStr.split("\n").filter((m) => rule0.test(m)).length;
  */
};

const task1 = (input) => task(input);

const task2 = (input) =>
  task(input, { "8: 42": "8: 42 | 42 8", "11: 42 31": "11: 42 31 | 42 11 31" });

const main = async () => {
  const testinput = await readFile("testinput.txt", (l) => l, "\n\n");
  const testinput2 = await readFile("testinput2.txt", (l) => l, "\n\n");
  const input = await readFile("input.txt", (l) => l, "\n\n");

  console.log(task1(testinput) === 2);
  //console.log(task1(input) == 190);

  //console.log(task1(testinput2) === 3);
  //console.log(task2(testinput2));
};

main();
