import { z } from 'zod'

export const editCourseTitleSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters')
})

export type EditCourseTitleSchema = z.infer<typeof editCourseTitleSchema>
