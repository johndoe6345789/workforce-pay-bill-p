export type ComponentCategory =
  | 'all'
  | 'buttons'
  | 'forms'
  | 'data-display'
  | 'feedback'
  | 'layout'
  | 'navigation'
  | 'overlays'
  | 'hooks'

export interface ComponentItem {
  id: string
  name: string
  category: ComponentCategory[]
  description: string
  variant?: string
  path?: string
  isNew?: boolean
  tags?: string[]
  demo?: () => React.ReactNode
}
