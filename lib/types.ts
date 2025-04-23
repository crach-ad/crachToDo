export interface Task {
  id: string
  name: string
  description?: string
  priority?: string
  completed: boolean
  createdAt: string
  recurring?: {
    type: "daily" | "weekly" | "monthly" | "custom"
    interval?: number // For custom recurrence (every X days/weeks/months)
    days?: number[] // For weekly recurrence (0 = Sunday, 6 = Saturday)
    nextDue?: string // ISO date string for next occurrence
  }
}

export interface UserStats {
  rank: string
  level: number
  currentXP: number
  requiredXP: number
}
