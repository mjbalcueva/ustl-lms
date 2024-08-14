'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { loginSchema, type LoginSchema } from '@/shared/schemas'
import { api } from '@/shared/trpc/react'

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
	PasswordInput
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const LoginForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? DEFAULT_LOGIN_REDIRECT

	const [formSuccess, setFormSuccess] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const { mutate, isPending, error } = api.auth.login.useMutation({
		onSuccess: async (data) => {
			const result = await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false
			})

			if (result?.error) {
				switch (result.error) {
					case 'CredentialsSignin':
						setFormError('Invalid credentials. Please try again.')
						break
					default:
						setFormError('An unexpected error occurred.')
						break
				}
			} else {
				setFormSuccess('Login successful! Redirecting...')
				router.push(callbackUrl)
			}
		}
	})

	const onSubmit: SubmitHandler<LoginSchema> = (data) => {
		setFormSuccess('')
		setFormError('')
		mutate(data)
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

					<FormResponse type="error" message={error?.message ?? formError} />
					<FormResponse type="success" message={formSuccess} />

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
