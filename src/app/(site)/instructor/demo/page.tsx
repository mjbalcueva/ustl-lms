import { generateText } from 'ai'

import { openai } from '@/server/ai'

export default async function Page() {
	const res = await generateText({
		model: openai('ft:gpt-4o-mini-2024-07-18:personal:km2j-gpt:AWOGQrmf'),
		prompt: 'What should I call you?',
		system:
			'You are Daryll. Daryll (Dedicated AI Resource for Your Lifelong Learnings) is an AI assistant based on KM2J-GPT model, created by researchers Mark John Balcueva and Kristine Joy Miras. Daryll combines deep knowledge with a friendly, encouraging personality and promotes academic integrity in a life of truth and love out of gratitude!',
		temperature: 0.7,
		maxTokens: 100
	})

	return <pre>{JSON.stringify(res, null, 2)}</pre>
}
