import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Project,
  ProjectAllocation,
  ProjectHealthMetric,
  ProjectId,
  ProjectSummary,
} from '@/types/projects'

interface ProjectFilters {
  search?: string
  status?: Project['status'][]
  type?: Project['type'][]
  tagIds?: string[]
}

interface ProjectsStoreState {
  projects: Project[]
  summaries: Record<ProjectId, ProjectSummary>
  allocations: Record<ProjectId, ProjectAllocation>
  healthMetrics: Record<ProjectId, ProjectHealthMetric[]>
  selectedProjectId?: ProjectId
  filters: ProjectFilters
}

interface ProjectsStoreActions {
  setProjects: (projects: Project[]) => void
  setSummaries: (summaries: ProjectSummary[]) => void
  upsertProject: (project: Project) => void
  removeProject: (projectId: ProjectId) => void
  selectProject: (projectId?: ProjectId) => void
  setFilters: (filters: ProjectFilters) => void
  upsertSummary: (summary: ProjectSummary) => void
  upsertAllocation: (allocation: ProjectAllocation) => void
  upsertHealthMetrics: (projectId: ProjectId, metrics: ProjectHealthMetric[]) => void
  reset: () => void
}

type ProjectsStore = ProjectsStoreState & ProjectsStoreActions

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      summaries: {},
      allocations: {},
      healthMetrics: {},
      selectedProjectId: undefined,
      filters: {},
      setProjects: (projects) =>
        set(() => ({
          projects: [...projects],
        })),
      setSummaries: (summaries) =>
        set(() => ({
          summaries: summaries.reduce<Record<ProjectId, ProjectSummary>>((acc, summary) => {
            acc[summary.project.id] = summary
            return acc
          }, {}),
        })),
      upsertProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects.filter((existing) => existing.id !== project.id),
            project,
          ],
        })),
      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== projectId),
          summaries: Object.fromEntries(
            Object.entries(state.summaries).filter(([id]) => id !== projectId)
          ),
          allocations: Object.fromEntries(
            Object.entries(state.allocations).filter(([id]) => id !== projectId)
          ),
          healthMetrics: Object.fromEntries(
            Object.entries(state.healthMetrics).filter(([id]) => id !== projectId)
          ),
          selectedProjectId:
            state.selectedProjectId === projectId ? undefined : state.selectedProjectId,
        })),
      selectProject: (projectId) => set(() => ({ selectedProjectId: projectId })),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      upsertSummary: (summary) =>
        set((state) => ({
          summaries: { ...state.summaries, [summary.project.id]: summary },
        })),
      upsertAllocation: (allocation) =>
        set((state) => ({
          allocations: { ...state.allocations, [allocation.projectId]: allocation },
        })),
      upsertHealthMetrics: (projectId, metrics) =>
        set((state) => ({
          healthMetrics: { ...state.healthMetrics, [projectId]: metrics },
        })),
      reset: () =>
        set(() => ({
          projects: [],
          summaries: {},
          allocations: {},
          healthMetrics: {},
          selectedProjectId: undefined,
          filters: {},
        })),
    }),
    {
      name: 'projects-store',
      partialize: (state) => ({
        projects: state.projects,
        filters: state.filters,
        selectedProjectId: state.selectedProjectId,
      }),
    }
  )
)
