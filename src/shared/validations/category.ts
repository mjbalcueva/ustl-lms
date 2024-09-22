import { z } from 'zod'

export const updateCategorySchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	categoryId: z.string().min(1, 'Category ID is required')
})
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>