'use client'

import { useCallback, useState } from 'react'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Button } from '@/core/components/ui/button'
import { Separator } from '@/core/components/ui/separator'
import { Add, Edit, Info } from '@/core/lib/icons'

import { AttachmentList } from '@/features/chapters/student/components/assignment/chapter-attachment-list'
import { AddChapterSubmissionForm } from '@/features/chapters/student/components/forms/add-chapter-submission-form'
import { EditChapterSubmissionForm } from '@/features/chapters/student/components/forms/edit-chapter-submission-form'

export const AssignmentSubmissionCard = ({
	chapterId
}: {
	chapterId: NonNullable<
		RouterOutputs['student']['chapter']['findOneChapter']['chapter']
	>['chapterId']
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [resetFormFn, setResetFormFn] = useState<() => void>(() => void 0)

	const resetForm = useCallback((fn: () => void) => {
		setResetFormFn(() => fn)
	}, [])

	const utils = api.useUtils()

	const toggleEdit = useCallback(() => {
		setIsEditing((prev) => {
			if (prev) {
				resetFormFn()
				void utils.student.submission.findOneSubmission.invalidate()
			}
			return !prev
		})
	}, [resetFormFn, utils.student.submission.findOneSubmission])

	const { data, isPending } = api.student.submission.findOneSubmission.useQuery(
		{ chapterId },
		{ refetchOnMount: 'always' }
	)

	const hasData = data?.submission !== null

	const handleSubmitSuccess = useCallback(() => {
		setIsEditing(false)
	}, [])

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader className="py-3">
				<CardTitle className="text-lg">Your Submission</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && !hasData && <Add />}
					{!isEditing && hasData && <Edit />}
					{isEditing ? 'Cancel' : hasData ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && isPending && (
				<CardContent className="space-y-3">
					<Separator className="mb-4" />
					<div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
					<div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
					<div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
				</CardContent>
			)}

			{!isEditing && !isPending && !hasData && (
				<CardContent isEmpty>No submission found.</CardContent>
			)}

			{!isEditing && !isPending && hasData && data?.submission && (
				<CardContent>
					<Separator className="mb-4" />
					<div className="space-y-6">
						<ContentViewer value={data.submission.content} />

						{data.submission.attachments.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{data.submission.attachments.map((attachment) => (
									<div
										key={attachment.attachmentId}
										className="min-w-64 flex-1"
									>
										<AttachmentList attachments={[attachment]} />
									</div>
								))}
							</div>
						)}
					</div>
				</CardContent>
			)}

			{isEditing && !hasData && (
				<AddChapterSubmissionForm
					chapterId={chapterId}
					setResetForm={resetForm}
					onSubmitSuccess={handleSubmitSuccess}
				/>
			)}
			{isEditing && hasData && data?.submission && (
				<EditChapterSubmissionForm
					submission={data.submission}
					setResetForm={resetForm}
					onSubmitSuccess={handleSubmitSuccess}
				/>
			)}

			<CardFooter className="flex items-center gap-2 text-muted-foreground">
				<Info className="size-4 shrink-0" />
				<p className="text-sm">
					Submit your work here. Make sure to{' '}
					<span className="underline underline-offset-4">
						follow the instructions
					</span>{' '}
					carefully.
				</p>
			</CardFooter>
		</Card>
	)
}
