import type { Board, Cell, Player } from "./types";
import {
  COLUMNS,
  ROWS,
  findAvailableRow,
  getWinningCells,
  isBoardFull,
} from "./gameLogic";

export type AIDifficulty = "easy" | "medium" | "hard";

type SimulatedMove = {
  board: Board;
  row: number;
  column: number;
};

export function getAvailableColumns(board: Board): number[] {
  const availableColumns: number[] = [];

  for (let column = 0; column < COLUMNS; column++) {
    const availableRow = findAvailableRow(board, column);

    if (availableRow !== null) {
      availableColumns.push(column);
    }
  }

  return availableColumns;
}

export function getRandomAIMove(board: Board): number | null {
  const availableColumns = getAvailableColumns(board);

  if (availableColumns.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableColumns.length);

  return availableColumns[randomIndex];
}

function getCell(board: Board, row: number, column: number): Cell {
  return board[row]?.[column] ?? null;
}

function simulateMove(
  board: Board,
  column: number,
  player: Player
): SimulatedMove | null {
  const availableRow = findAvailableRow(board, column);

  if (availableRow === null) {
    return null;
  }

  const simulatedBoard = board.map((row) => [...row]);
  simulatedBoard[availableRow][column] = player;

  return {
    board: simulatedBoard,
    row: availableRow,
    column,
  };
}

function findImmediateWinningMove(
  board: Board,
  player: Player
): number | null {
  const availableColumns = getAvailableColumns(board);

  for (const column of availableColumns) {
    const move = simulateMove(board, column, player);

    if (move === null) {
      continue;
    }

    const winningCells = getWinningCells(
      move.board,
      move.row,
      move.column,
      player
    );

    if (winningCells.length >= 4) {
      return column;
    }
  }

  return null;
}

export function getMediumAIMove(
  board: Board,
  aiPlayer: Player,
  humanPlayer: Player
): number | null {
  const winningMove = findImmediateWinningMove(board, aiPlayer);

  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findImmediateWinningMove(board, humanPlayer);

  if (blockingMove !== null) {
    return blockingMove;
  }

  const centerColumn = 3;

  if (findAvailableRow(board, centerColumn) !== null) {
    return centerColumn;
  }

  return getRandomAIMove(board);
}

function countCells(cells: Cell[], target: Cell): number {
  return cells.filter((cell) => cell === target).length;
}

function scoreLine(
  cells: Cell[],
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const aiCount = countCells(cells, aiPlayer);
  const humanCount = countCells(cells, humanPlayer);
  const emptyCount = countCells(cells, null);

  if (aiCount > 0 && humanCount > 0) {
    return 0;
  }

  if (aiCount === 4) {
    return 100000;
  }

  if (aiCount === 3 && emptyCount === 1) {
    return 120;
  }

  if (aiCount === 2 && emptyCount === 2) {
    return 20;
  }

  if (humanCount === 4) {
    return -100000;
  }

  if (humanCount === 3 && emptyCount === 1) {
    return -150;
  }

  if (humanCount === 2 && emptyCount === 2) {
    return -25;
  }

  return 0;
}

function getAllFourCellLines(board: Board): Cell[][] {
  const lines: Cell[][] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column <= COLUMNS - 4; column++) {
      lines.push([
        getCell(board, row, column),
        getCell(board, row, column + 1),
        getCell(board, row, column + 2),
        getCell(board, row, column + 3),
      ]);
    }
  }

  for (let column = 0; column < COLUMNS; column++) {
    for (let row = 0; row <= ROWS - 4; row++) {
      lines.push([
        getCell(board, row, column),
        getCell(board, row + 1, column),
        getCell(board, row + 2, column),
        getCell(board, row + 3, column),
      ]);
    }
  }

  for (let row = 0; row <= ROWS - 4; row++) {
    for (let column = 0; column <= COLUMNS - 4; column++) {
      lines.push([
        getCell(board, row, column),
        getCell(board, row + 1, column + 1),
        getCell(board, row + 2, column + 2),
        getCell(board, row + 3, column + 3),
      ]);
    }
  }

  for (let row = 3; row < ROWS; row++) {
    for (let column = 0; column <= COLUMNS - 4; column++) {
      lines.push([
        getCell(board, row, column),
        getCell(board, row - 1, column + 1),
        getCell(board, row - 2, column + 2),
        getCell(board, row - 3, column + 3),
      ]);
    }
  }

  return lines;
}

function evaluateBoard(
  board: Board,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  let score = 0;

  const centerColumn = 3;
  const centerCells = board.map((row) => row[centerColumn] ?? null);

  score += countCells(centerCells, aiPlayer) * 8;
  score -= countCells(centerCells, humanPlayer) * 8;

  const lines = getAllFourCellLines(board);

  for (const line of lines) {
    score += scoreLine(line, aiPlayer, humanPlayer);
  }

  return score;
}

function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  if (depth === 0 || isBoardFull(board)) {
    return evaluateBoard(board, aiPlayer, humanPlayer);
  }

  const availableColumns = getAvailableColumns(board);

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (const column of availableColumns) {
      const move = simulateMove(board, column, aiPlayer);

      if (move === null) {
        continue;
      }

      const winningCells = getWinningCells(
        move.board,
        move.row,
        move.column,
        aiPlayer
      );

      if (winningCells.length >= 4) {
        return 1000000 + depth;
      }

      const score = minimax(
        move.board,
        depth - 1,
        false,
        aiPlayer,
        humanPlayer
      );

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (const column of availableColumns) {
    const move = simulateMove(board, column, humanPlayer);

    if (move === null) {
      continue;
    }

    const winningCells = getWinningCells(
      move.board,
      move.row,
      move.column,
      humanPlayer
    );

    if (winningCells.length >= 4) {
      return -1000000 - depth;
    }

    const score = minimax(
      move.board,
      depth - 1,
      true,
      aiPlayer,
      humanPlayer
    );

    bestScore = Math.min(bestScore, score);
  }

  return bestScore;
}

export function getHardAIMove(
  board: Board,
  aiPlayer: Player,
  humanPlayer: Player
): number | null {
  const winningMove = findImmediateWinningMove(board, aiPlayer);

  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findImmediateWinningMove(board, humanPlayer);

  if (blockingMove !== null) {
    return blockingMove;
  }

  const availableColumns = getAvailableColumns(board);

  if (availableColumns.length === 0) {
    return null;
  }

  let bestScore = -Infinity;
  const bestColumns: number[] = [];
  const searchDepth = 6;

  for (const column of availableColumns) {
    const move = simulateMove(board, column, aiPlayer);

    if (move === null) {
      continue;
    }

    let score = minimax(
      move.board,
      searchDepth - 1,
      false,
      aiPlayer,
      humanPlayer
    );

    if (column === 3) {
      score += 10;
    }

    if (score > bestScore) {
      bestScore = score;
      bestColumns.length = 0;
      bestColumns.push(column);
    } else if (score === bestScore) {
      bestColumns.push(column);
    }
  }

  if (bestColumns.length === 0) {
    return getRandomAIMove(board);
  }

  const randomIndex = Math.floor(Math.random() * bestColumns.length);

  return bestColumns[randomIndex];
}

export function getAIMove(
  board: Board,
  difficulty: AIDifficulty,
  aiPlayer: Player,
  humanPlayer: Player
): number | null {
  if (difficulty === "easy") {
    return getRandomAIMove(board);
  }

  if (difficulty === "medium") {
    return getMediumAIMove(board, aiPlayer, humanPlayer);
  }

  return getHardAIMove(board, aiPlayer, humanPlayer);
}