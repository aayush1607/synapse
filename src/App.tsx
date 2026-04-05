import { AnimatePresence, motion } from 'framer-motion'
import { useSynapse } from './hooks/useSynapse'
import { Dashboard } from './components/Dashboard'
import { Onboarding } from './components/Onboarding'
import { AddHabit } from './components/AddHabit'
import { EditHabit } from './components/EditHabit'
import { Stats } from './components/Stats'
import { HabitWithStreak } from './types/habit'

export default function App() {
  const {
    habits,
    allCompletions,
    view,
    setView,
    editingHabit,
    setEditingHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    completeOnboarding,
    loaded,
  } = useSynapse()

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-void">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl"
        >
          🧠
        </motion.div>
      </div>
    )
  }

  const handleEdit = (habit: HabitWithStreak) => {
    setEditingHabit(habit)
    setView('edit')
  }

  return (
    <div className="h-screen w-screen bg-void text-white overflow-hidden">
      <div className="max-w-md mx-auto h-full relative">
        <AnimatePresence mode="wait">
          {view === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <Onboarding onComplete={completeOnboarding} />
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <Dashboard
                habits={habits}
                onToggle={toggleCompletion}
                onEdit={handleEdit}
                onAdd={() => setView('add')}
                onStats={() => setView('stats')}
              />
            </motion.div>
          )}

          {view === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <AddHabit
                onAdd={addHabit}
                onBack={() => setView('dashboard')}
                existingCount={habits.length}
              />
            </motion.div>
          )}

          {view === 'edit' && editingHabit && (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <EditHabit
                habit={editingHabit as HabitWithStreak}
                onUpdate={updateHabit}
                onDelete={deleteHabit}
                onBack={() => {
                  setEditingHabit(null)
                  setView('dashboard')
                }}
              />
            </motion.div>
          )}

          {view === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <Stats
                habits={habits}
                completions={allCompletions}
                onBack={() => setView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
