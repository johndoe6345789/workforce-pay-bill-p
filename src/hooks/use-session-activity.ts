import { useEffect, useCallback, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toast } from 'sonner'
import type { SessionTimeoutConfig } from './use-session-timeout.types'

interface ActivityDeps {
  config: SessionTimeoutConfig
  isWarningShown: boolean
  setIsWarningShown: (v: boolean) => void
  setTimeRemaining: (v: number) => void
  setIsTimedOut: (v: boolean) => void
}

export function useSessionActivity({
  config, isWarningShown,
  setIsWarningShown, setTimeRemaining, setIsTimedOut,
}: ActivityDeps) {
  const { timeoutMinutes, warningMinutes, checkIntervalSeconds } = config
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const lastActivityRef = useRef(Date.now())
  const checkIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    setTimeRemaining(timeoutMinutes * 60)
    setIsWarningShown(false)
    setIsTimedOut(false)
  }, [timeoutMinutes, setTimeRemaining, setIsWarningShown, setIsTimedOut])

  const handleLogout = useCallback(() => {
    setIsTimedOut(true)
    setIsWarningShown(false)
    dispatch(logout())
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current)
  }, [dispatch, setIsTimedOut, setIsWarningShown])

  const extendSession = useCallback(() => {
    resetActivity()
    toast.success('Session Extended', { description: 'Your session has been extended.', duration: 3000 })
  }, [resetActivity])

  const checkTimeout = useCallback(() => {
    if (!isAuthenticated) return
    const now = Date.now()
    const elapsedSeconds = Math.floor((now - lastActivityRef.current) / 1000)
    const remaining = (timeoutMinutes * 60) - elapsedSeconds
    setTimeRemaining(remaining)

    if (remaining <= 0) {
      handleLogout()
      toast.error('Session Expired', { description: 'You have been logged out due to inactivity.', duration: 5000 })
    } else if (remaining <= warningMinutes * 60 && !isWarningShown) {
      setIsWarningShown(true)
      toast.warning('Session Expiring Soon', { description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`, duration: 10000 })
    }
  }, [isAuthenticated, timeoutMinutes, warningMinutes, isWarningShown, handleLogout, setTimeRemaining, setIsWarningShown])

  useEffect(() => {
    if (!isAuthenticated) {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current)
      setIsWarningShown(false)
      setIsTimedOut(false)
      return
    }
    resetActivity()
    checkIntervalRef.current = setInterval(() => { checkTimeout() }, checkIntervalSeconds * 1000)
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    const handleActivity = () => { if (!isWarningShown) resetActivity() }
    activityEvents.forEach(event => { window.addEventListener(event, handleActivity, { passive: true }) })
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current)
      activityEvents.forEach(event => { window.removeEventListener(event, handleActivity) })
    }
  }, [isAuthenticated, checkIntervalSeconds, checkTimeout, resetActivity, isWarningShown, setIsWarningShown, setIsTimedOut])

  return { resetActivity, handleLogout, extendSession }
}
