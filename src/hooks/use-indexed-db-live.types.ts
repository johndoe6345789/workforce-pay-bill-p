export type ChangeListener = () => void
export type StoreListeners = Map<string, Set<ChangeListener>>

export interface UseIndexedDBLiveOptions {
  enabled?: boolean
  pollingInterval?: number
}

export type UseIndexedDBLiveReturn<T> = [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void,
  () => Promise<void>
]
