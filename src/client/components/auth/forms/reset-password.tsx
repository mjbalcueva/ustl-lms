'use client'

import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/shared/trpc/react'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/shared/validations/reset-password'

import { CardWrapper } from '@/client/components/auth/card-wrapper'
import { FormResponse } from '@/client/components/auth/form-response'
import { Loader } from '@/client/components/loader'
import {
	ButtonShining,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	PasswordInput
} from '@/client/components/ui'

export const ResetPasswordForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const form = useForm<ResetPasswordSchema>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			token: token ?? null
		}
	})

	const { mutate, data, error, isPending } = api.auth.resetPassword.useMutation()
	const onSubmit: SubmitHandler<ResetPasswordSchema> = (data) => mutate(data)

	return (
		<CardWrapper
			title="Reset Your Password"
			description="Enter a new password for your account."
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
					<FormResponse type="error" message={error?.message} />
					<FormResponse type="success" message={data?.message} />

					<ButtonShining className="w-full rounded-xl" shiningClassName="bg-white/20" disabled={isPending}>
						{isPending && (
							<span className="relative right-[7ch]">
								<Loader />
							</span>
						)}
						<span className="absolute">Reset password</span>
					</ButtonShining>
				</form>
			</Form>
		</CardWrapper>
	)
}