import { Button } from '@diatonic/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { loginWithEmail, loginWithGoogle } from '@/services/auth.service'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

type LoginValues = z.infer<typeof loginSchema>

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignupClick: () => void
  onForgotPassword?: () => void
  onSuccess?: () => void
}

export function LoginModal({ open, onOpenChange, onSignupClick, onForgotPassword, onSuccess }: LoginModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })
  const [error, setError] = useState<string | null>(null)

  const submit = async (values: LoginValues) => {
    try {
      setError(null)
      await loginWithEmail(values.email, values.password)
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
    }
  }

  const handleGoogle = async () => {
    try {
      setError(null)
      await loginWithGoogle()
      onSuccess?.()
      onOpenChange(false)
    } catch {
      setError('Google sign-in failed. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>Sign in to access your workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="login-email">
              Email
            </label>
            <Input id="login-email" type="email" placeholder="you@company.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="login-password">
              Password
            </label>
            <Input id="login-password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </button>
            )}
            <button
              type="button"
              onClick={onSignupClick}
              className="text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <div className="relative py-3">
          <div className="absolute inset-x-0 top-1/2 border-t border-border"></div>
          <span className="relative mx-auto block w-fit bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
            or
          </span>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Continue with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
