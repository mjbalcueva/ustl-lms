import { z } from 'zod'

export const addCourseCategorySchema = z.object({
	name: z.string().min(1, 'Category name is required')
})

export type AddCourseCategorySchema = z.infer<typeof addCourseCategorySchema>

export const editManyCourseCategoriesSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	categoryIds: z.array(z.string().min(1, 'Category ID is required'))
})

export type EditManyCourseCategoriesSchema = z.infer<typeof editManyCourseCategoriesSchema>
