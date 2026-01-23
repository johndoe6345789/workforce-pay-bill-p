import { useEffect } from 'react'
import { preloadCommonViews } from '@/lib/view-preloader'

export function useViewPreload() {
  useEffect(() => {
    const preloadTimeout = setTimeout(() => {
      preloadCommonViews()
    }, 2000)

    return () => clearTimeout(preloadTimeout)
  }, [])
}
