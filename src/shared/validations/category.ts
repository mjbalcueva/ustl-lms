import { z } from 'zod'

export const editCourseCategorySchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	categoryId: z.string().min(1, 'Category ID is required').nullable()
})
export type EditCourseCategorySchema = z.infer<typeof editCourseCategorySchema>
