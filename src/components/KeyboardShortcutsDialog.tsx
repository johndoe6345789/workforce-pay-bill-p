import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Keyboard } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SHORTCUTS: { keys: string[]; descriptionKey: string; category: string }[] = [
  { keys: ['Ctrl', 'K'],          descriptionKey: 'keyboardShortcuts.shortcuts.openQuickSearch',     category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Ctrl', '?'],          descriptionKey: 'keyboardShortcuts.shortcuts.showKeyboardShortcuts', category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Escape'],             descriptionKey: 'keyboardShortcuts.shortcuts.closeDialogs',          category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Alt', '1'],           descriptionKey: 'keyboardShortcuts.shortcuts.goToDashboard',         category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Alt', '2'],           descriptionKey: 'keyboardShortcuts.shortcuts.goToTimesheets',        category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Alt', '3'],           descriptionKey: 'keyboardShortcuts.shortcuts.goToBilling',           category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Alt', '4'],           descriptionKey: 'keyboardShortcuts.shortcuts.goToPayroll',           category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Alt', '5'],           descriptionKey: 'keyboardShortcuts.shortcuts.goToCompliance',        category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Alt', 'N'],           descriptionKey: 'keyboardShortcuts.shortcuts.openNotifications',     category: 'keyboardShortcuts.categories.navigation' },
  { keys: ['Tab'],                descriptionKey: 'keyboardShortcuts.shortcuts.moveFocusForward',      category: 'keyboardShortcuts.categories.general' },
  { keys: ['Shift', 'Tab'],       descriptionKey: 'keyboardShortcuts.shortcuts.moveFocusBackward',     category: 'keyboardShortcuts.categories.general' },
  { keys: ['Enter'],              descriptionKey: 'keyboardShortcuts.shortcuts.activateButton',        category: 'keyboardShortcuts.categories.general' },
  { keys: ['Space'],              descriptionKey: 'keyboardShortcuts.shortcuts.toggleCheckbox',        category: 'keyboardShortcuts.categories.general' },
  { keys: ['↑', '↓', '←', '→'],  descriptionKey: 'keyboardShortcuts.shortcuts.navigateTableCells',   category: 'keyboardShortcuts.categories.tables' },
  { keys: ['Enter'],              descriptionKey: 'keyboardShortcuts.shortcuts.openRowDetails',        category: 'keyboardShortcuts.categories.tables' },
  { keys: ['Ctrl', 'A'],          descriptionKey: 'keyboardShortcuts.shortcuts.selectAllRows',         category: 'keyboardShortcuts.categories.tables' },
]

export function KeyboardShortcutsDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation()

  const grouped = SHORTCUTS.reduce<Record<string, typeof SHORTCUTS>>((acc, s) => {
    const cat = t(s.category)
    ;(acc[cat] ??= []).push(s)
    return acc
  }, {})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        aria-labelledby="keyboard-shortcuts-title"
        aria-describedby="keyboard-shortcuts-description"
      >
        <DialogHeader>
          <DialogTitle id="keyboard-shortcuts-title" className="flex items-center gap-2">
            <Keyboard size={24} />{t('keyboardShortcuts.title')}
          </DialogTitle>
          <DialogDescription id="keyboard-shortcuts-description">
            {t('keyboardShortcuts.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{category}</h3>
              <div className="space-y-2">
                {items.map((shortcut, i) => (
                  <div key={`${category}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50">
                    <span className="text-sm">{t(shortcut.descriptionKey)}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, ki) => (
                        <span key={ki} className="flex items-center gap-1">
                          {ki > 0 && <span className="text-muted-foreground text-xs">+</span>}
                          <Badge variant="outline" className="font-mono text-xs px-2 py-1">{key}</Badge>
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
            <strong>{t('keyboardShortcuts.note')}</strong>{' '}
            {t('keyboardShortcuts.macNote', { cmd: '⌘ Cmd', ctrl: 'Ctrl' })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
