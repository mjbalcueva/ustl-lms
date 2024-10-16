'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { addPasswordSchema, type AddPasswordSchema } from '@/shared/validations/auth'

import { Button } from '@/client/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/client/components/ui/form'
import { Icons } from '@/client/components/ui/icons'
import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemFooterDescription,
	ItemHeader,
	ItemTitle,
	ItemWrapper
} from '@/client/components/ui/item'
import { Loader } from '@/client/components/ui/loader'
import { PasswordInput } from '@/client/components/ui/password-input'

export const AddPasswordForm = () => {
	const router = useRouter()

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
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Add Password</ItemTitle>
				<ItemDescription>Set up a password to enhance your account security</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<ItemContent className="space-y-4 pb-4 md:pb-6" withSeparator>
						<FormField
							control={form.control}
							name="password"
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
							<ItemFooterDescription>Your account doesn&apos;t have a password yet</ItemFooterDescription>
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
