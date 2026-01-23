import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onFileSelect: (files: FileList | null) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({ className, onFileSelect, accept, multiple = false, maxSize, disabled = false, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      
      if (files && maxSize) {
        const oversizedFiles = Array.from(files).filter(file => file.size > maxSize)
        if (oversizedFiles.length > 0) {
          alert(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`)
          return
        }
      }
      
      onFileSelect(files)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {multiple ? 'Drop files here or click to browse' : 'Drop file here or click to browse'}
          </p>
          {accept && (
            <p className="text-xs text-muted-foreground mt-1">
              Accepted: {accept}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              Max size: {maxSize / 1024 / 1024}MB
            </p>
          )}
        </div>
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
