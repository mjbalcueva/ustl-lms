'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { registerSchema, type RegisterSchema } from '@/shared/schemas'

import { register } from '@/server/actions/register'

import { CardWrapper, FormResponse } from '@/client/components/auth'
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
	const [formSuccess, setFormSuccess] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
		setFormError('')
		setFormSuccess('')

		startTransition(async () => {
			await register(data).then(async (data) => {
				if (data?.error) return setFormError(data?.error)
				if (data?.success) setFormSuccess(data?.success)

				await signIn('credentials', {
					email: data.email,
					password: data.password
				})
			})
		})
	}

	return (
		<CardWrapper
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

					<FormResponse type="error" message={formError} />
					<FormResponse type="success" message={formSuccess} />

					<div className="pt-2">
						<ButtonShimmering
							className="w-full rounded-xl"
							shimmerClassName="bg-white/20"
							disabled={isPending || !!formSuccess}
						>
							{(isPending || !!formSuccess) && (
								<span className="relative right-[4.5ch]">
									<Loader />
								</span>
							)}
							<span className="absolute">Register</span>
						</ButtonShimmering>
					</div>
				</form>
			</Form>
		</CardWrapper>
	)
}
