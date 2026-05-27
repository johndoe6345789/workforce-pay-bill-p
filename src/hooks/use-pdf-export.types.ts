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
  format?: (value: unknown) => string
}

export interface PDFSection {
  type: 'title' | 'heading' | 'paragraph' | 'table' | 'chart' | 'spacer' | 'divider'
  content?: string
  data?: Record<string, unknown>[]
  columns?: PDFTableColumn[]
  level?: number
  height?: number
}

export const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 },
}

export const MARGINS = { top: 50, bottom: 50, left: 50, right: 50 }

export const FONTS = {
  title: { size: 24, weight: 'bold' },
  heading: { size: 16, weight: 'bold' },
  subheading: { size: 14, weight: 'bold' },
  body: { size: 11, weight: 'normal' },
  small: { size: 9, weight: 'normal' },
}
