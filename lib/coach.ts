import type { Board, Player } from "./types";
import { COLUMNS, findAvailableRow, getWinningCells } from "./gameLogic";

function copyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function getAvailableColumns(board: Board): number[] {
  const columns: number[] = [];

  for (let column = 0; column < COLUMNS; column++) {
    if (findAvailableRow(board, column) !== null) {
      columns.push(column);
    }
  }

  return columns;
}

function simulateMove(
  board: Board,
  column: number,
  player: Player
): { board: Board; row: number; column: number } | null {
  const row = findAvailableRow(board, column);

  if (row === null) {
    return null;
  }

  const simulatedBoard = copyBoard(board);
  simulatedBoard[row][column] = player;

  return {
    board: simulatedBoard,
    row,
    column,
  };
}

function findWinningMove(board: Board, player: Player): number | null {
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

function countPossibleWinningMoves(board: Board, player: Player): number {
  const availableColumns = getAvailableColumns(board);
  let count = 0;

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
      count++;
    }
  }

  return count;
}

export function getCoachFeedback(
  previousBoard: Board,
  newBoard: Board,
  playedColumn: number,
  player: Player,
  opponent: Player
): string {
  const playerWinningMoveBefore = findWinningMove(previousBoard, player);
  const opponentWinningMoveBefore = findWinningMove(previousBoard, opponent);

  const playedMoveWon = playerWinningMoveBefore === playedColumn;

  if (playedMoveWon) {
    return "Excellent move: you completed four in a row and won the game.";
  }

  if (
    playerWinningMoveBefore !== null &&
    playerWinningMoveBefore !== playedColumn
  ) {
    return `Missed opportunity: column ${
      playerWinningMoveBefore + 1
    } was a winning move.`;
  }

  if (
    opponentWinningMoveBefore !== null &&
    opponentWinningMoveBefore !== playedColumn
  ) {
    return `Warning: you should have blocked column ${
      opponentWinningMoveBefore + 1
    }.`;
  }

  const opponentWinningMoveAfter = findWinningMove(newBoard, opponent);

  if (opponentWinningMoveAfter !== null) {
    return `Danger: this move allows the opponent to win on column ${
      opponentWinningMoveAfter + 1
    }.`;
  }

  const createdThreats = countPossibleWinningMoves(newBoard, player);

  if (createdThreats >= 2) {
    return "Strong move: you created multiple threats.";
  }

  if (createdThreats === 1) {
    return "Good move: you created a direct threat.";
  }

  if (playedColumn === 3) {
    return "Solid move: controlling the center gives more future options.";
  }

  return "Neutral move: no immediate threat was created or blocked.";
}