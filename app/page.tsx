"use client"

import { useState, useEffect } from "react"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { StatusWindow } from "@/components/status-window"
import { LevelUpModal } from "@/components/level-up-modal"
import { AriseAnimation } from "@/components/arise-animation"
import { UserMenu } from "@/components/user-menu"
import { Cpu, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { Task, UserStats } from "@/lib/types"
import { subscribeToTasks, addTask as addTaskToDb, updateTask, deleteTask as deleteTaskFromDb } from "@/lib/task-service"
import { subscribeToUserStats, addXP } from "@/lib/user-stats-service"

export default function Home() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<UserStats>({
    rank: "E",
    level: 1,
    currentXP: 0,
    requiredXP: 100,
  })
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [previousRank, setPreviousRank] = useState("")
  const [xpGained, setXpGained] = useState<{ value: number; position: { x: number; y: number } } | null>(null)
  const [showArise, setShowArise] = useState(false)
  const [pendingXP, setPendingXP] = useState<{ value: number; position: { x: number; y: number } } | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Subscribe to tasks and stats when user is available
  useEffect(() => {
    if (!user?.id) return
    
    // Subscribe to tasks from Firestore
    const unsubscribeTasks = subscribeToTasks(user.id, (fetchedTasks) => {
      setTasks(fetchedTasks)
    })
    
    // Subscribe to user stats from Firestore
    const unsubscribeStats = subscribeToUserStats(user.id, (fetchedStats) => {
      setStats(fetchedStats)
    })
    
    return () => {
      unsubscribeTasks()
      unsubscribeStats()
    }
  }, [user?.id])

  // Check for recurring tasks that need to be reset
  useEffect(() => {
    const now = new Date()
    const updatedTasks = [...tasks]
    let tasksUpdated = false

    for (let i = 0; i < updatedTasks.length; i++) {
      const task = updatedTasks[i]

      // Skip if not recurring or not completed
      if (!task.recurring || !task.completed) continue

      // Skip if no next due date or next due date is in the future
      if (!task.recurring.nextDue || new Date(task.recurring.nextDue) > now) continue

      // Create a new instance of the recurring task
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
      }

      // Calculate the next occurrence
      if (newTask.recurring) {
        switch (newTask.recurring.type) {
          case "daily":
            newTask.recurring.nextDue = new Date(
              new Date(task.recurring.nextDue!).getTime() + 24 * 60 * 60 * 1000,
            ).toISOString()
            break

          case "weekly":
            if (task.recurring.days && task.recurring.days.length > 0) {
              const nextDueDate = new Date(task.recurring.nextDue!)
              const currentDay = nextDueDate.getDay()
              const sortedDays = [...task.recurring.days].sort((a, b) => a - b)

              // Find the next day in the cycle
              const nextDays = sortedDays.filter((day) => day > currentDay)
              if (nextDays.length > 0) {
                // Next day is this week
                const daysToAdd = nextDays[0] - currentDay
                nextDueDate.setDate(nextDueDate.getDate() + daysToAdd)
              } else {
                // Next day is next week
                const daysToAdd = 7 - currentDay + sortedDays[0]
                nextDueDate.setDate(nextDueDate.getDate() + daysToAdd)
              }

              newTask.recurring.nextDue = nextDueDate.toISOString()
            } else {
              // If no specific days, just add 7 days
              newTask.recurring.nextDue = new Date(
                new Date(task.recurring.nextDue!).getTime() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString()
            }
            break

          case "monthly":
            const nextMonthDate = new Date(task.recurring.nextDue!)
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
            newTask.recurring.nextDue = nextMonthDate.toISOString()
            break

          case "custom":
            if (task.recurring.interval) {
              newTask.recurring.nextDue = new Date(
                new Date(task.recurring.nextDue!).getTime() + task.recurring.interval * 24 * 60 * 60 * 1000,
              ).toISOString()
            }
            break
        }
      }

      // Add the new task
      updatedTasks.push(newTask)
      tasksUpdated = true
    }

    if (tasksUpdated) {
      setTasks(updatedTasks)
    }
  }, [tasks])

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    if (!user?.id) return
    
    // Add user ID to the task
    const taskWithUserId = {
      ...newTask,
      userId: user.id
    }
    
    // Add to Firestore (subscription will update the UI)
    await addTaskToDb(user.id, taskWithUserId)
  }

  // Handle when ARISE animation completes
  const handleAriseComplete = () => {
    setShowArise(false)

    // Show XP animation immediately after ARISE completes
    if (pendingXP) {
      setXpGained(pendingXP)
      setPendingXP(null)

      // Clear XP animation after it completes
      setTimeout(() => {
        setXpGained(null)
      }, 2000)
    }
  }

  // Update the completeTask function to award different XP based on priority
  const completeTask = async (taskId: string, position: { x: number; y: number }) => {
    if (!user?.id) return
    
    // Find the task 
    const taskToComplete = tasks.find((task) => task.id === taskId)
    if (!taskToComplete) return

    // Update task completion status in Firestore
    // Pass the user ID to ensure the security rules are satisfied
    await updateTask(taskId, { completed: true }, user.id)

    // Add a small delay before showing ARISE animation
    // This helps with audio playback as it's more likely to work after a clear user interaction
    setTimeout(() => {
      // Show ARISE animation
      setShowArise(true)
    }, 100)

    // Calculate XP based on priority
    let xpValue = 10; // Default XP gain
    if (taskToComplete) {
      switch (taskToComplete.priority) {
        case "low":
          xpValue = 5
          break
        case "normal":
          xpValue = 10
          break
        case "high":
          xpValue = 20
          break
        case "urgent":
          xpValue = 40
          break
      }

      // Double XP for recurring tasks (they're more valuable)
      if (taskToComplete.recurring) {
        xpValue *= 2
      }

      // Store the pending XP to show after ARISE animation
      setPendingXP({ value: xpValue, position })

      // Add XP to user stats in Firestore
      const result = await addXP(user.id, xpValue)
      
      // Check if user leveled up
      if (result?.didLevelUp) {
        setShowLevelUp(true)
        
        if (result.previousRank) {
          setPreviousRank(result.previousRank)
        }
      }
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!user?.id) return
    
    try {
      // Delete from Firestore (subscription will update UI)
      await deleteTaskFromDb(taskId, user.id)
      // No need to manually update tasks state as the Firestore subscription will handle it
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="cyber-panel p-8 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-[hsl(var(--neon-blue))] border-r-transparent border-b-[hsl(var(--neon-blue-dark))] border-l-transparent rounded-full mb-4"></div>
          <p className="text-[hsl(var(--neon-blue))] cyber-text">ESTABLISHING CONNECTION...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render the main content
  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <h1
                className="text-3xl md:text-5xl font-bold text-center cyber-text glitch"
                data-text="THE SYSTEM: TASK MATRIX"
              >
                THE SYSTEM: TASK MATRIX
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--neon-blue))] to-transparent"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <UserMenu />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatusWindow stats={stats} />
          </motion.div>

          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
                <h2 className="text-lg font-semibold text-[hsl(var(--neon-blue))] cyber-text">SYSTEM INTERFACE</h2>
              </div>
              <TaskForm onAddTask={addTask} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2 mt-8">
                <LayoutGrid className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
                <h2 className="text-lg font-semibold text-[hsl(var(--neon-blue))] cyber-text">MISSION CONTROL</h2>
              </div>
              <TaskList tasks={tasks} onCompleteTask={completeTask} onDeleteTask={deleteTask} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ARISE Animation */}
      <AriseAnimation show={showArise} onComplete={handleAriseComplete} />

      {/* XP Gained Animation */}
      <AnimatePresence>
        {xpGained && (
          <motion.div
            className="fixed pointer-events-none text-[hsl(var(--neon-blue))] font-bold text-xl z-50"
            initial={{
              opacity: 1,
              scale: 0.5,
              x: xpGained.position.x,
              y: xpGained.position.y,
            }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: xpGained.position.y - 100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            +{xpGained.value} XP
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal newRank={stats.rank} previousRank={previousRank} onClose={() => setShowLevelUp(false)} />
        )}
      </AnimatePresence>
    </main>
  )
}
