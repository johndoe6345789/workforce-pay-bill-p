import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from '@phosphor-icons/react'

export interface ImagePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  alt?: string
  onRemove?: () => void
  aspectRatio?: 'square' | 'video' | 'auto'
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  auto: 'aspect-auto',
}

const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(
  (
    {
      className,
      src,
      alt = 'Preview',
      onRemove,
      aspectRatio = 'auto',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-lg border border-border bg-muted',
          aspectRatioClasses[aspectRatio],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity hover:bg-destructive/90 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>
    )
  }
)
ImagePreview.displayName = 'ImagePreview'

export { ImagePreview }
