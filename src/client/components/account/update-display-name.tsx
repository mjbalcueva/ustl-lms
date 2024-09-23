'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateDisplayNameSchema, type UpdateDisplayNameSchema } from '@/shared/validations/profile'

import { Icons } from '@/client/components/icons'
import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemFooterDescription,
	ItemHeader,
	ItemTitle,
	ItemWrapper
} from '@/client/components/item'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input, Loader } from '@/client/components/ui'

export const UpdateDisplayNameForm = () => {
	const router = useRouter()
	const { data: session, update: updateSession } = useSession()

	const form = useForm<UpdateDisplayNameSchema>({
		resolver: zodResolver(updateDisplayNameSchema),
		defaultValues: {
			name: session?.user?.name ?? ''
		}
	})

	const { mutate, isPending } = api.profile.updateDisplayName.useMutation({
		onSuccess: async (data) => {
			const updatedUser = { ...session?.user, name: form.getValues().name }
			await Promise.all([updateSession({ user: updatedUser }), form.reset({ name: updatedUser.name })])
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Display Name</ItemTitle>
				<ItemDescription>Please enter your full name, or a display name you are comfortable with.</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<ItemContent>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input className="sm:w-3/5" placeholder="Enter a new name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</ItemContent>

					<ItemFooter className="justify-end md:justify-between">
						<div className="hidden items-center gap-2 sm:flex">
							<Icons.info className="h-4 w-4 shrink-0 text-muted-foreground" />
							<ItemFooterDescription>Your display name helps others recognize you</ItemFooterDescription>
						</div>
						<Button className="flex h-8 gap-1 text-sm" type="submit" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
