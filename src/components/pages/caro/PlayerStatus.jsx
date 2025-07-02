import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Crown } from "lucide-react"

const PlayerStatus = ({
  playerNumber,
  currentPlayer,
  isMyTurn,
  gameStatus,
  winner,
  getPlayerSymbol,
  rematchRequests,
}) => {
  const getPlayerColor = (symbol) => {
    return symbol === "X" ? "text-blue-600" : "text-red-600"
  }

  const isWinner = winner && getPlayerSymbol(playerNumber) === winner

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          Player Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {playerNumber ? (
          <>
            <div className="flex items-center justify-between">
              <span>You are:</span>
              <Badge variant="outline" className={`font-bold ${getPlayerColor(getPlayerSymbol(playerNumber))}`}>
                Player {playerNumber} ({getPlayerSymbol(playerNumber)})
              </Badge>
            </div>

            {gameStatus === "playing" && (
              <div className="flex items-center justify-between">
                <span>Current turn:</span>
                <Badge variant={isMyTurn ? "default" : "secondary"} className={isMyTurn ? "bg-green-500" : ""}>
                  {isMyTurn ? "Your turn" : `Player ${currentPlayer}`}
                </Badge>
              </div>
            )}

            {gameStatus === "ended" && (
              <div className="flex items-center justify-between">
                <span>Result:</span>
                <Badge
                  variant={isWinner ? "default" : "destructive"}
                  className={`flex items-center gap-1 ${isWinner ? "bg-green-500" : ""}`}
                >
                  {isWinner && <Crown className="w-3 h-3" />}
                  {isWinner ? "You Won!" : "You Lost"}
                </Badge>
              </div>
            )}

            {gameStatus === "ended" && rematchRequests && rematchRequests.count > 0 && (
              <div className="flex items-center justify-between">
                <span>Rematch:</span>
                <Badge variant="outline" className="text-xs">
                  {rematchRequests.count}/2 ready
                </Badge>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">Not connected to game</div>
        )}
      </CardContent>
    </Card>
  )
}

export default PlayerStatus
