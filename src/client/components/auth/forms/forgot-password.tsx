'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/shared/trpc/react'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/shared/validations/auth'

import { FormResponse } from '@/client/components/auth/form-response'
import {
	ButtonShining,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Loader
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-card-foreground">Find your account</FormLabel>
							<FormControl>
								<Input placeholder="Enter your email" type="email" autoComplete="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormResponse type="error" message={error?.message} />
				<FormResponse type="success" message={data?.message} />

				<ButtonShining
					className="w-full rounded-xl"
					shiningClassName="bg-white/20"
					disabled={isPending}
					variant={isPending ? 'shine' : 'default'}
				>
					{isPending && (
						<span className="relative right-[7.2ch]">
							<Loader />
						</span>
					)}
					<span className="absolute">Send reset email</span>
				</ButtonShining>
			</form>
		</Form>
	)
}
