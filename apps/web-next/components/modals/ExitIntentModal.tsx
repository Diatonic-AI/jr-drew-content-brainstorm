'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ExitIntentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSkip: () => void
  onFinishLater: () => void
}

export function ExitIntentModal({ open, onOpenChange, onSkip, onFinishLater }: ExitIntentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to finish your quiz later?</DialogTitle>
          <DialogDescription>
            Save your progress or skip ahead to explore the Diatonic AI workspace. You can always come back to resume the quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p>We&apos;ll keep your current responses safe for the next 24 hours.</p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onFinishLater} className="justify-center">
            Finish later
          </Button>
          <Button onClick={onSkip} className="justify-center">
            Skip to Diatonic AI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
