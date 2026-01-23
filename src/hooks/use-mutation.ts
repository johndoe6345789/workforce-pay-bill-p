import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: Error, variables: TVariables) => void | Promise<void>
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void | Promise<void>
  successMessage?: string
  errorMessage?: string
}

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | undefined
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  reset: () => void
}

export function useMutation<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)
        setData(result)
        
        if (options.successMessage) {
          toast.success(options.successMessage)
        }
        
        await options.onSuccess?.(result, variables)
        await options.onSettled?.(result, null, variables)
        
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        
        if (options.errorMessage) {
          toast.error(options.errorMessage)
        }
        
        await options.onError?.(error, variables)
        await options.onSettled?.(undefined, error, variables)
        
        return undefined
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, options]
  )

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      const result = await mutate(variables)
      if (result === undefined) {
        throw error || new Error('Mutation failed')
      }
      return result
    },
    [mutate, error]
  )

  const reset = useCallback(() => {
    setData(undefined)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    isSuccess: data !== undefined && error === null,
    isError: error !== null,
    reset,
  }
}
