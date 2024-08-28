'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { newPasswordSchema, type NewPasswordSchema } from '@/shared/validations/new-password'

import { newPassword } from '@/server/actions/new-password'

import { CardWrapper, FormResponse } from '@/client/components/auth'
import { ButtonShimmering } from '@/client/components/button-shimmering'
import { Loader } from '@/client/components/loader'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, PasswordInput } from '@/client/components/ui'

export const NewPasswordForm = () => {
	const [formSuccess, setFormSuccess] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const form = useForm<NewPasswordSchema>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: ''
		}
	})

	const onSubmit: SubmitHandler<NewPasswordSchema> = (data) => {
		if (!token) {
			setFormError('Missing token!')
			return
		}

		startTransition(async () => {
			await newPassword(data, token)
				.then((data) => {
					if (data?.error) {
						setFormSuccess(null)
						return setFormError(data?.error)
					}
					if (data?.success) {
						setFormError(null)
						return setFormSuccess(data?.success)
					}
				})
				.catch(() => {
					setFormError('Something went wrong!')
				})
		})
	}

	return (
		<CardWrapper
			title="Welcome Back, Thomasian!"
			description="Login to your account to continue."
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-card-foreground">Password</FormLabel>
								<FormControl>
									<PasswordInput placeholder="Password" className="rounded-xl bg-background" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormResponse type="error" message={formError} />
					<FormResponse type="success" message={formSuccess} />

					<ButtonShimmering className="w-full rounded-xl" shimmerClassName="bg-white/20" disabled={isPending}>
						{isPending && (
							<span className="relative right-[7ch]">
								<Loader />
							</span>
						)}
						<span className="absolute">Reset password</span>
					</ButtonShimmering>
				</form>
			</Form>
		</CardWrapper>
	)
}
