import { mockApi } from '@/lib/api/mock-server'
import type { Integration, IntegrationConnection } from '@/types/integrations'


export const IntegrationsService = {
  list(): Promise<Integration[]> {
    return mockApi.integrations.list()
  },
  connections(): Promise<IntegrationConnection[]> {
    return mockApi.integrations.connections()
  },
}

export default IntegrationsService
