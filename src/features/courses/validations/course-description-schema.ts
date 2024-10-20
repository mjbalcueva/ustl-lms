import { z } from 'zod'

export const editCourseDescriptionSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	description: z.string().max(1024, 'Description must be less than 1024 characters').nullable()
})

export type EditCourseDescriptionSchema = z.infer<typeof editCourseDescriptionSchema>
