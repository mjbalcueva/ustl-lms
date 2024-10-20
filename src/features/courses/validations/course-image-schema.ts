import { z } from 'zod'

export const editCourseImageSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	imageUrl: z.string().nullable()
})

export type EditCourseImageSchema = z.infer<typeof editCourseImageSchema>
