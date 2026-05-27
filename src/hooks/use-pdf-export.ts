import { useCallback } from 'react'
import type { PDFSection, PDFExportOptions, PDFTableColumn } from './use-pdf-export.types'
import { PAGE_SIZES, MARGINS } from './use-pdf-export.types'
import { escapeString, formatPDFDate } from './use-pdf-export.table'
import { generateContentStream } from './use-pdf-export.content'

export type { PDFExportOptions, PDFTableColumn, PDFSection } from './use-pdf-export.types'

export function usePDFExport() {
  const generatePDF = useCallback((sections: PDFSection[], options: PDFExportOptions = {}) => {
    const { filename = 'report', title = 'Report', orientation = 'portrait',
      pageSize = 'a4', includeTimestamp = true, includePageNumbers = true, metadata = {} } = options

    const dimensions = PAGE_SIZES[pageSize]
    const pageWidth = orientation === 'portrait' ? dimensions.width : dimensions.height
    const pageHeight = orientation === 'portrait' ? dimensions.height : dimensions.width
    const contentWidth = pageWidth - MARGINS.left - MARGINS.right

    let pdf = `%PDF-1.4\n%âãÏÓ`
    const objects: string[] = []
    let objectId = 1

    const addObject = (content: string): number => {
      const id = objectId++
      objects.push(`${id} 0 obj\n${content}\nendobj`)
      return id
    }

    const catalogId = addObject(`<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>`)
    const pagesId = 2
    const pageIds: number[] = []
    let currentY = pageHeight - MARGINS.top
    let currentPage = 0

    const checkPageBreak = (space: number) => {
      if (currentY - space < MARGINS.bottom) { currentPage++; currentY = pageHeight - MARGINS.top }
    }

    if (includeTimestamp) sections.unshift({ type: 'paragraph', content: `Generated: ${new Date().toLocaleString()}` })

    sections.forEach((section) => {
      if (section.type === 'title') { checkPageBreak(40); currentY -= 40 }
      else if (section.type === 'heading') { checkPageBreak(30); currentY -= 30 }
      else if (section.type === 'paragraph') { checkPageBreak(20); currentY -= 20 }
      else if (section.type === 'table' && section.data && section.columns) {
        const h = 30 + (section.data.length * 25); checkPageBreak(h); currentY -= h
      } else if (section.type === 'spacer') { const h = section.height || 20; checkPageBreak(h); currentY -= h }
      else if (section.type === 'divider') { checkPageBreak(15); currentY -= 15 }
    })

    const contentStream = generateContentStream(sections, { pageWidth, pageHeight, contentWidth, title,
      includePageNumbers, currentPage: 1, totalPages: currentPage || 1 })

    const streamId = addObject(`<<\n  /Length ${contentStream.length}\n>>\nstream\n${contentStream}\nendstream`)
    const pageId = addObject(`<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 ${pageWidth} ${pageHeight}]\n  /Contents ${streamId} 0 R\n  /Resources <<\n    /Font <<\n      /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n      /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\n    >>\n  >>\n>>`)
    pageIds.push(pageId)

    objects[pagesId - 1] = `${pagesId} 0 obj\n<<\n  /Type /Pages\n  /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}]\n  /Count ${pageIds.length}\n>>\nendobj`
    const infoId = addObject(`<<\n  /Title (${escapeString(title)})\n  /Author (${escapeString(metadata.author || 'WorkForce Pro')})\n  /Subject (${escapeString(metadata.subject || title)})\n  /Creator (WorkForce Pro Back Office Platform)\n  /Producer (WorkForce Pro PDF Generator)\n  /CreationDate (D:${formatPDFDate(new Date())})\n>>`)

    pdf += `\n\n${objects.join('\n\n')}\n\n`
    const xrefStart = pdf.length
    pdf += `xref\n0 ${objectId}\n0000000000 65535 f \n`
    let offset = pdf.indexOf('1 0 obj')
    for (let i = 1; i < objectId; i++) {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
      const nextObj = pdf.indexOf(`${i + 1} 0 obj`, offset)
      offset = nextObj > 0 ? nextObj : offset
    }
    pdf += `\ntrailer\n<<\n  /Size ${objectId}\n  /Root ${catalogId} 0 R\n  /Info ${infoId} 0 R\n>>\n`
    pdf += `startxref\n${xrefStart}\n%%EOF`

    const blob = new Blob([pdf], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.pdf`
    link.click()
    URL.revokeObjectURL(link.href)
  }, [])

  const exportTableToPDF = useCallback(
    (data: Record<string, unknown>[], columns: PDFTableColumn[], options: PDFExportOptions = {}) => {
      generatePDF([{ type: 'title', content: options.title || 'Data Report' }, { type: 'spacer', height: 20 }, { type: 'table', data, columns }], options)
    }, [generatePDF])

  const exportReportToPDF = useCallback(
    (reportData: { title: string; summary?: string; sections: PDFSection[] }, options: PDFExportOptions = {}) => {
      const sections: PDFSection[] = [{ type: 'title', content: reportData.title }]
      if (reportData.summary) sections.push({ type: 'spacer', height: 15 }, { type: 'paragraph', content: reportData.summary })
      sections.push({ type: 'spacer', height: 20 }, ...reportData.sections)
      generatePDF(sections, { ...options, title: reportData.title })
    }, [generatePDF])

  return { generatePDF, exportTableToPDF, exportReportToPDF }
}
