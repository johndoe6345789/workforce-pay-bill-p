import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { CaretLeft, CaretRight, CaretDoubleLeft, CaretDoubleRight } from '@phosphor-icons/react'

export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true
}: PaginationControlsProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
        >
          <CaretDoubleLeft size={16} />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <CaretLeft size={16} />
      </Button>
      <div className="flex items-center gap-2 px-4">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <CaretRight size={16} />
      </Button>
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
        >
          <CaretDoubleRight size={16} />
        </Button>
      )}
    </div>
  )
}
