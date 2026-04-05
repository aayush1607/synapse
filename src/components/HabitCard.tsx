import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { HabitWithStreak } from '../types/habit'
import { SynapticSpark } from './SynapticSpark'
import { NeuralPathway } from './NeuralPathway'
import { triggerHaptic } from '../utils/haptics'

interface HabitCardProps {
  habit: HabitWithStreak
  onToggle: (id: string) => boolean
  onEdit: (habit: HabitWithStreak) => void
}

export function HabitCard({ habit, onToggle, onEdit }: HabitCardProps) {
  const [sparking, setSparking] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-150, 0, 150],
    [`${habit.color}33`, 'transparent', `${habit.color}33`]
  )
  const checkOpacity = useTransform(x, [0, 80], [0, 1])

  const handleComplete = useCallback(() => {
    if (habit.todayDone) return
    const completed = onToggle(habit.id)
    if (completed) {
      setSparking(true)
      setJustCompleted(true)
      triggerHaptic()
      setTimeout(() => setJustCompleted(false), 1000)
    }
  }, [habit.id, habit.todayDone, onToggle])

  const handleUndo = useCallback(() => {
    if (!habit.todayDone) return
    onToggle(habit.id)
  }, [habit.id, habit.todayDone, onToggle])

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (!habit.todayDone) {
        handleComplete()
      }
    }
  }

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      if (!habit.todayDone) {
        handleComplete()
      }
    }, 500)
  }

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  return (
    <motion.div
      layout
      className="relative mb-3 select-none"
    >
      {/* Swipe hint background */}
      <motion.div
        className="absolute inset-0 rounded-2xl flex items-center justify-center"
        style={{ background }}
      >
        <motion.span
          style={{ opacity: checkOpacity }}
          className="text-3xl"
        >
          ✓
        </motion.span>
      </motion.div>

      {/* Main card */}
      <motion.div
        drag={habit.todayDone ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        whileTap={habit.todayDone ? {} : { scale: 0.98 }}
        className={`relative rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-colors ${
          habit.todayDone ? 'bg-surface-light' : 'bg-surface'
        }`}
        style={{
          x,
          borderLeft: `3px solid ${habit.todayDone ? habit.color : habit.color + '44'}`,
          boxShadow: habit.todayDone ? `0 0 20px ${habit.color}22` : 'none',
        }}
      >
        {/* Spark overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
          <SynapticSpark
            active={sparking}
            color={habit.color}
            onComplete={() => setSparking(false)}
          />
        </div>

        {/* Top row: emoji + name + status */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-base truncate ${
                habit.todayDone ? 'line-through opacity-60' : ''
              }`}>
                {habit.name}
              </h3>
              {habit.todayDone && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{ background: habit.color + '22', color: habit.color }}
                >
                  done
                </motion.span>
              )}
            </div>
          </div>
          <button
            onClick={() => onEdit(habit)}
            className="text-white/30 hover:text-white/60 transition-colors p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="2" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="14" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Neural pathway */}
        <div className="mt-2">
          <NeuralPathway
            strength={habit.pathStrength}
            color={habit.color}
            streak={habit.streak}
            fraying={habit.yesterdayMissed && !habit.todayDone}
          />
        </div>

        {/* Quick undo for completed */}
        {habit.todayDone && (
          <motion.button
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleUndo}
            className="mt-2 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            tap to undo
          </motion.button>
        )}

        {/* Swipe hint for uncompleted */}
        {!habit.todayDone && !justCompleted && (
          <p className="mt-1 text-[10px] text-white/20 font-mono">
            swipe or hold to complete
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
