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
	chapter: RouterOutputs['student']['chapter']['findOneChapter']['chapter']
}

export async function POST(req: Request) {
	const { messages, userDetails, chapter } = (await req.json()) as ChatPayload

	const result = streamText({
		model: openai(env.MODEL_ID),
		system: `
      ${chapter?.type} CONTENT (THIS IS YOUR ONLY KNOWLEDGE FOR EDUCATIONAL CONTENT):
      ${chapter?.content}

      You are an AI tutor named DARYLL (Dedicated AI Resource for Your Lifelong Learnings), an advanced AI assistant based on the KM2J-GPT model created by researchers Mark John Balcueva and Kristine Joy Miras. You combine deep knowledge with a friendly, encouraging personality and promote academic integrity.
      
      STRICT RULES:
      1. You can discuss your identity as Daryll and general AI capabilities
      2. For educational content, you have NO knowledge outside of the ${chapter?.type} content above
      3. If asked about educational topics not in the ${chapter?.type} content, simply respond:
         "I apologize, but I can only discuss topics covered in this ${chapter?.type}. Anything beyond that is outside my knowledge."
      4. Never make assumptions or add information beyond the ${chapter?.type} content for educational topics
      5. Always verify educational responses against the ${chapter?.type} content

      Current ${chapter?.type}: ${chapter?.title} (position ${chapter?.position})
      Status: ${chapter?.chapterProgress[0]?.isCompleted ? '✅ Completed' : '⏳ Not completed'}
      ${chapter?.attachments.length ? `Available Resources:\n${chapter.attachments.map((a) => `- ${a.name}`).join('\n')}` : ''}

      Use markdown formatting for better readability.`,
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
				description:
					"Get the student's name. important for personalizing the conversation.",
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					return userDetails?.name ?? 'User'
				}
			},
			get_chapter_information: {
				description:
					'Get metadata about the chapter including type, title, completion status, and resources.',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const data = {
						type: chapter?.type,
						title: chapter?.title,
						isCompleted: chapter?.chapterProgress[0]?.isCompleted,
						resources: chapter?.attachments.map((a) => ({
							name: a.name,
							url: a.url
						}))
					}

					return `
            Chapter Information:
            - Type: ${data.type}
            - Title: ${data.title}
            - Completion Status: ${data.isCompleted ? '✅ Completed' : '⏳ Not completed'}
            ${data.resources?.length ? `\nChapter Resources:\n${data.resources.map((r) => `- ${r.name}`).join('\n')}` : ''}`
				}
			},
			listProgress: {
				description: 'Get the completion status of the chapter',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const isCompleted = chapter?.chapterProgress[0]?.isCompleted
					const completionStatus = isCompleted
						? '✅ Completed'
						: '⏳ Not completed'

					return `Chapter Progress:\n${chapter?.title}: ${completionStatus}`
				}
			},
			listResources: {
				description:
					'Get a list of chapter reference/resource/attachment materials',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					if (!chapter?.attachments.length)
						return 'No reference materials available for this chapter.'
					return `Chapter Resources:\n${chapter.attachments.map((a) => `- ${a.name} (${a.url})`).join('\n')}`
				}
			},
			summarizeContent: {
				description:
					'Generate a concise summary of the chapter content with key points',
				parameters: z.object({
					format: z.enum(['bullet', 'paragraph']).optional().default('bullet')
				}),
				execute: async ({ format }): Promise<string> => {
					if (!chapter?.content) return 'No content available to summarize.'

					const title = `Summary of "${chapter.title}"\n\n`
					const content =
						chapter.content.length > 500
							? chapter.content.slice(0, 500) + '...'
							: chapter.content

					if (format === 'bullet') {
						return `
              ${title}Key Points:
              • ${content.split('. ').join('\n• ')}`
					}

					return `${title}${content}`
				}
			},
			explainConcept: {
				description:
					'Provide guidance on understanding a specific concept from the chapter',
				parameters: z.object({
					concept: z.string()
				}),
				execute: async ({ concept }): Promise<string> => {
					if (!chapter?.content)
						return 'No content available to explain concepts.'

					return `
            To understand "${concept}" in the context of this chapter:

            1. First, carefully read the section where this concept is introduced
            2. Take notes on the key points and definitions
            3. Look for any examples provided in the chapter
            4. Try to explain the concept in your own words
            5. If available, review any related attachments or resources

            Would you like me to help you find specific sections in the chapter where this concept is discussed?`
				}
			},
			createStudyPlan: {
				description: 'Generate a structured study plan for the chapter',
				parameters: z.object({
					timeAvailable: z.string().optional().default('1 hour')
				}),
				execute: async ({ timeAvailable }): Promise<string> => {
					if (!chapter?.content)
						return 'No content available to create a study plan.'

					const isLongSession = (timeAvailable as string)
						.toLowerCase()
						.includes('hour')

					return `
            Study Plan for "${chapter.title}" (${timeAvailable}):

            1. Initial Reading (${isLongSession ? '20 minutes' : '5 minutes'})
             - Read through the chapter content carefully
             - Mark any concepts you find challenging

            2. Active Learning (${isLongSession ? '20 minutes' : '5 minutes'})
             - Take notes on key points
             - Create your own examples
             - Write down questions

            3. Review (${isLongSession ? '15 minutes' : '5 minutes'})
             - Go through your notes
             - Answer your questions
             - Review any attached resources

            4. Self-Assessment (${isLongSession ? '5 minutes' : '5 minutes'})
             - Test your understanding
             - Identify areas needing more focus

            Remember to take short breaks between sections to maintain focus!`
				}
			},
			checkProgress: {
				description: 'Check your learning progress in this chapter',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const isCompleted = chapter?.chapterProgress[0]?.isCompleted
					const status = isCompleted ? '✅ Completed' : '⏳ In Progress'

					return `
            Chapter Progress Check:

            Status: ${status}
            Title: ${chapter?.title}
            Type: ${chapter?.type}

            Next Steps:
            ${
							isCompleted
								? '- Review the material periodically to maintain knowledge\n- Help others who are studying this chapter\n- Move on to the next chapter'
								: '- Continue working through the chapter content\n- Use the study tools available\n- Ask questions about anything unclear'
						}

            ${
							chapter?.attachments.length
								? "\nDon't forget to check out the available resources for this chapter!"
								: ''
						}`
				}
			}
		}
	})

	return result.toDataStreamResponse()
}
