import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BlurFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  duration?: number
  inView?: boolean
  blur?: string
}

const BlurFade = React.forwardRef<HTMLDivElement, BlurFadeProps>(
  (
    {
      className,
      children,
      delay = 0,
      duration = 0.4,
      inView = false,
      blur = '10px',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(!inView)
    const elementRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!inView) {
        setIsVisible(true)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => observer.disconnect()
    }, [inView])

    return (
      <div
        ref={(node) => {
          elementRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          'transition-all',
          !isVisible && 'translate-y-4 opacity-0',
          className
        )}
        style={{
          transitionDuration: `${duration}s`,
          transitionDelay: `${delay}s`,
          filter: !isVisible ? `blur(${blur})` : 'blur(0px)',
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BlurFade.displayName = 'BlurFade'

export { BlurFade }
