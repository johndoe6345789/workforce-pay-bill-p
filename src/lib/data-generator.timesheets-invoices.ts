const WORKERS = ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams', 'Charlie Brown']
const CLIENTS = ['Acme Corp', 'Tech Solutions', 'Global Industries', 'Local Business']

export function createMockTimesheet(index: number) {
  const statuses = ['pending', 'approved', 'rejected', 'paid'] as const
  return {
    id: `ts-${index}`,
    workerId: `worker-${index % 100}`,
    workerName: WORKERS[index % WORKERS.length],
    client: CLIENTS[index % CLIENTS.length],
    weekEnding: new Date(2024, 0, 1 + (index % 52) * 7).toISOString(),
    hoursWorked: 35 + (index % 10),
    rate: 20 + (index % 30),
    total: (35 + (index % 10)) * (20 + (index % 30)),
    status: statuses[index % statuses.length],
    submittedAt: new Date(2024, 0, 1 + (index % 365)).toISOString(),
  }
}

export function createMockInvoice(index: number) {
  const statuses = ['draft', 'sent', 'paid', 'overdue'] as const
  const base = 1000 + index * 100
  return {
    id: `inv-${index}`,
    invoiceNumber: `INV-${String(index).padStart(6, '0')}`,
    client: CLIENTS[index % CLIENTS.length],
    amount: base,
    vat: base * 0.2,
    total: base * 1.2,
    status: statuses[index % statuses.length],
    dueDate: new Date(2024, 0, 1 + (index % 90)).toISOString(),
    issueDate: new Date(2024, 0, 1 + (index % 365)).toISOString(),
  }
}
