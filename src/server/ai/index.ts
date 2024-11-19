import { createOpenAI } from '@ai-sdk/openai'

import { env } from '@/core/env/server'

export const openai = createOpenAI({
	apiKey: env.OPENAI_API_KEY,
	compatibility: 'strict'
})
