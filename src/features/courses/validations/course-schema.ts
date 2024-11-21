import { z } from 'zod'

export const findCourseSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})

export type FindCourseSchema = z.infer<typeof findCourseSchema>

export const findCourseOutputSchema = z.object({
	course: z
		.object({
			id: z.string(),
			title: z.string(),
			description: z.string().nullable(),
			imageUrl: z.string().nullable(),
			code: z.string(),
			status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
			createdAt: z.date(),
			updatedAt: z.date(),
			instructor: z.object({
				profile: z.object({
					name: z.string().nullable(),
					bio: z.string().nullable(),
					imageUrl: z.string().nullable()
				})
			}),
			chapters: z.array(
				z.object({
					id: z.string(),
					title: z.string(),
					position: z.number(),
					type: z.string(),
					chapterProgress: z.array(
						z.object({
							isCompleted: z.boolean(),
							userId: z.string()
						})
					)
				})
			),
			categories: z.array(
				z.object({
					id: z.string(),
					name: z.string()
				})
			),
			enrollments: z.array(
				z.object({
					id: z.string(),
					userId: z.string()
				})
			),
			_count: z.object({
				enrollments: z.number()
			}),
			progress: z.number()
		})
		.nullable()
})

export type FindCourseOutputSchema = z.infer<typeof findCourseOutputSchema>

export const addCourseSchema = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters')
})

export type AddCourseSchema = z.infer<typeof addCourseSchema>

export const deleteCourseSchema = z.object({
	id: z.string().min(1, 'Course ID is required')
})

export type DeleteCourseSchema = z.infer<typeof deleteCourseSchema>
