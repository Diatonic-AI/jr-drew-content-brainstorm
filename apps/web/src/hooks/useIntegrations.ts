import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { IntegrationsService } from '@/services/integrations.service'
import { useNotificationStore } from '@/stores/notificationStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Integration, IntegrationConnection, IntegrationId } from '@/types/integrations'


export const useIntegrations = () => {
  const { settings, updateSettings } = useSettingsStore()
  const { push } = useNotificationStore()

  const integrationsQuery = useQuery<Integration[]>({
    queryKey: ['integrations', 'catalog'],
    queryFn: IntegrationsService.list,
    staleTime: 10 * 60 * 1000,
  })

  const connectionsQuery = useQuery<IntegrationConnection[]>({
    queryKey: ['integrations', 'connections'],
    queryFn: IntegrationsService.connections,
    staleTime: 60 * 1000,
  })

  const toggleIntegration = useCallback(
    (id: IntegrationId, enabled: boolean) => {
      const enabledIds = new Set(settings.integrations.enabledIntegrationIds)
      if (enabled) {
        enabledIds.add(id)
      } else {
        enabledIds.delete(id)
      }
      updateSettings({
        integrations: {
          ...settings.integrations,
          enabledIntegrationIds: Array.from(enabledIds),
        },
      })
      push({
        id: `integration-${id}`,
        title: enabled ? 'Integration enabled' : 'Integration disabled',
        description: id,
        createdAt: new Date().toISOString(),
      })
    },
    [settings.integrations, updateSettings, push]
  )

  return {
    enabledIntegrations: settings.integrations.enabledIntegrationIds,
    integrations: integrationsQuery.data ?? [],
    connections: connectionsQuery.data ?? [],
    isLoading: integrationsQuery.isLoading || connectionsQuery.isLoading,
    toggleIntegration,
  }
}
