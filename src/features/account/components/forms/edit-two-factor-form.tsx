'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel
} from '@/core/components/ui/form'
import { Loader } from '@/core/components/ui/loader'
import { Switch } from '@/core/components/ui/switch'
import { ShieldCheckFilled, ShieldX } from '@/core/lib/icons'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardFooterDescription,
	CardHeader,
	CardInnerCard,
	CardTitle
} from '@/features/account/components/ui/card'

const twoFactorSchema = z.object({
	twoFactorEnabled: z.boolean()
})

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

export const EditTwoFactorForm = () => {
	const router = useRouter()
	const { data: session, update: updateSession } = useSession()

	const form = useForm<TwoFactorFormValues>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			twoFactorEnabled: session?.user?.isTwoFactorEnabled
		}
	})

	const { mutate, isPending } = api.account.editTwoFactor.useMutation({
		onSuccess: async (data) => {
			const updatedUser = {
				...session?.user,
				isTwoFactorEnabled: form.getValues().twoFactorEnabled
			}
			await Promise.all([
				updateSession({ user: updatedUser }),
				form.reset({ twoFactorEnabled: updatedUser.isTwoFactorEnabled })
			])
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Two-Factor Authentication</CardTitle>
				<CardDescription>
					Enabling this feature requires email verification for each login attempt
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<CardContent withSeparator>
						<CardInnerCard>
							<FormField
								control={form.control}
								name="twoFactorEnabled"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between space-y-0">
										<div>
											<FormLabel>Enable Two-Factor Authentication</FormLabel>
											<FormDescription>Adds an extra layer of security</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												aria-autocomplete="none"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</CardInnerCard>
					</CardContent>

					<CardFooter>
						<CardFooterDescription>
							{form.watch('twoFactorEnabled') ? (
								<>
									<ShieldCheckFilled className="mr-2 size-4" />
									2FA is currently enabled
								</>
							) : (
								<>
									<ShieldX className="mr-2 size-4" />
									2FA is currently disabled
								</>
							)}
						</CardFooterDescription>
						<Button className="ml-auto" size="sm" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
