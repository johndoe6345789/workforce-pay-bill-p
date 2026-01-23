import { useState, useEffect, useCallback } from 'react'

export function useIdleTimer(timeout: number = 60000): boolean {
  const [isIdle, setIsIdle] = useState(false)

  const resetTimer = useCallback(() => {
    setIsIdle(false)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleActivity = () => {
      setIsIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => setIsIdle(true), timeout)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    timer = setTimeout(() => setIsIdle(true), timeout)

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      clearTimeout(timer)
    }
  }, [timeout])

  return isIdle
}
