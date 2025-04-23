"use client"

import { CardContent } from "@/components/ui/card"
import { Shield, Zap, Activity, Award } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { UserStats } from "@/lib/types"

interface StatusWindowProps {
  stats: UserStats
}

export function StatusWindow({ stats }: StatusWindowProps) {
  const [prevXP, setPrevXP] = useState(stats.currentXP)
  const [isXPAnimating, setIsXPAnimating] = useState(false)
  const progressPercentage = (stats.currentXP / stats.requiredXP) * 100

  // Detect XP changes to trigger animations
  useEffect(() => {
    if (stats.currentXP !== prevXP) {
      setIsXPAnimating(true)
      const timer = setTimeout(() => {
        setIsXPAnimating(false)
        setPrevXP(stats.currentXP)
      }, 1000)
    }
  }, [stats.currentXP, prevXP])

  // Get rank color based on rank
  const getRankColor = (rank: string) => {
    switch (rank) {
      case "E":
        return "text-gray-400"
      case "D":
        return "text-[hsl(var(--neon-green))]"
      case "C":
        return "text-[hsl(var(--neon-blue))]"
      case "B":
        return "text-[hsl(var(--neon-purple))]"
      case "A":
        return "text-[hsl(var(--neon-pink))]"
      case "S":
        return "text-[hsl(var(--neon-orange))]"
      case "SS":
        return "text-[hsl(var(--neon-red))]"
      case "SSS":
        return "text-white cyber-text"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-[hsl(var(--neon-green))]" />
        <h2 className="text-lg font-semibold text-[hsl(var(--neon-green))] cyber-text">HUNTER STATUS</h2>
      </div>

      <div className="cyber-border relative overflow-hidden">
        <div className="scanner-line"></div>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center">
            <motion.div
              className="w-32 h-32 rounded-full bg-muted border-4 border-[hsl(var(--neon-blue))] flex items-center justify-center relative pulse"
              animate={isXPAnimating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--neon-blue)/0.1)] to-transparent opacity-50"></div>
                <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
              </div>
              <div className="text-center z-10">
                <motion.p
                  className={`text-5xl font-bold ${getRankColor(stats.rank)} cyber-text`}
                  animate={
                    isXPAnimating
                      ? {
                          textShadow: ["0 0 5px currentColor", "0 0 15px currentColor", "0 0 5px currentColor"],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  {stats.rank}
                </motion.p>
                <p className="text-sm text-gray-400">RANK</p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-[hsl(var(--neon-blue))]" />
                  LEVEL
                </span>
                <motion.span
                  className="font-medium text-[hsl(var(--neon-blue))]"
                  key={stats.level}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {stats.level}
                </motion.span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-[hsl(var(--neon-purple))]" />
                  ENERGY
                </span>
                <motion.span
                  className="font-medium text-[hsl(var(--neon-purple))]"
                  animate={isXPAnimating ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {stats.currentXP} / {stats.requiredXP}
                </motion.span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full absolute top-0 left-0 rounded-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))]"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: `${(prevXP / stats.requiredXP) * 100}%` }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-30"></div>
                </motion.div>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-400 border-t border-gray-700">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-[hsl(var(--neon-green))]" />
                <p>Complete missions to gain energy and rank up!</p>
              </div>
              <p className="mt-1 pl-4">Next rank: {getNextRank(stats.rank)}</p>
            </div>
          </div>
        </CardContent>
      </div>

      <motion.div
        className="cyber-panel p-4 text-xs space-y-2"
        animate={{
          boxShadow: isXPAnimating
            ? [
                "0 0 0 1px hsl(var(--neon-blue) / 0.2), 0 0 15px hsl(var(--neon-blue) / 0.15), inset 0 0 5px hsl(var(--neon-blue) / 0.05)",
                "0 0 0 1px hsl(var(--neon-blue) / 0.4), 0 0 20px hsl(var(--neon-blue) / 0.3), inset 0 0 10px hsl(var(--neon-blue) / 0.1)",
                "0 0 0 1px hsl(var(--neon-blue) / 0.2), 0 0 15px hsl(var(--neon-blue) / 0.15), inset 0 0 5px hsl(var(--neon-blue) / 0.05)",
              ]
            : {},
        }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-400">SYSTEM STATUS</span>
          <span className="text-[hsl(var(--neon-green))]">ONLINE</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">SYSTEM CONNECTION</span>
          <span className="text-[hsl(var(--neon-blue))]">ACTIVE</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">MEMORY STORAGE</span>
          <span className="text-[hsl(var(--neon-purple))]">SYNCED</span>
        </div>
      </motion.div>
    </div>
  )
}

function getNextRank(currentRank: string): string {
  const ranks = ["E", "D", "C", "B", "A", "S", "SS", "SSS"]
  const currentIndex = ranks.indexOf(currentRank)

  if (currentIndex === -1 || currentIndex === ranks.length - 1) {
    return "MAX RANK"
  }

  return ranks[currentIndex + 1]
}
