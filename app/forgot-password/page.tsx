"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, AlertCircle, Cpu, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [scanningEffect, setScanningEffect] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email) {
      setError("Communication channel is required")
      return
    }

    setIsLoading(true)
    setScanningEffect(true)

    // Simulate password recovery process
    setTimeout(() => {
      setIsLoading(false)
      setScanningEffect(false)
      setSuccess(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_10%,hsl(var(--neon-blue)/0.05),transparent_20%),radial-gradient(circle_at_75%_30%,hsl(var(--neon-purple)/0.05),transparent_20%),radial-gradient(circle_at_50%_80%,hsl(var(--neon-green)/0.05),transparent_20%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/circuit-pattern.svg')] opacity-5"></div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-[hsl(var(--neon-purple)/0.1)]"
              style={{ top: `${(i + 1) * (100 / 7)}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-[hsl(var(--neon-purple)/0.1)]"
              style={{ left: `${(i + 1) * (100 / 7)}%` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 cyber-panel"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Shield className="h-8 w-8 text-[hsl(var(--neon-purple))]" />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-center cyber-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            RECOVERY PROTOCOL
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            SYSTEM ACCESS RESTORATION
          </motion.p>
        </div>

        <motion.div
          className="cyber-border relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {scanningEffect && (
            <motion.div
              className="absolute inset-0 bg-[hsl(var(--neon-purple)/0.05)] z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.2, 0],
              }}
              transition={{ duration: 2, repeat: 1 }}
            >
              <div className="scanner-line"></div>
            </motion.div>
          )}

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-5 w-5 text-[hsl(var(--neon-purple))]" />
              <h2 className="text-lg font-semibold text-[hsl(var(--neon-purple))] cyber-text">ACCESS RECOVERY</h2>
            </div>

            {error && (
              <motion.div
                className="p-3 rounded-md bg-[hsl(var(--neon-red)/0.1)] border border-[hsl(var(--neon-red)/0.3)] text-[hsl(var(--neon-red))] flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {success ? (
              <motion.div
                className="p-4 rounded-md bg-[hsl(var(--neon-green)/0.1)] border border-[hsl(var(--neon-green)/0.3)] text-[hsl(var(--neon-green))]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-center">
                  Recovery protocol initiated. Check your communication channel for further instructions.
                </p>
                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-[hsl(var(--neon-purple))] hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Return to authentication portal
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-gray-400 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> COMMUNICATION CHANNEL
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-muted border-gray-700 focus-visible:ring-[hsl(var(--neon-purple))] focus-visible:border-[hsl(var(--neon-purple))] pl-10"
                      placeholder="Enter your registered email"
                    />
                    <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] hover:opacity-90 text-white relative overflow-hidden"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      PROCESSING
                    </span>
                  ) : (
                    <>
                      INITIATE RECOVERY
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                    </>
                  )}
                </Button>

                <div className="pt-4 text-center text-sm border-t border-gray-800">
                  <Link
                    href="/login"
                    className="text-[hsl(var(--neon-purple))] hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Return to authentication portal
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>SYSTEM VERSION 2.0.45 • SECURE CONNECTION ESTABLISHED</p>
          <p className="mt-1">© 2025 THE SYSTEM CORPORATION • ALL RIGHTS RESERVED</p>
        </motion.div>
      </motion.div>

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute top-8 left-0 w-16 h-px bg-[hsl(var(--neon-purple))]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute top-0 left-8 h-16 w-px bg-[hsl(var(--neon-purple))]"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-8 right-0 w-16 h-px bg-[hsl(var(--neon-blue))]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 right-8 h-16 w-px bg-[hsl(var(--neon-blue))]"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
