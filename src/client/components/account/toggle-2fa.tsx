'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { TbShieldCheckFilled, TbShieldX } from 'react-icons/tb'
import { toast } from 'sonner'
import { z } from 'zod'

import { api } from '@/shared/trpc/react'

import { Button } from '@/client/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/client/components/ui/form'
import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemFooterDescription,
	ItemHeader,
	ItemInnerCard,
	ItemTitle,
	ItemWrapper
} from '@/client/components/ui/item'
import { Loader } from '@/client/components/ui/loader'
import { Switch } from '@/client/components/ui/switch'

const twoFactorSchema = z.object({
	twoFactorEnabled: z.boolean()
})

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

export const Toggle2FAForm = () => {
	const router = useRouter()
	const { data: session, update: updateSession } = useSession()

	const form = useForm<TwoFactorFormValues>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			twoFactorEnabled: session?.user?.isTwoFactorEnabled
		}
	})

	const { mutate, isPending } = api.auth.toggle2FA.useMutation({
		onSuccess: async (data) => {
			const updatedUser = { ...session?.user, isTwoFactorEnabled: form.getValues().twoFactorEnabled }
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
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Two-Factor Authentication</ItemTitle>
				<ItemDescription>Enabling this feature requires email verification for each login attempt</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<ItemContent withSeparator>
						<ItemInnerCard>
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
											<Switch checked={field.value} onCheckedChange={field.onChange} aria-autocomplete="none" />
										</FormControl>
									</FormItem>
								)}
							/>
						</ItemInnerCard>
					</ItemContent>

					<ItemFooter>
						<ItemFooterDescription>
							{form.watch('twoFactorEnabled') ? (
								<>
									<TbShieldCheckFilled className="mr-2 h-4 w-4" />
									2FA is currently enabled
								</>
							) : (
								<>
									<TbShieldX className="mr-2 h-4 w-4" />
									2FA is currently disabled
								</>
							)}
						</ItemFooterDescription>
						<Button className="ml-auto h-8 gap-1 text-sm" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
