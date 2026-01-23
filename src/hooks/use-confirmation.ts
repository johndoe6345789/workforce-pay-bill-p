import { useState, useCallback } from 'react'

export interface UseConfirmationOptions {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
}

export interface UseConfirmationReturn {
  isOpen: boolean
  data: UseConfirmationOptions
  confirm: (options?: UseConfirmationOptions) => Promise<boolean>
  handleConfirm: () => void
  handleCancel: () => void
}

export function useConfirmation(): UseConfirmationReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<UseConfirmationOptions>({})
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: UseConfirmationOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setData(options)
      setIsOpen(true)
      setResolveRef(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (resolveRef) {
      resolveRef(true)
    }
    setIsOpen(false)
    setResolveRef(null)
  }, [resolveRef])

  const handleCancel = useCallback(() => {
    if (resolveRef) {
      resolveRef(false)
    }
    setIsOpen(false)
    setResolveRef(null)
  }, [resolveRef])

  return {
    isOpen,
    data,
    confirm,
    handleConfirm,
    handleCancel
  }
}
