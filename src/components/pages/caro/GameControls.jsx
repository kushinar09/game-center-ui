"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, WifiOff, RotateCcw, Clock, CheckCircle } from "lucide-react"

const GameControls = ({ gameState, onRematch, rematchRequests }) => {
  const getConnectionIcon = () => {
    return gameState.gameStatus === "disconnected" ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />
  }

  const getRematchStatusMessage = () => {
    if (rematchRequests.count === 0) return null
    if (rematchRequests.count === 1) {
      return rematchRequests.hasRequested ? "Waiting for opponent to accept rematch..." : "Opponent wants a rematch!"
    }
    return "Starting new game..."
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">

        {gameState.message && (
          <Alert>
            <AlertDescription>{gameState.message}</AlertDescription>
          </Alert>
        )}

        {gameState.gameStatus === "ended" && (
          <>
            <Separator />
            <div className="space-y-3">
              <Button
                onClick={onRematch}
                disabled={rematchRequests.hasRequested}
                className="w-full flex items-center gap-2"
                variant={rematchRequests.hasRequested ? "secondary" : "default"}
              >
                {rematchRequests.hasRequested ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Rematch Requested
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Request Rematch
                  </>
                )}
              </Button>

              {rematchRequests.count > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <Badge variant="outline" className="text-xs">
                      {rematchRequests.count}/2 players ready
                    </Badge>
                  </div>

                  {getRematchStatusMessage() && (
                    <p className="text-xs text-gray-600 text-center">{getRematchStatusMessage()}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getConnectionIcon()}
          <span className="capitalize">{gameState.gameStatus}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default GameControls
