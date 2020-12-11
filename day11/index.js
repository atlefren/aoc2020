const readFile = require("../readFile");

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const getAdjacent1 = (x, y, board) =>
  range(x - 1, x + 2)
    .map((xx) =>
      range(y - 1, y + 2).map((yy) => {
        //console.log(xx, yy);
        return board[xx] && board[xx][yy]
          ? xx === x && yy == y
            ? undefined
            : board[xx][yy]
          : undefined;
      })
    )
    .flat();

const printBoard = (board) => board.map((l) => l.join("")).join("\n");

const handleSeatChange = (seat, board, x, y, numOccupied, getAdjacent) => {
  const adjacent = getAdjacent(x, y, board);

  if (seat === "L" && adjacent.filter((s) => s === "#").length === 0) {
    return "#";
  }
  if (seat === "#" && adjacent.filter((s) => s === "#").length >= numOccupied) {
    return "L";
  }
  return seat;
};

const change = (seat, board, x, y, numOccupied, getAdjacent) =>
  seat === "."
    ? "."
    : handleSeatChange(seat, board, x, y, numOccupied, getAdjacent);

const model = (board, numOccupied, getAdjacent) =>
  board.map((line, x) =>
    line.map((seat, y) => change(seat, board, x, y, numOccupied, getAdjacent))
  );

const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const converge = (board, numOccupied, getAdjacent) => {
  const n = model(board, numOccupied, getAdjacent);
  if (equals(n, board)) {
    return n;
  }
  return converge(n, numOccupied, getAdjacent);
};

const countOccupied = (board) =>
  board.reduce((acc, l) => acc + l.filter((s) => s === "#").length, 0);

const task1 = (input, print) => {
  const board = input.map((l) => l.split(""));
  const c = converge(board, 4, getAdjacent1);
  if (print) {
    console.log(printBoard(board));
    console.log("\n\n");
    console.log(printBoard(c));
  }
  return countOccupied(c);
};

const line = (board, x, y, dx, dy) => {
  const xx = x + dx;
  const yy = y + dy;

  if (!board[xx] || !board[xx][yy]) {
    return;
  }

  return board[xx][yy] === "." ? line(board, xx, yy, dx, dy) : board[xx][yy];
};

const getAdjacent2 = (x, y, board) =>
  range(-1, 2)
    .map((dx) =>
      range(-1, 2).map((dy) =>
        dx == 0 && dy == 0 ? undefined : line(board, x, y, dx, dy)
      )
    )
    .flat();

const task2 = (input, print) => {
  const board = input.map((l) => l.split(""));
  const c = converge(board, 5, getAdjacent2);
  if (print) {
    console.log(printBoard(board));
    console.log("\n\n");
    console.log(printBoard(c));
  }
  return countOccupied(c);
};

const main = async () => {
  const testinput = await readFile("testinput.txt");

  const input = await readFile("input.txt");
  console.log(task1(testinput) === 37);
  console.log(task1(input) === 2468);

  console.log(task2(testinput) === 26);

  console.log(task2(input) === 2214);
};

main();
