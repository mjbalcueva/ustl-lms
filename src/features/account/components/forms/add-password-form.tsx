'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
	addPasswordSchema,
	type AddPasswordSchema
} from '@/features/account/validations/add-password-schema'

export const AddPasswordForm = () => {
	const router = useRouter()

	const form = useForm<AddPasswordSchema>({
		resolver: zodResolver(addPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: ''
		}
	})

	const { mutate, isPending } = api.account.addPassword.useMutation({
		onSuccess: (data) => {
			form.reset()
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Password</CardTitle>
				<CardDescription>Set up a password to enhance your account security</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<CardContent className="space-y-4 pb-4 md:pb-6" withSeparator>
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
					</CardContent>

					<CardFooter className="justify-end md:justify-between">
						<div className="hidden items-center gap-2 md:flex">
							<Info className="size-4 shrink-0 text-muted-foreground" />
							<CardFooterDescription>
								Your account doesn&apos;t have a password yet
							</CardFooterDescription>
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
