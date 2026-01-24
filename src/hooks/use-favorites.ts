import { useState, useCallback } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'

export interface UseFavoritesOptions {
  storageKey?: string
}

export interface UseFavoritesResult<T> {
  favorites: T[]
  isFavorite: (id: string) => boolean
  addFavorite: (item: T) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (item: T) => void
  clearFavorites: () => void
}

export function useFavorites<T extends { id: string }>(
  options: UseFavoritesOptions = {}
): UseFavoritesResult<T> {
  const { storageKey = 'favorites' } = options
  const [favorites = [], setFavorites] = useIndexedDBState<T[]>(storageKey, [])

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some(item => item.id === id)
    },
    [favorites]
  )

  const addFavorite = useCallback(
    (item: T) => {
      setFavorites(current => {
        const currentArray = current || []
        if (currentArray.some(fav => fav.id === item.id)) {
          return currentArray
        }
        return [...currentArray, item]
      })
    },
    [setFavorites]
  )

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites(current => (current || []).filter(item => item.id !== id))
    },
    [setFavorites]
  )

  const toggleFavorite = useCallback(
    (item: T) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id)
      } else {
        addFavorite(item)
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [setFavorites])

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }
}
