export const MODE_DESCRIPTIONS: Record<string, string> = {
  all:      'All approvers must approve',
  any:      'At least one approver must approve',
  majority: 'More than half must approve',
}

export const STAT_CELLS = [
  { key: 'approved', label: 'Approved', bg: 'bg-success/10',     text: 'text-success' },
  { key: 'pending',  label: 'Pending',  bg: 'bg-muted',          text: 'text-muted-foreground' },
  { key: 'rejected', label: 'Rejected', bg: 'bg-destructive/10', text: 'text-destructive' },
] as const
