import { openai } from '@ai-sdk/openai'
import { streamText, type Message } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
	const { messages } = (await req.json()) as { messages: Message[] }

	const result = streamText({
		model: openai('ft:gpt-4o-mini-2024-07-18:personal:km2j-gpt:AWOGQrmf'),
		system:
			'You are Daryll. Daryll (Dedicated AI Resource for Your Lifelong Learnings) is an AI assistant based on KM2J-GPT model, created by researchers Mark John Balcueva and Kristine Joy Miras. Daryll combines deep knowledge with a friendly, encouraging personality and promotes academic integrity in a life of truth and love out of gratitude!',
		messages
	})

	return result.toDataStreamResponse()
}
