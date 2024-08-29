'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateDisplayNameSchema, type UpdateDisplayNameSchema } from '@/shared/validations/update-display-name'

import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle,
	ItemWrapper
} from '@/client/components/account/item-wrapper'
import { Loader } from '@/client/components/loader'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/client/components/ui'

export const UpdateDisplayNameForm = () => {
	const { data: sesh } = useSession()

	const form = useForm<UpdateDisplayNameSchema>({
		resolver: zodResolver(updateDisplayNameSchema),
		defaultValues: {
			name: sesh?.user?.name ?? ''
		}
	})

	const { mutate, isPending } = api.profile.updateDisplayName.useMutation({
		onSuccess: (data) => {
			form.reset(form.getValues())
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateDisplayNameSchema> = (data) => mutate(data)

	return (
		<ItemWrapper>
			<ItemHeader>
				<ItemTitle>Display Name</ItemTitle>
				<ItemDescription>Please enter your full name, or a display name you are comfortable with.</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ItemContent>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input className="rounded-xl sm:w-3/5" placeholder="Enter a new name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</ItemContent>

					<ItemFooter>
						<div className="flex items-center text-sm text-muted-foreground">
							Your display name helps others recognize you
						</div>
						<Button className="ml-auto flex h-8 gap-1 text-sm" disabled={!form.formState.isDirty || isPending}>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
