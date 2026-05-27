import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useSessionActions } from './use-session-actions'
import { useSessionEffects } from './use-session-effects'

export function useSessionStorage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const user = useAppSelector(state => state.auth.user)
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const currentEntity = useAppSelector(state => state.auth.currentEntity)

  const actions = useSessionActions({
    sessionId,
    user,
    isAuthenticated,
    currentEntity,
    setters: { setSessionId, setIsLoading, setIsInitialized },
  })

  useSessionEffects({
    sessionId,
    isInitialized,
    isAuthenticated,
    user,
    restoreSession: actions.restoreSession,
    createSession: actions.createSession,
    updateSession: actions.updateSession,
  })

  return {
    sessionId,
    isLoading,
    createSession: actions.createSession,
    destroySession: actions.destroySession,
    updateSession: actions.updateSession,
    getAllSessions: actions.getAllSessions,
    clearAllSessions: actions.clearAllSessions,
    restoreSession: actions.restoreSession,
  }
}
