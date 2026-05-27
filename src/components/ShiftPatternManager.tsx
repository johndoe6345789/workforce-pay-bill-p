import { Clock, Plus } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShiftPatternDialog } from '@/components/shift-patterns/ShiftPatternDialog'
import { ShiftPatternCard } from '@/components/shift-patterns/ShiftPatternCard'
import { useShiftPatternManager } from '@/hooks/useShiftPatternManager'

export function ShiftPatternManager() {
  const vm = useShiftPatternManager()

  const stats = [
    { label: vm.t('shiftPatterns.totalTemplates'), value: vm.patterns.length, sub: vm.t('shiftPatterns.activeShiftPatterns') },
    { label: vm.t('shiftPatterns.mostUsed'), value: vm.patterns.length > 0 ? Math.max(...vm.patterns.map(p => p.usageCount)) : 0, sub: vm.t('shiftPatterns.timesApplied') },
    { label: vm.t('shiftPatterns.nightShifts'), value: vm.patterns.filter(p => p.shiftType === 'night').length, sub: vm.t('shiftPatterns.nightShiftTemplates') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('shiftPatterns.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('shiftPatterns.subtitle')}</p>
        </div>
        <ShiftPatternDialog
          open={vm.isCreateDialogOpen || vm.editingPattern !== null}
          onOpenChange={open => { if (open) vm.setIsCreateDialogOpen(true) }}
          editingPattern={vm.editingPattern}
          formData={vm.formData}
          setFormData={vm.setFormData}
          toggleDayOfWeek={vm.toggleDayOfWeek}
          onSave={vm.editingPattern ? vm.handleUpdatePattern : vm.handleCreatePattern}
          onCancel={vm.closeDialog}
          t={vm.t}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub }) => (
          <Card key={label}>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{value}</div>
              <p className="text-sm text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {vm.patterns.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{vm.t('shiftPatterns.noPatterns')}</h3>
          <p className="text-muted-foreground mb-4">{vm.t('shiftPatterns.noPatternsDescription')}</p>
          <Button onClick={() => vm.setIsCreateDialogOpen(true)}>
            <Plus size={18} className="mr-2" />{vm.t('shiftPatterns.createTemplate')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vm.patterns.map(pattern => (
            <ShiftPatternCard
              key={pattern.id}
              pattern={pattern}
              onEdit={vm.handleEditPattern}
              onDuplicate={vm.handleDuplicatePattern}
              onDelete={vm.handleDeletePattern}
              t={vm.t}
            />
          ))}
        </div>
      )}
    </div>
  )
}
