export interface Habit {
  id: string
  name: string
  emoji: string
  color: string
  why: string
  neverMissTwice: boolean
  createdAt: string // ISO date
  archivedAt?: string
}

export interface Completion {
  habitId: string
  date: string // YYYY-MM-DD
}

export interface HabitWithStreak extends Habit {
  streak: number
  todayDone: boolean
  yesterdayMissed: boolean
  pathStrength: number // 0-1, how "myelinated" the path is
  completions: string[] // dates
}

export type AppView = 'onboarding' | 'dashboard' | 'add' | 'stats' | 'edit'

export interface AppState {
  habits: Habit[]
  completions: Completion[]
  onboarded: boolean
}

export const NEON_COLORS = [
  '#00f0ff', // cyan
  '#ff00e5', // magenta
  '#39ff14', // green
  '#ff6b00', // orange
  '#bf5fff', // purple
] as const

export const HABIT_EMOJIS = [
  '🧘', '💪', '📚', '💧', '🏃', '✍️', '🧠', '😴', '🥗', '🎯',
  '🧹', '💊', '🎵', '🌿', '📵', '🙏', '🦷', '🐕', '💰', '⏰',
] as const
