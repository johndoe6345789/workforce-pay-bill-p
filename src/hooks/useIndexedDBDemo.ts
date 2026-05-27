import { useState } from 'react'
import { toast } from 'sonner'
import { useIndexedDBState, useSessionStorage } from '@/hooks'

/** Manages all state and actions for the IndexedDB demo panel. */
export function useIndexedDBDemo() {
  const [testKey, setTestKey] = useState('demo-key')
  const [testValue, setTestValue] = useState('Hello IndexedDB!')
  const [storedValue, setStoredValue, deleteStoredValue] =
    useIndexedDBState<string>(testKey, '')
  const { sessionId, getAllSessions } = useSessionStorage()
  const [sessionCount, setSessionCount] = useState(0)

  const handleSave = () => {
    setStoredValue(testValue)
    toast.success('Value saved to IndexedDB')
  }

  const handleLoad = () => {
    setTestValue(storedValue)
    toast.info('Value loaded from IndexedDB')
  }

  const handleDelete = () => {
    deleteStoredValue()
    setTestValue('')
    toast.success('Value deleted from IndexedDB')
  }

  const handleLoadSessions = async () => {
    const sessions = await getAllSessions()
    setSessionCount(sessions.length)
    toast.info(`Found ${sessions.length} active session(s)`)
  }

  return {
    testKey, setTestKey,
    testValue, setTestValue,
    storedValue, sessionId, sessionCount,
    handleSave, handleLoad, handleDelete,
    handleLoadSessions,
  }
}
