import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tsh.favorites'
// Seed initial favorites matching initial catalog listings
const DEFAULT_FAVORITES = ['l1', 'l3', 'l5']

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITES
    } catch {
      return DEFAULT_FAVORITES
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
  }, [])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  return { favorites, toggleFavorite, isFavorite, count: favorites.length }
}
