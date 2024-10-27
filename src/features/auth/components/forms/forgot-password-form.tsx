'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/services/trpc/react'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { FormResponse } from '@/core/components/ui/form-response'
import { Input } from '@/core/components/ui/input'
import { Loader } from '@/core/components/ui/loader'

import { ButtonShining } from '@/features/auth/components/ui/button-shining'
import {
	forgotPasswordSchema,
	type ForgotPasswordSchema
} from '@/features/auth/validations/forgot-password-schema'

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
								<Input
									placeholder="Enter your email"
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

				<ButtonShining
					className="w-full rounded-xl"
					shiningClassName="bg-white/20"
					disabled={isPending}
					variant={isPending ? 'shine' : 'default'}
				>
					{isPending && <Loader />}
					Send reset email
				</ButtonShining>
			</form>
		</Form>
	)
}
