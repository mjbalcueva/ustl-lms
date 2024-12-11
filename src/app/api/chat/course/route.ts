import { openai } from '@ai-sdk/openai'
import { streamText, type Message } from 'ai'
import { z } from 'zod'

import { type RouterOutputs } from '@/services/trpc/react'

import { env } from '@/core/env/server'
import { formatDate } from '@/core/lib/utils/format-date'

export const maxDuration = 30

type ChatPayload = {
	messages: Message[]
	userDetails?: {
		name: string
		id: string
	}
	course: RouterOutputs['student']['course']['findEnrolledCourse']['course']
}

export async function POST(req: Request) {
	const { messages, userDetails, course } = (await req.json()) as ChatPayload

	const result = streamText({
		model: openai(env.MODEL_ID),
		system: `
      COURSE CONTENT (THIS IS YOUR PRIMARY KNOWLEDGE SOURCE):
      Title: ${course.title}
      Description: ${course.description}
      Structure: ${course.chapters?.length} chapters (${course.chapters?.filter((c) => c.type === 'LESSON').length} lessons, ${course.chapters?.filter((c) => c.type === 'ASSESSMENT').length} assessments, ${course.chapters?.filter((c) => c.type === 'ASSIGNMENT').length} assignments)

      STUDENT PROGRESS:
      ${course.chapters
				?.map(
					(chapter) => `
      ${chapter.type} ${chapter.position}: ${chapter.title}
      Status: ${chapter.chapterProgress[0]?.isCompleted ? '✅ Completed' : '⏳ Not completed'}
      ${chapter.type === 'LESSON' ? `Content: ${chapter.content}` : ''}
      `
				)
				.join('\n')}

      You are an AI tutor named DARYLL (Dedicated AI Resource for Your Lifelong Learnings), an advanced AI assistant based on the KM2J-GPT model created by researchers Mark John Balcueva and Kristine Joy Miras. You combine deep knowledge with a friendly, encouraging personality and promote academic integrity.
      
      STRICT RULES:
      1. You can discuss your identity as Daryll and general AI capabilities
      2. For course-specific content, primarily use the course information, lesson contents, and tools provided
      3. Use the Socratic method to guide students to answers rather than giving them directly
      4. Always check course context using get_course_details before responding
      5. Maintain academic integrity while being supportive and encouraging
      6. Use markdown formatting for better readability
      7. Break down complex topics into manageable chunks
      8. Tailor responses based on student's progress in the course

      Current Course Status:
      - Student Name: ${userDetails?.name ?? 'User'}
      - Completed Chapters: ${course.chapters?.filter((c) => c.chapterProgress[0]?.isCompleted).length ?? 0}/${course.chapters?.length ?? 0}
      - Next Incomplete Chapter: ${course.chapters?.find((c) => !c.chapterProgress[0]?.isCompleted)?.title ?? 'All chapters completed'}
      ${course.attachments?.length ? `\nAvailable Resources:\n${course.attachments.map((a) => `- ${a.name}`).join('\n')}` : ''}

      Teaching Methods:
      1. Provide real-world examples and analogies
      2. Adapt teaching style based on student responses
      3. Encourage critical thinking
      4. Use spaced repetition for reinforcement
      5. Give constructive feedback with positive reinforcement`,
		messages,
		maxSteps: 4,
		tools: {
			get_current_datetime: {
				description: 'Gets the current date and time',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const date = formatDate(new Date())
					const time = new Date().toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: 'numeric'
					})
					return `Today is ${date}. The time is ${time}.`
				}
			},
			get_chapter_details: {
				description:
					'Get detailed information about specific chapters including learning objectives and prerequisites',
				parameters: z.object({
					chapterPosition: z.number().optional()
				}),
				execute: async ({ chapterPosition }): Promise<string> => {
					const chapters = course.chapters
					const chapter = chapterPosition
						? chapters?.find((c) => c.position === chapterPosition)
						: chapters?.[0]

					if (!chapter) return 'Chapter not found'

					const nextChapter = chapters?.find(
						(c) => c.position === chapter.position + 1
					)
					const prevChapter = chapters?.find(
						(c) => c.position === chapter.position - 1
					)

					return JSON.stringify({
						current: {
							title: chapter.title,
							type: chapter.type,
							content: chapter.content,
							videoUrl: chapter.videoUrl,
							isCompleted: chapter.chapterProgress[0]?.isCompleted
						},
						navigation: {
							next: nextChapter
								? {
										title: nextChapter.title,
										type: nextChapter.type
									}
								: null,
							previous: prevChapter
								? {
										title: prevChapter.title,
										type: prevChapter.type
									}
								: null
						}
					})
				}
			},
			get_course_resources: {
				description:
					'Get a comprehensive list of course materials, references, and supplementary resources',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					if (!course.attachments?.length)
						return 'No reference materials available for this course.'

					const resourcesByType = course.attachments.reduce(
						(acc, curr) => {
							const fileType =
								curr.name.split('.').pop()?.toUpperCase() ?? 'OTHER'
							return {
								...acc,
								[fileType]: [
									...(acc[fileType] ?? []),
									{ name: curr.name, url: curr.url }
								]
							}
						},
						{} as Record<string, { name: string; url: string }[]>
					)

					return JSON.stringify({
						summary: `${course.attachments.length} resources available`,
						resourcesByType
					})
				}
			}
		}
	})

	return result.toDataStreamResponse()
}
