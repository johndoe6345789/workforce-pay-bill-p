export interface DataGeneratorOptions<T> {
  count: number
  template: (index: number) => T
  batchSize?: number
}

export async function generateLargeDataset<T>({
  count,
  template,
  batchSize = 1000,
}: DataGeneratorOptions<T>): Promise<T[]> {
  const result: T[] = []

  for (let i = 0; i < count; i += batchSize) {
    const batch: T[] = []
    const end = Math.min(i + batchSize, count)

    for (let j = i; j < end; j++) {
      batch.push(template(j))
    }

    result.push(...batch)

    if (i + batchSize < count) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return result
}

export function createMockTimesheet(index: number) {
  const workers = [
    'John Smith',
    'Jane Doe',
    'Bob Johnson',
    'Alice Williams',
    'Charlie Brown',
  ]
  const clients = ['Acme Corp', 'Tech Solutions', 'Global Industries', 'Local Business']
  const statuses = ['pending', 'approved', 'rejected', 'paid'] as const

  return {
    id: `ts-${index}`,
    workerId: `worker-${index % 100}`,
    workerName: workers[index % workers.length],
    client: clients[index % clients.length],
    weekEnding: new Date(2024, 0, 1 + (index % 52) * 7).toISOString(),
    hoursWorked: 35 + (index % 10),
    rate: 20 + (index % 30),
    total: (35 + (index % 10)) * (20 + (index % 30)),
    status: statuses[index % statuses.length],
    submittedAt: new Date(2024, 0, 1 + (index % 365)).toISOString(),
  }
}

export function createMockInvoice(index: number) {
  const clients = ['Acme Corp', 'Tech Solutions', 'Global Industries', 'Local Business']
  const statuses = ['draft', 'sent', 'paid', 'overdue'] as const

  return {
    id: `inv-${index}`,
    invoiceNumber: `INV-${String(index).padStart(6, '0')}`,
    client: clients[index % clients.length],
    amount: 1000 + index * 100,
    vat: (1000 + index * 100) * 0.2,
    total: (1000 + index * 100) * 1.2,
    status: statuses[index % statuses.length],
    dueDate: new Date(2024, 0, 1 + (index % 90)).toISOString(),
    issueDate: new Date(2024, 0, 1 + (index % 365)).toISOString(),
  }
}

export function createMockPayroll(index: number) {
  const workers = [
    'John Smith',
    'Jane Doe',
    'Bob Johnson',
    'Alice Williams',
    'Charlie Brown',
  ]
  const statuses = ['pending', 'processing', 'completed', 'failed'] as const

  return {
    id: `pr-${index}`,
    workerId: `worker-${index % 100}`,
    workerName: workers[index % workers.length],
    period: `2024-${String(Math.floor(index / 4) + 1).padStart(2, '0')}`,
    grossPay: 3000 + index * 50,
    tax: (3000 + index * 50) * 0.2,
    ni: (3000 + index * 50) * 0.12,
    netPay: (3000 + index * 50) * 0.68,
    status: statuses[index % statuses.length],
    processedAt:
      index % 4 === 0 ? null : new Date(2024, 0, 1 + (index % 365)).toISOString(),
  }
}

export function createMockWorker(index: number) {
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank']
  const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson']

  return {
    id: `worker-${index}`,
    firstName: firstNames[index % firstNames.length],
    lastName: lastNames[index % lastNames.length],
    email: `worker${index}@example.com`,
    phone: `+44 ${String(7000000000 + index).slice(0, 11)}`,
    role: index % 3 === 0 ? 'Permanent' : 'Contractor',
    rate: 20 + (index % 50),
    startDate: new Date(2020 + (index % 5), index % 12, 1).toISOString(),
  }
}
