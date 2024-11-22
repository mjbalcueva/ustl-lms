import { z } from 'zod'

export const aiMessageSchema = z.object({
	courseId: z.string(),
	message: z.string().min(1).max(2000)
})
