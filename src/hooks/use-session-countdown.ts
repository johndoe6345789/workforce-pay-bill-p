import { useEffect, useRef } from 'react'

interface CountdownDeps {
  isWarningShown: boolean
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>
  handleLogout: () => void
}

export function useSessionCountdown({ isWarningShown, setTimeRemaining, handleLogout }: CountdownDeps) {
  const countdownIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (isWarningShown && !countdownIntervalRef.current) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newValue = prev - 1
          if (newValue <= 0) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current)
              countdownIntervalRef.current = undefined
            }
            handleLogout()
            return 0
          }
          return newValue
        })
      }, 1000)
    }

    if (!isWarningShown && countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = undefined
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = undefined
      }
    }
  }, [isWarningShown, handleLogout, setTimeRemaining])
}
