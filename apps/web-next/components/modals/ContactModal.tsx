'use client'

import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { COUNTRY_OPTIONS } from '@/components/auth/country-data'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user } = useAuth()
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
      firstName: user?.displayName?.split(' ')[0] ?? '',
      lastName: user?.displayName?.split(' ')[1] ?? '',
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
    setScheduled({ date: values.meetingDate, slot: values.meetingSlot })
    onSuccess?.()
    reset({ ...values, message: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid max-h-[90vh] gap-6 overflow-y-auto p-0 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 p-6">
          <DialogHeader>
            <DialogTitle>Book a strategy session</DialogTitle>
            <DialogDescription>
              Share your goals and we&apos;ll align the perfect Diatonic AI workspace experience and team to support you.
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
                  className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <Textarea placeholder="Share goals, blockers, or systems to integrate…" {...register('message')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preferred date" error={errors.meetingDate?.message}>
                <select
                  className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary-foreground">
                <p className="font-medium text-primary">
                  Meeting pencilled for {format(new Date(scheduled.date), 'EEEE, MMM d')} at {scheduled.slot}.
                </p>
                <p className="mt-2 text-primary/80">
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
        <aside className="space-y-6 border-t border-l bg-muted/20 p-6 sm:border-t-0">
          <TeamMemberCard member={assignedMember} />
          <div className="rounded-2xl border bg-background p-4 text-sm">
            <h4 className="font-semibold text-foreground">Meeting preview</h4>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• Alignment on goals &amp; success metrics</li>
              <li>• Workspace walkthrough tailored to your role</li>
              <li>• Automation quick wins in under 60 seconds</li>
              <li>• Recommended integrations &amp; adoption plan</li>
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
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <div className="flex flex-col gap-2 font-normal text-foreground">{children}</div>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </label>
  )
}

interface TeamMemberCardProps {
  member: typeof TEAM[number]
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{member.name}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{member.title}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Focus areas</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {member.expertise.map(area => (
            <li key={area}>• {area}</li>
          ))}
        </ul>
      </div>
      <p className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        Mara and Amir partner with every new client to architect high-output rituals that feel effortless within the first week.
      </p>
    </div>
  )
}
