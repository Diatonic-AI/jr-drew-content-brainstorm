import type { Integration } from '@/types/integrations'

export interface IntegrationCardProps {
  integration: Integration
  enabled: boolean
  onToggle?: (integration: Integration, enabled: boolean) => void
  onConfigure?: (integration: Integration) => void
}

export const IntegrationCard = ({ integration, enabled, onToggle, onConfigure }: IntegrationCardProps) => (
  <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
    <header className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
        <p className="text-xs text-muted-foreground">{integration.category}</p>
      </div>
      <button
        type="button"
        className={`inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${enabled ? 'border-destructive bg-destructive/10 text-destructive' : 'border-primary bg-primary/10 text-primary'}`}
        onClick={() => onToggle?.(integration, !enabled)}
      >
        {enabled ? 'Disable' : 'Enable'}
      </button>
    </header>
    <p className="text-sm text-muted-foreground">{integration.description}</p>
    <footer className="flex items-center justify-between text-xs text-muted-foreground">
      <button
        type="button"
        className="text-primary underline-offset-2 hover:underline"
        onClick={() => onConfigure?.(integration)}
      >
        Configure
      </button>
      <span>{integration.capabilities.length} capabilities</span>
    </footer>
  </div>
)

export default IntegrationCard
