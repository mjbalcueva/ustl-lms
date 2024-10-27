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
import { Loader } from '@/core/components/ui/loader'
import { PasswordInput } from '@/core/components/ui/password-input'

import { ButtonShining } from '@/features/auth/components/ui/button-shining'
import {
	resetPasswordSchema,
	type ResetPasswordSchema
} from '@/features/auth/validations/reset-password-schema'

export const ResetPasswordForm = ({ token }: { token: string }) => {
	const form = useForm<ResetPasswordSchema>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			token
		}
	})

	const { mutate, data, error, isPending } = api.auth.resetPassword.useMutation()
	const onSubmit: SubmitHandler<ResetPasswordSchema> = (data) => {
		console.log({ clicked: true, data })
		mutate(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-card-foreground">Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormResponse type="error" message={error?.message} />
				<FormResponse type="success" message={data?.message} />

				<ButtonShining
					className="w-full"
					shiningClassName="bg-white/20"
					disabled={isPending}
					variant={isPending ? 'shine' : 'default'}
				>
					{isPending && <Loader />}
					Reset password
				</ButtonShining>
			</form>
		</Form>
	)
}
