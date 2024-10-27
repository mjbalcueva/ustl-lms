import { z } from 'zod'

export const editCourseCodeSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters')
})

export type EditCourseCodeSchema = z.infer<typeof editCourseCodeSchema>
