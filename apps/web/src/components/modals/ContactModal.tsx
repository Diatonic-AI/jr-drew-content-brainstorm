import { Button } from '@diatonic/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { COUNTRY_OPTIONS } from '@/lib/data/country-data'
import { useAuthStore } from '@/stores/authStore'

const contactSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  country: z.string().min(1, 'Select a country'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  message: z.string().min(10, 'Help us with a little more context'),
  meetingDate: z.string().min(1, 'Choose a date'),
  meetingSlot: z.string().min(1, 'Select a time'),
  acceptTerms: z.boolean().refine(value => value, 'Please accept the terms to continue')
})

type ContactValues = z.infer<typeof contactSchema>

const TEAM = [
  {
    id: 'mara',
    name: 'Mara Kingsley',
    title: 'Lead Productivity Strategist',
    avatar: 'https://i.pravatar.cc/96?img=12',
    expertise: ['Implementation roadmap', 'Workflow automations', 'Data onboarding']
  },
  {
    id: 'amir',
    name: 'Amir Chen',
    title: 'AI Workflow Architect',
    avatar: 'https://i.pravatar.cc/96?img=33',
    expertise: ['Prompt libraries', 'Custom dashboards', 'AI orchestration']
  }
]

const MEETING_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ContactModal({ open, onOpenChange, onSuccess }: ContactModalProps) {
  const user = useAuthStore(state => state.user)
  const [scheduled, setScheduled] = useState<{ date: string; slot: string } | null>(null)
  const [assignedMember] = useState(() => TEAM[Math.floor(Math.random() * TEAM.length)])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] ?? '',
      lastName: user?.name?.split(' ')[1] ?? '',
      email: user?.email ?? '',
      country: 'US',
      phone: '',
      message: '',
      meetingDate: '',
      meetingSlot: '',
      acceptTerms: false
    }
  })

  const upcomingDates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index + 1)
      return format(date, 'yyyy-MM-dd')
    })
  }, [])

  const submit = async (values: ContactValues) => {
    // TODO: Implement actual API call
    setScheduled({ date: values.meetingDate, slot: values.meetingSlot })
    onSuccess?.()
    reset({ ...values, message: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl grid-cols-1 gap-0 overflow-y-auto p-0 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 p-6">
          <DialogHeader>
            <DialogTitle>Book a strategy session</DialogTitle>
            <DialogDescription>
              Share your goals and we&apos;ll align the perfect workspace experience and team to support you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName?.message}>
                <Input placeholder="Jordan" {...register('firstName')} />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <Input placeholder="Lee" {...register('lastName')} />
              </Field>
            </div>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" placeholder="you@company.com" {...register('email')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
              <Field label="Country" error={errors.country?.message}>
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
                <Input placeholder="(555) 123-4567" {...register('phone')} />
              </Field>
            </div>
            <Field label="What should we prepare?" error={errors.message?.message}>
              <Textarea placeholder="Share goals, blockers, or systems to integrate…" {...register('message')} rows={4} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preferred date" error={errors.meetingDate?.message}>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('meetingDate')}
                >
                  <option value="">Choose a date</option>
                  {upcomingDates.map(date => (
                    <option key={date} value={date}>
                      {format(new Date(date), 'EEEE, MMM d')}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Preferred time" error={errors.meetingSlot?.message}>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('meetingSlot')}
                >
                  <option value="">Choose a time</option>
                  {MEETING_SLOTS.map(slot => (
                    <option key={slot} value={slot}>
                      {slot} (local time)
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field }) => (
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={value => field.onChange(Boolean(value))} />
                  <span>I accept the scheduling terms and consent to calendar invitations.</span>
                </label>
              )}
            />
            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>}
            {scheduled && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                <p className="text-sm font-medium text-primary">
                  Meeting scheduled for {format(new Date(scheduled.date), 'EEEE, MMM d')} at {scheduled.slot}.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Watch for a calendar invite from <strong>{assignedMember.name}</strong>. We&apos;ll include pre-read materials and
                  a shared workspace so you can add notes beforehand.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling…' : 'Book meeting'}
              </Button>
            </DialogFooter>
          </form>
        </div>
        <aside className="space-y-6 border-l border-t bg-muted/20 p-6 sm:border-t-0">
          <TeamMemberCard member={assignedMember} />
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h4 className="font-semibold">Meeting preview</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Alignment on goals & success metrics</li>
              <li>• Workspace walkthrough tailored to your role</li>
              <li>• Automation quick wins in under 60 seconds</li>
              <li>• Recommended integrations & adoption plan</li>
            </ul>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
              Calendar invite includes agenda, resources, and key takeaways template.
            </p>
          </div>
        </aside>
      </DialogContent>
    </Dialog>
  )
}

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

interface TeamMemberCardProps {
  member: typeof TEAM[number]
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{member.name}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{member.title}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">Focus areas</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {member.expertise.map(area => (
            <li key={area}>• {area}</li>
          ))}
        </ul>
      </div>
      <p className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
        Mara and Amir partner with every new client to architect high-output rituals that feel effortless within the first week.
      </p>
    </div>
  )
}
