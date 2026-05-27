import type { FilterRule } from './use-filterable-data.types'

export function applyFilter<T>(item: T, rule: FilterRule<T>): boolean {
  const value = item[rule.field]
  const ruleValue = rule.value

  switch (rule.operator) {
    case 'equals':
      return value === ruleValue
    case 'notEquals':
      return value !== ruleValue
    case 'contains':
      return String(value).toLowerCase().includes(String(ruleValue).toLowerCase())
    case 'notContains':
      return !String(value).toLowerCase().includes(String(ruleValue).toLowerCase())
    case 'startsWith':
      return String(value).toLowerCase().startsWith(String(ruleValue).toLowerCase())
    case 'endsWith':
      return String(value).toLowerCase().endsWith(String(ruleValue).toLowerCase())
    case 'greaterThan':
      return Number(value) > Number(ruleValue)
    case 'lessThan':
      return Number(value) < Number(ruleValue)
    case 'greaterThanOrEqual':
      return Number(value) >= Number(ruleValue)
    case 'lessThanOrEqual':
      return Number(value) <= Number(ruleValue)
    case 'in':
      return Array.isArray(ruleValue) && ruleValue.includes(value)
    case 'notIn':
      return Array.isArray(ruleValue) && !ruleValue.includes(value)
    default:
      return true
  }
}
