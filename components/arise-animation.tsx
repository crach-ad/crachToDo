"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface AriseAnimationProps {
  show: boolean
  onComplete: () => void
}

export function AriseAnimation({ show, onComplete }: AriseAnimationProps) {
  const [audioPlayed, setAudioPlayed] = useState(false)

  // Auto-hide the animation after 3 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  useEffect(() => {
    if (show && !audioPlayed) {
      // Try to play the sound effect, but handle the case where it's not allowed
      const playAudio = async () => {
        try {
          const audio = new Audio("/arise-sound.mp3")
          audio.volume = 0.4

          // Use await with play() to properly catch any errors
          await audio.play()
          setAudioPlayed(true)
        } catch (error) {
          // Just log the error but don't let it affect the animation
          console.log("Audio couldn't be played due to browser restrictions")
          setAudioPlayed(true) // Still mark as played so we don't keep trying
        }
      }

      // Call the async function
      playAudio()

      // Reset the audio played state after animation completes
      const timer = setTimeout(() => {
        setAudioPlayed(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, audioPlayed])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Blue circuit pattern overlay */}
          <motion.div
            className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Radial glow effect */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--neon-blue)/0.3)_0%,transparent_70%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Main ARISE text */}
          <motion.div
            className="relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: 1,
            }}
            exit={{
              scale: 1.5,
              opacity: 0,
            }}
            transition={{
              duration: 1,
              times: [0, 0.6, 1],
            }}
          >
            <motion.h1
              className="text-[8rem] md:text-[12rem] font-bold text-[hsl(var(--neon-blue))] cyber-text tracking-wider"
              initial={{ textShadow: "0 0 10px hsl(var(--neon-blue))" }}
              animate={{
                textShadow: [
                  "0 0 10px hsl(var(--neon-blue))",
                  "0 0 30px hsl(var(--neon-blue))",
                  "0 0 10px hsl(var(--neon-blue))",
                ],
              }}
              transition={{ duration: 1.5 }}
            >
              ARISE
            </motion.h1>

            {/* Animated lines radiating from the text */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-px bg-[hsl(var(--neon-blue))]"
                  style={{
                    rotate: `${i * 45}deg`,
                    transformOrigin: "center",
                  }}
                  initial={{ width: 0, x: "-50%", y: "-50%", opacity: 0.7 }}
                  animate={{
                    width: ["0%", "200%", "200%"],
                    opacity: [0.7, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    times: [0, 0.5, 1],
                    delay: i * 0.03,
                  }}
                />
              ))}
            </motion.div>

            {/* Particles effect */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[hsl(var(--neon-blue))]"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    top: `${50 + (Math.random() * 40 - 20)}%`,
                    left: `${50 + (Math.random() * 40 - 20)}%`,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0.8,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
