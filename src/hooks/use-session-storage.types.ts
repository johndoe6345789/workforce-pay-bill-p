import type { SessionData } from '@/lib/indexed-db'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  roleId: string
  avatarUrl?: string
  permissions: string[]
}

export interface SessionActions {
  createSession: () => Promise<string | null | undefined>
  destroySession: () => Promise<void>
  updateSession: () => Promise<void>
  getAllSessions: () => Promise<SessionData[]>
  clearAllSessions: () => Promise<void>
  restoreSession: () => Promise<string | null>
}

export interface SessionState {
  sessionId: string | null
  isLoading: boolean
}

export interface SessionSetters {
  setSessionId: (id: string | null) => void
  setIsLoading: (loading: boolean) => void
  setIsInitialized: (init: boolean) => void
}
