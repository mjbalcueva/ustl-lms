import { generateText } from 'ai'

import { openai } from '@/server/ai'

export default async function Page() {
	const res = await generateText({
		model: openai('gpt-4o-mini'),
		prompt: 'Hello, whats your name?',
		temperature: 0.7,
		maxTokens: 100
	})

	return <pre>{JSON.stringify(res, null, 2)}</pre>
}
