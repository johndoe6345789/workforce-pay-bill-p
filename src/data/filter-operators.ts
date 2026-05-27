import type { FilterField } from '@/components/AdvancedSearch'

export const TEXT_OPERATORS = [
  { value: 'contains', label: 'Contains' },
  { value: '=', label: 'Equals' },
  { value: 'starts', label: 'Starts with' },
  { value: 'ends', label: 'Ends with' },
]

export const NUMBER_OPERATORS = [
  { value: '=', label: 'Equals' },
  { value: '>', label: 'Greater than' },
  { value: '>=', label: 'Greater or equal' },
  { value: '<', label: 'Less than' },
  { value: '<=', label: 'Less or equal' },
]

export const SELECT_OPERATORS = [
  { value: '=', label: 'Equals' },
  { value: 'in', label: 'In list' },
]

export function getOperators(field?: FilterField) {
  if (field?.type === 'number') return NUMBER_OPERATORS
  if (field?.type === 'select') return SELECT_OPERATORS
  return TEXT_OPERATORS
}
