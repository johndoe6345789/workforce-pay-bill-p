import { useState, useEffect, useCallback } from 'react'
import {
  UploadSimple,
  Warning,
  XCircle,
  CheckCircle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { ComplianceDetailDialog } from '@/components/ComplianceDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { cn } from '@/lib/utils'
import type { ComplianceDocument } from '@/lib/types'

interface ComplianceViewProps {
  complianceDocs: ComplianceDocument[]
  onUploadDocument: (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => void
}

export function ComplianceView({ complianceDocs, onUploadDocument }: ComplianceViewProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<ComplianceDocument | null>(null)
  const [filteredDocs, setFilteredDocs] = useState<ComplianceDocument[]>([])
  
  useEffect(() => {
    setFilteredDocs(complianceDocs)
  }, [complianceDocs])
  
  const handleResultsChange = useCallback((results: ComplianceDocument[]) => {
    setFilteredDocs(results)
  }, [])
  
  const expiringDocs = filteredDocs.filter(d => d.status === 'expiring')
  const expiredDocs = filteredDocs.filter(d => d.status === 'expired')
  
  const [uploadFormData, setUploadFormData] = useState({
    workerId: '',
    workerName: '',
    documentType: '',
    expiryDate: ''
  })

  const complianceFields: FilterField[] = [
    { name: 'workerName', label: 'Worker Name', type: 'text' },
    { name: 'documentType', label: 'Document Type', type: 'select', options: [
      { value: 'DBS Check', label: 'DBS Check' },
      { value: 'Right to Work', label: 'Right to Work' },
      { value: 'Professional License', label: 'Professional License' },
      { value: 'First Aid Certificate', label: 'First Aid Certificate' },
      { value: 'Driving License', label: 'Driving License' },
      { value: 'Passport', label: 'Passport' }
    ]},
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'valid', label: 'Valid' },
      { value: 'expiring', label: 'Expiring' },
      { value: 'expired', label: 'Expired' }
    ]},
    { name: 'daysUntilExpiry', label: 'Days Until Expiry', type: 'number' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' }
  ]

  const handleSubmitUpload = () => {
    if (!uploadFormData.workerName || !uploadFormData.documentType || !uploadFormData.expiryDate) {
      toast.error('Please fill in all fields')
      return
    }

    onUploadDocument({
      workerId: uploadFormData.workerId || `W-${Date.now()}`,
      workerName: uploadFormData.workerName,
      documentType: uploadFormData.documentType,
      expiryDate: uploadFormData.expiryDate
    })

    setUploadFormData({
      workerId: '',
      workerName: '',
      documentType: '',
      expiryDate: ''
    })
    setIsUploadOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Compliance Monitoring</h2>
          <p className="text-muted-foreground mt-1">Track worker documentation and certifications</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <UploadSimple size={18} className="mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Compliance Document</DialogTitle>
              <DialogDescription>
                Add a new document for a worker
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workerName">Worker Name</Label>
                <Input
                  id="workerName"
                  placeholder="Enter worker name"
                  value={uploadFormData.workerName}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, workerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={uploadFormData.documentType}
                  onValueChange={(value) => setUploadFormData({ ...uploadFormData, documentType: value })}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DBS Check">DBS Check</SelectItem>
                    <SelectItem value="Right to Work">Right to Work</SelectItem>
                    <SelectItem value="Professional License">Professional License</SelectItem>
                    <SelectItem value="First Aid Certificate">First Aid Certificate</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={uploadFormData.expiryDate}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, expiryDate: e.target.value })}
                />
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <UploadSimple size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitUpload}>Upload Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AdvancedSearch
        items={complianceDocs}
        fields={complianceFields}
        onResultsChange={handleResultsChange}
        placeholder="Search documents or use query language (e.g., status = expiring daysUntilExpiry < 30)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Warning size={18} className="text-warning" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{expiringDocs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Documents expiring within 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle size={18} className="text-destructive" />
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{expiredDocs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Workers blocked from engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expiring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expiring">
            Expiring Soon ({filteredDocs.filter(d => d.status === 'expiring').length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({filteredDocs.filter(d => d.status === 'expired').length})
          </TabsTrigger>
          <TabsTrigger value="valid">
            Valid ({filteredDocs.filter(d => d.status === 'valid').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiring" className="space-y-3">
          {filteredDocs.filter(d => d.status === 'expiring').map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
          {filteredDocs.filter(d => d.status === 'expiring').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">All documents current</h3>
              <p className="text-muted-foreground">No documents expiring in the next 30 days</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-3">
          {filteredDocs.filter(d => d.status === 'expired').map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
        </TabsContent>

        <TabsContent value="valid" className="space-y-3">
          {filteredDocs.filter(d => d.status === 'valid').map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {filteredDocs.map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
        </TabsContent>
      </Tabs>

      <ComplianceDetailDialog
        document={viewingDocument}
        open={viewingDocument !== null}
        onOpenChange={(open) => {
          if (!open) setViewingDocument(null)
        }}
      />
    </div>
  )
}

interface ComplianceCardProps {
  document: ComplianceDocument
  onViewDetails?: (document: ComplianceDocument) => void
}

function ComplianceCard({ document, onViewDetails }: ComplianceCardProps) {
  const statusConfig = {
    valid: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    expiring: { icon: Warning, color: 'text-warning', bgColor: 'bg-warning/10' },
    expired: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' }
  }

  const StatusIcon = statusConfig[document.status].icon

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails?.(document)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', statusConfig[document.status].bgColor)}>
                <StatusIcon size={20} weight="fill" className={statusConfig[document.status].color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{document.workerName}</h3>
                  <Badge variant={document.status === 'valid' ? 'success' : document.status === 'expiring' ? 'warning' : 'destructive'}>
                    {document.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Document Type</p>
                    <p className="font-medium">{document.documentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Days Until Expiry</p>
                    <p className={cn(
                      'font-medium font-mono',
                      document.daysUntilExpiry < 0 ? 'text-destructive' : 
                      document.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'
                    )}>
                      {document.daysUntilExpiry < 0 ? 'Expired' : `${document.daysUntilExpiry} days`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="outline">View</Button>
            <Button size="sm">Upload New</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
