import { useState } from 'react'
import type { SessionTimeoutConfig, SessionTimeoutState } from './use-session-timeout.types'
import { DEFAULT_CONFIG } from './use-session-timeout.types'
import { useSessionActivity } from './use-session-activity'
import { useSessionCountdown } from './use-session-countdown'

export type { SessionTimeoutConfig, SessionTimeoutState }

export function useSessionTimeout(config: Partial<SessionTimeoutConfig> = {}) {
  const fullConfig: SessionTimeoutConfig = { ...DEFAULT_CONFIG, ...config }

  const [isWarningShown, setIsWarningShown] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(fullConfig.timeoutMinutes * 60)
  const [isTimedOut, setIsTimedOut] = useState(false)

  const { resetActivity, handleLogout, extendSession } = useSessionActivity({
    config: fullConfig,
    isWarningShown,
    setIsWarningShown,
    setTimeRemaining,
    setIsTimedOut,
  })

  useSessionCountdown({ isWarningShown, setTimeRemaining, handleLogout })

  return {
    isWarningShown,
    timeRemaining,
    isTimedOut,
    extendSession,
    resetActivity,
    config: fullConfig,
  }
}
