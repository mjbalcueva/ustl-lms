'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { registerSchema, type RegisterSchema } from '@/shared/schemas'

import { CardWrapper } from '@/client/components/auth'
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
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
		setIsLoading(true)
		console.log(data)
		setIsLoading(false)
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

					<div className="pt-2">
						<ButtonShimmering className="w-full rounded-xl" shimmerClassName="bg-white/20" disabled={isLoading}>
							{isLoading && (
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
