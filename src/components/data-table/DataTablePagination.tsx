import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

interface Props {
  currentPage: number
  totalPages: number
  pageSize: number
  startIndex: number
  endIndex: number
  filteredCount: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageSize: (n: number) => void
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
}

export function DataTablePagination({ currentPage, totalPages, pageSize, startIndex, endIndex, filteredCount, totalItems, hasNextPage, hasPreviousPage, onPageSize, onFirst, onPrev, onNext, onLast }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {endIndex} of {filteredCount}
        {filteredCount !== totalItems && ` (filtered from ${totalItems})`}
      </div>
      <div className="flex items-center gap-2">
        <Select value={String(pageSize)} onValueChange={v => onPageSize(Number(v))}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map(n => <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onFirst} disabled={!hasPreviousPage}>First</Button>
          <Button variant="outline" size="sm" onClick={onPrev} disabled={!hasPreviousPage}>Previous</Button>
          <div className="px-3 text-sm">Page {currentPage} of {totalPages}</div>
          <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNextPage}>Next</Button>
          <Button variant="outline" size="sm" onClick={onLast} disabled={!hasNextPage}>Last</Button>
        </div>
      </div>
    </div>
  )
}
