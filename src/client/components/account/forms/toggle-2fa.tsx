'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { TbShieldCheckFilled, TbShieldX } from 'react-icons/tb'
import { toast } from 'sonner'
import { z } from 'zod'

import { api } from '@/shared/trpc/react'

import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemInnerCard,
	ItemTitle,
	ItemWrapper
} from '@/client/components/account/item-wrapper'
import { Loader } from '@/client/components/loader'
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	Switch
} from '@/client/components/ui'

const twoFactorSchema = z.object({
	twoFactorEnabled: z.boolean()
})

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

export const Toggle2FAForm = () => {
	const session = useSession()

	const form = useForm<TwoFactorFormValues>({
		resolver: zodResolver(twoFactorSchema),
		defaultValues: {
			twoFactorEnabled: session?.data?.user?.isTwoFactorEnabled
		}
	})

	const { mutate, isPending } = api.auth.toggle2FA.useMutation({
		onSuccess: (data) => {
			form.reset(form.getValues())
			toast.success(data.message)
			window.location.reload()
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit = (data: TwoFactorFormValues) => mutate(data)

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Two-Factor Authentication</ItemTitle>
				<ItemDescription>Enabling this feature requires email verification for each login attempt</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
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
						<div className="flex items-center text-sm text-muted-foreground">
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
						</div>
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
