export type ImportType = 'timesheets' | 'expenses' | 'workers'

export const FIELD_DEFINITIONS = {
  timesheets: [
    { name: 'workerName', label: 'Worker Name', required: true, type: 'text' as const },
    { name: 'clientName', label: 'Client Name', required: true, type: 'text' as const },
    { name: 'hours', label: 'Hours', required: true, type: 'number' as const },
    { name: 'rate', label: 'Rate', required: true, type: 'number' as const },
    { name: 'weekEnding', label: 'Week Ending', required: true, type: 'date' as const },
    { name: 'status', label: 'Status', required: false, type: 'text' as const },
  ],
  expenses: [
    { name: 'workerName', label: 'Worker Name', required: true, type: 'text' as const },
    { name: 'clientName', label: 'Client Name', required: true, type: 'text' as const },
    { name: 'amount', label: 'Amount', required: true, type: 'number' as const },
    { name: 'category', label: 'Category', required: true, type: 'text' as const },
    { name: 'date', label: 'Date', required: true, type: 'date' as const },
    { name: 'description', label: 'Description', required: false, type: 'text' as const },
    { name: 'receiptUrl', label: 'Receipt URL', required: false, type: 'text' as const },
  ],
  workers: [
    { name: 'name', label: 'Name', required: true, type: 'text' as const },
    { name: 'email', label: 'Email', required: true, type: 'text' as const },
    { name: 'type', label: 'Type', required: true, type: 'text' as const },
    { name: 'role', label: 'Role', required: false, type: 'text' as const },
    { name: 'status', label: 'Status', required: false, type: 'text' as const },
  ],
} as const

export const SAMPLE_CSV: Record<ImportType, string> = {
  timesheets: `workerName,clientName,hours,rate,weekEnding
John Smith,Acme Corp,37.5,25.50,2025-01-24
Jane Doe,Tech Solutions,40,30.00,2025-01-24
Robert Brown,Global Industries,35,28.75,2025-01-24`,
  expenses: `workerName,clientName,amount,category,date,description
John Smith,Acme Corp,45.50,Travel,2025-01-20,Train to client site
Jane Doe,Tech Solutions,120.00,Accommodation,2025-01-21,Hotel stay`,
  workers: `name,email,type,phone
John Smith,john.smith@example.com,contractor,+44 7700 900123
Jane Doe,jane.doe@example.com,employee,+44 7700 900456`,
}
