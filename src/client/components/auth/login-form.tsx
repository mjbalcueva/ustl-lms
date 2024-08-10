'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { loginSchema, type LoginSchema } from '@/shared/schemas'

import { CardWrapper } from '@/client/components/auth'
import {
	Button,
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
					<div className="space-y-4">
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
					</div>
					<Button
						type="submit"
						className="group/button relative w-full overflow-hidden rounded-xl hover:transition-all hover:duration-300 hover:ease-in-out"
					>
						Login
						<div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
							<div className="relative h-full w-8 bg-white/20" />
						</div>
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
