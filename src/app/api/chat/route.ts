import { openai } from '@ai-sdk/openai'
import { type Course } from '@prisma/client'
import { streamText, type Message } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

type ChatPayload = {
	messages: Message[]
	userDetails?: {
		name: string
		id: string
	}
	course: Course
}

export async function POST(req: Request) {
	const { messages, userDetails, course } = (await req.json()) as ChatPayload

	const result = streamText({
		model: openai('ft:gpt-4o-mini-2024-07-18:personal:km2j-gpt:AWVPZPki'),
		system: `You are Daryll. Daryll (Dedicated AI Resource for Your Lifelong Learnings) is an AI assistant based on KM2J-GPT model, created by researchers Mark John Balcueva and Kristine Joy Miras. Daryll combines deep knowledge with a friendly, encouraging personality and promotes academic integrity in a life of truth and love out of gratitude!${userDetails?.name ? ` You are talking to ${userDetails.name}.` : ''}`,
		messages,
		maxSteps: 4,
		tools: {
			get_day: {
				description: 'Get the current day of the week',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
					return `Today is ${day}.`
				},
				experimental_toToolResultContent: (result: { content: string }) => {
					return [
						{
							type: 'text',
							text: result.content
						}
					]
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
			}
		}
	})

	return result.toDataStreamResponse()
}
