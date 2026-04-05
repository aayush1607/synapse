import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { HabitWithStreak, Completion } from '../types/habit'
import { getDaysAgo } from '../utils/storage'

interface StatsProps {
  habits: HabitWithStreak[]
  completions: Completion[]
  onBack: () => void
}

export function Stats({ habits, completions, onBack }: StatsProps) {
  // Build 7-week heat map (49 days)
  const heatMap = useMemo(() => {
    const days: { date: string; ratio: number; dayOfWeek: number }[] = []
    const totalHabits = habits.length || 1

    for (let i = 48; i >= 0; i--) {
      const date = getDaysAgo(i)
      const d = new Date(date)
      const completedCount = completions.filter(c => c.date === date).length
      days.push({
        date,
        ratio: completedCount / totalHabits,
        dayOfWeek: d.getDay(),
      })
    }
    return days
  }, [habits, completions])

  // Weekly success rates
  const weeklyStats = useMemo(() => {
    const weeks: { label: string; rate: number }[] = []
    const totalHabits = habits.length || 1

    for (let w = 6; w >= 0; w--) {
      let completed = 0
      let possible = 0
      for (let d = 0; d < 7; d++) {
        const dayIndex = w * 7 + d
        const date = getDaysAgo(48 - (48 - dayIndex))
        const dayCompletions = completions.filter(c => c.date === date).length
        completed += dayCompletions
        possible += totalHabits
      }
      const rate = possible > 0 ? completed / possible : 0
      weeks.push({ label: `W${7 - w}`, rate })
    }
    return weeks
  }, [habits, completions])

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full px-5 pt-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-surface hover:bg-surface-light transition-colors text-white/60"
        >
          ←
        </button>
        <h2 className="text-xl font-bold">Neural activity</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-8">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {habits.map(h => (
            <div
              key={h.id}
              className="bg-surface rounded-xl p-3 text-center"
            >
              <span className="text-2xl">{h.emoji}</span>
              <p
                className="text-xl font-bold mt-1"
                style={{ color: h.color }}
              >
                {h.streak}
              </p>
              <p className="text-[10px] text-white/30 font-mono">streak</p>
            </div>
          ))}
        </div>

        {/* Heat map */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 mb-3 font-mono uppercase tracking-wider">
            49-day heat map
          </h3>
          <div className="bg-surface rounded-xl p-4">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayLabels.map((d, i) => (
                <div key={i} className="text-[9px] text-white/20 text-center font-mono">
                  {d}
                </div>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {heatMap.map((day, i) => {
                const intensity = day.ratio
                const bg =
                  intensity === 0
                    ? 'rgba(255,255,255,0.03)'
                    : intensity < 0.5
                    ? `rgba(0, 240, 255, ${intensity * 0.6})`
                    : intensity < 1
                    ? `rgba(57, 255, 20, ${intensity * 0.6})`
                    : 'rgba(57, 255, 20, 0.8)'

                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className="aspect-square rounded-sm"
                    style={{
                      background: bg,
                      boxShadow: intensity > 0 ? `0 0 ${intensity * 8}px ${bg}` : 'none',
                    }}
                    title={`${day.date}: ${Math.round(day.ratio * 100)}%`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[9px] text-white/20 font-mono">7 weeks ago</span>
              <span className="text-[9px] text-white/20 font-mono">today</span>
            </div>
          </div>
        </div>

        {/* Weekly bars */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 mb-3 font-mono uppercase tracking-wider">
            Weekly success rate
          </h3>
          <div className="bg-surface rounded-xl p-4 space-y-2">
            {weeklyStats.map((week, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] text-white/30 font-mono w-6">
                  {week.label}
                </span>
                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${week.rate * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        week.rate >= 0.8
                          ? 'linear-gradient(90deg, #39ff14, #00f0ff)'
                          : week.rate >= 0.5
                          ? 'linear-gradient(90deg, #00f0ff, #bf5fff)'
                          : 'linear-gradient(90deg, #ff6b00, #ff00e5)',
                    }}
                  />
                </div>
                <span className="text-xs text-white/40 font-mono w-8 text-right">
                  {Math.round(week.rate * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 66-day milestone */}
        {habits.map(h => (
          <div
            key={h.id}
            className="bg-surface rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span>{h.emoji}</span>
              <span className="text-sm font-medium">{h.name}</span>
              <span className="text-xs text-white/30 ml-auto font-mono">
                {h.streak}/66 days
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (h.streak / 66) * 100)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{
                  background: h.color,
                  boxShadow: `0 0 10px ${h.color}44`,
                }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1 font-mono">
              {h.streak >= 66
                ? '✓ pathway hardwired — automatic behavior achieved'
                : `${66 - h.streak} days until automatic behavior`}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
