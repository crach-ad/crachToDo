"use client"

import type React from "react"

import { CheckCircle, Trash2, Clock, AlertTriangle, Flag, Zap, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, isToday, isTomorrow } from "date-fns"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  onCompleteTask: (id: string, position: { x: number; y: number }) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onCompleteTask, onDeleteTask }: TaskListProps) {
  const [completingTask, setCompletingTask] = useState<string | null>(null)
  const [deletingTask, setDeletingTask] = useState<string | null>(null)

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM d, h:mm a")
  }

  const formatRecurringDate = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)

    if (isToday(date)) {
      return "Today"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else {
      return format(date, "MMM d")
    }
  }

  const getRecurringText = (task: Task) => {
    if (!task.recurring) return null

    switch (task.recurring.type) {
      case "daily":
        return "Repeats daily"
      case "weekly":
        if (task.recurring.days && task.recurring.days.length > 0) {
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          const days = task.recurring.days.map((d) => dayNames[d]).join(", ")
          return `Repeats weekly on ${days}`
        }
        return "Repeats weekly"
      case "monthly":
        return "Repeats monthly"
      case "custom":
        return `Repeats every ${task.recurring.interval} day${task.recurring.interval !== 1 ? "s" : ""}`
      default:
        return "Recurring"
    }
  }

  const getPriorityIcon = (priority = "normal") => {
    switch (priority) {
      case "low":
        return <Flag className="h-4 w-4 text-[hsl(var(--neon-grey))]" />
      case "high":
        return <Flag className="h-4 w-4 text-[hsl(var(--neon-blue-light))]" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-[hsl(var(--neon-blue))]" />
      default:
        return <Flag className="h-4 w-4 text-[hsl(var(--dark-blue))]" />
    }
  }

  const getPriorityClass = (priority = "normal") => {
    switch (priority) {
      case "low":
        return "border-[hsl(var(--neon-grey))]"
      case "high":
        return "border-[hsl(var(--neon-blue-light))]"
      case "urgent":
        return "border-[hsl(var(--neon-blue))]"
      default:
        return ""
    }
  }

  const handleCompleteTask = (taskId: string, event: React.MouseEvent) => {
    // Get the position of the click for the XP animation
    const position = {
      x: event.clientX,
      y: event.clientY,
    }

    setCompletingTask(taskId)

    // Add a small delay to show the completion animation
    setTimeout(() => {
      onCompleteTask(taskId, position)
      setCompletingTask(null)
    }, 600)
  }

  const handleDeleteTask = (taskId: string) => {
    setDeletingTask(taskId)

    // Add a small delay to show the deletion animation
    setTimeout(() => {
      onDeleteTask(taskId)
      setDeletingTask(null)
    }, 300)
  }

  return (
    <div className="cyber-border">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-[hsl(var(--neon-blue))] cyber-text flex items-center gap-2">
          <Zap className="h-5 w-5" />
          ACTIVE MISSIONS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--neon-blue))] pulse"></span>
              PENDING MISSIONS ({pendingTasks.length})
            </h3>
            <ul className="space-y-3">
              <AnimatePresence>
                {pendingTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    className={`cyber-panel ${getPriorityClass(task.priority)} p-3 rounded-lg transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: completingTask === task.id ? [1, 1.05, 0] : 0.8,
                      transition: {
                        duration: completingTask === task.id ? 0.6 : 0.3,
                        ease: completingTask === task.id ? "backOut" : "easeInOut",
                      },
                    }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleCompleteTask(task.id, e)}
                          className={`h-6 w-6 rounded-full text-gray-400 hover:text-[hsl(var(--neon-blue))] hover:bg-[hsl(var(--neon-blue))/0.1] mt-0.5 ${
                            completingTask === task.id ? "animate-ping" : ""
                          }`}
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span className="sr-only">Complete task</span>
                        </Button>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{task.name}</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>{getPriorityIcon(task.priority)}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {task.recurring && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-[hsl(var(--neon-blue))]">
                                      <Repeat className="h-4 w-4" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getRecurringText(task)}</p>
                                    {task.recurring.nextDue && (
                                      <p className="text-xs mt-1">
                                        Next: {formatRecurringDate(task.recurring.nextDue)}
                                      </p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          {task.description && <p className="text-sm text-gray-300 mt-1">{task.description}</p>}
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(task.createdAt)}
                            </p>

                            {task.recurring?.nextDue && (
                              <p className="text-xs text-[hsl(var(--neon-blue))] flex items-center">
                                <Repeat className="h-3 w-3 mr-1" />
                                Next: {formatRecurringDate(task.recurring.nextDue)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className={`h-6 w-6 rounded-full text-gray-400 hover:text-[hsl(var(--neon-red))] hover:bg-[hsl(var(--neon-red))/0.1] ${
                          deletingTask === task.id ? "animate-pulse" : ""
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete task</span>
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ) : (
          <motion.div
            className="text-center py-6 text-gray-500 border border-dashed border-gray-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>NO ACTIVE MISSIONS DETECTED</p>
            <p className="text-xs mt-1">Deploy a new mission to start leveling up</p>
          </motion.div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--neon-blue))]"></span>
              COMPLETED MISSIONS ({completedTasks.length})
            </h3>
            <ul className="space-y-2">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    className="p-3 bg-muted/50 rounded-lg opacity-70"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 0.7, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
                        </div>
                        <div>
                          <p className="font-medium line-through">{task.name}</p>
                          {task.description && (
                            <p className="text-sm text-gray-400 mt-1 line-through">{task.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(task.createdAt)}
                            </p>

                            {task.recurring && (
                              <p className="text-xs text-[hsl(var(--neon-blue))] flex items-center">
                                <Repeat className="h-3 w-3 mr-1" />
                                {getRecurringText(task)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-6 w-6 rounded-full text-gray-400 hover:text-[hsl(var(--neon-red))] hover:bg-[hsl(var(--neon-red))/0.1]"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete task</span>
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </CardContent>
    </div>
  )
}
