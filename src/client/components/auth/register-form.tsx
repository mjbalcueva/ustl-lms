'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { registerSchema, type RegisterSchema } from '@/shared/schemas'

import { CardWrapper } from '@/client/components/auth'
import {
	Button,
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

	const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
		console.log(data)
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
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground">Name</FormLabel>
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
									<FormLabel className="text-foreground">Email Address</FormLabel>
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
									<FormLabel className="text-foreground">Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder="Password" className="rounded-xl bg-background" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						type="submit"
						className="group/button relative w-full overflow-hidden rounded-xl hover:transition-all hover:duration-300 hover:ease-in-out"
					>
						Register
						<div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
							<div className="relative h-full w-8 bg-white/20" />
						</div>
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
