import * as React from 'react'

import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalClose } from '@/components/ui/Modal'
import type { Integration } from '@/types/integrations'


export interface IntegrationModalProps {
  integration?: Integration
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (integration: Integration, settings: Record<string, unknown>) => void
}

export const IntegrationModal = ({ integration, open, onOpenChange, onSave }: IntegrationModalProps) => {
  const [settings, setSettings] = React.useState<Record<string, unknown>>({})

  React.useEffect(() => {
    setSettings({})
  }, [integration])

  if (!integration) {
    return null
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>Configure {integration.name}</ModalTitle>
          <ModalDescription>
            Adjust scopes and options before enabling the integration.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>{integration.description}</p>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
            <p className="font-medium text-foreground">Capabilities</p>
            <ul className="mt-2 space-y-1">
              {integration.capabilities.map((capability) => (
                <li key={capability.id}>• {capability.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <ModalFooter className="mt-4 flex items-center justify-end gap-2">
          <ModalClose asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </ModalClose>
          <ModalClose asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => onSave?.(integration, settings)}
            >
              Save
            </button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default IntegrationModal
