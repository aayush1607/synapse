import { useState } from 'react'
import { motion } from 'framer-motion'
import { Habit, NEON_COLORS, HABIT_EMOJIS } from '../types/habit'

interface AddHabitProps {
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  onBack: () => void
  existingCount: number
}

export function AddHabit({ onAdd, onBack, existingCount }: AddHabitProps) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [color, setColor] = useState(NEON_COLORS[existingCount % NEON_COLORS.length])
  const [why, setWhy] = useState('')
  const [neverMissTwice, setNeverMissTwice] = useState(true)

  const canSubmit = name.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onAdd({ name: name.trim(), emoji, color, why: why.trim(), neverMissTwice })
    onBack()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full px-5 pt-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-surface hover:bg-surface-light transition-colors text-white/60"
        >
          ←
        </button>
        <h2 className="text-xl font-bold">New pathway</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pb-24">
        {/* Name */}
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2 block">
            Habit
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Meditate, Read, Exercise"
            maxLength={30}
            autoFocus
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
        </div>

        {/* Emoji picker */}
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2 block">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {HABIT_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  emoji === e
                    ? 'bg-surface-light ring-2 ring-neon-cyan/50 scale-110'
                    : 'bg-surface hover:bg-surface-light'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2 block">
            Pathway color
          </label>
          <div className="flex gap-3">
            {NEON_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full transition-all ${
                  color === c ? 'scale-125 ring-2 ring-white/30' : 'hover:scale-110'
                }`}
                style={{
                  background: c,
                  boxShadow: color === c ? `0 0 20px ${c}66` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Why */}
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2 block">
            Your why <span className="text-white/20">(optional)</span>
          </label>
          <input
            type="text"
            value={why}
            onChange={e => setWhy(e.target.value)}
            placeholder="Why does this matter to you?"
            maxLength={100}
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
        </div>

        {/* Never Miss Twice */}
        <div className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium">Never Miss Twice</p>
            <p className="text-xs text-white/30 mt-0.5">
              One rest day won't break your streak
            </p>
          </div>
          <button
            onClick={() => setNeverMissTwice(!neverMissTwice)}
            className={`w-12 h-7 rounded-full transition-all relative ${
              neverMissTwice ? 'bg-neon-green/30' : 'bg-white/10'
            }`}
          >
            <motion.div
              animate={{ x: neverMissTwice ? 22 : 2 }}
              className="absolute top-1 w-5 h-5 rounded-full"
              style={{
                background: neverMissTwice ? '#39ff14' : '#666',
                boxShadow: neverMissTwice ? '0 0 10px #39ff1466' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-void to-transparent">
        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            canSubmit
              ? 'text-void'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
          style={
            canSubmit
              ? {
                  background: color,
                  boxShadow: `0 0 30px ${color}44`,
                }
              : {}
          }
        >
          Hardwire it
        </motion.button>
      </div>
    </motion.div>
  )
}
