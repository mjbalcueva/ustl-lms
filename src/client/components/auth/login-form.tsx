'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { loginSchema, type LoginSchema } from '@/shared/schemas'

import { CardWrapper } from '@/client/components/auth'
import { ButtonShimmering } from '@/client/components/button-shimmering'
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

export const LoginForm = () => {
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<LoginSchema> = (data) => {
		console.log(data)
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

					<ButtonShimmering className="w-full rounded-xl" shimmerClassName="bg-white/20">
						Login
					</ButtonShimmering>
				</form>
			</Form>
		</CardWrapper>
	)
}
