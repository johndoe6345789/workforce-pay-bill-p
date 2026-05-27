import { Button } from '@/components/ui/button'
import { CheckCircle, User, X } from '@phosphor-icons/react'
import type { ComponentItem } from './componentRegistry.types'

export const buttonItems: ComponentItem[] = [
  {
    id: 'button', name: 'Button', category: ['buttons'], description: 'Primary action trigger', tags: ['interactive', 'action'],
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
      </div>
    )
  },
  {
    id: 'icon-button', name: 'Icon Button', category: ['buttons'], description: 'Icon-only button', tags: ['interactive', 'icon'],
    demo: () => (
      <div className="flex gap-2">
        <Button size="icon"><CheckCircle /></Button>
        <Button size="icon" variant="outline"><User /></Button>
        <Button size="icon" variant="ghost"><X /></Button>
      </div>
    )
  },
]
