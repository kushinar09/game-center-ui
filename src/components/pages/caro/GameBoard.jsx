"use client"

import { Button } from "@/components/ui/button"

const GameBoard = ({ board, onCellClick, disabled }) => {
  const getCellStyle = (cell, disabled) => {
    if (cell === "X") return "text-blue-600 font-bold"
    if (cell === "O") return "text-red-600 font-bold"
    return "bg-gray-100" + (disabled ? "" : " hover:bg-gray-200")
  }

  return (
    <div className="inline-block p-4 bg-amber-800 rounded-lg shadow-inner">
      <div className="grid grid-cols-20 gap-1 max-w-full overflow-auto">
        {board.map((row, x) =>
          row.map((cell, y) => (
            <Button
              key={`${x}-${y}`}
              variant="outline"
              size="sm"
              className={`w-6 h-6 p-0 text-xs border border-gray-300 ${getCellStyle(cell, disabled)} ${
                disabled ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => !disabled && onCellClick(x, y)}
            >
              {cell}
            </Button>
          )),
        )}
      </div>
    </div>
  )
}

export default GameBoard
