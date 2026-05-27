import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'

interface Props {
  icon: React.ReactNode
  title: string
  description: string
}

export function PAYEEmptyState({ icon, title, description }: Props) {
  return (
    <Card>
      <CardContent className="py-12">
        <Stack spacing={4} align="center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">{icon}</div>
          <Stack spacing={2} align="center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">{description}</p>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
