'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { api } from '@/shared/trpc/react'
import { registerSchema, type RegisterSchema } from '@/shared/validations/register'

import { AuthCard, FormResponse } from '@/client/components/auth'
import { ButtonShimmering } from '@/client/components/button-shimmering'
import { Loader } from '@/client/components/loader'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
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

	const { mutate, data, error, isPending } = api.user.register.useMutation()
	const onSubmit: SubmitHandler<RegisterSchema> = (data) => mutate(data)

	return (
		<AuthCard
			title="Welcome, Thomasian!"
			description="To get started, please create an account."
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial
		>
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
										className="rounded-xl bg-background"
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

					<div className="pt-2">
						<ButtonShimmering className="w-full rounded-xl" shimmerClassName="bg-white/20" disabled={isPending}>
							{isPending && (
								<span className="relative right-[4.5ch]">
									<Loader />
								</span>
							)}
							<span className="absolute">Register</span>
						</ButtonShimmering>
					</div>
				</form>
			</Form>
		</AuthCard>
	)
}
