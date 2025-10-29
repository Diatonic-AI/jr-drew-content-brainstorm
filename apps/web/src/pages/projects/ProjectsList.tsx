import { ProjectsPanel } from '@/components/dashboard/ProjectsPanel'
import { useProjects } from '@/hooks/useProjects'

const ProjectsListPage = () => {
  const { projectSummaries } = useProjects()

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">Overview of tracked projects and allocations.</p>
      </header>
      <ProjectsPanel summaries={projectSummaries} />
    </div>
  )
}

export default ProjectsListPage
