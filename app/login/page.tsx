"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Lock, User, AlertCircle, Cpu, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [scanningEffect, setScanningEffect] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("All fields are required")
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setScanningEffect(true)

    try {
      const success = await login(email, password)

      if (success) {
        router.push("/")
      } else {
        setError("Authentication failed. Invalid credentials.")
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.")
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed login attempts. Please try again later.")
      } else {
        setError("An unexpected error occurred: " + (err.message || ""))
      }
    } finally {
      setIsLoading(false)
      setScanningEffect(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="cyber-panel p-8 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-[hsl(var(--neon-blue))] border-r-transparent border-b-[hsl(var(--neon-purple))] border-l-transparent rounded-full mb-4"></div>
          <p className="text-[hsl(var(--neon-blue))] cyber-text">ESTABLISHING CONNECTION...</p>
        </div>
      </div>
    )
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
              className="absolute left-0 right-0 h-px bg-[hsl(var(--neon-blue)/0.1)]"
              style={{ top: `${(i + 1) * (100 / 7)}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-[hsl(var(--neon-blue)/0.1)]"
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
            <Shield className="h-8 w-8 text-[hsl(var(--neon-blue))]" />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-center cyber-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            THE SYSTEM
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            ACCESS AUTHORIZATION REQUIRED
          </motion.p>

          <motion.p
            className="text-center text-[hsl(var(--neon-purple))] cyber-text mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 1 }}
          >
            "Nobody is coming to save you. Level up..."
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
              className="absolute inset-0 bg-[hsl(var(--neon-blue)/0.05)] z-10 pointer-events-none"
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
              <Cpu className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
              <h2 className="text-lg font-semibold text-[hsl(var(--neon-blue))] cyber-text">AUTHENTICATION PORTAL</h2>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-gray-400 flex items-center gap-2">
                  <Mail className="h-3 w-3" /> EMAIL
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted border-gray-700 focus-visible:ring-[hsl(var(--neon-blue))] focus-visible:border-[hsl(var(--neon-blue))] pl-10"
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                  <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-gray-400 flex items-center gap-2">
                  <Lock className="h-3 w-3" /> ACCESS CODE
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted border-gray-700 focus-visible:ring-[hsl(var(--neon-blue))] focus-visible:border-[hsl(var(--neon-blue))] pl-10"
                    placeholder="Enter your access code"
                  />
                  <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember neural link
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))] hover:opacity-90 text-white relative overflow-hidden"
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
                    ESTABLISHING CONNECTION
                  </span>
                ) : (
                  <>
                    INITIATE SYSTEM CONNECTION
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 text-center text-sm border-t border-gray-800">
              <p className="text-gray-400">
                No system connection established?{" "}
                <Link href="/register" className="text-[hsl(var(--neon-blue))] hover:underline">
                  Register new identity
                </Link>
              </p>
              <p className="mt-2">
                <Link href="/forgot-password" className="text-[hsl(var(--neon-purple))] hover:underline text-xs">
                  System recovery protocol
                </Link>
              </p>
            </div>
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
          className="absolute top-8 left-0 w-16 h-px bg-[hsl(var(--neon-blue))]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute top-0 left-8 h-16 w-px bg-[hsl(var(--neon-blue))]"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-8 right-0 w-16 h-px bg-[hsl(var(--neon-purple))]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 right-8 h-16 w-px bg-[hsl(var(--neon-purple))]"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
