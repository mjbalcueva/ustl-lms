'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ButtonShimmering } from '@/client/components/button-shimmering'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	PasswordInput,
	Separator,
	Switch
} from '@/client/components/ui'

const settingsSchema = z
	.object({
		twoFactorEnabled: z.boolean(),
		currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
		newPassword: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

type SettingsFormValues = z.infer<typeof settingsSchema>

export const SettingsForm = () => {
	const [, setIsPending] = useState(false)

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			twoFactorEnabled: false,
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const onSubmit = (data: SettingsFormValues) => {
		setIsPending(true)
		// TODO: Implement the actual submission logic here
		console.log(data)
		setTimeout(() => setIsPending(false), 1000) // Simulating API call
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card className="bg-popover">
					<CardHeader className="space-y-0.5 p-4">
						<CardTitle className="text-lg font-medium">Two-Factor Authentication</CardTitle>
						<CardDescription>Add an extra layer of security to your account</CardDescription>
					</CardHeader>
					<CardContent className="px-4">
						<Separator className="mb-4" />
						<FormField
							control={form.control}
							name="twoFactorEnabled"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel className="!m-0 text-popover-foreground">{field.value ? 'Enabled' : 'Disabled'}</FormLabel>
								</FormItem>
							)}
						/>
					</CardContent>
					<Separator />
					<CardFooter className="flex justify-end px-4 py-2.5">
						<ButtonShimmering className="h-8 bg-accent text-sm">Save</ButtonShimmering>
					</CardFooter>
				</Card>

				<Card className="bg-popover">
					<CardHeader className="space-y-0.5 p-4">
						<CardTitle className="text-lg font-medium">Change Password</CardTitle>
						<CardDescription>Change your password to secure your account</CardDescription>
					</CardHeader>
					<CardContent className="px-4">
						<Separator className="mb-4" />
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-popover-foreground">Current Password</FormLabel>
										<FormControl>
											<PasswordInput className="rounded-xl" placeholder="Enter current password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-popover-foreground">New Password</FormLabel>
										<FormControl>
											<PasswordInput className="rounded-xl" placeholder="Enter new password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-popover-foreground">Confirm New Password</FormLabel>
										<FormControl>
											<PasswordInput className="rounded-xl" placeholder="Confirm new password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<Separator />
					<CardFooter className="flex justify-end px-4 py-2.5">
						<ButtonShimmering className="h-8 bg-accent text-sm">Save</ButtonShimmering>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
