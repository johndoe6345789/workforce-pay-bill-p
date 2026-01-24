import { useEffect, useState, useCallback } from 'react'
import { indexedDB, SessionData } from '@/lib/indexed-db'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { login, logout, setCurrentEntity } from '@/store/slices/authSlice'

const ACTIVITY_UPDATE_INTERVAL = 60000
const SESSION_EXPIRY_HOURS = 24

export function useSessionStorage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const currentEntity = useAppSelector(state => state.auth.currentEntity)

  const restoreSession = useCallback(async () => {
    try {
      const session = await indexedDB.getCurrentSession()
      if (session) {
        dispatch(login({
          id: session.userId,
          email: session.email,
          name: session.name,
          role: session.role,
          roleId: session.roleId,
          avatarUrl: session.avatarUrl,
          permissions: session.permissions
        }))
        dispatch(setCurrentEntity(session.currentEntity))
        setSessionId(session.id)
        return session.id
      }
      return null
    } catch (error) {
      console.error('Failed to restore session:', error)
      return null
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [dispatch])

  const createSession = useCallback(async () => {
    if (!user || !isAuthenticated) return

    try {
      const expiresAt = Date.now() + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
      
      const newSessionId = await indexedDB.saveSession({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        roleId: user.roleId,
        avatarUrl: user.avatarUrl,
        permissions: user.permissions,
        currentEntity,
        expiresAt
      })
      
      setSessionId(newSessionId)
      return newSessionId
    } catch (error) {
      console.error('Failed to create session:', error)
      return null
    }
  }, [user, isAuthenticated, currentEntity])

  const updateSession = useCallback(async () => {
    if (!sessionId) return

    try {
      await indexedDB.updateSessionActivity(sessionId)
    } catch (error) {
      console.error('Failed to update session activity:', error)
    }
  }, [sessionId])

  const destroySession = useCallback(async () => {
    if (sessionId) {
      try {
        await indexedDB.deleteSession(sessionId)
        setSessionId(null)
      } catch (error) {
        console.error('Failed to destroy session:', error)
      }
    }
    dispatch(logout())
  }, [sessionId, dispatch])

  const getAllSessions = useCallback(async (): Promise<SessionData[]> => {
    try {
      return await indexedDB.getAllSessions()
    } catch (error) {
      console.error('Failed to get all sessions:', error)
      return []
    }
  }, [])

  const clearAllSessions = useCallback(async () => {
    try {
      await indexedDB.clearAllSessions()
      setSessionId(null)
      dispatch(logout())
    } catch (error) {
      console.error('Failed to clear all sessions:', error)
    }
  }, [dispatch])

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

  return {
    sessionId,
    isLoading,
    createSession,
    destroySession,
    updateSession,
    getAllSessions,
    clearAllSessions,
    restoreSession
  }
}
