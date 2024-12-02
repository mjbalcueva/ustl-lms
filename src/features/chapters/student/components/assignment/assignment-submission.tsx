'use client'

import * as React from 'react'

import { type RouterOutputs } from '@/services/trpc/react'

import { Card, CardHeader, CardTitle } from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import { Add } from '@/core/lib/icons'

import { EditChapterSubmissionForm } from '@/features/chapters/student/components/forms/edit-chapter-submission-form'

export const AssignmentSubmission = ({
	chapterId,
	submission
}: {
	chapterId: RouterOutputs['student']['chapter']['findOneChapter']['chapter']['chapterId']
	submission: RouterOutputs['student']['chapter']['findOneChapter']['chapter']['submission']
}) => {
	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader className="py-3">
				<CardTitle className="text-lg">Your Submission</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Add />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			<EditChapterSubmissionForm
				chapterId={chapterId}
				submission={submission}
				isEditing={isEditing}
				toggleEdit={toggleEdit}
			/>
		</Card>
	)
}
