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
import { PasswordInput } from '@/core/components/ui/password-input'

import { ButtonShining } from '@/features/auth/components/ui/button-shining'
import {
	registerSchema,
	type RegisterSchema
} from '@/features/auth/validations/register-schema'

export const RegisterForm = () => {
	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const { mutate, data, error, isPending } = api.auth.register.useMutation()
	const onSubmit: SubmitHandler<RegisterSchema> = (data) => mutate(data)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-card-foreground">Name</FormLabel>
							<FormControl>
								<Input
									placeholder="What should we call you?"
									autoComplete="name"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-card-foreground">
								Email Address
							</FormLabel>
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
					Register
				</ButtonShining>
			</form>
		</Form>
	)
}
