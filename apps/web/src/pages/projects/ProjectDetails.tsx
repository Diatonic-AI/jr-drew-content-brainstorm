import { useProjects } from '@/hooks/useProjects'

const ProjectDetailsPage = () => {
  const { projects, selectedProjectId } = useProjects()
  const project = projects.find((item) => item.id === selectedProjectId)

  if (!project) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Select a project to view details.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
        <p className="text-sm text-muted-foreground">{project.description ?? 'No description provided.'}</p>
      </header>
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {project.members.map((member) => (
            <li key={member.userId}>{member.userId} · {member.role}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectDetailsPage
