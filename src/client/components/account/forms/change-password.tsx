'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updatePasswordSchema, type UpdatePasswordSchema } from '@/shared/validations/update-password'

import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
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

export const ChangePasswordForm = () => {
	const form = useForm<UpdatePasswordSchema>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const { mutate, isPending } = api.auth.updatePassword.useMutation({
		onSuccess: (data) => {
			form.reset()
			toast.success(data.message)
		},
		onError: (error) => {
			form.setValue('currentPassword', '')
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdatePasswordSchema> = (data) => mutate(data)

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Change Password</ItemTitle>
				<ItemDescription>Change your password to secure your account</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ItemContent className="space-y-4 pb-4 md:pb-6" withSeparator>
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
					</ItemContent>

					<ItemFooter>
						<div className="flex items-center text-sm text-muted-foreground">Used to log in to your account</div>
						<Button className="ml-auto flex h-8 gap-1 text-sm" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
