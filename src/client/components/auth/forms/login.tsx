'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { loginSchema, type LoginSchema } from '@/shared/validations/auth'

import { login } from '@/server/actions/login'

import { FormResponse } from '@/client/components/auth/form-response'
import { Loader } from '@/client/components/loader'
import {
	ButtonShining,
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
										<PasswordInput placeholder="Password" className="rounded-xl bg-background" {...field} />
									</FormControl>
									<FormMessage />
									<div className="flex justify-end">
										<Link
											className={cn(
												buttonVariants({ variant: 'link', size: 'xs' }),
												'p-0 text-xs font-normal text-card-foreground'
											)}
											href="/auth/forgot-password"
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

				<ButtonShining className="w-full rounded-xl" shiningClassName="bg-white/20" disabled={isPending}>
					{isPending && (
						<span className={cn('relative', showTwoFactor ? 'right-[4ch]' : 'right-[3.4ch]')}>
							<Loader />
						</span>
					)}
					<span className="absolute">{showTwoFactor ? 'Confirm' : 'Login'}</span>
				</ButtonShining>
			</form>
		</Form>
	)
}
