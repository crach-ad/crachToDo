"use client"

import { useEffect } from "react"
import { X, ChevronUp, Zap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface LevelUpModalProps {
  newRank: string
  previousRank: string
  onClose: () => void
}

export function LevelUpModal({ newRank, previousRank, onClose }: LevelUpModalProps) {
  // Play sound effect when modal opens
  useEffect(() => {
    const audio = new Audio("/level-up.mp3")
    audio.volume = 0.5
    audio.play().catch((err) => console.error("Failed to play sound:", err))
  }, [])

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-[hsl(var(--neon-blue))] text-white max-w-md cyber-border p-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--neon-blue)/0.2)] via-transparent to-[hsl(var(--neon-purple)/0.2)]"
          animate={{
            opacity: [0, 0.5, 0],
            background: [
              "linear-gradient(90deg, hsla(var(--neon-blue)/0.2) 0%, transparent 50%, hsla(var(--neon-purple)/0.2) 100%)",
              "linear-gradient(90deg, hsla(var(--neon-purple)/0.2) 0%, transparent 50%, hsla(var(--neon-blue)/0.2) 100%)",
              "linear-gradient(90deg, hsla(var(--neon-blue)/0.2) 0%, transparent 50%, hsla(var(--neon-purple)/0.2) 100%)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 pointer-events-none"></div>

        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-center text-2xl font-bold text-[hsl(var(--neon-blue))] cyber-text">
            SYSTEM UPGRADE
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6 relative p-6">
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[hsl(var(--neon-blue))/0.05] rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          <div className="text-center space-y-2 relative">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="bg-gray-800 rounded-full p-3 border border-[hsl(var(--neon-blue))]"
                animate={{
                  boxShadow: [
                    "0 0 0px hsla(var(--neon-blue), 0.5)",
                    "0 0 20px hsla(var(--neon-blue), 0.5)",
                    "0 0 0px hsla(var(--neon-blue), 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <ChevronUp className="h-8 w-8 text-[hsl(var(--neon-blue))]" />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              HUNTER RANK UPGRADED
            </motion.p>

            <div className="flex items-center justify-center space-x-4">
              <motion.span
                className={`text-3xl font-bold ${getRankColor(previousRank)} cyber-text`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {previousRank}
              </motion.span>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <Zap className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
              </motion.div>

              <motion.span
                className={`text-5xl font-bold ${getRankColor(newRank)} cyber-text`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {newRank}
              </motion.span>
            </div>
          </div>

          <motion.div
            className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[hsl(var(--neon-blue))] to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />

          <motion.div
            className="text-center space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <p className="text-lg font-medium flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-[hsl(var(--neon-purple))]" />
              NEW ABILITIES UNLOCKED
            </p>
            <p className="text-sm text-gray-400">Continue completing missions to maximize your potential.</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))] hover:opacity-90 text-white px-8 relative overflow-hidden"
            >
              CONTINUE
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
