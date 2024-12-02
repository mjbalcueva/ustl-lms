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
		setResetFormFn(() => () => fn())
	}, [])

	const toggleEdit = () => {
		setIsEditing((prev) => {
			if (prev) resetFormFn()
			return !prev
		})
	}

	const { data, isPending } = api.student.submission.findOneSubmission.useQuery(
		{ chapterId },
		{
			refetchOnMount: true,
			refetchOnWindowFocus: true,
			staleTime: 1000
		}
	)

	const hasData = data?.submission !== null

	const handleSubmitSuccess = () => {
		setIsEditing(false)
	}

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

			{!isEditing && !isPending && hasData && (
				<CardContent>
					<Separator className="mb-4" />
					<ContentViewer value={data?.submission?.content} />
				</CardContent>
			)}

			{isEditing && !hasData && (
				<AddChapterSubmissionForm
					chapterId={chapterId}
					setResetForm={resetForm}
					onSubmitSuccess={handleSubmitSuccess}
				/>
			)}
			{isEditing && hasData && (
				<EditChapterSubmissionForm
					submission={data!.submission}
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
