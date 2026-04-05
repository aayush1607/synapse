import { useState, useCallback, useEffect } from 'react'
import { Habit, Completion, HabitWithStreak, AppView } from '../types/habit'
import { loadState, saveState, getToday, calculateStreak, generateId } from '../utils/storage'

export function useSynapse() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [onboarded, setOnboarded] = useState(false)
  const [view, setView] = useState<AppView>('dashboard')
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load on mount
  useEffect(() => {
    const state = loadState()
    setHabits(state.habits)
    setCompletions(state.completions)
    setOnboarded(state.onboarded)
    setLoaded(true)
  }, [])

  // Save on change
  useEffect(() => {
    if (!loaded) return
    saveState({ habits, completions, onboarded })
  }, [habits, completions, onboarded, loaded])

  // Set view based on onboarding state
  useEffect(() => {
    if (loaded && !onboarded) setView('onboarding')
  }, [loaded, onboarded])

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setHabits(prev => [...prev, newHabit])
  }, [])

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h))
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    setCompletions(prev => prev.filter(c => c.habitId !== id))
  }, [])

  const toggleCompletion = useCallback((habitId: string): boolean => {
    const today = getToday()
    const existing = completions.find(c => c.habitId === habitId && c.date === today)

    if (existing) {
      setCompletions(prev => prev.filter(c => !(c.habitId === habitId && c.date === today)))
      return false // uncompleted
    } else {
      setCompletions(prev => [...prev, { habitId, date: today }])
      return true // completed
    }
  }, [completions])

  const completeOnboarding = useCallback(() => {
    setOnboarded(true)
    setView('dashboard')
  }, [])

  const habitsWithStreaks: HabitWithStreak[] = habits
    .filter(h => !h.archivedAt)
    .map(habit => {
      const { streak, pathStrength, yesterdayMissed } = calculateStreak(
        completions,
        habit.id,
        habit.neverMissTwice
      )
      const today = getToday()
      const todayDone = completions.some(c => c.habitId === habit.id && c.date === today)
      const habitCompletions = completions
        .filter(c => c.habitId === habit.id)
        .map(c => c.date)

      return {
        ...habit,
        streak,
        todayDone,
        yesterdayMissed,
        pathStrength,
        completions: habitCompletions,
      }
    })

  return {
    habits: habitsWithStreaks,
    allCompletions: completions,
    view,
    setView,
    editingHabit,
    setEditingHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    onboarded,
    completeOnboarding,
    loaded,
  }
}
