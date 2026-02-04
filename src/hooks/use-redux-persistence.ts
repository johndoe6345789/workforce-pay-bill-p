import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'

const REDUX_PERSIST_KEY = 'workforcepro:redux-ui-state'

interface PersistedUIState {
  currentView: string
  searchQuery: string
  sidebarCollapsed?: boolean
  lastVisited?: number
}

export function useReduxPersistence() {
  const currentView = useAppSelector(state => state.ui.currentView)
  const searchQuery = useAppSelector(state => state.ui.searchQuery)

  useEffect(() => {
    const state: PersistedUIState = {
      currentView,
      searchQuery,
      lastVisited: Date.now(),
    }

    try {
      localStorage.setItem(REDUX_PERSIST_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to persist Redux state:', error)
    }
  }, [currentView, searchQuery])

  return null
}

export function loadPersistedUIState(): PersistedUIState | null {
  try {
    const stored = localStorage.getItem(REDUX_PERSIST_KEY)
    if (!stored) return null

    const state = JSON.parse(stored) as PersistedUIState

    const ONE_DAY_MS = 24 * 60 * 60 * 1000
    if (state.lastVisited && Date.now() - state.lastVisited > ONE_DAY_MS) {
      localStorage.removeItem(REDUX_PERSIST_KEY)
      return null
    }

    return state
  } catch (error) {
    console.error('Failed to load persisted Redux state:', error)
    return null
  }
}

export function clearPersistedUIState() {
  try {
    localStorage.removeItem(REDUX_PERSIST_KEY)
  } catch (error) {
    console.error('Failed to clear persisted Redux state:', error)
  }
}
