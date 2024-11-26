import { z } from 'zod'

export const getChapterSubmissionSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapterId: z.string().min(1, 'Chapter ID is required'),
	submissionId: z.string().min(1, 'Submission ID is required')
})

export const submitChapterAssignmentSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapterId: z.string().min(1, 'Chapter ID is required'),
	submissionUrl: z.string().min(1, 'Submission URL is required'),
	fileName: z.string().min(1, 'File name is required')
})

export type SubmitChapterAssignmentSchema = z.infer<typeof submitChapterAssignmentSchema>
