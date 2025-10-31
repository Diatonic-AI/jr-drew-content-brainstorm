import { motion, AnimatePresence } from 'framer-motion'
import { PlayCircle, PauseCircle, Headphones, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@diatonic/ui'
import { Textarea } from '@/components/ui/textarea'
import { LoginModal } from '@/components/auth/LoginModal'
import { SignupModal } from '@/components/auth/SignupModal'
import { ContactModal } from '@/components/modals/ContactModal'
import { ExitIntentModal } from '@/components/modals/ExitIntentModal'
import { useCountdown } from '@/hooks/useCountdown'
import { useExitIntent } from '@/hooks/useExitIntent'
import { useNarrator } from '@/hooks/useNarrator'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useAuthStore } from '@/stores/authStore'

type FunnelStage = 'intro' | 'quiz' | 'summary'

interface QuizQuestion {
  id: string
  prompt: string
  helper: string
  placeholder: string
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'tracking',
    prompt: 'How do you currently track your daily productivity?',
    helper: 'Tell us about the tools, rituals, or habits you rely on.',
    placeholder: 'I currently track productivity by…'
  },
  {
    id: 'challenge',
    prompt: "What's your biggest challenge in managing projects?",
    helper: 'Think about handoffs, communication, decision-making, or accountability gaps.',
    placeholder: 'The biggest challenge I face is…'
  },
  {
    id: 'team',
    prompt: 'Do you work solo or with a team?',
    helper: 'If you collaborate, mention roles and collaboration hotspots.',
    placeholder: 'I work with…'
  },
  {
    id: 'projects',
    prompt: 'How many projects do you juggle simultaneously?',
    helper: 'Rough estimates are perfect. Include side initiatives if they matter.',
    placeholder: 'On average I juggle…'
  },
  {
    id: 'feature',
    prompt: "What's your ideal productivity tool feature?",
    helper: 'Imagine the smartest automation, dashboard, or assistant.',
    placeholder: 'The dream feature would…'
  },
  {
    id: 'success',
    prompt: 'How do you measure success in your work?',
    helper: 'Share the KPIs, outcomes, or signals that matter most.',
    placeholder: 'Success for me looks like…'
  },
  {
    id: 'energy',
    prompt: 'What time of day are you most productive?',
    helper: 'Helps us sequence your rituals, breaks, and deep focus windows.',
    placeholder: 'My energy peaks…'
  }
]

interface QuizFunnelProps {
  autoStart?: boolean
}

export function QuizFunnel({ autoStart }: QuizFunnelProps) {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const [searchParams] = useSearchParams()
  const redirectTarget = searchParams.get('redirect')
  const [stage, setStage] = useState<FunnelStage>(autoStart ? 'quiz' : 'intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [inputValue, setInputValue] = useState('')
  const { enabled, toggle, speak } = useNarrator()
  const { remaining, reset } = useCountdown(60, stage !== 'quiz')
  const { visible: exitVisible, dismiss: dismissExit, reset: resetExit } = useExitIntent()
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    if (stage === 'quiz') {
      reset()
      const prompt = QUESTIONS[questionIndex]?.prompt
      if (prompt) {
        speak(prompt)
        setInputValue(answers[QUESTIONS[questionIndex].id] ?? '')
      }
    }
  }, [stage, questionIndex, speak, answers, reset])

  useEffect(() => {
    if (stage === 'quiz' && remaining === 0) {
      handleAdvance(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, stage])

  useEffect(() => {
    if (stage !== 'quiz') {
      setInputValue('')
    }
  }, [stage])

  useEffect(() => {
    const intent = searchParams.get('auth')
    if (intent === 'login') {
      setLoginOpen(true)
    }
    if (intent === 'signup') {
      setSignupOpen(true)
    }
  }, [searchParams])

  const progress = useMemo(() => (questionIndex / QUESTIONS.length) * 100, [questionIndex])

  const currentQuestion = QUESTIONS[questionIndex]
  const typewriterText = useTypewriter(currentQuestion?.prompt ?? '', 18, stage !== 'quiz')

  const handleAdvance = useCallback(
    (autoDueToTimeout = false) => {
      if (!currentQuestion) return
      const trimmed = inputValue.trim()
      if (!trimmed && !autoDueToTimeout) {
        return
      }

      const nextAnswers = {
        ...answers,
        [currentQuestion.prompt]: autoDueToTimeout ? 'Skipped (timeout)' : trimmed || 'Skipped'
      }
      setAnswers(nextAnswers)

      if (questionIndex === QUESTIONS.length - 1) {
        setStage('summary')
        setQuestionIndex(0)
        setInputValue('')
        return
      }
      setQuestionIndex(prev => prev + 1)
      setInputValue(nextAnswers[QUESTIONS[questionIndex + 1]?.prompt] ?? '')
      reset()
    },
    [answers, currentQuestion, inputValue, questionIndex, reset]
  )

  const handleBack = () => {
    if (questionIndex === 0) {
      setStage('intro')
      setInputValue('')
      return
    }
    const prevIndex = questionIndex - 1
    setQuestionIndex(prevIndex)
    const prevQuestion = QUESTIONS[prevIndex]
    setInputValue(answers[prevQuestion.prompt] ?? '')
    reset()
  }

  const handleStart = () => {
    resetExit()
    setStage('quiz')
    setQuestionIndex(0)
    setInputValue('')
    reset()
  }

  const handleSkipToHome = () => {
    dismissExit()
    navigate('/dashboard')
  }

  const summaryCards = useMemo(
    () => [
      {
        title: 'AI-crafted workspace',
        description:
          'Your responses orchestrate a dashboard, focus rituals, and automation templates tuned to how you operate.'
      },
      {
        title: 'Team onboarding blueprint',
        description:
          'We translate quiz insights into a rollout playbook so collaborators adopt the system in under a week.'
      },
      {
        title: 'Momentum in 60 seconds',
        description:
          'After signup you'll receive a ready-to-launch experience designed to return a full hour to your day.',
      },
    ],
    []
  )

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-background to-muted p-8 shadow-lg sm:p-12">
        <AnimatedBackdrop stage={stage} />
        <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
          <header className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-primary/70">Interactive onboarding</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Discover your productivity profile</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Answer seven fast prompts so we can auto-build the rituals, dashboards, and AI assist flows that earn you back
              time immediately.
            </p>
          </header>

          <AnimatePresence mode="wait">
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {summaryCards.map(card => (
                    <div
                      key={card.title}
                      className="rounded-lg border border-border bg-background/60 p-5 text-left shadow-sm backdrop-blur"
                    >
                      <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button size="lg" onClick={handleStart}>
                    Start 60-second quiz
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setLoginOpen(true)}>
                    Already a member? Sign in
                  </Button>
                </div>
              </motion.div>
            )}

            {stage === 'quiz' && currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 text-left"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {questionIndex + 1} / {QUESTIONS.length}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <button
                        type="button"
                        onClick={toggle}
                        className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground transition hover:bg-muted"
                      >
                        {enabled ? <Headphones className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        Narrator {enabled ? 'on' : 'off'}
                      </button>
                      <div className="flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">
                        {remaining > 0 ? (
                          <PlayCircle className="h-4 w-4" />
                        ) : (
                          <PauseCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span>{remaining}s</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 basis-full overflow-hidden rounded-full bg-muted sm:max-w-xs sm:basis-auto">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.max(progress, 8)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background/80 p-6 shadow-lg backdrop-blur">
                  <h2 className="text-2xl font-semibold text-foreground">{typewriterText}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{currentQuestion.helper}</p>
                  <Textarea
                    className="mt-6 min-h-[144px]"
                    value={inputValue}
                    placeholder={currentQuestion.placeholder}
                    onChange={event => setInputValue(event.target.value)}
                    autoFocus
                  />
                  {remaining === 0 && (
                    <p className="mt-2 text-sm text-destructive">
                      Timer expired. You can still share a quick headline before continuing.
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap justify-between gap-3">
                    <Button variant="ghost" onClick={handleBack}>
                      {questionIndex === 0 ? 'Back to intro' : 'Previous'}
                    </Button>
                    <Button onClick={() => handleAdvance()} disabled={!inputValue.trim() && remaining > 0}>
                      {questionIndex === QUESTIONS.length - 1 ? 'Generate my workspace plan' : 'Next'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 text-left"
              >
                <div className="rounded-lg border border-border bg-background/90 p-6 shadow-lg backdrop-blur">
                  <h2 className="text-3xl font-semibold">Your productivity blueprint is ready</h2>
                  <p className="mt-3 text-muted-foreground">
                    We translated your responses into a tailored onboarding plan. Save it by creating your account, or talk with
                    our team to review the roadmap live.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Button size="lg" onClick={() => setSignupOpen(true)}>
                      Submit answers & create account
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setContactOpen(true)}>
                      Book a strategy session
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {summaryCards.map(card => (
                    <div key={card.title} className="rounded-lg border border-border bg-muted/30 p-5 shadow-sm">
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  ))}
                </div>
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button className="text-primary underline-offset-4 hover:underline" onClick={() => setLoginOpen(true)}>
                      Log in to sync your insights.
                    </button>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ExitIntentModal
        open={exitVisible}
        onOpenChange={open => {
          if (!open) dismissExit()
        }}
        onSkip={handleSkipToHome}
        onFinishLater={() => {
          dismissExit()
          setSignupOpen(true)
        }}
      />

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSignupClick={() => {
          setLoginOpen(false)
          setSignupOpen(true)
        }}
        onSuccess={() => {
          if (redirectTarget) {
            navigate(redirectTarget)
            return
          }
          if (stage !== 'summary') setStage('summary')
        }}
      />

      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        answers={answers}
        fromQuiz
        onSuccess={() => {
          setStage('summary')
          setSignupOpen(false)
        }}
      />

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </>
  )
}

function AnimatedBackdrop({ stage }: { stage: FunnelStage }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/5 to-transparent"
      animate={{
        opacity: stage === 'quiz' ? 0.6 : stage === 'summary' ? 0.3 : 0.45,
        scale: stage === 'quiz' ? 1.05 : 1
      }}
      transition={{ duration: 0.6 }}
    />
  )
}
