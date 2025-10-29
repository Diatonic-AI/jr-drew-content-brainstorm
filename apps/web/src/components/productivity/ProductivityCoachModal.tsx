import * as React from 'react'

import type { CoachSuggestion } from '@/types/ai'

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalClose,
} from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

export interface ProductivityCoachModalProps {
  suggestion?: CoachSuggestion
  open: boolean
  onOpenChange: (open: boolean) => void
  onAcknowledge?: (suggestion: CoachSuggestion) => void
}

export const ProductivityCoachModal = ({
  suggestion,
  open,
  onOpenChange,
  onAcknowledge,
}: ProductivityCoachModalProps) => (
  <Modal open={open} onOpenChange={onOpenChange}>
    <ModalContent className="max-w-lg">
      <ModalHeader>
        <Badge variant="success">Productivity Coach</Badge>
        <ModalTitle>{suggestion?.message ?? 'Great job staying focused!'}</ModalTitle>
        <ModalDescription>
          {suggestion?.expiresAt
            ? `Action before ${new Date(suggestion.expiresAt).toLocaleTimeString()}.`
            : 'Here is a personalized suggestion based on your latest activity.'}
        </ModalDescription>
      </ModalHeader>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          {suggestion?.message ??
            'Stay consistent with your focus blocks and consider scheduling a longer break after your current sprint.'}
        </p>
        {suggestion?.actionLabel ? (
          <p className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            Suggested action: <strong className="text-foreground">{suggestion.actionLabel}</strong>
          </p>
        ) : null}
      </div>
      <ModalFooter className="mt-6 flex justify-end gap-2">
        <ModalClose asChild>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-muted"
            onClick={() => suggestion && onAcknowledge?.(suggestion)}
          >
            Dismiss
          </button>
        </ModalClose>
        <ModalClose asChild>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => suggestion && onAcknowledge?.(suggestion)}
          >
            Got it
          </button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
