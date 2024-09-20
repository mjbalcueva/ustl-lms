'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/shared/trpc/react'
import { registerSchema, type RegisterSchema } from '@/shared/validations/auth'

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
	Loader,
	PasswordInput
} from '@/client/components/ui'

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
								<Input placeholder="What should we call you?" autoComplete="name" {...field} />
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
							<FormLabel className="text-card-foreground">Email Address</FormLabel>
							<FormControl>
								<Input placeholder="Enter your email" type="email" autoComplete="email" {...field} />
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

				<div className="pt-2">
					<ButtonShining className="w-full" shiningClassName="bg-white/20" disabled={isPending}>
						{isPending && (
							<span className="relative right-[4.5ch]">
								<Loader />
							</span>
						)}
						<span className="absolute">Register</span>
					</ButtonShining>
				</div>
			</form>
		</Form>
	)
}
