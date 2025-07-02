"use client"

import { useState, useEffect, useCallback } from "react"
import { io } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameBoard from "./GameBoard"
import PlayerStatus from "./PlayerStatus"
import GameControls from "./GameControls"

const BACKEND_URL = "http://localhost:3000/caro" // Adjust to your NestJS backend URL

function App() {
  const [socket, setSocket] = useState(null)
  const [gameState, setGameState] = useState({
    board: Array.from({ length: 20 }, () => Array(20).fill("")),
    currentPlayer: null,
    playerNumber: null,
    gameStatus: "disconnected", // disconnected, waiting, playing, ended
    message: "",
    winner: null,
    isMyTurn: false,
    rematchRequests: {
      count: 0,
      requester: null,
      hasRequested: false,
    },
  })

  const connectToGame = useCallback(() => {
    const newSocket = io(BACKEND_URL)
    setSocket(newSocket)

    newSocket.on("joined", (data) => {
      setGameState((prev) => ({
        ...prev,
        playerNumber: data.player,
        gameStatus: data.player === 1 ? "waiting" : "playing",
        message: `You are Player ${data.player}${data.player === 1 ? ". Waiting for opponent..." : ". Game ready!"}`,
      }))
    })

    newSocket.on("full", (message) => {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "disconnected",
        message: message,
      }))
      newSocket.disconnect()
    })

    newSocket.on("waiting", (message) => {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "waiting",
        playerNumber: 1, // Set player as Player 1 when waiting
        message: message,
      }))
    })

    newSocket.on("start", (data) => {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "playing",
        board: data.board,
        currentPlayer: data.turn,
        isMyTurn: prev.playerNumber === data.turn,
        message: data.message,
        winner: null,
        rematchRequests: {
          count: 0,
          requester: null,
          hasRequested: false,
        },
      }))
    })

    newSocket.on("update", (data) => {
      setGameState((prev) => ({
        ...prev,
        board: data.board,
      }))
    })

    newSocket.on("turn", (playerTurn) => {
      setGameState((prev) => ({
        ...prev,
        currentPlayer: playerTurn,
        isMyTurn: prev.playerNumber === playerTurn,
        message: `Player ${playerTurn}'s turn`,
      }))
    })

    newSocket.on("end", (message) => {
      const winner = message.includes("X") ? "X" : "O"
      setGameState((prev) => ({
        ...prev,
        gameStatus: "ended",
        winner: winner,
        message: message,
        isMyTurn: false,
      }))
    })

    newSocket.on("reset", (data) => {
      setGameState((prev) => ({
        ...prev,
        board: data.board,
        gameStatus: "waiting",
        currentPlayer: null,
        winner: null,
        isMyTurn: false,
        message: "Game reset. Waiting for players...",
      }))
    })

    newSocket.on("not-your-turn", (message) => {
      setGameState((prev) => ({
        ...prev,
        message: message,
      }))
    })

    newSocket.on("invalid", (message) => {
      setGameState((prev) => ({
        ...prev,
        message: message,
      }))
    })

    newSocket.on("rematch-status", (data) => {
      setGameState((prev) => ({
        ...prev,
        rematchRequests: {
          count: data.count,
          requester: data.requester,
          hasRequested: prev.rematchRequests.hasRequested || data.requester === newSocket.id,
        },
      }))
    })

    newSocket.on("disconnect", () => {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "disconnected",
        message: "Disconnected from server",
      }))
    })

    return newSocket
  }, [])

  const handleCellClick = useCallback(
    (x, y) => {
      if (socket && gameState.gameStatus === "playing" && gameState.isMyTurn) {
        socket.emit("move", { x, y })
      }
    },
    [socket, gameState.gameStatus, gameState.isMyTurn],
  )

  const handleRematch = useCallback(() => {
    if (socket && gameState.gameStatus === "ended") {
      socket.emit("rematch")
      setGameState((prev) => ({
        ...prev,
        rematchRequests: {
          ...prev.rematchRequests,
          hasRequested: true,
        },
      }))
    }
  }, [socket, gameState.gameStatus])

  useEffect(() => {
    connectToGame()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const getPlayerSymbol = (playerNumber) => {
    return playerNumber === 1 ? "X" : "O"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4 flex items-center justify-center">
                <GameBoard
                  board={gameState.board}
                  onCellClick={handleCellClick}
                  disabled={gameState.gameStatus !== "playing" || !gameState.isMyTurn}
                />
              </CardContent>
            </Card>
          </div>

          {/* Game Info Sidebar */}
          <div className="space-y-4">
            <PlayerStatus
              playerNumber={gameState.playerNumber}
              currentPlayer={gameState.currentPlayer}
              isMyTurn={gameState.isMyTurn}
              gameStatus={gameState.gameStatus}
              winner={gameState.winner}
              getPlayerSymbol={getPlayerSymbol}
            />

            <GameControls
              gameState={gameState}
              onRematch={handleRematch}
              rematchRequests={gameState.rematchRequests}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
