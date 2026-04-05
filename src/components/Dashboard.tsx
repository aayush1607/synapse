import { motion, AnimatePresence } from 'framer-motion'
import { HabitWithStreak } from '../types/habit'
import { HabitCard } from './HabitCard'

interface DashboardProps {
  habits: HabitWithStreak[]
  onToggle: (id: string) => boolean
  onEdit: (habit: HabitWithStreak) => void
  onAdd: () => void
  onStats: () => void
}

export function Dashboard({ habits, onToggle, onEdit, onAdd, onStats }: DashboardProps) {
  const doneCount = habits.filter(h => h.todayDone).length
  const totalCount = habits.length
  const allDone = totalCount > 0 && doneCount === totalCount
  const progress = totalCount > 0 ? doneCount / totalCount : 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">synapse</h1>
            <p className="text-xs text-white/40 font-mono mt-0.5">
              {allDone
                ? 'all pathways fired today ⚡'
                : `${doneCount}/${totalCount} complete`}
            </p>
          </div>
          <button
            onClick={onStats}
            className="p-2 rounded-xl bg-surface hover:bg-surface-light transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
              <rect x="2" y="10" width="3" height="8" rx="1" />
              <rect x="8.5" y="6" width="3" height="12" rx="1" />
              <rect x="15" y="2" width="3" height="16" rx="1" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface rounded-full overflow-hidden mt-3">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: allDone
                ? 'linear-gradient(90deg, #39ff14, #00f0ff)'
                : 'linear-gradient(90deg, #bf5fff, #00f0ff)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Habit list */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <AnimatePresence mode="popLayout">
          {habits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <span className="text-5xl mb-4">🧠</span>
              <p className="text-white/40 text-sm">
                No habits yet.<br />
                Tap + to hardwire your first one.
              </p>
            </motion.div>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add button */}
      {habits.length < 5 && (
        <motion.button
          onClick={onAdd}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan text-2xl font-light backdrop-blur-sm shadow-lg"
          style={{ boxShadow: '0 0 30px #00f0ff22' }}
        >
          +
        </motion.button>
      )}
    </div>
  )
}
