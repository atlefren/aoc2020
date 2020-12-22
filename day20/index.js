const readFile = require("../readFile");
const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const getId = (s) => parseInt(/Tile (\d+):/.exec(s)[1], 10);

const readTile = (t) => ({
  id: getId(t.split("\n")[0]),
  data: t
    .split("\n")
    .slice(1)
    .map((l) => l.split("")),
});

const getTop = (t) => t[0].join("");
const getBottom = (t) => t[t.length - 1].join("");

const getRow = (t, i) => t.map((l) => l[i]);
const getLeft = (t) => getRow(t, 0).join("");
const getRight = (t) => getRow(t, t.length - 1).join("");

const fliph = (t) => ({ id: t.id, data: t.data.map((l) => [...l].reverse()) });
const flipv = (t) => ({ id: t.id, data: [...t.data].reverse() });

const rotateL = (t) => ({
  id: t.id,
  data: range(0, t.data.length).map((i) =>
    range(0, t.data.length)
      .reverse()
      .map((j) => t.data[j][i])
  ),
});

const rotateR = (t) => ({
  id: t.id,
  data: range(0, t.data.length)
    .reverse()
    .map((i) => range(0, t.data.length).map((j) => t.data[j][i])),
});

const leftOf = (a, b) => getRight(a) === getLeft(b);
const rightOf = (a, b) => leftOf(b, a);

//under(tile.data, o.data)
//dvs, a skal være under b
const under = (a, b) => getTop(a) === getBottom(b);
const over = (a, b) => under(b, a);

const positions = [leftOf, rightOf, under, over];

const rotate180 = (t) => ({
  id: t.id,
  data: range(0, t.data.length)
    .reverse()
    .map((i) =>
      range(0, t.data.length)
        .reverse()
        .map((j) => t.data[i][j])
    ),
});

const noop = (t) => t;

const print = (t) => `${t.id}\n${t.data.map((l) => l.join("")).join("\n")}\n`;

const ops = [noop, rotateL, rotateR, rotate180, fliph, flipv];

const findMatch = (a, b) => {
  const res = [];
  for (let p of positions) {
    for (let o1 of ops) {
      for (let o2 of ops) {
        if (p(o1(a).data, o2(b).data)) {
          //console.log(p.name);
          res.push(p.name);
        }
      }
    }
  }
  return res;
  /*
  ops.reduce((o) => {
    //

    ops.map((o2) => {
      //;
      positions.map((p) => {
        //console.log(p);

        if (p(a.data, b.data)) {
          console.log("!!");
          console.log("a", o);
          console.log("b", o2);
          console.log(p);
        }
      });
    });
  });*/
};

const distinct = (lst) => [...new Set(lst)];

//const isTopLeft =

const find1Match = (tiles) => {
  for (let t1 of tiles) {
    console.log(t1.id);
    let m = [];
    for (let t2 of tiles) {
      if (t1.id !== t2.id) {
        const matches = findMatch(t1, t2);
        m = [...m, ...matches];
        if (matches.length) {
          //console.log(t1.id, t2.id);
          //console.log(matches.length);
        }
      }
    }
    console.log("!!", distinct(m));
  }
};

const tryadd = (grid, items) => {};

const check = (tile, tiles, f) =>
  ops.some((o1) =>
    tiles.some((t) => ops.some((o2) => f(o1(t).data, o2(tile).data)))
  );

const hasLeft = (tile, tiles) => check(tile, tiles, leftOf);
const hasOver = (tile, tiles) => check(tile, tiles, over);

const getCandidates = (tile, other, f) =>
  other
    .reduce(
      (acc, t2) => [
        ...acc,
        ops
          .filter((op) => f(tile.data, op(t2).data))
          .map((op) => ({ tile: t2.id, op: op.name })),
      ],
      []
    )
    .filter((a) => a.length > 0)
    .flat();

const getLeftCandidates = (tile, other) => getCandidates(tile, other, leftOf);
const getRightCandidates = (tile, other) => getCandidates(tile, other, rightOf);
const getOverCandidates = (tile, other) => getCandidates(tile, other, over);
const getUnderCandidates = (tile, other) => getCandidates(tile, other, under);

const isTopLeftCandidate = (idx, input) => {
  const item = input[idx];
  const other = input.filter((_, i) => i !== idx);

  return !!ops.find((o1) => {
    return (
      getLeftCandidates(o1(item), other).length === 0 &&
      getOverCandidates(o1(item), other).length === 0
    );
  });
};

const isTopRightCandidate = (idx, input, without) => {
  const item = input[idx];
  const other = input.filter((_, i) => i !== idx && i !== without);
  if (without.includes(idx)) {
    return false;
  }
  return !!ops.find((o1) => {
    //console.log("!!", item);
    return (
      getRightCandidates(o1(item), other).length === 0 &&
      getOverCandidates(o1(item), other).length === 0
    );
  });
};

const isBottomLeftCandidate = (idx, input, without) => {
  const item = input[idx];
  const other = input.filter((_, i) => i !== idx && i !== without);
  if (without.includes(idx)) {
    return false;
  }
  return !!ops.find((o1) => {
    return (
      getLeftCandidates(o1(item), other).length === 0 &&
      getUnderCandidates(o1(item), other).length === 0
    );
  });
};

const isBottomRightCandidate = (idx, input, without) => {
  const item = input[idx];
  const other = input.filter((_, i) => i !== idx && i !== without);
  if (without.includes(idx)) {
    return false;
  }
  return !!ops.find((o1) => {
    return (
      getRightCandidates(o1(item), other).length === 0 &&
      getUnderCandidates(o1(item), other).length === 0
    );
  });
};

const hasMatch = (id, tiles, f) => {
  const t = tiles.find((t) => t.id === id);
  for (let op of ops) {
    for (let n of tiles) {
      if (n.id !== id) {
        for (let op2 of ops) {
          if (f(op2(n).data, op(t).data)) {
            console.log("!!", n.id, id);
            console.log(op.name, op2.name);
            return true;
          }
        }
      }
    }
  }
  return false;
};

const validate = (board, i, j, tile) => {
  const l = board[j][i - 1];
  const o = board[j - 1] !== undefined ? board[j - 1][i] : undefined;

  //console.log(l, o);

  if (!l && !o) {
    return true;
  }

  if (l && !o) {
    return rightOf(tile.data, l.data);
  }

  if (l && o) {
    return rightOf(tile.data, l.data) && under(tile.data, o.data);
  }
};

const build = (i, j, tiles, board) => {
  console.log(i, j);
  if (tiles.length == 0) {
    return board;
  }
  if (j >= board.length) {
    return board;
  }

  let t;
  let o;
  for (let tile of tiles) {
    for (let op of ops) {
      if (validate(board, i, j, op(tile))) {
        t = tile;
        o = op;
      }
    }
  }

  //const o = ops.find((op) => validate(board, i, j, op(tiles[0])));

  if (t) {
    board[j][i] = o(t);
  } else {
    return false;
  }

  const newTiles = tiles.filter((a) => a.id !== t.id);

  if (i + 1 < board.length) {
    return build(i + 1, j, newTiles, board);
  }
  if (j + 1 < board.length) {
    return build(0, j + 1, newTiles, board);
  }
  return board;
};

const testStart = (tiles, i, op) => {
  const dim = Math.sqrt(tiles.length);
  const others = tiles.filter((_, ii) => ii !== i);
  const b = range(0, dim).map((_) => range(0, dim).map((_) => null));
  b[0][0] = op(tiles[i]);
  return build(1, 0, others, b);
};

const test1 = (tiles) => {
  const a = flipv(tiles.find((t) => t.id === 1951));
  const b = flipv(tiles.find((t) => t.id === 2311));
  const board = [[a, null]];
  console.log("t1", validate(board, 1, 0, b));
};

const test2 = (tiles) => {
  const a = flipv(tiles.find((t) => t.id === 1951));
  const b = flipv(tiles.find((t) => t.id === 2311));
  const c = flipv(tiles.find((t) => t.id === 2729));
  const d = flipv(tiles.find((t) => t.id === 1427));

  console.log(print(c));
  console.log(print(d));
  const board = [
    [a, b],
    [c, null],
  ];
  console.log("t2", validate(board, 1, 1, d));
};

const task1 = (tiles) => {
  test1(tiles);
  test2(tiles);
  /*

  //const tiles = t.filter((tt) => [1951, 2311].includes(tt.id));
  for (let i in range(0, tiles.length)) {
    for (let op of ops) {
      //console.log(i, op.name, testStart(tiles, i, op));
    }
  }

  const a = flipv(tiles.find((t) => t.id === 1951));
  console.log(print(a));

  const b = flipv(tiles.find((t) => t.id === 2311));
  //const b = tiles.find((t) => t.id === 2311);
  console.log(print(b));

  console.log(rightOf(b.data, a.data));

  const board = [[a, null]];
  console.log("!!", validate(board, 1, 0, b));
  */
  /*
  for (let i in range(0, tiles.length)) {
    console.log(tiles[i].id);
    const others = tiles.filter((_, ii) => ii !== i);
    for (let op of ops) {

      console.log(tiles[i].id, op);

      const b = range(0, dim).map((_) => range(0, dim).map((_) => null));
      b[0][0] = op(tiles[i]);
      console.log(build(1, 0, others, b));
    }
  }*/
  //console.log(build(0, 0, tiles, b));
  //const tiles = i.filter((t) => [1951, 2311, 2729, 1427].includes(t.id));
  /*
  console.log(hasMatch(1951, tiles, leftOf));

  console.log(print(rotateR(tiles.find((t) => t.id === 1951))));
  console.log(print(rotateR(tiles.find((t) => t.id === 2729))));

  
  const left = tiles.filter((i) => {
    return !hasMatch(i.id, tiles, leftOf);
  });
  console.log(left.map((t) => t.id));
  */
  /*
  const right = tiles.filter((i) => {
    return !hasMatch(i.id, tiles, rightOf);
  });
  console.log(right.map((t) => t.id));
  */
  /*
  const dim = Math.sqrt(input.length);

  for (let i in range(0, dim)) {
    for (let j in range(0, dim)) {
      console.log(i, j);
    }
  }
  */
};

const task1_meh = (input) => {
  const c = range(0, input.length)
    .filter((i) => isTopLeftCandidate(i, input))
    .map((tl) =>
      range(0, input.length)
        .filter((tr) => isTopRightCandidate(tr, input, [tl]))
        .map((tr) => ({ tl, tr }))
    )
    .flat()
    .map((c) => {
      console.log(c);
      return range(0, input.length)
        .filter((bl) => isBottomLeftCandidate(bl, input, [c.tl, c.tr]))
        .map((bl) => ({ ...c, bl }));
    })
    .flat()
    .map((c) => {
      console.log(c);
      return range(0, input.length)
        .filter((br) => isBottomRightCandidate(br, input, [c.tl, c.tr, c.bl]))
        .map((br) => ({ ...c, br }));
    })
    .flat();

  console.log(c);
  /*
  const trCandidates = tlCandidates.reduce(
    (acc, wo) => ({
      ...acc,
      [wo]: range(0, input.length).filter((i) =>
        isTopRightCandidate(i, input, wo)
      ),
    }),
    {}
  );*/
  /*
  const trCandidates = range(0, input.length).reduce((acc, i) => {
    console.log(i);
    tlCandidates.reduce((acc2, wo) => {
      console.log("without ", wo);
      console.log(isTopRightCandidate(i, input, wo));
    }, []);
  }, []);
  */
  //console.log(tlCandidates);
  //console.log(trCandidates);

  //console.log(input);

  /*
  const l = flipv(input.find((i) => i.id === 1951));
  const r = fliph(rotate180(input.find((i) => i.id === 2311)));
  */
  //console.log(print(l));

  //const l = input.find((i) => i.id === 1951);
  //const r = input.find((i) => i.id === 2311);
  /*
  console.log(print(l));
  console.log(print(r));

  console.log("!!", leftOf(l.data, r.data));
  */
  //console.log(findMatch(l, r).length);

  /*
  console.log(print(l));
  console.log(print(r));

  console.log("!!", leftOf(l.data, r.data));
  */
  //console.log(print(fliph(l)));
  //console.log(print(flipv(l)));

  //console.log(rotateR(l));
  //console.log(print(rotateR(l)));
  //console.log(print(r));

  //console.log(print(rotate180(l)));

  /*
  console.log(getTop(input[0].data));
  console.log(getBottom(input[0].data));
  console.log(getLeft(input[0].data));
  console.log(getRight(input[0].data));
  */
  //const tiles = readTiles(input);
};

const task2 = (input) => {};

const main = async () => {
  const testinput = await readFile("testinput.txt", readTile, "\n\n");

  const input = await readFile("input.txt");

  console.log(task1(testinput) === 2);
};

main();
