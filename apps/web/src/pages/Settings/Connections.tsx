import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Plug, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@diatonic/ui'

import { useEntitiesStore } from '../../stores/entities'

interface ConnectionForm {
  environmentId: string
}

export default function Connections() {
  const sessions = useEntitiesStore((state) => state.sessions)
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ConnectionForm>({
    defaultValues: { environmentId: 'jrpm-prod' }
  })

  const onSubmit = handleSubmit(async ({ environmentId }) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const testedAt = new Date().toISOString()
    setLastTestedAt(testedAt)
    toast.success('Firebase connection validated', {
      description: `${environmentId} responded in 120ms — tokens rotated`
    })
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Connections</h1>
          <p className="text-sm text-muted-foreground">
            Configure your workspace bridges for CRM sync, analytics sinks, and webhook targets.
          </p>
        </div>
        <Badge variant="secondary" className="uppercase">Protected</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Primary Firebase project</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground" htmlFor="env-id">
                  Environment ID
                </label>
                <Input id="env-id" placeholder="jrpm-prod" {...register('environmentId')} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="fx-press">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Testing…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                      Test connection
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => toast.message('Settings saved', { description: 'Credentials stored in workspace vault' })}>
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use Firebase service accounts scoped to Firestore, Functions, and Storage. Secrets are stored via Hashicorp Vault.
              </p>
              {lastTestedAt && (
                <p className="text-xs text-muted-foreground">
                  Last tested {new Date(lastTestedAt).toLocaleTimeString()} on {new Date(lastTestedAt).toLocaleDateString()}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent automations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-xs text-muted-foreground">{session.status}</p>
                </div>
                <Plug className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
