const WORKERS = ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams', 'Charlie Brown']

export function createMockPayroll(index: number) {
  const statuses = ['pending', 'processing', 'completed', 'failed'] as const
  const base = 3000 + index * 50
  return {
    id: `pr-${index}`,
    workerId: `worker-${index % 100}`,
    workerName: WORKERS[index % WORKERS.length],
    period: `2024-${String(Math.floor(index / 4) + 1).padStart(2, '0')}`,
    grossPay: base,
    tax: base * 0.2,
    ni: base * 0.12,
    netPay: base * 0.68,
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
