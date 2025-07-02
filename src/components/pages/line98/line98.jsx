"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Ball from "./ball"
import axios from "axios"
import { Undo2, Redo2 } from "lucide-react"

const BOARD_SIZE = 9
const API_BASE_URL = "http://localhost:3000/line98"

export default function Line98Game() {
  const [gameState, setGameState] = useState(null)
  const [selectedBall, setSelectedBall] = useState(null)
  const [animatingPath, setAnimatingPath] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hintPath, setHintPath] = useState(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Initialize game
  const startGame = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/start`)
      const data = response.data
      setGameState(data)
      setSelectedBall(null)
      setHintPath(null)
      setCanUndo(false)
      setCanRedo(false)
    } catch (error) {
      console.error("Failed to start game:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Move ball with animation
  const moveBall = useCallback(
    async (from, to) => {
      if (isAnimating) return

      setIsAnimating(true)
      try {
        const response = await axios.post(`${API_BASE_URL}/move`, { from, to })
        const data = response.data

        // Animate ball movement along path
        setAnimatingPath(data.path)

        // Update game state after animation
        setGameState(data.state)
        setSelectedBall(null)
        setAnimatingPath([])
        setHintPath(null)

        // Enable undo after a successful move
        setCanUndo(true)
        setCanRedo(false) // Clear redo when new move is made
      } catch (error) {
        console.error("Failed to move ball:", error)
      } finally {
        setIsAnimating(false)
      }
    },
    [isAnimating],
  )

  // Undo move
  const undoMove = useCallback(async () => {
    if (!canUndo || isAnimating) return

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/undo`)
      const data = response.data

      setGameState(data)
      setSelectedBall(null)
      setHintPath(null)
      setCanUndo(false) // Disable undo after using it
      setCanRedo(true) // Enable redo
    } catch (error) {
      console.error("Failed to undo move:", error)
      if (error.response?.data?.message === "No undo available") {
        setCanUndo(false)
      }
    } finally {
      setIsLoading(false)
    }
  }, [canUndo, isAnimating])

  // Redo move
  const redoMove = useCallback(async () => {
    if (!canRedo || isAnimating) return

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/redo`)
      const data = response.data

      setGameState(data)
      setSelectedBall(null)
      setHintPath(null)
      setCanRedo(false) // Disable redo after using it
      setCanUndo(true) // Enable undo
    } catch (error) {
      console.error("Failed to redo move:", error)
      if (error.response?.data?.message === "No redo available") {
        setCanRedo(false)
      }
    } finally {
      setIsLoading(false)
    }
  }, [canRedo, isAnimating])

  // Get hint
  const getHint = useCallback(async () => {
    if (!gameState || isAnimating) return

    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/suggest`)
      const data = response.data

      if (data && data.length > 0) {
        setHintPath(data)

        // Auto-clear hint after 3 seconds
        setTimeout(() => {
          setHintPath(null)
        }, 3000)
      }
    } catch (error) {
      console.error("Failed to get hint:", error)
    } finally {
      setIsLoading(false)
    }
  }, [gameState, isAnimating])

  // Handle cell click
  const handleCellClick = useCallback(
    (x, y) => {
      console.log("Cell clicked:", x, y, selectedBall)
      if (!gameState || isAnimating) return

      const clickedPosition = { x, y }
      const ball = gameState.board[y][x]
      const nextBall = gameState.nextBalls.find((nb) => nb.position.x === x && nb.position.y === y)

      // Don't allow interaction with nextBalls
      if (!selectedBall && nextBall) return

      if (selectedBall) {
        console.log(ball, nextBall, selectedBall, clickedPosition)
        if (selectedBall.x === x && selectedBall.y === y) {
          // Deselect if clicking the same ball
          setSelectedBall(null)
          setHintPath(null)
        } else if (!ball) {
          // Move to empty cell (not occupied by nextBall)
          moveBall(selectedBall, clickedPosition)
        } else {
          // Select different ball
          setSelectedBall(clickedPosition)
          setHintPath(null)
        }
      } else if (ball) {
        // Select ball
        setSelectedBall(clickedPosition)
        setHintPath(null)
      }
    },
    [gameState, selectedBall, isAnimating, moveBall],
  )

  // Initialize game on mount
  useEffect(() => {
    startGame()
  }, [startGame])

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Line98</h1>
          <p className="text-gray-600">Connect 5 or more balls of the same color!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="grid grid-cols-9 gap-1 bg-gray-100 p-4 rounded-lg">
                {Array.from({ length: BOARD_SIZE }, (_, y) =>
                  Array.from({ length: BOARD_SIZE }, (_, x) => {
                    const ball = gameState.board[y][x]
                    const nextBall = gameState.nextBalls.find((nb) => nb.position.x === x && nb.position.y === y)
                    const isSelected = selectedBall?.x === x && selectedBall?.y === y
                    const isAnimatingPosition = animatingPath.some((pos) => pos.x === x && pos.y === y)
                    const isHintPath = hintPath?.some((pos) => pos.x === x && pos.y === y)

                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`
                          aspect-square bg-white rounded-lg border-2 cursor-pointer
                          transition-all duration-200 flex items-center justify-center
                          ${isSelected ? "border-blue-500 bg-blue-50 scale-110" : "border-gray-200"}
                          ${isHintPath ? "border-yellow-400 bg-yellow-50" : ""}
                          ${nextBall ? "border-green-300 bg-green-50" : ""}
                          ${!ball && !nextBall ? "hover:bg-gray-50" : ""}
                        `}
                        onClick={() => handleCellClick(x, y)}
                      >
                        {ball && (
                          <div className={`transition-transform duration-200 ${isSelected ? "scale-125" : ""}`}>
                            <Ball
                              baseColor={ball.color}
                              isBouncing={isSelected || isAnimatingPosition}
                              isSmall={false}
                            />
                          </div>
                        )}
                        {!ball && nextBall && (
                          <div className="opacity-70">
                            <Ball baseColor={nextBall.color} isBouncing={false} isSmall={true} />
                          </div>
                        )}
                      </div>
                    )
                  }),
                )}
              </div>
            </Card>
          </div>

          {/* Game Info Panel */}
          <div className="space-y-4">
            {/* Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{gameState.score.toLocaleString()}</div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={startGame}
                  disabled={isLoading || isAnimating}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {isLoading ? "Starting..." : "Restart Game"}
                </Button>

                {/* Undo/Redo buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={undoMove}
                    disabled={!canUndo || isLoading || isAnimating || gameState.gameOver}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-transparent"
                  >
                    <Undo2 className="w-4 h-4" />
                    Undo
                  </Button>
                  <Button
                    onClick={redoMove}
                    disabled={!canRedo || isLoading || isAnimating || gameState.gameOver}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-transparent"
                  >
                    <Redo2 className="w-4 h-4" />
                    Redo
                  </Button>
                </div>

                <Button
                  onClick={getHint}
                  disabled={isLoading || isAnimating || gameState.gameOver}
                  className="w-full"
                  variant="secondary"
                >
                  {isLoading ? "Getting Hint..." : "Hint"}
                </Button>
              </CardContent>
            </Card>

            {/* Game Status */}
            {gameState.gameOver && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Game Over!</h3>
                    <p className="text-red-600 mb-4">Final Score: {gameState.score.toLocaleString()}</p>
                    <Button onClick={startGame} className="w-full">
                      Play Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-sm text-blue-800">
                  <h4 className="font-semibold mb-2">How to Play:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Click a ball to select it</li>
                    <li>• Click an empty cell to move</li>
                    <li>• Form lines of 5+ same colors</li>
                    <li>• Use Hint for suggestions</li>
                    <li>• Use Undo/Redo to manage moves</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
