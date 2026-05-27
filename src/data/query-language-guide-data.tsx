export const OPERATOR_GROUPS: { titleKey: string; items: { op: string; descKey: string }[] }[] = [
  {
    titleKey: 'queryGuide.textOperators',
    items: [
      { op: ':',      descKey: 'queryGuide.contains' },
      { op: '=',      descKey: 'queryGuide.equals' },
      { op: 'starts', descKey: 'queryGuide.startsWith' },
      { op: 'ends',   descKey: 'queryGuide.endsWith' },
    ],
  },
  {
    titleKey: 'queryGuide.numberOperators',
    items: [
      { op: '=',  descKey: 'queryGuide.equals' },
      { op: '>',  descKey: 'queryGuide.greaterThan' },
      { op: '>=', descKey: 'queryGuide.greaterThanOrEqual' },
      { op: '<',  descKey: 'queryGuide.lessThan' },
      { op: '<=', descKey: 'queryGuide.lessThanOrEqual' },
    ],
  },
  {
    titleKey: 'queryGuide.dateOperators',
    items: [
      { op: 'before',  descKey: 'queryGuide.before' },
      { op: 'after',   descKey: 'queryGuide.after' },
      { op: 'between', descKey: 'queryGuide.between' },
    ],
  },
]

export const EXAMPLE_SECTIONS: { title: string; badge: string; examples: { query: string; description: string }[] }[] = [
  {
    title: 'navigation.timesheets',
    badge: 'status, hours, amount',
    examples: [
      { query: 'status = pending',                              description: 'Show only pending timesheets' },
      { query: 'workerName : Smith hours > 40',                description: "Find Smith's timesheets over 40 hours" },
      { query: 'status in pending,approved sort amount desc',   description: 'Pending or approved, sorted by amount high to low' },
      { query: 'clientName : Acme amount >= 1000',             description: 'Acme Corp timesheets worth £1000 or more' },
    ],
  },
  {
    title: 'Invoices',
    badge: 'status, amount, currency',
    examples: [
      { query: 'status = overdue',                            description: 'Show all overdue invoices' },
      { query: 'amount > 5000 currency = GBP',               description: 'High-value GBP invoices' },
      { query: 'clientName : Tech status in sent,overdue',   description: 'Unpaid invoices for Tech clients' },
      { query: 'status = paid sort amount desc',             description: 'Paid invoices, largest first' },
    ],
  },
  {
    title: 'Expenses',
    badge: 'category, billable, amount',
    examples: [
      { query: 'category = Travel billable = true',                        description: 'Billable travel expenses' },
      { query: 'status = pending amount > 100',                            description: 'Pending expenses over £100' },
      { query: 'workerName : Johnson category in Travel,Accommodation',    description: "Johnson's travel and accommodation" },
    ],
  },
  {
    title: 'Compliance',
    badge: 'status, documentType, daysUntilExpiry',
    examples: [
      { query: 'status = expiring daysUntilExpiry < 30',             description: 'Documents expiring within 30 days' },
      { query: 'documentType : DBS status in expiring,expired',      description: 'DBS checks that need attention' },
      { query: 'workerName : Brown sort daysUntilExpiry asc',        description: "Brown's documents by expiry date" },
    ],
  },
]

export const PRO_TIPS = [
  <>Use quotes around values with spaces: <code className="bg-muted px-1 rounded">clientName = "Acme Corporation"</code></>,
  'Combine multiple filters: all must match (AND logic)',
  'Field names are case-sensitive, but values are not',
  'Use the Filter Builder button for a guided experience',
]
