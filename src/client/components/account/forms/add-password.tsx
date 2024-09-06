'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { addPasswordSchema, type AddPasswordSchema } from '@/shared/validations/add-password'

import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemFooterDescription,
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

export const AddPasswordForm = () => {
	const form = useForm<AddPasswordSchema>({
		resolver: zodResolver(addPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: ''
		}
	})

	const { mutate, isPending } = api.auth.addPassword.useMutation({
		onSuccess: (data) => {
			form.reset()
			toast.success(data.message)
			window.location.reload()
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<AddPasswordSchema> = (data) => mutate(data)

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Add Password</ItemTitle>
				<ItemDescription>Set up a password to enhance your account security</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ItemContent className="space-y-4 pb-4 md:pb-6" withSeparator>
						<FormField
							control={form.control}
							name="password"
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
						<ItemFooterDescription>Your account doesn&apos;t have a password yet</ItemFooterDescription>
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
