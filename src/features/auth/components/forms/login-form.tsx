'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { buttonVariants } from '@/core/components/ui/button'
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/core/components/ui/input-otp'
import { Loader } from '@/core/components/ui/loader'
import { PasswordInput } from '@/core/components/ui/password-input'
import { cn } from '@/core/lib/utils/cn'

import { ButtonShining } from '@/features/auth/components/ui/button-shining'
import { login } from '@/features/auth/server/login-action'
import { loginSchema, type LoginSchema } from '@/features/auth/validations/login-schema'

export const LoginForm = () => {
	const [formSuccess, setFormSuccess] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()
	const [showTwoFactor, setShowTwoFactor] = useState(false)

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const onSubmit: SubmitHandler<LoginSchema> = (data) => {
		setFormError('')
		setFormSuccess('')

		startTransition(async () => {
			await login(data)
				.then((data) => {
					if (data?.error) return setFormError(data.error)
					if (data?.success) {
						setShowTwoFactor(data?.twoFactor ?? false)
						return setFormSuccess(data?.success)
					}
				})
				.catch(() => {
					setFormError('Something went wrong!')
				})
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{showTwoFactor ? (
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-card-foreground">Two Factor Code</FormLabel>
								<FormControl className="max-w-[348px]">
									<InputOTP maxLength={6} {...field}>
										<InputOTPGroup>
											<InputOTPSlot index={0} className="h-12 !rounded-lg bg-background" />
										</InputOTPGroup>
										<InputOTPGroup>
											<InputOTPSlot index={1} className="h-12 !rounded-lg bg-background" />
										</InputOTPGroup>
										<InputOTPGroup>
											<InputOTPSlot index={2} className="h-12 !rounded-lg bg-background" />
										</InputOTPGroup>
										<InputOTPGroup>
											<InputOTPSlot index={3} className="h-12 !rounded-lg bg-background" />
										</InputOTPGroup>
										<InputOTPGroup>
											<InputOTPSlot index={4} className="h-12 !rounded-lg bg-background" />
										</InputOTPGroup>
										<InputOTPGroup>
											<InputOTPSlot index={5} className="h-12 !rounded-lg bg-background" />
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
										<PasswordInput
											placeholder="Password"
											className="rounded-xl bg-background"
											{...field}
										/>
									</FormControl>
									<FormMessage />
									<div className="flex justify-end">
										<Link
											className={cn(
												buttonVariants({ variant: 'link', size: 'xs' }),
												'p-0 text-xs font-normal text-card-foreground'
											)}
											href="/forgot-password"
										>
											Forgot password?
										</Link>
									</div>
								</FormItem>
							)}
						/>
					</>
				)}

				<FormResponse type="error" message={formError} />
				<FormResponse type="success" message={formSuccess} />

				<ButtonShining
					className="w-full rounded-xl"
					shiningClassName="bg-white/20"
					disabled={isPending}
					variant={isPending ? 'shine' : 'default'}
				>
					{isPending && <Loader />}
					{showTwoFactor ? 'Confirm' : 'Login'}
				</ButtonShining>
			</form>
		</Form>
	)
}
