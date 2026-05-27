import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { ComponentItem } from './componentRegistry.types'

export const formItems: ComponentItem[] = [
  {
    id: 'input', name: 'Input', category: ['forms'], description: 'Text input field', tags: ['form', 'text'],
    demo: () => (
      <div className="space-y-2 w-full">
        <Input placeholder="Default input" />
        <Input placeholder="Disabled input" disabled />
        <Input type="email" placeholder="email@example.com" />
        <Input type="password" placeholder="Password" />
      </div>
    )
  },
  {
    id: 'search-input', name: 'Search Input', category: ['forms'], description: 'Search field with icon', tags: ['search', 'filter'], isNew: true,
    demo: () => (
      <div className="relative w-full">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>
    )
  },
  {
    id: 'select', name: 'Select', category: ['forms'], description: 'Dropdown selection', tags: ['form', 'select'],
    demo: () => (
      <Select>
        <SelectTrigger className="w-full"><SelectValue placeholder="Select option" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    )
  },
  {
    id: 'checkbox', name: 'Checkbox', category: ['forms'], description: 'Boolean input control', tags: ['form', 'boolean'],
    demo: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2"><Checkbox id="c1" /><label htmlFor="c1" className="text-sm">Default</label></div>
        <div className="flex items-center gap-2"><Checkbox id="c2" defaultChecked /><label htmlFor="c2" className="text-sm">Checked</label></div>
        <div className="flex items-center gap-2"><Checkbox id="c3" disabled /><label htmlFor="c3" className="text-sm">Disabled</label></div>
      </div>
    )
  },
  {
    id: 'switch', name: 'Switch', category: ['forms'], description: 'Toggle switch control', tags: ['form', 'boolean'],
    demo: () => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2"><Switch id="s1" /><label htmlFor="s1" className="text-sm">Off</label></div>
        <div className="flex items-center gap-2"><Switch id="s2" defaultChecked /><label htmlFor="s2" className="text-sm">On</label></div>
        <div className="flex items-center gap-2"><Switch id="s3" disabled /><label htmlFor="s3" className="text-sm">Disabled</label></div>
      </div>
    )
  },
  {
    id: 'slider', name: 'Slider', category: ['forms'], description: 'Range input control', tags: ['form', 'number'],
    demo: () => (
      <div className="space-y-4 w-full">
        <Slider defaultValue={[50]} max={100} step={1} />
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>
    )
  },
]
