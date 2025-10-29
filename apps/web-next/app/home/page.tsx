'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginModal } from '@/components/auth/LoginModal'
import { SignupModal } from '@/components/auth/SignupModal'
import { ContactModal } from '@/components/modals/ContactModal'
import { useAuth } from '@/contexts/AuthContext'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI orchestrated rituals',
    description: 'Generate daily focus sprints, break cadences, and recovery prompts tuned to your energy profile.'
  },
  {
    icon: Users,
    title: 'Cross-team clarity',
    description: 'Pipeline dashboards, stakeholder updates, and async standups auto-dispatched at the perfect cadence.'
  },
  {
    icon: Shield,
    title: 'Reliable data spine',
    description: 'Connect your project stack and let Diatonic surface anomalies, risks, and opportunities in real-time.'
  }
]

const SECTIONS = [
  {
    title: 'Less chasing, more creating',
    body: 'Let Diatonic triage updates, surface blockers, and propose next-best-actions. You stay anchored to the high-leverage decisions.',
    bullets: [
      'Adaptive focus playlist with live workload balancing',
      'AI generated project briefings you can ship as-is',
      'Meeting autopilot: summaries, action items, accountability'
    ]
  },
  {
    title: 'Operational intelligence in one sweep',
    body: 'No more tab-sprawl. Your CRM, tasks, docs, and calendar data stream into a single glass cockpit for the day.',
    bullets: [
      'Time-to-value under seven minutes of setup',
      'Plays nicely with Asana, Notion, Linear, ClickUp, and more',
      'Role-based dashboards for founders, operators, and ICs'
    ]
  }
]

export default function AlternativeHomePage() {
  const { user } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <main className="space-y-24 bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),transparent_45%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 text-center">
          <div className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary">
            Diatonic AI Platform
          </div>
          <h1 className="text-4xl font-semibold sm:text-6xl">A single workspace for effortless, repeatable magic</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Diatonic AI blends planning, execution, and augmentation into a micro-orchestrated flow. Launch calmer workloads, protect your deep focus, and give your team the context it needs without the chaos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => setSignupOpen(true)}>
              Create account
            </Button>
            <Button size="lg" variant="outline" onClick={() => setContactOpen(true)}>
              Talk to a strategist
            </Button>
            {!user && (
              <Button size="lg" variant="ghost" onClick={() => setLoginOpen(true)}>
                Log in
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map(feature => (
            <div key={feature.title} className="rounded-2xl border bg-background p-6 shadow-sm">
              <feature.icon className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6">
        {SECTIONS.map(section => (
          <div key={section.title} className="grid gap-6 rounded-3xl border bg-background/80 p-6 shadow-lg sm:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground">{section.body}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.bullets.map(bullet => (
                  <li key={bullet} className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="link" className="px-0 text-primary">
                <Link href="/dashboard" className="group inline-flex items-center gap-1">
                  Browse live dashboards
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3 rounded-2xl border bg-muted/30 p-5 text-sm text-muted-foreground">
              <p>
                "Our ops cadence went from brittle to buoyant in a week. Diatonic keeps everyone oriented and eliminates the constant chase for updates."
              </p>
              <p className="font-medium text-foreground">— Priya Shah, COO @ Northstar Collective</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 rounded-3xl border bg-primary text-primary-foreground p-8 shadow-xl sm:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Ready to reclaim your time?</h2>
            <p className="text-primary-foreground/80">
              We ship a personalised workspace, automation recipes, and a rollout plan within 24 hours of signup. Bring your tools—Diatonic will handle the connections.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" onClick={() => setSignupOpen(true)}>
                Start activation
              </Button>
              <Button variant="outline" size="lg" onClick={() => setContactOpen(true)}>
                Book onboarding call
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 text-sm">
            <p className="font-semibold text-primary-foreground">Implementation timeline</p>
            <ul className="mt-4 space-y-2">
              <li>Day 0: Quiz + workspace provisioning</li>
              <li>Day 1: Deep-focus rituals + dashboards delivered</li>
              <li>Day 3: Automation hooks live across your stack</li>
              <li>Day 7: Team adoption playbook in your inbox</li>
            </ul>
          </div>
        </div>
      </section>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSignupClick={() => {
          setLoginOpen(false)
          setSignupOpen(true)
        }}
      />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </main>
  )
}
