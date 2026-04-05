import { AppState, Habit, Completion } from '../types/habit'

const STORAGE_KEY = 'synapse_state'

const defaultState: AppState = {
  habits: [],
  completions: [],
  onboarded: false,
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    return JSON.parse(raw) as AppState
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function getDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function calculateStreak(
  completions: Completion[],
  habitId: string,
  neverMissTwice: boolean
): { streak: number; pathStrength: number; yesterdayMissed: boolean } {
  const dates = completions
    .filter(c => c.habitId === habitId)
    .map(c => c.date)
    .sort()
    .reverse()

  const today = getToday()
  const yesterday = getYesterday()

  let streak = 0
  let currentDate = new Date(today)
  let allowedMiss = neverMissTwice ? 1 : 0
  let missesUsed = 0
  let yesterdayMissed = !dates.includes(yesterday) && dates.includes(today)

  // Count backwards from today
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().slice(0, 10)
    if (dates.includes(dateStr)) {
      streak++
    } else if (missesUsed < allowedMiss && i > 0) {
      missesUsed++
      // Don't increment streak but don't break
    } else if (i === 0) {
      // Today not done yet is ok, don't break
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }

  // Path strength: 0-1 based on streak length, saturates around 66 days
  const pathStrength = Math.min(1, streak / 66)

  return { streak, pathStrength, yesterdayMissed }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
