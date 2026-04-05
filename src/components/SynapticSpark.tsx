import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  size: number
  delay: number
}

interface SynapticSparkProps {
  active: boolean
  color: string
  onComplete?: () => void
}

export function SynapticSpark({ active, color, onComplete }: SynapticSparkProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        angle: (360 / 16) * i + (Math.random() * 20 - 10),
        distance: 60 + Math.random() * 80,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 0.1,
      }))
      setParticles(newParticles)
      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Central flash */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}88 0%, transparent 70%)`,
              filter: `blur(8px)`,
            }}
          />

          {/* Ring burst */}
          <motion.div
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${color}`,
              boxShadow: `0 0 20px ${color}66`,
            }}
          />

          {/* Particles */}
          {particles.map(p => {
            const rad = (p.angle * Math.PI) / 180
            return (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(rad) * p.distance,
                  y: Math.sin(rad) * p.distance,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.2,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: color,
                  boxShadow: `0 0 ${p.size * 2}px ${color}`,
                  left: '50%',
                  top: '50%',
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                }}
              />
            )
          })}
        </>
      )}
    </AnimatePresence>
  )
}
