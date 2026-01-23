import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  code: string
  language?: string
}

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, code, language, ...props }, ref) => {
    return (
      <div className="relative group">
        {language && (
          <div className="absolute top-2 right-2 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            {language}
          </div>
        )}
        <pre
          ref={ref}
          className={cn(
            'rounded-lg bg-muted p-4 overflow-x-auto font-mono text-sm',
            className
          )}
          {...props}
        >
          <code>{code}</code>
        </pre>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'
