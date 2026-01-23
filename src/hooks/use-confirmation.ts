import { useState, useCallback } from 'react'

export interface ConfirmationOptions {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
}

export interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    onConfirm: null,
    onCancel: null,
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'default'
  })

  const confirm = useCallback((options?: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        title: options?.title || 'Are you sure?',
        message: options?.message || 'This action cannot be undone.',
        confirmLabel: options?.confirmLabel || 'Confirm',
        cancelLabel: options?.cancelLabel || 'Cancel',
        variant: options?.variant || 'default',
        onConfirm: () => {
          setState(prev => ({ ...prev, isOpen: false }))
          resolve(true)
        },
        onCancel: () => {
          setState(prev => ({ ...prev, isOpen: false }))
          resolve(false)
        }
      })
    })
  }, [])

  const close = useCallback(() => {
    if (state.onCancel) {
      state.onCancel()
    }
  }, [state])

  return {
    ...state,
    confirm,
    close
  }
}
