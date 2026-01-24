import { toast } from 'sonner'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'AUTH_ERROR', context)
    this.name = 'AuthenticationError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', context)
    this.name = 'NetworkError'
  }
}

export function handleError(error: unknown, context?: string): void {
  const errorMessage = getErrorMessage(error)
  const errorContext = context || 'Error'
  
  console.error(`[${errorContext}]:`, error)
  
  if (error instanceof ValidationError) {
    toast.error(`Validation Error: ${errorMessage}`)
  } else if (error instanceof AuthenticationError) {
    toast.error(`Authentication Error: ${errorMessage}`)
  } else if (error instanceof NetworkError) {
    toast.error(`Network Error: ${errorMessage}`)
  } else {
    toast.error(context ? `${context}: ${errorMessage}` : errorMessage)
  }
}

export async function handleAsyncError<T>(
  promise: Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await promise
  } catch (error) {
    handleError(error, context)
    return null
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return 'An unexpected error occurred'
}

export function logError(error: unknown, context?: string, additionalData?: Record<string, unknown>): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    additionalData,
  }
  
  console.error('[Error Log]:', JSON.stringify(errorInfo, null, 2))
  
  if (typeof window !== 'undefined' && 'spark' in window) {
    try {
      window.spark.kv.set(`error-${Date.now()}`, errorInfo)
    } catch (e) {
      console.error('Failed to persist error:', e)
    }
  }
}

export function createErrorBoundaryFallback(error: Error, resetErrorBoundary: () => void) {
  return {
    title: 'Something went wrong',
    message: error.message || 'An unexpected error occurred',
    action: resetErrorBoundary,
    actionLabel: 'Try again',
  }
}

export function withErrorHandler<T extends (...args: any[]) => any>(
  fn: T,
  context?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    try {
      const result = fn(...args)
      
      if (result instanceof Promise) {
        return result.catch((error) => {
          handleError(error, context)
          throw error
        }) as ReturnType<T>
      }
      
      return result
    } catch (error) {
      handleError(error, context)
      throw error
    }
  }) as T
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch') || error.message.includes('network'))
  )
}

export function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AuthenticationError
}
