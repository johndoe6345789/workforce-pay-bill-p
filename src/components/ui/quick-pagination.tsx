import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

export interface QuickPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
  showInfo?: boolean
  className?: string
}

const QuickPagination = React.forwardRef<HTMLDivElement, QuickPaginationProps>(
  ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    itemsPerPage,
    totalItems,
    showInfo = false,
    className 
  }, ref) => {
    const canGoPrevious = currentPage > 1
    const canGoNext = currentPage < totalPages

    const startItem = itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null
    const endItem = itemsPerPage && totalItems 
      ? Math.min(currentPage * itemsPerPage, totalItems) 
      : null

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between gap-4', className)}
      >
        {showInfo && startItem && endItem && totalItems ? (
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            <CaretLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium">{currentPage}</span>
            <span className="text-sm text-muted-foreground">of</span>
            <span className="text-sm font-medium">{totalPages}</span>
          </div>

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
      </div>
    )
  }
)
QuickPagination.displayName = 'QuickPagination'

export { QuickPagination }
