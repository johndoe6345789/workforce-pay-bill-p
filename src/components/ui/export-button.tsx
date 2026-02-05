import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Download, FileText, Table, FilePdf } from '@phosphor-icons/react'

export interface ExportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onExport: (format: 'csv' | 'json' | 'xlsx' | 'pdf') => void
  formats?: Array<'csv' | 'json' | 'xlsx' | 'pdf'>
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const ExportButton = React.forwardRef<HTMLButtonElement, ExportButtonProps>(
  (
    {
      onExport,
      formats = ['csv', 'json', 'pdf'],
      variant = 'outline',
      size = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleExport = (format: 'csv' | 'json' | 'xlsx' | 'pdf') => {
      onExport(format)
      setIsOpen(false)
    }

    if (formats.length === 1) {
      const format = formats[0] as 'csv' | 'json' | 'xlsx' | 'pdf'
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          onClick={() => handleExport(format)}
          className={className}
          {...props}
        >
          <Download className="mr-2" />
          Export {format.toUpperCase()}
        </Button>
      )
    }

    return (
      <div className="relative">
        <Button
          ref={ref}
          variant={variant}
          size={size}
          onClick={() => setIsOpen(!isOpen)}
          className={className}
          {...props}
        >
          <Download className="mr-2" />
          Export
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-lg z-50">
              <div className="p-1">
                {formats.includes('csv') && (
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    <Table />
                    Export as CSV
                  </button>
                )}
                {formats.includes('json') && (
                  <button
                    onClick={() => handleExport('json')}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    <FileText />
                    Export as JSON
                  </button>
                )}
                {formats.includes('xlsx') && (
                  <button
                    onClick={() => handleExport('xlsx')}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    <FileText />
                    Export as XLSX
                  </button>
                )}
                {formats.includes('pdf') && (
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    <FilePdf />
                    Export as PDF
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
)
ExportButton.displayName = 'ExportButton'

export { ExportButton }
