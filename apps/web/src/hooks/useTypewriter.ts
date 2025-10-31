import { useEffect, useState } from 'react'

export function useTypewriter(text: string, speed = 25, freeze = false) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (freeze) return
    setDisplayed('')
  }, [text, freeze])

  useEffect(() => {
    if (freeze) return
    const id = window.setInterval(() => {
      setDisplayed(prev => {
        if (prev.length >= text.length) {
          window.clearInterval(id)
          return prev
        }
        return text.slice(0, prev.length + 1)
      })
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed, freeze])

  return displayed.length ? displayed : freeze ? text : ''
}
