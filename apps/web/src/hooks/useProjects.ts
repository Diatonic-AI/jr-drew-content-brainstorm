import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { ProjectsService } from '@/services/projects.service'
import { useProjectsStore } from '@/stores/projectsStore'
import type { Project, ProjectId, ProjectSummary } from '@/types/projects'


export const useProjects = () => {
  const {
    projects,
    summaries,
    allocations,
    healthMetrics,
    selectedProjectId,
    filters,
    setProjects,
    setSummaries,
    upsertProject,
    removeProject,
    selectProject,
    setFilters,
    upsertSummary,
    upsertAllocation,
    upsertHealthMetrics,
  } = useProjectsStore()

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectsService.list,
    staleTime: 60 * 1000,
    onSuccess: (items) => setProjects(items),
  })

  const summaryQuery = useQuery({
    queryKey: ['projects', 'summaries'],
    queryFn: ProjectsService.listSummaries,
    staleTime: 60 * 1000,
    onSuccess: (items) => setSummaries(items),
  })

  const projectSummaries: ProjectSummary[] = Object.values(summaries)

  const saveProject = useCallback(
    (project: Project) => upsertProject(project),
    [upsertProject]
  )

  const deleteProject = useCallback(
    (projectId: ProjectId) => removeProject(projectId),
    [removeProject]
  )

  return {
    projects,
    projectSummaries,
    allocations,
    healthMetrics,
    selectedProjectId,
    filters,
    isLoading: projectsQuery.isLoading || summaryQuery.isLoading,
    upsertProject: saveProject,
    removeProject: deleteProject,
    selectProject,
    setFilters,
    upsertSummary,
    upsertAllocation,
    upsertHealthMetrics,
  }
}
