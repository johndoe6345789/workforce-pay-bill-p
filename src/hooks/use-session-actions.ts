import { useCallback } from 'react'
import { indexedDB, SessionData } from '@/lib/indexed-db'
import { useAppDispatch } from '@/store/hooks'
import { login, logout, setCurrentEntity } from '@/store/slices/authSlice'
import type { SessionSetters, SessionUser } from './use-session-storage.types'

const SESSION_EXPIRY_HOURS = 24
type Params = { sessionId: string | null; user: SessionUser | null; isAuthenticated: boolean; currentEntity: string | null; setters: SessionSetters }

export function useSessionActions({ sessionId, user, isAuthenticated, currentEntity, setters }: Params) {
  const dispatch = useAppDispatch()
  const { setSessionId, setIsLoading, setIsInitialized } = setters

  const restoreSession = useCallback(async () => {
    try {
      const session = await indexedDB.getCurrentSession()
      if (session) {
        dispatch(login({ id: session.userId, email: session.email, name: session.name,
          role: session.role, roleId: session.roleId, avatarUrl: session.avatarUrl,
          permissions: session.permissions }))
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
  }, [dispatch, setSessionId, setIsLoading, setIsInitialized])

  const createSession = useCallback(async () => {
    if (!user || !isAuthenticated) return
    try {
      const expiresAt = Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
      const newSessionId = await indexedDB.saveSession({
        userId: user.id, email: user.email, name: user.name, role: user.role,
        roleId: user.roleId, avatarUrl: user.avatarUrl, permissions: user.permissions,
        currentEntity, expiresAt,
      })
      setSessionId(newSessionId)
      return newSessionId
    } catch (error) {
      console.error('Failed to create session:', error)
      return null
    }
  }, [user, isAuthenticated, currentEntity, setSessionId])

  const updateSession = useCallback(async () => {
    if (!sessionId) return
    try { await indexedDB.updateSessionActivity(sessionId) }
    catch (error) { console.error('Failed to update session activity:', error) }
  }, [sessionId])

  const destroySession = useCallback(async () => {
    if (sessionId) {
      try { await indexedDB.deleteSession(sessionId); setSessionId(null) }
      catch (error) { console.error('Failed to destroy session:', error) }
    }
    dispatch(logout())
  }, [sessionId, dispatch, setSessionId])

  const getAllSessions = useCallback(async (): Promise<SessionData[]> => {
    try { return await indexedDB.getAllSessions() }
    catch (error) { console.error('Failed to get all sessions:', error); return [] }
  }, [])

  const clearAllSessions = useCallback(async () => {
    try { await indexedDB.clearAllSessions(); setSessionId(null); dispatch(logout()) }
    catch (error) { console.error('Failed to clear all sessions:', error) }
  }, [dispatch, setSessionId])

  return { restoreSession, createSession, updateSession, destroySession, getAllSessions, clearAllSessions }
}
