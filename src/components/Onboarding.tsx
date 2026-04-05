import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            {/* Animated brain/neuron */}
            <motion.div
              className="text-7xl mb-8"
              animate={{
                filter: [
                  'drop-shadow(0 0 10px #00f0ff44)',
                  'drop-shadow(0 0 30px #00f0ff88)',
                  'drop-shadow(0 0 10px #00f0ff44)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🧠
            </motion.div>

            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              synapse
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto mb-2">
              Hardwire the habit.
            </p>
            <p className="text-white/30 text-xs leading-relaxed max-w-xs mx-auto mb-10">
              Build neural pathways through repetition.
              Every check-in strengthens the connection.
              Miss a day, and the pathway starts to fray.
            </p>

            <motion.button
              onClick={() => setStep(1)}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-semibold text-sm tracking-wide"
              style={{ boxShadow: '0 0 30px #00f0ff22' }}
            >
              Begin
            </motion.button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="how"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              className="text-5xl mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚡
            </motion.div>

            <h2 className="text-2xl font-bold mb-4">How it works</h2>

            <div className="space-y-4 text-left max-w-xs mx-auto mb-10">
              <div className="flex gap-3 items-start">
                <span className="text-neon-cyan text-sm mt-0.5">01</span>
                <p className="text-white/60 text-sm">
                  Add up to <span className="text-white font-medium">5 habits</span>. Less is more — focus beats volume.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-neon-magenta text-sm mt-0.5">02</span>
                <p className="text-white/60 text-sm">
                  <span className="text-white font-medium">Swipe or hold</span> to mark complete. Binary. No half-reps.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-neon-green text-sm mt-0.5">03</span>
                <p className="text-white/60 text-sm">
                  Watch your <span className="text-white font-medium">neural pathway</span> grow thicker with each day. Break the chain and it frays.
                </p>
              </div>
            </div>

            <motion.button
              onClick={onComplete}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-neon-green/20 border border-neon-green/50 text-neon-green font-semibold text-sm tracking-wide"
              style={{ boxShadow: '0 0 30px #39ff1422' }}
            >
              Let's go
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
