import { useKV } from '@github/spark/hooks'

export interface SessionTimeoutPreferences {
  timeoutMinutes: number
  warningMinutes: number
  enabled: boolean
}

const DEFAULT_PREFERENCES: SessionTimeoutPreferences = {
  timeoutMinutes: 30,
  warningMinutes: 5,
  enabled: true,
}

export function useSessionTimeoutPreferences() {
  const [preferences, setPreferences] = useKV<SessionTimeoutPreferences>(
    'session-timeout-preferences',
    DEFAULT_PREFERENCES
  )

  const updateTimeout = (minutes: number) => {
    setPreferences((current) => ({
      ...(current || DEFAULT_PREFERENCES),
      timeoutMinutes: minutes,
    }))
  }

  const updateWarning = (minutes: number) => {
    setPreferences((current) => ({
      ...(current || DEFAULT_PREFERENCES),
      warningMinutes: minutes,
    }))
  }

  const toggleEnabled = (enabled: boolean) => {
    setPreferences((current) => ({
      ...(current || DEFAULT_PREFERENCES),
      enabled,
    }))
  }

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES)
  }

  return {
    preferences,
    updateTimeout,
    updateWarning,
    toggleEnabled,
    resetToDefaults,
  }
}
