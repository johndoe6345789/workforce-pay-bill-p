import { useEffect } from 'react'

const ACTIVITY_UPDATE_INTERVAL = 60000

interface UseSessionEffectsParams {
  sessionId: string | null
  isInitialized: boolean
  isAuthenticated: boolean
  user: unknown
  restoreSession: () => Promise<string | null>
  createSession: () => Promise<string | null | undefined>
  updateSession: () => Promise<void>
}

export function useSessionEffects({
  sessionId,
  isInitialized,
  isAuthenticated,
  user,
  restoreSession,
  createSession,
  updateSession,
}: UseSessionEffectsParams) {
  useEffect(() => {
    if (!isInitialized) {
      restoreSession()
    }
  }, [isInitialized, restoreSession])

  useEffect(() => {
    if (isAuthenticated && user && !sessionId && isInitialized) {
      createSession()
    }
  }, [isAuthenticated, user, sessionId, isInitialized, createSession])

  useEffect(() => {
    if (!sessionId || !isAuthenticated) return

    const interval = setInterval(() => {
      updateSession()
    }, ACTIVITY_UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [sessionId, isAuthenticated, updateSession])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId) {
        updateSession()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [sessionId, updateSession])
}
