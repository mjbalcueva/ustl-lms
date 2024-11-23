import { openai } from '@ai-sdk/openai'
import { streamText, type Message } from 'ai'
import { z } from 'zod'

import { type RouterOutputs } from '@/services/trpc/react'

import { formatDate } from '@/core/lib/utils/format-date'
import { getBaseUrl } from '@/core/lib/utils/get-base-url'

export const maxDuration = 30

type ChatPayload = {
	messages: Message[]
	userDetails?: {
		name: string
		id: string
	}
	course: RouterOutputs['course']['findEnrolledCourseDetails']['course']
}

export async function POST(req: Request) {
	const { messages, userDetails, course } = (await req.json()) as ChatPayload

	const result = streamText({
		model: openai('ft:gpt-4o-mini-2024-07-18:personal:km2j-gpt:AWVPZPki'),
		system: `
    You are Daryll. Daryll (Dedicated AI Resource for Your Lifelong Learnings)
    is an AI assistant based on KM2J-GPT model, created by researchers Mark John
    Balcueva and Kristine Joy Miras. Daryll combines deep knowledge with a
    friendly, encouraging personality and promotes academic integrity in a life
    of truth and love out of gratitude!.

    You love to use markdown formatting to enhance readability.
    You also love overexplaining data that is in JSON format using title, content, and a list of items.
    `,
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
			get_student_name: {
				description: "Get the student's name. important for personalizing the conversation.",
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return userDetails?.name ?? 'User'
				}
			},
			get_course_details: {
				description:
					'Get a comprehensive overview of the course including title, description, and key details. This is all about the course. Can be used to help student learn about the course.',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const data = {
						title: course.title,
						description: course.description,
						categories: course.categories.map((c) => c.name),
						chapters: course.chapters.map((c) => ({
							type: c.type,
							title: c.title,
							linkToChapter: `${getBaseUrl()}/course/${course.id}/${c.type.toLowerCase()}/${c.id}`,
							content: c.content,
							studentProgress: c.chapterProgress[0]?.isCompleted
						})),
						resources: course.attachments.map((a) => ({
							name: a.name,
							url: a.url
						}))
					}

					return `${JSON.stringify(data)} \n\n Sample output:
            # [Course Title]
            This course is about [course summary (1-2 paragraphs)].

            ### Modules
            [list of all chapters including the lesson, assessment and assignment. remove things like "lesson 1", "lesson 2", "Quiz 1", "Assignment 1", etc]
            - **[chapter title]** ([chapter type])
              - [Detailed explanation of the chapter content]. Include the link to the chapter.
              - Go to [link to the chapter]`
				}
			},
			list_chapters: {
				description:
					'Get a detailed list of course chapters including title, description, duration, and completion status',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const chapterList = course.chapters.map((chapter, index) => {
						const isCompleted = chapter.chapterProgress[0]?.isCompleted
						const completionStatus = isCompleted ? '✅ Completed' : '⏳ Not completed'

						return `
              ${index + 1}. ${chapter.title}
              Status: ${completionStatus}
              Description: ${chapter.content ?? 'No description available'}
              Position: Chapter ${chapter.position}
              Video URL: ${chapter.videoUrl ?? 'No video available'}`
					})
					return chapterList.join('\n\n')
				}
			},
			get_course_resources: {
				description: 'Get a list of course reference materials',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					if (!course.attachments.length) return 'No reference materials available for this course.'
					return `Course Resources:\n${course.attachments.map((a) => `- ${a.name} (${a.url})`).join('\n')}`
				}
			}
		}
	})

	return result.toDataStreamResponse()
}
