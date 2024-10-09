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
} from '@/client/components/ui'

type ConfirmModalProps = {
	onConfirm: () => void
	children: React.ReactNode
	title: string
	description: string
}

export const ConfirmModal = ({ onConfirm, title, description, children }: ConfirmModalProps) => {
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
					<AlertDialogAction className="rounded-md" onClick={handleConfirm}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
