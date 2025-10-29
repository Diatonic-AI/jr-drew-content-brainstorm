import { create } from 'zustand'

import type {
  AIContextSnapshot,
  AIInsight,
  AIMessage,
  AssistantSession,
  CoachSuggestion,
  RealtimeStreamState,
} from '@/types/ai'

interface AIStoreState {
  session?: AssistantSession
  insights: AIInsight[]
  suggestions: CoachSuggestion[]
  context?: AIContextSnapshot
  isListening: boolean
  streamState?: RealtimeStreamState
  history: AIMessage[]
}

interface AIStoreActions {
  setSession: (session?: AssistantSession) => void
  setContext: (context?: AIContextSnapshot) => void
  setStreamState: (state?: RealtimeStreamState) => void
  setListening: (listening: boolean) => void
  appendMessage: (message: AIMessage) => void
  addInsight: (insight: AIInsight) => void
  dismissInsight: (insightId: string) => void
  addSuggestion: (suggestion: CoachSuggestion) => void
  acknowledgeSuggestion: (suggestionId: string) => void
  reset: () => void
}

type AIStore = AIStoreState & AIStoreActions

export const useAIStore = create<AIStore>()((set) => ({
  session: undefined,
  insights: [],
  suggestions: [],
  context: undefined,
  isListening: false,
  streamState: undefined,
  history: [],
  setSession: (session) => set(() => ({ session })),
  setContext: (context) => set(() => ({ context })),
  setStreamState: (streamState) => set(() => ({ streamState })),
  setListening: (isListening) => set(() => ({ isListening })),
  appendMessage: (message) =>
    set((state) => ({
      history: [...state.history, message],
    })),
  addInsight: (insight) =>
    set((state) => ({
      insights: [
        insight,
        ...state.insights.filter((existing) => existing.id !== insight.id),
      ],
    })),
  dismissInsight: (insightId) =>
    set((state) => ({
      insights: state.insights.filter((insight) => insight.id !== insightId),
    })),
  addSuggestion: (suggestion) =>
    set((state) => ({
      suggestions: [
        suggestion,
        ...state.suggestions.filter((existing) => existing.id !== suggestion.id),
      ],
    })),
  acknowledgeSuggestion: (suggestionId) =>
    set((state) => ({
      suggestions: state.suggestions.map((suggestion) =>
        suggestion.id === suggestionId
          ? { ...suggestion, acknowledgedAt: new Date().toISOString() }
          : suggestion
      ),
    })),
  reset: () =>
    set(() => ({
      session: undefined,
      insights: [],
      suggestions: [],
      context: undefined,
      isListening: false,
      streamState: undefined,
      history: [],
    })),
}))

