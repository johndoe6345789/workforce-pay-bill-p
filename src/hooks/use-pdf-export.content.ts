import type { PDFSection } from './use-pdf-export.types'
import { MARGINS, FONTS } from './use-pdf-export.types'
import { escapeString, generateTableStream } from './use-pdf-export.table'

interface ContentStreamConfig {
  pageWidth: number
  pageHeight: number
  contentWidth: number
  title: string
  includePageNumbers: boolean
  currentPage: number
  totalPages: number
}

export function generateContentStream(sections: PDFSection[], config: ContentStreamConfig): string {
  let stream = 'BT\n'
  let y = config.pageHeight - MARGINS.top

  sections.forEach((section) => {
    switch (section.type) {
      case 'title':
        stream += `/F2 ${FONTS.title.size} Tf\n`
        stream += `${MARGINS.left} ${y} Td\n`
        stream += `(${escapeString(section.content || '')}) Tj\n`
        y -= 40
        break
      case 'heading':
        stream += `/F2 ${FONTS.heading.size} Tf\n`
        stream += `${MARGINS.left} ${y} Td\n`
        stream += `(${escapeString(section.content || '')}) Tj\n`
        y -= 30
        break
      case 'paragraph':
        stream += `/F1 ${FONTS.body.size} Tf\n`
        stream += `${MARGINS.left} ${y} Td\n`
        stream += `(${escapeString(section.content || '')}) Tj\n`
        y -= 20
        break
      case 'table':
        if (section.data && section.columns) {
          stream += generateTableStream(section.data, section.columns, MARGINS.left, y, config.contentWidth)
          y -= 30 + (section.data.length * 25)
        }
        break
      case 'spacer':
        y -= section.height || 20
        break
      case 'divider':
        stream += 'ET\nq\n'
        stream += `0.5 w\n`
        stream += `${MARGINS.left} ${y} m\n`
        stream += `${config.pageWidth - MARGINS.right} ${y} l\nS\n`
        stream += 'Q\nBT\n'
        y -= 15
        break
    }
  })

  if (config.includePageNumbers) {
    stream += `/F1 ${FONTS.small.size} Tf\n`
    const pageText = `Page ${config.currentPage} of ${config.totalPages}`
    stream += `${config.pageWidth / 2 - 30} ${MARGINS.bottom - 20} Td\n`
    stream += `(${pageText}) Tj\n`
  }

  stream += 'ET'
  return stream
}
