import { useCallback } from 'react'

export interface PDFExportOptions {
  filename?: string
  title?: string
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'a4' | 'letter' | 'legal'
  includeTimestamp?: boolean
  includePageNumbers?: boolean
  metadata?: {
    author?: string
    subject?: string
    keywords?: string
  }
}

export interface PDFTableColumn {
  header: string
  key: string
  width?: number
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
}

export interface PDFSection {
  type: 'title' | 'heading' | 'paragraph' | 'table' | 'chart' | 'spacer' | 'divider'
  content?: string
  data?: any[]
  columns?: PDFTableColumn[]
  level?: number
  height?: number
}

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 }
}

const MARGINS = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50
}

const FONTS = {
  title: { size: 24, weight: 'bold' },
  heading: { size: 16, weight: 'bold' },
  subheading: { size: 14, weight: 'bold' },
  body: { size: 11, weight: 'normal' },
  small: { size: 9, weight: 'normal' }
}

export function usePDFExport() {
  const generatePDF = useCallback(
    (sections: PDFSection[], options: PDFExportOptions = {}) => {
      const {
        filename = 'report',
        title = 'Report',
        orientation = 'portrait',
        pageSize = 'a4',
        includeTimestamp = true,
        includePageNumbers = true,
        metadata = {}
      } = options

      const dimensions = PAGE_SIZES[pageSize]
      const pageWidth = orientation === 'portrait' ? dimensions.width : dimensions.height
      const pageHeight = orientation === 'portrait' ? dimensions.height : dimensions.width
      const contentWidth = pageWidth - MARGINS.left - MARGINS.right

      let pdf = `%PDF-1.4
%âãÏÓ`

      const objects: string[] = []
      let objectId = 1

      const addObject = (content: string): number => {
        const id = objectId++
        objects.push(`${id} 0 obj\n${content}\nendobj`)
        return id
      }

      const catalogId = addObject(`<<
  /Type /Catalog
  /Pages 2 0 R
>>`)

      const pagesId = 2
      const pageIds: number[] = []
      const pages: string[] = []

      let currentY = pageHeight - MARGINS.top
      let currentPage = 0

      const startNewPage = () => {
        currentPage++
        currentY = pageHeight - MARGINS.top
      }

      const checkPageBreak = (requiredSpace: number) => {
        if (currentY - requiredSpace < MARGINS.bottom) {
          startNewPage()
        }
      }

      if (includeTimestamp) {
        sections.unshift({
          type: 'paragraph',
          content: `Generated: ${new Date().toLocaleString()}`
        })
      }

      sections.forEach((section) => {
        switch (section.type) {
          case 'title':
            checkPageBreak(40)
            currentY -= 40
            break
          case 'heading':
            checkPageBreak(30)
            currentY -= 30
            break
          case 'paragraph':
            checkPageBreak(20)
            currentY -= 20
            break
          case 'table':
            if (section.data && section.columns) {
              const rowHeight = 25
              const headerHeight = 30
              const totalHeight = headerHeight + (section.data.length * rowHeight)
              checkPageBreak(totalHeight)
              currentY -= totalHeight
            }
            break
          case 'spacer':
            const spacerHeight = section.height || 20
            checkPageBreak(spacerHeight)
            currentY -= spacerHeight
            break
          case 'divider':
            checkPageBreak(15)
            currentY -= 15
            break
        }
      })

      const contentStream = generateContentStream(sections, {
        pageWidth,
        pageHeight,
        contentWidth,
        title,
        includePageNumbers,
        currentPage: 1,
        totalPages: currentPage || 1
      })

      const streamId = addObject(`<<
  /Length ${contentStream.length}
>>
stream
${contentStream}
endstream`)

      const pageId = addObject(`<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 ${pageWidth} ${pageHeight}]
  /Contents ${streamId} 0 R
  /Resources <<
    /Font <<
      /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
      /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
    >>
  >>
>>`)

      pageIds.push(pageId)

      const pagesContent = `<<
  /Type /Pages
  /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}]
  /Count ${pageIds.length}
>>`

      objects[pagesId - 1] = `${pagesId} 0 obj\n${pagesContent}\nendobj`

      const infoId = addObject(`<<
  /Title (${escapeString(title)})
  /Author (${escapeString(metadata.author || 'WorkForce Pro')})
  /Subject (${escapeString(metadata.subject || title)})
  /Creator (WorkForce Pro Back Office Platform)
  /Producer (WorkForce Pro PDF Generator)
  /CreationDate (D:${formatPDFDate(new Date())})
>>`)

      pdf += `\n\n${objects.join('\n\n')}\n\n`

      const xrefStart = pdf.length
      pdf += `xref\n0 ${objectId}\n`
      pdf += `0000000000 65535 f \n`

      let offset = pdf.indexOf('1 0 obj')
      for (let i = 1; i < objectId; i++) {
        pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
        const nextObj = pdf.indexOf(`${i + 1} 0 obj`, offset)
        offset = nextObj > 0 ? nextObj : offset
      }

      pdf += `\ntrailer\n<<
  /Size ${objectId}
  /Root ${catalogId} 0 R
  /Info ${infoId} 0 R
>>\n`

      pdf += `startxref\n${xrefStart}\n%%EOF`

      const blob = new Blob([pdf], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.pdf`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    []
  )

  const exportTableToPDF = useCallback(
    (data: any[], columns: PDFTableColumn[], options: PDFExportOptions = {}) => {
      const sections: PDFSection[] = [
        {
          type: 'title',
          content: options.title || 'Data Report'
        },
        {
          type: 'spacer',
          height: 20
        },
        {
          type: 'table',
          data,
          columns
        }
      ]

      generatePDF(sections, options)
    },
    [generatePDF]
  )

  const exportReportToPDF = useCallback(
    (
      reportData: {
        title: string
        summary?: string
        sections: PDFSection[]
      },
      options: PDFExportOptions = {}
    ) => {
      const sections: PDFSection[] = [
        {
          type: 'title',
          content: reportData.title
        }
      ]

      if (reportData.summary) {
        sections.push({
          type: 'spacer',
          height: 15
        })
        sections.push({
          type: 'paragraph',
          content: reportData.summary
        })
      }

      sections.push({
        type: 'spacer',
        height: 20
      })

      sections.push(...reportData.sections)

      generatePDF(sections, { ...options, title: reportData.title })
    },
    [generatePDF]
  )

  return {
    generatePDF,
    exportTableToPDF,
    exportReportToPDF
  }
}

function generateContentStream(
  sections: PDFSection[],
  config: {
    pageWidth: number
    pageHeight: number
    contentWidth: number
    title: string
    includePageNumbers: boolean
    currentPage: number
    totalPages: number
  }
): string {
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
    const pageTextX = config.pageWidth / 2 - 30
    stream += `${pageTextX} ${MARGINS.bottom - 20} Td\n`
    stream += `(${pageText}) Tj\n`
  }

  stream += 'ET'
  return stream
}

function generateTableStream(
  data: any[],
  columns: PDFTableColumn[],
  x: number,
  y: number,
  maxWidth: number
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
      const value = col.format ? col.format(row[col.key]) : String(row[col.key] || '')
      stream += `${colX + 5} ${y - (rowIndex * rowHeight)} Td\n`
      stream += `(${escapeString(value)}) Tj\n`
    })
  })

  return stream
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .slice(0, 200)
}

function formatPDFDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}
