export enum CellState {
  EMPTY=' ',
  X='X',
  O='O',
}

export enum Player {
  X='X',
  O='O',
}

export enum CellPosition {
  TOP_LEFT = 0,
  TOP_CENTER = 1,
  TOP_RIGHT = 2,
  MIDDLE_LEFT = 3,
  MIDDLE_CENTER = 4,
  MIDDLE_RIGHT = 5,
  BOTTOM_LEFT = 6,
  BOTTOM_CENTER = 7,
  BOTTOM_RIGHT = 8
}

export type GameBoard = [
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState
];

export enum Win {
  ROW0,
  ROW1,
  ROW2,
  COL0,
  COL1,
  COL2,
  DIAGONAL_TOP_LEFT_TO_BOTTOM_RIGHT,
  DIAGONAL_BOTTOM_LEFT_TO_TOP_RIGHT
}

function isRowWin(row: number, board: GameBoard) {
  const offset = row * 3;
  return (
    board[offset] !== CellState.EMPTY &&
    board[offset] === board[offset + 1] &&
    board[offset + 1] === board[offset + 2]
  );
}

function isColWin(col: number, board: GameBoard) {
  const offset = col;
  return (
    board[offset] !== CellState.EMPTY &&
    board[offset] === board[offset + 3] &&
    board[offset + 3] === board[offset + 6]
  );
}

function isDiagonalTopLeftToBottomRightWin(board: GameBoard) {
  return (
    board[0] !== CellState.EMPTY &&
    board[0] === board[4] &&
    board[4] === board[8]
  );
}

function isDiagonalBottomLeftToTopRightWin(board: GameBoard) {
  return (
    board[2] !== CellState.EMPTY &&
    board[2] === board[4] &&
    board[4] === board[6]
  );
}

export function findWins(board: GameBoard): Win[] {
  const wins: Win[] = [];

  if (isRowWin(0, board)) {
    wins.push(Win.ROW0);
  }

  if (isRowWin(1, board)) {
    wins.push(Win.ROW1);
  }

  if (isRowWin(2, board)) {
    wins.push(Win.ROW2);
  }

  if (isColWin(0, board)) {
    wins.push(Win.COL0);
  }

  if (isColWin(1, board)) {
    wins.push(Win.COL1);
  }

  if (isColWin(2, board)) {
    wins.push(Win.COL2);
  }

  if (isDiagonalTopLeftToBottomRightWin(board)) {
    wins.push(Win.DIAGONAL_TOP_LEFT_TO_BOTTOM_RIGHT);
  }

  if (isDiagonalBottomLeftToTopRightWin(board)) {
    wins.push(Win.DIAGONAL_BOTTOM_LEFT_TO_TOP_RIGHT);
  }

  return wins;
}

export function selectCell(
  player: Player,
  position: number,
  board: GameBoard
): GameBoard {
  if (position < 0 || position > 8) {
    throw new TypeError("The position is from 0 - 8");
  }

  if (board[position] !== CellState.EMPTY) {
    throw new Error("Cannot select a non-empty cell");
  }

  const newBoard = [...board] as GameBoard;
  newBoard[position] = player === Player.X ? CellState.X : CellState.O;
  return newBoard;
}

export function newGameBoard(): GameBoard {
  return [
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY
  ];
}

export function hashGameBoard(board: GameBoard) {
  let hash = 0;
  let p = 1;
  for (let i=0; i<board.length; ++i) {
    switch(board[i]) {
      case CellState.X:
        hash += 1 * p;
        break;
      case CellState.O:
        hash += 2 * p;
        break;
    }

    p = p * 3;
  }

  return hash;
}
