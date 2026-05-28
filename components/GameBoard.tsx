import Cell from "./Cell";
import type { Board, Position } from "../lib/types";
import { isWinningCell } from "../lib/gameLogic";
import type { BoardTheme } from "../lib/themes";

type GameBoardProps = {
  board: Board;
  winningCells: Position[];
  onColumnClick: (column: number) => void;
  theme: BoardTheme;
};

export default function GameBoard({
  board,
  winningCells,
  onColumnClick,
  theme,
}: GameBoardProps) {
  return (
    <div className={theme.frame}>
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {board.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <Cell
              key={`${rowIndex}-${columnIndex}`}
              cell={cell}
              isWinning={isWinningCell(winningCells, rowIndex, columnIndex)}
              onClick={() => onColumnClick(columnIndex)}
              columnIndex={columnIndex}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  );
}