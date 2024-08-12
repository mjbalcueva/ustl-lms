'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { loginSchema, type LoginSchema } from '@/shared/schemas'

import { login } from '@/server/actions/login'

import { CardWrapper, FormResponse } from '@/client/components/auth'
import { ButtonShimmering } from '@/client/components/button-shimmering'
import { Loader } from '@/client/components/loader'
import {
	buttonVariants,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	PasswordInput
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export const LoginForm = () => {
	const [showTwoFactor, setShowTwoFactor] = useState(false)
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			code: '',
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<LoginSchema> = (data) => {
		setError('')
		setSuccess('')

		startTransition(async () => {
			await login(data)
				.then((data) => {
					if (data?.error) {
						setError(data?.error)
						return
					}

					if (data?.success) setSuccess(data?.success)

					setShowTwoFactor(false)
				})
				.catch((e) => {
					console.log('login error', e)
					setError('Something went wrong')
				})
		})
	}

	return (
		<CardWrapper
			title="Welcome Back, Thomasian!"
			description="Login to your account to continue."
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{showTwoFactor ? (
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Two Factor Code</FormLabel>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} className="bg-background" />
												<InputOTPSlot index={1} className="bg-background" />
												<InputOTPSlot index={2} className="bg-background" />
												<InputOTPSlot index={3} className="bg-background" />
												<InputOTPSlot index={4} className="bg-background" />
												<InputOTPSlot index={5} className="bg-background" />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : (
						<>
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
										<div className="flex justify-end">
											<Link
												className={cn(
													buttonVariants({ variant: 'link', size: 'xs' }),
													'p-0 text-xs font-normal text-card-foreground'
												)}
												href="/auth/reset"
											>
												Forgot password?
											</Link>
										</div>
									</FormItem>
								)}
							/>
						</>
					)}

					<FormResponse type="error" message={error} />
					<FormResponse type="success" message={success} />

					<ButtonShimmering className="w-full rounded-xl" shimmerClassName="bg-white/20" disabled={isPending}>
						{isPending && (
							<span className="relative right-[3.4ch]">
								<Loader />
							</span>
						)}
						<span className="absolute">Login</span>
					</ButtonShimmering>
				</form>
			</Form>
		</CardWrapper>
	)
}
