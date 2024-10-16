import { z } from 'zod'

export const editCourseCategoriesSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	categoryIds: z.array(z.string().min(1, 'Category ID is required'))
})

export type EditCourseCategoriesSchema = z.infer<typeof editCourseCategoriesSchema>
