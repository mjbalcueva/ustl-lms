'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Loader } from '@/core/components/ui/loader'
import { Info } from '@/core/lib/icons'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardFooterDescription,
	CardHeader,
	CardTitle
} from '@/features/account/components/ui/card'
import {
	editNameSchema,
	type EditNameSchema
} from '@/features/account/validations/edit-name-schema'

export const EditNameForm = () => {
	const router = useRouter()
	const { data: session, update: updateSession } = useSession()

	const form = useForm<EditNameSchema>({
		resolver: zodResolver(editNameSchema),
		defaultValues: {
			name: session?.user?.name ?? ''
		}
	})

	const { mutate, isPending } = api.account.editName.useMutation({
		onSuccess: async (data) => {
			const updatedUser = { ...session?.user, name: form.getValues().name }
			await Promise.all([
				updateSession({ user: updatedUser }),
				form.reset({ name: updatedUser.name })
			])
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Display Name</CardTitle>
				<CardDescription>
					Please enter your full name, or a display name you are comfortable
					with.
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<CardContent>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											className="sm:w-3/5"
											placeholder="Enter a new name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<CardFooter className="justify-end md:justify-between">
						<div className="hidden items-center gap-2 sm:flex">
							<Info className="size-4 shrink-0 text-muted-foreground" />
							<CardFooterDescription>
								Your display name helps others recognize you
							</CardFooterDescription>
						</div>
						<Button
							type="submit"
							size="sm"
							disabled={!form.formState.isDirty || isPending}
						>
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
