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

export const DEFAULT_CONFIG: SessionTimeoutConfig = {
  timeoutMinutes: 30,
  warningMinutes: 5,
  checkIntervalSeconds: 30,
}
