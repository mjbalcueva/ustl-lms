import * as React from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/core/components/ui/alert-dialog'
import { type ButtonProps } from '@/core/components/ui/button'

type ConfirmModalProps = {
	onConfirm: () => void
	children: React.ReactNode
	actionLabel: string
	title: string
	description: string
	variant?: ButtonProps['variant']
}

export const ConfirmModal = ({
	onConfirm,
	title,
	description,
	children,
	actionLabel,
	variant = 'default'
}: ConfirmModalProps) => {
	const [open, setOpen] = React.useState(false)

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen)
	}

	const handleConfirm = () => {
		onConfirm()
		setOpen(false)
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
					<AlertDialogAction className="rounded-md" onClick={handleConfirm} variant={variant}>
						{actionLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
