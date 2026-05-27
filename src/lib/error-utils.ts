import { toast } from 'sonner'
import { ValidationError, AuthenticationError, NetworkError } from './error-classes'

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'An unexpected error occurred'
}

export function handleError(error: unknown, context?: string): void {
  const msg = getErrorMessage(error)
  console.error(`[${context ?? 'Error'}]:`, error)
  if (error instanceof ValidationError) {
    toast.error(`Validation Error: ${msg}`)
  } else if (error instanceof AuthenticationError) {
    toast.error(`Authentication Error: ${msg}`)
  } else if (error instanceof NetworkError) {
    toast.error(`Network Error: ${msg}`)
  } else {
    toast.error(context ? `${context}: ${msg}` : msg)
  }
}

export async function handleAsyncError<T>(promise: Promise<T>, context?: string): Promise<T | null> {
  try {
    return await promise
  } catch (error) {
    handleError(error, context)
    return null
  }
}

type SparkWindow = Window & { spark: { kv: { set: (k: string, v: unknown) => void } } }

export function logError(
  error: unknown,
  context?: string,
  additionalData?: Record<string, unknown>
): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error,
    additionalData,
  }
  console.error('[Error Log]:', JSON.stringify(errorInfo, null, 2))
  if (typeof window !== 'undefined' && 'spark' in window) {
    try {
      (window as unknown as SparkWindow).spark.kv.set(`error-${Date.now()}`, errorInfo)
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

export function withErrorHandler<T extends (...args: unknown[]) => unknown>(
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
      return result as ReturnType<T>
    } catch (error) {
      handleError(error, context)
      throw error
    }
  }) as T
}
