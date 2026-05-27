export const METRIC_SUB_COLS = [
  { key: 'sum',   label: 'Sum',   cls: 'border-l' },
  { key: 'avg',   label: 'Avg',   cls: '' },
  { key: 'count', label: 'Count', cls: '' },
  { key: 'min',   label: 'Min',   cls: '' },
  { key: 'max',   label: 'Max',   cls: '' },
] as const

export function fmtCell(val: unknown): string | number {
  return typeof val === 'number' ? val.toFixed(2) : (val as string | number) ?? 0
}
