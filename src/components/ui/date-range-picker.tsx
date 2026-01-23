import * as React from 'react'
import { cn } from '@/lib/utils'
import { Calendar, CaretDown } from '@phosphor-icons/react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { format } from 'date-fns'

export interface DateRangePickerProps {
  from?: Date
  to?: Date
  onSelect: (range: { from: Date; to: Date }) => void
  className?: string
  presets?: { label: string; value: () => { from: Date; to: Date } }[]
}

export function DateRangePicker({ from, to, onSelect, className, presets }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const displayValue = from && to
    ? `${format(from, 'MMM d, yyyy')} - ${format(to, 'MMM d, yyyy')}`
    : 'Select date range'

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('justify-start text-left font-normal', className)}
        >
          <Calendar className="mr-2" size={16} />
          {displayValue}
          <CaretDown className="ml-auto" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {presets && (
            <div className="flex flex-col gap-1 border-r border-border p-3">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    onSelect(preset.value())
                    setIsOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <div className="p-3">
            <div className="text-sm text-muted-foreground">
              Custom date range selection would go here
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
