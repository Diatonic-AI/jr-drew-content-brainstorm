import { Button } from '@diatonic/ui'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ExitIntentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSkip: () => void
  onFinishLater: () => void
}

export function ExitIntentModal({ open, onOpenChange, onSkip, onFinishLater }: ExitIntentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Want to finish your quiz later?</DialogTitle>
          <DialogDescription>
            Save your progress or skip ahead to explore the workspace. You can always come back to resume the quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            We&apos;ll keep your current responses safe for the next 24 hours.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onFinishLater}>
            Finish later
          </Button>
          <Button onClick={onSkip}>
            Skip to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
