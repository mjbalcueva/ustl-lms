'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/shared/trpc/react'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/shared/validations/auth'

import { FormResponse } from '@/client/components/auth/form-response'
import {
	ButtonShining,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Loader,
	PasswordInput
} from '@/client/components/ui'

export const ResetPasswordForm = ({ token }: { token: string }) => {
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
					{isPending && (
						<span className="relative right-[7ch]">
							<Loader />
						</span>
					)}
					<span className="absolute">Reset password</span>
				</ButtonShining>
			</form>
		</Form>
	)
}
