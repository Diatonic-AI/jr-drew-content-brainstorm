import { useCallback, useEffect } from 'react'

import type { KeyboardShortcut } from '@/types/settings'

import { useSettingsStore } from '@/stores/settingsStore'

const normalizeCombination = (event: KeyboardEvent) => {
  const parts: string[] = []
  if (event.ctrlKey || event.metaKey) parts.push('Ctrl')
  if (event.shiftKey) parts.push('Shift')
  if (event.altKey) parts.push('Alt')
  const key = event.key.length === 1 ? event.key.toUpperCase() : event.key
  parts.push(key)
  return parts.join('+')
}

export const useKeyboardShortcuts = (
  handlers: Partial<Record<string, () => void>> = {}
) => {
  const { settings, updateSettings } = useSettingsStore()

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const combo = normalizeCombination(event)
      const shortcut = settings.keyboardShortcuts.find(
        (item) =>
          item.enabled &&
          item.bindings.some((binding) => binding.toLowerCase() === combo.toLowerCase())
      )
      if (shortcut) {
        event.preventDefault()
        handlers[shortcut.id]?.()
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [handlers, settings.keyboardShortcuts])

  const registerShortcut = useCallback(
    (shortcut: KeyboardShortcut) => {
      updateSettings({
        keyboardShortcuts: [
          ...settings.keyboardShortcuts.filter((item) => item.id !== shortcut.id),
          shortcut,
        ],
      })
    },
    [settings.keyboardShortcuts, updateSettings]
  )

  const removeShortcut = useCallback(
    (shortcutId: string) => {
      updateSettings({
        keyboardShortcuts: settings.keyboardShortcuts.filter(
          (item) => item.id !== shortcutId
        ),
      })
    },
    [settings.keyboardShortcuts, updateSettings]
  )

  return {
    shortcuts: settings.keyboardShortcuts,
    registerShortcut,
    removeShortcut,
  }
}

