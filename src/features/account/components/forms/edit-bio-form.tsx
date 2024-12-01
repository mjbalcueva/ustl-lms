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
import { Loader } from '@/core/components/ui/loader'
import { Textarea } from '@/core/components/ui/textarea'
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
	editBioSchema,
	type EditBioSchema
} from '@/features/account/validations/edit-bio-schema'

export const EditBioForm = () => {
	const router = useRouter()
	const { data: session, update: updateSession } = useSession()

	const form = useForm<EditBioSchema>({
		resolver: zodResolver(editBioSchema),
		defaultValues: {
			bio: session?.user?.bio ?? ''
		}
	})

	const { mutate, isPending } = api.account.editBio.useMutation({
		onSuccess: async (data) => {
			const updatedUser = { ...session?.user, bio: form.getValues().bio }
			await Promise.all([
				updateSession({ user: updatedUser }),
				form.reset({ bio: updatedUser.bio })
			])
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Bio</CardTitle>
				<CardDescription>
					Tell others about yourself. This will be displayed on your profile.
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<CardContent>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											className="resize-none"
											placeholder="Write a brief bio..."
											{...field}
											value={field.value ?? ''}
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
								Share a bit about yourself with the community
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
