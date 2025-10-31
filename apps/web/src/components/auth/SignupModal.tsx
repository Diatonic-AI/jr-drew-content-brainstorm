import * as React from 'react'
import { Button } from '@diatonic/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsYouType, type CountryCode } from 'libphonenumber-js'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { COUNTRY_OPTIONS } from '@/lib/data/country-data'
import { signupWithEmail } from '@/services/auth.service'

declare global {
  interface Window {
    google?: typeof google
  }
}

type QuizAnswers = Record<string, string>

const baseSignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  country: z.string().min(1, 'Select a country code'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  address: z.string().min(5, 'Provide a full address'),
  marketingOptIn: z.boolean().optional(),
  acceptTerms: z.boolean(),
  message: z.string().optional()
})

const signupSchema = baseSignupSchema
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
  .refine(data => data.acceptTerms, {
    message: 'You must accept the user agreements to continue',
    path: ['acceptTerms']
  })

type SignupValues = z.infer<typeof signupSchema>

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answers?: QuizAnswers
  onSuccess?: () => void
  prefillEmail?: string
  fromQuiz?: boolean
}

export function SignupModal({ open, onOpenChange, answers, onSuccess, prefillEmail, fromQuiz }: SignupModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<string[]>([])
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const [placesLoaded, setPlacesLoaded] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: prefillEmail ?? '',
      password: '',
      confirmPassword: '',
      country: 'US',
      phone: '',
      address: '',
      marketingOptIn: false,
      acceptTerms: false,
      message: answers ? formatAnswersForMessage(answers) : ''
    }
  })

  useEffect(() => {
    if (prefillEmail) {
      setValue('email', prefillEmail)
    }
  }, [prefillEmail, setValue])

  useEffect(() => {
    if (answers) {
      setValue('message', formatAnswersForMessage(answers))
    }
  }, [answers, setValue])

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const ensurePlaces = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (placesLoaded) return
    if (window.google?.maps?.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
      setPlacesLoaded(true)
      return
    }

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      console.warn('Missing VITE_GOOGLE_PLACES_API_KEY for address autocomplete')
      return
    }

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-google-places]')
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true })
        return
      }
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.dataset.googlePlaces = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Places'))
      document.body.appendChild(script)
    })

    if (window.google?.maps?.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
      setPlacesLoaded(true)
    }
  }, [placesLoaded])

  useEffect(() => {
    if (open) {
      ensurePlaces().catch((error: unknown) => console.warn(error))
    }
  }, [open, ensurePlaces])

  const country = watch('country')

  const formatter = useMemo(() => new AsYouType((country || 'US') as CountryCode), [country])

  const onPhoneChange = useCallback(
    (value: string) => {
      const digits = value.replace(/[^\d+]/g, '')
      formatter.reset()
      const formatted = formatter.input(digits)
      setValue('phone', formatted, { shouldDirty: true, shouldTouch: true })
    },
    [formatter, setValue]
  )

  const onAddressInput = useCallback(
    async (value: string) => {
      setValue('address', value, { shouldDirty: true })
      if (!autocompleteServiceRef.current || value.length < 3) {
        setPredictions([])
        return
      }
      const suggestions = await new Promise<string[]>(resolve => {
        const service = autocompleteServiceRef.current
        const googlePlaces = window.google?.maps?.places
        if (!service || !googlePlaces) {
          resolve([])
          return
        }
        service.getPlacePredictions({ input: value }, (preds, status) => {
          if (status !== googlePlaces.PlacesServiceStatus.OK || !preds) {
            resolve([])
            return
          }
          resolve(preds.map(item => item.description))
        })
      })
      setPredictions(suggestions)
    },
    [setValue]
  )

  const submit = async (values: SignupValues) => {
    try {
      setError(null)
      await signupWithEmail({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {fromQuiz ? 'Submit your tailored productivity profile' : 'Create your account'}
          </DialogTitle>
          <DialogDescription>
            We&apos;ll use your information to personalize your workspace, automations, and onboarding experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              <Input placeholder="Avery" {...register('firstName')} />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <Input placeholder="Rivera" {...register('lastName')} />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@company.com" {...register('email')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Password" error={errors.password?.message}>
              <Input type="password" placeholder="Create a secure password" {...register('password')} />
            </Field>
            <Field label="Confirm password" error={errors.confirmPassword?.message}>
              <Input type="password" placeholder="Re-type password" {...register('confirmPassword')} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <Field label="Country code" error={errors.country?.message}>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register('country')}
              >
                {COUNTRY_OPTIONS.map(option => (
                  <option key={option.code} value={option.code}>
                    {option.name} ({option.dialCode})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Phone number" error={errors.phone?.message}>
              <Input
                placeholder="(555) 123-4567"
                value={watch('phone')}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onPhoneChange(event.target.value)}
              />
            </Field>
          </div>
          <Field label="Address" error={errors.address?.message}>
            <div className="space-y-2">
              <Input
                placeholder="Start typing your full address"
                value={watch('address')}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onAddressInput(event.target.value)}
                onFocus={() => ensurePlaces().catch(console.warn)}
              />
              {predictions.length > 0 && (
                <div className="rounded-lg border border-border bg-background shadow-sm">
                  <ul className="divide-y divide-border">
                    {predictions.map(prediction => (
                      <li key={prediction}>
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setValue('address', prediction, { shouldDirty: true, shouldValidate: true })
                            setPredictions([])
                          }}
                        >
                          {prediction}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Field>
          <Field label="Anything we should prep before our kickoff?" optional error={errors.message?.message}>
            <Textarea
              placeholder="Share context, goals, or integrations to prioritise…"
              {...register('message')}
              rows={3}
            />
          </Field>
          {answers && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="mb-2 text-sm font-medium">Quiz snapshot</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {Object.entries(answers).map(([prompt, response]) => (
                  <li key={prompt}>
                    <span className="font-medium text-foreground">{prompt}: </span>
                    <span>{response}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={watch('marketingOptIn')}
                onCheckedChange={value => setValue('marketingOptIn', Boolean(value), { shouldDirty: true })}
              />
              <span>I agree to receive resources, launch briefings, and productivity strategies.</span>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={watch('acceptTerms')}
                onCheckedChange={value => setValue('acceptTerms', Boolean(value), { shouldDirty: true, shouldValidate: true })}
              />
              <span>I accept the user agreements, terms, and privacy policies.</span>
            </label>
            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>}
          </div>
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {fromQuiz
                ? isSubmitting
                  ? 'Submitting…'
                  : 'Submit my answers'
                : isSubmitting
                  ? 'Creating account…'
                  : 'Create account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface FieldProps {
  label: string
  error?: string
  optional?: boolean
  children: React.ReactElement
}

function Field({ label, error, optional, children }: FieldProps) {
  const id = useId()
  
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium leading-none">
        <span className="flex items-center gap-2">
          {label}
          {optional && <span className="text-xs font-normal text-muted-foreground">(optional)</span>}
        </span>
      </label>
      {React.cloneElement(children, { id })}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function formatAnswersForMessage(answers: QuizAnswers | undefined) {
  if (!answers) return ''
  return Object.entries(answers)
    .map(([question, answer]) => `${question}: ${answer}`)
    .join('\n')
}
