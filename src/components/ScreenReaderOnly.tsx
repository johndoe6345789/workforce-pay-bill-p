import { ReactNode, ElementType } from 'react'

interface ScreenReaderOnlyProps {
  children: ReactNode
  as?: ElementType
}

export function ScreenReaderOnly({ children, as: Component = 'span' }: ScreenReaderOnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}
