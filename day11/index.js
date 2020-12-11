const readFile = require("../readFile");

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

//yeah, but ugly, i know
const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const isFreeAndHasNoAdjacentOccupied = (seat, adjacent) =>
  seat === "L" && adjacent.filter((s) => s === "#").length === 0;

const isOccupiedAndHasMoreThanNNeighboursOccupied = (numOccupied) => (
  seat,
  adjacent
) => seat === "#" && adjacent.filter((s) => s === "#").length >= numOccupied;

const handleSeatChange = (seat, board, x, y, numOccupied, getAdjacent) =>
  ((adjacent) =>
    isFreeAndHasNoAdjacentOccupied(seat, adjacent)
      ? "#"
      : isOccupiedAndHasMoreThanNNeighboursOccupied(numOccupied)(seat, adjacent)
      ? "L"
      : seat)(getAdjacent(x, y, board));

const change = (seat, board, x, y, numOccupied, getAdjacent) =>
  seat === "."
    ? "."
    : handleSeatChange(seat, board, x, y, numOccupied, getAdjacent);

const model = (board, numOccupied, getAdjacent) =>
  board.map((line, x) =>
    line.map((seat, y) => change(seat, board, x, y, numOccupied, getAdjacent))
  );

const converge = (board, numOccupied, getAdjacent) =>
  ((newBoard) =>
    equals(newBoard, board)
      ? newBoard
      : converge(newBoard, numOccupied, getAdjacent))(
    model(board, numOccupied, getAdjacent)
  );

const countOccupied = (board) =>
  board.reduce((acc, l) => acc + l.filter((s) => s === "#").length, 0);

const parseBoard = (input) => input.map((l) => l.split(""));

const task = (input, numOccupied, getAdjacent) =>
  countOccupied(converge(parseBoard(input), numOccupied, getAdjacent));

const getAdjacent1 = (x, y, board) =>
  range(x - 1, x + 2)
    .map((xx) =>
      range(y - 1, y + 2).map((yy) =>
        board[xx] && board[xx][yy]
          ? xx === x && yy == y
            ? undefined
            : board[xx][yy]
          : undefined
      )
    )
    .flat();

const task1 = (input) => task(input, 4, getAdjacent1);

const inc = (x, y, dx, dy) => [x + dx, y + dy];

const line = (board, x, y, dx, dy) =>
  ((board, xx, yy, dx, dy) =>
    !board[xx] || !board[xx][yy]
      ? undefined
      : board[xx][yy] === "."
      ? line(board, xx, yy, dx, dy)
      : board[xx][yy])(board, ...inc(x, y, dx, dy), dx, dy);

const getAdjacent2 = (x, y, board) =>
  range(-1, 2)
    .map((dx) =>
      range(-1, 2).map((dy) =>
        dx == 0 && dy == 0 ? undefined : line(board, x, y, dx, dy)
      )
    )
    .flat();

const task2 = (input) => task(input, 5, getAdjacent2);

const main = async () => {
  const testinput = await readFile("testinput.txt");

  const input = await readFile("input.txt");
  console.log(task1(testinput) === 37);
  console.log(task1(input) === 2468);

  console.log(task2(testinput) === 26);
  console.time("a");
  console.log(task2(input) === 2214);
  console.timeEnd("a");
};

main();
