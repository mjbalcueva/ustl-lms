import { openai } from '@ai-sdk/openai'
import { streamText, type Message } from 'ai'
import { z } from 'zod'

import { type RouterOutputs } from '@/services/trpc/react'

import { env } from '@/core/env/server'
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
		model: openai(env.MODEL_ID),
		system: `
      You are Daryll. Daryll (Dedicated AI Resource for Your Lifelong Learnings)
      is an AI assistant based on KM2J-GPT model, created by researchers Mark John
      Balcueva and Kristine Joy Miras. Daryll combines deep knowledge with a
      friendly, encouraging personality and promotes academic integrity in a life
      of truth and love out of gratitude!

      As an educational AI assistant, you:
      1. Use the Socratic method to guide students to answers rather than giving them directly
      2. Provide real-world examples and analogies to explain complex concepts
      3. Break down complex topics into manageable chunks
      4. Adapt your teaching style based on student responses
      5. Encourage critical thinking and deeper understanding
      6. Provide constructive feedback and positive reinforcement
      7. Use spaced repetition to reinforce learning

      You love to use markdown formatting to enhance readability.
      You also love overexplaining data that is in JSON format using title, content, and a list of items.
      
      Always maintain an encouraging and supportive tone while ensuring academic rigor.`,
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
			get_student_profile: {
				description: 'Get comprehensive student information including name and progress',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const completedChapters = course.chapters.filter(
						(c) => c.chapterProgress[0]?.isCompleted
					).length
					const totalChapters = course.chapters.length
					const progressPercentage = Math.round((completedChapters / totalChapters) * 100)

					return JSON.stringify({
						name: userDetails?.name ?? 'User',
						progress: {
							completedChapters,
							totalChapters,
							progressPercentage,
							nextChapter: course.chapters.find((c) => !c.chapterProgress[0]?.isCompleted)?.title
						}
					})
				}
			},
			get_course_details: {
				description:
					'Get a comprehensive overview of the course including title, description, learning objectives, and key details',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const data = {
						title: course.title,
						description: course.description,
						categories: course.categories.map((c) => c.name),
						structure: {
							totalChapters: course.chapters.length,
							lessonCount: course.chapters.filter((c) => c.type === 'LESSON').length,
							assessmentCount: course.chapters.filter((c) => c.type === 'ASSESSMENT').length,
							assignmentCount: course.chapters.filter((c) => c.type === 'ASSIGNMENT').length
						},
						chapters: course.chapters.map((c) => ({
							type: c.type,
							title: c.title,
							linkToChapter: `${getBaseUrl()}/course/${course.id}/${c.type.toLowerCase()}/${c.id}`,
							content: c.content,
							studentProgress: c.chapterProgress[0]?.isCompleted,
							position: c.position
						})),
						resources: course.attachments.map((a) => ({
							name: a.name,
							url: a.url
						}))
					}

					return `${JSON.stringify(data)} \n\n Sample output:
            # [Course Title]
            This course is about [course summary (1-2 paragraphs)].

            ## Course Structure
            - Total Chapters: [number]
            - Lessons: [number]
            - Assessments: [number]
            - Assignments: [number]

            ## Learning Path
            [Organized list of chapters showing clear progression]
            - **[chapter title]** ([chapter type])
              - [Detailed explanation with learning objectives]
              - Access at: [link to chapter]

            ## Additional Resources
            [List of supplementary materials]`
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
						? chapters.find((c) => c.position === chapterPosition)
						: chapters[0]

					if (!chapter) return 'Chapter not found'

					const nextChapter = chapters.find((c) => c.position === chapter.position + 1)
					const prevChapter = chapters.find((c) => c.position === chapter.position - 1)

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
			get_learning_progress: {
				description:
					'Get detailed analysis of student learning progress including strengths and areas for improvement',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const chapters = course.chapters
					const progress = chapters.map((c) => ({
						title: c.title,
						type: c.type,
						isCompleted: c.chapterProgress[0]?.isCompleted,
						completedAt: c.chapterProgress[0]?.updatedAt
					}))

					const completedByType = {
						lessons: progress.filter((p) => p.type === 'LESSON' && p.isCompleted).length,
						assessments: progress.filter((p) => p.type === 'ASSESSMENT' && p.isCompleted).length,
						assignments: progress.filter((p) => p.type === 'ASSIGNMENT' && p.isCompleted).length
					}

					return JSON.stringify({
						overview: {
							totalProgress: `${Math.round(
								(progress.filter((p) => p.isCompleted).length / progress.length) * 100
							)}%`,
							completedByType
						},
						nextSteps: progress
							.filter((p) => !p.isCompleted)
							.map((p) => `${p.title} (${p.type})`)
							.slice(0, 3),
						recentActivity: progress
							.filter((p) => p.isCompleted && p.completedAt)
							.sort(
								(a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
							)
							.slice(0, 5)
					})
				}
			},
			get_course_resources: {
				description:
					'Get a comprehensive list of course materials, references, and supplementary resources',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					if (!course.attachments.length) return 'No reference materials available for this course.'

					const resourcesByType = course.attachments.reduce(
						(acc, curr) => {
							const fileType = curr.name.split('.').pop()?.toUpperCase() ?? 'OTHER'
							return {
								...acc,
								[fileType]: [...(acc[fileType] ?? []), { name: curr.name, url: curr.url }]
							}
						},
						{} as Record<string, { name: string; url: string }[]>
					)

					return JSON.stringify({
						summary: `${course.attachments.length} resources available`,
						resourcesByType
					})
				}
			},
			suggest_next_steps: {
				description: 'Provide personalized learning recommendations based on current progress',
				parameters: z.object({}),
				execute: async (): Promise<string> => {
					const uncompletedChapters = course.chapters
						.filter((c) => !c.chapterProgress[0]?.isCompleted)
						.map((c) => ({
							title: c.title,
							type: c.type,
							position: c.position
						}))

					const nextChapter = uncompletedChapters[0]
					const upcomingChapters = uncompletedChapters.slice(1, 4)

					return JSON.stringify({
						immediate: nextChapter
							? {
									action: `Complete ${nextChapter.title}`,
									type: nextChapter.type,
									position: nextChapter.position
								}
							: null,
						upcoming: upcomingChapters,
						recommendation: `Focus on completing ${nextChapter?.title} next, followed by the upcoming chapters in sequence for optimal learning progression.`
					})
				}
			}
		}
	})

	return result.toDataStreamResponse()
}
