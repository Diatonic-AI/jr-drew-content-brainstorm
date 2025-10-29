import { create } from 'zustand'

export type SessionStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface SessionSummary {
  id: string
  title: string
  owner: string
  status: SessionStatus
  updatedAt: string
  progress: number
}

interface EntitiesState {
  sessions: SessionSummary[]
  updateSessionStatus: (id: string, status: SessionStatus) => void
  recordProgress: (id: string, progress: number) => void
  addSession: (session: SessionSummary) => void
}

const initialSessions: SessionSummary[] = [
  {
    id: 'sess-1001',
    title: 'RevOps roll-up for Q4',
    owner: 'Angela Smith',
    status: 'running',
    updatedAt: '2025-10-28T14:32:00Z',
    progress: 64
  },
  {
    id: 'sess-1002',
    title: 'Customer sentiment synthesis',
    owner: 'Ravi Patel',
    status: 'idle',
    updatedAt: '2025-10-28T09:10:00Z',
    progress: 20
  },
  {
    id: 'sess-1003',
    title: 'Pipeline health QA',
    owner: 'Lina Gomez',
    status: 'completed',
    updatedAt: '2025-10-27T19:45:00Z',
    progress: 100
  }
]

export const useEntitiesStore = create<EntitiesState>((set) => ({
  sessions: initialSessions,
  updateSessionStatus: (id, status) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, status } : session
      )
    })),
  recordProgress: (id, progress) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, progress } : session
      )
    })),
  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions]
    }))
}))
