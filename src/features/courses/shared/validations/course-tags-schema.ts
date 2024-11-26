import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Course Tag Schema
export const addCourseTagSchema = z.object({
	name: z.string().min(1, 'Tag name is required')
})
export type AddCourseTagSchema = z.infer<typeof addCourseTagSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Many Course Tags Schema
export const editManyCourseTagsSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	tagIds: z.array(z.string().min(1, 'Tag ID is required'))
})
export type EditManyCourseTagsSchema = z.infer<typeof editManyCourseTagsSchema>
