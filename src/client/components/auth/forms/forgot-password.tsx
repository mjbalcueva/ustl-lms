'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/shared/trpc/react'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/shared/validations/forgot-password'

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
	Input
} from '@/client/components/ui'

export const ForgotPasswordForm = () => {
	const form = useForm<ForgotPasswordSchema>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: ''
		}
	})

	const { mutate, data, error, isPending } = api.auth.forgotPassword.useMutation()
	const onSubmit: SubmitHandler<ForgotPasswordSchema> = (data) => mutate(data)

	return (
		<CardWrapper
			title="Forgot your password?"
			description="Enter your email address to reset your password."
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-card-foreground">Email Address</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your email"
										className="rounded-xl bg-background"
										type="email"
										autoComplete="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormResponse type="error" message={error?.message} />
					<FormResponse type="success" message={data?.message} />

					<ButtonShining className="w-full rounded-xl" shiningClassName="bg-white/20" disabled={isPending}>
						{isPending && (
							<span className="relative right-[7.2ch]">
								<Loader />
							</span>
						)}
						<span className="absolute">Send reset email</span>
					</ButtonShining>
				</form>
			</Form>
		</CardWrapper>
	)
}
