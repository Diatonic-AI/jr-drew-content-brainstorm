import * as React from 'react'

export interface APIConfigFormProps {
  initialValues?: Record<string, string>
  onSubmit?: (values: Record<string, string>) => void
}

export const APIConfigForm: React.FC<APIConfigFormProps> = ({ initialValues, onSubmit }) => {
  const [values, setValues] = React.useState<Record<string, string>>(initialValues ?? {})

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(values)
      }}
    >
      {Object.entries(values).map(([key, value]) => (
        <label key={key} className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-muted-foreground">{key}</span>
          <input
            value={value}
            onChange={(event) => handleChange(key, event.target.value)}
            className="h-9 rounded-md border border-border bg-background px-3"
          />
        </label>
      ))}
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Save Configuration
      </button>
    </form>
  )
}

export default APIConfigForm
