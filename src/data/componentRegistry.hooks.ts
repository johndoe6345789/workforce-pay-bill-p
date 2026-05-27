import type { ComponentItem } from './componentRegistry.types'

export const hookItems: ComponentItem[] = [
  { id: 'use-debounce',       name: 'useDebounce',           category: ['hooks'], description: 'Delay value updates',           tags: ['performance'], isNew: true },
  { id: 'use-throttle',       name: 'useThrottle',           category: ['hooks'], description: 'Limit execution rate',          tags: ['performance'], isNew: true },
  { id: 'use-toggle',         name: 'useToggle',             category: ['hooks'], description: 'Boolean state toggle',          tags: ['state'],       isNew: true },
  { id: 'use-local-storage',  name: 'useLocalStorage',       category: ['hooks'], description: 'Persist state to localStorage', tags: ['storage'],     isNew: true },
  { id: 'use-pagination',     name: 'usePagination',         category: ['hooks'], description: 'Pagination logic',              tags: ['data'],        isNew: true },
  { id: 'use-selection',      name: 'useSelection',          category: ['hooks'], description: 'Multi-item selection',          tags: ['data'],        isNew: true },
  { id: 'use-sort',           name: 'useSort',               category: ['hooks'], description: 'Sortable data',                 tags: ['data'],        isNew: true },
  { id: 'use-filter',         name: 'useFilter',             category: ['hooks'], description: 'Data filtering',               tags: ['data'],        isNew: true },
  { id: 'use-wizard',         name: 'useWizard',             category: ['hooks'], description: 'Multi-step wizard',             tags: ['navigation'],  isNew: true },
  { id: 'use-clipboard',      name: 'useClipboard',          category: ['hooks'], description: 'Copy to clipboard',            tags: ['utility'],     isNew: true },
  { id: 'use-async',          name: 'useAsync',              category: ['hooks'], description: 'Async state management',        tags: ['async'],       isNew: true },
  { id: 'use-fetch',          name: 'useFetch',              category: ['hooks'], description: 'Data fetching',                 tags: ['async', 'api'],isNew: true },
  { id: 'use-form-validation',name: 'useFormValidation',     category: ['hooks'], description: 'Form validation logic',         tags: ['form'],        isNew: true },
  { id: 'use-invoicing',      name: 'useInvoicing',          category: ['hooks'], description: 'Invoice calculations',          tags: ['business'],    isNew: true },
  { id: 'use-payroll',        name: 'usePayrollCalculations',category: ['hooks'], description: 'Payroll calculations',          tags: ['business'],    isNew: true },
  { id: 'use-time-tracking',  name: 'useTimeTracking',       category: ['hooks'], description: 'Time tracking logic',          tags: ['business'],    isNew: true },
  { id: 'use-rate-calculator',name: 'useRateCalculator',     category: ['hooks'], description: 'Rate calculations',             tags: ['business'],    isNew: true },
]
