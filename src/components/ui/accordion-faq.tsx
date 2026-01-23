import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface AccordionFAQProps {
  items: FAQItem[]
  defaultOpenIndex?: number
  allowMultiple?: boolean
}

export interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

export function AccordionFAQ({
  items,
  defaultOpenIndex,
  allowMultiple = false,
}: AccordionFAQProps) {
  const [openIndexes, setOpenIndexes] = React.useState<Set<number>>(
    new Set(defaultOpenIndex !== undefined ? [defaultOpenIndex] : [])
  )

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) => {
      const newSet = allowMultiple ? new Set(prev) : new Set<number>()
      if (prev.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index)

        return (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <button
              onClick={() => toggleItem(index)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/50',
                isOpen && 'bg-muted/50'
              )}
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
