export const TIMEOUTS = {
  LOGIN_DELAY: 800,
  TOAST_DURATION: 3000,
  TOAST_ERROR_DURATION: 5000,
  POLLING_INTERVAL: 30000,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000,
} as const

export const FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATE_DISPLAY: 'MMM dd, yyyy',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  DATETIME_DISPLAY: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
  TIME_12H: 'h:mm a',
} as const

export const DURATIONS = {
  INVOICE_DUE_DAYS: 30,
  SESSION_TIMEOUT_MINUTES: 60,
  PASSWORD_RESET_HOURS: 24,
  NOTIFICATION_RETENTION_DAYS: 30,
} as const

export const LIMITS = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_BATCH_SIZE: 100,
  PAGE_SIZE: 20,
  MAX_SEARCH_RESULTS: 100,
  MAX_UPLOAD_FILES: 10,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 254,
  INVOICE_NUMBER_PADDING: 5,
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const
