import * as React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './dialog'

type ModalRootProps = React.ComponentProps<typeof Dialog>
type ModalContentProps = React.ComponentProps<typeof DialogContent>
type ModalHeaderProps = React.ComponentProps<typeof DialogHeader>
type ModalFooterProps = React.ComponentProps<typeof DialogFooter>
type ModalTitleProps = React.ComponentProps<typeof DialogTitle>
type ModalDescriptionProps = React.ComponentProps<typeof DialogDescription>

export type ModalProps = ModalRootProps

export const Modal = Dialog
export const ModalTrigger = DialogTrigger
export const ModalClose = DialogClose

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  ModalContentProps
>(({ className, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={className}
    {...props}
  />
))
ModalContent.displayName = 'ModalContent'

export const ModalHeader = (props: ModalHeaderProps) => (
  <DialogHeader {...props} />
)

export const ModalFooter = (props: ModalFooterProps) => (
  <DialogFooter {...props} />
)

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  ModalTitleProps
>((props, ref) => <DialogTitle ref={ref} {...props} />)
ModalTitle.displayName = 'ModalTitle'

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescription>,
  ModalDescriptionProps
>((props, ref) => <DialogDescription ref={ref} {...props} />)
ModalDescription.displayName = 'ModalDescription'

export type {
  ModalContentProps,
  ModalDescriptionProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalTitleProps,
}
