import Link from 'next/link'
import { QuizFunnel } from '@/components/quiz/QuizFunnel'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 pb-24 pt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6">
        <section className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Diatonic AI
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold sm:text-6xl">
            Engineer an extra hour of focus every single day
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Your workflow audit starts with a 60-second quiz. We auto-build dashboards, automations, and rituals based on your answers—no blank canvases, only personalised momentum.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="#quiz">Begin the quiz</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Preview dashboard demo</Link>
            </Button>
          </div>
        </section>
        <div id="quiz">
          <QuizFunnel />
        </div>
      </div>
    </main>
  )
}
