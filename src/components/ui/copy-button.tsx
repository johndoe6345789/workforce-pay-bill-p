import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check } from '@phosphor-icons/react'
import { Button } from './button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

export interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  successMessage?: string
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, text, successMessage = 'Copied!', ...props }, ref) => {
    const [copiedText, copy] = useCopyToClipboard()

    const handleCopy = () => {
      copy(text)
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', className)}
        onClick={handleCopy}
        {...props}
      >
        {copiedText ? (
          <Check className="h-4 w-4 text-success" weight="bold" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    )
  }
)

CopyButton.displayName = 'CopyButton'
