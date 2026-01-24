import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { SessionData } from '@/lib/indexed-db'
import { useSessionStorage } from '@/hooks/use-session-storage'
import { Clock, Desktop, Trash, Info, ShieldCheck } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'

export function SessionManager() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { sessionId, getAllSessions, clearAllSessions, destroySession } = useSessionStorage()

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      const allSessions = await getAllSessions()
      setSessions(allSessions.sort((a, b) => b.lastActivityTimestamp - a.lastActivityTimestamp))
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleEndSession = async (id: string) => {
    if (id === sessionId) {
      await destroySession()
    } else {
      const { indexedDB } = await import('@/lib/indexed-db')
      await indexedDB.deleteSession(id)
      await loadSessions()
    }
  }

  const handleEndAllOtherSessions = async () => {
    if (!sessionId) return
    
    const otherSessions = sessions.filter(s => s.id !== sessionId)
    const { indexedDB } = await import('@/lib/indexed-db')
    
    await Promise.all(otherSessions.map(s => indexedDB.deleteSession(s.id)))
    await loadSessions()
  }

  const handleClearAllSessions = async () => {
    await clearAllSessions()
    setSessions([])
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            You have {sessions.length} active {sessions.length === 1 ? 'session' : 'sessions'} on this device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length > 0 && (
            <Alert>
              <Info size={16} />
              <AlertDescription>
                Sessions are stored locally on this device and automatically expire after 24 hours of inactivity.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card"
              >
                <div className="mt-0.5 text-muted-foreground">
                  <Desktop size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">
                      {session.name} • {session.currentEntity}
                    </p>
                    {session.id === sessionId && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>
                        Last active {formatDistanceToNow(session.lastActivityTimestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <div>
                      Logged in {formatDistanceToNow(session.loginTimestamp, { addSuffix: true })}
                    </div>
                  </div>

                  {session.expiresAt && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Expires {formatDistanceToNow(session.expiresAt, { addSuffix: true })}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEndSession(session.id)}
                  aria-label={session.id === sessionId ? "Sign out" : "End this session"}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active sessions found</p>
            </div>
          )}

          {sessions.length > 1 && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEndAllOtherSessions}
                disabled={sessions.length <= 1}
              >
                End All Other Sessions
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAllSessions}
              >
                Clear All Sessions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" weight="fill" />
            <CardTitle>Session Security</CardTitle>
          </div>
          <CardDescription>
            Automatic timeout and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-accent/10 border-accent/30">
            <ShieldCheck size={16} className="text-accent" weight="fill" />
            <AlertTitle className="text-accent-foreground mb-2">Auto-Logout Protection</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-2">
              <p>
                For your security, you will be automatically logged out after <strong>30 minutes</strong> of inactivity.
              </p>
              <p>
                You'll receive a warning <strong>5 minutes</strong> before your session expires, giving you the option to extend it.
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
              <p className="text-muted-foreground">
                Sessions are automatically extended when you interact with the application
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
              <p className="text-muted-foreground">
                All sessions are stored securely in your browser's local database
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
              <p className="text-muted-foreground">
                Close your browser to end all sessions immediately
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
