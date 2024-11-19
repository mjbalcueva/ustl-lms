import { generateText } from 'ai'
import { z } from 'zod'

import { openai } from '@/server/ai'

export default async function Page() {
	const res = await generateText({
		model: openai('gpt-4o-mini'),
		prompt: 'What should I call you?',
		temperature: 0.7,
		maxTokens: 100,
		tools: {
			get_day: {
				description: 'Get the current day of the week',
				parameters: z.object({}),
				execute: async () => {
					return new Date().toLocaleDateString('en-US', { weekday: 'long' })
				}
			},
			get_name: {
				description: 'Get the AI assistant name and introduction',
				parameters: z.object({}),
				execute: async () => {
					return "Hello there! I'm DARYLL, a Dedicated AI Resource for Your Lifelong Learnings. Think of me as your personal study buddy, problem-solver, and academic genius—minus the need for coffee breaks!"
				}
			}
		}
	})

	return <pre>{JSON.stringify(res, null, 2)}</pre>
}
