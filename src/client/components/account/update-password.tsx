'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updatePasswordSchema, type UpdatePasswordSchema } from '@/shared/validations/auth'

import { Icons } from '@/client/components/icons'
import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemFooterDescription,
	ItemHeader,
	ItemTitle,
	ItemWrapper
} from '@/client/components/item'
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Loader,
	PasswordInput
} from '@/client/components/ui'

export const UpdatePasswordForm = () => {
	const router = useRouter()

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
			router.refresh()
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
				<ItemTitle>Update Password</ItemTitle>
				<ItemDescription>Update your password to secure your account</ItemDescription>
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
					</ItemContent>

					<ItemFooter className="justify-end md:justify-between">
						<div className="hidden items-center gap-2 sm:flex">
							<Icons.info className="h-4 w-4 shrink-0 text-muted-foreground" />
							<ItemFooterDescription>Used to log in to your account</ItemFooterDescription>
						</div>
						<Button className="flex h-8 gap-1 text-sm" type="submit" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
