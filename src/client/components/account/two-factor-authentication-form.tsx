'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbShieldCheckFilled } from 'react-icons/tb'
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
	Separator,
	Switch
} from '@/client/components/ui'

const twoFactorSchema = z.object({
	twoFactorEnabled: z.boolean()
})

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

export const TwoFactorAuthenticationForm = () => {
	const [, setIsPending] = useState(false)

	const form = useForm<TwoFactorFormValues>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			twoFactorEnabled: false
		}
	})

	const onSubmit = (data: TwoFactorFormValues) => {
		setIsPending(true)
		// TODO: Implement the actual submission logic here
		console.log(data)
		setTimeout(() => setIsPending(false), 1000) // Simulating API call
	}

	return (
		<Card className="bg-popover">
			<CardHeader className="space-y-0.5 p-4">
				<CardTitle className="text-lg font-medium">Two-Factor Authentication</CardTitle>
				<CardDescription>Enabling this feature requires email verification for each login attempt</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="px-4">
						<Separator className="mb-4" />

						<div className="rounded-md border p-4">
							<FormField
								control={form.control}
								name="twoFactorEnabled"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between">
										<div className="space-y-0.5">
											<FormLabel className="text-popover-foreground">Enable Two-Factor Authentication</FormLabel>
											<p className="text-sm text-muted-foreground">Adds an extra layer of security</p>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<Separator />
					<CardFooter className="flex px-4 py-2.5">
						{form.watch('twoFactorEnabled') && (
							<div className="flex items-center text-sm text-muted-foreground">
								<TbShieldCheckFilled className="mr-2 h-4 w-4" />
								2FA is currently enabled
							</div>
						)}
						<ButtonShimmering className="ml-auto h-8 bg-accent text-sm">Save</ButtonShimmering>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
