import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Receipt, CurrencyCircleDollar, Clock, TrendUp, ShieldCheck } from '@phosphor-icons/react'
import { InvoicingDemo } from '@/components/business-logic-demo/InvoicingDemo'
import { PayrollDemo } from '@/components/business-logic-demo/PayrollDemo'
import { TimeTrackingDemo } from '@/components/business-logic-demo/TimeTrackingDemo'
import { MarginAnalysisDemo } from '@/components/business-logic-demo/MarginAnalysisDemo'
import { ComplianceDemo } from '@/components/business-logic-demo/ComplianceDemo'

const TAB_DEFS = [
  { value: 'invoicing', Icon: Receipt, label: 'Invoicing', Component: InvoicingDemo },
  { value: 'payroll', Icon: CurrencyCircleDollar, label: 'Payroll', Component: PayrollDemo },
  { value: 'time', Icon: Clock, label: 'Time Tracking', Component: TimeTrackingDemo },
  { value: 'margin', Icon: TrendUp, label: 'Margin Analysis', Component: MarginAnalysisDemo },
  { value: 'compliance', Icon: ShieldCheck, label: 'Compliance', Component: ComplianceDemo },
]

export function BusinessLogicDemo() {
  const [activeTab, setActiveTab] = useState('invoicing')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Business Logic Hooks Demo</h1>
        <p className="text-muted-foreground">Specialized hooks for invoicing, payroll, time tracking, margin analysis, and compliance</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full grid-cols-${TAB_DEFS.length}`}>
          {TAB_DEFS.map(({ value, Icon, label }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TAB_DEFS.map(({ value, Component }) => (
          <TabsContent key={value} value={value} className="space-y-4">
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
