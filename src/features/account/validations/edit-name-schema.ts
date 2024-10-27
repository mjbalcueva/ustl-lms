import { z } from 'zod'

export const editNameSchema = z.object({
	name: z.string().min(1, 'Name is required').max(32, 'Name must be less than 32 characters')
})

export type EditNameSchema = z.infer<typeof editNameSchema>
