import { Status } from '@prisma/client'
import { z } from 'zod'

export const editCourseStatusSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	status: z.nativeEnum(Status)
})

export type EditCourseStatusSchema = z.infer<typeof editCourseStatusSchema>
