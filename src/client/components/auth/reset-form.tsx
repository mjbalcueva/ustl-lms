'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { resetSchema, type ResetSchema } from '@/shared/validations/reset'

import { reset } from '@/server/actions/reset'

import { CardWrapper, FormResponse } from '@/client/components/auth'
import { ButtonShimmering } from '@/client/components/button-shimmering'
import { Loader } from '@/client/components/loader'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/client/components/ui'

export const ResetForm = () => {
	const [formSuccess, setFormSuccess] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	const form = useForm<ResetSchema>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			email: ''
		}
	})

	const onSubmit: SubmitHandler<ResetSchema> = (data) => {
		setFormError('')
		setFormSuccess('')

		startTransition(async () => {
			await reset(data).then((data) => {
				if (data?.error) return setFormError(data?.error)
				if (data?.success) return setFormSuccess(data?.success)
			})
		})
	}

	return (
		<CardWrapper
			title="Welcome Back, Thomasian!"
			description="Login to your account to continue."
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

					<FormResponse type="error" message={formError} />
					<FormResponse type="success" message={formSuccess} />

					<ButtonShimmering className="w-full rounded-xl" shimmerClassName="bg-white/20" disabled={isPending}>
						{isPending && (
							<span className="relative right-[7.2ch]">
								<Loader />
							</span>
						)}
						<span className="absolute">Send reset email</span>
					</ButtonShimmering>
				</form>
			</Form>
		</CardWrapper>
	)
}
