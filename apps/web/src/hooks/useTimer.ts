import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseTimerOptions {
  durationSeconds: number
  autoStart?: boolean
  onComplete?: () => void
}

export const useTimer = ({
  durationSeconds,
  autoStart = false,
  onComplete,
}: UseTimerOptions) => {
  const [remaining, setRemaining] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<number | null>(null)

  const tick = useCallback(() => {
    setRemaining((current) => {
      if (current <= 1) {
        window.clearInterval(intervalRef.current ?? undefined)
        intervalRef.current = null
        setIsRunning(false)
        onComplete?.()
        return 0
      }
      return current - 1
    })
  }, [onComplete])

  useEffect(() => {
    if (isRunning && intervalRef.current === null) {
      intervalRef.current = window.setInterval(tick, 1000)
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, tick])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setRemaining(durationSeconds)
  }, [durationSeconds])

  useEffect(() => {
    setRemaining(durationSeconds)
  }, [durationSeconds])

  return {
    remainingSeconds: remaining,
    isRunning,
    start,
    pause,
    reset,
  }
}

