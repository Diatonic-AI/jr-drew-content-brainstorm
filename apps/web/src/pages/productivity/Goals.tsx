import { useFocus } from '@/hooks/useFocus'

const GoalsPage = () => {
  const { goals } = useFocus()

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-foreground">Focus Goals</h1>
        <p className="text-sm text-muted-foreground">
          Track weekly and daily focus minute targets for key projects.
        </p>
      </header>
      <ul className="space-y-3">
        {goals.map((goal) => (
          <li key={goal.id} className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">{goal.title}</h2>
            <p className="text-xs text-muted-foreground">Target {goal.targetMinutes} minutes per {goal.cadence}.</p>
          </li>
        ))}
        {!goals.length ? (
          <li className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            No goals yet. Create one to keep yourself accountable.
          </li>
        ) : null}
      </ul>
    </div>
  )
}

export default GoalsPage
