import { useMemo } from 'react'
import { useDebounce } from './use-debounce'

export function useFilter<T>(
  items: T[],
  searchQuery: string,
  filterFn: (item: T, query: string) => boolean,
  debounceDelay: number = 300
): T[] {
  const debouncedQuery = useDebounce(searchQuery, debounceDelay)

  return useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items
    }
    return items.filter(item => filterFn(item, debouncedQuery))
  }, [items, debouncedQuery, filterFn])
}
