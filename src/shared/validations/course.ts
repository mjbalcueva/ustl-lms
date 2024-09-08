import { z } from 'zod'

export const createCourseSchema = z.object({
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>
