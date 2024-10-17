'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editTokenSchema, type EditTokenSchema } from '@/shared/validations/course'

import { generateCourseToken } from '@/server/lib/course'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { CopyButton } from '@/client/components/ui/copy-button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/client/components/ui/form'
import { GenerateButton } from '@/client/components/ui/generate-button'
import { Input } from '@/client/components/ui/input'
import { Label } from '@/client/components/ui/label'
import { getBaseUrl } from '@/client/lib/utils'

export const EditCourseTokenForm = ({ id, token }: EditTokenSchema) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditTokenSchema>({
		resolver: zodResolver(editTokenSchema),
		defaultValues: { id, token }
	})
	const formToken = form.getValues('token')

	const { mutate, isPending } = api.course.editToken.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ id, token: data.newToken ?? '' })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	const enrollUrl = `${getBaseUrl()}/enroll/${formToken}`

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Invite</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && formToken && <TbEdit className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : formToken ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<Label htmlFor="token" className="min-w-24 text-end font-normal">
							Invite Token
						</Label>
						<Input id="token" value={formToken} readOnly />
						<CopyButton
							onCopy={async () => {
								await navigator.clipboard.writeText(formToken ?? '')
								toast.success('Token copied to clipboard!')
							}}
						/>
					</div>

					<div className="flex items-center gap-2">
						<Label htmlFor="invite-link" className="min-w-24 text-end font-normal">
							Invite Link
						</Label>
						<Input id="invite-link" value={enrollUrl} readOnly />
						<CopyButton
							onCopy={async () => {
								await navigator.clipboard.writeText(enrollUrl ?? '')
								toast.success('Invite link copied to clipboard!')
							}}
						/>
					</div>
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
						<CardContent>
							<FormField
								control={form.control}
								name="token"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center gap-2">
											<FormLabel className="min-w-24 text-end font-normal text-card-foreground">Invite Token</FormLabel>
											<FormControl>
												<div className="flex w-full items-center gap-2">
													<Input placeholder="e.g. 'CS101'" disabled={isPending} {...field} />
													<GenerateButton
														onGenerate={() => {
															const newToken = generateCourseToken()
															form.setValue('token', newToken, { shouldDirty: true })
														}}
													/>
												</div>
											</FormControl>
										</div>
										<FormMessage className="ml-[6.5rem]" />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								size="card"
								disabled={!form.formState.isDirty || isPending}
								variant={isPending ? 'shine' : 'default'}
							>
								{isPending ? 'Saving...' : 'Save'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}
		</Card>
	)
}
