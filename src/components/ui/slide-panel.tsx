import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@phosphor-icons/react'

export interface PanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right'
  width?: string
  className?: string
}

export function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '400px',
  className
}: PanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: position === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: position === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 z-50 h-full bg-card shadow-2xl',
              position === 'right' ? 'right-0' : 'left-0',
              className
            )}
            style={{ width }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border p-4">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <button
                  onClick={onClose}
                  className="ml-auto rounded-lg p-2 hover:bg-muted"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
