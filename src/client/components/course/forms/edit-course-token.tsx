'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCopy, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editTokenSchema, type EditTokenSchema } from '@/shared/validations/course'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/client/components/ui/form'
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
			form.reset({ id, token: data.newToken })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

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
						<Label htmlFor="token" className="min-w-24 text-end">
							Token
						</Label>
						<Input id="token" value={formToken} readOnly />
						<Button
							size="icon"
							variant="outline"
							onClick={() => navigator.clipboard.writeText(formToken)}
							className="px-4"
						>
							<TbCopy className="size-4 shrink-0" />
						</Button>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="invite-link" className="min-w-24 text-end">
							Invite Link
						</Label>
						<Input id="invite-link" value={`${getBaseUrl()}/courses/${id}/enroll?token=${formToken}`} readOnly />
						<Button
							size="icon"
							variant="outline"
							onClick={() => navigator.clipboard.writeText(`${getBaseUrl()}/courses/${id}/enroll?token=${formToken}`)}
							className="px-4"
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
										<FormControl>
											<Input placeholder="e.g. 'CS101'" disabled={isPending} {...field} />
										</FormControl>
										<FormMessage />
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
