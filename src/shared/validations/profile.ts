import { z } from 'zod'

export const updateDisplayNameSchema = z.object({
	name: z.string().min(1, 'Name is required').max(32, 'Name must be less than 32 characters')
})

export type UpdateDisplayNameSchema = z.infer<typeof updateDisplayNameSchema>
