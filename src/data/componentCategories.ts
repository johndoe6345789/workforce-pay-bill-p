import {
  Cube, Package, Palette, Lightning, Stack, CircleNotch, CheckCircle,
  List as ListIcon,
} from '@phosphor-icons/react'
import type React from 'react'
import { components, hooks, allItems } from './componentRegistry'
import type { ComponentCategory } from './componentRegistry'

export interface CategoryItem {
  id: ComponentCategory
  label: string
  icon: React.ElementType
  count: number
}

export const categories: CategoryItem[] = [
  { id: 'all',          label: 'All',          icon: Cube,         count: allItems.length },
  { id: 'buttons',      label: 'Buttons',      icon: Lightning,    count: components.filter(c => c.category.includes('buttons')).length },
  { id: 'forms',        label: 'Forms',        icon: ListIcon,     count: components.filter(c => c.category.includes('forms')).length },
  { id: 'data-display', label: 'Data Display', icon: Package,      count: components.filter(c => c.category.includes('data-display')).length },
  { id: 'feedback',     label: 'Feedback',     icon: CheckCircle,  count: components.filter(c => c.category.includes('feedback')).length },
  { id: 'layout',       label: 'Layout',       icon: Stack,        count: components.filter(c => c.category.includes('layout')).length },
  { id: 'navigation',   label: 'Navigation',   icon: Palette,      count: components.filter(c => c.category.includes('navigation')).length },
  { id: 'overlays',     label: 'Overlays',     icon: Stack,        count: components.filter(c => c.category.includes('overlays')).length },
  { id: 'hooks',        label: 'Hooks',        icon: CircleNotch,  count: hooks.length },
]
