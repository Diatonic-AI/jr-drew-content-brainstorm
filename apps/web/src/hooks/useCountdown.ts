import { useCallback, useEffect, useRef, useState } from 'react'

export function useCountdown(seconds: number, pause = false) {
  const [remaining, setRemaining] = useState(seconds)
  const timerRef = useRef<number | null>(null)

  const reset = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
    }
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (pause) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
      return
    }
    timerRef.current = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [pause])

  return { remaining, reset }
}
