import type { Timesheet } from '@/lib/types'

/** Parse a CSV string into draft Timesheet records. Returns null on bad format. */
export function parseBulkTimesheets(
  csvData: string,
): Timesheet[] | null {
  const lines = csvData.trim().split('\n')
  if (lines.length < 2) return null

  const headers = lines[0].split(',').map(h => h.trim())
  const result: Timesheet[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length !== headers.length) continue

    const workerName = values[headers.indexOf('workerName')] || values[0]
    const clientName = values[headers.indexOf('clientName')] || values[1]
    const hours = parseFloat(values[headers.indexOf('hours')] || values[2] || '0')
    const rate = parseFloat(values[headers.indexOf('rate')] || values[3] || '0')
    const weekEnding = values[headers.indexOf('weekEnding')] || values[4]

    if (workerName && clientName && hours > 0 && rate > 0) {
      result.push({
        id: `TS-${Date.now()}-${i}`,
        workerId: `W-${Date.now()}-${i}`,
        workerName, clientName, weekEnding, hours,
        status: 'pending',
        submittedDate: new Date().toISOString(),
        amount: hours * rate,
      })
    }
  }

  return result
}
