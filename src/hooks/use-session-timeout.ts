import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toast } from 'sonner'

export interface SessionTimeoutConfig {
  timeoutMinutes: number
  warningMinutes: number
  checkIntervalSeconds: number
}

export interface SessionTimeoutState {
  isWarningShown: boolean
  timeRemaining: number
  lastActivity: number
  isTimedOut: boolean
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  timeoutMinutes: 30,
  warningMinutes: 5,
  checkIntervalSeconds: 30,
}

export function useSessionTimeout(config: Partial<SessionTimeoutConfig> = {}) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  const { timeoutMinutes, warningMinutes, checkIntervalSeconds } = fullConfig

  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  const [isWarningShown, setIsWarningShown] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const lastActivityRef = useRef(Date.now())
  const checkIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const countdownIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    setTimeRemaining(timeoutMinutes * 60)
    setIsWarningShown(false)
    setIsTimedOut(false)
  }, [timeoutMinutes])

  const handleLogout = useCallback(() => {
    setIsTimedOut(true)
    setIsWarningShown(false)
    dispatch(logout())
    
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }
  }, [dispatch])

  const extendSession = useCallback(() => {
    resetActivity()
    toast.success('Session Extended', {
      description: 'Your session has been extended.',
      duration: 3000,
    })
  }, [resetActivity])

  const checkTimeout = useCallback(() => {
    if (!isAuthenticated) return

    const now = Date.now()
    const elapsedSeconds = Math.floor((now - lastActivityRef.current) / 1000)
    const remaining = (timeoutMinutes * 60) - elapsedSeconds

    setTimeRemaining(remaining)

    if (remaining <= 0) {
      handleLogout()
      toast.error('Session Expired', {
        description: 'You have been logged out due to inactivity.',
        duration: 5000,
      })
    } else if (remaining <= warningMinutes * 60 && !isWarningShown) {
      setIsWarningShown(true)
      toast.warning('Session Expiring Soon', {
        description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
        duration: 10000,
      })
    }
  }, [isAuthenticated, timeoutMinutes, warningMinutes, isWarningShown, handleLogout])

  useEffect(() => {
    if (!isAuthenticated) {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      setIsWarningShown(false)
      setIsTimedOut(false)
      return
    }

    resetActivity()

    checkIntervalRef.current = setInterval(() => {
      checkTimeout()
    }, checkIntervalSeconds * 1000)

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    const handleActivity = () => {
      if (!isWarningShown) {
        resetActivity()
      }
    }

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, checkIntervalSeconds, checkTimeout, resetActivity, isWarningShown])

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
  }, [isWarningShown, handleLogout])

  return {
    isWarningShown,
    timeRemaining,
    isTimedOut,
    extendSession,
    resetActivity,
    config: fullConfig,
  }
}
