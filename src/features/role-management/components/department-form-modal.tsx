'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/core/components/ui/alert-dialog'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'

const formSchema = z.object({
	department: z.string().min(1, 'Department name is required')
})

type FormValues = z.infer<typeof formSchema>

type DepartmentFormModalProps = {
	onSubmit: (department: string) => Promise<void>
	children: React.ReactNode
}

export function DepartmentFormModal({
	onSubmit,
	children
}: DepartmentFormModalProps) {
	const [open, setOpen] = React.useState(false)
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			department: ''
		}
	})

	const handleSubmit = async (values: FormValues) => {
		try {
			await onSubmit(values.department)
			form.reset()
			setOpen(false)
		} catch (error) {
			console.error('Error submitting department:', error)
		}
	}

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen)
		if (!newOpen) {
			form.reset()
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Assign Department</AlertDialogTitle>
					<AlertDialogDescription>
						Please provide the department name for the new Dean
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="department"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Department Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter department name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Assign</Button>
						</div>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	)
}
