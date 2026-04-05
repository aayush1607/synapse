import { motion } from 'framer-motion'

interface NeuralPathwayProps {
  strength: number // 0-1
  color: string
  streak: number
  fraying: boolean
}

export function NeuralPathway({ strength, color, streak, fraying }: NeuralPathwayProps) {
  const baseWidth = 2
  const maxWidth = 12
  const width = baseWidth + (maxWidth - baseWidth) * strength
  const opacity = 0.3 + strength * 0.7
  const glowSize = strength * 20

  // Generate a slightly wavy path
  const points = 40
  const pathData = Array.from({ length: points }, (_, i) => {
    const x = (i / (points - 1)) * 100
    const wobble = Math.sin(i * 0.8) * (2 - strength * 1.5)
    const y = 50 + wobble
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div className="w-full h-6 relative">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <filter id={`glow-${color.replace('#', '')}`}>
            <feGaussianBlur stdDeviation={glowSize / 10} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {fraying && (
            <filter id={`fray-${color.replace('#', '')}`}>
              <feTurbulence
                type="turbulence"
                baseFrequency="0.05"
                numOctaves="3"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          )}
        </defs>

        {/* Background dim path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeOpacity={0.1}
          strokeWidth={maxWidth}
          strokeLinecap="round"
        />

        {/* Main pathway */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeOpacity={opacity}
          filter={
            fraying
              ? `url(#fray-${color.replace('#', '')})`
              : `url(#glow-${color.replace('#', '')})`
          }
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: 1,
            strokeOpacity: fraying ? [opacity, opacity * 0.4, opacity] : opacity,
          }}
          transition={{
            pathLength: { duration: 0.8, ease: 'easeOut' },
            strokeOpacity: fraying
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 },
          }}
        />

        {/* Synaptic nodes along the path */}
        {streak > 0 &&
          Array.from({ length: Math.min(streak, 7) }, (_, i) => {
            const pos = ((i + 1) / (Math.min(streak, 7) + 1)) * 100
            const wobble = Math.sin((pos / 100) * points * 0.8) * (2 - strength * 1.5)
            return (
              <motion.circle
                key={i}
                cx={pos}
                cy={50 + wobble}
                r={1.5 + strength * 2}
                fill={color}
                opacity={opacity}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            )
          })}
      </svg>

      {/* Streak label */}
      {streak > 0 && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-mono font-bold px-1.5 py-0.5 rounded"
          style={{ color, textShadow: `0 0 8px ${color}66` }}
        >
          {streak}d
        </div>
      )}
    </div>
  )
}
