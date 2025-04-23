"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Terminal, Clock, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskPriority, setTaskPriority] = useState("normal")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Recurring task states
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState<"daily" | "weekly" | "monthly" | "custom">("daily")
  const [recurringInterval, setRecurringInterval] = useState(1)
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const weekdays = [
    { value: 0, label: "SUN" },
    { value: 1, label: "MON" },
    { value: 2, label: "TUE" },
    { value: 3, label: "WED" },
    { value: 4, label: "THU" },
    { value: 5, label: "FRI" },
    { value: 6, label: "SAT" },
  ]

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const calculateNextDueDate = (): string | undefined => {
    if (!isRecurring) return undefined

    const now = new Date()
    let nextDue: Date

    switch (recurringType) {
      case "daily":
        nextDue = new Date(now)
        nextDue.setDate(now.getDate() + 1)
        break

      case "weekly":
        if (selectedDays.length === 0) {
          // If no days selected, default to same day next week
          nextDue = new Date(now)
          nextDue.setDate(now.getDate() + 7)
        } else {
          // Find the next selected day
          const today = now.getDay()
          const nextDays = selectedDays.filter((day) => day > today)

          if (nextDays.length > 0) {
            // Next day is this week
            const daysToAdd = nextDays[0] - today
            nextDue = new Date(now)
            nextDue.setDate(now.getDate() + daysToAdd)
          } else {
            // Next day is next week
            const daysToAdd = 7 - today + selectedDays[0]
            nextDue = new Date(now)
            nextDue.setDate(now.getDate() + daysToAdd)
          }
        }
        break

      case "monthly":
        nextDue = new Date(now)
        nextDue.setMonth(now.getMonth() + 1)
        break

      case "custom":
        nextDue = new Date(now)
        nextDue.setDate(now.getDate() + recurringInterval)
        break

      default:
        return undefined
    }

    return nextDue.toISOString()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (taskName.trim()) {
      setIsSubmitting(true)

      const newTask: Task = {
        id: crypto.randomUUID(),
        name: taskName.trim(),
        description: taskDescription.trim(),
        priority: taskPriority,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      // Add recurring information if enabled
      if (isRecurring) {
        newTask.recurring = {
          type: recurringType,
          nextDue: calculateNextDueDate(),
        }

        if (recurringType === "custom") {
          newTask.recurring.interval = recurringInterval
        }

        if (recurringType === "weekly") {
          newTask.recurring.days = selectedDays.length > 0 ? selectedDays : [new Date().getDay()]
        }
      }

      // Add a small delay to show the submission animation
      setTimeout(() => {
        onAddTask(newTask)
        setTaskName("")
        setTaskDescription("")
        setTaskPriority("normal")
        setIsRecurring(false)
        setRecurringType("daily")
        setRecurringInterval(1)
        setSelectedDays([])
        setIsSubmitting(false)
      }, 400)
    }
  }

  return (
    <div className="cyber-border">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-[hsl(var(--neon-blue))] cyber-text flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          MISSION PARAMETERS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-xs text-gray-400">
              MISSION OBJECTIVE
            </Label>
            <Input
              id="task-name"
              type="text"
              placeholder="Enter mission objective..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-muted border-gray-700 focus-visible:ring-[hsl(var(--neon-blue))] focus-visible:border-[hsl(var(--neon-blue))]"
            />
          </div>

          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                className="flex gap-2"
                key="simple"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(195,100%,40%)] hover:opacity-90 text-white relative overflow-hidden"
                  disabled={!taskName.trim() || isSubmitting}
                >
                  {isSubmitting ? (
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
                      <PlusCircle className="h-4 w-4 mr-2" />
                      DEPLOY MISSION
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(true)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  ADVANCED OPTIONS
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-description" className="text-xs text-gray-400">
                      MISSION DETAILS
                    </Label>
                    <Textarea
                      id="task-description"
                      placeholder="Add mission briefing details..."
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="bg-muted border-gray-700 focus-visible:ring-[hsl(var(--neon-blue))] focus-visible:border-[hsl(var(--neon-blue))] min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-priority" className="text-xs text-gray-400">
                      PRIORITY LEVEL
                    </Label>
                    <Select value={taskPriority} onValueChange={setTaskPriority}>
                      <SelectTrigger
                        id="task-priority"
                        className="bg-muted border-gray-700 focus:ring-[hsl(var(--neon-blue))]"
                      >
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="low" className="text-[hsl(var(--neon-grey))]">
                          LOW PRIORITY (5 XP)
                        </SelectItem>
                        <SelectItem value="normal" className="text-[hsl(var(--dark-blue))]">
                          STANDARD PRIORITY (10 XP)
                        </SelectItem>
                        <SelectItem value="high" className="text-[hsl(var(--neon-blue-light))]">
                          HIGH PRIORITY (15 XP)
                        </SelectItem>
                        <SelectItem value="urgent" className="text-[hsl(var(--neon-blue))]">
                          CRITICAL PRIORITY (20 XP)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recurring Mission Options */}
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recurring"
                        checked={isRecurring}
                        onCheckedChange={(checked) => setIsRecurring(checked === true)}
                      />
                      <Label
                        htmlFor="recurring"
                        className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer"
                      >
                        <Repeat className="h-3 w-3 text-[hsl(var(--neon-blue))]" />
                        RECURRING MISSION
                      </Label>
                    </div>

                    {isRecurring && (
                      <motion.div
                        className="space-y-4 pl-6 border-l border-gray-800"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="recurring-type" className="text-xs text-gray-400">
                            RECURRENCE PATTERN
                          </Label>
                          <Select
                            value={recurringType}
                            onValueChange={(value: "daily" | "weekly" | "monthly" | "custom") =>
                              setRecurringType(value)
                            }
                          >
                            <SelectTrigger
                              id="recurring-type"
                              className="bg-muted border-gray-700 focus:ring-[hsl(var(--neon-blue))]"
                            >
                              <SelectValue placeholder="Select recurrence pattern" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="daily">DAILY</SelectItem>
                              <SelectItem value="weekly">WEEKLY</SelectItem>
                              <SelectItem value="monthly">MONTHLY</SelectItem>
                              <SelectItem value="custom">CUSTOM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {recurringType === "weekly" && (
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">DAYS OF WEEK</Label>
                            <div className="flex flex-wrap gap-2">
                              {weekdays.map((day) => (
                                <Button
                                  key={day.value}
                                  type="button"
                                  size="sm"
                                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                                  className={
                                    selectedDays.includes(day.value)
                                      ? "bg-[hsl(var(--neon-blue))] hover:bg-[hsl(var(--neon-blue)/0.8)] text-white h-8 w-8 p-0"
                                      : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white h-8 w-8 p-0"
                                  }
                                  onClick={() => handleDayToggle(day.value)}
                                >
                                  {day.label.charAt(0)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {recurringType === "custom" && (
                          <div className="space-y-2">
                            <Label htmlFor="recurring-interval" className="text-xs text-gray-400">
                              REPEAT EVERY
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="recurring-interval"
                                type="number"
                                min="1"
                                max="365"
                                value={recurringInterval}
                                onChange={(e) => setRecurringInterval(Number.parseInt(e.target.value) || 1)}
                                className="bg-muted border-gray-700 focus-visible:ring-[hsl(var(--neon-blue))] focus-visible:border-[hsl(var(--neon-blue))] w-20"
                              />
                              <span className="text-gray-400">DAYS</span>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {recurringType === "daily" && "Mission will repeat every day"}
                            {recurringType === "weekly" &&
                              selectedDays.length > 0 &&
                              `Mission will repeat on ${selectedDays.map((d) => weekdays.find((w) => w.value === d)?.label).join(", ")}`}
                            {recurringType === "weekly" &&
                              selectedDays.length === 0 &&
                              "Mission will repeat weekly on the same day"}
                            {recurringType === "monthly" && "Mission will repeat monthly on the same date"}
                            {recurringType === "custom" &&
                              `Mission will repeat every ${recurringInterval} day${recurringInterval > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(195,100%,40%)] hover:opacity-90 text-white relative overflow-hidden"
                      disabled={!taskName.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
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
                          <PlusCircle className="h-4 w-4 mr-2" />
                          DEPLOY MISSION
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsExpanded(false)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      BASIC MODE
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </div>
  )
}
