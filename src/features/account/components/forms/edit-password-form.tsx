'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Loader } from '@/core/components/ui/loader'
import { PasswordInput } from '@/core/components/ui/password-input'
import { Info } from '@/core/lib/icons'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardFooterDescription,
	CardHeader,
	CardTitle
} from '@/features/account/components/ui/card'
import {
	editPasswordSchema,
	type EditPasswordSchema
} from '@/features/account/validations/edit-password-schema'

export const EditPasswordForm = () => {
	const router = useRouter()

	const form = useForm<EditPasswordSchema>({
		resolver: zodResolver(editPasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const { mutate, isPending } = api.account.editPassword.useMutation({
		onSuccess: (data) => {
			form.reset()
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => {
			form.setValue('currentPassword', '')
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<EditPasswordSchema> = (data) => mutate(data)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Update Password</CardTitle>
				<CardDescription>Update your password to secure your account</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4 pb-4 md:pb-6" withSeparator>
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Current Password</FormLabel>
									<FormControl>
										<PasswordInput
											parentClassName="sm:w-3/5"
											placeholder="Enter current password"
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">New Password</FormLabel>
									<FormControl>
										<PasswordInput
											parentClassName="sm:w-3/5"
											placeholder="Enter new password"
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Confirm New Password</FormLabel>
									<FormControl>
										<PasswordInput
											parentClassName="sm:w-3/5"
											placeholder="Confirm new password"
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<CardFooter className="justify-end md:justify-between">
						<div className="hidden items-center gap-2 md:flex">
							<Info className="size-4 shrink-0 text-muted-foreground" />
							<CardFooterDescription>Used to log in to your account</CardFooterDescription>
						</div>
						<Button size="sm" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
