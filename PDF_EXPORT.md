# PDF Export Documentation

## Overview

The PDF export functionality provides comprehensive report generation capabilities for the WorkForce Pro platform. Users can export data tables, financial reports, and custom reports to PDF format with professional formatting.

## Features

### Core Capabilities
- **Table Export**: Export data tables with customizable columns and formatting
- **Report Generation**: Create multi-section reports with titles, headings, tables, and metadata
- **Page Management**: Automatic page breaks and pagination
- **Customization**: Configure page size, orientation, timestamps, and page numbers
- **Professional Formatting**: Clean, readable output with proper spacing and alignment

### Supported Export Formats
- CSV (Comma-Separated Values)
- Excel/XLSX (Microsoft Excel)
- JSON (JavaScript Object Notation)
- **PDF (Portable Document Format)** ⭐ NEW

## Usage

### 1. Basic Table Export

```typescript
import { usePDFExport, type PDFTableColumn } from '@/hooks/use-pdf-export'

const { exportTableToPDF } = usePDFExport()

const columns: PDFTableColumn[] = [
  { header: 'Name', key: 'name', align: 'left' },
  { header: 'Amount', key: 'amount', align: 'right', format: (val) => `$${val}` }
]

const data = [
  { name: 'Item 1', amount: 1000 },
  { name: 'Item 2', amount: 2000 }
]

exportTableToPDF(data, columns, {
  filename: 'report',
  title: 'Financial Report',
  orientation: 'portrait',
  pageSize: 'a4'
})
```

### 2. Advanced Report with Multiple Sections

```typescript
import { usePDFExport, type PDFSection } from '@/hooks/use-pdf-export'

const { exportReportToPDF } = usePDFExport()

const sections: PDFSection[] = [
  {
    type: 'heading',
    content: 'Executive Summary'
  },
  {
    type: 'paragraph',
    content: 'This report covers Q4 2025 financial performance.'
  },
  {
    type: 'spacer',
    height: 20
  },
  {
    type: 'divider'
  },
  {
    type: 'table',
    data: tableData,
    columns: tableColumns
  }
]

exportReportToPDF(
  {
    title: 'Q4 2025 Financial Report',
    summary: 'Comprehensive quarterly analysis',
    sections
  },
  {
    filename: 'q4-2025-report',
    orientation: 'landscape',
    includeTimestamp: true,
    includePageNumbers: true
  }
)
```

### 3. Using Data Export Hook (All Formats)

```typescript
import { useDataExport } from '@/hooks/use-data-export'

const { exportData, exportToPDF } = useDataExport()

// Export to any format
exportData(data, { 
  format: 'pdf',
  filename: 'export',
  title: 'Data Export',
  columns: ['id', 'name', 'amount']
})

// Or directly to PDF
exportToPDF(data, {
  filename: 'report',
  title: 'Report Title',
  columnHeaders: {
    id: 'ID',
    name: 'Name',
    amount: 'Amount'
  }
})
```

## Components with PDF Export

### 1. Reports View
The main Reports view includes a dedicated PDF export button for financial reports:
- Margin analysis tables
- Revenue and cost breakdowns
- Forecast data
- Summary metrics

**Location**: `src/components/ReportsView.tsx`

### 2. Advanced Data Table
All data tables automatically include PDF export in their export menu:
- Timesheets
- Invoices
- Payroll runs
- Expenses
- Compliance documents

**Location**: `src/components/AdvancedDataTable.tsx`

### 3. Custom Report Builder
Custom reports can be exported to PDF with full formatting:
- Grouped data
- Aggregated metrics
- Filtered results

**Location**: `src/components/reports/ReportResultTable.tsx`

### 4. Scheduled Reports
Scheduled automatic reports support PDF as an output format:
- Daily, weekly, monthly, or quarterly reports
- Automatic generation and distribution
- Email delivery support

**Location**: `src/components/ScheduledReportsManager.tsx`

## Configuration Options

### PDF Export Options

```typescript
interface PDFExportOptions {
  filename?: string              // Output filename (without .pdf extension)
  title?: string                 // Document title
  orientation?: 'portrait' | 'landscape'  // Page orientation
  pageSize?: 'a4' | 'letter' | 'legal'   // Paper size
  includeTimestamp?: boolean     // Add generation timestamp
  includePageNumbers?: boolean   // Add page numbers
  metadata?: {
    author?: string
    subject?: string
    keywords?: string
  }
}
```

### PDF Table Column Options

```typescript
interface PDFTableColumn {
  header: string                 // Column header text
  key: string                    // Data key
  width?: number                 // Column width (optional)
  align?: 'left' | 'center' | 'right'  // Text alignment
  format?: (value: any) => string      // Custom formatter
}
```

### PDF Section Types

```typescript
type PDFSection = {
  type: 'title'       // Large title (24pt)
  content: string
} | {
  type: 'heading'     // Section heading (16pt)
  content: string
} | {
  type: 'paragraph'   // Body text (11pt)
  content: string
} | {
  type: 'table'       // Data table
  data: any[]
  columns: PDFTableColumn[]
} | {
  type: 'spacer'      // Vertical spacing
  height?: number
} | {
  type: 'divider'     // Horizontal line
}
```

## Page Sizes and Dimensions

| Size   | Portrait (W×H) | Landscape (W×H) |
|--------|---------------|-----------------|
| A4     | 595 × 842 pts | 842 × 595 pts   |
| Letter | 612 × 792 pts | 792 × 612 pts   |
| Legal  | 612 × 1008 pts| 1008 × 612 pts  |

## Best Practices

### 1. Column Configuration
- Use clear, descriptive headers
- Apply right alignment for numbers
- Add format functions for currency, dates, and percentages
- Limit columns to 5-7 for portrait, 8-10 for landscape

### 2. Report Structure
- Start with a title section
- Add summary paragraphs for context
- Use spacers for visual breathing room
- Include dividers to separate major sections
- Add tables after explanatory text

### 3. Performance
- Limit tables to 100-200 rows per page for readability
- Use pagination for larger datasets
- Consider generating reports server-side for very large datasets

### 4. Formatting
- Keep text content under 200 characters per line
- Use consistent spacing (20px standard, 10px tight)
- Test both orientations for different data shapes
- Always include timestamps for audit trails

## Examples

### Financial Report
```typescript
const sections: PDFSection[] = [
  { type: 'title', content: 'Monthly Financial Report' },
  { type: 'spacer', height: 10 },
  { type: 'paragraph', content: 'Report Period: January 2025' },
  { type: 'spacer', height: 20 },
  { type: 'heading', content: 'Revenue Summary' },
  { type: 'spacer', height: 10 },
  {
    type: 'table',
    data: revenueData,
    columns: [
      { header: 'Source', key: 'source', align: 'left' },
      { header: 'Amount', key: 'amount', align: 'right', 
        format: (v) => `$${v.toLocaleString()}` }
    ]
  }
]
```

### Timesheet Report
```typescript
exportTableToPDF(timesheets, [
  { header: 'Worker', key: 'workerName', align: 'left' },
  { header: 'Date', key: 'date', align: 'left' },
  { header: 'Hours', key: 'hours', align: 'right' },
  { header: 'Rate', key: 'rate', align: 'right', 
    format: (v) => `£${v}/hr` },
  { header: 'Total', key: 'amount', align: 'right',
    format: (v) => `£${v.toLocaleString()}` }
], {
  filename: 'timesheet-report',
  title: 'Weekly Timesheet Report',
  orientation: 'landscape'
})
```

## Technical Details

### PDF Generation
- Uses PDF 1.4 specification
- Direct PDF generation (no external dependencies)
- Client-side processing
- Automatic page break handling
- Font: Helvetica (standard PDF font)

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Download support varies

### File Size
- Typical report: 50-200 KB
- Large tables (1000+ rows): 500 KB - 2 MB
- Depends on data density and formatting

## Troubleshooting

### Common Issues

**Issue**: PDF not downloading
- **Solution**: Check browser pop-up blockers
- **Solution**: Ensure user initiated the action (not auto-triggered)

**Issue**: Text appears truncated
- **Solution**: Limit text to 200 characters
- **Solution**: Use multiple paragraph sections for long content

**Issue**: Table columns don't fit
- **Solution**: Switch to landscape orientation
- **Solution**: Reduce number of columns
- **Solution**: Use shorter header names

**Issue**: Page breaks in wrong places
- **Solution**: Add manual spacers to control layout
- **Solution**: Reduce table row count per page

## Future Enhancements

Planned improvements:
- [ ] Chart/graph rendering
- [ ] Images and logos
- [ ] Custom fonts
- [ ] Color customization
- [ ] Multi-page tables with headers
- [ ] Table of contents
- [ ] Watermarks
- [ ] Digital signatures
- [ ] PDF/A compliance

## API Reference

See the following files for complete API documentation:
- `src/hooks/use-pdf-export.ts` - Core PDF generation hook
- `src/hooks/use-data-export.ts` - Unified export interface
- `src/components/ui/export-button.tsx` - Export UI component

## Support

For issues or questions:
1. Check this documentation
2. Review code examples in components
3. Check TypeScript types for parameter details
4. Review browser console for error messages
