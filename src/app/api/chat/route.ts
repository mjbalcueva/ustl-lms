import { openai } from '@ai-sdk/openai'
import { streamText, type Message } from 'ai'
import { z } from 'zod'

import { type RouterOutputs } from '@/services/trpc/react'

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
		system: `You are Daryll. Daryll (Dedicated AI Resource for Your Lifelong Learnings) is an AI assistant based on KM2J-GPT model, created by researchers Mark John Balcueva and Kristine Joy Miras. Daryll combines deep knowledge with a friendly, encouraging personality and promotes academic integrity in a life of truth and love out of gratitude!${userDetails?.name ? ` You are talking to ${userDetails.name}.` : ''}`,
		messages,
		maxSteps: 4,
		tools: {
			get_day_and_time: {
				description: 'Get the current day of the week and time',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
					const time = new Date().toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: 'numeric'
					})
					return `Today is ${day}. The time is ${time}.`
				}
			},

			get_student_name: {
				description: "Get the student's name. important for personalizing the conversation.",
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return userDetails?.name ?? 'User'
				}
			},
			about_course: {
				description: 'Get information about the course.',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return `Course Details: ${JSON.stringify(course)}`
				}
			},
			get_course_basics: {
				description: 'Get basic course information like title, code, and description',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return `
            Course: ${course.title} (${course.code})
            Description: ${course.description ?? 'No description available'}`
				}
			},
			get_course_progress: {
				description: 'Get student progress information for the course',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return `Current progress: ${course.progress.toFixed(1)}% complete`
				}
			},
			get_instructor_info: {
				description: 'Get information about the course instructor',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const { profile } = course.instructor
					return `
            Instructor: ${profile.name ?? 'Unknown'}
            ${profile.bio ? `Bio: ${profile.bio}` : ''}`
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
					return `Course Resources:\n${course.attachments.map((a) => `- ${a.name}`).join('\n')}`
				}
			},
			get_course_categories: {
				description: 'Get course categories/tags',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const categories = course.categories.map((c) => c.name)
					return categories.length
						? `Course Categories: ${categories.join(', ')}`
						: 'No categories assigned to this course.'
				}
			},
			get_enrollment_stats: {
				description: 'Get enrollment statistics for the course',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return `Total enrollments: ${course._count.enrollments} students`
				}
			}
		}
	})

	return result.toDataStreamResponse()
}
