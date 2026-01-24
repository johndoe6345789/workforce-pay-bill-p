import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Keyboard } from '@phosphor-icons/react'

type KeyboardShortcut = {
  keys: string[]
  description: string
  category: string
}

const shortcuts: KeyboardShortcut[] = [
  {
    keys: ['Ctrl', 'K'],
    description: 'Open quick search',
    category: 'Navigation'
  },
  {
    keys: ['Ctrl', '?'],
    description: 'Show keyboard shortcuts',
    category: 'Navigation'
  },
  {
    keys: ['Escape'],
    description: 'Close dialogs or modals',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '1'],
    description: 'Go to Dashboard',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '2'],
    description: 'Go to Timesheets',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '3'],
    description: 'Go to Billing',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '4'],
    description: 'Go to Payroll',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '5'],
    description: 'Go to Compliance',
    category: 'Navigation'
  },
  {
    keys: ['Alt', 'N'],
    description: 'Open notifications',
    category: 'Navigation'
  },
  {
    keys: ['Tab'],
    description: 'Move focus forward',
    category: 'General'
  },
  {
    keys: ['Shift', 'Tab'],
    description: 'Move focus backward',
    category: 'General'
  },
  {
    keys: ['Enter'],
    description: 'Activate button or link',
    category: 'General'
  },
  {
    keys: ['Space'],
    description: 'Toggle checkbox or select',
    category: 'General'
  },
  {
    keys: ['↑', '↓', '←', '→'],
    description: 'Navigate table cells',
    category: 'Tables'
  },
  {
    keys: ['Enter'],
    description: 'Open row details',
    category: 'Tables'
  },
  {
    keys: ['Ctrl', 'A'],
    description: 'Select all rows',
    category: 'Tables'
  },
]

const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
  if (!acc[shortcut.category]) {
    acc[shortcut.category] = []
  }
  acc[shortcut.category].push(shortcut)
  return acc
}, {} as Record<string, KeyboardShortcut[]>)

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        aria-labelledby="keyboard-shortcuts-title"
        aria-describedby="keyboard-shortcuts-description"
      >
        <DialogHeader>
          <DialogTitle id="keyboard-shortcuts-title" className="flex items-center gap-2">
            <Keyboard size={24} />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription id="keyboard-shortcuts-description">
            Use these keyboard shortcuts to navigate and interact with WorkForce Pro more efficiently.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center gap-1">
                          {keyIndex > 0 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-2 py-1"
                          >
                            {key}
                          </Badge>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> On Mac, use <Badge variant="outline" className="font-mono text-xs">⌘ Cmd</Badge> instead of <Badge variant="outline" className="font-mono text-xs">Ctrl</Badge>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
