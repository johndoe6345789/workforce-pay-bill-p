import { useState, useEffect } from 'react'
import type { SessionData } from '@/lib/indexed-db'
import { useSessionStorage } from '@/hooks/use-session-storage'

export function useSessionManager() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { sessionId, getAllSessions, clearAllSessions, destroySession } = useSessionStorage()

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      const all = await getAllSessions()
      setSessions(all.sort((a, b) => b.lastActivityTimestamp - a.lastActivityTimestamp))
    } catch (err) {
      console.error('Failed to load sessions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadSessions() }, [])

  const endSession = async (id: string) => {
    if (id === sessionId) {
      await destroySession()
    } else {
      const { indexedDB } = await import('@/lib/indexed-db')
      await indexedDB.deleteSession(id)
      await loadSessions()
    }
  }

  const endAllOtherSessions = async () => {
    if (!sessionId) return
    const others = sessions.filter(s => s.id !== sessionId)
    const { indexedDB } = await import('@/lib/indexed-db')
    await Promise.all(others.map(s => indexedDB.deleteSession(s.id)))
    await loadSessions()
  }

  const clearAll = async () => {
    await clearAllSessions()
    setSessions([])
  }

  return { sessions, isLoading, sessionId, endSession, endAllOtherSessions, clearAll }
}
