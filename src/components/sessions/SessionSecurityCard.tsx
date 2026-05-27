import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldCheck } from '@phosphor-icons/react'

const SECURITY_POINTS = [
  'Sessions are automatically extended when you interact with the application',
  "All sessions are stored securely in your browser's local database",
  'Close your browser to end all sessions immediately',
]

export function SessionSecurityCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-accent" weight="fill" />
          <CardTitle>Session Security</CardTitle>
        </div>
        <CardDescription>Automatic timeout and security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-accent/10 border-accent/30">
          <ShieldCheck size={16} className="text-accent" weight="fill" />
          <AlertTitle className="text-accent-foreground mb-2">Auto-Logout Protection</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground space-y-2">
            <p>For your security, you will be automatically logged out after <strong>30 minutes</strong> of inactivity.</p>
            <p>You'll receive a warning <strong>5 minutes</strong> before your session expires, giving you the option to extend it.</p>
          </AlertDescription>
        </Alert>
        <div className="space-y-2 text-sm">
          {SECURITY_POINTS.map(pt => (
            <div key={pt} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <p className="text-muted-foreground">{pt}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
