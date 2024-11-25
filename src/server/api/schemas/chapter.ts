import { z } from 'zod'

export const chapterSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	position: z.number(),
	videoUrl: z.string().nullable(),
	courseId: z.string(),
	subject: z.string(),
	objectives: z.array(z.string()),
	keyPoints: z.string(),
	resources: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			type: z.string(),
			size: z.string(),
			url: z.string()
		})
	),
	aiMessages: z.array(
		z.object({
			id: z.string(),
			content: z.string(),
			timestamp: z.string(),
			author: z.object({
				name: z.string(),
				avatar: z.string().optional()
			})
		})
	),
	forumMessages: z.array(
		z.object({
			id: z.string(),
			content: z.string(),
			timestamp: z.string(),
			author: z.object({
				name: z.string(),
				avatar: z.string().optional()
			})
		})
	)
})

export const getChapterDetailsSchema = z.object({
	chapterId: z.string(),
	courseId: z.string()
})

export const markChapterCompleteSchema = z.object({
	chapterId: z.string(),
	courseId: z.string()
})
