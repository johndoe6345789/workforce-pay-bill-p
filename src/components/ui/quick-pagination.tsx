import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

export interface QuickPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function QuickPagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: QuickPaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <CaretLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        Next
        <CaretRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
