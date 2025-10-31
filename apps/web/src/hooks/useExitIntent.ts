import { useCallback, useEffect, useRef, useState } from 'react'

interface ExitIntentConfig {
  once?: boolean
  threshold?: number
  delay?: number
}

export function useExitIntent({ once = true, threshold = 32, delay = 1200 }: ExitIntentConfig = {}) {
  const [visible, setVisible] = useState(false)
  const triggeredRef = useRef(false)
  const timerRef = useRef<number>()

  const handleIntent = useCallback(() => {
    if (once && triggeredRef.current) return
    timerRef.current = window.setTimeout(() => {
      setVisible(true)
      triggeredRef.current = true
    }, delay)
  }, [delay, once])

  useEffect(() => {
    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= threshold) {
        handleIntent()
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleIntent()
      }
    }

    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [handleIntent, threshold])

  const dismiss = useCallback(() => setVisible(false), [])

  return { visible, dismiss, reset: () => (triggeredRef.current = false) }
}
