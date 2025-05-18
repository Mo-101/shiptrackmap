import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SymbolicResult {
  daysDifference: number
  routePreferences: string[]
  containerType: string
}

interface LiveCognitionOverlayProps {
  /** Sequence of cognitive/logging steps to display */
  steps: string[]
  /** Engine-derived result data */
  result: SymbolicResult
  /** Called when all steps and result display complete */
  onComplete: () => void
}

const TYPE_SPEED = 40 // ms per character
const PAUSE_BETWEEN_STEPS = 700 // ms pause between lines
const PAUSE_BEFORE_RESULT = 500 // ms pause before showing results

export default function LiveCognitionOverlay({ steps, result, onComplete }: LiveCognitionOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const step = steps[currentStepIndex]
      let charIndex = 0
      setDisplayText('')
      const interval = setInterval(() => {
        setDisplayText(prev => prev + step[charIndex])
        charIndex++
        if (charIndex === step.length) {
          clearInterval(interval)
          setTimeout(() => setCurrentStepIndex(prev => prev + 1), PAUSE_BETWEEN_STEPS)
        }
      }, TYPE_SPEED)
      return () => clearInterval(interval)
    }
    if (currentStepIndex === steps.length) {
      setTimeout(() => {
        setShowResult(true)
        setTimeout(onComplete, PAUSE_BEFORE_RESULT)
      }, PAUSE_BEFORE_RESULT)
    }
  }, [currentStepIndex, steps, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 z-50"
    >
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-6">
        {/* Left: Typing log */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-6 shadow-inner h-96 overflow-auto">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mb-4 text-center"
          >
            {/* Neuron icon */}
            <svg width={32} height={32} className="mx-auto text-blue-400">
              <circle cx={16} cy={16} r={8} fill="currentColor" />
            </svg>
          </motion.div>
          <pre className="whitespace-pre-wrap font-mono text-sm text-green-200">
            {displayText}
          </pre>
          {currentStepIndex < steps.length && <p className="mt-2 text-xs text-gray-400">Running step {currentStepIndex + 1} of {steps.length}...</p>}
        </div>

        {/* Right: Results panel */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-6 shadow-inner h-96 overflow-auto flex flex-col justify-center">
          {!showResult ? (
            <p className="text-center text-gray-500 italic">Awaiting analysis results...</p>
          ) : (
            <div className="space-y-4 text-white">
              <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Analysis Complete</h2>
              <p><strong>Days Difference:</strong> {result.daysDifference} days</p>
              <p><strong>Route Preferences:</strong> {result.routePreferences.join(', ')}</p>
              <p><strong>Container Type:</strong> {result.containerType}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
