import type { Board, Player, Position } from "./types";

export const ROWS = 6;
export const COLUMNS = 7;

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
}

export function switchPlayer(player: Player): Player {
  return player === "red" ? "yellow" : "red";
}

export function findAvailableRow(board: Board, column: number): number | null {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      return row;
    }
  }

  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function getWinningCells(
  board: Board,
  startRow: number,
  startColumn: number,
  player: Player
): Position[] {
  const directions: Position[] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [rowDirection, columnDirection] of directions) {
    const cells: Position[] = [[startRow, startColumn]];

    let row = startRow + rowDirection;
    let column = startColumn + columnDirection;

    while (
      row >= 0 &&
      row < ROWS &&
      column >= 0 &&
      column < COLUMNS &&
      board[row][column] === player
    ) {
      cells.push([row, column]);
      row += rowDirection;
      column += columnDirection;
    }

    row = startRow - rowDirection;
    column = startColumn - columnDirection;

    while (
      row >= 0 &&
      row < ROWS &&
      column >= 0 &&
      column < COLUMNS &&
      board[row][column] === player
    ) {
      cells.unshift([row, column]);
      row -= rowDirection;
      column -= columnDirection;
    }

    if (cells.length >= 4) {
      return cells.slice(0, 4);
    }
  }

  return [];
}

export function isWinningCell(
  winningCells: Position[],
  row: number,
  column: number
): boolean {
  return winningCells.some(
    ([winningRow, winningColumn]) =>
      winningRow === row && winningColumn === column
  );
}