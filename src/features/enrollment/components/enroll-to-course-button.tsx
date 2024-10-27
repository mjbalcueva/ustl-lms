'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/core/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Separator } from '@/core/components/ui/separator'

import {
	enrollmentSchema,
	type EnrollmentSchema
} from '@/features/enrollment/validations/enrollment'

export const EnrollToCourseButton = () => {
	const router = useRouter()

	const form = useForm<EnrollmentSchema>({
		resolver: zodResolver(enrollmentSchema),
		defaultValues: {
			token: ''
		}
	})

	const { mutate, isPending } = api.enrollment.enroll.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		},
		onError: (error) => toast.error(error.message)
	})

	const handleEnroll = (data: EnrollmentSchema) => {
		mutate(data)
	}

	const handleCancel = () => {
		form.reset()
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Join Course</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join a Course</DialogTitle>
					<DialogDescription>Enter the enrollment token to join a course.</DialogDescription>
				</DialogHeader>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleEnroll)} className="grid gap-4">
						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Enter Token</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter enrollment token"
											className="!bg-card"
											aria-label="Enrollment Token"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="gap-2 md:gap-0">
							<DialogClose asChild>
								<Button variant="outline" onClick={handleCancel}>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isPending} variant={isPending ? 'shine' : 'default'}>
								{isPending ? 'Processing...' : 'Join Course'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
