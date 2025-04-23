"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Award, Zap, Activity, ChevronLeft, Trophy, Star, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="cyber-panel p-8 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-[hsl(var(--neon-blue))] border-r-transparent border-b-[hsl(var(--neon-purple))] border-l-transparent rounded-full mb-4"></div>
          <p className="text-[hsl(var(--neon-blue))] cyber-text">ESTABLISHING CONNECTION...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_10%,hsl(var(--neon-blue)/0.05),transparent_20%),radial-gradient(circle_at_75%_30%,hsl(var(--neon-purple)/0.05),transparent_20%),radial-gradient(circle_at_50%_80%,hsl(var(--neon-green)/0.05),transparent_20%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/circuit-pattern.svg')] opacity-5"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-[hsl(var(--neon-blue))] hover:bg-gray-800 hover:text-white">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Mission Control
            </Button>
          </Link>
        </div>

        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold text-center cyber-text">HUNTER PROFILE</h1>
            <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--neon-blue))] to-transparent"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div className="cyber-border relative overflow-hidden">
                <div className="scanner-line"></div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-center">
                    <motion.div
                      className="w-32 h-32 rounded-full bg-muted border-4 border-[hsl(var(--neon-blue))] flex items-center justify-center relative pulse"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--neon-blue)/0.1)] to-transparent opacity-50"></div>
                        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
                      </div>
                      <div className="text-center z-10">
                        <motion.p
                          className={`text-5xl font-bold ${getRankColor(user.rank)} cyber-text`}
                          animate={{
                            textShadow: ["0 0 5px currentColor", "0 0 15px currentColor", "0 0 5px currentColor"],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {user.rank}
                        </motion.p>
                        <p className="text-sm text-gray-400">RANK</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold cyber-text">{user.username}</h2>
                    <p className="text-sm text-gray-400">HUNTER ID: {user.id.substring(0, 8).toUpperCase()}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-[hsl(var(--neon-blue))]" />
                          LEVEL
                        </span>
                        <span className="font-medium text-[hsl(var(--neon-blue))]">{user.level}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-[hsl(var(--neon-purple))]" />
                          ENERGY
                        </span>
                        <span className="font-medium text-[hsl(var(--neon-purple))]">
                          {user.currentXP} / {user.requiredXP}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                        <div
                          className="h-full absolute top-0 left-0 rounded-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))]"
                          style={{ width: `${(user.currentXP / user.requiredXP) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-30"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="cyber-panel p-4 text-xs space-y-2"
                animate={{
                  boxShadow: [
                    "0 0 0 1px hsl(var(--neon-blue) / 0.2), 0 0 15px hsl(var(--neon-blue) / 0.15), inset 0 0 5px hsl(var(--neon-blue) / 0.05)",
                    "0 0 0 1px hsl(var(--neon-blue) / 0.4), 0 0 20px hsl(var(--neon-blue) / 0.3), inset 0 0 10px hsl(var(--neon-blue) / 0.1)",
                    "0 0 0 1px hsl(var(--neon-blue) / 0.2), 0 0 15px hsl(var(--neon-blue) / 0.15), inset 0 0 5px hsl(var(--neon-blue) / 0.05)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
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
          </motion.div>

          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="cyber-border">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                  <h2 className="text-lg font-semibold text-[hsl(var(--neon-green))] cyber-text">ACHIEVEMENTS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="cyber-panel p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--neon-green)/0.1)] flex items-center justify-center">
                      <Star className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                    </div>
                    <div>
                      <p className="font-medium">First Mission</p>
                      <p className="text-xs text-gray-400">Completed your first task</p>
                    </div>
                  </div>

                  <div className="cyber-panel p-4 flex items-center gap-3 opacity-50">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Target className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Precision</p>
                      <p className="text-xs text-gray-400">Complete 10 tasks without deletion</p>
                    </div>
                  </div>

                  <div className="cyber-panel p-4 flex items-center gap-3 opacity-50">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Consistency</p>
                      <p className="text-xs text-gray-400">Log in for 7 consecutive days</p>
                    </div>
                  </div>

                  <div className="cyber-panel p-4 flex items-center gap-3 opacity-50">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Rank Up</p>
                      <p className="text-xs text-gray-400">Reach Rank D</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cyber-border">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
                  <h2 className="text-lg font-semibold text-[hsl(var(--neon-blue))] cyber-text">STATISTICS</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[hsl(var(--neon-blue))]">0</p>
                    <p className="text-xs text-gray-400">MISSIONS COMPLETED</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[hsl(var(--neon-purple))]">0</p>
                    <p className="text-xs text-gray-400">TOTAL XP EARNED</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[hsl(var(--neon-green))]">0</p>
                    <p className="text-xs text-gray-400">CURRENT STREAK</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[hsl(var(--neon-orange))]">0</p>
                    <p className="text-xs text-gray-400">ACHIEVEMENTS</p>
                  </div>
                </div>

                <div className="pt-4 text-center text-sm border-t border-gray-800">
                  <p className="text-gray-400">Complete more missions to unlock achievements and increase your rank!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
