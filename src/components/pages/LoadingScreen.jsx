/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Zap, Trophy, Users } from "lucide-react"

export default function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const gamingTips = [
    "Connecting to game servers...",
    "Loading your achievements...",
    "Preparing multiplayer lobby...",
    "Syncing game progress...",
    "Almost ready to play!",
  ]

  const floatingIcons = [
    { Icon: Gamepad2, delay: 0 },
    { Icon: Zap, delay: 0.5 },
    { Icon: Trophy, delay: 1 },
    { Icon: Users, delay: 1.5 },
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsComplete(true)
          setTimeout(() => {
            onLoadingComplete?.()
          }, 1000)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % gamingTips.length)
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(tipInterval)
    }
  }, [onLoadingComplete, gamingTips.length])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating gaming icons */}
      {floatingIcons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-cyan-400/20"
          initial={{ y: 100, opacity: 0, rotate: 0 }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + index * 20}%`,
            top: `${30 + (index % 2) * 40}%`,
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}

      {/* Main loading content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 p-1"
            >
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-cyan-400" />
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              GAME CENTER
            </motion.h1>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full relative"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>
          </div>
          <motion.div
            className="text-cyan-400 text-lg font-semibold mt-2"
            key={Math.floor(progress)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {Math.floor(progress)}%
          </motion.div>
        </motion.div>

        {/* Loading tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="h-8 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-slate-300 text-sm"
            >
              {gamingTips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Pulsing dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center space-x-2 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Completion animation */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 border-4 border-green-400 rounded-full flex items-center justify-center bg-green-400/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-green-400 text-2xl font-bold"
                >
                  ✓
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50" />
    </div>
  )
}
