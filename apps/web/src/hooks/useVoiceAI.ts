import { useCallback } from 'react'

import type { AIMessage, VoiceCommand } from '@/types/ai'

import { useAIStore } from '@/stores/aiStore'

export const useVoiceAI = () => {
  const {
    session,
    isListening,
    streamState,
    insights,
    suggestions,
    history,
    setSession,
    setListening,
    setStreamState,
    appendMessage,
    addInsight,
    dismissInsight,
    addSuggestion,
    acknowledgeSuggestion,
  } = useAIStore()

  const toggleListening = useCallback(
    (value?: boolean) => setListening(value ?? !isListening),
    [isListening, setListening]
  )

  const pushMessage = useCallback(
    (message: AIMessage) => appendMessage(message),
    [appendMessage]
  )

  const submitCommand = useCallback(
    (command: VoiceCommand) => {
      appendMessage({
        id: `user-${command.sessionId}-${Date.now()}`,
        role: 'user',
        content: command.transcript,
        createdAt: new Date().toISOString(),
      })
    },
    [appendMessage]
  )

  return {
    session,
    isListening,
    streamState,
    insights,
    suggestions,
    history,
    setSession,
    setStreamState,
    toggleListening,
    appendMessage: pushMessage,
    submitCommand,
    addInsight,
    dismissInsight,
    addSuggestion,
    acknowledgeSuggestion,
  }
}

