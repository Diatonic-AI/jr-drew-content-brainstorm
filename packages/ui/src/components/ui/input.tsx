import * as React from 'react'

import { cn } from '../../lib/utils'

type InputElement = HTMLInputElement

type InputProps = React.InputHTMLAttributes<InputElement>

type Ref = React.Ref<InputElement>

const Input = React.forwardRef<InputElement, InputProps>(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-focus placeholder:text-muted-foreground focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref as Ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
