import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { CaretLeft, CaretRight, DotsThree } from '@phosphor-icons/react'

export interface PaginationButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxButtons?: number
}

const PaginationButtons = React.forwardRef<HTMLDivElement, PaginationButtonsProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      showFirstLast = true,
      maxButtons = 7,
      className,
      ...props
    },
    ref
  ) => {
    const getPageNumbers = () => {
      const pages: (number | string)[] = []

      if (totalPages <= maxButtons) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        const leftSiblingIndex = Math.max(currentPage - 1, 1)
        const rightSiblingIndex = Math.min(currentPage + 1, totalPages)

        const showLeftDots = leftSiblingIndex > 2
        const showRightDots = rightSiblingIndex < totalPages - 1

        if (!showLeftDots && showRightDots) {
          const leftItemCount = 3
          for (let i = 1; i <= leftItemCount; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(totalPages)
        } else if (showLeftDots && !showRightDots) {
          pages.push(1)
          pages.push('...')
          const rightItemCount = 3
          for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(totalPages)
        }
      }

      return pages
    }

    const pages = getPageNumbers()

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <CaretLeft />
        </Button>

        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                disabled
              >
                <DotsThree />
              </Button>
            )
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <CaretRight />
        </Button>

        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        )}
      </div>
    )
  }
)
PaginationButtons.displayName = 'PaginationButtons'

export { PaginationButtons }
