'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemInnerCard,
	ItemTitle,
	ItemWrapper
} from '@/client/components/account/item-wrapper'
import { Loader } from '@/client/components/loader'
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	PasswordInput
} from '@/client/components/ui'

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
		newPassword: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export const ChangePasswordForm = () => {
	const [isPending, setIsPending] = useState(false)

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const onSubmit = (data: ChangePasswordFormValues) => {
		setIsPending(true)
		// TODO: Implement the actual submission logic here
		console.log(data)
		setTimeout(() => setIsPending(false), 1000) // Simulating API call
	}

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Change Password</ItemTitle>
				<ItemDescription>Change your password to secure your account</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ItemContent>
						<ItemInnerCard className="space-y-4 pb-4">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-card-foreground">Current Password</FormLabel>
										<FormControl>
											<PasswordInput
												className="rounded-xl"
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
												className="rounded-xl"
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
												className="rounded-xl"
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
						</ItemInnerCard>
					</ItemContent>

					<ItemFooter>
						<Button className="ml-auto h-8 gap-1 text-sm" disabled={isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
