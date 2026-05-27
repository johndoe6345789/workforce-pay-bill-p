import type { PDFTableColumn } from './use-pdf-export.types'
import { FONTS } from './use-pdf-export.types'

export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .slice(0, 200)
}

export function formatPDFDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

export function generateTableStream(
  data: Record<string, unknown>[],
  columns: PDFTableColumn[],
  x: number,
  y: number,
  maxWidth: number,
): string {
  let stream = ''
  const columnWidth = maxWidth / columns.length
  const rowHeight = 25

  stream += `/F2 ${FONTS.body.size} Tf\n`
  columns.forEach((col, i) => {
    const colX = x + (i * columnWidth)
    stream += `${colX + 5} ${y} Td\n`
    stream += `(${escapeString(col.header)}) Tj\n`
  })

  y -= rowHeight
  stream += `/F1 ${FONTS.body.size} Tf\n`
  data.forEach((row, rowIndex) => {
    columns.forEach((col, colIndex) => {
      const colX = x + (colIndex * columnWidth)
      const rawValue = row[col.key]
      const value = col.format ? col.format(rawValue) : String(rawValue ?? '')
      stream += `${colX + 5} ${y - (rowIndex * rowHeight)} Td\n`
      stream += `(${escapeString(value)}) Tj\n`
    })
  })

  return stream
}
