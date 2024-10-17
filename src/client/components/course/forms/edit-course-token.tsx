'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCopy, TbEdit, TbRefresh } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editTokenSchema, type EditTokenSchema } from '@/shared/validations/course'

import { generateCourseToken } from '@/server/lib/course'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Label } from '@/client/components/ui/label'
import { Separator } from '@/client/components/ui/separator'
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
			form.reset({ id, token: data.newToken })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	const enrollUrl = `${getBaseUrl()}/courses/enroll/${id}/${formToken}`

	const handleGenerateToken = () => {
		const newToken = generateCourseToken()
		form.setValue('token', newToken, { shouldDirty: true })
	}

	return (
		<Card>
			<CardHeader className="flex flex-col items-start">
				<div className="flex w-full items-center justify-between">
					<CardTitle>Course Invite</CardTitle>
					<Button onClick={toggleEdit} variant="ghost" size="card">
						{!isEditing && formToken && <TbEdit className="mr-2 size-4" />}
						{isEditing ? 'Cancel' : formToken ? 'Edit' : 'Add'}
					</Button>
				</div>
				<CardDescription>Invite students to your course by sharing the invite token or link.</CardDescription>
				<Separator className="mt-4" />
			</CardHeader>

			{!isEditing && (
				<CardContent className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<Label htmlFor="token" className="min-w-24 text-end">
							Invite Token
						</Label>
						<Input id="token" value={formToken} readOnly />
						<Button
							size="icon"
							variant="outline"
							className="px-4"
							onClick={async () => {
								await navigator.clipboard.writeText(formToken)
								toast.success('Token copied to clipboard!')
							}}
						>
							<TbCopy className="size-4 shrink-0" />
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<Label htmlFor="invite-link" className="min-w-24 text-end">
							Invite Link
						</Label>
						<Input id="invite-link" value={enrollUrl} readOnly />
						<Button
							size="icon"
							variant="outline"
							className="px-4"
							onClick={async () => {
								await navigator.clipboard.writeText(enrollUrl)
								toast.success('Invite link copied to clipboard!')
							}}
						>
							<TbCopy className="size-4 shrink-0" />
						</Button>
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
											<FormLabel className="min-w-24 text-end text-card-foreground">Invite Token</FormLabel>
											<FormControl>
												<div className="flex w-full items-center gap-2">
													<Input placeholder="e.g. 'CS101'" disabled={isPending} {...field} />
													<Button
														type="button"
														size="icon"
														variant="outline"
														className="px-4"
														onClick={handleGenerateToken}
													>
														<TbRefresh className="size-4 shrink-0" />
													</Button>
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
