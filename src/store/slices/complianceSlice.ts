import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ComplianceDoc {
  id: string
  workerId: string
  workerName: string
  documentType: string
  status: string
  expiryDate: string
  uploadedDate: string
  verifiedDate?: string
  daysUntilExpiry: number
}

interface ComplianceState {
  documents: ComplianceDoc[]
  loading: boolean
}

const initialState: ComplianceState = {
  documents: [],
  loading: false,
}

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setComplianceDocs: (state, action: PayloadAction<ComplianceDoc[]>) => {
      state.documents = action.payload
    },
    addComplianceDoc: (state, action: PayloadAction<ComplianceDoc>) => {
      state.documents.push(action.payload)
    },
    updateComplianceDoc: (state, action: PayloadAction<ComplianceDoc>) => {
      const index = state.documents.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = action.payload
      }
    },
    deleteComplianceDoc: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(d => d.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setComplianceDocs, addComplianceDoc, updateComplianceDoc, deleteComplianceDoc, setLoading } = complianceSlice.actions
export default complianceSlice.reducer
