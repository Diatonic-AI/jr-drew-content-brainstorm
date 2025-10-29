import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    speechSynthesis: SpeechSynthesis
  }
}

export function useNarrator() {
  const [enabled, setEnabled] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance>()

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!enabled) return
      try {
        if (utteranceRef.current) {
          window.speechSynthesis.cancel()
        }
        utteranceRef.current = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(utteranceRef.current)
      } catch (error) {
        console.warn('Speech synthesis failed', error)
      }
    },
    [enabled]
  )

  return {
    enabled,
    toggle: () => setEnabled(prev => !prev),
    speak
  }
}
