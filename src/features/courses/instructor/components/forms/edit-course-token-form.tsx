'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { CopyButton } from '@/core/components/copy-button'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Copy, Edit, Link } from '@/core/lib/icons'
import { getBaseUrl } from '@/core/lib/utils/get-base-url'

import { GenerateButton } from '@/features/courses/instructor/components/ui/generate-button'
import { generateCourseInviteToken } from '@/features/courses/shared/lib/generate-course-invite-token'
import {
	editCourseTokenSchema,
	type EditCourseTokenSchema
} from '@/features/courses/shared/validations/course-schema'

export const EditCourseTokenForm = ({
	courseId,
	token
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	token: RouterOutputs['instructor']['course']['findOneCourse']['course']['token']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCourseTokenSchema>({
		resolver: zodResolver(editCourseTokenSchema),
		defaultValues: { courseId, token: token ?? '' }
	})
	const formToken = form.watch('token')

	const { mutate, isPending } =
		api.instructor.course.editCourseToken.useMutation({
			onSuccess: async (data) => {
				toggleEdit()
				form.reset({ courseId, token: data.updatedCourse.token ?? '' })
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	const enrollUrl = `${getBaseUrl()}/enrollment?token=${formToken}`

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Course Invite</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Edit />}
					{isEditing ? 'Cancel' : 'Edit'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent className="flex flex-col gap-2" isEmpty={!formToken}>
					{formToken ? (
						<>
							<div className="flex items-center gap-2">
								<Label
									htmlFor="token"
									className="min-w-24 text-end font-normal"
								>
									Invite Token
								</Label>
								<Input id="token" value={formToken} readOnly />
								<CopyButton
									icon={Copy}
									onCopy={async () => {
										await navigator.clipboard.writeText(formToken)
										toast.success('Token copied to clipboard!')
									}}
								/>
							</div>

							<div className="flex items-center gap-2">
								<Label
									htmlFor="invite-link"
									className="min-w-24 text-end font-normal"
								>
									Invite Link
								</Label>
								<Input id="invite-link" value={enrollUrl} readOnly />
								<CopyButton
									icon={Link}
									onCopy={async () => {
										await navigator.clipboard.writeText(enrollUrl)
										toast.success('Invite link copied to clipboard!')
									}}
								/>
							</div>
						</>
					) : (
						'No token set. Click Edit to add one.'
					)}
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
											<FormLabel className="min-w-24 text-end font-normal text-card-foreground">
												Invite Token
											</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. 'CS101' or leave blank to remove"
													disabled={isPending}
													{...field}
													value={field.value}
												/>
											</FormControl>
											<GenerateButton
												onGenerate={() => {
													const newToken = generateCourseInviteToken()
													form.setValue('token', newToken, {
														shouldDirty: true
													})
												}}
											/>
										</div>
										<FormMessage className="ml-[6.5rem]" />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								size="sm"
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
