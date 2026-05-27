import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MagnifyingGlass, Export, FileCsv, FileXls, FileCode, FilePdf } from '@phosphor-icons/react'
import type React from 'react'

type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf'

const EXPORT_ITEMS: { format: ExportFormat; Icon: React.ElementType; label: string }[] = [
  { format: 'csv', Icon: FileCsv, label: 'Export as CSV' },
  { format: 'xlsx', Icon: FileXls, label: 'Export as Excel' },
  { format: 'json', Icon: FileCode, label: 'Export as JSON' },
  { format: 'pdf', Icon: FilePdf, label: 'Export as PDF' },
]

interface Props {
  showSearch: boolean
  showExport: boolean
  searchQuery: string
  onSearch: (q: string) => void
  onExport: (format: ExportFormat) => void
}

export function DataTableToolbar({ showSearch, showExport, searchQuery, onSearch, onExport }: Props) {
  if (!showSearch && !showExport) return null
  return (
    <div className="flex items-center gap-4">
      {showSearch && (
        <>
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input type="text" placeholder="Search..." value={searchQuery} onChange={e => onSearch(e.target.value)} className="pl-10" />
          </div>
          {searchQuery && <Button variant="outline" onClick={() => onSearch('')} size="sm">Clear Search</Button>}
        </>
      )}
      {showExport && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm"><Export className="mr-2" size={18} />Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {EXPORT_ITEMS.map(({ format, Icon, label }) => (
              <DropdownMenuItem key={format} onClick={() => onExport(format)}>
                <Icon className="mr-2" size={18} />{label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
