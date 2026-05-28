import type { Cell as CellType } from "../lib/types";
import type { BoardTheme } from "../lib/themes";

type CellProps = {
  cell: CellType;
  isWinning: boolean;
  onClick: () => void;
  columnIndex: number;
  theme: BoardTheme;
};

export default function Cell({
  cell,
  isWinning,
  onClick,
  columnIndex,
  theme,
}: CellProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition sm:h-16 sm:w-16 ${
        isWinning ? theme.winningCell : theme.emptyCell
      }`}
      aria-label={`Column ${columnIndex + 1}`}
    >
      <span
        className={`h-8 w-8 rounded-full transition sm:h-12 sm:w-12 ${
          cell === "red"
            ? theme.redPiece
            : cell === "yellow"
            ? theme.yellowPiece
            : "bg-transparent"
        }`}
      />
    </button>
  );
}