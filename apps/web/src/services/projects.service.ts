import type { Project, ProjectSummary } from '@/types/projects'

import { mockApi } from '@/lib/api/mock-server'

export const ProjectsService = {
  list(): Promise<Project[]> {
    return mockApi.projects.list()
  },
  listSummaries(): Promise<ProjectSummary[]> {
    return mockApi.projects.summaries()
  },
  async getSummary(projectId: string): Promise<ProjectSummary> {
    const summary = await mockApi.projects.summary(projectId)
    if (!summary) {
      throw new Error(`Project summary not found for ${projectId}`)
    }
    return summary
  },
  save(project: Project): Promise<Project> {
    return mockApi.projects.save(project)
  },
}

export default ProjectsService
