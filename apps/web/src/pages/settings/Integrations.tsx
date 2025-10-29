import { IntegrationCard } from '@/components/integrations/IntegrationCard'
import { useIntegrations } from '@/hooks/useIntegrations'

const IntegrationsSettingsPage = () => {
  const { integrations, enabledIntegrations, toggleIntegration, isLoading } = useIntegrations()

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Connect external tools like Slack, GitHub, and calendars.
        </p>
      </header>
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Loading integration catalog...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              enabled={enabledIntegrations.includes(integration.id)}
              onToggle={(item, enabled) => toggleIntegration(item.id, enabled)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default IntegrationsSettingsPage
